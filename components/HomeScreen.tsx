import React, { useRef, useState } from 'react';
import { Logo } from './Logo';

interface HomeScreenProps {
  onSelectMode: (mode: 'random' | 'topic' | 'manual') => void;
  isLowPerf?: boolean;
}

// Spotlight Card Component
const SpotlightCard = ({ 
  title, 
  description, 
  icon, 
  onClick,
  isLowPerf = false
}: { 
  title: string; 
  description: string; 
  icon: React.ReactNode; 
  onClick: () => void; 
  isLowPerf?: boolean;
}) => {
  const divRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isLowPerf || !divRef.current) return;

    const div = divRef.current;
    const rect = div.getBoundingClientRect();

    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => {
    if (!isLowPerf) setOpacity(1);
  };

  const handleBlur = () => {
    if (!isLowPerf) setOpacity(0);
  };

  const handleMouseEnter = () => {
    if (!isLowPerf) setOpacity(1);
  };

  const handleMouseLeave = () => {
    if (!isLowPerf) setOpacity(0);
  };

  return (
    <button
      ref={divRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative flex flex-col items-start p-8 h-72 bg-card border border-border overflow-hidden text-left group transition-all duration-300 shadow-sm hover:shadow-md"
    >
      {/* Spotlight Effect Layer */}
      {!isLowPerf && (
        <div
          className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 dark:mix-blend-screen mix-blend-multiply"
          style={{
            opacity,
            background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, var(--glow-color), transparent 40%)`,
          }}
        />
      )}
      
      {/* Icon Box */}
      <div className="mb-auto p-3 border border-border bg-background z-10 group-hover:border-foreground transition-colors duration-300 text-foreground">
        {icon}
      </div>
      
      <div className="relative z-10">
        <h3 className="text-2xl font-display font-bold mb-2 text-foreground group-hover:tracking-wide transition-all">{title}</h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-800 dark:group-hover:text-zinc-200 transition-colors font-light">
          {description}
        </p>
      </div>
    </button>
  );
};

export const HomeScreen: React.FC<HomeScreenProps> = ({ onSelectMode, isLowPerf }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-6xl mx-auto p-6 gap-20 fade-in mt-10">
      <div className="text-center flex flex-col items-center gap-6 z-10">
        <Logo size="xl" />
        <p className="text-zinc-500 text-lg md:text-xl max-w-md mx-auto font-light tracking-widest uppercase text-[10px] md:text-xs">
          Minimalismo • Inteligência • Foco
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
        
        <SpotlightCard 
          title="Aleatório"
          description="A IA escolhe o destino. Você enfrenta o desconhecido."
          onClick={() => onSelectMode('random')}
          isLowPerf={isLowPerf}
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter"><path d="M20 12h-2"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="M4 12H2"/><path d="M17.657 6.343l-1.414 1.414"/><path d="M6.343 17.657l-1.414 1.414"/><path d="M17.657 17.657l-1.414-1.414"/><path d="M6.343 6.343L4.929 4.929"/><circle cx="12" cy="12" r="2"/></svg>}
        />

        <SpotlightCard 
          title="Tópico"
          description="Defina o campo de batalha. Escolha o seu tema."
          onClick={() => onSelectMode('topic')}
          isLowPerf={isLowPerf}
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>}
        />

        <SpotlightCard 
          title="Versus"
          description="Crie o enigma. Desafie um humano próximo."
          onClick={() => onSelectMode('manual')}
          isLowPerf={isLowPerf}
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M9 15l2 2 4-4"/></svg>}
        />
      </div>
    </div>
  );
};