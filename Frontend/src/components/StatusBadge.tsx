import React from 'react';
import type { CircleStatus, PaymentStatus } from '@/lib/types';

interface StatusBadgeProps {
  status: CircleStatus | PaymentStatus;
  size?: 'sm' | 'md';
}

const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
  Open: { bg: 'bg-primary/10', text: 'text-primary', dot: 'bg-primary' },
  Active: { bg: 'bg-success/10', text: 'text-success', dot: 'bg-success' },
  Completed: { bg: 'bg-muted', text: 'text-muted-foreground', dot: 'bg-muted-foreground' },
  Cancelled: { bg: 'bg-destructive/10', text: 'text-destructive', dot: 'bg-destructive' },
  Paid: { bg: 'bg-success/10', text: 'text-success', dot: 'bg-success' },
  Pending: { bg: 'bg-warning/10', text: 'text-warning', dot: 'bg-warning' },
  Late: { bg: 'bg-accent/15', text: 'text-accent-foreground', dot: 'bg-accent' },
  Defaulted: { bg: 'bg-destructive/10', text: 'text-destructive', dot: 'bg-destructive' },
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm' }) => {
  const config = statusConfig[status] ?? statusConfig.Pending;
  const sizeClasses = size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium ${config.bg} ${config.text} ${sizeClasses}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {status}
    </span>
  );
};

export default StatusBadge;