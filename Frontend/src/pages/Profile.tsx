import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User, Star, CheckCircle, XCircle, Users, Calendar,
  TrendingUp, ArrowRight, Loader2, DollarSign,
} from 'lucide-react';
import Layout from '@/components/Layout';
import ReputationScore from '@/components/ReputationScore';
import StatusBadge from '@/components/StatusBadge';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useUserReputation, useCircles, useBalances, useGameyaFiSDK } from '@/hooks/useGameyaFi';

const Profile: React.FC = () => {
  const { connected, publicKey } = useWallet();
  const { reputation, loading: repLoading } = useUserReputation();
  const { circles, loading: circlesLoading } = useCircles();
  const { solBalance, usdcBalance, loading: balLoading } = useBalances();
  const sdk = useGameyaFiSDK();

  if (!connected) {
    return (
      <Layout>
        <section className="py-20 lg:py-28">
          <div className="container mx-auto px-4 text-center">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-muted flex items-center justify-center mb-6">
              <User className="w-9 h-9 text-muted-foreground" />
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground mb-2">
              Connect Your Wallet
            </h1>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
              Connect a Solana wallet to view your on-chain profile, reputation, and circle history.
            </p>
            <WalletMultiButton />
          </div>
        </section>
      </Layout>
    );
  }

  // Filter circles where user is a member
  const userCircles = circles.filter((c) =>
    publicKey && c.account.members.some((m) => m.toString() === publicKey.toString())
  );

  const loading = repLoading || circlesLoading || balLoading;

  const score = reputation?.score ? reputation.score.toNumber() : 100;
  const circlesJoined = reputation?.circlesJoined ?? 0;
  const circlesCompleted = reputation?.circlesCompleted ?? 0;
  const defaultsCount = reputation?.defaultsCount ?? 0;
  const onTimePayments = reputation?.onTimePayments ?? 0;
  const totalContributed = reputation ? (sdk?.smallestToUsdc(reputation.totalContributed) ?? 0) : 0;
  const totalReceived = reputation ? (sdk?.smallestToUsdc(reputation.totalReceived) ?? 0) : 0;

  return (
    <Layout>
      <section className="py-8 lg:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground text-sm">Loading on-chain data...</span>
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="bg-card border border-border rounded-2xl p-6 text-center">
                <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-primary flex items-center justify-center mb-4 shadow-glow">
                  <User className="w-9 h-9 text-primary-foreground" />
                </div>
                <h2 className="font-display text-xl font-bold text-foreground mb-1">
                  {publicKey?.toBase58().slice(0, 4)}...{publicKey?.toBase58().slice(-4)}
                </h2>
                <p className="text-sm text-muted-foreground mb-4">Solana Devnet</p>

                {/* Balances */}
                <div className="flex justify-center gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">SOL</p>
                    <p className="font-display font-bold text-foreground">{solBalance.toFixed(2)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">USDC</p>
                    <p className="font-display font-bold text-primary">{usdcBalance.toFixed(2)}</p>
                  </div>
                </div>

                <div className="flex justify-center mb-6">
                  <ReputationScore score={score} size="lg" showLabel />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-secondary rounded-xl p-3">
                    <div className="flex items-center justify-center gap-1.5 mb-1">
                      <Users className="w-4 h-4 text-primary" />
                    </div>
                    <p className="font-display text-xl font-bold text-foreground">{circlesJoined}</p>
                    <p className="text-xs text-muted-foreground">Joined</p>
                  </div>
                  <div className="bg-secondary rounded-xl p-3">
                    <div className="flex items-center justify-center gap-1.5 mb-1">
                      <CheckCircle className="w-4 h-4 text-success" />
                    </div>
                    <p className="font-display text-xl font-bold text-foreground">{circlesCompleted}</p>
                    <p className="text-xs text-muted-foreground">Completed</p>
                  </div>
                  <div className="bg-secondary rounded-xl p-3">
                    <div className="flex items-center justify-center gap-1.5 mb-1">
                      <XCircle className="w-4 h-4 text-destructive" />
                    </div>
                    <p className="font-display text-xl font-bold text-foreground">{defaultsCount}</p>
                    <p className="text-xs text-muted-foreground">Defaults</p>
                  </div>
                  <div className="bg-secondary rounded-xl p-3">
                    <div className="flex items-center justify-center gap-1.5 mb-1">
                      <TrendingUp className="w-4 h-4 text-primary" />
                    </div>
                    <p className="font-display text-xl font-bold text-foreground">{onTimePayments}</p>
                    <p className="text-xs text-muted-foreground">On-Time</p>
                  </div>
                </div>
              </div>

              {/* Financial Stats */}
              <div className="bg-card border border-border rounded-2xl p-6 mt-6">
                <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-primary" />
                  Financial Summary
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Contributed</span>
                    <span className="font-semibold text-foreground">{totalContributed.toFixed(2)} USDC</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Received</span>
                    <span className="font-semibold text-success">{totalReceived.toFixed(2)} USDC</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Main content */}
            <div className="lg:col-span-2 space-y-6">
              {/* My Circles */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="bg-card border border-border rounded-2xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display font-semibold text-foreground text-lg flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    My Circles (On-Chain)
                  </h2>
                  <Link
                    to="/explore"
                    className="text-sm text-primary font-medium hover:underline flex items-center gap-1"
                  >
                    View All <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
                {userCircles.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground text-sm">You haven't joined any circles yet.</p>
                    <Link to="/explore" className="text-primary text-sm font-medium hover:underline mt-2 inline-block">
                      Explore Circles
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {userCircles.map((item) => {
                      const shortKey = item.publicKey.toString().slice(0, 4) + '...' + item.publicKey.toString().slice(-4);
                      const contribution = sdk?.smallestToUsdc(item.account.contributionAmount) ?? 0;
                      return (
                        <Link
                          key={item.publicKey.toString()}
                          to={`/circle/${item.publicKey.toString()}`}
                          className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors group"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-foreground text-sm">
                                Circle {shortKey}
                              </span>
                              <StatusBadge status={item.statusString as any} />
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {contribution} USDC/round, {item.account.maxMembers} members
                            </p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </Link>
                      );
                    })}
                  </div>
                )}
              </motion.div>

              {/* Reputation Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="bg-card border border-border rounded-2xl p-6"
              >
                <h2 className="font-display font-semibold text-foreground text-lg flex items-center gap-2 mb-4">
                  <Star className="w-5 h-5 text-accent" />
                  Reputation Scoring (On-Chain)
                </h2>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-success/5">
                    <span className="text-muted-foreground">Pay round on time</span>
                    <span className="font-semibold text-success">+2 points</span>
                  </div>
                  <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-success/5">
                    <span className="text-muted-foreground">Claim payout</span>
                    <span className="font-semibold text-success">+5 points</span>
                  </div>
                  <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-success/5">
                    <span className="text-muted-foreground">Complete a circle</span>
                    <span className="font-semibold text-success">+10 points</span>
                  </div>
                  <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-destructive/5">
                    <span className="text-muted-foreground">Default on payment</span>
                    <span className="font-semibold text-destructive">-15 points</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  All reputation data is stored on-chain and tied to your wallet address. Your reputation is portable across all circles.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Profile;