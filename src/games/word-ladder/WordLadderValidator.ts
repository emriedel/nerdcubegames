export class WordLadderValidator {
  private validWords: Set<string>;
  private isLoaded: boolean = false;

  constructor() {
    this.validWords = new Set();
    this.loadDictionarySync();
  }

  private loadDictionarySync(): void {
    if (this.isLoaded) return;
    
    try {
      // Extended word list specifically for word ladders
      const wordLadderWords = [
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
        'wish', 'with', 'wood', 'word', 'work', 'year', 'your', 'zero', 'zone',
        'cold', 'warm', 'cord', 'word', 'lord', 'lard', 'ward', 'wary', 'mary',
        'mare', 'care', 'core', 'come', 'home', 'hole', 'role', 'pole', 'pile',
        'bile', 'bite', 'site', 'site', 'cite', 'cute', 'cure', 'pure', 'pore',
        'bore', 'wore', 'wire', 'tire', 'dire', 'dime', 'dame', 'tame', 'tale',
        'tale', 'pale', 'pall', 'ball', 'bell', 'belt', 'bent', 'beat', 'heat',
        'hate', 'gate', 'late', 'rate', 'mate', 'make', 'lake', 'bake', 'bike',
        'like', 'line', 'mine', 'nine', 'wine', 'vine', 'vile', 'vise', 'wise',
        'rise', 'rice', 'race', 'pace', 'face', 'fade', 'fads', 'fast', 'last',
        'lost', 'lost', 'lots', 'dots', 'dots', 'rots', 'rats', 'cats', 'bats',
        'bars', 'cars', 'card', 'cart', 'part', 'port', 'port', 'poor', 'door',
        'dose', 'rose', 'pose', 'lose', 'lone', 'lone', 'tone', 'bone', 'cone',
        'gone', 'done', 'done', 'dose', 'dome', 'some', 'come', 'coma', 'cola',
        'cold', 'fold', 'food', 'good', 'mood', 'moon', 'soon', 'soot', 'boot',
        'boat', 'coat', 'cost', 'cast', 'cash', 'dash', 'dish', 'fish', 'fist',
        'list', 'mist', 'most', 'must', 'rust', 'bust', 'just', 'jest', 'best',
        'rest', 'test', 'tent', 'bent', 'sent', 'cent', 'went', 'want', 'wont',
        'font', 'foot', 'boot', 'loot', 'loop', 'loop', 'hoop', 'hope', 'rope',
        'ripe', 'pipe', 'pine', 'pint', 'lint', 'hint', 'hunt', 'hurt', 'hart',
        'hard', 'herd', 'held', 'help', 'kelp', 'keep', 'keen', 'seen', 'seem',
        'seam', 'beam', 'bear', 'near', 'gear', 'dear', 'year', 'wear', 'pear',
        'pair', 'paid', 'laid', 'land', 'band', 'hand', 'hard', 'card', 'cars',
        'mars', 'mark', 'park', 'dark', 'dare', 'care', 'core', 'cord', 'ford',
        'form', 'farm', 'harm', 'harp', 'hard', 'hart', 'part', 'port', 'sort',
        'soft', 'loft', 'left', 'life', 'wife', 'wide', 'side', 'site', 'bite',
        'bits', 'bats', 'cats', 'cuts', 'guts', 'nuts', 'note', 'nose', 'rose',
        'role', 'hole', 'home', 'some', 'same', 'came', 'cake', 'take', 'tale',
        'maze', 'make', 'male', 'mall', 'mail', 'nail', 'pail', 'pain', 'main',
        'maid', 'said', 'sand', 'send', 'tend', 'bend', 'bell', 'well', 'wall',
        'tall', 'talk', 'walk', 'work', 'word', 'lord', 'lard', 'yard', 'yarn',
        'yawn', 'dawn', 'down', 'town', 'torn', 'turn', 'burn', 'born', 'corn',
        'core', 'fore', 'fire', 'hire', 'wire', 'wise', 'wife', 'life', 'lift',
        'left', 'lest', 'best', 'test', 'rest', 'nest', 'next', 'text', 'tent',
        'rent', 'rent', 'vent', 'went', 'want', 'wait', 'bait', 'bail', 'ball',
        'bill', 'bull', 'full', 'fall', 'tall', 'tell', 'sell', 'cell', 'call',
        'calm', 'balm', 'palm', 'pall', 'mall', 'male', 'mole', 'role', 'rode',
        'code', 'come', 'dome', 'done', 'tone', 'bone', 'bony', 'body', 'baby',
        'lady', 'lacy', 'lazy', 'hazy', 'maze', 'mace', 'race', 'face', 'fade',
        
        // 5-letter words for word ladders
        'about', 'above', 'adult', 'after', 'again', 'ahead', 'alive', 'alone',
        'along', 'angry', 'apart', 'apple', 'apply', 'arena', 'argue', 'arise',
        'armed', 'array', 'arrow', 'aside', 'asset', 'avoid', 'awake', 'award',
        'aware', 'badly', 'badge', 'basic', 'beach', 'began', 'begin', 'being',
        'below', 'bench', 'billy', 'birth', 'black', 'blame', 'blank', 'blind',
        'block', 'blood', 'board', 'boost', 'booth', 'bound', 'brain', 'brand',
        'brass', 'brave', 'bread', 'break', 'breed', 'brick', 'bride', 'brief',
        'bring', 'broad', 'broke', 'brown', 'brush', 'build', 'built', 'bunch',
        'buyer', 'cable', 'cache', 'candy', 'carry', 'catch', 'cause', 'chain',
        'chair', 'chaos', 'charm', 'chart', 'chase', 'cheap', 'check', 'chest',
        'chief', 'child', 'china', 'choir', 'chose', 'civil', 'claim', 'clash',
        'class', 'clean', 'clear', 'click', 'climb', 'clock', 'close', 'cloud',
        'coach', 'coast', 'could', 'count', 'court', 'cover', 'crack', 'craft',
        'crash', 'crazy', 'cream', 'crime', 'crisp', 'cross', 'crowd', 'crown',
        'crude', 'curve', 'cycle', 'daily', 'dance', 'dated', 'dealt', 'death',
        'debut', 'delay', 'depth', 'doing', 'doubt', 'dozen', 'draft', 'drama',
        'drank', 'drawn', 'dream', 'dress', 'drill', 'drink', 'drive', 'drove',
        'dying', 'eager', 'early', 'earth', 'eight', 'elite', 'empty', 'enemy',
        'enjoy', 'enter', 'entry', 'equal', 'error', 'event', 'every', 'exact',
        'exist', 'extra', 'faith', 'false', 'fault', 'fiber', 'field', 'fifth',
        'fifty', 'fight', 'final', 'first', 'fixed', 'flash', 'fleet', 'floor',
        'fluid', 'focus', 'force', 'forth', 'forum', 'found', 'frame', 'frank',
        'fraud', 'fresh', 'front', 'fruit', 'fully', 'funny', 'giant', 'given',
        'glass', 'globe', 'glory', 'grace', 'grade', 'grain', 'grand', 'grant',
        'grass', 'grave', 'great', 'green', 'gross', 'group', 'grown', 'guard',
        'guess', 'guest', 'guide', 'happy', 'harry', 'harsh', 'heart', 'heavy',
        'horse', 'hotel', 'house', 'human', 'hurry', 'image', 'index', 'inner',
        'input', 'issue', 'japan', 'jimmy', 'joint', 'jones', 'judge', 'known',
        'label', 'large', 'laser', 'later', 'laugh', 'layer', 'learn', 'lease',
        'least', 'leave', 'legal', 'level', 'lewis', 'light', 'limit', 'links',
        'lived', 'local', 'logic', 'loose', 'lower', 'lucky', 'lunch', 'lying',
        'magic', 'major', 'maker', 'march', 'maria', 'match', 'maybe', 'mayor',
        'meant', 'media', 'metal', 'might', 'minor', 'minus', 'mixed', 'model',
        'money', 'month', 'moral', 'motor', 'mount', 'mouse', 'mouth', 'moved',
        'movie', 'music', 'needs', 'never', 'newly', 'night', 'noise', 'north',
        'noted', 'novel', 'nurse', 'occur', 'ocean', 'offer', 'often', 'older',
        'olive', 'order', 'other', 'ought', 'outer', 'owned', 'owner', 'paint',
        'panel', 'paper', 'party', 'peace', 'peter', 'phase', 'phone', 'photo',
        'piano', 'piece', 'pilot', 'pitch', 'place', 'plain', 'plane', 'plant',
        'plate', 'point', 'pound', 'power', 'press', 'price', 'pride', 'prime',
        'print', 'prior', 'prize', 'proof', 'proud', 'prove', 'queen', 'quick',
        'quiet', 'quite', 'radio', 'raise', 'range', 'rapid', 'ratio', 'reach',
        'ready', 'realm', 'rebel', 'refer', 'relax', 'reply', 'right', 'rigid',
        'rival', 'river', 'robin', 'roger', 'roman', 'rough', 'round', 'route',
        'royal', 'rural', 'safer', 'scale', 'scare', 'scene', 'scope', 'score',
        'sense', 'serve', 'seven', 'shade', 'shake', 'shall', 'shame', 'shape',
        'share', 'sharp', 'sheet', 'shelf', 'shell', 'shift', 'shine', 'shirt',
        'shock', 'shoot', 'short', 'shown', 'sight', 'silly', 'simon', 'since',
        'sixth', 'sixty', 'sized', 'skill', 'slash', 'sleep', 'slide', 'small',
        'smart', 'smile', 'smith', 'smoke', 'snake', 'solid', 'solve', 'sorry',
        'sound', 'south', 'space', 'spare', 'speak', 'speed', 'spend', 'spent',
        'split', 'spoke', 'sport', 'squad', 'staff', 'stage', 'stake', 'stand',
        'start', 'state', 'steam', 'steel', 'steep', 'steer', 'steve', 'stick',
        'still', 'stock', 'stone', 'stood', 'store', 'storm', 'story', 'strip',
        'stuck', 'study', 'stuff', 'style', 'sugar', 'suite', 'super', 'sweet',
        'swift', 'swing', 'swiss', 'table', 'taken', 'taste', 'taxes', 'teach',
        'terry', 'texas', 'thank', 'theft', 'their', 'theme', 'there', 'these',
        'thick', 'thing', 'think', 'third', 'those', 'three', 'threw', 'throw',
        'thumb', 'tiger', 'tight', 'timer', 'tired', 'title', 'today', 'token',
        'topic', 'total', 'touch', 'tough', 'tower', 'track', 'trade', 'train',
        'treat', 'trend', 'trial', 'tribe', 'trick', 'tried', 'tries', 'truck',
        'truly', 'trunk', 'trust', 'truth', 'twice', 'twist', 'tyler', 'ultra',
        'uncle', 'under', 'undue', 'union', 'unity', 'until', 'upper', 'upset',
        'urban', 'usage', 'usual', 'valid', 'value', 'video', 'virus', 'visit',
        'vital', 'vocal', 'voice', 'waste', 'watch', 'water', 'wheel', 'where',
        'which', 'while', 'white', 'whole', 'whose', 'woman', 'women', 'world',
        'worry', 'worse', 'worst', 'worth', 'would', 'write', 'wrong', 'wrote',
        'young', 'youth',
        
        // Common word ladder intermediate words
        'lite', 'mild', 'wild', 'will', 'wilt', 'tilt', 'tile', 'tale', 'tall',
        'toll', 'tool', 'cool', 'coal', 'coat', 'boat', 'boot', 'book', 'cook',
        'look', 'loop', 'loom', 'zoom', 'boom', 'room', 'roam', 'foam', 'form',
        'norm', 'worn', 'word', 'work', 'fork', 'folk', 'yolk', 'york', 'yore',
        'wore', 'wire', 'hire', 'here', 'hero', 'zero', 'term', 'germ', 'perm',
        'warm', 'worm', 'worn', 'born', 'barn', 'yarn', 'yard', 'hard', 'herd',
        'herb', 'verb', 'very', 'vary', 'mary', 'many', 'mane', 'lane', 'land',
        'sand', 'said', 'sail', 'tail', 'tall', 'tell', 'yell', 'well', 'will',
        'wild', 'wind', 'wine', 'wine', 'dine', 'done', 'dome', 'home', 'hole',
        'role', 'pole', 'pale', 'pall', 'pill', 'pull', 'bull', 'bill', 'bell',
        'ball', 'wall', 'walk', 'talk', 'tall', 'tell', 'cell', 'sell', 'sell',
        'sour', 'soul', 'soil', 'boil', 'bail', 'ball', 'bell', 'fell', 'feel',
        'reel', 'real', 'read', 'head', 'heat', 'seat', 'beat', 'bear', 'dear',
        'gear', 'year', 'your', 'four', 'pour', 'hour', 'sour'
      ];

      for (const word of wordLadderWords) {
        this.validWords.add(word.toLowerCase());
      }
      
      this.isLoaded = true;
    } catch (error) {
      console.error('Failed to load dictionary:', error);
      this.isLoaded = false;
    }
  }

  isValidWord(word: string): boolean {
    if (!word || word.length < 3) {
      return false;
    }

    return this.validWords.has(word.toLowerCase());
  }

  // Find words that differ by exactly one letter
  findOneLetterDifferences(word: string): string[] {
    const results: string[] = [];
    const wordLower = word.toLowerCase();
    
    // Try changing each letter
    for (let i = 0; i < wordLower.length; i++) {
      for (let charCode = 97; charCode <= 122; charCode++) { // a-z
        const newChar = String.fromCharCode(charCode);
        if (newChar !== wordLower[i]) {
          const newWord = wordLower.substring(0, i) + newChar + wordLower.substring(i + 1);
          if (this.isValidWord(newWord)) {
            results.push(newWord);
          }
        }
      }
    }
    
    return results;
  }

  // Check if two words differ by exactly one letter
  isOneLetterDifference(word1: string, word2: string): boolean {
    if (word1.length !== word2.length) {
      return false;
    }
    
    let differences = 0;
    for (let i = 0; i < word1.length; i++) {
      if (word1[i] !== word2[i]) {
        differences++;
        if (differences > 1) {
          return false;
        }
      }
    }
    
    return differences === 1;
  }
}