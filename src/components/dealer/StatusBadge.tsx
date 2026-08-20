import React from 'react';
import { getStatusBadgeVariant } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  className?: string;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, className = '', size = 'sm' }: StatusBadgeProps) {
  const { bg, text, border, label } = getStatusBadgeVariant(status);
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm';

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${bg} ${text} ${border} ${sizeClasses} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-80" />
      {label}
    </span>
  );
}
