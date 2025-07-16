import { GameEngine } from '../shared/GameEngine';
import { ShareableResult, PuzzleMetadata } from '../shared/GameTypes';
import { GAME_CONFIGS, BOGGLE_CONSTANTS } from '@/lib/constants';
import { GridGenerator } from './GridGenerator';
import { WordValidator } from './WordValidator';
import { LetterCell, GridPosition, BoggleState, WordInfo, BoggleResult } from './BoggleTypes';

export class BoggleEngine extends GameEngine {
  private boggleState: BoggleState;
  private validator: WordValidator;
  private gridGenerator: GridGenerator;
  private allPossibleWords: string[] = [];

  constructor() {
    super(GAME_CONFIGS.boggle);
    this.validator = new WordValidator();
    this.gridGenerator = new GridGenerator(this.puzzleDate);
    this.boggleState = this.initializeBoggleState();
    this.generatePuzzle(this.puzzleDate);
  }

  private initializeBoggleState(): BoggleState {
    const emptyGrid: LetterCell[][] = Array(BOGGLE_CONSTANTS.GRID_SIZE)
      .fill(null)
      .map((_, row) =>
        Array(BOGGLE_CONSTANTS.GRID_SIZE)
          .fill(null)
          .map((_, col) => ({
            letter: '',
            position: { row, col },
            isSelected: false,
            isInCurrentPath: false,
          }))
      );

    return {
      grid: emptyGrid,
      currentPath: [],
      foundWords: new Set(),
      currentWord: '',
      score: 0,
      timeRemaining: this.config.timeLimit,
      isPlaying: false,
      isComplete: false,
    };
  }

  generatePuzzle(seed: string): void {
    this.gridGenerator = new GridGenerator(seed);
    this.boggleState.grid = this.gridGenerator.generateGrid();
    
    // Pre-calculate all possible words for scoring
    const gridLetters = this.boggleState.grid.map(row => 
      row.map(cell => cell.letter)
    );
    this.allPossibleWords = this.validator.findAllWords(gridLetters);
  }

  validateMove(position: GridPosition): boolean {
    const { currentPath } = this.boggleState;
    
    // First letter selection
    if (currentPath.length === 0) {
      return true;
    }
    
    // Check if position is already in current path
    if (currentPath.some(pos => GridGenerator.positionsEqual(pos, position))) {
      return false;
    }
    
    // Check if position is adjacent to the last letter in path
    const lastPosition = currentPath[currentPath.length - 1];
    return GridGenerator.isAdjacent(lastPosition, position);
  }

  selectLetter(position: GridPosition): boolean {
    if (!this.state.isPlaying || this.state.isComplete) {
      return false;
    }

    if (!this.validateMove(position)) {
      return false;
    }

    // Add to current path
    this.boggleState.currentPath.push(position);
    this.updateCurrentWord();
    this.updateGridState();
    
    return true;
  }

  deselectLastLetter(): boolean {
    if (this.boggleState.currentPath.length === 0) {
      return false;
    }

    this.boggleState.currentPath.pop();
    this.updateCurrentWord();
    this.updateGridState();
    
    return true;
  }

  submitWord(): boolean {
    const { currentWord, foundWords } = this.boggleState;
    
    if (currentWord.length < BOGGLE_CONSTANTS.MIN_WORD_LENGTH) {
      this.clearCurrentPath();
      return false;
    }

    if (foundWords.has(currentWord)) {
      this.clearCurrentPath();
      return false;
    }

    if (!this.validator.isValidWord(currentWord)) {
      this.clearCurrentPath();
      return false;
    }

    // Valid word found!
    foundWords.add(currentWord);
    this.boggleState.score += this.validator.getWordScore(currentWord);
    this.clearCurrentPath();
    
    return true;
  }

  clearCurrentPath(): void {
    this.boggleState.currentPath = [];
    this.boggleState.currentWord = '';
    this.updateGridState();
  }

  private updateCurrentWord(): void {
    this.boggleState.currentWord = this.boggleState.currentPath
      .map(pos => this.boggleState.grid[pos.row][pos.col].letter)
      .join('')
      .toLowerCase();
  }

