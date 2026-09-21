import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'neutral' | 'info' | 'success' | 'warning' | 'danger' | 'purple';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  icon,
  className = '',
}) => {
  const variantStyles = {
    neutral: 'bg-slate-100 text-slate-700 border-slate-300',
    info: 'bg-sky-100 text-sky-800 border-sky-300 font-semibold',
    success: 'bg-emerald-100 text-emerald-800 border-emerald-300 font-semibold',
    warning: 'bg-amber-100 text-amber-900 border-amber-300 font-semibold',
    danger: 'bg-red-100 text-red-800 border-red-300 font-bold',
    purple: 'bg-purple-100 text-purple-800 border-purple-300 font-semibold',
  };

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-sm px-2.5 py-1 gap-1.5',
    lg: 'text-base px-3.5 py-1.5 gap-2',
  };

  return (
    <span
      className={`inline-flex items-center rounded-lg border font-medium whitespace-nowrap ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
