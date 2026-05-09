import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, DollarSign, Shield, Users, Clock, Info, Loader2 } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useGameyaFiSDK, useGlobalState } from '@/hooks/useGameyaFi';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

interface FormState {
  contributionAmount: string;
  securityDeposit: string;
  maxMembers: string;
  roundDuration: string;
}

interface FormErrors {
  contributionAmount?: string;
  securityDeposit?: string;
  maxMembers?: string;
  roundDuration?: string;
}

const CreateCircle: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const sdk = useGameyaFiSDK();
  const { connected } = useWallet();
  const { initialized, loading: globalLoading } = useGlobalState();
  const [form, setForm] = useState<FormState>({
    contributionAmount: '',
    securityDeposit: '',
    maxMembers: '',
    roundDuration: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  function validate(): boolean {
    const errs: FormErrors = {};
    const contribution = parseFloat(form.contributionAmount);
    const deposit = parseFloat(form.securityDeposit);
    const members = parseInt(form.maxMembers);
    const duration = parseInt(form.roundDuration);

    if (!contribution || contribution < 0.01) errs.contributionAmount = 'Min 0.01 USDC';
    if (!deposit || deposit <= 0) errs.securityDeposit = 'Must be greater than 0';
    if (!members || members < 2 || members > 10) errs.maxMembers = 'Between 2 and 10';
    if (!duration || duration < 60) errs.roundDuration = 'Min 60 seconds';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    if (!sdk) {
      toast({ title: 'Error', description: 'Please connect your wallet first' });
      return;
    }
    if (!initialized) {
      toast({ title: 'Error', description: 'Program not initialized. Go to Demo Tools first.' });
      return;
    }

    setSubmitting(true);
    try {
      const result = await sdk.initializeCircle({
        contributionAmount: parseFloat(form.contributionAmount),
        securityDeposit: parseFloat(form.securityDeposit),
        maxMembers: parseInt(form.maxMembers),
        roundDuration: parseInt(form.roundDuration),
      });

      if (result.success && result.data) {
        toast({
          title: 'Circle Created',
          description: `Transaction: ${result.data.signature.slice(0, 8)}...`,
        });
        navigate(`/circle/${result.data.circlePDA}`);
      } else {
        toast({ title: 'Error', description: result.error || 'Failed to create circle' });
      }
    } catch (error: any) {
      toast({ title: 'Error', description: error?.message || 'Transaction failed' });
    } finally {
      setSubmitting(false);
    }
  }

  function handleChange(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  const contribution = parseFloat(form.contributionAmount) || 0;
  const members = parseInt(form.maxMembers) || 0;
  const totalPayout = contribution * members;

  if (!connected) {
    return (
      <Layout>
        <section className="py-20 lg:py-28">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-display text-2xl font-bold text-foreground mb-2">
              Connect Your Wallet
            </h1>
            <p className="text-muted-foreground mb-6">Connect to create a savings circle on Solana</p>
            <WalletMultiButton />
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-8 lg:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <Link
            to="/explore"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Explore
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="mb-8">
              <h1 className="font-display text-3xl font-bold text-foreground">Create Circle</h1>
              <p className="text-muted-foreground mt-1">
                Set up a new rotating savings circle on Solana Devnet
              </p>
              {!initialized && !globalLoading && (
                <div className="mt-3 bg-warning/10 text-warning border border-warning/20 rounded-xl p-3 text-sm">
                  Program not initialized yet. Visit <Link to="/demo" className="underline font-medium">Demo Tools</Link> to set up.
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-6">
                {/* Contribution Amount */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                    <DollarSign className="w-4 h-4 text-primary" />
                    Contribution Amount (USDC)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="10"
                    value={form.contributionAmount}
                    onChange={(e) => handleChange('contributionAmount', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl bg-background border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all ${
                      errors.contributionAmount ? 'border-destructive' : 'border-border focus:border-primary'
                    }`}
                  />
                  {errors.contributionAmount && (
                    <p className="text-xs text-destructive mt-1.5">{errors.contributionAmount}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1.5">
                    Amount each member pays per round (on-chain USDC transfer)
                  </p>
                </div>

                {/* Security Deposit */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                    <Shield className="w-4 h-4 text-accent-foreground" />
                    Security Deposit (USDC)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="5"
                    value={form.securityDeposit}
                    onChange={(e) => handleChange('securityDeposit', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl bg-background border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all ${
                      errors.securityDeposit ? 'border-destructive' : 'border-border focus:border-primary'
                    }`}
                  />
                  {errors.securityDeposit && (
                    <p className="text-xs text-destructive mt-1.5">{errors.securityDeposit}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1.5">
                    USDC collateral locked in smart contract. Penalties deducted on default.
                  </p>
                </div>

                {/* Max Members */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                    <Users className="w-4 h-4 text-success" />
                    Number of Members
                  </label>
                  <input
                    type="number"
                    min="2"
                    max="10"
                    step="1"
                    placeholder="3"
                    value={form.maxMembers}
                    onChange={(e) => handleChange('maxMembers', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl bg-background border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all ${
                      errors.maxMembers ? 'border-destructive' : 'border-border focus:border-primary'
                    }`}
                  />
                  {errors.maxMembers && (
                    <p className="text-xs text-destructive mt-1.5">{errors.maxMembers}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1.5">
                    Circle auto-starts when all slots are filled (2-10 members)
                  </p>
                </div>

                {/* Round Duration */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    Round Duration (seconds)
                  </label>
                  <input
                    type="number"
                    min="60"
                    step="1"
                    placeholder="300"
                    value={form.roundDuration}
                    onChange={(e) => handleChange('roundDuration', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl bg-background border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all ${
                      errors.roundDuration ? 'border-destructive' : 'border-border focus:border-primary'
                    }`}
                  />
                  {errors.roundDuration && (
                    <p className="text-xs text-destructive mt-1.5">{errors.roundDuration}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1.5">
                    On-chain deadline enforced by smart contract (min 60s)
                  </p>
                </div>
              </div>

              {/* Summary */}
              {totalPayout > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-primary-muted border border-primary/15 rounded-2xl p-6"
                >
                  <h3 className="font-display font-semibold text-foreground flex items-center gap-2 mb-3">
                    <Info className="w-4 h-4 text-primary" /> Circle Summary
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Total Payout Per Round</p>
                      <p className="font-display font-bold text-foreground">{totalPayout} USDC</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Total Rounds</p>
                      <p className="font-display font-bold text-foreground">{members}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Each Member Pays</p>
                      <p className="font-display font-bold text-foreground">{contribution * members} USDC total</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Security Deposit</p>
                      <p className="font-display font-bold text-foreground">{form.securityDeposit || '0'} USDC (refundable)</p>
                    </div>
                  </div>
                </motion.div>
              )}

              <Button
                type="submit"
                disabled={submitting || !initialized}
                className="w-full bg-gradient-primary text-primary-foreground font-semibold py-6 rounded-xl shadow-glow hover:opacity-90 transition-all text-base"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating on Solana...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Create Circle (On-Chain)
                  </span>
                )}
              </Button>
            </form>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default CreateCircle;