'use client'

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { WordInfo } from '@/games/boggle/BoggleTypes';

interface WordListProps {
  words: WordInfo[];
  maxHeight?: string;
  className?: string;
}

const WordList: React.FC<WordListProps> = ({ 
  words, 
  maxHeight = '200px',
  className 
}) => {
  const sortedWords = [...words].sort((a, b) => {
    // Sort by length first (longer words first), then alphabetically
    if (a.length !== b.length) {
      return b.length - a.length;
    }
    return a.word.localeCompare(b.word);
  });

  const getScoreColor = (score: number): string => {
    if (score >= 11) return 'text-purple-600 dark:text-purple-400';
    if (score >= 5) return 'text-blue-600 dark:text-blue-400';
    if (score >= 3) return 'text-green-600 dark:text-green-400';
    if (score >= 2) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Found Words
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {words.length} word{words.length !== 1 ? 's' : ''}
        </span>
      </div>
      
      <div 
        className="overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
        style={{ maxHeight }}
      >
        {sortedWords.length > 0 ? (
          <div className="p-3 space-y-1">
            <AnimatePresence>
              {sortedWords.map((wordInfo, index) => (
                <motion.div
                  key={wordInfo.word}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="flex items-center justify-between p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                >
                  <div className="flex items-center space-x-3">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {wordInfo.word.toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {wordInfo.length} letters
                    </span>
                  </div>
                  <span className={cn('text-sm font-bold', getScoreColor(wordInfo.score))}>
                    {wordInfo.score} pt{wordInfo.score !== 1 ? 's' : ''}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            <p className="text-sm">No words found yet</p>
            <p className="text-xs mt-1">Find words by connecting adjacent letters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WordList;