import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Users, DollarSign, Clock, Shield, CheckCircle, AlertTriangle,
  XCircle, Timer, Crown, Loader2,
} from 'lucide-react';
import Layout from '@/components/Layout';
import StatusBadge from '@/components/StatusBadge';
import ReputationScore from '@/components/ReputationScore';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useCircleDetails, useGameyaFiSDK } from '@/hooks/useGameyaFi';
import { useWallet } from '@solana/wallet-adapter-react';

function formatCountdown(ms: number): string {
  if (ms <= 0) return 'Expired';
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}m ${seconds}s`;
}

function shortAddr(addr: string): string {
  return addr.slice(0, 4) + '...' + addr.slice(-4);
}

const CircleDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { publicKey } = useWallet();
  const sdk = useGameyaFiSDK();
  const {
    circle, roundState, memberRecords, reputations, myPaymentDone,
    loading, error, statusString, circlePDA, refresh,
  } = useCircleDetails(id);

  const [countdown, setCountdown] = useState(0);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Countdown timer
  useEffect(() => {
    if (!circle || statusString !== 'Active') return;
    const roundStartedAt = typeof circle.roundStartedAt === 'number'
      ? circle.roundStartedAt
      : circle.roundStartedAt.toNumber();
    const roundDuration = typeof circle.roundDuration === 'number'
      ? circle.roundDuration
      : circle.roundDuration.toNumber();
    const deadline = (roundStartedAt + roundDuration) * 1000;

    const interval = setInterval(() => {
      setCountdown(Math.max(0, deadline - Date.now()));
    }, 1000);
    setCountdown(Math.max(0, deadline - Date.now()));
    return () => clearInterval(interval);
  }, [circle, statusString]);

  const toUsdc = (v: any) => {
    try { return typeof v === 'number' ? v / 1e6 : v.toNumber() / 1e6; } catch { return 0; }
  };

  const contribution = circle ? toUsdc(circle.contributionAmount) : 0;
  const deposit = circle ? toUsdc(circle.securityDeposit) : 0;
  const totalPayout = contribution * (circle?.maxMembers || 0);
  const roundDurationSec = circle
    ? (typeof circle.roundDuration === 'number' ? circle.roundDuration : circle.roundDuration.toNumber())
    : 0;

  // Current round recipient
  const recipientAddress = useMemo(() => {
    if (!circle || !circle.payoutOrder || circle.currentRound >= circle.payoutOrder.length) return null;
    return circle.payoutOrder[circle.currentRound];
  }, [circle]);

  const paidCount = roundState?.paymentsCount || 0;
  const isMyTurn = publicKey && recipientAddress && recipientAddress.toString() === publicKey.toString();
  const isMember = publicKey && circle?.members.some(m => m.toString() === publicKey.toString());
  const progress = statusString === 'Completed' ? 100 : circle ? Math.round((circle.currentRound / circle.totalRounds) * 100) : 0;

  // Action handlers
  async function handleAction(action: string) {
    if (!sdk || !circlePDA) return;
    setActionLoading(action);
    try {
      let result;
      switch (action) {
        case 'join':
          result = await sdk.joinCircle(circlePDA);
          break;
        case 'pay':
          result = await sdk.payRound(circlePDA);
          break;
        case 'claim':
          result = await sdk.claimPayout(circlePDA);
          break;
        case 'advance':
          result = await sdk.advanceRound(circlePDA);
          break;
        case 'refund':
          result = await sdk.refundDeposit(circlePDA);
          break;
        default:
          if (action.startsWith('default:')) {
            const defaulter = action.split(':')[1];
            const { PublicKey } = await import('@solana/web3.js');
            result = await sdk.markDefault(circlePDA, new PublicKey(defaulter));
          }
      }
      if (result?.success) {
        toast({ title: 'Success', description: `Transaction: ${result.data?.signature.slice(0, 8)}...` });
        setTimeout(() => refresh(), 2000);
      } else {
        toast({ title: 'Error', description: result?.error || 'Transaction failed' });
      }
    } catch (e: any) {
      toast({ title: 'Error', description: e?.message || 'Transaction failed' });
    } finally {
      setActionLoading(null);
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-3 text-muted-foreground">Loading circle from Solana...</span>
        </div>
      </Layout>
    );
  }

  if (error || !circle) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">Circle Not Found</h2>
          <p className="text-muted-foreground mb-6">{error || 'The circle does not exist on-chain.'}</p>
          <Link to="/explore">
            <Button variant="outline" className="rounded-xl">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Explore
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-8 lg:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/explore" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Explore
          </Link>

          {/* Title */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
                  Circle {shortAddr(circlePDA?.toString() || '')}
                </h1>
                <StatusBadge status={statusString as any} size="md" />
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Created by {shortAddr(circle.authority.toString())}
              </p>
            </div>
            {statusString === 'Open' && !isMember && (
              <Button
                onClick={() => handleAction('join')}
                disabled={!!actionLoading}
                className="bg-gradient-primary text-primary-foreground font-semibold px-6 py-5 rounded-xl shadow-glow hover:opacity-90 transition-all"
              >
                {actionLoading === 'join' ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Users className="w-4 h-4 mr-2" />}
                Join Circle
              </Button>
            )}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Stats cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { icon: DollarSign, label: 'Contribution', value: `${contribution} USDC`, color: 'primary' },
                  { icon: Shield, label: 'Deposit', value: `${deposit} USDC`, color: 'accent' },
                  { icon: Users, label: 'Members', value: `${circle.currentMembers}/${circle.maxMembers}`, color: 'success' },
                  { icon: Clock, label: 'Round Duration', value: roundDurationSec >= 3600 ? `${Math.round(roundDurationSec / 3600)}h` : `${Math.round(roundDurationSec / 60)}m`, color: 'muted' },
                ].map((stat) => {
                  const bgMap: Record<string, string> = { primary: 'bg-primary/8', accent: 'bg-accent/10', success: 'bg-success/8', muted: 'bg-muted' };
                  const iconColor: Record<string, string> = { primary: 'text-primary', accent: 'text-accent-foreground', success: 'text-success', muted: 'text-muted-foreground' };
                  return (
                    <div key={stat.label} className="bg-card border border-border rounded-xl p-4">
                      <div className={`w-9 h-9 rounded-lg ${bgMap[stat.color]} flex items-center justify-center mb-3`}>
                        <stat.icon className={`w-4 h-4 ${iconColor[stat.color]}`} />
                      </div>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                      <p className="font-display font-bold text-foreground text-lg">{stat.value}</p>
                    </div>
                  );
                })}
              </div>

              {/* Current Round */}
              {statusString === 'Active' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-2xl p-6">
                  <h2 className="font-display font-semibold text-foreground text-lg mb-4 flex items-center gap-2">
                    <Timer className="w-5 h-5 text-primary" />
                    Current Round (On-Chain)
                  </h2>

                  <div className="grid sm:grid-cols-3 gap-4 mb-5">
                    <div className="bg-secondary rounded-xl p-4 text-center">
                      <p className="text-xs text-muted-foreground mb-1">Round</p>
                      <p className="font-display text-2xl font-bold text-foreground">
                        {circle.currentRound + 1}/{circle.totalRounds}
                      </p>
                    </div>
                    <div className="bg-accent-muted rounded-xl p-4 text-center">
                      <p className="text-xs text-muted-foreground mb-1">Recipient</p>
                      <div className="flex items-center justify-center gap-1.5">
                        <Crown className="w-4 h-4 text-accent" />
                        <p className="font-display text-lg font-bold text-foreground">
                          {recipientAddress ? shortAddr(recipientAddress.toString()) : '—'}
                        </p>
                      </div>
                      {isMyTurn && <p className="text-xs text-success font-medium mt-1">That's you!</p>}
                    </div>
                    <div className="bg-primary-muted rounded-xl p-4 text-center">
                      <p className="text-xs text-muted-foreground mb-1">Deadline</p>
                      <p className={`font-display text-lg font-bold ${countdown <= 0 ? 'text-destructive' : 'text-foreground'}`}>
                        {formatCountdown(countdown)}
                      </p>
                    </div>
                  </div>

                  {/* Payment progress */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Payments Collected</span>
                      <span className="font-semibold text-foreground">
                        {paidCount}/{circle.maxMembers - 1} ({paidCount * contribution}/{totalPayout - contribution} USDC)
                      </span>
                    </div>
                    <div className="h-3 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-primary transition-all"
                        style={{ width: `${(paidCount / Math.max(circle.maxMembers - 1, 1)) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3 mt-5 pt-5 border-t border-border">
                    {isMember && !isMyTurn && !myPaymentDone && (
                      <Button
                        onClick={() => handleAction('pay')}
                        disabled={!!actionLoading}
                        className="bg-gradient-primary text-primary-foreground rounded-xl hover:opacity-90"
                      >
                        {actionLoading === 'pay' ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <DollarSign className="w-4 h-4 mr-1.5" />}
                        Pay Round
                      </Button>
                    )}
                    {myPaymentDone && !isMyTurn && (
                      <span className="inline-flex items-center gap-1.5 px-4 py-2 text-sm text-success bg-success/10 rounded-xl">
                        <CheckCircle className="w-4 h-4" /> Paid
                      </span>
                    )}
                    {isMyTurn && paidCount >= circle.maxMembers - 1 && !roundState?.payoutClaimed && (
                      <Button
                        onClick={() => handleAction('claim')}
                        disabled={!!actionLoading}
                        className="bg-gradient-accent text-accent-foreground rounded-xl hover:opacity-90"
                      >
                        {actionLoading === 'claim' ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-1.5" />}
                        Claim Payout ({totalPayout - contribution} USDC)
                      </Button>
                    )}
                    {roundState?.payoutClaimed && (
                      <Button
                        onClick={() => handleAction('advance')}
                        disabled={!!actionLoading}
                        className="bg-secondary text-secondary-foreground rounded-xl hover:bg-muted"
                      >
                        {actionLoading === 'advance' ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <Timer className="w-4 h-4 mr-1.5" />}
                        Advance Round
                      </Button>
                    )}
                    {countdown <= 0 && !roundState?.payoutClaimed && (
                      <Button
                        variant="outline"
                        disabled={!!actionLoading}
                        className="rounded-xl border-destructive/30 text-destructive hover:bg-destructive/5 hover:text-destructive"
                      >
                        <AlertTriangle className="w-4 h-4 mr-1.5" /> Deadline Passed
                      </Button>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Completed: refund */}
              {statusString === 'Completed' && isMember && (
                <div className="bg-success/5 border border-success/20 rounded-2xl p-6 text-center">
                  <CheckCircle className="w-8 h-8 text-success mx-auto mb-3" />
                  <h3 className="font-display font-semibold text-foreground mb-2">Circle Completed</h3>
                  <p className="text-sm text-muted-foreground mb-4">Claim your security deposit refund.</p>
                  <Button
                    onClick={() => handleAction('refund')}
                    disabled={!!actionLoading}
                    className="bg-gradient-primary text-primary-foreground rounded-xl"
                  >
                    {actionLoading === 'refund' ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Shield className="w-4 h-4 mr-2" />}
                    Refund Deposit
                  </Button>
                </div>
              )}

              {/* Members */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <h2 className="font-display font-semibold text-foreground text-lg mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Members ({circle.currentMembers})
                </h2>
                <div className="space-y-3">
                  {circle.members.map((member, idx) => {
                    const addr = member.toString();
                    const memberRecord = memberRecords.get(addr);
                    const rep = reputations.get(addr);
                    const isRecipient = recipientAddress && addr === recipientAddress.toString();
                    const isCreator = addr === circle.authority.toString();

                    return (
                      <motion.div
                        key={addr}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className={`flex items-center justify-between py-3 px-4 rounded-xl ${
                          isRecipient && statusString === 'Active' ? 'bg-accent-muted border border-accent/20' : 'bg-secondary/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                            isRecipient ? 'bg-gradient-accent text-accent-foreground' : 'bg-primary/10 text-primary'
                          }`}>
                            {isRecipient ? <Crown className="w-4 h-4" /> : `#${idx + 1}`}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-foreground">
                                {shortAddr(addr)}
                              </span>
                              {isCreator && (
                                <span className="text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary">Creator</span>
                              )}
                              {publicKey && addr === publicKey.toString() && (
                                <span className="text-xs px-1.5 py-0.5 rounded bg-success/10 text-success">You</span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Deposit: {memberRecord ? toUsdc(memberRecord.depositLocked) : deposit} USDC
                              {memberRecord?.defaulted && ' | Defaulted'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {rep && <ReputationScore score={rep.score.toNumber()} size="sm" />}
                          {memberRecord?.defaulted && <XCircle className="w-4 h-4 text-destructive" />}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right sidebar */}
            <div className="space-y-6">
              {/* Circle Info */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="font-display font-semibold text-foreground mb-4">Circle Info</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Status</span>
                    <StatusBadge status={statusString as any} />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Payout</span>
                    <span className="font-semibold text-foreground">{totalPayout} USDC</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Rounds</span>
                    <span className="font-semibold text-foreground">{circle.totalRounds}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-semibold text-foreground">{progress}%</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground break-all">
                    PDA: {circlePDA?.toString()}
                  </p>
                </div>
              </div>

              {/* On-Chain Badge */}
              <div className="bg-primary-muted border border-primary/15 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-primary" />
                  <span className="font-display font-semibold text-foreground text-sm">On-Chain Verified</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  All data is fetched from Solana Devnet. Transactions are real and verifiable on-chain.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CircleDetails;