import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';

const NotFound: React.FC = () => {
  return (
    <Layout>
      <section className="py-20 lg:py-32 text-center">
        <div className="container mx-auto px-4">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-muted flex items-center justify-center mb-6">
            <Shield className="w-9 h-9 text-muted-foreground" />
          </div>
          <h1 className="font-display text-5xl font-bold text-foreground mb-3">404</h1>
          <p className="text-lg text-muted-foreground mb-8">
            This page does not exist on-chain or off-chain.
          </p>
          <Link to="/">
            <Button className="bg-gradient-primary text-primary-foreground rounded-xl px-6 py-5 font-semibold hover:opacity-90">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default NotFound;