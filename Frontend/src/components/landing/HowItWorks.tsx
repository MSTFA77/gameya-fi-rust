import React from 'react';
import { motion } from 'framer-motion';
import { Plus, UserPlus, Coins, Gift, ArrowDown } from 'lucide-react';

const steps = [
  {
    icon: Plus,
    number: '01',
    title: 'Create a Circle',
    description:
      'Set contribution amount, security deposit, member count, and round duration. Your circle goes live on Solana.',
  },
  {
    icon: UserPlus,
    number: '02',
    title: 'Members Join & Deposit',
    description:
      'Each member locks a security deposit into the smart contract. When all slots fill, the circle auto-starts.',
  },
  {
    icon: Coins,
    number: '03',
    title: 'Contribute Each Round',
    description:
      'Every round, all members pay their contribution. Payments are tracked on-chain with full transparency.',
  },
  {
    icon: Gift,
    number: '04',
    title: 'Receive Your Payout',
    description:
      'The designated member claims the pooled amount. Rounds rotate until everyone receives their payout.',
  },
];

const HowItWorksSection: React.FC = () => {
  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-accent-muted text-accent-foreground text-sm font-medium mb-4">
            How It Works
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Simple as <span className="text-gradient-accent">1-2-3-4</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            The same rotating savings group you know, now secured by Solana smart contracts.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          {steps.map((step, idx) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.12 }}
            >
              <div className="flex gap-6 items-start">
                {/* Timeline */}
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow">
                    <step.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  {idx < steps.length - 1 && (
                    <div className="w-px h-16 bg-border my-2 flex items-center justify-center relative">
                      <ArrowDown className="w-3 h-3 text-muted-foreground absolute" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="pb-8">
                  <span className="text-xs font-bold text-primary tracking-wider">
                    STEP {step.number}
                  </span>
                  <h3 className="font-display text-xl font-semibold text-foreground mt-1 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;