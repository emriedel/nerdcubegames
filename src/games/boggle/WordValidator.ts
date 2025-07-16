import { BOGGLE_CONSTANTS } from '@/lib/constants';

export class WordValidator {
  private validWords: Set<string>;
  private isLoaded: boolean = false;

  constructor() {
    this.validWords = new Set();
    // Load dictionary lazily when first needed
  }

  private async loadDictionary(): Promise<void> {
    if (this.isLoaded) return;
    try {
      // For now, use a basic word list. In production, this would load from a proper dictionary file
      const basicWords = [
        // 3-letter words
        'cat', 'dog', 'run', 'sun', 'fun', 'bat', 'hat', 'rat', 'mat', 'sat',
        'car', 'bar', 'far', 'jar', 'war', 'art', 'arm', 'age', 'ace', 'ice',
        'and', 'ant', 'any', 'are', 'ask', 'ate', 'bad', 'bag', 'bed', 'big',
        'bit', 'boy', 'but', 'buy', 'can', 'cap', 'cup', 'cut', 'day', 'did',
        'die', 'eat', 'egg', 'end', 'eye', 'far', 'few', 'fly', 'for', 'get',
        'got', 'gun', 'guy', 'had', 'has', 'her', 'him', 'his', 'hot', 'how',
        'its', 'job', 'key', 'kid', 'law', 'lay', 'leg', 'let', 'lie', 'lot',
        'low', 'man', 'may', 'new', 'not', 'now', 'old', 'one', 'our', 'out',
        'own', 'pay', 'put', 'ran', 'red', 'run', 'saw', 'say', 'see', 'she',
        'sit', 'six', 'ten', 'the', 'too', 'top', 'try', 'two', 'use', 'was',
        'way', 'who', 'why', 'win', 'won', 'yes', 'yet', 'you',
        
        // 4-letter words
        'able', 'back', 'ball', 'base', 'bear', 'beat', 'been', 'best', 'bike',
        'bird', 'blue', 'boat', 'body', 'book', 'born', 'both', 'call', 'came',
        'care', 'case', 'city', 'come', 'cool', 'corn', 'cost', 'dark', 'data',
        'date', 'dead', 'deal', 'deep', 'does', 'done', 'door', 'down', 'draw',
        'drop', 'each', 'east', 'easy', 'even', 'ever', 'face', 'fact', 'fall',
        'farm', 'fast', 'fear', 'feel', 'feet', 'fell', 'felt', 'file', 'fill',
        'find', 'fine', 'fire', 'fish', 'five', 'food', 'foot', 'form', 'four',
        'free', 'from', 'full', 'game', 'gave', 'give', 'glad', 'goes', 'gold',
        'gone', 'good', 'gray', 'grew', 'grow', 'hair', 'half', 'hand', 'hard',
        'have', 'head', 'hear', 'heat', 'held', 'help', 'here', 'high', 'hill',
        'hold', 'home', 'hope', 'hour', 'huge', 'idea', 'into', 'item', 'join',
        'jump', 'just', 'keep', 'kept', 'kind', 'knew', 'know', 'lack', 'land',
        'last', 'late', 'lead', 'left', 'less', 'life', 'like', 'line', 'list',
        'live', 'long', 'look', 'lose', 'lost', 'love', 'made', 'make', 'many',
        'mark', 'mass', 'math', 'meal', 'mean', 'meet', 'mind', 'miss', 'mode',
        'more', 'most', 'move', 'much', 'name', 'near', 'need', 'news', 'next',
        'nice', 'note', 'once', 'only', 'open', 'over', 'page', 'paid', 'part',
        'past', 'path', 'pick', 'plan', 'play', 'poor', 'push', 'race', 'read',
        'real', 'rise', 'risk', 'road', 'rock', 'role', 'room', 'rule', 'safe',
        'said', 'same', 'save', 'seat', 'seem', 'seen', 'self', 'sell', 'send',
        'sent', 'ship', 'shop', 'show', 'side', 'sign', 'site', 'size', 'slow',
        'snow', 'some', 'song', 'soon', 'sort', 'soul', 'stop', 'such', 'sure',
        'take', 'talk', 'task', 'team', 'tell', 'term', 'test', 'than', 'that',
        'them', 'then', 'they', 'this', 'thus', 'time', 'told', 'took', 'town',
        'tree', 'true', 'turn', 'type', 'unit', 'upon', 'used', 'user', 'vary',
        'very', 'view', 'wait', 'walk', 'wall', 'want', 'warm', 'wave', 'ways',
        'wear', 'week', 'well', 'went', 'were', 'what', 'when', 'will', 'wind',
        'wish', 'with', 'wood', 'word', 'work', 'year', 'your',
        
        // 5+ letter words
        'about', 'above', 'after', 'again', 'agree', 'ahead', 'allow', 'alone',
        'along', 'among', 'angry', 'apart', 'apple', 'apply', 'armed', 'around',
        'badge', 'basic', 'beach', 'began', 'begin', 'being', 'below', 'bench',
        'birth', 'black', 'blank', 'blind', 'block', 'blood', 'board', 'boost',
        'bound', 'brain', 'brand', 'bread', 'break', 'breed', 'brick', 'brief',
        'bring', 'broad', 'broke', 'brown', 'build', 'built', 'catch', 'cause',
        'chain', 'chair', 'chart', 'chase', 'cheap', 'check', 'chest', 'child',
        'china', 'claim', 'class', 'clean', 'clear', 'click', 'climb', 'clock',
        'close', 'cloud', 'coach', 'coast', 'count', 'court', 'cover', 'craft',
        'crash', 'crazy', 'cream', 'crime', 'cross', 'crowd', 'crown', 'dance',
        'death', 'depth', 'doing', 'doubt', 'dozen', 'draft', 'drama', 'dream',
        'dress', 'drill', 'drink', 'drive', 'drove', 'early', 'earth', 'eight',
        'empty', 'enemy', 'enjoy', 'enter', 'entry', 'equal', 'error', 'event',
        'every', 'exact', 'exist', 'extra', 'faith', 'false', 'fault', 'field',
        'fifth', 'fight', 'final', 'first', 'fixed', 'flash', 'flesh', 'floor',
        'focus', 'force', 'forth', 'forum', 'found', 'frame', 'fresh', 'front',
        'fruit', 'funny', 'ghost', 'giant', 'given', 'glass', 'globe', 'glory',
        'grace', 'grade', 'grand', 'grant', 'grass', 'great', 'green', 'gross',
        'group', 'grown', 'guard', 'guess', 'guest', 'guide', 'happy', 'harsh',
        'heart', 'heavy', 'horse', 'hotel', 'house', 'human', 'hurry', 'image',
        'index', 'inner', 'input', 'issue', 'japan', 'joint', 'judge', 'known',
        'label', 'large', 'laser', 'later', 'laugh', 'layer', 'learn', 'lease',
        'least', 'leave', 'legal', 'level', 'light', 'limit', 'local', 'loose',
        'lower', 'lucky', 'lunch', 'magic', 'major', 'maker', 'march', 'match',
        'maybe', 'mayor', 'meant', 'media', 'metal', 'might', 'minor', 'minus',
        'mixed', 'model', 'money', 'month', 'moral', 'motor', 'mount', 'mouse',
        'mouth', 'music', 'needs', 'never', 'night', 'noise', 'north', 'noted',
        'novel', 'nurse', 'occur', 'ocean', 'offer', 'often', 'older', 'orbit',
        'order', 'other', 'ought', 'outer', 'owned', 'owner', 'paint', 'panel',
        'paper', 'party', 'peace', 'phase', 'phone', 'photo', 'piano', 'piece',
        'pilot', 'pitch', 'place', 'plain', 'plane', 'plant', 'plate', 'plaza',
        'point', 'pound', 'power', 'press', 'price', 'pride', 'prime', 'print',
        'prior', 'prize', 'proof', 'proud', 'prove', 'queen', 'quick', 'quiet',
        'quite', 'radio', 'raise', 'range', 'rapid', 'ratio', 'reach', 'ready',
        'realm', 'rebel', 'refer', 'relax', 'reply', 'right', 'river', 'robot',
        'roman', 'rough', 'round', 'route', 'royal', 'rugby', 'rural', 'scale',
        'scene', 'scope', 'score', 'sense', 'serve', 'seven', 'shade', 'shake',
        'shall', 'shame', 'shape', 'share', 'sharp', 'sheet', 'shelf', 'shell',
        'shift', 'shine', 'shirt', 'shock', 'shoot', 'short', 'shown', 'sight',
        'silly', 'since', 'sixth', 'sixty', 'skill', 'sleep', 'slide', 'small',
        'smart', 'smile', 'smoke', 'snake', 'solid', 'solve', 'sorry', 'sound',
        'south', 'space', 'spare', 'speak', 'speed', 'spend', 'spent', 'split',
        'spoke', 'sport', 'staff', 'stage', 'stake', 'stand', 'start', 'state',
        'steal', 'steam', 'steel', 'stick', 'still', 'stock', 'stone', 'stood',
        'store', 'storm', 'story', 'strip', 'stuck', 'study', 'stuff', 'style',
        'sugar', 'suite', 'super', 'sweet', 'swing', 'table', 'taken', 'taste',
        'teach', 'thank', 'theft', 'their', 'theme', 'there', 'these', 'thick',
        'thing', 'think', 'third', 'those', 'three', 'threw', 'throw', 'thumb',
        'tiger', 'tight', 'timer', 'title', 'today', 'token', 'topic', 'total',
        'touch', 'tough', 'tower', 'track', 'trade', 'train', 'treat', 'trend',
        'trial', 'tribe', 'trick', 'tried', 'truck', 'truly', 'trust', 'truth',
        'twice', 'twist', 'ultra', 'uncle', 'under', 'union', 'unity', 'until',
        'upper', 'urban', 'usage', 'usual', 'valid', 'value', 'video', 'virus',
        'visit', 'vital', 'voice', 'waste', 'watch', 'water', 'wheel', 'where',
        'which', 'while', 'white', 'whole', 'whose', 'woman', 'women', 'world',
        'worry', 'worse', 'worst', 'worth', 'would', 'write', 'wrong', 'wrote',
        'young', 'youth'
      ];

      for (const word of basicWords) {
        this.validWords.add(word.toLowerCase());
      }
      
      this.isLoaded = true;
    } catch (error) {
      console.error('Failed to load dictionary:', error);
      this.isLoaded = false;
    }
  }

