import React from 'react';
import { Star } from 'lucide-react';

interface ReputationScoreProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

function getScoreColor(score: number): string {
  if (score >= 120) return 'text-success';
  if (score >= 100) return 'text-primary';
  if (score >= 80) return 'text-warning';
  return 'text-destructive';
}

function getScoreBg(score: number): string {
  if (score >= 120) return 'bg-success/10';
  if (score >= 100) return 'bg-primary/10';
  if (score >= 80) return 'bg-warning/10';
  return 'bg-destructive/10';
}

function getScoreLabel(score: number): string {
  if (score >= 130) return 'Excellent';
  if (score >= 110) return 'Good';
  if (score >= 100) return 'Neutral';
  if (score >= 80) return 'Caution';
  return 'Risk';
}

const ReputationScore: React.FC<ReputationScoreProps> = ({
  score,
  size = 'sm',
  showLabel = false,
}) => {
  const sizeMap = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-sm px-3 py-1 gap-1.5',
    lg: 'text-base px-4 py-1.5 gap-2',
  };
  const iconSize = { sm: 'w-3 h-3', md: 'w-4 h-4', lg: 'w-5 h-5' };

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold ${getScoreBg(score)} ${getScoreColor(score)} ${sizeMap[size]}`}
    >
      <Star className={iconSize[size]} />
      {score}
      {showLabel && <span className="font-normal ml-0.5">({getScoreLabel(score)})</span>}
    </span>
  );
};

export default ReputationScore;