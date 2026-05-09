/**
 * React hooks for GameyaFi program interaction
 */

import { useMemo, useState, useEffect, useCallback } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { AnchorProvider } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { GameyaFiSDK, CircleData, UserReputationData, RoundStateData, MemberRecordData } from "@/lib/gameyafi";

// ─── Provider & SDK ───

export function useAnchorProvider(): AnchorProvider | null {
  const { connection } = useConnection();
  const { publicKey, signTransaction, signAllTransactions } = useWallet();

  return useMemo(() => {
    if (!publicKey || !signTransaction || !signAllTransactions) return null;
    return new AnchorProvider(
      connection,
      { publicKey, signTransaction, signAllTransactions } as any,
      { commitment: "confirmed" }
    );
  }, [connection, publicKey, signTransaction, signAllTransactions]);
}

export function useGameyaFiSDK(): GameyaFiSDK | null {
  const provider = useAnchorProvider();
  return useMemo(() => {
    if (!provider) return null;
    return new GameyaFiSDK(provider);
  }, [provider]);
}

// ─── Circle List Hook ───

export interface CircleWithKey {
  publicKey: PublicKey;
  account: CircleData;
  statusString: string;
}

export function useCircles() {
  const sdk = useGameyaFiSDK();
  const [circles, setCircles] = useState<CircleWithKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!sdk) {
      setCircles([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await sdk.fetchAllCircles();
      if (result.success && result.data) {
        setCircles(
          result.data.map((c) => ({
            publicKey: c.publicKey,
            account: c.account,
            statusString: sdk.getCircleStatusString(c.account.status),
          }))
        );
      } else {
        setError(result.error || "Failed to load circles");
        setCircles([]);
      }
    } catch (e: any) {
      setError(e?.message || "Failed to load circles");
      setCircles([]);
    } finally {
      setLoading(false);
    }
  }, [sdk]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { circles, loading, error, refresh };
}

// ─── Single Circle Hook ───

export function useCircleDetails(circlePDAString: string | undefined) {
  const sdk = useGameyaFiSDK();
  const { publicKey } = useWallet();
  const [circle, setCircle] = useState<CircleData | null>(null);
  const [roundState, setRoundState] = useState<RoundStateData | null>(null);
  const [memberRecords, setMemberRecords] = useState<Map<string, MemberRecordData>>(new Map());
  const [reputations, setReputations] = useState<Map<string, UserReputationData>>(new Map());
  const [myPaymentDone, setMyPaymentDone] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusString, setStatusString] = useState("Unknown");

  const circlePDA = useMemo(() => {
    if (!circlePDAString) return null;
    try {
      return new PublicKey(circlePDAString);
    } catch {
      return null;
    }
  }, [circlePDAString]);

  const refresh = useCallback(async () => {
    if (!sdk || !circlePDA) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const circleResult = await sdk.fetchCircle(circlePDA);
      if (!circleResult.success || !circleResult.data) {
        setError(circleResult.error || "Circle not found");
        setCircle(null);
        setLoading(false);
        return;
      }

      const c = circleResult.data;
      setCircle(c);
      setStatusString(sdk.getCircleStatusString(c.status));

      // Fetch round state if active
      if (sdk.getCircleStatusString(c.status) === "Active") {
        const rsResult = await sdk.fetchRoundState(circlePDA, c.currentRound);
        if (rsResult.success && rsResult.data) {
          setRoundState(rsResult.data);
        }
      }

      // Fetch member records and reputations
      const memberMap = new Map<string, MemberRecordData>();
      const repMap = new Map<string, UserReputationData>();

      for (const member of c.members) {
        const mrResult = await sdk.fetchMemberRecord(circlePDA, member);
        if (mrResult.success && mrResult.data) {
          memberMap.set(member.toString(), mrResult.data);
        }
        const repResult = await sdk.fetchUserReputation(member);
        if (repResult.success && repResult.data) {
          repMap.set(member.toString(), repResult.data);
        }
      }

      setMemberRecords(memberMap);
      setReputations(repMap);

      // Check if current user has paid this round
      if (publicKey && sdk.getCircleStatusString(c.status) === "Active") {
        const hasPaid = await sdk.hasPaymentRecord(circlePDA, c.currentRound, publicKey);
        setMyPaymentDone(hasPaid);
      }
    } catch (e: any) {
      setError(e?.message || "Failed to load circle");
    } finally {
      setLoading(false);
    }
  }, [sdk, circlePDA, publicKey]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    circle,
    roundState,
    memberRecords,
    reputations,
    myPaymentDone,
    loading,
    error,
    statusString,
    circlePDA,
    refresh,
  };
}

// ─── User Reputation Hook ───

export function useUserReputation(userPubkey?: PublicKey | null) {
  const sdk = useGameyaFiSDK();
  const { publicKey } = useWallet();
  const [reputation, setReputation] = useState<UserReputationData | null>(null);
  const [loading, setLoading] = useState(true);

  const target = userPubkey || publicKey;

  const refresh = useCallback(async () => {
    if (!sdk || !target) {
      setReputation(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const result = await sdk.fetchUserReputation(target);
      if (result.success && result.data) {
        setReputation(result.data);
      } else {
        setReputation(null);
      }
    } catch {
      setReputation(null);
    } finally {
      setLoading(false);
    }
  }, [sdk, target]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { reputation, loading, refresh };
}

// ─── Balances Hook ───

export function useBalances() {
  const sdk = useGameyaFiSDK();
  const { publicKey } = useWallet();
  const [solBalance, setSolBalance] = useState<number>(0);
  const [usdcBalance, setUsdcBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!sdk || !publicKey) {
      setSolBalance(0);
      setUsdcBalance(0);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [solResult, usdcResult] = await Promise.all([
        sdk.fetchSolBalance(publicKey),
        sdk.fetchUsdcBalance(publicKey),
      ]);
      if (solResult.success) setSolBalance(solResult.data || 0);
      if (usdcResult.success) setUsdcBalance(usdcResult.data || 0);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [sdk, publicKey]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { solBalance, usdcBalance, loading, refresh };
}

// ─── Global State Hook ───

export function useGlobalState() {
  const sdk = useGameyaFiSDK();
  const [initialized, setInitialized] = useState<boolean | null>(null);
  const [usdcMint, setUsdcMint] = useState<PublicKey | null>(null);
  const [totalCircles, setTotalCircles] = useState(0);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!sdk) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const result = await sdk.fetchGlobalState();
      if (result.success && result.data) {
        setInitialized(true);
        setUsdcMint(result.data.usdcMint);
        setTotalCircles(result.data.totalCircles.toNumber());
      } else {
        setInitialized(false);
      }
    } catch {
      setInitialized(false);
    } finally {
      setLoading(false);
    }
  }, [sdk]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { initialized, usdcMint, totalCircles, loading, refresh };
}