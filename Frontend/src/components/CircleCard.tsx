import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Users, Clock, DollarSign, Shield, ArrowRight } from 'lucide-react';
import type { CircleData } from '@/lib/gameyafi';
import { GameyaFiSDK } from '@/lib/gameyafi';
import StatusBadge from './StatusBadge';
import { PublicKey } from '@solana/web3.js';

interface CircleCardProps {
  circleKey: PublicKey;
  circle: CircleData;
  statusString: string;
}

const CircleCard: React.FC<CircleCardProps> = ({ circleKey, circle, statusString }) => {
  const sdk = useMemo(() => {
    // Create a temporary instance just for conversion helpers
    return { smallestToUsdc: (v: any) => {
      try { return typeof v === 'number' ? v / 1e6 : v.toNumber() / 1e6; } catch { return 0; }
    }};
  }, []);

  const contribution = sdk.smallestToUsdc(circle.contributionAmount);
  const deposit = sdk.smallestToUsdc(circle.securityDeposit);
  const totalPayout = contribution * circle.maxMembers;
  const roundDurationSec = typeof circle.roundDuration === 'number' ? circle.roundDuration : circle.roundDuration.toNumber();

  const progress =
    statusString === 'Active'
      ? Math.round((circle.currentRound / circle.totalRounds) * 100)
      : statusString === 'Completed'
      ? 100
      : 0;

  const shortAddress = circleKey.toString().slice(0, 4) + '...' + circleKey.toString().slice(-4);

  return (
    <Link to={`/circle/${circleKey.toString()}`} className="block group">
      <div className="bg-card border border-border rounded-2xl p-6 hover:shadow-premium transition-all hover:-translate-y-1 h-full">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors">
              Circle {shortAddress}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              by {circle.authority.toString().slice(0, 4)}...{circle.authority.toString().slice(-4)}
            </p>
          </div>
          <StatusBadge status={statusString as any} />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/8 flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Contribution</p>
              <p className="text-sm font-semibold text-foreground">{contribution} USDC</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
              <Shield className="w-4 h-4 text-accent-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Deposit</p>
              <p className="text-sm font-semibold text-foreground">{deposit} USDC</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-success/8 flex items-center justify-center">
              <Users className="w-4 h-4 text-success" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Members</p>
              <p className="text-sm font-semibold text-foreground">
                {circle.currentMembers}/{circle.maxMembers}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
              <Clock className="w-4 h-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Round</p>
              <p className="text-sm font-semibold text-foreground">
                {roundDurationSec >= 3600
                  ? `${Math.round(roundDurationSec / 3600)}h`
                  : `${Math.round(roundDurationSec / 60)}m`}
              </p>
            </div>
          </div>
        </div>

        {/* Progress */}
        {statusString !== 'Open' && (
          <div className="mb-4">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-muted-foreground">
                Round {circle.currentRound}/{circle.totalRounds}
              </span>
              <span className="font-medium text-foreground">{progress}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-primary transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Payout amount */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div>
            <p className="text-xs text-muted-foreground">Total Payout</p>
            <p className="font-display font-bold text-foreground">
              {totalPayout} USDC
            </p>
          </div>
          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary/10 transition-colors">
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CircleCard;