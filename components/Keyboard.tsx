import React, { useState } from 'react';

const KEYS = [
  "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", 
  "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"
];

interface KeyboardProps {
  activeLetters: string[];
  inactiveLetters: string[];
  addGuessedLetter: (letter: string) => void;
  disabled?: boolean;
}

export const Keyboard: React.FC<KeyboardProps> = ({
  activeLetters,
  inactiveLetters,
  addGuessedLetter,
  disabled = false,
}) => {
  const [shakingKey, setShakingKey] = useState<string | null>(null);

  const handleKeyPress = (key: string) => {
    if (disabled) return;

    const isActive = activeLetters.includes(key);
    const isInactive = inactiveLetters.includes(key);

    if (isActive || isInactive) {
      setShakingKey(key);
      setTimeout(() => setShakingKey(null), 400);
    } else {
      addGuessedLetter(key);
    }
  };

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(36px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(48px,1fr))] gap-2 w-full max-w-4xl mx-auto px-2">
      {KEYS.map((key) => {
        const isActive = activeLetters.includes(key);
        const isInactive = inactiveLetters.includes(key);
        const isShaking = shakingKey === key;

        return (
          <button
            key={key}
            onClick={() => handleKeyPress(key)}
            // We do not use disabled attribute so we can detect clicks for shake animation
            aria-disabled={isActive || isInactive || disabled}
            className={`
              h-12 md:h-14 font-display font-bold text-lg transition-all duration-150 border relative overflow-hidden select-none
              ${isShaking ? 'animate-shake' : ''}
              ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
              ${isActive 
                ? "bg-foreground text-background border-foreground" 
                : isInactive 
                  ? "opacity-20 bg-background border-border text-foreground" 
                  : "bg-background text-foreground border-border hover:border-foreground hover:bg-zinc-100 dark:hover:bg-zinc-900"
              }
            `}
          >
             {/* Flare effect */}
             {!isActive && !isInactive && !disabled && (
                 <div className="absolute inset-0 bg-foreground/5 opacity-0 hover:opacity-100 transition-opacity pointer-events-none" />
             )}
            {key}
          </button>
        );
      })}
    </div>
  );
};