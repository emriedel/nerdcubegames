import { GridGenerator } from '@/games/boggle/GridGenerator';
import { BOGGLE_CONSTANTS } from '@/lib/constants';

describe('GridGenerator', () => {
  let generator: GridGenerator;

  beforeEach(() => {
    generator = new GridGenerator('test-seed');
  });

  describe('generateGrid', () => {
    it('should generate a 4x4 grid', () => {
      const grid = generator.generateGrid();
      
      expect(grid).toHaveLength(BOGGLE_CONSTANTS.GRID_SIZE);
      grid.forEach(row => {
        expect(row).toHaveLength(BOGGLE_CONSTANTS.GRID_SIZE);
      });
    });

    it('should generate cells with correct structure', () => {
      const grid = generator.generateGrid();
      
      grid.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          expect(cell).toHaveProperty('letter');
          expect(cell).toHaveProperty('position');
          expect(cell).toHaveProperty('isSelected', false);
          expect(cell).toHaveProperty('isInCurrentPath', false);
          expect(cell.position).toEqual({ row: rowIndex, col: colIndex });
          expect(typeof cell.letter).toBe('string');
          expect(cell.letter).toHaveLength(1);
        });
      });
    });

    it('should generate consistent grids for same seed', () => {
      const generator1 = new GridGenerator('same-seed');
      const generator2 = new GridGenerator('same-seed');
      
      const grid1 = generator1.generateGrid();
      const grid2 = generator2.generateGrid();
      
      expect(grid1).toEqual(grid2);
    });
  });

  describe('isAdjacent', () => {
    it('should return true for adjacent positions', () => {
      const pos1 = { row: 1, col: 1 };
      const pos2 = { row: 1, col: 2 }; // right
      const pos3 = { row: 2, col: 1 }; // down
      const pos4 = { row: 2, col: 2 }; // diagonal
      
      expect(GridGenerator.isAdjacent(pos1, pos2)).toBe(true);
      expect(GridGenerator.isAdjacent(pos1, pos3)).toBe(true);
      expect(GridGenerator.isAdjacent(pos1, pos4)).toBe(true);
    });

    it('should return false for non-adjacent positions', () => {
      const pos1 = { row: 1, col: 1 };
      const pos2 = { row: 1, col: 3 }; // too far right
      const pos3 = { row: 3, col: 1 }; // too far down
      
      expect(GridGenerator.isAdjacent(pos1, pos2)).toBe(false);
      expect(GridGenerator.isAdjacent(pos1, pos3)).toBe(false);
    });

    it('should return false for same position', () => {
      const pos = { row: 1, col: 1 };
      
      expect(GridGenerator.isAdjacent(pos, pos)).toBe(false);
    });
  });

  describe('getAdjacentPositions', () => {
    it('should return correct adjacent positions for corner', () => {
      const pos = { row: 0, col: 0 };
      const adjacent = GridGenerator.getAdjacentPositions(pos);
      
      expect(adjacent).toHaveLength(3);
      expect(adjacent).toContainEqual({ row: 0, col: 1 });
      expect(adjacent).toContainEqual({ row: 1, col: 0 });
      expect(adjacent).toContainEqual({ row: 1, col: 1 });
    });

    it('should return correct adjacent positions for center', () => {
      const pos = { row: 1, col: 1 };
      const adjacent = GridGenerator.getAdjacentPositions(pos);
      
      expect(adjacent).toHaveLength(8);
    });

    it('should not include positions outside grid bounds', () => {
      const pos = { row: 0, col: 0 };
      const adjacent = GridGenerator.getAdjacentPositions(pos);
      
      adjacent.forEach(adjPos => {
        expect(adjPos.row).toBeGreaterThanOrEqual(0);
        expect(adjPos.col).toBeGreaterThanOrEqual(0);
        expect(adjPos.row).toBeLessThan(BOGGLE_CONSTANTS.GRID_SIZE);
        expect(adjPos.col).toBeLessThan(BOGGLE_CONSTANTS.GRID_SIZE);
      });
    });
  });

  describe('positionsEqual', () => {
    it('should return true for equal positions', () => {
      const pos1 = { row: 1, col: 2 };
      const pos2 = { row: 1, col: 2 };
      
      expect(GridGenerator.positionsEqual(pos1, pos2)).toBe(true);
    });

    it('should return false for different positions', () => {
      const pos1 = { row: 1, col: 2 };
      const pos2 = { row: 1, col: 3 };
      const pos3 = { row: 2, col: 2 };
      
      expect(GridGenerator.positionsEqual(pos1, pos2)).toBe(false);
      expect(GridGenerator.positionsEqual(pos1, pos3)).toBe(false);
    });
  });
});