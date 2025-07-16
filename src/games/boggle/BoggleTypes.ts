export interface GridPosition {
  row: number;
  col: number;
}

export interface LetterCell {
  letter: string;
  position: GridPosition;
  isSelected: boolean;
  isInCurrentPath: boolean;
}

export interface WordPath {
  letters: LetterCell[];
  word: string;
  isValid: boolean;
  score: number;
}

export interface BoggleState {
  grid: LetterCell[][];
  currentPath: GridPosition[];
  foundWords: Set<string>;
  currentWord: string;
  score: number;
  timeRemaining: number;
  isPlaying: boolean;
  isComplete: boolean;
}

export interface WordInfo {
  word: string;
  path: GridPosition[];
  score: number;
  length: number;
}

export interface BoggleResult {
  foundWords: WordInfo[];
  totalScore: number;
  possibleWords: string[];
  totalPossibleScore: number;
  duration: number;
  efficiency: number; // percentage of possible score achieved
}