import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Coins, Settings, Wallet, CheckCircle, Info, Shield, Loader2, AlertTriangle, Copy,
} from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useWallet } from '@solana/wallet-adapter-react';
import { useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useGameyaFiSDK, useGlobalState, useBalances } from '@/hooks/useGameyaFi';
import {
  Keypair, SystemProgram, Transaction, PublicKey, LAMPORTS_PER_SOL,
} from '@solana/web3.js';
import {
  createInitializeMintInstruction,
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
  getAssociatedTokenAddressSync,
  TOKEN_PROGRAM_ID,
  MINT_SIZE,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from '@solana/spl-token';

const DemoTools: React.FC = () => {
  const { toast } = useToast();
  const { publicKey, signTransaction } = useWallet();
  const { connection } = useConnection();
  const sdk = useGameyaFiSDK();
  const { initialized, usdcMint, totalCircles, loading: globalLoading, refresh: refreshGlobal } = useGlobalState();
  const { solBalance, usdcBalance, refresh: refreshBalances } = useBalances();

  const [initializing, setInitializing] = useState(false);
  const [minting, setMinting] = useState(false);
  const [airdropping, setAirdropping] = useState(false);
  const [mintAddress, setMintAddress] = useState<string | null>(null);

  // Step 1: Create a test USDC mint and initialize the global config
  const handleInitialize = useCallback(async () => {
    if (!sdk || !publicKey || !signTransaction) {
      toast({ title: 'Error', description: 'Connect your wallet first' });
      return;
    }

    setInitializing(true);
    try {
      // Check if already initialized
      const existing = await sdk.fetchGlobalState();
      if (existing.success && existing.data) {
        toast({ title: 'Already Initialized', description: 'Global config already exists on-chain.' });
        await refreshGlobal();
        setInitializing(false);
        return;
      }

      // Create a new SPL token mint (test USDC) with 6 decimals
      const mintKeypair = Keypair.generate();
      const lamports = await connection.getMinimumBalanceForRentExemption(MINT_SIZE);

      const createMintTx = new Transaction().add(
        SystemProgram.createAccount({
          fromPubkey: publicKey,
          newAccountPubkey: mintKeypair.publicKey,
          space: MINT_SIZE,
          lamports,
          programId: TOKEN_PROGRAM_ID,
        }),
        createInitializeMintInstruction(
          mintKeypair.publicKey,
          6, // decimals (same as real USDC)
          publicKey, // mint authority
          publicKey  // freeze authority
        )
      );

      createMintTx.feePayer = publicKey;
      createMintTx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
      createMintTx.partialSign(mintKeypair);

      const signedTx = await signTransaction(createMintTx);
      const sig1 = await connection.sendRawTransaction(signedTx.serialize());
      await connection.confirmTransaction(sig1, 'confirmed');

      setMintAddress(mintKeypair.publicKey.toString());

      // Now initialize the global config with this mint
      const result = await sdk.initializeConfig(mintKeypair.publicKey);
      if (result.success) {
        toast({
          title: 'Program Initialized',
          description: `Test USDC mint created and global config set up on-chain.`,
        });
        await refreshGlobal();
      } else {
        toast({ title: 'Error', description: result.error || 'Failed to initialize config' });
      }
    } catch (error: any) {
      console.error('Initialize error:', error);
      toast({ title: 'Error', description: error?.message || 'Initialization failed' });
    } finally {
      setInitializing(false);
    }
  }, [sdk, publicKey, signTransaction, connection, toast, refreshGlobal]);

  // Step 2: Mint test USDC to the connected wallet
  const handleMint = useCallback(async () => {
    if (!publicKey || !signTransaction || !usdcMint) {
      toast({ title: 'Error', description: 'Initialize the program first' });
      return;
    }

    setMinting(true);
    try {
      const mint = usdcMint;
      const ata = getAssociatedTokenAddressSync(mint, publicKey);

      // Create ATA if needed, then mint
      const tx = new Transaction();

      // Check if ATA exists
      const ataInfo = await connection.getAccountInfo(ata);
      if (!ataInfo) {
        tx.add(
          createAssociatedTokenAccountInstruction(
            publicKey,
            ata,
            publicKey,
            mint
          )
        );
      }

      // Mint 1000 USDC (1000 * 10^6 = 1_000_000_000)
      tx.add(
        createMintToInstruction(
          mint,
          ata,
          publicKey, // mint authority
          1_000_000_000 // 1000 USDC
        )
      );

      tx.feePayer = publicKey;
      tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
      const signedTx = await signTransaction(tx);
      const sig = await connection.sendRawTransaction(signedTx.serialize());
      await connection.confirmTransaction(sig, 'confirmed');

      toast({
        title: 'Minted 1,000 Test USDC',
        description: `Transaction: ${sig.slice(0, 8)}...`,
      });
      await refreshBalances();
    } catch (error: any) {
      console.error('Mint error:', error);
      toast({ title: 'Error', description: error?.message || 'Minting failed' });
    } finally {
      setMinting(false);
    }
  }, [publicKey, signTransaction, usdcMint, connection, toast, refreshBalances]);

  // Airdrop SOL
  const handleAirdrop = useCallback(async () => {
    if (!publicKey) return;
    setAirdropping(true);
    try {
      const sig = await connection.requestAirdrop(publicKey, 2 * LAMPORTS_PER_SOL);
      await connection.confirmTransaction(sig, 'confirmed');
      toast({ title: 'Airdropped 2 SOL', description: `Transaction: ${sig.slice(0, 8)}...` });
      await refreshBalances();
    } catch (error: any) {
      toast({ title: 'Airdrop Failed', description: 'Devnet airdrop may be rate-limited. Try again later.' });
    } finally {
      setAirdropping(false);
    }
  }, [publicKey, connection, toast, refreshBalances]);

  if (!publicKey) {
    return (
      <Layout>
        <section className="py-20 lg:py-28">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-display text-2xl font-bold text-foreground mb-2">Connect Wallet</h1>
            <p className="text-muted-foreground mb-6">Connect to access devnet tools</p>
            <WalletMultiButton />
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-8 lg:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="mb-8">
              <h1 className="font-display text-3xl font-bold text-foreground">Devnet Tools</h1>
              <p className="text-muted-foreground mt-1">
                Setup and testing utilities for Solana Devnet
              </p>
            </div>

            {/* Status Banner */}
            <div className={`rounded-2xl p-5 mb-8 flex items-start gap-3 ${
              initialized
                ? 'bg-success/8 border border-success/20'
                : 'bg-warning/8 border border-warning/20'
            }`}>
              {initialized ? (
                <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-warning mt-0.5 flex-shrink-0" />
              )}
              <div>
                <p className="text-sm font-medium text-foreground">
                  {initialized ? 'Program Initialized' : 'Program Not Initialized'}
                </p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {initialized
                    ? `Global config active. ${totalCircles} circles created. All transactions are real and on-chain.`
                    : 'Click "Initialize Program" below to set up the global config and create a test USDC mint on devnet.'}
                </p>
                {usdcMint && (
                  <p className="text-xs text-muted-foreground mt-2 font-mono break-all">
                    USDC Mint: {usdcMint.toString()}
                  </p>
                )}
              </div>
            </div>

            {/* Balances */}
            <div className="bg-card border border-border rounded-2xl p-6 mb-8">
              <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                <Wallet className="w-5 h-5 text-primary" />
                Your Wallet
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-secondary rounded-xl p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">SOL Balance</p>
                  <p className="font-display text-2xl font-bold text-foreground">{solBalance.toFixed(4)}</p>
                </div>
                <div className="bg-secondary rounded-xl p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Test USDC</p>
                  <p className="font-display text-2xl font-bold text-primary">{usdcBalance.toFixed(2)}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3 font-mono break-all">
                {publicKey.toString()}
              </p>
            </div>

            {/* Action Cards */}
            <div className="grid sm:grid-cols-2 gap-6">
              {/* Initialize Program */}
              {!initialized && (
                <div className="bg-card border border-border rounded-2xl p-6 sm:col-span-2">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Settings className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-display font-semibold text-foreground text-lg mb-2">
                    1. Initialize Program
                  </h3>
                  <p className="text-sm text-muted-foreground mb-5">
                    Creates a test USDC SPL token mint and initializes the GameyaFi global config on-chain.
                    This only needs to be done once.
                  </p>
                  <Button
                    onClick={handleInitialize}
                    disabled={initializing}
                    className="w-full bg-gradient-primary text-primary-foreground font-semibold rounded-xl hover:opacity-90 transition-all"
                  >
                    {initializing ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" /> Initializing...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Settings className="w-4 h-4" /> Initialize Program
                      </span>
                    )}
                  </Button>
                </div>
              )}

              {/* Airdrop SOL */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                  <Wallet className="w-6 h-6 text-accent-foreground" />
                </div>
                <h3 className="font-display font-semibold text-foreground text-lg mb-2">
                  Airdrop SOL
                </h3>
                <p className="text-sm text-muted-foreground mb-5">
                  Get 2 SOL from devnet faucet for gas fees. May be rate-limited.
                </p>
                <Button
                  onClick={handleAirdrop}
                  disabled={airdropping}
                  variant="outline"
                  className="w-full rounded-xl border-accent/30 text-accent-foreground hover:bg-accent/5"
                >
                  {airdropping ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> Airdropping...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Wallet className="w-4 h-4" /> Airdrop 2 SOL
                    </span>
                  )}
                </Button>
              </div>

              {/* Mint Test USDC */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Coins className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-foreground text-lg mb-2">
                  Mint Test USDC
                </h3>
                <p className="text-sm text-muted-foreground mb-5">
                  Mint 1,000 test USDC tokens to your wallet. Real SPL token transfer on devnet.
                </p>
                <Button
                  onClick={handleMint}
                  disabled={minting || !initialized}
                  className="w-full bg-gradient-primary text-primary-foreground font-semibold rounded-xl hover:opacity-90 transition-all"
                >
                  {minting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> Minting...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Coins className="w-4 h-4" /> Mint 1,000 USDC
                    </span>
                  )}
                </Button>
                {!initialized && (
                  <p className="text-xs text-warning mt-2">Initialize program first</p>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="mt-8 bg-primary-muted border border-primary/15 rounded-2xl p-5 flex items-start gap-3">
              <Shield className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">Real On-Chain Transactions</p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Everything runs on Solana Devnet. The USDC mint, circle creation, joining, payments,
                  payouts, reputation tracking - all verified on-chain via the deployed Anchor program.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default DemoTools;