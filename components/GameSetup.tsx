import React, { useState } from 'react';
import { Difficulty } from '../types';

interface GameSetupProps {
  mode: 'random' | 'topic' | 'manual';
  onConfirm: (value: string, difficulty?: Difficulty, hints?: string[]) => void;
  onBack: () => void;
}

export const GameSetup: React.FC<GameSetupProps> = ({ mode, onConfirm, onBack }) => {
  const [inputValue, setInputValue] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.MEDIUM);
  
  // Manual Mode States
  const [manualHints, setManualHints] = useState<string[]>(["", "", ""]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation for topic/manual
    if (mode !== 'random' && !inputValue.trim()) return;

    if (mode === 'manual') {
      const validHints = manualHints.filter(h => h.trim() !== "");
      // We pass difficulty even in manual mode as metadata or game config
      onConfirm(inputValue, difficulty, validHints.length > 0 ? validHints : ["Sem dicas disponíveis."]);
    } else {
      // For random, inputValue is ignored (or empty), but we pass difficulty
      onConfirm(inputValue, difficulty);
    }
  };

  const updateHint = (index: number, value: string) => {
    const newHints = [...manualHints];
    newHints[index] = value;
    setManualHints(newHints);
  };

  const addHintField = () => {
    setManualHints([...manualHints, ""]);
  };

  const removeHintField = (index: number) => {
    const newHints = manualHints.filter((_, i) => i !== index);
    setManualHints(newHints);
  };

  const getTitles = () => {
    switch (mode) {
      case 'random': return { title: "Modo Aleatório", subtitle: "A IA escolherá o destino. Defina a intensidade." };
      case 'topic': return { title: "Definir Tópico", subtitle: "Escolha o campo de batalha para a IA." };
      case 'manual': return { title: "Protocolo Versus", subtitle: "Configure o desafio para o seu oponente." };
    }
  };

  const getDifficultyIcon = (diff: Difficulty) => {
    switch(diff) {
      case Difficulty.EASY: 
        return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/><line x1="16" y1="8" x2="2" y2="22"/><line x1="17.5" y1="15" x2="9" y2="15"/></svg>; // Feather
      case Difficulty.MEDIUM: 
        return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>; // Target
      case Difficulty.HARD: 
        return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m11.03 2.59a15.1 15.1 0 0 1 1.94 0l-.15.38a14.9 14.9 0 0 0-1.64 0l-.15-.38Z"/><path d="M16 14a4 4 0 0 0-8 0"/><circle cx="10" cy="10" r=".75"/><circle cx="14" cy="10" r=".75"/><path d="M19.5 4.5a2.5 2.5 0 0 1 0 5"/><path d="M4.5 4.5a2.5 2.5 0 0 0 0 5"/><path d="M12 14v1.5"/><path d="m8.13 8.62a11 11 0 0 1 7.74 0"/><path d="M5.37 5.37a15 15 0 0 1 13.26 0"/></svg>; // Skull
    }
  };

  const { title, subtitle } = getTitles();

  return (
    <div className="w-full max-w-lg mx-auto fade-in px-4 mt-10 md:mt-20 mb-20">
      <button 
        onClick={onBack}
        className="mb-8 text-xs text-zinc-500 hover:text-foreground flex items-center gap-2 transition-colors uppercase tracking-widest"
      >
        ← Voltar
      </button>
      
      <div className="bg-card border border-border p-8 relative overflow-hidden group shadow-2xl">
        <h2 className="text-3xl font-display font-bold mb-2 text-foreground relative z-10">
          {title}
        </h2>
        <p className="text-zinc-500 mb-8 text-sm font-light relative z-10">
          {subtitle}
        </p>

        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
          
          {/* Input Principal (Hidden for Random) */}
          {mode !== 'random' && (
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                 {mode === 'manual' ? (
                   <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                 ) : (
                   <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
                 )}
                {mode === 'manual' ? "Palavra Secreta" : "Tema"}
              </label>
              <input
                type={mode === 'manual' ? "password" : "text"}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={mode === 'manual' ? "Digite a palavra..." : "Ex: Culinária Italiana..."}
                autoFocus
                autoComplete="off"
                name="game_input_field"
                className="w-full px-4 py-4 bg-background border border-border text-foreground placeholder:text-zinc-400 focus:outline-none focus:border-foreground focus:ring-1 focus:ring-foreground transition-all"
              />
            </div>
          )}

          {/* Difficulty Selector - Available in ALL modes */}
          <div className="space-y-3">
            <label className="text-xs uppercase tracking-widest text-zinc-500 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="6" y1="9" x2="6" y2="21"/><line x1="18" y1="9" x2="18" y2="21"/><line x1="12" y1="5" x2="12" y2="21"/><path d="M12 5V3a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v18a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2"/></svg>
              Dificuldade
            </label>
            <div className="grid grid-cols-3 gap-2">
              {Object.values(Difficulty).map((diff) => (
                <button
                key={diff}
                type="button"
                onClick={() => setDifficulty(diff)}
                className={`
                  py-3 text-xs font-bold border transition-all uppercase tracking-wider flex flex-col items-center gap-2
                  ${difficulty === diff 
                    ? "bg-foreground text-background border-foreground" 
                    : "bg-transparent text-zinc-500 border-border hover:border-zinc-400"
                  }
                `}
                >
                  {getDifficultyIcon(diff)}
                  {diff}
                </button>
              ))}
            </div>
          </div>

          {/* Manual Hints */}
          {mode === 'manual' && (
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <label className="text-xs uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-1 1.5-2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
                  Dicas (Opcional)
                </label>
                <button 
                  type="button" 
                  onClick={addHintField}
                  className="text-[10px] uppercase tracking-wider font-bold text-foreground hover:underline flex items-center gap-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                  Adicionar
                </button>
              </div>
              
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2 no-scrollbar">
                {manualHints.map((hint, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      type="text"
                      value={hint}
                      onChange={(e) => updateHint(idx, e.target.value)}
                      placeholder={`Dica ${idx + 1}...`}
                      autoComplete="off"
                      className="w-full px-4 py-3 bg-background/50 border border-border text-foreground text-sm placeholder:text-zinc-400 focus:outline-none focus:border-zinc-500 transition-all"
                    />
                    {manualHints.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeHintField(idx)}
                        className="px-3 border border-border text-zinc-500 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500 transition-colors flex items-center justify-center"
                        title="Remover dica"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={mode !== 'random' && !inputValue.trim()}
            className="w-full bg-foreground text-background font-bold h-12 hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-all uppercase tracking-widest text-xs mt-4 flex items-center justify-center gap-2"
          >
            {mode === 'manual' ? "Iniciar Jogo" : "Gerar Desafio"}
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </button>
        </form>
      </div>
    </div>
  );
};