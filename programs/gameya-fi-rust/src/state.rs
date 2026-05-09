use anchor_lang::prelude::*;

#[account]
pub struct UserReputation {
    pub user: Pubkey,
    pub score: u32,
    pub completed_circles: u32,
    pub defaults_count: u32,
}

#[account]
pub struct Circle {
    pub creator: Pubkey,
    pub id: u64,
    pub mint: Pubkey,
    pub vault: Pubkey,
    pub contribution_amount: u64,
    pub security_deposit: u64,
    pub max_members: u8,
    pub current_members: u8,
    pub current_round: u8,
    pub round_duration: i64,
    pub round_deadline: i64,
    pub status: u8,
    pub vault_bump: u8,
    pub round_payments_count: u8,
}

#[account]
pub struct CircleMember {
    pub user: Pubkey,
    pub payout_order: u8,
    pub deposit_locked: u64,
    pub paid_rounds: u8,
    pub received_payout: bool,
    pub defaulted: bool,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
#[borsh(use_discriminant = true)]
pub enum CircleStatus {
    Open = 0,
    Active = 1,
    Completed = 2,
}
