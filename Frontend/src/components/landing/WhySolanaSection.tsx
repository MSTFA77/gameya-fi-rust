import React from 'react';
import { motion } from 'framer-motion';
import { Zap, DollarSign, Eye, Globe, Lock, Code } from 'lucide-react';

const reasons = [
  {
    icon: Zap,
    title: 'Sub-second Finality',
    stat: '~400ms',
    description: 'Transactions confirm in under a second. No waiting, no uncertainty.',
  },
  {
    icon: DollarSign,
    title: 'Near-zero Fees',
    stat: '<$0.01',
    description: 'Each transaction costs fractions of a cent. Accessible to everyone.',
  },
  {
    icon: Lock,
    title: 'Immutable Escrow',
    stat: 'Trustless',
    description: 'Funds locked in program accounts. No single person controls the pool.',
  },
  {
    icon: Eye,
    title: 'Full Transparency',
    stat: 'On-chain',
    description: 'Every payment, penalty, and payout is verifiable by anyone.',
  },
  {
    icon: Globe,
    title: 'Portable Reputation',
    stat: 'Wallet-bound',
    description: 'Your reputation travels with your wallet address across all circles.',
  },
  {
    icon: Code,
    title: 'No Middleman',
    stat: 'Autonomous',
    description: 'Rules enforced by code. No company or admin can manipulate results.',
  },
];

const WhySolanaSection: React.FC = () => {
  return (
    <section className="py-20 lg:py-28 bg-gradient-hero text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-primary-foreground/10 text-primary-foreground/80 text-sm font-medium mb-4">
            Why Blockchain?
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
            Why <span className="bg-gradient-to-r from-accent to-warning bg-clip-text text-transparent">Solana</span>?
          </h2>
          <p className="text-primary-foreground/60 text-lg max-w-2xl mx-auto">
            A traditional app requires trust in the platform. Solana eliminates the middleman entirely.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((reason, idx) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="rounded-2xl border border-primary-foreground/8 bg-primary-foreground/5 backdrop-blur-sm p-6 hover:bg-primary-foreground/8 transition-all group"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary-foreground/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <reason.icon className="w-5 h-5 text-accent" />
                </div>
                <span className="font-display text-lg font-bold text-accent">{reason.stat}</span>
              </div>
              <h3 className="font-display font-semibold text-primary-foreground mb-2">
                {reason.title}
              </h3>
              <p className="text-sm text-primary-foreground/50 leading-relaxed">
                {reason.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhySolanaSection;