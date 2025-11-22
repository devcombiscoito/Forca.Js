export interface GameWord {
  word: string;
  category: string;
  hints: string[];
}

export enum GameStatus {
  IDLE = 'IDLE',
  PLAYING = 'PLAYING',
  WON = 'WON',
  LOST = 'LOST',
}

export enum AppScreen {
  HOME = 'HOME',
  SETUP_RANDOM = 'SETUP_RANDOM',
  SETUP_TOPIC = 'SETUP_TOPIC',
  SETUP_WORD = 'SETUP_WORD',
  GAME = 'GAME',
}

export enum Difficulty {
  EASY = 'Fácil',
  MEDIUM = 'Médio',
  HARD = 'Difícil',
}

export interface GeminiError {
  message: string;
}