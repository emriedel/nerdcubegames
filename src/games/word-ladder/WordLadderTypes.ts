export interface WordLadderPuzzle {
  startWord: string;
  targetWord: string;
  minimumSteps: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface WordLadderStep {
  word: string;
  isValid: boolean;
  index: number;
}

export interface WordLadderState {
  puzzle: WordLadderPuzzle;
  currentPath: WordLadderStep[];
  currentWord: string;
  isComplete: boolean;
  isSolved: boolean;
  score: number;
  timeRemaining: number;
  isPlaying: boolean;
  hints: number;
  hintsUsed: number;
}

export interface WordLadderResult {
  solved: boolean;
  steps: number;
  minimumSteps: number;
  score: number;
  efficiency: number;
  duration: number;
  hintsUsed: number;
  path: string[];
}

export interface WordLadderHint {
  type: 'letter' | 'word' | 'direction';
  message: string;
  targetPosition?: number;
  suggestedLetter?: string;
}

export interface WordChange {
  position: number;
  oldLetter: string;
  newLetter: string;
}

export interface ValidationResult {
  isValid: boolean;
  isValidWord: boolean;
  isOneLetterDiff: boolean;
  changedPositions: number[];
  error?: string;
}