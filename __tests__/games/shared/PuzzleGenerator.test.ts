import { PuzzleGenerator } from '@/games/shared/PuzzleGenerator';

describe('PuzzleGenerator', () => {
  describe('generateDailySeed', () => {
    it('should generate consistent seed for same date', () => {
      const date = '2024-01-01';
      const seed1 = PuzzleGenerator.generateDailySeed(date);
      const seed2 = PuzzleGenerator.generateDailySeed(date);
      
      expect(seed1).toBe(seed2);
      expect(seed1).toBe('puzzle-2024-01-01');
    });

    it('should use current date when no date provided', () => {
      const today = new Date().toISOString().split('T')[0];
      const seed = PuzzleGenerator.generateDailySeed();
      
      expect(seed).toBe(`puzzle-${today}`);
    });
  });

  describe('createSeededRandom', () => {
    it('should generate consistent random numbers for same seed', () => {
      const seed = 'test-seed';
      const random1 = PuzzleGenerator.createSeededRandom(seed);
      const random2 = PuzzleGenerator.createSeededRandom(seed);
      
      const values1 = Array.from({ length: 10 }, () => random1());
      const values2 = Array.from({ length: 10 }, () => random2());
      
      expect(values1).toEqual(values2);
    });

    it('should generate different numbers for different seeds', () => {
      const random1 = PuzzleGenerator.createSeededRandom('seed1');
      const random2 = PuzzleGenerator.createSeededRandom('seed2');
      
      const value1 = random1();
      const value2 = random2();
      
      expect(value1).not.toBe(value2);
    });

    it('should generate numbers between 0 and 1', () => {
      const random = PuzzleGenerator.createSeededRandom('test');
      
      for (let i = 0; i < 100; i++) {
        const value = random();
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThan(1);
      }
    });
  });

  describe('shuffleArray', () => {
    it('should maintain array length', () => {
      const array = [1, 2, 3, 4, 5];
      const random = PuzzleGenerator.createSeededRandom('test');
      const shuffled = PuzzleGenerator.shuffleArray(array, random);
      
      expect(shuffled).toHaveLength(array.length);
    });

    it('should contain all original elements', () => {
      const array = [1, 2, 3, 4, 5];
      const random = PuzzleGenerator.createSeededRandom('test');
      const shuffled = PuzzleGenerator.shuffleArray(array, random);
      
      expect(shuffled.sort()).toEqual(array.sort());
    });

    it('should be deterministic with same seed', () => {
      const array = [1, 2, 3, 4, 5];
      const random1 = PuzzleGenerator.createSeededRandom('test');
      const random2 = PuzzleGenerator.createSeededRandom('test');
      
      const shuffled1 = PuzzleGenerator.shuffleArray(array, random1);
      const shuffled2 = PuzzleGenerator.shuffleArray(array, random2);
      
      expect(shuffled1).toEqual(shuffled2);
    });
  });

  describe('selectRandomItems', () => {
    it('should select correct number of items', () => {
      const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const random = PuzzleGenerator.createSeededRandom('test');
      const selected = PuzzleGenerator.selectRandomItems(array, 3, random);
      
      expect(selected).toHaveLength(3);
    });

    it('should select items from original array', () => {
      const array = [1, 2, 3, 4, 5];
      const random = PuzzleGenerator.createSeededRandom('test');
      const selected = PuzzleGenerator.selectRandomItems(array, 3, random);
      
      selected.forEach(item => {
        expect(array).toContain(item);
      });
    });
  });
});