  isValidWord(word: string): boolean {
    if (word.length < BOGGLE_CONSTANTS.MIN_WORD_LENGTH) {
      return false;
    }

    // Load dictionary synchronously if not loaded
    if (!this.isLoaded) {
      this.loadDictionarySync();
    }

    return this.validWords.has(word.toLowerCase());
  }

  private loadDictionarySync(): void {
    if (this.isLoaded) return;
    
    try {
      // Load basic words synchronously to avoid async issues
      const basicWords = [
        // 3-letter words
        'cat', 'dog', 'run', 'sun', 'fun', 'bat', 'hat', 'rat', 'mat', 'sat',
        'car', 'bar', 'far', 'jar', 'war', 'art', 'arm', 'age', 'ace', 'ice',
        'and', 'ant', 'any', 'are', 'ask', 'ate', 'bad', 'bag', 'bed', 'big',
        'bit', 'boy', 'but', 'buy', 'can', 'cap', 'cup', 'cut', 'day', 'did',
        'die', 'eat', 'egg', 'end', 'eye', 'far', 'few', 'fly', 'for', 'get',
        'got', 'gun', 'guy', 'had', 'has', 'her', 'him', 'his', 'hot', 'how',
        'its', 'job', 'key', 'kid', 'law', 'lay', 'leg', 'let', 'lie', 'lot',
        'low', 'man', 'may', 'new', 'not', 'now', 'old', 'one', 'our', 'out',
        'own', 'pay', 'put', 'ran', 'red', 'run', 'saw', 'say', 'see', 'she',
        'sit', 'six', 'ten', 'the', 'too', 'top', 'try', 'two', 'use', 'was',
        'way', 'who', 'why', 'win', 'won', 'yes', 'yet', 'you',
        
        // 4-letter words (subset for faster loading)
        'able', 'back', 'ball', 'base', 'bear', 'beat', 'been', 'best', 'bike',
        'bird', 'blue', 'boat', 'body', 'book', 'born', 'both', 'call', 'came',
        'care', 'case', 'city', 'come', 'cool', 'corn', 'cost', 'dark', 'data',
        'date', 'dead', 'deal', 'deep', 'does', 'done', 'door', 'down', 'draw',
        'drop', 'each', 'east', 'easy', 'even', 'ever', 'face', 'fact', 'fall',
        'farm', 'fast', 'fear', 'feel', 'feet', 'fell', 'felt', 'file', 'fill',
        'find', 'fine', 'fire', 'fish', 'five', 'food', 'foot', 'form', 'four',
        'free', 'from', 'full', 'game', 'gave', 'give', 'glad', 'goes', 'gold',
        'gone', 'good', 'gray', 'grew', 'grow', 'hair', 'half', 'hand', 'hard',
        'have', 'head', 'hear', 'heat', 'held', 'help', 'here', 'high', 'hill',
        'hold', 'home', 'hope', 'hour', 'huge', 'idea', 'into', 'item', 'join',
        'jump', 'just', 'keep', 'kept', 'kind', 'knew', 'know', 'lack', 'land',
        'last', 'late', 'lead', 'left', 'less', 'life', 'like', 'line', 'list',
        'live', 'long', 'look', 'lose', 'lost', 'love', 'made', 'make', 'many',
        'mark', 'mass', 'math', 'meal', 'mean', 'meet', 'mind', 'miss', 'mode',
        'more', 'most', 'move', 'much', 'name', 'near', 'need', 'news', 'next',
        'nice', 'note', 'once', 'only', 'open', 'over', 'page', 'paid', 'part',
        'past', 'path', 'pick', 'plan', 'play', 'poor', 'push', 'race', 'read',
        'real', 'rise', 'risk', 'road', 'rock', 'role', 'room', 'rule', 'safe',
        'said', 'same', 'save', 'seat', 'seem', 'seen', 'self', 'sell', 'send',
        'sent', 'ship', 'shop', 'show', 'side', 'sign', 'site', 'size', 'slow',
        'snow', 'some', 'song', 'soon', 'sort', 'soul', 'stop', 'such', 'sure',
        'take', 'talk', 'task', 'team', 'tell', 'term', 'test', 'than', 'that',
        'them', 'then', 'they', 'this', 'thus', 'time', 'told', 'took', 'town',
        'tree', 'true', 'turn', 'type', 'unit', 'upon', 'used', 'user', 'vary',
        'very', 'view', 'wait', 'walk', 'wall', 'want', 'warm', 'wave', 'ways',
        'wear', 'week', 'well', 'went', 'were', 'what', 'when', 'will', 'wind',
        'wish', 'with', 'wood', 'word', 'work', 'year', 'your'
      ];

      for (const word of basicWords) {
        this.validWords.add(word.toLowerCase());
      }
      
      this.isLoaded = true;
    } catch (error) {
      console.error('Failed to load dictionary:', error);
      this.isLoaded = false;
    }
  }

