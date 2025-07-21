import { GameEngine } from '../shared/GameEngine';
import { ShareableResult, PuzzleMetadata } from '../shared/GameTypes';
import { GAME_CONFIGS, WORD_LADDER_CONSTANTS, GAME_TYPES } from '@/lib/constants';
import { 
  WordLadderState, 
  WordLadderPuzzle, 
  WordLadderStep, 
  WordLadderResult, 
  WordLadderHint,
  ValidationResult 
} from './WordLadderTypes';
import { WordLadderPuzzleGenerator } from './WordLadderPuzzleGenerator';
import { WordLadderValidator } from './WordLadderValidator';

export class WordLadderEngine extends GameEngine {
  private wordLadderState: WordLadderState;
  private validator: WordLadderValidator;
  private puzzleGenerator: WordLadderPuzzleGenerator;

  constructor() {
    super(GAME_CONFIGS[GAME_TYPES.WORD_LADDER]);
    this.validator = new WordLadderValidator();
    this.puzzleGenerator = new WordLadderPuzzleGenerator(this.puzzleDate);
    this.wordLadderState = this.initializeWordLadderState();
    this.generatePuzzle(this.puzzleDate);
  }

  private initializeWordLadderState(): WordLadderState {
    return {
      puzzle: {
        startWord: '',
        targetWord: '',
        minimumSteps: 0,
        difficulty: 'medium'
      },
      currentPath: [],
      currentWord: '',
      isComplete: false,
      isSolved: false,
      score: 0,
      timeRemaining: this.config.timeLimit,
      isPlaying: false,
      hints: WORD_LADDER_CONSTANTS.MAX_HINTS,
      hintsUsed: 0,
    };
  }

  generatePuzzle(seed: string): void {
    this.puzzleGenerator = new WordLadderPuzzleGenerator(seed);
    this.wordLadderState.puzzle = this.puzzleGenerator.generatePuzzle();
    this.wordLadderState.currentWord = this.wordLadderState.puzzle.startWord;
    this.wordLadderState.currentPath = [{
      word: this.wordLadderState.puzzle.startWord,
      isValid: true,
      index: 0
    }];
  }

  validateMove(move: any): boolean {
    if (typeof move !== 'string') return false;
    const validation = this.validateWord(move);
    return validation.isValid;
  }

  validateWord(word: string): ValidationResult {
    const currentWord = this.getCurrentWord();
    
    // Check if it's a valid word
    const isValidWord = this.validator.isValidWord(word);
    
    // Check if exactly one letter is different
    const changedPositions = this.getChangedPositions(currentWord, word);
    const isOneLetterDiff = changedPositions.length === 1;
    
    // Check if word was already used in the path
    const alreadyUsed = this.wordLadderState.currentPath.some(step => step.word === word);
    
    return {
      isValid: isValidWord && isOneLetterDiff && !alreadyUsed,
      isValidWord,
      isOneLetterDiff,
      changedPositions,
      error: this.getValidationError(isValidWord, isOneLetterDiff, alreadyUsed)
    };
  }

  private getValidationError(isValidWord: boolean, isOneLetterDiff: boolean, alreadyUsed: boolean): string | undefined {
    if (!isValidWord) return 'Not a valid word';
    if (!isOneLetterDiff) return 'Must change exactly one letter';
    if (alreadyUsed) return 'Word already used in this path';
    return undefined;
  }

  private getChangedPositions(word1: string, word2: string): number[] {
    if (word1.length !== word2.length) return [];
    
    const changes: number[] = [];
    for (let i = 0; i < word1.length; i++) {
      if (word1[i] !== word2[i]) {
        changes.push(i);
      }
    }
    return changes;
  }

  submitWord(word: string): boolean {
    if (!this.state.isPlaying || this.state.isComplete) {
      return false;
    }

    const validation = this.validateWord(word.toLowerCase());
    
    if (!validation.isValid) {
      return false;
    }

    // Add the word to the path
    const newStep: WordLadderStep = {
      word: word.toLowerCase(),
      isValid: true,
      index: this.wordLadderState.currentPath.length
    };

    this.wordLadderState.currentPath.push(newStep);
    this.wordLadderState.currentWord = word.toLowerCase();

    // Check if we've reached the target
    if (word.toLowerCase() === this.wordLadderState.puzzle.targetWord) {
      this.solveGame();
    }

    return true;
  }

  private solveGame(): void {
    this.wordLadderState.isSolved = true;
    this.wordLadderState.isComplete = true;
    this.wordLadderState.score = this.calculateScore();
    this.endGame();
  }

  removeLastStep(): boolean {
    if (this.wordLadderState.currentPath.length <= 1) {
      return false; // Can't remove the starting word
    }

    this.wordLadderState.currentPath.pop();
    const lastStep = this.wordLadderState.currentPath[this.wordLadderState.currentPath.length - 1];
    this.wordLadderState.currentWord = lastStep.word;
    
    return true;
  }

