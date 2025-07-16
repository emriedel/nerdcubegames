export interface GameState {
  isPlaying: boolean;
  isComplete: boolean;
  score: number;
  timeRemaining: number;
  startTime: Date | null;
  endTime: Date | null;
}

export interface GameResult {
  score: number;
  duration: number;
  completedAt: Date;
  gameType: string;
  puzzleDate: string;
  shareText: string;
}

export interface PuzzleMetadata {
  date: string;
  difficulty: 'easy' | 'medium' | 'hard';
  expectedScore: number;
  totalPossibleScore: number;
}

export interface GameConfig {
  timeLimit: number; // in seconds
  gameType: string;
  version: string;
}

export type GameStatus = 'waiting' | 'playing' | 'paused' | 'completed' | 'failed';

export interface ShareableResult {
  gameType: string;
  date: string;
  score: number;
  maxScore: number;
  emojiGrid?: string;
  text: string;
}