  getWordScore(word: string): number {
    if (!this.isValidWord(word)) {
      return 0;
    }

    const length = word.length;
    
    if (length >= 8) {
      return BOGGLE_CONSTANTS.SCORING[8];
    }
    
    return BOGGLE_CONSTANTS.SCORING[length as keyof typeof BOGGLE_CONSTANTS.SCORING] || 0;
  }

  // Find all possible words in the grid (for solution checking)
  findAllWords(grid: string[][]): string[] {
    const foundWords: Set<string> = new Set();
    const visited: boolean[][] = Array(grid.length).fill(null).map(() => Array(grid[0].length).fill(false));

    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[0].length; col++) {
        this.dfsSearch(grid, row, col, '', visited, foundWords);
      }
    }

    return Array.from(foundWords);
  }

  private dfsSearch(
    grid: string[][],
    row: number,
    col: number,
    currentWord: string,
    visited: boolean[][],
    foundWords: Set<string>
  ): void {
    if (row < 0 || row >= grid.length || col < 0 || col >= grid[0].length || visited[row][col]) {
      return;
    }

    const newWord = currentWord + grid[row][col].toLowerCase();
    
    if (newWord.length >= BOGGLE_CONSTANTS.MIN_WORD_LENGTH && this.isValidWord(newWord)) {
      foundWords.add(newWord);
    }

    if (newWord.length >= BOGGLE_CONSTANTS.MAX_WORD_LENGTH) {
      return;
    }

    visited[row][col] = true;

    // Check all 8 adjacent cells
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        this.dfsSearch(grid, row + dr, col + dc, newWord, visited, foundWords);
      }
    }

    visited[row][col] = false;
  }
}