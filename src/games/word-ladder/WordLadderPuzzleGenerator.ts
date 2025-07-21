import { WORD_LADDER_CONSTANTS } from '@/lib/constants';
import { WordLadderPuzzle } from './WordLadderTypes';

export class WordLadderPuzzleGenerator {
  private seed: string;
  private random: () => number;

  // Predefined word ladders with known solutions
  private predefinedPuzzles: WordLadderPuzzle[] = [
    // Easy puzzles (3-5 steps)
    { startWord: 'cold', targetWord: 'warm', minimumSteps: 4, difficulty: 'easy' },
    { startWord: 'head', targetWord: 'tail', minimumSteps: 5, difficulty: 'easy' },
    { startWord: 'love', targetWord: 'hate', minimumSteps: 3, difficulty: 'easy' },
    { startWord: 'work', targetWord: 'play', minimumSteps: 4, difficulty: 'easy' },
    { startWord: 'good', targetWord: 'evil', minimumSteps: 4, difficulty: 'easy' },
    { startWord: 'fast', targetWord: 'slow', minimumSteps: 3, difficulty: 'easy' },
    { startWord: 'dark', targetWord: 'lite', minimumSteps: 4, difficulty: 'easy' },
    { startWord: 'rich', targetWord: 'poor', minimumSteps: 4, difficulty: 'easy' },
    { startWord: 'lost', targetWord: 'find', minimumSteps: 4, difficulty: 'easy' },
    { startWord: 'team', targetWord: 'solo', minimumSteps: 4, difficulty: 'easy' },
    
    // Medium puzzles (4-7 steps)
    { startWord: 'word', targetWord: 'maze', minimumSteps: 5, difficulty: 'medium' },
    { startWord: 'mind', targetWord: 'body', minimumSteps: 6, difficulty: 'medium' },
    { startWord: 'fire', targetWord: 'water', minimumSteps: 5, difficulty: 'medium' },
    { startWord: 'black', targetWord: 'white', minimumSteps: 6, difficulty: 'medium' },
    { startWord: 'bread', targetWord: 'toast', minimumSteps: 5, difficulty: 'medium' },
    { startWord: 'mouse', targetWord: 'house', minimumSteps: 4, difficulty: 'medium' },
    { startWord: 'stone', targetWord: 'bread', minimumSteps: 6, difficulty: 'medium' },
    { startWord: 'smart', targetWord: 'dumb', minimumSteps: 4, difficulty: 'medium' },
    { startWord: 'green', targetWord: 'brown', minimumSteps: 5, difficulty: 'medium' },
    { startWord: 'horse', targetWord: 'rider', minimumSteps: 6, difficulty: 'medium' },

    // Hard puzzles (6-10 steps)
    { startWord: 'teach', targetWord: 'learn', minimumSteps: 7, difficulty: 'hard' },
    { startWord: 'start', targetWord: 'finish', minimumSteps: 8, difficulty: 'hard' },
    { startWord: 'happy', targetWord: 'angry', minimumSteps: 8, difficulty: 'hard' },
    { startWord: 'sweet', targetWord: 'sour', minimumSteps: 6, difficulty: 'hard' },
    { startWord: 'peace', targetWord: 'chaos', minimumSteps: 7, difficulty: 'hard' },
    { startWord: 'light', targetWord: 'heavy', minimumSteps: 8, difficulty: 'hard' },
    { startWord: 'young', targetWord: 'adult', minimumSteps: 7, difficulty: 'hard' },
    { startWord: 'north', targetWord: 'south', minimumSteps: 6, difficulty: 'hard' },
    { startWord: 'trust', targetWord: 'doubt', minimumSteps: 7, difficulty: 'hard' },
    { startWord: 'brave', targetWord: 'scared', minimumSteps: 8, difficulty: 'hard' },
  ];

  constructor(seed: string) {
    this.seed = seed;
    this.random = this.seedRandom(seed);
  }

  generatePuzzle(): WordLadderPuzzle {
    // Use date-based selection to ensure all players get the same puzzle
    const puzzleIndex = this.getDeterministicIndex();
    return { ...this.predefinedPuzzles[puzzleIndex] };
  }

  private getDeterministicIndex(): number {
    // Convert seed (date) to a deterministic index
    let hash = 0;
    for (let i = 0; i < this.seed.length; i++) {
      const char = this.seed.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return Math.abs(hash) % this.predefinedPuzzles.length;
  }

  private seedRandom(seed: string): () => number {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      const char = seed.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return function() {
      hash = ((hash * 9301) + 49297) % 233280;
      return hash / 233280;
    };
  }

  // Get puzzle for a specific difficulty
  getPuzzleByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): WordLadderPuzzle {
    const puzzlesOfDifficulty = this.predefinedPuzzles.filter(p => p.difficulty === difficulty);
    const index = Math.floor(this.random() * puzzlesOfDifficulty.length);
    return { ...puzzlesOfDifficulty[index] };
  }

  // Get all available puzzles
  getAllPuzzles(): WordLadderPuzzle[] {
    return [...this.predefinedPuzzles];
  }

  // Validate that a puzzle has a valid solution path
  static validatePuzzle(puzzle: WordLadderPuzzle): boolean {
    const { startWord, targetWord } = puzzle;
    
    // Basic validation
    if (startWord.length !== targetWord.length) {
      return false;
    }
    
    if (startWord.length < WORD_LADDER_CONSTANTS.MIN_WORD_LENGTH || 
        startWord.length > WORD_LADDER_CONSTANTS.MAX_WORD_LENGTH) {
      return false;
    }

    // Check that words are different
    if (startWord === targetWord) {
      return false;
    }

    return true;
  }
}