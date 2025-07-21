export const GAME_TYPES = {
  BOGGLE: 'boggle',
  CONNECTIONS: 'connections',
  WORD_LADDER: 'word-ladder',
} as const;

export const GAME_CONFIGS = {
  [GAME_TYPES.BOGGLE]: {
    timeLimit: 180, // 3 minutes in seconds
    gameType: GAME_TYPES.BOGGLE,
    version: '1.0.0',
  },
  [GAME_TYPES.WORD_LADDER]: {
    timeLimit: 300, // 5 minutes in seconds
    gameType: GAME_TYPES.WORD_LADDER,
    version: '1.0.0',
  },
} as const;

export const STORAGE_KEYS = {
  GAME_STATE: 'nerdcube-game-state',
  GAME_RESULTS: 'nerdcube-game-results',
  USER_PREFERENCES: 'nerdcube-preferences',
} as const;

export const BOGGLE_CONSTANTS = {
  GRID_SIZE: 4,
  MIN_WORD_LENGTH: 3,
  MAX_WORD_LENGTH: 16,
  LETTER_FREQUENCIES: {
    A: 8.12, B: 1.49, C: 2.78, D: 4.25, E: 12.02, F: 2.23, G: 2.02,
    H: 6.09, I: 6.97, J: 0.15, K: 0.77, L: 4.03, M: 2.41, N: 6.75,
    O: 7.51, P: 1.93, Q: 0.10, R: 5.99, S: 6.33, T: 9.06, U: 2.76,
    V: 0.98, W: 2.36, X: 0.15, Y: 1.97, Z: 0.07
  },
  SCORING: {
    3: 1, 4: 1, 5: 2, 6: 3, 7: 5, 8: 11
  }
} as const;

export const WORD_LADDER_CONSTANTS = {
  MIN_WORD_LENGTH: 4,
  MAX_WORD_LENGTH: 6,
  MAX_HINTS: 3,
  SCORING: {
    BASE_SCORE: 1000,
    STEP_PENALTY: 50,
    HINT_PENALTY: 100,
    TIME_BONUS_THRESHOLD: 120, // seconds
    TIME_BONUS_MULTIPLIER: 1.5,
  },
  DIFFICULTY_THRESHOLDS: {
    EASY: { min: 3, max: 5 },
    MEDIUM: { min: 4, max: 7 },
    HARD: { min: 6, max: 10 },
  }
} as const;

export const API_ENDPOINTS = {
  DICTIONARY_CHECK: '/api/dictionary/check',
  WORD_LIST: '/api/dictionary/words',
} as const;

export const UI_CONSTANTS = {
  TOUCH_TARGET_SIZE: 44, // minimum touch target size in pixels
  ANIMATION_DURATION: 200, // default animation duration in ms
  DEBOUNCE_DELAY: 300, // default debounce delay in ms
} as const;