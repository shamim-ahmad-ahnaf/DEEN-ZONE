import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  hoverable = false,
  padding = 'md'
}) => {
  const paddings = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div className={`
      bg-white rounded-[2rem] border border-slate-100 shadow-sm 
      ${paddings[padding]}
      ${hoverable ? 'hover:shadow-md hover:border-emerald-100 transition-all duration-300' : ''}
      ${className}
    `}>
      {children}
    </div>
  );
};
