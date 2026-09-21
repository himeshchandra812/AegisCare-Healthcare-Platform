import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'emergency' | 'outline' | 'ghost' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium rounded-xl transition-colors duration-150 select-none focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';

  // Sizing with strict min 44px+ touch targets for accessibility & elderly users
  const sizeClasses = {
    sm: 'text-sm px-3.5 py-2 min-h-[40px] gap-1.5',
    md: 'text-base px-5 py-2.5 min-h-[48px] gap-2 font-semibold',
    lg: 'text-lg px-6 py-3.5 min-h-[54px] gap-2.5 font-bold',
    xl: 'text-xl px-8 py-4 min-h-[64px] gap-3 font-extrabold tracking-wide',
  };

  const variantClasses = {
    primary:
      'bg-sky-700 hover:bg-sky-800 text-white focus:ring-sky-600 shadow-sm border border-sky-800',
    secondary:
      'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 focus:ring-slate-400',
    emergency:
      'bg-red-600 hover:bg-red-700 text-white focus:ring-red-600 shadow-md border-2 border-red-700 active:scale-[0.99]',
    outline:
      'bg-transparent hover:bg-slate-50 text-slate-700 border-2 border-slate-300 focus:ring-slate-400',
    ghost:
      'bg-transparent hover:bg-slate-100 text-slate-700 focus:ring-slate-300',
    success:
      'bg-emerald-700 hover:bg-emerald-800 text-white focus:ring-emerald-600 shadow-sm border border-emerald-800',
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
      <span className="whitespace-nowrap">{children}</span>
      {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
    </button>
  );
};
