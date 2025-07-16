export class PuzzleGenerator {
  static generateDailySeed(date?: string): string {
    const puzzleDate = date || new Date().toISOString().split('T')[0];
    return `puzzle-${puzzleDate}`;
  }

  static createSeededRandom(seed: string): () => number {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      const char = seed.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    
    return function() {
      hash = ((hash * 9301) + 49297) % 233280;
      return hash / 233280;
    };
  }

  static shuffleArray<T>(array: T[], random: () => number): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  static selectRandomItems<T>(array: T[], count: number, random: () => number): T[] {
    const shuffled = this.shuffleArray(array, random);
    return shuffled.slice(0, count);
  }

  static generateWeightedSelection<T>(
    items: T[], 
    weights: number[], 
    count: number, 
    random: () => number
  ): T[] {
    if (items.length !== weights.length) {
      throw new Error('Items and weights arrays must have the same length');
    }

    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    const selected: T[] = [];

    for (let i = 0; i < count; i++) {
      let randomValue = random() * totalWeight;
      let selectedIndex = 0;

      for (let j = 0; j < weights.length; j++) {
        randomValue -= weights[j];
        if (randomValue <= 0) {
          selectedIndex = j;
          break;
        }
      }

      selected.push(items[selectedIndex]);
    }

    return selected;
  }
}