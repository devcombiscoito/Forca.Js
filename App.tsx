import React, { useState, useEffect, useCallback } from 'react';
import { HangmanDrawing } from './components/HangmanDrawing';
import { Keyboard } from './components/Keyboard';
import { WordDisplay } from './components/WordDisplay';
import { HomeScreen } from './components/HomeScreen';
import { GameSetup } from './components/GameSetup';
import { Menu } from './components/Menu';
import { Logo } from './components/Logo';
import { GameStatus, GameWord, AppScreen, Difficulty } from './types';
import { generateWord } from './services/geminiService';

const normalizeChar = (char: string) => {
  return char.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(AppScreen.HOME);
  const [wordData, setWordData] = useState<GameWord | null>(null);
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [status, setStatus] = useState<GameStatus>(GameStatus.IDLE);
  const [loading, setLoading] = useState(false);
  const [hintsRevealedCount, setHintsRevealedCount] = useState(0);
  
  // Global Settings
  const [isDark, setIsDark] = useState(true);
  const [isLowPerf, setIsLowPerf] = useState(false);

  // Apply Theme and Perf classes to body/root
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    
    if (isDark) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }

    if (isLowPerf) {
      body.classList.add('low-perf');
    } else {
      body.classList.remove('low-perf');
    }
  }, [isDark, isLowPerf]);

  // Mouse Tracking Logic (Only if High Perf)
  useEffect(() => {
    if (isLowPerf) return;
    
    const updateMousePosition = (ev: MouseEvent) => {
      document.documentElement.style.setProperty('--x', `${ev.clientX}px`);
      document.documentElement.style.setProperty('--y', `${ev.clientY}px`);
    };
    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, [isLowPerf]);

  // --- Navigation Handlers ---

  const handleSelectMode = (mode: 'random' | 'topic' | 'manual') => {
    if (mode === 'random') {
      // Random now goes to setup for Difficulty selection
      setCurrentScreen(AppScreen.SETUP_RANDOM);
    } else if (mode === 'topic') {
      setCurrentScreen(AppScreen.SETUP_TOPIC);
    } else if (mode === 'manual') {
      setCurrentScreen(AppScreen.SETUP_WORD);
    }
  };

  const handleBackToHome = () => {
    setStatus(GameStatus.IDLE);
    setWordData(null);
    setLoading(false);
    setCurrentScreen(AppScreen.HOME);
  };

  // --- Game Logic Handlers ---

  const startAiGame = async (topic?: string, difficulty: Difficulty = Difficulty.MEDIUM) => {
    setLoading(true);
    setCurrentScreen(AppScreen.GAME); 
    setStatus(GameStatus.PLAYING);
    setGuessedLetters([]);
    setHintsRevealedCount(0);
    
    const data = await generateWord(topic, difficulty);
    setWordData(data);
    setLoading(false);
  };

  const startManualGame = (word: string, _difficulty?: Difficulty, hints?: string[]) => {
    const cleanWord = word.toUpperCase().trim().replace(/[^A-ZÃÁÀÂÄÇÉÈÊËÍÌÎÏÕÓÒÔÖÚÙÛÜÑ ]/g, '');
    
    setWordData({
      word: cleanWord,
      category: 'Desafio 1x1',
      hints: hints || ['Sem dicas disponíveis.']
    });
    setGuessedLetters([]);
    setHintsRevealedCount(0);
    setStatus(GameStatus.PLAYING);
    setCurrentScreen(AppScreen.GAME);
  };

  const addGuessedLetter = useCallback((letter: string) => {
    if (status !== GameStatus.PLAYING || loading) return;

    setGuessedLetters(current => {
      if (current.includes(letter)) return current;
      return [...current, letter];
    });
  }, [status, loading]);

  // Keyboard Event Listener
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (currentScreen !== AppScreen.GAME) return;
      
      const key = e.key.toUpperCase();
      if (!key.match(/^[A-Z]$/)) return;
      e.preventDefault();
      addGuessedLetter(key);
    };

    document.addEventListener("keydown", handler);
    return () => {
      document.removeEventListener("keydown", handler);
    };
  }, [addGuessedLetter, currentScreen]);

  // Win/Loss Logic
  useEffect(() => {
    if (!wordData || status !== GameStatus.PLAYING) return;

    const normalizedTarget = wordData.word.split("").map(normalizeChar).filter(c => c.trim() !== "");
    
    const incorrectGuesses = guessedLetters.filter(
      letter => !normalizedTarget.includes(letter)
    );
    
    // Check Loss
    if (incorrectGuesses.length >= 6) {
      // Add a small delay for dramatic effect
      const timer = setTimeout(() => {
        setStatus(GameStatus.LOST);
      }, 500);
      return () => clearTimeout(timer);
    }

    // Check Win
    const isWinner = normalizedTarget.every(letter => guessedLetters.includes(letter));
    if (isWinner) {
      setStatus(GameStatus.WON);
    }
  }, [guessedLetters, wordData, status]);

  const normalizedWord = wordData ? wordData.word.split("").map(normalizeChar) : [];
  const incorrectLetters = guessedLetters.filter(
    letter => !normalizedWord.includes(letter)
  );

  // --- Renders ---

  return (
    <>
      {/* Background Effects */}
      <div className="bg-grid" />
      <div className="pointer-glow" />

      <Menu 
        isDark={isDark} 
        toggleTheme={() => setIsDark(!isDark)}
        isLowPerf={isLowPerf}
        togglePerf={() => setIsLowPerf(!isLowPerf)}
        onExitGame={handleBackToHome}
        gameActive={currentScreen === AppScreen.GAME}
      />

      <div className="flex-1 flex flex-col items-center py-8 px-4 font-sans max-w-5xl mx-auto w-full relative z-10">
        
        {/* Header */}
        {currentScreen === AppScreen.GAME && (
          <header className="w-full flex justify-between items-center mb-8 pb-4 border-b border-border relative">
             {/* Exit Button Stylized as 'X' (Moved to Left) */}
            <button 
              onClick={handleBackToHome}
              className="w-10 h-10 flex items-center justify-center text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-all"
              aria-label="Sair"
            >
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                 <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
               </svg>
            </button>

            {/* Logo Centered */}
            <div className="absolute left-1/2 -translate-x-1/2 pointer-events-none">
              <Logo size="sm" />
            </div>
            
            {/* Spacer for Right Side to balance the layout with the Menu button which is fixed */}
            <div className="w-10"></div>
          </header>
        )}

        {/* Screens */}
        
        {currentScreen === AppScreen.HOME && (
          <HomeScreen onSelectMode={handleSelectMode} isLowPerf={isLowPerf} />
        )}

        {currentScreen === AppScreen.SETUP_RANDOM && (
          <GameSetup 
            mode="random" 
            onConfirm={(_, diff) => startAiGame(undefined, diff)} 
            onBack={() => setCurrentScreen(AppScreen.HOME)} 
          />
        )}

        {currentScreen === AppScreen.SETUP_TOPIC && (
          <GameSetup 
            mode="topic" 
            onConfirm={(topic, diff) => startAiGame(topic, diff)} 
            onBack={() => setCurrentScreen(AppScreen.HOME)} 
          />
        )}

        {currentScreen === AppScreen.SETUP_WORD && (
          <GameSetup 
            mode="manual" 
            onConfirm={(word, _, hints) => startManualGame(word, undefined, hints)} 
            onBack={() => setCurrentScreen(AppScreen.HOME)} 
          />
        )}

        {currentScreen === AppScreen.GAME && (
          <main className="w-full flex flex-col items-center gap-12 animate-slide-up">
             
             <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                
                {/* Drawing */}
                <div className="md:col-span-5 flex justify-center bg-card backdrop-blur-sm border border-border p-6 shadow-lg relative overflow-hidden">
                    <HangmanDrawing numberOfGuesses={incorrectLetters.length} />
                </div>

                {/* Status & Info */}
                <div className="md:col-span-7 flex flex-col items-center md:items-start gap-6 h-full justify-start">
                    {loading ? (
                      <div className="flex flex-col items-center gap-4 animate-pulse w-full py-12">
                        <div className="w-12 h-12 bg-foreground animate-spin-slow"></div>
                        <p className="text-lg font-medium text-zinc-500">
                          Gerando desafio...
                        </p>
                      </div>
                    ) : wordData ? (
                      <>
                        <div className="flex flex-col gap-1 w-full">
                          <span className="text-xs uppercase tracking-[0.2em] font-bold text-zinc-500 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
                            Categoria
                          </span>
                          <div className="text-2xl font-display font-bold text-foreground tracking-wide">
                            {wordData.category}
                          </div>
                        </div>

                        {/* Status Messages */}
                        <div className="flex items-center w-full">
                          {status === GameStatus.WON && (
                              <div className="bg-foreground text-background px-6 py-4 w-full font-bold border border-foreground animate-pulse text-center tracking-widest uppercase shadow-[0_0_30px_rgba(255,255,255,0.2)] flex items-center justify-center gap-3">
                                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
                                 Vitória
                              </div>
                          )}
                          {status === GameStatus.LOST && (
                              <div className="bg-red-500/10 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-6 py-4 w-full font-bold border border-red-500/50 text-center animate-shake flex items-center justify-center gap-3">
                                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                                 Derrota
                              </div>
                          )}
                          {status === GameStatus.PLAYING && (
                             <div className="text-zinc-500 text-sm uppercase tracking-widest flex items-center gap-2">
                               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={incorrectLetters.length >= 4 ? 'text-red-500' : 'text-zinc-500'}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
                               Erros: <span className={`font-bold ${incorrectLetters.length >= 4 ? 'text-red-600 dark:text-red-500' : 'text-foreground'}`}>{incorrectLetters.length}</span> / 6
                             </div>
                          )}
                        </div>
                        
                        {/* Correct Word Reveal (on Loss) */}
                         {status === GameStatus.LOST && (
                           <div className="w-full animate-zoom-in">
                             <p className="text-xs uppercase tracking-widest text-zinc-500 mb-2 text-center md:text-left">A palavra correta era:</p>
                             <div className="w-full p-4 bg-background border border-border text-foreground text-xl font-display font-bold text-center tracking-widest uppercase shadow-inner">
                               {wordData.word}
                             </div>
                           </div>
                         )}

                         {/* Hints */}
                        {status === GameStatus.PLAYING && (
                            <div className="w-full space-y-2 mt-4">
                                <div className="flex justify-between items-end mb-2">
                                  <span className="text-[10px] uppercase tracking-widest text-zinc-500 flex items-center gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-1 1.5-2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
                                    Dicas ({hintsRevealedCount}/{wordData.hints.length})
                                  </span>
                                  <button 
                                      onClick={() => setHintsRevealedCount(c => Math.min(c + 1, wordData.hints.length))}
                                      disabled={hintsRevealedCount >= wordData.hints.length}
                                      className="text-xs flex items-center gap-2 text-zinc-400 border border-zinc-300 dark:border-zinc-800 px-3 py-1 hover:border-foreground hover:text-foreground transition-all uppercase tracking-wider active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-zinc-800 disabled:hover:text-zinc-400"
                                  >
                                      {hintsRevealedCount >= wordData.hints.length ? "Esgotado" : (
                                        <>
                                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                                          Revelar
                                        </>
                                      )}
                                  </button>
                                </div>
                                
                                <div className="space-y-2">
                                  {wordData.hints.slice(0, hintsRevealedCount).map((hint, i) => (
                                      <div key={i} className="bg-zinc-100 dark:bg-zinc-900/50 p-3 border border-zinc-300 dark:border-zinc-800 text-sm text-zinc-800 dark:text-zinc-300 animate-zoom-in flex items-start gap-2 shadow-sm">
                                          <span className="not-italic font-bold opacity-50">{i + 1}.</span> {hint}
                                      </div>
                                  ))}
                                </div>
                                {hintsRevealedCount === 0 && (
                                  <div className="text-zinc-500 text-xs italic opacity-30 border border-dashed border-zinc-700 p-3 text-center">
                                    Nenhuma dica revelada.
                                  </div>
                                )}
                            </div>
                        )}
                      </>
                    ) : null}
                </div>
             </div>

             {/* Word Display with Shake on Loss */}
             <div className={`w-full py-4 ${status === GameStatus.LOST ? 'animate-shake' : ''}`}>
                {wordData && !loading && (
                    <WordDisplay 
                        wordToGuess={wordData.word} 
                        guessedLetters={guessedLetters}
                        reveal={status === GameStatus.LOST || status === GameStatus.WON}
                    />
                )}
             </div>
             
             {/* Keyboard */}
             <div className="w-full pb-8">
                <Keyboard
                    activeLetters={guessedLetters.filter(letter => normalizedWord.includes(letter))}
                    inactiveLetters={incorrectLetters}
                    addGuessedLetter={addGuessedLetter}
                    // Disable if game over, loading, or max errors reached (before state transition)
                    disabled={status !== GameStatus.PLAYING || loading || incorrectLetters.length >= 6}
                />
             </div>

          </main>
        )}

        <footer className="mt-auto pt-8 pb-4 text-center text-[10px] uppercase tracking-[0.3em] text-zinc-500">
          <a href="https://github.com/google-gemini/forca-js" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors flex items-center justify-center gap-2">
            <Logo size="sm" showText={false} className="scale-75 opacity-50" />
            forca.js
          </a>
        </footer>
      </div>
    </>
  );
}

export default App;