  getCurrentWord(): string {
    return this.wordLadderState.currentWord;
  }

  getHint(): WordLadderHint | null {
    if (this.wordLadderState.hints <= 0) {
      return null;
    }

    this.wordLadderState.hints--;
    this.wordLadderState.hintsUsed++;

    const currentWord = this.getCurrentWord();
    const targetWord = this.wordLadderState.puzzle.targetWord;
    
    // Find the first position where the words differ
    for (let i = 0; i < currentWord.length; i++) {
      if (currentWord[i] !== targetWord[i]) {
        return {
          type: 'letter',
          message: `Try changing the letter at position ${i + 1}`,
          targetPosition: i,
          suggestedLetter: targetWord[i]
        };
      }
    }

    return {
      type: 'direction',
      message: 'You\'re on the right track! Keep going.',
    };
  }

  calculateScore(): number {
    if (!this.wordLadderState.isSolved) {
      return 0;
    }

    const { BASE_SCORE, STEP_PENALTY, HINT_PENALTY, TIME_BONUS_THRESHOLD } = 
      WORD_LADDER_CONSTANTS.SCORING;

    let score: number = BASE_SCORE;
    
    // Subtract points for extra steps
    const stepsUsed = this.wordLadderState.currentPath.length - 1; // Don't count starting word
    const extraSteps = Math.max(0, stepsUsed - this.wordLadderState.puzzle.minimumSteps);
    score -= extraSteps * STEP_PENALTY;

    // Subtract points for hints used
    score -= this.wordLadderState.hintsUsed * HINT_PENALTY;

    // Time bonus
    const timeUsed = this.config.timeLimit - this.state.timeRemaining;
    if (timeUsed <= TIME_BONUS_THRESHOLD) {
      score = Math.floor(score * 1.5);
    }

    return Math.max(0, score);
  }

  getWordLadderState(): WordLadderState {
    return { ...this.wordLadderState };
  }

  getWordLadderResult(): WordLadderResult {
    const stepsUsed = this.wordLadderState.currentPath.length - 1;
    const efficiency = this.wordLadderState.puzzle.minimumSteps > 0 
      ? (this.wordLadderState.puzzle.minimumSteps / stepsUsed) * 100
      : 0;

    const duration = this.state.endTime && this.state.startTime 
      ? this.state.endTime.getTime() - this.state.startTime.getTime()
      : 0;

    return {
      solved: this.wordLadderState.isSolved,
      steps: stepsUsed,
      minimumSteps: this.wordLadderState.puzzle.minimumSteps,
      score: this.wordLadderState.score,
      efficiency,
      duration,
      hintsUsed: this.wordLadderState.hintsUsed,
      path: this.wordLadderState.currentPath.map(step => step.word)
    };
  }

  getShareableResult(): ShareableResult {
    const result = this.getWordLadderResult();
    const emojiPath = this.generateEmojiPath();
    
    const shareText = `Word Ladder ${this.puzzleDate}\n` +
      `${this.wordLadderState.puzzle.startWord.toUpperCase()} → ${this.wordLadderState.puzzle.targetWord.toUpperCase()}\n` +
      `${result.solved ? '✅' : '❌'} ${result.steps}/${result.minimumSteps} steps\n` +
      `Score: ${result.score}\n` +
      `${emojiPath}\n\n` +
      `🎮 Play at nerdcube.games`;

    return {
      gameType: 'Word Ladder',
      date: this.puzzleDate,
      score: result.score,
      maxScore: 1000,
      emojiGrid: emojiPath,
      text: shareText,
    };
  }

  private generateEmojiPath(): string {
    const result = this.getWordLadderResult();
    
    if (!result.solved) {
      return '❌🔀❓';
    }

    const efficiency = result.efficiency;
    if (efficiency >= 100) return '🏆⚡🎯'; // Perfect solution
    if (efficiency >= 80) return '🥇⭐🎯';   // Excellent
    if (efficiency >= 60) return '🥈⭐✨';   // Good
    if (efficiency >= 40) return '🥉💪🔀';   // Okay
    return '✅🔀💫'; // Completed
  }

  getPuzzleMetadata(): PuzzleMetadata {
    const { minimumSteps, difficulty } = this.wordLadderState.puzzle;
    const expectedScore = 1000 - (minimumSteps * 50);

    return {
      date: this.puzzleDate,
      difficulty,
      expectedScore,
      totalPossibleScore: 1000,
    };
  }

  // Override parent methods to sync state
  startGame(): void {
    super.startGame();
    this.wordLadderState.isPlaying = true;
    this.wordLadderState.timeRemaining = this.config.timeLimit;
  }

  endGame(): void {
    super.endGame();
    this.wordLadderState.isPlaying = false;
    this.wordLadderState.isComplete = true;
    this.wordLadderState.score = this.calculateScore();
  }

  resetGame(): void {
    super.resetGame();
    this.wordLadderState = this.initializeWordLadderState();
    this.generatePuzzle(this.puzzleDate);
  }
}