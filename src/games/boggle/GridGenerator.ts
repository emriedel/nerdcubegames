import { BOGGLE_CONSTANTS } from '@/lib/constants';
import { PuzzleGenerator } from '../shared/PuzzleGenerator';
import { LetterCell, GridPosition } from './BoggleTypes';

export class GridGenerator {
  private random: () => number;

  constructor(seed: string) {
    this.random = PuzzleGenerator.createSeededRandom(seed);
  }

  generateGrid(): LetterCell[][] {
    const letters = this.generateLetters();
    const grid: LetterCell[][] = [];

    for (let row = 0; row < BOGGLE_CONSTANTS.GRID_SIZE; row++) {
      grid[row] = [];
      for (let col = 0; col < BOGGLE_CONSTANTS.GRID_SIZE; col++) {
        const letterIndex = row * BOGGLE_CONSTANTS.GRID_SIZE + col;
        grid[row][col] = {
          letter: letters[letterIndex],
          position: { row, col },
          isSelected: false,
          isInCurrentPath: false,
        };
      }
    }

    return grid;
  }

  private generateLetters(): string[] {
    const letters: string[] = [];
    const letterPool = this.createWeightedLetterPool();

    for (let i = 0; i < BOGGLE_CONSTANTS.GRID_SIZE * BOGGLE_CONSTANTS.GRID_SIZE; i++) {
      const randomIndex = Math.floor(this.random() * letterPool.length);
      letters.push(letterPool[randomIndex]);
    }

    return letters;
  }

  private createWeightedLetterPool(): string[] {
    const pool: string[] = [];
    const frequencies = BOGGLE_CONSTANTS.LETTER_FREQUENCIES;

    // Create a pool where each letter appears based on its frequency
    for (const [letter, frequency] of Object.entries(frequencies)) {
      const count = Math.max(1, Math.round(frequency * 10)); // Scale frequencies
      for (let i = 0; i < count; i++) {
        pool.push(letter);
      }
    }

    return pool;
  }

  static isAdjacent(pos1: GridPosition, pos2: GridPosition): boolean {
    const rowDiff = Math.abs(pos1.row - pos2.row);
    const colDiff = Math.abs(pos1.col - pos2.col);
    
    // Adjacent means row and col differences are both <= 1, but not both 0
    return rowDiff <= 1 && colDiff <= 1 && (rowDiff !== 0 || colDiff !== 0);
  }

  static getAdjacentPositions(position: GridPosition): GridPosition[] {
    const adjacent: GridPosition[] = [];
    const { row, col } = position;

    for (let r = Math.max(0, row - 1); r <= Math.min(BOGGLE_CONSTANTS.GRID_SIZE - 1, row + 1); r++) {
      for (let c = Math.max(0, col - 1); c <= Math.min(BOGGLE_CONSTANTS.GRID_SIZE - 1, col + 1); c++) {
        if (r !== row || c !== col) {
          adjacent.push({ row: r, col: c });
        }
      }
    }

    return adjacent;
  }

  static positionsEqual(pos1: GridPosition, pos2: GridPosition): boolean {
    return pos1.row === pos2.row && pos1.col === pos2.col;
  }
}