  private updateGridState(): void {
    // Reset all cells
    for (let row = 0; row < BOGGLE_CONSTANTS.GRID_SIZE; row++) {
      for (let col = 0; col < BOGGLE_CONSTANTS.GRID_SIZE; col++) {
        this.boggleState.grid[row][col].isSelected = false;
        this.boggleState.grid[row][col].isInCurrentPath = false;
      }
    }

    // Mark cells in current path
    this.boggleState.currentPath.forEach((pos, index) => {
      const cell = this.boggleState.grid[pos.row][pos.col];
      cell.isInCurrentPath = true;
      cell.isSelected = index === this.boggleState.currentPath.length - 1;
    });
  }

  calculateScore(): number {
    return this.boggleState.score;
  }

  getBoggleState(): BoggleState {
    return { ...this.boggleState };
  }

  getCurrentWord(): string {
    return this.boggleState.currentWord;
  }

  getFoundWords(): WordInfo[] {
    return Array.from(this.boggleState.foundWords).map(word => ({
      word,
      path: [], // Could store actual paths if needed
      score: this.validator.getWordScore(word),
      length: word.length,
    }));
  }

  getBoggleResult(): BoggleResult {
    const foundWords = this.getFoundWords();
    const totalPossibleScore = this.allPossibleWords.reduce(
      (sum, word) => sum + this.validator.getWordScore(word),
      0
    );
    
    const duration = this.state.endTime && this.state.startTime 
      ? this.state.endTime.getTime() - this.state.startTime.getTime()
      : 0;

    const efficiency = totalPossibleScore > 0 
      ? (this.boggleState.score / totalPossibleScore) * 100 
      : 0;

    return {
      foundWords,
      totalScore: this.boggleState.score,
      possibleWords: this.allPossibleWords,
      totalPossibleScore,
      duration,
      efficiency,
    };
  }

  getShareableResult(): ShareableResult {
    const result = this.getBoggleResult();
    const emojiGrid = this.generateEmojiGrid();
    
    const shareText = `Boggle ${this.puzzleDate}\n` +
      `Score: ${result.totalScore}/${result.totalPossibleScore}\n` +
      `Words found: ${result.foundWords.length}/${result.possibleWords.length}\n` +
      `Efficiency: ${Math.round(result.efficiency)}%\n\n` +
      `${emojiGrid}\n\n` +
      `🎮 Play at nerdcube.games`;

    return {
      gameType: 'Boggle',
      date: this.puzzleDate,
      score: result.totalScore,
      maxScore: result.totalPossibleScore,
      emojiGrid,
      text: shareText,
    };
  }

  private generateEmojiGrid(): string {
    const efficiency = this.getBoggleResult().efficiency;
    
    if (efficiency >= 90) return '🏆🏆🏆🏆';
    if (efficiency >= 75) return '🥇🥇🥇⭐';
    if (efficiency >= 60) return '🥈🥈⭐⭐';
    if (efficiency >= 45) return '🥉⭐⭐⭐';
    if (efficiency >= 30) return '👍⭐⭐⭐';
    return '💪💪💪💪';
  }

  getPuzzleMetadata(): PuzzleMetadata {
    const totalPossibleScore = this.allPossibleWords.reduce(
      (sum, word) => sum + this.validator.getWordScore(word),
      0
    );

    let difficulty: 'easy' | 'medium' | 'hard' = 'medium';
    if (totalPossibleScore < 50) difficulty = 'easy';
    else if (totalPossibleScore > 100) difficulty = 'hard';

    return {
      date: this.puzzleDate,
      difficulty,
      expectedScore: Math.round(totalPossibleScore * 0.4), // 40% of possible as expected
      totalPossibleScore,
    };
  }

  // Override parent methods to sync boggle state
  startGame(): void {
    super.startGame();
    this.boggleState.isPlaying = true;
    this.boggleState.timeRemaining = this.config.timeLimit;
  }

  endGame(): void {
    super.endGame();
    this.boggleState.isPlaying = false;
    this.boggleState.isComplete = true;
    this.clearCurrentPath();
  }

  resetGame(): void {
    super.resetGame();
    this.boggleState = this.initializeBoggleState();
    this.generatePuzzle(this.puzzleDate);
  }
}