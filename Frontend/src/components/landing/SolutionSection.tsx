import React from 'react';
import { motion } from 'framer-motion';
import { Lock, RotateCcw, AlertCircle, Star } from 'lucide-react';

const pillars = [
  {
    icon: Lock,
    title: 'Smart Escrow',
    description:
      'Funds are held in Solana program accounts instead of a single person. No one can steal or manipulate the pool.',
    color: 'primary',
  },
  {
    icon: RotateCcw,
    title: 'Automated Rounds',
    description:
      'Each round tracks contributions, designates recipients, and enforces deadlines automatically via on-chain logic.',
    color: 'accent',
  },
  {
    icon: AlertCircle,
    title: 'Penalty System',
    description:
      'Late payments trigger automatic penalty deductions from security deposits. Rules are code, not promises.',
    color: 'destructive',
  },
  {
    icon: Star,
    title: 'On-Chain Reputation',
    description:
      'Every action is recorded. Pay on time and your reputation grows. Default and it decreases for everyone to see.',
    color: 'success',
  },
];

const SolutionSection: React.FC = () => {
  return (
    <section className="py-20 lg:py-28 bg-secondary/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            The Solution
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Trust Replaced by{' '}
            <span className="text-gradient-primary">Code</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            GameyaFi adds a security and transparency layer on top of an existing financial
            habit. We don't change behavior, we protect it.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6 lg:gap-8">
          {pillars.map((pillar, idx) => {
            const bgMap: Record<string, string> = {
              primary: 'bg-primary/8',
              accent: 'bg-accent/10',
              destructive: 'bg-destructive/8',
              success: 'bg-success/10',
            };
            const textMap: Record<string, string> = {
              primary: 'text-primary',
              accent: 'text-accent-foreground',
              destructive: 'text-destructive',
              success: 'text-success',
            };

            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-card border border-border rounded-2xl p-8 hover:shadow-premium transition-all hover:-translate-y-1 group"
              >
                <div className={`w-14 h-14 rounded-xl ${bgMap[pillar.color]} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <pillar.icon className={`w-7 h-7 ${textMap[pillar.color]}`} />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                  {pillar.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {pillar.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <blockquote className="inline-block bg-card border border-border rounded-2xl px-8 py-6 shadow-premium">
            <p className="font-display text-xl sm:text-2xl font-semibold text-foreground italic">
              "GameyaFi turns social trust into{' '}
              <span className="text-gradient-primary">programmable trust</span>."
            </p>
          </blockquote>
        </motion.div>
      </div>
    </section>
  );
};

export default SolutionSection;