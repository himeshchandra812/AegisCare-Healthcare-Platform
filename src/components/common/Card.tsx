import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'highlight' | 'emergency' | 'neutral' | 'subtle';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  border?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  border = true,
  className = '',
  ...props
}) => {
  const paddingMap = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const variantMap = {
    default: 'bg-white text-slate-900 border-slate-200 shadow-xs',
    neutral: 'bg-slate-50 text-slate-900 border-slate-200',
    highlight: 'bg-sky-50/70 text-sky-950 border-sky-200',
    emergency: 'bg-red-50/80 text-red-950 border-red-300 ring-1 ring-red-200',
    subtle: 'bg-white/90 text-slate-800 border-slate-200',
  };

  return (
    <div
      className={`rounded-2xl ${border ? 'border' : ''} ${variantMap[variant]} ${paddingMap[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
