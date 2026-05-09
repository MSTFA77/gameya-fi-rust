import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Users, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-hero min-h-[90vh] flex items-center">
      {/* Mesh overlay */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-primary-glow/10 blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-accent/5 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20 lg:py-0">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 border border-primary-foreground/10 mb-6">
              <Zap className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-primary-foreground/80">
                Built on Solana
              </span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight mb-6">
              Your Savings Circle,{' '}
              <span className="bg-gradient-to-r from-accent to-warning bg-clip-text text-transparent">
                Guaranteed by Code
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-primary-foreground/70 leading-relaxed mb-8 max-w-xl">
              GameyaFi transforms traditional rotating savings groups into a trustless,
              transparent system powered by Solana smart contracts and on-chain reputation.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/create">
                <Button
                  className="bg-gradient-accent text-accent-foreground font-semibold px-8 py-6 text-base rounded-xl shadow-accent-glow hover:opacity-90 transition-all hover:-translate-y-0.5"
                >
                  Create Circle
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/explore">
                <Button
                  variant="outline"
                  className="border-primary-foreground/20 text-primary-foreground bg-primary-foreground/5 hover:bg-primary-foreground/10 hover:text-primary-foreground px-8 py-6 text-base rounded-xl transition-all"
                >
                  Explore Circles
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-10 pt-8 border-t border-primary-foreground/10">
              <div>
                <p className="font-display text-2xl font-bold text-primary-foreground">$12.5k</p>
                <p className="text-sm text-primary-foreground/50">Total Pooled</p>
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-primary-foreground">48</p>
                <p className="text-sm text-primary-foreground/50">Active Members</p>
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-primary-foreground">15</p>
                <p className="text-sm text-primary-foreground/50">Circles Created</p>
              </div>
            </div>
          </motion.div>

          {/* Right Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="hidden lg:block"
          >
            <div className="relative">
              {/* Main card */}
              <div className="rounded-2xl border border-primary-foreground/10 bg-primary-foreground/5 backdrop-blur-xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-gradient-accent flex items-center justify-center">
                    <Users className="w-5 h-5 text-accent-foreground" />
                  </div>
                  <div>
                    <p className="font-display font-semibold text-primary-foreground">Community Circle</p>
                    <p className="text-sm text-primary-foreground/50">5 members, Round 3/5</p>
                  </div>
                </div>

                {/* Progress */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-primary-foreground/60">Round Progress</span>
                    <span className="text-accent font-semibold">4/5 Paid</span>
                  </div>
                  <div className="h-2 rounded-full bg-primary-foreground/10 overflow-hidden">
                    <div className="h-full w-4/5 rounded-full bg-gradient-accent" />
                  </div>
                </div>

                {/* Members */}
                <div className="space-y-3">
                  {[
                    { name: 'Alice', status: 'Paid', rep: 117, color: 'bg-success' },
                    { name: 'Bob', status: 'Paid', rep: 112, color: 'bg-success' },
                    { name: 'Carol', status: 'Recipient', rep: 104, color: 'bg-accent' },
                    { name: 'Dave', status: 'Paid', rep: 87, color: 'bg-success' },
                    { name: 'Eve', status: 'Pending', rep: 68, color: 'bg-warning' },
                  ].map((m) => (
                    <div
                      key={m.name}
                      className="flex items-center justify-between py-2 px-3 rounded-lg bg-primary-foreground/5"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${m.color}`} />
                        <span className="text-sm font-medium text-primary-foreground/80">
                          {m.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-primary-foreground/40">Rep: {m.rep}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-primary-foreground/10 text-primary-foreground/60">
                          {m.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating badge */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-4 -right-4 bg-gradient-accent rounded-xl px-4 py-3 shadow-accent-glow"
              >
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-accent-foreground" />
                  <span className="text-sm font-bold text-accent-foreground">Trustless</span>
                </div>
              </motion.div>

              {/* Floating stat */}
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute -bottom-3 -left-4 bg-card border border-border rounded-xl px-4 py-3 shadow-premium"
              >
                <p className="text-xs text-muted-foreground">Next Payout</p>
                <p className="text-lg font-display font-bold text-foreground">50 USDC</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;