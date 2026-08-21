import React from 'react';
import Link from 'next/link';

interface BrandLogoProps {
  variant?: 'full' | 'compact' | 'mark';
  theme?: 'dark' | 'light' | 'auto';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  href?: string;
  className?: string;
  subtitle?: string;
}

export function BrandLogo({
  variant = 'full',
  theme = 'dark',
  size = 'md',
  href = '/',
  className = '',
  subtitle = 'AI Dealership Operating System',
}: BrandLogoProps) {
  // Dimensions based on size
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
    xl: 'w-14 h-14',
  };

  const titleSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  const subSizes = {
    sm: 'text-[9px]',
    md: 'text-[10px]',
    lg: 'text-xs',
    xl: 'text-sm',
  };

  const isLight = theme === 'light';
  const textColor = isLight ? 'text-slate-900' : 'text-white';
  const subColor = isLight ? 'text-slate-500' : 'text-slate-400';
  const aiBadgeBg = isLight
    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
    : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';

  const logoMark = (
    <div
      className={`${iconSizes[size]} rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/25 flex-shrink-0 transition-transform duration-200 group-hover:scale-105`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-[60%] h-[60%] text-slate-950"
      >
        {/* Modern streamlined automotive mark with integrated AI pulse node */}
        <path
          d="M3 13.5L5.5 6.5C5.8 5.6 6.6 5 7.5 5H16.5C17.4 5 18.2 5.6 18.5 6.5L21 13.5M3 13.5H21M3 13.5V17C3 17.6 3.4 18 4 18H5.5C6.1 18 6.5 17.6 6.5 17V16H17.5V17C17.5 17.6 17.9 18 18.5 18H20C20.6 18 21 17.6 21 17V13.5M7 11H7.01M17 11H17.01"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="10" r="1.5" fill="currentColor" />
        <path
          d="M10 2.5L12 1L14 2.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );

  const content = (
    <div className={`inline-flex items-center gap-2.5 group ${className}`}>
      {logoMark}

      {variant !== 'mark' && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 leading-none">
            <span
              className={`font-black tracking-tight ${titleSizes[size]} ${textColor}`}
            >
              Auto<span className="text-emerald-400">AI</span>dealership
            </span>
            {variant === 'full' && (
              <span
                className={`text-[9px] uppercase font-extrabold tracking-wider px-1.5 py-0.5 rounded border ${aiBadgeBg}`}
              >
                SaaS
              </span>
            )}
          </div>
          {variant === 'full' && subtitle && (
            <p className={`${subSizes[size]} ${subColor} font-medium mt-0.5 leading-tight`}>
              {subtitle}
            </p>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-lg">
        {content}
      </Link>
    );
  }

  return content;
}
