import React from 'react';

interface WordDisplayProps {
  wordToGuess: string;
  guessedLetters: string[];
  reveal?: boolean;
}

const normalizeChar = (char: string) => {
  return char.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

export const WordDisplay: React.FC<WordDisplayProps> = ({
  wordToGuess,
  guessedLetters,
  reveal = false,
}) => {
  return (
    <div className="flex flex-wrap justify-center gap-3 md:gap-4 my-8">
      {wordToGuess.split("").map((letter, index) => {
        const normalizedLetter = normalizeChar(letter);
        const isGuessed = guessedLetters.includes(normalizedLetter);
        const isVisible = isGuessed || reveal;
        const isMissed = reveal && !isGuessed;
        
        const isSpace = letter === " ";

        if (isSpace) {
          return <div key={index} className="w-6 md:w-10" />;
        }

        return (
          <div
            key={index}
            className={`
              relative w-10 h-14 md:w-14 md:h-20
              flex items-center justify-center 
              text-2xl md:text-4xl font-bold font-display uppercase
              border transition-all duration-500
              ${isVisible 
                ? isMissed 
                  ? "bg-zinc-200 dark:bg-zinc-900 text-zinc-500 border-zinc-300 dark:border-zinc-700" 
                  : "bg-background text-foreground border-foreground shadow-sm" 
                : "bg-black/5 dark:bg-black border-border text-transparent"
              }
            `}
          >
             <span className={`${isVisible ? "animate-zoom-in" : "opacity-0"}`}>
                {letter}
             </span>
          </div>
        );
      })}
    </div>
  );
};