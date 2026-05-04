import React from 'react';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({ 
  title, 
  subtitle, 
  align = 'left',
  className = ''
}) => {
  const alignments = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  };

  return (
    <div className={`flex flex-col gap-1 mb-6 ${alignments[align]} ${className}`}>
      <h2 className="text-2xl font-black text-slate-800 tracking-tight leading-tight font-display uppercase">
        {title}
      </h2>
      {subtitle && (
        <p className="text-sm text-slate-500 font-medium max-w-lg">
          {subtitle}
        </p>
      )}
      <div className={`h-1.5 w-12 bg-gold-400 rounded-full mt-1.5`} />
    </div>
  );
};
