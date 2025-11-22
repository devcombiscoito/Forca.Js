import React from 'react';

interface HangmanDrawingProps {
  numberOfGuesses: number;
}

export const HangmanDrawing: React.FC<HangmanDrawingProps> = ({ numberOfGuesses }) => {
  const maxErrors = 6;
  const errors = Math.min(numberOfGuesses, maxErrors);

  // Semantic colors responding to theme
  const strokeClass = "stroke-zinc-950 dark:stroke-white stroke-[3px] cap-round fill-none transition-colors";
  const structureClass = "stroke-zinc-400 dark:stroke-zinc-700 stroke-[4px] cap-square transition-colors";
  const ropeClass = "stroke-zinc-400 dark:stroke-zinc-500 stroke-[2px] stroke-dasharray-4 transition-colors";

  return (
    <div className="relative flex justify-center items-end h-64 w-full max-w-[280px] select-none p-4">
      <svg viewBox="0 0 200 250" className="w-full h-full overflow-visible filter drop-shadow-[0_0_5px_rgba(0,0,0,0.1)] dark:drop-shadow-[0_0_5px_rgba(255,255,255,0.2)]">
        {/* Base */}
        <line x1="40" y1="240" x2="160" y2="240" className={structureClass} />
        {/* Pole */}
        <line x1="60" y1="240" x2="60" y2="20" className={structureClass} />
        {/* Top Bar */}
        <line x1="57" y1="20" x2="140" y2="20" className={structureClass} />
        {/* Rope */}
        <line x1="140" y1="20" x2="140" y2="50" className={ropeClass} />

        {/* Head */}
        {errors >= 1 && (
          <circle cx="140" cy="70" r="20" className={strokeClass} />
        )}
        
        {/* Body */}
        {errors >= 2 && (
          <line x1="140" y1="90" x2="140" y2="150" className={strokeClass} />
        )}

        {/* Left Arm */}
        {errors >= 3 && (
          <line x1="140" y1="100" x2="110" y2="130" className={strokeClass} />
        )}

        {/* Right Arm */}
        {errors >= 4 && (
          <line x1="140" y1="100" x2="170" y2="130" className={strokeClass} />
        )}

        {/* Left Leg */}
        {errors >= 5 && (
          <line x1="140" y1="150" x2="120" y2="210" className={strokeClass} />
        )}

        {/* Right Leg */}
        {errors >= 6 && (
          <line x1="140" y1="150" x2="160" y2="210" className={strokeClass} />
        )}
      </svg>
    </div>
  );
};