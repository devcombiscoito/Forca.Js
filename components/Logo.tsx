import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = "", size = 'md', showText = true }) => {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-20 h-20"
  };

  const textClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-4xl",
    xl: "text-7xl"
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <div className={`${sizeClasses[size]} bg-foreground text-background flex items-center justify-center relative overflow-hidden shadow-sm`}>
        {/* Stylized Noose/Knot Icon */}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-2/3 h-2/3">
          <path d="M12 3v2" strokeLinecap="round" />
          <circle cx="12" cy="10" r="4" />
          <path d="M12 14c-2.67 0-8 1.34-8 4v1h16v-1c0-2.66-5.33-4-8-4z" />
        </svg>
      </div>
      {showText && (
        <span className={`font-display font-bold tracking-tighter text-foreground ${textClasses[size]}`}>
          forca.js
        </span>
      )}
    </div>
  );
};