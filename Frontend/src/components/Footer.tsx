import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Github, ExternalLink } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Shield className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-lg text-foreground">
                Gameya<span className="text-gradient-primary">Fi</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              Trustless rotating savings circles on Solana. Replace social trust with
              programmable trust powered by smart contracts and on-chain reputation.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-sm text-foreground mb-3">
              Navigate
            </h4>
            <div className="flex flex-col gap-2">
              <Link to="/explore" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Explore Circles
              </Link>
              <Link to="/create" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Create Circle
              </Link>
              <Link to="/profile" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                My Profile
              </Link>
              <Link to="/demo" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Demo Tools
              </Link>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-display font-semibold text-sm text-foreground mb-3">
              Resources
            </h4>
            <div className="flex flex-col gap-2">
              <a
                href="https://solana.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
              >
                Solana <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="https://phantom.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
              >
                Phantom Wallet <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
              >
                GitHub <Github className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              Built on Solana. Hackathon MVP.
            </p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>Powered by</span>
              <span className="font-semibold text-primary">Solana Devnet</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;