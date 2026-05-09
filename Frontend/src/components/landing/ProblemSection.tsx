import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, UserX, Eye, FileSpreadsheet } from 'lucide-react';

const problems = [
  {
    icon: UserX,
    title: 'Default After Payout',
    description:
      'A member receives their lump sum early, then vanishes. Remaining members lose their contributions with no recourse.',
  },
  {
    icon: AlertTriangle,
    title: 'No Enforcement',
    description:
      'No collateral, no escrow, no penalties. Social pressure is the only tool, and it frequently fails.',
  },
  {
    icon: Eye,
    title: 'No Verifiable Reputation',
    description:
      'A defaulter can join another group with zero history. There is no permanent record of reliability.',
  },
  {
    icon: FileSpreadsheet,
    title: 'Manual Tracking',
    description:
      'Payments tracked via WhatsApp messages and spreadsheets. Disputes over who paid and when are common.',
  },
];

const ProblemSection: React.FC = () => {
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
          <span className="inline-block px-3 py-1 rounded-full bg-destructive/10 text-destructive text-sm font-medium mb-4">
            The Problem
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Traditional Savings Groups Are{' '}
            <span className="text-destructive">Broken</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Across the Middle East, Africa, and South Asia, millions rely on informal
            rotating savings circles. But the trust-based model has critical flaws.
          </p>
        </motion.div>

        {/* Problem scenario */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-card border border-border rounded-2xl p-6 sm:p-8 mb-12 shadow-premium"
        >
          <div className="flex items-start gap-4 mb-6">
            <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-foreground text-lg mb-1">
                Real Scenario
              </h3>
              <p className="text-muted-foreground text-sm">
                What happens in a typical 5-person savings group
              </p>
            </div>
          </div>
          <div className="grid sm:grid-cols-4 gap-4">
            {[
              { step: '1', text: '5 members, each contributes 1,000/month', tone: 'muted' },
              { step: '2', text: 'Member A receives 5,000 in Round 1', tone: 'muted' },
              { step: '3', text: 'Member A disappears, stops paying', tone: 'danger' },
              { step: '4', text: 'Remaining 4 members lose their money', tone: 'danger' },
            ].map((item) => (
              <div
                key={item.step}
                className={`rounded-xl p-4 text-center ${
                  item.tone === 'danger'
                    ? 'bg-destructive/5 border border-destructive/15'
                    : 'bg-secondary border border-border'
                }`}
              >
                <span
                  className={`inline-flex w-8 h-8 items-center justify-center rounded-full text-sm font-bold mb-2 ${
                    item.tone === 'danger'
                      ? 'bg-destructive/15 text-destructive'
                      : 'bg-primary/10 text-primary'
                  }`}
                >
                  {item.step}
                </span>
                <p className="text-sm text-foreground leading-snug">{item.text}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Problem cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((problem, idx) => (
            <motion.div
              key={problem.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="bg-card border border-border rounded-xl p-6 hover:shadow-premium transition-all hover:-translate-y-1"
            >
              <div className="w-11 h-11 rounded-lg bg-destructive/8 flex items-center justify-center mb-4">
                <problem.icon className="w-5 h-5 text-destructive" />
              </div>
              <h3 className="font-display font-semibold text-foreground mb-2">
                {problem.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {problem.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;