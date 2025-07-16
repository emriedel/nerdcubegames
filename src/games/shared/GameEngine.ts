import { GameState, GameResult, GameConfig, PuzzleMetadata, ShareableResult } from './GameTypes';

export abstract class GameEngine {
  protected state: GameState;
  protected config: GameConfig;
  protected puzzleDate: string;
  
  constructor(config: GameConfig) {
    this.config = config;
    this.puzzleDate = new Date().toISOString().split('T')[0];
    this.state = this.initializeState();
  }

  protected initializeState(): GameState {
    return {
      isPlaying: false,
      isComplete: false,
      score: 0,
      timeRemaining: this.config.timeLimit,
      startTime: null,
      endTime: null,
    };
  }

  // Abstract methods that must be implemented by game-specific engines
  abstract generatePuzzle(seed: string): void;
  abstract validateMove(move: any): boolean;
  abstract calculateScore(): number;
  abstract getShareableResult(): ShareableResult;
  abstract getPuzzleMetadata(): PuzzleMetadata;

  // Common game lifecycle methods
  startGame(): void {
    if (this.state.isPlaying || this.state.isComplete) {
      return;
    }

    this.state.isPlaying = true;
    this.state.startTime = new Date();
    this.startTimer();
  }

  pauseGame(): void {
    if (!this.state.isPlaying || this.state.isComplete) {
      return;
    }
    this.state.isPlaying = false;
  }

  resumeGame(): void {
    if (this.state.isPlaying || this.state.isComplete) {
      return;
    }
    this.state.isPlaying = true;
  }

  endGame(): void {
    if (!this.state.isPlaying) {
      return;
    }

    this.state.isPlaying = false;
    this.state.isComplete = true;
    this.state.endTime = new Date();
    this.state.score = this.calculateScore();
  }

  resetGame(): void {
    this.state = this.initializeState();
    this.generatePuzzle(this.puzzleDate);
  }

  getState(): GameState {
    return { ...this.state };
  }

  getResult(): GameResult | null {
    if (!this.state.isComplete || !this.state.startTime || !this.state.endTime) {
      return null;
    }

    return {
      score: this.state.score,
      duration: this.state.endTime.getTime() - this.state.startTime.getTime(),
      completedAt: this.state.endTime,
      gameType: this.config.gameType,
      puzzleDate: this.puzzleDate,
      shareText: this.getShareableResult().text,
    };
  }

  private startTimer(): void {
    const interval = setInterval(() => {
      if (!this.state.isPlaying) {
        clearInterval(interval);
        return;
      }

      this.state.timeRemaining -= 1;

      if (this.state.timeRemaining <= 0) {
        clearInterval(interval);
        this.endGame();
      }
    }, 1000);
  }

  // Utility methods for deterministic puzzle generation
  protected seedRandom(seed: string): () => number {
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

  protected formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}