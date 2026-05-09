import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Workspace } from "../target/types/workspace";
import { expect } from "chai";
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  MINT_SIZE,
  createInitializeMintInstruction,
  createMintToInstruction,
  createAssociatedTokenAccountInstruction,
  getMinimumBalanceForRentExemptMint,
  getAssociatedTokenAddress,
  getAccount,
} from "@solana/spl-token";
import {
  PublicKey,
  SystemProgram,
  Transaction,
  Keypair,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";

describe("GameyaFi ROSCA", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.Workspace as Program<Workspace>;

  // Keypairs
  let authority: Keypair;
  let creator: Keypair;
  let member2: Keypair;
  let member3: Keypair;

  // USDC mock mint
  let usdcMint: Keypair;

  // PDAs
  let globalStatePDA: PublicKey;
  let circlePDA: PublicKey;
  let circleVault: PublicKey;

  // Token accounts
  let creatorATA: PublicKey;
  let member2ATA: PublicKey;
  let member3ATA: PublicKey;

  const CONTRIBUTION = new BN(1_000_000); // 1 USDC
  const SECURITY_DEPOSIT = new BN(5_000_000); // 5 USDC
  const MAX_MEMBERS = 2;
  const ROUND_DURATION = new BN(60);

  async function airdropAndConfirm(pubkey: PublicKey, amount: number) {
    const sig = await provider.connection.requestAirdrop(pubkey, amount);
    await provider.connection.confirmTransaction(sig, "confirmed");
  }

  async function createMintAndATAs() {
    usdcMint = Keypair.generate();
    const lamports = await getMinimumBalanceForRentExemptMint(
      provider.connection
    );

    const tx = new Transaction();
    tx.add(
      SystemProgram.createAccount({
        fromPubkey: authority.publicKey,
        newAccountPubkey: usdcMint.publicKey,
        space: MINT_SIZE,
        lamports,
        programId: TOKEN_PROGRAM_ID,
      }),
      createInitializeMintInstruction(
        usdcMint.publicKey,
        6,
        authority.publicKey,
        null
      )
    );
    await provider.sendAndConfirm(tx, [authority, usdcMint]);

    // Create ATAs
    creatorATA = await getAssociatedTokenAddress(
      usdcMint.publicKey,
      creator.publicKey
    );
    member2ATA = await getAssociatedTokenAddress(
      usdcMint.publicKey,
      member2.publicKey
    );
    member3ATA = await getAssociatedTokenAddress(
      usdcMint.publicKey,
      member3.publicKey
    );

    const tx2 = new Transaction();
    tx2.add(
      createAssociatedTokenAccountInstruction(
        authority.publicKey,
        creatorATA,
        creator.publicKey,
        usdcMint.publicKey
      ),
      createAssociatedTokenAccountInstruction(
        authority.publicKey,
        member2ATA,
        member2.publicKey,
        usdcMint.publicKey
      ),
      createAssociatedTokenAccountInstruction(
        authority.publicKey,
        member3ATA,
        member3.publicKey,
        usdcMint.publicKey
      )
    );
    await provider.sendAndConfirm(tx2, [authority]);

    // Mint USDC to all participants
    const mintAmount = 100_000_000; // 100 USDC
    const tx3 = new Transaction();
    tx3.add(
      createMintToInstruction(
        usdcMint.publicKey,
        creatorATA,
        authority.publicKey,
        mintAmount
      ),
      createMintToInstruction(
        usdcMint.publicKey,
        member2ATA,
        authority.publicKey,
        mintAmount
      ),
      createMintToInstruction(
        usdcMint.publicKey,
        member3ATA,
        authority.publicKey,
        mintAmount
      )
    );
    await provider.sendAndConfirm(tx3, [authority]);
  }

  before(async () => {
    authority = Keypair.generate();
    creator = Keypair.generate();
    member2 = Keypair.generate();
    member3 = Keypair.generate();

    await airdropAndConfirm(authority.publicKey, 100 * LAMPORTS_PER_SOL);
    await airdropAndConfirm(creator.publicKey, 100 * LAMPORTS_PER_SOL);
    await airdropAndConfirm(member2.publicKey, 100 * LAMPORTS_PER_SOL);
    await airdropAndConfirm(member3.publicKey, 100 * LAMPORTS_PER_SOL);

    await createMintAndATAs();

    [globalStatePDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("global")],
      program.programId
    );
  });

  // ============================================================
  // 1. Initialize Config (GlobalState)
  // ============================================================
  it("Initialize global config", async () => {
    await program.methods
      .initializeConfig(usdcMint.publicKey)
      .accounts({
        globalState: globalStatePDA,
        authority: authority.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([authority])
      .rpc();

    const global = await program.account.globalState.fetch(globalStatePDA);
    expect(global.authority.toBase58()).to.equal(authority.publicKey.toBase58());
    expect(global.totalCircles.toNumber()).to.equal(0);
    expect(global.usdcMint.toBase58()).to.equal(usdcMint.publicKey.toBase58());
  });

  // ============================================================
  // 2. Initialize Circle
  // ============================================================
  it("Initialize circle with creator auto-join", async () => {
    const circleId = new BN(0);
    [circlePDA] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("circle"),
        creator.publicKey.toBuffer(),
        circleId.toArrayLike(Buffer, "le", 8),
      ],
      program.programId
    );

    circleVault = await getAssociatedTokenAddress(
      usdcMint.publicKey,
      circlePDA,
      true
    );

    const [memberRecordPDA] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("member"),
        circlePDA.toBuffer(),
        creator.publicKey.toBuffer(),
      ],
      program.programId
    );

    const [reputationPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("reputation"), creator.publicKey.toBuffer()],
      program.programId
    );

    const creatorBalanceBefore = await getAccount(
      provider.connection,
      creatorATA
    );

    await program.methods
      .initializeCircle(CONTRIBUTION, SECURITY_DEPOSIT, MAX_MEMBERS, ROUND_DURATION)
      .accounts({
        globalState: globalStatePDA,
        circle: circlePDA,
        memberRecord: memberRecordPDA,
        userReputation: reputationPDA,
        usdcMint: usdcMint.publicKey,
        circleVault: circleVault,
        creatorTokenAccount: creatorATA,
        creator: creator.publicKey,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .signers([creator])
      .rpc();

    const circle = await program.account.circle.fetch(circlePDA);
    expect(circle.authority.toBase58()).to.equal(
      creator.publicKey.toBase58()
    );
    expect(circle.circleId.toNumber()).to.equal(0);
    expect(circle.contributionAmount.toNumber()).to.equal(1_000_000);
    expect(circle.securityDeposit.toNumber()).to.equal(5_000_000);
    expect(circle.maxMembers).to.equal(MAX_MEMBERS);
    expect(circle.currentMembers).to.equal(1);
    expect(circle.status).to.deep.equal({ open: {} });
    expect(circle.members.length).to.equal(1);

    const member = await program.account.memberRecord.fetch(memberRecordPDA);
    expect(member.depositLocked.toNumber()).to.equal(5_000_000);
    expect(member.payoutIndex).to.equal(0);

    const reputation = await program.account.userReputation.fetch(
      reputationPDA
    );
    expect(reputation.score.toNumber()).to.equal(100);
    expect(reputation.circlesJoined).to.equal(1);

    // Verify vault received deposit
    const vaultBalance = await getAccount(provider.connection, circleVault);
    expect(Number(vaultBalance.amount)).to.equal(5_000_000);

    // Verify global state incremented
    const global = await program.account.globalState.fetch(globalStatePDA);
    expect(global.totalCircles.toNumber()).to.equal(1);
  });

  // ============================================================
  // 3. Join Circle (member2 joins, circle becomes full & active)
  // ============================================================
  it("Member2 joins circle, circle becomes active", async () => {
    const [memberRecordPDA] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("member"),
        circlePDA.toBuffer(),
        member2.publicKey.toBuffer(),
      ],
      program.programId
    );

    const [reputationPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("reputation"), member2.publicKey.toBuffer()],
      program.programId
    );

    const [roundStatePDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("round"), circlePDA.toBuffer(), Buffer.from([0])],
      program.programId
    );

    await program.methods
      .joinCircle()
      .accounts({
        circle: circlePDA,
        memberRecord: memberRecordPDA,
        userReputation: reputationPDA,
        roundState: roundStatePDA,
        circleVault: circleVault,
        usdcMint: usdcMint.publicKey,
        joinerTokenAccount: member2ATA,
        joiner: member2.publicKey,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .signers([member2])
      .rpc();

    const circle = await program.account.circle.fetch(circlePDA);
    expect(circle.currentMembers).to.equal(2);
    expect(circle.status).to.deep.equal({ active: {} });
    expect(circle.members.length).to.equal(2);

    // Vault should have 2 security deposits
    const vaultBalance = await getAccount(provider.connection, circleVault);
    expect(Number(vaultBalance.amount)).to.equal(10_000_000);

    // Round 0 should be created
    const round = await program.account.roundState.fetch(roundStatePDA);
    expect(round.roundIndex).to.equal(0);
    expect(round.recipient.toBase58()).to.equal(
      creator.publicKey.toBase58()
    );
    expect(round.paymentsCount).to.equal(0);
    expect(round.payoutClaimed).to.be.false;

    const member = await program.account.memberRecord.fetch(memberRecordPDA);
    expect(member.payoutIndex).to.equal(1);
    expect(member.depositLocked.toNumber()).to.equal(5_000_000);
  });

  // ============================================================
  // 4. Pay Round (member2 pays round 0)
  // ============================================================
  it("Member2 pays round 0 contribution", async () => {
    const [roundStatePDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("round"), circlePDA.toBuffer(), Buffer.from([0])],
      program.programId
    );

    const [paymentRecordPDA] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("payment"),
        circlePDA.toBuffer(),
        Buffer.from([0]),
        member2.publicKey.toBuffer(),
      ],
      program.programId
    );

    const [memberRecordPDA] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("member"),
        circlePDA.toBuffer(),
        member2.publicKey.toBuffer(),
      ],
      program.programId
    );

    const [reputationPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("reputation"), member2.publicKey.toBuffer()],
      program.programId
    );

    await program.methods
      .payRound()
      .accounts({
        circle: circlePDA,
        roundState: roundStatePDA,
        paymentRecord: paymentRecordPDA,
        memberRecord: memberRecordPDA,
        userReputation: reputationPDA,
        circleVault: circleVault,
        usdcMint: usdcMint.publicKey,
        payerTokenAccount: member2ATA,
        payer: member2.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .signers([member2])
      .rpc();

    const round = await program.account.roundState.fetch(roundStatePDA);
    expect(round.paymentsCount).to.equal(1);
    expect(round.totalCollected.toNumber()).to.equal(1_000_000);

    const payment = await program.account.paymentRecord.fetch(
      paymentRecordPDA
    );
    expect(payment.amount.toNumber()).to.equal(1_000_000);

    const member = await program.account.memberRecord.fetch(memberRecordPDA);
    expect(member.paidRounds).to.equal(1);

    const reputation = await program.account.userReputation.fetch(
      reputationPDA
    );
    expect(reputation.onTimePayments).to.equal(1);
    expect(reputation.score.toNumber()).to.equal(102); // 100 + 2
    expect(reputation.totalContributed.toNumber()).to.equal(1_000_000);
  });

  // ============================================================
  // 5. Claim Payout (creator claims round 0 payout)
  // ============================================================
  it("Creator claims round 0 payout", async () => {
    const [roundStatePDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("round"), circlePDA.toBuffer(), Buffer.from([0])],
      program.programId
    );

    const [memberRecordPDA] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("member"),
        circlePDA.toBuffer(),
        creator.publicKey.toBuffer(),
      ],
      program.programId
    );

    const [reputationPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("reputation"), creator.publicKey.toBuffer()],
      program.programId
    );

    const creatorBalanceBefore = await getAccount(
      provider.connection,
      creatorATA
    );

    await program.methods
      .claimPayout()
      .accounts({
        circle: circlePDA,
        roundState: roundStatePDA,
        memberRecord: memberRecordPDA,
        userReputation: reputationPDA,
        circleVault: circleVault,
        usdcMint: usdcMint.publicKey,
        recipientTokenAccount: creatorATA,
        recipient: creator.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([creator])
      .rpc();

    const round = await program.account.roundState.fetch(roundStatePDA);
    expect(round.payoutClaimed).to.be.true;

    const member = await program.account.memberRecord.fetch(memberRecordPDA);
    expect(member.receivedPayout).to.be.true;

    const reputation = await program.account.userReputation.fetch(
      reputationPDA
    );
    expect(reputation.score.toNumber()).to.equal(105); // 100 + 5
    expect(reputation.totalReceived.toNumber()).to.equal(1_000_000);

    const creatorBalanceAfter = await getAccount(
      provider.connection,
      creatorATA
    );
    expect(
      Number(creatorBalanceAfter.amount) -
        Number(creatorBalanceBefore.amount)
    ).to.equal(1_000_000);
  });

  // ============================================================
  // 6. Advance Round (round 0 -> round 1)
  // ============================================================
  it("Advance from round 0 to round 1", async () => {
    const [prevRoundPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("round"), circlePDA.toBuffer(), Buffer.from([0])],
      program.programId
    );

    const [newRoundPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("round"), circlePDA.toBuffer(), Buffer.from([1])],
      program.programId
    );

    await program.methods
      .advanceRound()
      .accounts({
        circle: circlePDA,
        prevRoundState: prevRoundPDA,
        newRoundState: newRoundPDA,
        caller: creator.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([creator])
      .rpc();

    const circle = await program.account.circle.fetch(circlePDA);
    expect(circle.currentRound).to.equal(1);

    const newRound = await program.account.roundState.fetch(newRoundPDA);
    expect(newRound.roundIndex).to.equal(1);
    expect(newRound.recipient.toBase58()).to.equal(
      member2.publicKey.toBase58()
    );
    expect(newRound.paymentsCount).to.equal(0);
  });

  // ============================================================
  // 7. Pay Round 1 (creator pays member2)
  // ============================================================
  it("Creator pays round 1 contribution", async () => {
    const [roundStatePDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("round"), circlePDA.toBuffer(), Buffer.from([1])],
      program.programId
    );

    const [paymentRecordPDA] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("payment"),
        circlePDA.toBuffer(),
        Buffer.from([1]),
        creator.publicKey.toBuffer(),
      ],
      program.programId
    );

    const [memberRecordPDA] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("member"),
        circlePDA.toBuffer(),
        creator.publicKey.toBuffer(),
      ],
      program.programId
    );

    const [reputationPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("reputation"), creator.publicKey.toBuffer()],
      program.programId
    );

    await program.methods
      .payRound()
      .accounts({
        circle: circlePDA,
        roundState: roundStatePDA,
        paymentRecord: paymentRecordPDA,
        memberRecord: memberRecordPDA,
        userReputation: reputationPDA,
        circleVault: circleVault,
        usdcMint: usdcMint.publicKey,
        payerTokenAccount: creatorATA,
        payer: creator.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .signers([creator])
      .rpc();

    const round = await program.account.roundState.fetch(roundStatePDA);
    expect(round.paymentsCount).to.equal(1);
    expect(round.totalCollected.toNumber()).to.equal(1_000_000);
  });

  // ============================================================
  // 8. Claim Payout Round 1 (member2 claims)
  // ============================================================
  it("Member2 claims round 1 payout", async () => {
    const [roundStatePDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("round"), circlePDA.toBuffer(), Buffer.from([1])],
      program.programId
    );

    const [memberRecordPDA] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("member"),
        circlePDA.toBuffer(),
        member2.publicKey.toBuffer(),
      ],
      program.programId
    );

    const [reputationPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("reputation"), member2.publicKey.toBuffer()],
      program.programId
    );

    const member2BalanceBefore = await getAccount(
      provider.connection,
      member2ATA
    );

    await program.methods
      .claimPayout()
      .accounts({
        circle: circlePDA,
        roundState: roundStatePDA,
        memberRecord: memberRecordPDA,
        userReputation: reputationPDA,
        circleVault: circleVault,
        usdcMint: usdcMint.publicKey,
        recipientTokenAccount: member2ATA,
        recipient: member2.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([member2])
      .rpc();

    const round = await program.account.roundState.fetch(roundStatePDA);
    expect(round.payoutClaimed).to.be.true;

    const member2BalanceAfter = await getAccount(
      provider.connection,
      member2ATA
    );
    expect(
      Number(member2BalanceAfter.amount) -
        Number(member2BalanceBefore.amount)
    ).to.equal(1_000_000);
  });

  // ============================================================
  // 9. Advance Round to Complete (round 1 -> completed)
  // ============================================================
  it("Advance round completes the circle", async () => {
    const [prevRoundPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("round"), circlePDA.toBuffer(), Buffer.from([1])],
      program.programId
    );

    // For the last round, new_round_state still needs to be provided
    // but the circle will be marked completed. We use round index 2.
    const [newRoundPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("round"), circlePDA.toBuffer(), Buffer.from([2])],
      program.programId
    );

    await program.methods
      .advanceRound()
      .accounts({
        circle: circlePDA,
        prevRoundState: prevRoundPDA,
        newRoundState: newRoundPDA,
        caller: creator.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([creator])
      .rpc();

    const circle = await program.account.circle.fetch(circlePDA);
    expect(circle.status).to.deep.equal({ completed: {} });
  });

  // ============================================================
  // 10. Refund Deposits
  // ============================================================
  it("Refund creator deposit after circle completion", async () => {
    const [memberRecordPDA] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("member"),
        circlePDA.toBuffer(),
        creator.publicKey.toBuffer(),
      ],
      program.programId
    );

    const [reputationPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("reputation"), creator.publicKey.toBuffer()],
      program.programId
    );

    const creatorBalanceBefore = await getAccount(
      provider.connection,
      creatorATA
    );

    await program.methods
      .refundDeposit()
      .accounts({
        circle: circlePDA,
        memberRecord: memberRecordPDA,
        userReputation: reputationPDA,
        circleVault: circleVault,
        usdcMint: usdcMint.publicKey,
        memberTokenAccount: creatorATA,
        memberWallet: creator.publicKey,
        caller: creator.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([creator])
      .rpc();

    const member = await program.account.memberRecord.fetch(memberRecordPDA);
    expect(member.depositLocked.toNumber()).to.equal(0);

    const reputation = await program.account.userReputation.fetch(
      reputationPDA
    );
    expect(reputation.circlesCompleted).to.equal(1);
    // Creator: 100 base + 5 (claim r0) + 10 (complete circle 1) + 2 (pay r0 circle 2) = 117
    expect(reputation.score.toNumber()).to.be.greaterThanOrEqual(115);

    const creatorBalanceAfter = await getAccount(
      provider.connection,
      creatorATA
    );
    expect(
      Number(creatorBalanceAfter.amount) -
        Number(creatorBalanceBefore.amount)
    ).to.equal(5_000_000);
  });

  it("Refund member2 deposit after circle completion", async () => {
    const [memberRecordPDA] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("member"),
        circlePDA.toBuffer(),
        member2.publicKey.toBuffer(),
      ],
      program.programId
    );

    const [reputationPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("reputation"), member2.publicKey.toBuffer()],
      program.programId
    );

    await program.methods
      .refundDeposit()
      .accounts({
        circle: circlePDA,
        memberRecord: memberRecordPDA,
        userReputation: reputationPDA,
        circleVault: circleVault,
        usdcMint: usdcMint.publicKey,
        memberTokenAccount: member2ATA,
        memberWallet: member2.publicKey,
        caller: member2.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([member2])
      .rpc();

    const member = await program.account.memberRecord.fetch(memberRecordPDA);
    expect(member.depositLocked.toNumber()).to.equal(0);
  });

  // ============================================================
  // 11. Init User Reputation (standalone)
  // ============================================================
  it("Initialize standalone user reputation", async () => {
    const [reputationPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("reputation"), member3.publicKey.toBuffer()],
      program.programId
    );

    await program.methods
      .initUserReputation()
      .accounts({
        userReputation: reputationPDA,
        user: member3.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([member3])
      .rpc();

    const reputation = await program.account.userReputation.fetch(
      reputationPDA
    );
    expect(reputation.user.toBase58()).to.equal(
      member3.publicKey.toBase58()
    );
    expect(reputation.score.toNumber()).to.equal(100);
    expect(reputation.circlesJoined).to.equal(0);
    expect(reputation.circlesCompleted).to.equal(0);
  });

  // ============================================================
  // 12. Error Cases - Validation Tests
  // ============================================================
  it("Fails to initialize circle with invalid max_members", async () => {
    const circleId = new BN(1);
    const [badCirclePDA] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("circle"),
        creator.publicKey.toBuffer(),
        circleId.toArrayLike(Buffer, "le", 8),
      ],
      program.programId
    );

    const badVault = await getAssociatedTokenAddress(
      usdcMint.publicKey,
      badCirclePDA,
      true
    );

    const [memberRecordPDA] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("member"),
        badCirclePDA.toBuffer(),
        creator.publicKey.toBuffer(),
      ],
      program.programId
    );

    const [reputationPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("reputation"), creator.publicKey.toBuffer()],
      program.programId
    );

    try {
      await program.methods
        .initializeCircle(CONTRIBUTION, SECURITY_DEPOSIT, 11, ROUND_DURATION)
        .accounts({
          globalState: globalStatePDA,
          circle: badCirclePDA,
          memberRecord: memberRecordPDA,
          userReputation: reputationPDA,
          usdcMint: usdcMint.publicKey,
          circleVault: badVault,
          creatorTokenAccount: creatorATA,
          creator: creator.publicKey,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .signers([creator])
        .rpc();
      expect.fail("Should have thrown error");
    } catch (error) {
      expect(error.message).to.include("InvalidMaxMembers");
    }
  });

  it("Fails to initialize circle with zero contribution", async () => {
    const circleId = new BN(1);
    const [badCirclePDA] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("circle"),
        creator.publicKey.toBuffer(),
        circleId.toArrayLike(Buffer, "le", 8),
      ],
      program.programId
    );

    const badVault = await getAssociatedTokenAddress(
      usdcMint.publicKey,
      badCirclePDA,
      true
    );

    const [memberRecordPDA] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("member"),
        badCirclePDA.toBuffer(),
        creator.publicKey.toBuffer(),
      ],
      program.programId
    );

    const [reputationPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("reputation"), creator.publicKey.toBuffer()],
      program.programId
    );

    try {
      await program.methods
        .initializeCircle(new BN(0), SECURITY_DEPOSIT, MAX_MEMBERS, ROUND_DURATION)
        .accounts({
          globalState: globalStatePDA,
          circle: badCirclePDA,
          memberRecord: memberRecordPDA,
          userReputation: reputationPDA,
          usdcMint: usdcMint.publicKey,
          circleVault: badVault,
          creatorTokenAccount: creatorATA,
          creator: creator.publicKey,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .signers([creator])
        .rpc();
      expect.fail("Should have thrown error");
    } catch (error) {
      expect(error.message).to.include("InvalidAmount");
    }
  });

  it("Fails to claim payout when not the recipient", async () => {
    // Create a new circle for this test
    const circleId = new BN(1);
    const [newCirclePDA] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("circle"),
        creator.publicKey.toBuffer(),
        circleId.toArrayLike(Buffer, "le", 8),
      ],
      program.programId
    );

    const newVault = await getAssociatedTokenAddress(
      usdcMint.publicKey,
      newCirclePDA,
      true
    );

    const [creatorMemberPDA] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("member"),
        newCirclePDA.toBuffer(),
        creator.publicKey.toBuffer(),
      ],
      program.programId
    );

    const [creatorRepPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("reputation"), creator.publicKey.toBuffer()],
      program.programId
    );

    // Create circle
    await program.methods
      .initializeCircle(CONTRIBUTION, SECURITY_DEPOSIT, MAX_MEMBERS, ROUND_DURATION)
      .accounts({
        globalState: globalStatePDA,
        circle: newCirclePDA,
        memberRecord: creatorMemberPDA,
        userReputation: creatorRepPDA,
        usdcMint: usdcMint.publicKey,
        circleVault: newVault,
        creatorTokenAccount: creatorATA,
        creator: creator.publicKey,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .signers([creator])
      .rpc();

    // Member2 joins (fills circle, activates it)
    const [member2MemberPDA] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("member"),
        newCirclePDA.toBuffer(),
        member2.publicKey.toBuffer(),
      ],
      program.programId
    );

    const [member2RepPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("reputation"), member2.publicKey.toBuffer()],
      program.programId
    );

    const [roundStatePDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("round"), newCirclePDA.toBuffer(), Buffer.from([0])],
      program.programId
    );

    await program.methods
      .joinCircle()
      .accounts({
        circle: newCirclePDA,
        memberRecord: member2MemberPDA,
        userReputation: member2RepPDA,
        roundState: roundStatePDA,
        circleVault: newVault,
        usdcMint: usdcMint.publicKey,
        joinerTokenAccount: member2ATA,
        joiner: member2.publicKey,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .signers([member2])
      .rpc();

    // Member2 pays round 0
    const [paymentPDA] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("payment"),
        newCirclePDA.toBuffer(),
        Buffer.from([0]),
        member2.publicKey.toBuffer(),
      ],
      program.programId
    );

    await program.methods
      .payRound()
      .accounts({
        circle: newCirclePDA,
        roundState: roundStatePDA,
        paymentRecord: paymentPDA,
        memberRecord: member2MemberPDA,
        userReputation: member2RepPDA,
        circleVault: newVault,
        usdcMint: usdcMint.publicKey,
        payerTokenAccount: member2ATA,
        payer: member2.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .signers([member2])
      .rpc();

    // Member2 tries to claim (but creator is the recipient for round 0)
    try {
      await program.methods
        .claimPayout()
        .accounts({
          circle: newCirclePDA,
          roundState: roundStatePDA,
          memberRecord: member2MemberPDA,
          userReputation: member2RepPDA,
          circleVault: newVault,
          usdcMint: usdcMint.publicKey,
          recipientTokenAccount: member2ATA,
          recipient: member2.publicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .signers([member2])
        .rpc();
      expect.fail("Should have thrown error");
    } catch (error) {
      expect(error.message).to.include("NotRecipient");
    }
  });

  // ============================================================
  // 13. Reputation Score Tracking
  // ============================================================
  it("Verifies final reputation scores after full cycle", async () => {
    const [creatorRepPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("reputation"), creator.publicKey.toBuffer()],
      program.programId
    );

    const [member2RepPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("reputation"), member2.publicKey.toBuffer()],
      program.programId
    );

    const creatorRep = await program.account.userReputation.fetch(
      creatorRepPDA
    );
    // Creator: 100 base + 5 (claim r0) + 10 (complete) + 2 (pay r1 of circle2) = 117
    // Actually from circle 1: +5 (claim) +10 (complete) = 115
    // From circle 2: +2 (pay round) = 117
    expect(creatorRep.score.toNumber()).to.be.greaterThanOrEqual(115);
    expect(creatorRep.circlesJoined).to.equal(2); // joined 2 circles
    expect(creatorRep.circlesCompleted).to.equal(1);

    const member2Rep = await program.account.userReputation.fetch(
      member2RepPDA
    );
    // Member2: 100 base + 2 (pay r0) + 5 (claim r1) + 10 (complete) = 117
    // From circle 2: +2 (pay) = 119
    expect(member2Rep.score.toNumber()).to.be.greaterThanOrEqual(102);
    expect(member2Rep.circlesJoined).to.equal(2);
  });

  // ============================================================
  // 14. Refund fails on non-completed circle
  // ============================================================
  it("Fails to refund deposit on non-completed circle", async () => {
    // Use the second circle (circle_id=1) which is still active
    const circleId = new BN(1);
    const [activeCirclePDA] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("circle"),
        creator.publicKey.toBuffer(),
        circleId.toArrayLike(Buffer, "le", 8),
      ],
      program.programId
    );

    const activeVault = await getAssociatedTokenAddress(
      usdcMint.publicKey,
      activeCirclePDA,
      true
    );

    const [memberRecordPDA] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("member"),
        activeCirclePDA.toBuffer(),
        creator.publicKey.toBuffer(),
      ],
      program.programId
    );

    const [reputationPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("reputation"), creator.publicKey.toBuffer()],
      program.programId
    );

    try {
      await program.methods
        .refundDeposit()
        .accounts({
          circle: activeCirclePDA,
          memberRecord: memberRecordPDA,
          userReputation: reputationPDA,
          circleVault: activeVault,
          usdcMint: usdcMint.publicKey,
          memberTokenAccount: creatorATA,
          memberWallet: creator.publicKey,
          caller: creator.publicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .signers([creator])
        .rpc();
      expect.fail("Should have thrown error");
    } catch (error) {
      expect(error.message).to.include("CircleNotCompleted");
    }
  });
});