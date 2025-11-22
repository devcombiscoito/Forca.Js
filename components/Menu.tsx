import React, { useState, useEffect } from 'react';

interface MenuProps {
  isDark: boolean;
  toggleTheme: () => void;
  isLowPerf: boolean;
  togglePerf: () => void;
  onExitGame?: () => void;
  gameActive?: boolean;
}

export const Menu: React.FC<MenuProps> = ({ isDark, toggleTheme, isLowPerf, togglePerf, onExitGame, gameActive }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'config' | 'tutorial'>('config');
  const [isVisible, setIsVisible] = useState(false);

  // Handle animation timing for visibility
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 500); // Match transition duration
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleExit = () => {
    if (onExitGame) onExitGame();
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Button (Top Right) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 z-50 w-10 h-10 flex flex-col justify-center items-center gap-1.5 group text-foreground mix-blend-difference"
        aria-label="Menu"
      >
        <span 
          className={`h-0.5 w-6 bg-current transition-all duration-500 ease-in-out ${isOpen ? 'rotate-45 translate-y-2' : ''}`} 
        />
        <span 
          className={`h-0.5 w-6 bg-current transition-all duration-500 ease-in-out ${isOpen ? 'opacity-0' : ''}`} 
        />
        <span 
          className={`h-0.5 w-6 bg-current transition-all duration-500 ease-in-out ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} 
        />
      </button>

      {/* Overlay Menu */}
      <div 
        className={`fixed inset-0 bg-black/90 backdrop-blur-md z-40 transition-opacity duration-500 ease-in-out flex justify-end 
        ${isOpen ? 'opacity-100' : 'opacity-0'} 
        ${isVisible ? 'pointer-events-auto' : 'pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      >
        <div 
          className={`w-full max-w-md h-full bg-card border-l border-border p-8 flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] shadow-2xl 
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mt-12 mb-8 border-b border-border flex">
            <button 
              onClick={() => setActiveTab('config')}
              className={`flex-1 pb-3 text-sm uppercase tracking-widest font-bold transition-colors ${activeTab === 'config' ? 'text-foreground border-b-2 border-foreground' : 'text-zinc-500 hover:text-foreground'}`}
            >
              Ajustes
            </button>
            <button 
              onClick={() => setActiveTab('tutorial')}
              className={`flex-1 pb-3 text-sm uppercase tracking-widest font-bold transition-colors ${activeTab === 'tutorial' ? 'text-foreground border-b-2 border-foreground' : 'text-zinc-500 hover:text-foreground'}`}
            >
              Como Jogar
            </button>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar space-y-6">
            {activeTab === 'config' ? (
              <div className="space-y-6 fade-in">
                <div className="flex items-center justify-between p-4 border border-border bg-background/50">
                  <div>
                    <h3 className="font-bold text-foreground">Tema Escuro</h3>
                    <p className="text-xs text-zinc-500">Modo Noir de alto contraste</p>
                  </div>
                  <button 
                    onClick={toggleTheme}
                    className={`w-12 h-6 rounded-full p-1 transition-colors ${isDark ? 'bg-foreground' : 'bg-zinc-300'}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-background shadow-sm transition-transform duration-300 ${isDark ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 border border-border bg-background/50">
                  <div>
                    <h3 className="font-bold text-foreground">Desempenho</h3>
                    <p className="text-xs text-zinc-500">Desativar efeitos visuais pesados</p>
                  </div>
                  <button 
                    onClick={togglePerf}
                    className={`w-12 h-6 rounded-full p-1 transition-colors ${isLowPerf ? 'bg-foreground' : 'bg-zinc-300'}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-background shadow-sm transition-transform duration-300 ${isLowPerf ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
                </div>

                {gameActive && (
                  <div className="pt-8">
                     <button 
                      onClick={handleExit}
                      className="w-full py-4 border border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white transition-all font-bold uppercase tracking-widest text-xs"
                    >
                      Sair da Partida
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6 text-sm text-zinc-400 leading-relaxed fade-in">
                <section>
                  <h3 className="text-foreground font-bold mb-2 uppercase text-xs tracking-wider">Objetivo</h3>
                  <p>Descubra a palavra secreta antes que o desenho da forca seja completado. Você tem 6 chances.</p>
                </section>
                
                <section>
                  <h3 className="text-foreground font-bold mb-2 uppercase text-xs tracking-wider">Modos de Jogo</h3>
                  <ul className="list-disc pl-4 space-y-1">
                    <li><strong className="text-foreground">Aleatório:</strong> A IA escolhe o tema e a palavra.</li>
                    <li><strong className="text-foreground">Tópico:</strong> Você escolhe o tema, a IA gera a palavra.</li>
                    <li><strong className="text-foreground">Versus:</strong> Crie um desafio personalizado para um amigo (1x1).</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-foreground font-bold mb-2 uppercase text-xs tracking-wider">Dicas</h3>
                  <p>No modo IA, você pode revelar até 3 dicas progressivas. No modo Versus, depende do criador do jogo!</p>
                </section>
              </div>
            )}
          </div>

          <div className="mt-auto pt-6 border-t border-border text-center flex flex-col gap-2">
             <a 
               href="#" 
               target="_blank" 
               rel="noreferrer" 
               className="text-zinc-500 hover:text-foreground transition-colors inline-flex items-center justify-center gap-2"
               aria-label="GitHub"
             >
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
             </a>
            <p className="text-[10px] uppercase tracking-widest text-zinc-600">v 1.1.0 • forca.js</p>
          </div>
        </div>
      </div>
    </>
  );
};