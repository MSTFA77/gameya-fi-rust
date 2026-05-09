import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Plus, SlidersHorizontal, Loader2, WifiOff } from 'lucide-react';
import Layout from '@/components/Layout';
import CircleCard from '@/components/CircleCard';
import { Button } from '@/components/ui/button';
import { useCircles } from '@/hooks/useGameyaFi';

const filters = [
  { label: 'All', value: 'All' },
  { label: 'Open', value: 'Open' },
  { label: 'Active', value: 'Active' },
  { label: 'Completed', value: 'Completed' },
];

const ExploreCircles: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [search, setSearch] = useState('');
  const { circles, loading, error, refresh } = useCircles();

  const filtered = circles.filter((c) => {
    if (activeFilter !== 'All' && c.statusString !== activeFilter) return false;
    if (search && !c.publicKey.toString().toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <Layout>
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground">
                Explore Circles
              </h1>
              <p className="text-muted-foreground mt-1">
                Browse and join open savings circles on Solana Devnet
              </p>
            </div>
            <Link to="/create">
              <Button className="bg-gradient-primary text-primary-foreground font-semibold px-6 py-5 rounded-xl shadow-glow hover:opacity-90 transition-all">
                <Plus className="w-4 h-4 mr-2" />
                Create Circle
              </Button>
            </Link>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by address..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
            </div>
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-muted-foreground hidden sm:block" />
              {filters.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setActiveFilter(f.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeFilter === f.value
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'bg-secondary text-secondary-foreground hover:bg-muted'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-3 text-muted-foreground">Loading circles from Solana...</span>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="text-center py-20">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-destructive/10 flex items-center justify-center mb-4">
                <WifiOff className="w-7 h-7 text-destructive" />
              </div>
              <h3 className="font-display font-semibold text-foreground mb-2">Connection Error</h3>
              <p className="text-muted-foreground text-sm mb-4">{error}</p>
              <Button variant="outline" onClick={refresh} className="rounded-xl">
                Retry
              </Button>
            </div>
          )}

          {/* Grid */}
          {!loading && !error && filtered.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((item, idx) => (
                <motion.div
                  key={item.publicKey.toString()}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                >
                  <CircleCard circleKey={item.publicKey} circle={item.account} statusString={item.statusString} />
                </motion.div>
              ))}
            </div>
          )}

          {/* Empty */}
          {!loading && !error && filtered.length === 0 && (
            <div className="text-center py-20">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-muted flex items-center justify-center mb-4">
                <Search className="w-7 h-7 text-muted-foreground" />
              </div>
              <h3 className="font-display font-semibold text-foreground mb-2">
                No circles found
              </h3>
              <p className="text-muted-foreground text-sm">
                {circles.length === 0
                  ? 'No circles have been created yet. Be the first!'
                  : 'Try adjusting your filters or create a new circle.'}
              </p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default ExploreCircles;