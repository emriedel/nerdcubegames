'use client'

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface WordDisplayProps {
  currentWord: string;
  isValid?: boolean;
  className?: string;
}

const WordDisplay: React.FC<WordDisplayProps> = React.memo(({ 
  currentWord, 
  isValid, 
  className 
}) => {
  return (
    <div className={cn('flex items-center justify-center min-h-[60px]', className)}>
      <AnimatePresence mode="wait">
        {currentWord ? (
          <motion.div
            key={currentWord}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'text-2xl font-bold px-4 py-2 rounded-lg border-2 transition-colors duration-200',
              {
                'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white': 
                  isValid === undefined,
                'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700 text-green-700 dark:text-green-300': 
                  isValid === true,
                'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700 text-red-700 dark:text-red-300': 
                  isValid === false,
              }
            )}
          >
            {currentWord.toUpperCase()}
          </motion.div>
        ) : (
          <motion.div
            key="placeholder"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-gray-400 dark:text-gray-500 text-lg font-medium"
          >
            Select letters to form a word
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

WordDisplay.displayName = 'WordDisplay';

export default WordDisplay;