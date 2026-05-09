import React from 'react';
import Layout from '@/components/Layout';
import HeroSection from '@/components/landing/HeroSection';
import ProblemSection from '@/components/landing/ProblemSection';
import SolutionSection from '@/components/landing/SolutionSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import WhySolanaSection from '@/components/landing/WhySolanaSection';
import CTASection from '@/components/landing/CTASection';

const Index: React.FC = () => {
  return (
    <Layout>
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <HowItWorksSection />
      <WhySolanaSection />
      <CTASection />
    </Layout>
  );
};

export default Index;