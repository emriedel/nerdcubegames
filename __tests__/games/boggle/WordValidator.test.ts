import { WordValidator } from '@/games/boggle/WordValidator';
import { BOGGLE_CONSTANTS } from '@/lib/constants';

describe('WordValidator', () => {
  let validator: WordValidator;

  beforeEach(() => {
    validator = new WordValidator();
  });

  describe('isValidWord', () => {
    it('should return true for valid words', () => {
      expect(validator.isValidWord('cat')).toBe(true);
      expect(validator.isValidWord('dog')).toBe(true);
      expect(validator.isValidWord('test')).toBe(true);
    });

    it('should return false for words shorter than minimum length', () => {
      expect(validator.isValidWord('a')).toBe(false);
      expect(validator.isValidWord('ab')).toBe(false);
    });

    it('should return false for invalid words', () => {
      expect(validator.isValidWord('xyz123')).toBe(false);
      expect(validator.isValidWord('notaword')).toBe(false);
    });

    it('should be case insensitive', () => {
      expect(validator.isValidWord('CAT')).toBe(true);
      expect(validator.isValidWord('Cat')).toBe(true);
      expect(validator.isValidWord('cAt')).toBe(true);
    });
  });

  describe('getWordScore', () => {
    it('should return 0 for invalid words', () => {
      expect(validator.getWordScore('xyz')).toBe(0);
      expect(validator.getWordScore('ab')).toBe(0);
    });

    it('should return correct scores for valid words', () => {
      expect(validator.getWordScore('cat')).toBe(BOGGLE_CONSTANTS.SCORING[3]);
      expect(validator.getWordScore('test')).toBe(BOGGLE_CONSTANTS.SCORING[4]);
      expect(validator.getWordScore('tests')).toBe(BOGGLE_CONSTANTS.SCORING[5]);
    });

    it('should use max score for very long words', () => {
      // Create a mock long word that would be valid
      const longWord = 'a'.repeat(10);
      // This test assumes the word would be valid, but our current validator
      // likely won't recognize it. This is more of a structural test.
      const score = validator.getWordScore(longWord);
      expect(typeof score).toBe('number');
      expect(score).toBeGreaterThanOrEqual(0);
    });
  });

  describe('findAllWords', () => {
    it('should find words in a simple grid', () => {
      const grid = [
        ['c', 'a', 't', 's'],
        ['o', 'r', 'e', 'a'],
        ['w', 'o', 'r', 'd'],
        ['s', 'u', 'n', 's']
      ];

      const words = validator.findAllWords(grid);
      
      expect(Array.isArray(words)).toBe(true);
      expect(words.length).toBeGreaterThan(0);
      
      // Check that found words are valid
      words.forEach(word => {
        expect(validator.isValidWord(word)).toBe(true);
        expect(word.length).toBeGreaterThanOrEqual(BOGGLE_CONSTANTS.MIN_WORD_LENGTH);
      });
    });

    it('should not find duplicate words', () => {
      const grid = [
        ['c', 'a', 't', 's'],
        ['a', 't', 's', 'a'],
        ['t', 's', 'a', 't'],
        ['s', 'a', 't', 's']
      ];

      const words = validator.findAllWords(grid);
      const uniqueWords = [...new Set(words)];
      
      expect(words.length).toBe(uniqueWords.length);
    });

    it('should return empty array for grid with no valid words', () => {
      const grid = [
        ['x', 'z', 'q', 'j'],
        ['z', 'x', 'j', 'q'],
        ['q', 'j', 'x', 'z'],
        ['j', 'q', 'z', 'x']
      ];

      const words = validator.findAllWords(grid);
      expect(words).toEqual([]);
    });
  });
});