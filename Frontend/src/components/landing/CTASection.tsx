import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CTASection: React.FC = () => {
  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl bg-gradient-primary overflow-hidden"
        >
          {/* Background elements */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-primary-foreground/5 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-accent/10 blur-3xl" />

          <div className="relative px-8 py-16 sm:px-16 sm:py-20 text-center">
            <div className="inline-flex w-16 h-16 items-center justify-center rounded-2xl bg-primary-foreground/10 mb-6">
              <Shield className="w-8 h-8 text-primary-foreground" />
            </div>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">
              Ready to Secure Your Savings Circle?
            </h2>
            <p className="text-primary-foreground/70 text-lg max-w-xl mx-auto mb-8">
              Join the trustless savings revolution. Create or join a circle today and
              experience transparent, enforceable group savings on Solana.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/create">
                <Button
                  className="bg-gradient-accent text-accent-foreground font-semibold px-8 py-6 text-base rounded-xl shadow-accent-glow hover:opacity-90 transition-all hover:-translate-y-0.5"
                >
                  Create Your Circle
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/explore">
                <Button
                  variant="outline"
                  className="border-primary-foreground/20 text-primary-foreground bg-primary-foreground/5 hover:bg-primary-foreground/10 hover:text-primary-foreground px-8 py-6 text-base rounded-xl"
                >
                  Browse Open Circles
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;