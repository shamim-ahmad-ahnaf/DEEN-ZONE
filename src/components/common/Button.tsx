import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  className = '',
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-xl font-bold transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-emerald-700 text-white hover:bg-emerald-800 shadow-lg shadow-emerald-700/20",
    secondary: "bg-gold-500 text-white hover:bg-gold-600 shadow-lg shadow-gold-500/20",
    outline: "bg-transparent border-2 border-slate-200 text-slate-700 hover:border-emerald-500 hover:text-emerald-700",
    ghost: "bg-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-800",
    danger: "bg-rose-600 text-white hover:bg-rose-700 shadow-lg shadow-rose-600/20",
  };

  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
  };

  const width = fullWidth ? "w-full" : "";

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${width} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
