use anchor_lang::prelude::*;

#[error_code]
pub enum GameyaError {
    #[msg("Circle needs at least 2 members.")]
    TooFewMembers,
    #[msg("Invalid contribution amount.")]
    InvalidAmount,
    #[msg("Circle is not open for new members.")]
    NotOpen,
    #[msg("Circle is already full.")]
    CircleFull,
    #[msg("Circle is not active yet.")]
    NotActive,
    #[msg("You have already paid for this round.")]
    AlreadyPaid,
    #[msg("The deadline for this round has passed.")]
    DeadlinePassed,
    #[msg("It is not your turn to claim the payout.")]
    NotYourTurn,
    #[msg("Waiting for all members to pay before payout.")]
    WaitingForPayments,
    #[msg("You have already claimed your payout.")]
    AlreadyClaimed,
    #[msg("Circle is not completed yet.")]
    NotCompleted,
    #[msg("You don't have any deposit to withdraw.")]
    NoDeposit,
}
