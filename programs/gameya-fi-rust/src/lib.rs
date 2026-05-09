pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};

pub use constants::*;
pub use error::*;
pub use instructions::*;
pub use state::*;

declare_id!("534KaupWbMj7brydEXfZVGsYoSiDCwxQEbJCyQsrMoLN");

#[program]
pub mod gameya_fi_rust {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        instructions::initialize::handler(ctx)
    }

    /// 1. Initialize User Reputation
    pub fn init_reputation(ctx: Context<InitReputation>) -> Result<()> {
        let reputation = &mut ctx.accounts.user_reputation;
        reputation.user = ctx.accounts.user.key();
        reputation.score = 100; // Start with a base score of 100
        reputation.completed_circles = 0;
        reputation.defaults_count = 0;
        Ok(())
    }

    /// 2. Create a new Circle
    pub fn create_circle(
        ctx: Context<CreateCircle>,
        circle_id: u64,
        contribution_amount: u64,
        security_deposit: u64,
        max_members: u8,
        round_duration: i64,
    ) -> Result<()> {
        require!(max_members >= 2, GameyaError::TooFewMembers);
        require!(contribution_amount > 0, GameyaError::InvalidAmount);

        let circle = &mut ctx.accounts.circle;
        circle.creator = ctx.accounts.creator.key();
        circle.id = circle_id;
        circle.mint = ctx.accounts.mint.key();
        circle.vault = ctx.accounts.vault.key();
        circle.contribution_amount = contribution_amount;
        circle.security_deposit = security_deposit;
        circle.max_members = max_members;
        circle.current_members = 0;
        circle.current_round = 0;
        circle.round_duration = round_duration;
        circle.round_deadline = 0; 
        circle.status = CircleStatus::Open as u8;
        circle.round_payments_count = 0;
        circle.vault_bump = ctx.bumps.vault;

        Ok(())
    }

    /// 3. Join an Open Circle
    pub fn join_circle(ctx: Context<JoinCircle>) -> Result<()> {
        let circle = &mut ctx.accounts.circle;
        require!(circle.status == CircleStatus::Open as u8, GameyaError::NotOpen);
        require!(circle.current_members < circle.max_members, GameyaError::CircleFull);

        // Transfer Security Deposit from user to vault
        let cpi_accounts = Transfer {
            from: ctx.accounts.user_token_account.to_account_info(),
            to: ctx.accounts.vault.to_account_info(),
            authority: ctx.accounts.user.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        token::transfer(
            CpiContext::new(cpi_program.key(), cpi_accounts),
            circle.security_deposit,
        )?;

        // Initialize Member Account
        let member = &mut ctx.accounts.circle_member;
        member.user = ctx.accounts.user.key();
        member.payout_order = circle.current_members;
        member.deposit_locked = circle.security_deposit;
        member.paid_rounds = 0;
        member.received_payout = false;
        member.defaulted = false;

        circle.current_members += 1;

        // Auto-start circle if full
        if circle.current_members == circle.max_members {
            circle.status = CircleStatus::Active as u8;
            circle.round_deadline = Clock::get()?.unix_timestamp + circle.round_duration;
        }

        Ok(())
    }

    /// 4. Pay Round Contribution
    pub fn pay_round(ctx: Context<PayRound>) -> Result<()> {
        let circle = &mut ctx.accounts.circle;
        let member = &mut ctx.accounts.circle_member;
        let reputation = &mut ctx.accounts.user_reputation;

        require!(circle.status == CircleStatus::Active as u8, GameyaError::NotActive);
        require!(member.paid_rounds == circle.current_round, GameyaError::AlreadyPaid);
        require!(Clock::get()?.unix_timestamp <= circle.round_deadline, GameyaError::DeadlinePassed);

        // Transfer Contribution to vault
        let cpi_accounts = Transfer {
            from: ctx.accounts.user_token_account.to_account_info(),
            to: ctx.accounts.vault.to_account_info(),
            authority: ctx.accounts.user.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        token::transfer(
            CpiContext::new(cpi_program.key(), cpi_accounts),
            circle.contribution_amount,
        )?;

        member.paid_rounds += 1;
        circle.round_payments_count += 1;
        
        reputation.score = reputation.score.saturating_add(2);

        Ok(())
    }

    /// 5. Claim Payout (Auto-advances round)
    pub fn claim_payout(ctx: Context<ClaimPayout>) -> Result<()> {
        let circle = &mut ctx.accounts.circle;
        let member = &mut ctx.accounts.circle_member;
        let reputation = &mut ctx.accounts.user_reputation;

        require!(circle.status == CircleStatus::Active as u8, GameyaError::NotActive);
        require!(member.payout_order == circle.current_round, GameyaError::NotYourTurn);
        require!(circle.round_payments_count == circle.max_members, GameyaError::WaitingForPayments);
        require!(!member.received_payout, GameyaError::AlreadyClaimed);

        let payout_amount = circle.contribution_amount * (circle.max_members as u64);

        let seeds = &[
            b"vault".as_ref(),
            circle.to_account_info().key.as_ref(),
            &[circle.vault_bump],
        ];
        let signer = &[&seeds[..]];

        let cpi_accounts = Transfer {
            from: ctx.accounts.vault.to_account_info(),
            to: ctx.accounts.user_token_account.to_account_info(),
            authority: ctx.accounts.vault.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        token::transfer(
            CpiContext::new_with_signer(cpi_program.key(), cpi_accounts, signer),
            payout_amount,
        )?;

        member.received_payout = true;
        reputation.score = reputation.score.saturating_add(5);

        if circle.current_round + 1 == circle.max_members {
            circle.status = CircleStatus::Completed as u8;
            reputation.completed_circles += 1;
        } else {
            circle.current_round += 1;
            circle.round_payments_count = 0; 
            circle.round_deadline = Clock::get()?.unix_timestamp + circle.round_duration;
        }

        Ok(())
    }

    /// 6. Withdraw Deposit
    pub fn withdraw_deposit(ctx: Context<WithdrawDeposit>) -> Result<()> {
        let circle = &mut ctx.accounts.circle;
        let member = &mut ctx.accounts.circle_member;

        require!(circle.status == CircleStatus::Completed as u8, GameyaError::NotCompleted);
        require!(member.deposit_locked > 0, GameyaError::NoDeposit);

        let amount_to_return = member.deposit_locked;
        member.deposit_locked = 0;

        let seeds = &[
            b"vault".as_ref(),
            circle.to_account_info().key.as_ref(),
            &[circle.vault_bump],
        ];
        let signer = &[&seeds[..]];

        let cpi_accounts = Transfer {
            from: ctx.accounts.vault.to_account_info(),
            to: ctx.accounts.user_token_account.to_account_info(),
            authority: ctx.accounts.vault.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        token::transfer(
            CpiContext::new_with_signer(cpi_program.key(), cpi_accounts, signer),
            amount_to_return,
        )?;

        Ok(())
    }
}

// ---------------------------------------------------------
// ACCOUNTS & CONTEXTS
// ---------------------------------------------------------

#[derive(Accounts)]
pub struct InitReputation<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(
        init,
        payer = user,
        space = 8 + 32 + 4 + 4 + 4,
        seeds = [b"reputation", user.key().as_ref()],
        bump
    )]
    pub user_reputation: Account<'info, UserReputation>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(circle_id: u64)]
pub struct CreateCircle<'info> {
    #[account(mut)]
    pub creator: Signer<'info>,
    #[account(
        init,
        payer = creator,
        space = 8 + 32 + 8 + 32 + 32 + 8 + 8 + 1 + 1 + 1 + 8 + 8 + 1 + 1 + 1,
        seeds = [b"circle", creator.key().as_ref(), &circle_id.to_le_bytes()],
        bump
    )]
    pub circle: Account<'info, Circle>,
    pub mint: Account<'info, Mint>,
    #[account(
        init,
        payer = creator,
        token::mint = mint,
        token::authority = vault,
        seeds = [b"vault", circle.key().as_ref()],
        bump
    )]
    pub vault: Account<'info, TokenAccount>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct JoinCircle<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(mut)]
    pub circle: Account<'info, Circle>,
    #[account(
        init,
        payer = user,
        space = 8 + 32 + 1 + 8 + 1 + 1 + 1,
        seeds = [b"member", circle.key().as_ref(), user.key().as_ref()],
        bump
    )]
    pub circle_member: Account<'info, CircleMember>,
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,
    #[account(mut, seeds = [b"vault", circle.key().as_ref()], bump = circle.vault_bump)]
    pub vault: Account<'info, TokenAccount>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct PayRound<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(mut)]
    pub circle: Account<'info, Circle>,
    #[account(mut, seeds = [b"member", circle.key().as_ref(), user.key().as_ref()], bump)]
    pub circle_member: Account<'info, CircleMember>,
    #[account(mut, seeds = [b"reputation", user.key().as_ref()], bump)]
    pub user_reputation: Account<'info, UserReputation>,
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,
    #[account(mut, seeds = [b"vault", circle.key().as_ref()], bump = circle.vault_bump)]
    pub vault: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct ClaimPayout<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(mut)]
    pub circle: Account<'info, Circle>,
    #[account(mut, seeds = [b"member", circle.key().as_ref(), user.key().as_ref()], bump)]
    pub circle_member: Account<'info, CircleMember>,
    #[account(mut, seeds = [b"reputation", user.key().as_ref()], bump)]
    pub user_reputation: Account<'info, UserReputation>,
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,
    #[account(mut, seeds = [b"vault", circle.key().as_ref()], bump = circle.vault_bump)]
    pub vault: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct WithdrawDeposit<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(mut)]
    pub circle: Account<'info, Circle>,
    #[account(mut, seeds = [b"member", circle.key().as_ref(), user.key().as_ref()], bump)]
    pub circle_member: Account<'info, CircleMember>,
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,
    #[account(mut, seeds = [b"vault", circle.key().as_ref()], bump = circle.vault_bump)]
    pub vault: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
}
