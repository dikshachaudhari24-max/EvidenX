'use client';

import { EvidenceStatus } from '@/lib/types';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: EvidenceStatus;
  label?: string;
}

const statusConfig: Record<EvidenceStatus, { bg: string; text: string; label: string }> = {
  secured: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', label: 'Secured' },
  analyzed: { bg: 'bg-blue-500/20', text: 'text-blue-400', label: 'Analyzed' },
  archived: { bg: 'bg-slate-600/20', text: 'text-slate-400', label: 'Archived' },
  compromised: { bg: 'bg-red-500/20', text: 'text-red-400', label: 'Compromised' },
};

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span className={cn('px-2.5 py-1 rounded-full text-xs font-medium', config.bg, config.text)}>
      {label || config.label}
    </span>
  );
}
