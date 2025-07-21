'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { WordLadderStep } from '@/games/word-ladder/WordLadderTypes';

interface WordLadderPathProps {
  path: WordLadderStep[];
  targetWord: string;
  currentWord: string;
}

const WordLadderPath: React.FC<WordLadderPathProps> = ({ path, targetWord, currentWord }) => {
  const highlightChangedLetters = (word1: string, word2: string) => {
    const letters = word1.split('').map((letter, index) => {
      const isChanged = word2[index] !== letter;
      return (
        <span
          key={index}
          className={isChanged ? 'text-blue-600 dark:text-blue-400 font-bold' : ''}
        >
          {letter}
        </span>
      );
    });
    return letters;
  };

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-center text-gray-700 dark:text-gray-300">
        Word Path
      </h3>
      
      <div className="flex flex-col items-center space-y-2 min-h-[200px] max-h-[300px] overflow-y-auto">
        {path.map((step, index) => {
          const isLast = index === path.length - 1;
          const isTarget = step.word === targetWord;
          const previousWord = index > 0 ? path[index - 1].word : '';
          
          return (
            <motion.div
              key={step.index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-3"
            >
              {/* Step number */}
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-sm font-bold">
                {index + 1}
              </div>
              
              {/* Word */}
              <div
                className={`
                  px-4 py-2 rounded-lg font-mono text-lg font-bold border-2 min-w-[120px] text-center
                  ${isTarget 
                    ? 'bg-green-100 dark:bg-green-900/30 border-green-500 text-green-700 dark:text-green-300' 
                    : isLast
                    ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-500 text-blue-700 dark:text-blue-300'
                    : 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                  }
                `}
              >
                {index > 0 ? highlightChangedLetters(step.word, previousWord) : step.word.toUpperCase()}
              </div>
              
              {/* Target indicator */}
              {isTarget && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-green-500 text-xl"
                >
                  🎯
                </motion.div>
              )}
            </motion.div>
          );
        })}
        
        {/* Show target word if not reached */}
        {!path.some(step => step.word === targetWord) && (
          <>
            {/* Connecting dots */}
            <div className="flex flex-col items-center space-y-1 py-2">
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            </div>
            
            {/* Target word */}
            <motion.div
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              className="flex items-center space-x-3"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-200 dark:bg-green-800 flex items-center justify-center text-sm font-bold">
                🎯
              </div>
              <div className="px-4 py-2 rounded-lg font-mono text-lg font-bold border-2 min-w-[120px] text-center bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700 text-green-700 dark:text-green-300 border-dashed">
                {targetWord.toUpperCase()}
              </div>
            </motion.div>
          </>
        )}
      </div>
      
      {/* Progress indicator */}
      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        Step {path.length} of {path.length > 0 ? '?' : '0'}
        {path.some(step => step.word === targetWord) && (
          <span className="text-green-600 dark:text-green-400 ml-2">✓ Complete!</span>
        )}
      </div>
    </div>
  );
};

export default WordLadderPath;