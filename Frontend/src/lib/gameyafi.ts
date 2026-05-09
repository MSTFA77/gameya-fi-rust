/**
 * GameyaFi SDK - Complete Solana Program Integration
 * Trustless Rotating Savings Circles on Solana with USDC + On-Chain Reputation
 */

import { BN, Program, AnchorProvider } from "@coral-xyz/anchor";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
  createAssociatedTokenAccountInstruction,
  getAccount,
} from "@solana/spl-token";
import {
  PublicKey,
  SystemProgram,
  Transaction,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import IDL from "../idl/workspace.json";

// ─── Constants ───
const USDC_DECIMALS = 6;

// ─── Types ───

export enum CircleStatus {
  Open = "open",
  Active = "active",
  Completed = "completed",
  Cancelled = "cancelled",
}

export interface GlobalStateData {
  authority: PublicKey;
  totalCircles: BN;
  usdcMint: PublicKey;
  bump: number;
}

export interface CircleData {
  authority: PublicKey;
  circleId: BN;
  usdcMint: PublicKey;
  contributionAmount: BN;
  securityDeposit: BN;
  maxMembers: number;
  currentMembers: number;
  currentRound: number;
  totalRounds: number;
  roundStartedAt: BN;
  roundDuration: BN;
  status: any;
  members: PublicKey[];
  payoutOrder: PublicKey[];
  createdAt: BN;
  bump: number;
}

export interface MemberRecordData {
  circle: PublicKey;
  member: PublicKey;
  depositLocked: BN;
  paidRounds: number;
  receivedPayout: boolean;
  defaulted: boolean;
  joinedAt: BN;
  payoutIndex: number;
  bump: number;
}

export interface RoundStateData {
  circle: PublicKey;
  roundIndex: number;
  recipient: PublicKey;
  totalCollected: BN;
  paymentsCount: number;
  payoutClaimed: boolean;
  startedAt: BN;
  bump: number;
}

export interface PaymentRecordData {
  circle: PublicKey;
  roundIndex: number;
  payer: PublicKey;
  amount: BN;
  paidAt: BN;
  bump: number;
}

export interface UserReputationData {
  user: PublicKey;
  score: BN;
  circlesJoined: number;
  circlesCompleted: number;
  defaultsCount: number;
  onTimePayments: number;
  latePayments: number;
  totalContributed: BN;
  totalReceived: BN;
  createdAt: BN;
  bump: number;
}

export interface SDKResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface CreateCircleParams {
  contributionAmount: number; // in USDC (e.g. 10 = 10 USDC)
  securityDeposit: number;
  maxMembers: number;
  roundDuration: number; // seconds
}

// ─── SDK Class ───

export class GameyaFiSDK {
  public readonly provider: AnchorProvider;
  public readonly program: Program<any>;

  constructor(provider: AnchorProvider) {
    this.provider = provider;
    this.program = new Program(IDL as any, provider);
  }

  // ─── Helpers ───

  private safeBN(value: any, defaultValue: number | string = 0): BN {
    if (value === null || value === undefined) return new BN(defaultValue);
    if (value instanceof BN) return value;
    if (typeof value === "number") {
      if (isNaN(value) || !isFinite(value)) return new BN(defaultValue);
      return new BN(Math.floor(value).toString());
    }
    if (typeof value === "string") {
      const trimmed = value.trim();
      const parsed = parseFloat(trimmed);
      if (isNaN(parsed)) return new BN(defaultValue);
      return new BN(Math.floor(parsed).toString());
    }
    return new BN(defaultValue);
  }

  private safeBNToNumber(value: any, defaultValue: number = 0): number {
    try {
      return value && typeof value.toNumber === "function"
        ? value.toNumber()
        : defaultValue;
    } catch {
      if (value && typeof value.toString === "function") {
        const parsed = parseInt(value.toString());
        if (!isNaN(parsed)) return parsed;
      }
      return defaultValue;
    }
  }

  /** Convert USDC amount (e.g. 10.5) to smallest unit (10500000) */
  public usdcToSmallest(amount: number): BN {
    return this.safeBN(Math.floor(amount * 10 ** USDC_DECIMALS));
  }

  /** Convert smallest unit to USDC display */
  public smallestToUsdc(amount: BN | number): number {
    const num =
      typeof amount === "number" ? amount : this.safeBNToNumber(amount);
    return num / 10 ** USDC_DECIMALS;
  }

  private bnToSeedBuffer(value: BN, bytes: number = 8): Buffer {
    return value.toArrayLike(Buffer, "le", bytes);
  }

  private async testConnection(): Promise<boolean> {
    try {
      if (!this.provider?.connection) return false;
      const { value } = await this.provider.connection.getLatestBlockhashAndContext("finalized");
      return !!(value && value.blockhash);
    } catch {
      return false;
    }
  }

  // ─── PDA Derivations ───

  public getGlobalStatePDA(): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("global")],
      this.program.programId
    );
  }

  public getCirclePDA(creator: PublicKey, circleId: BN): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
      [
        Buffer.from("circle"),
        creator.toBuffer(),
        circleId.toArrayLike(Buffer, "le", 8),
      ],
      this.program.programId
    );
  }

  public getMemberRecordPDA(circle: PublicKey, member: PublicKey): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("member"), circle.toBuffer(), member.toBuffer()],
      this.program.programId
    );
  }

  public getRoundStatePDA(circle: PublicKey, roundIndex: number): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
      [
        Buffer.from("round"),
        circle.toBuffer(),
        Buffer.from([roundIndex]),
      ],
      this.program.programId
    );
  }

  public getPaymentRecordPDA(circle: PublicKey, roundIndex: number, payer: PublicKey): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
      [
        Buffer.from("payment"),
        circle.toBuffer(),
        Buffer.from([roundIndex]),
        payer.toBuffer(),
      ],
      this.program.programId
    );
  }

  public getUserReputationPDA(user: PublicKey): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("reputation"), user.toBuffer()],
      this.program.programId
    );
  }

  // ─── Account Fetchers ───

  async fetchGlobalState(): Promise<SDKResult<GlobalStateData>> {
    try {
      const [pda] = this.getGlobalStatePDA();
      const account = await this.program.account.globalState.fetch(pda);
      return { success: true, data: account as any };
    } catch (error: any) {
      if (error?.message?.includes("Account does not exist")) {
        return { success: false, error: "Global state not initialized" };
      }
      return { success: false, error: error?.message || "Failed to fetch global state" };
    }
  }

  async fetchCircle(circlePDA: PublicKey): Promise<SDKResult<CircleData>> {
    try {
      const account = await this.program.account.circle.fetch(circlePDA);
      return { success: true, data: account as any };
    } catch (error: any) {
      return { success: false, error: error?.message || "Failed to fetch circle" };
    }
  }

  async fetchMemberRecord(circle: PublicKey, member: PublicKey): Promise<SDKResult<MemberRecordData>> {
    try {
      const [pda] = this.getMemberRecordPDA(circle, member);
      const account = await this.program.account.memberRecord.fetch(pda);
      return { success: true, data: account as any };
    } catch (error: any) {
      return { success: false, error: error?.message || "Failed to fetch member record" };
    }
  }

  async fetchRoundState(circle: PublicKey, roundIndex: number): Promise<SDKResult<RoundStateData>> {
    try {
      const [pda] = this.getRoundStatePDA(circle, roundIndex);
      const account = await this.program.account.roundState.fetch(pda);
      return { success: true, data: account as any };
    } catch (error: any) {
      return { success: false, error: error?.message || "Failed to fetch round state" };
    }
  }

  async fetchUserReputation(user: PublicKey): Promise<SDKResult<UserReputationData>> {
    try {
      const [pda] = this.getUserReputationPDA(user);
      const account = await this.program.account.userReputation.fetch(pda);
      return { success: true, data: account as any };
    } catch (error: any) {
      if (error?.message?.includes("Account does not exist")) {
        return { success: true, data: undefined };
      }
      return { success: false, error: error?.message || "Failed to fetch reputation" };
    }
  }

  async fetchAllCircles(): Promise<SDKResult<Array<{ publicKey: PublicKey; account: CircleData }>>> {
    try {
      if (!(await this.testConnection())) return { success: false, error: "Network unavailable" };

      const timeout = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("timeout")), 15000)
      );
      const fetchPromise = this.program.account.circle.all();

      let allCircles: any[];
      try {
        allCircles = (await Promise.race([fetchPromise, timeout])) as any[];
      } catch (e: any) {
        if (e?.message?.includes("timeout")) {
          return { success: false, error: "Request timed out" };
        }
        throw e;
      }

      if (!allCircles?.length) return { success: true, data: [] };

      return {
        success: true,
        data: allCircles.map((c: any) => ({
          publicKey: c.publicKey,
          account: c.account,
        })),
      };
    } catch (error: any) {
      if (error?.message?.includes("Account does not exist")) {
        return { success: true, data: [] };
      }
      return { success: false, error: error?.message || "Failed to fetch circles" };
    }
  }

  async fetchAllReputations(): Promise<SDKResult<Array<{ publicKey: PublicKey; account: UserReputationData }>>> {
    try {
      const all = await this.program.account.userReputation.all();
      return {
        success: true,
        data: all.map((r: any) => ({ publicKey: r.publicKey, account: r.account })),
      };
    } catch (error: any) {
      return { success: true, data: [] };
    }
  }

  // ─── Instructions ───

  /** Initialize the global config. Only needs to be called once. */
  async initializeConfig(usdcMint: PublicKey): Promise<SDKResult<{ signature: string; globalStatePDA: string }>> {
    if (!this.provider.publicKey) return { success: false, error: "Wallet not connected" };
    try {
      if (!(await this.testConnection())) return { success: false, error: "Network unavailable" };

      const [globalStatePDA] = this.getGlobalStatePDA();

      const tx = await this.program.methods
        .initializeConfig(usdcMint)
        .accounts({
          globalState: globalStatePDA,
          authority: this.provider.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      return {
        success: true,
        data: { signature: tx, globalStatePDA: globalStatePDA.toString() },
      };
    } catch (error: any) {
      return { success: false, error: error?.message || "Failed to initialize config" };
    }
  }

  /** Create a new savings circle. Creator auto-joins and pays security deposit. */
  async initializeCircle(params: CreateCircleParams): Promise<SDKResult<{ signature: string; circlePDA: string }>> {
    if (!this.provider.publicKey) return { success: false, error: "Wallet not connected" };
    try {
      if (!(await this.testConnection())) return { success: false, error: "Network unavailable" };

      // Fetch global state to get circle ID and USDC mint
      const globalResult = await this.fetchGlobalState();
      if (!globalResult.success || !globalResult.data) {
        return { success: false, error: "Global state not initialized. Use Demo Tools to initialize." };
      }

      const global = globalResult.data;
      const circleId = global.totalCircles;
      const usdcMint = global.usdcMint;

      const [globalStatePDA] = this.getGlobalStatePDA();
      const [circlePDA] = this.getCirclePDA(this.provider.publicKey, circleId);
      const [memberRecordPDA] = this.getMemberRecordPDA(circlePDA, this.provider.publicKey);
      const [userRepPDA] = this.getUserReputationPDA(this.provider.publicKey);

      // Circle vault ATA (owned by circle PDA)
      const circleVault = getAssociatedTokenAddressSync(usdcMint, circlePDA, true);
      // Creator's token account
      const creatorTokenAccount = getAssociatedTokenAddressSync(usdcMint, this.provider.publicKey);

      const tx = await this.program.methods
        .initializeCircle(
          this.usdcToSmallest(params.contributionAmount),
          this.usdcToSmallest(params.securityDeposit),
          params.maxMembers,
          this.safeBN(params.roundDuration)
        )
        .accounts({
          globalState: globalStatePDA,
          circle: circlePDA,
          memberRecord: memberRecordPDA,
          userReputation: userRepPDA,
          usdcMint: usdcMint,
          circleVault: circleVault,
          creatorTokenAccount: creatorTokenAccount,
          creator: this.provider.publicKey,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      return {
        success: true,
        data: { signature: tx, circlePDA: circlePDA.toString() },
      };
    } catch (error: any) {
      console.error("initializeCircle error:", error);
      return { success: false, error: error?.message || "Failed to create circle" };
    }
  }

  /** Join an open circle by paying security deposit. */
  async joinCircle(circlePDA: PublicKey): Promise<SDKResult<{ signature: string }>> {
    if (!this.provider.publicKey) return { success: false, error: "Wallet not connected" };
    try {
      if (!(await this.testConnection())) return { success: false, error: "Network unavailable" };

      const circleData = await this.program.account.circle.fetch(circlePDA);
      const usdcMint = circleData.usdcMint;

      const [memberRecordPDA] = this.getMemberRecordPDA(circlePDA, this.provider.publicKey);
      const [userRepPDA] = this.getUserReputationPDA(this.provider.publicKey);
      const circleVault = getAssociatedTokenAddressSync(usdcMint, circlePDA, true);
      const joinerTokenAccount = getAssociatedTokenAddressSync(usdcMint, this.provider.publicKey);

      // If circle fills, we need round_state PDA for round 0
      const [roundStatePDA] = this.getRoundStatePDA(circlePDA, 0);

      const tx = await this.program.methods
        .joinCircle()
        .accounts({
          circle: circlePDA,
          memberRecord: memberRecordPDA,
          userReputation: userRepPDA,
          usdcMint: usdcMint,
          circleVault: circleVault,
          joinerTokenAccount: joinerTokenAccount,
          roundState: roundStatePDA,
          joiner: this.provider.publicKey,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      return { success: true, data: { signature: tx } };
    } catch (error: any) {
      console.error("joinCircle error:", error);
      return { success: false, error: error?.message || "Failed to join circle" };
    }
  }

  /** Pay contribution for the current round. */
  async payRound(circlePDA: PublicKey): Promise<SDKResult<{ signature: string }>> {
    if (!this.provider.publicKey) return { success: false, error: "Wallet not connected" };
    try {
      if (!(await this.testConnection())) return { success: false, error: "Network unavailable" };

      const circleData = await this.program.account.circle.fetch(circlePDA);
      const usdcMint = circleData.usdcMint;
      const currentRound = circleData.currentRound;

      const [memberRecordPDA] = this.getMemberRecordPDA(circlePDA, this.provider.publicKey);
      const [roundStatePDA] = this.getRoundStatePDA(circlePDA, currentRound);
      const [paymentRecordPDA] = this.getPaymentRecordPDA(circlePDA, currentRound, this.provider.publicKey);
      const [userRepPDA] = this.getUserReputationPDA(this.provider.publicKey);
      const circleVault = getAssociatedTokenAddressSync(usdcMint, circlePDA, true);
      const payerTokenAccount = getAssociatedTokenAddressSync(usdcMint, this.provider.publicKey);

      const tx = await this.program.methods
        .payRound()
        .accounts({
          circle: circlePDA,
          roundState: roundStatePDA,
          memberRecord: memberRecordPDA,
          paymentRecord: paymentRecordPDA,
          userReputation: userRepPDA,
          usdcMint: usdcMint,
          circleVault: circleVault,
          payerTokenAccount: payerTokenAccount,
          payer: this.provider.publicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      return { success: true, data: { signature: tx } };
    } catch (error: any) {
      console.error("payRound error:", error);
      return { success: false, error: error?.message || "Failed to pay round" };
    }
  }

  /** Claim payout as the round recipient. */
  async claimPayout(circlePDA: PublicKey): Promise<SDKResult<{ signature: string }>> {
    if (!this.provider.publicKey) return { success: false, error: "Wallet not connected" };
    try {
      if (!(await this.testConnection())) return { success: false, error: "Network unavailable" };

      const circleData = await this.program.account.circle.fetch(circlePDA);
      const usdcMint = circleData.usdcMint;
      const currentRound = circleData.currentRound;

      const [memberRecordPDA] = this.getMemberRecordPDA(circlePDA, this.provider.publicKey);
      const [roundStatePDA] = this.getRoundStatePDA(circlePDA, currentRound);
      const [userRepPDA] = this.getUserReputationPDA(this.provider.publicKey);
      const circleVault = getAssociatedTokenAddressSync(usdcMint, circlePDA, true);
      const recipientTokenAccount = getAssociatedTokenAddressSync(usdcMint, this.provider.publicKey);

      const tx = await this.program.methods
        .claimPayout()
        .accounts({
          circle: circlePDA,
          roundState: roundStatePDA,
          memberRecord: memberRecordPDA,
          userReputation: userRepPDA,
          circleVault: circleVault,
          usdcMint: usdcMint,
          recipientTokenAccount: recipientTokenAccount,
          recipient: this.provider.publicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .rpc();

      return { success: true, data: { signature: tx } };
    } catch (error: any) {
      console.error("claimPayout error:", error);
      return { success: false, error: error?.message || "Failed to claim payout" };
    }
  }

  /** Advance to the next round after payout is claimed. */
  async advanceRound(circlePDA: PublicKey): Promise<SDKResult<{ signature: string }>> {
    if (!this.provider.publicKey) return { success: false, error: "Wallet not connected" };
    try {
      if (!(await this.testConnection())) return { success: false, error: "Network unavailable" };

      const circleData = await this.program.account.circle.fetch(circlePDA);
      const currentRound = circleData.currentRound;
      const nextRound = currentRound + 1;

      const [prevRoundStatePDA] = this.getRoundStatePDA(circlePDA, currentRound);
      const [newRoundStatePDA] = this.getRoundStatePDA(circlePDA, nextRound);

      const tx = await this.program.methods
        .advanceRound()
        .accounts({
          circle: circlePDA,
          prevRoundState: prevRoundStatePDA,
          newRoundState: newRoundStatePDA,
          caller: this.provider.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      return { success: true, data: { signature: tx } };
    } catch (error: any) {
      console.error("advanceRound error:", error);
      return { success: false, error: error?.message || "Failed to advance round" };
    }
  }

  /** Refund security deposit after circle is completed. */
  async refundDeposit(circlePDA: PublicKey): Promise<SDKResult<{ signature: string }>> {
    if (!this.provider.publicKey) return { success: false, error: "Wallet not connected" };
    try {
      if (!(await this.testConnection())) return { success: false, error: "Network unavailable" };

      const circleData = await this.program.account.circle.fetch(circlePDA);
      const usdcMint = circleData.usdcMint;

      const [memberRecordPDA] = this.getMemberRecordPDA(circlePDA, this.provider.publicKey);
      const [userRepPDA] = this.getUserReputationPDA(this.provider.publicKey);
      const circleVault = getAssociatedTokenAddressSync(usdcMint, circlePDA, true);
      const memberTokenAccount = getAssociatedTokenAddressSync(usdcMint, this.provider.publicKey);

      const tx = await this.program.methods
        .refundDeposit()
        .accounts({
          circle: circlePDA,
          memberRecord: memberRecordPDA,
          userReputation: userRepPDA,
          circleVault: circleVault,
          usdcMint: usdcMint,
          memberTokenAccount: memberTokenAccount,
          member: this.provider.publicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .rpc();

      return { success: true, data: { signature: tx } };
    } catch (error: any) {
      console.error("refundDeposit error:", error);
      return { success: false, error: error?.message || "Failed to refund deposit" };
    }
  }

  /** Mark a member as defaulted after the round deadline passes. */
  async markDefault(circlePDA: PublicKey, defaulter: PublicKey): Promise<SDKResult<{ signature: string }>> {
    if (!this.provider.publicKey) return { success: false, error: "Wallet not connected" };
    try {
      if (!(await this.testConnection())) return { success: false, error: "Network unavailable" };

      const circleData = await this.program.account.circle.fetch(circlePDA);
      const currentRound = circleData.currentRound;

      const [roundStatePDA] = this.getRoundStatePDA(circlePDA, currentRound);
      const [memberRecordPDA] = this.getMemberRecordPDA(circlePDA, defaulter);
      const [userRepPDA] = this.getUserReputationPDA(defaulter);

      const tx = await this.program.methods
        .markDefault(defaulter)
        .accounts({
          circle: circlePDA,
          roundState: roundStatePDA,
          memberRecord: memberRecordPDA,
          userReputation: userRepPDA,
          caller: this.provider.publicKey,
        })
        .rpc();

      return { success: true, data: { signature: tx } };
    } catch (error: any) {
      console.error("markDefault error:", error);
      return { success: false, error: error?.message || "Failed to mark default" };
    }
  }

  /** Initialize user reputation (standalone). */
  async initUserReputation(): Promise<SDKResult<{ signature: string }>> {
    if (!this.provider.publicKey) return { success: false, error: "Wallet not connected" };
    try {
      const [userRepPDA] = this.getUserReputationPDA(this.provider.publicKey);

      const tx = await this.program.methods
        .initUserReputation()
        .accounts({
          userReputation: userRepPDA,
          user: this.provider.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      return { success: true, data: { signature: tx } };
    } catch (error: any) {
      return { success: false, error: error?.message || "Failed to init reputation" };
    }
  }

  // ─── Utility Methods ───

  async fetchSolBalance(account?: PublicKey): Promise<SDKResult<number>> {
    const target = account || this.provider.publicKey;
    if (!target) return { success: false, error: "No account" };
    try {
      const balance = await this.provider.connection.getBalance(target);
      return { success: true, data: balance / LAMPORTS_PER_SOL };
    } catch {
      return { success: false, error: "Failed to fetch SOL balance" };
    }
  }

  async fetchUsdcBalance(account?: PublicKey): Promise<SDKResult<number>> {
    const target = account || this.provider.publicKey;
    if (!target) return { success: false, error: "No account" };
    try {
      const globalResult = await this.fetchGlobalState();
      if (!globalResult.success || !globalResult.data) {
        return { success: true, data: 0 };
      }
      const usdcMint = globalResult.data.usdcMint;
      const ata = getAssociatedTokenAddressSync(usdcMint, target);
      const balance = await this.provider.connection.getTokenAccountBalance(ata);
      return { success: true, data: Number(balance.value.uiAmount || 0) };
    } catch {
      return { success: true, data: 0 };
    }
  }

  /** Ensure user has an ATA for USDC, create if needed. */
  async ensureUsdcATA(usdcMint: PublicKey): Promise<SDKResult<PublicKey>> {
    if (!this.provider.publicKey) return { success: false, error: "Wallet not connected" };
    try {
      const ata = getAssociatedTokenAddressSync(usdcMint, this.provider.publicKey);
      try {
        await getAccount(this.provider.connection, ata);
        return { success: true, data: ata };
      } catch {
        // ATA doesn't exist, create it
        const ix = createAssociatedTokenAccountInstruction(
          this.provider.publicKey,
          ata,
          this.provider.publicKey,
          usdcMint
        );
        const tx = new Transaction().add(ix);
        await this.provider.sendAndConfirm!(tx);
        return { success: true, data: ata };
      }
    } catch (error: any) {
      return { success: false, error: error?.message || "Failed to ensure ATA" };
    }
  }

  /** Get circle status as string */
  public getCircleStatusString(status: any): string {
    if (status?.open !== undefined) return "Open";
    if (status?.active !== undefined) return "Active";
    if (status?.completed !== undefined) return "Completed";
    if (status?.cancelled !== undefined) return "Cancelled";
    return "Unknown";
  }

  /** Check if a payment record exists for this round */
  async hasPaymentRecord(circlePDA: PublicKey, roundIndex: number, payer: PublicKey): Promise<boolean> {
    try {
      const [pda] = this.getPaymentRecordPDA(circlePDA, roundIndex, payer);
      await this.program.account.paymentRecord.fetch(pda);
      return true;
    } catch {
      return false;
    }
  }
}