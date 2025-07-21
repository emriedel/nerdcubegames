'use client'

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';

interface WordLadderInputProps {
  currentWord: string;
  onSubmit: (word: string) => boolean;
  value: string;
  onChange: (value: string) => void;
  error: string | null;
  onErrorClear: () => void;
}

const WordLadderInput: React.FC<WordLadderInputProps> = ({
  currentWord,
  onSubmit,
  value,
  onChange,
  error,
  onErrorClear
}) => {
  const [localValue, setLocalValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    // Focus input when component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    // Clear error when user starts typing
    if (error && localValue !== value) {
      onErrorClear();
    }
  }, [localValue, value, error, onErrorClear]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.toLowerCase().slice(0, currentWord.length);
    setLocalValue(newValue);
    onChange(newValue);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localValue.length === currentWord.length) {
      const success = onSubmit(localValue);
      if (success) {
        setLocalValue('');
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  const getLetterDifferences = () => {
    const differences: number[] = [];
    for (let i = 0; i < currentWord.length; i++) {
      if (localValue[i] && localValue[i] !== currentWord[i]) {
        differences.push(i);
      }
    }
    return differences;
  };

  const differences = getLetterDifferences();
  const isValidLength = localValue.length === currentWord.length;
  const hasExactlyOneChange = differences.length === 1 && isValidLength;

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Enter Next Word
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Change exactly one letter from: <span className="font-mono font-bold">{currentWord.toUpperCase()}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Letter-by-letter input visualization */}
        <div className="flex justify-center space-x-2">
          {currentWord.split('').map((originalLetter, index) => {
            const inputLetter = localValue[index] || '';
            const isChanged = inputLetter !== '' && inputLetter !== originalLetter;
            const isDifferent = differences.includes(index);
            
            return (
              <div
                key={index}
                className={`
                  w-12 h-12 border-2 rounded-lg flex items-center justify-center font-mono font-bold text-lg
                  transition-all duration-200
                  ${isDifferent 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                    : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }
                  ${index < localValue.length ? 'shadow-sm' : ''}
                `}
              >
                {inputLetter ? inputLetter.toUpperCase() : originalLetter.toUpperCase()}
              </div>
            );
          })}
        </div>

        {/* Text input */}
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={localValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            maxLength={currentWord.length}
            className={`
              w-full px-4 py-3 text-center font-mono text-lg font-bold rounded-lg border-2
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              ${error 
                ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300' 
                : hasExactlyOneChange
                ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100'
              }
              placeholder:text-gray-400 dark:placeholder:text-gray-500
            `}
            placeholder={`Enter ${currentWord.length}-letter word...`}
          />
          
          {/* Input validation indicator */}
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {isValidLength && (
              hasExactlyOneChange ? (
                <span className="text-green-500 text-xl">✓</span>
              ) : differences.length > 1 ? (
                <span className="text-orange-500 text-xl">⚠</span>
              ) : differences.length === 0 ? (
                <span className="text-red-500 text-xl">✗</span>
              ) : null
            )}
          </div>
        </div>

        {/* Validation feedback */}
        <div className="text-center text-sm min-h-[20px]">
          {!isValidLength && localValue.length > 0 && (
            <span className="text-orange-600 dark:text-orange-400">
              Word must be {currentWord.length} letters long
            </span>
          )}
          {isValidLength && differences.length === 0 && (
            <span className="text-red-600 dark:text-red-400">
              Must change at least one letter
            </span>
          )}
          {isValidLength && differences.length > 1 && (
            <span className="text-orange-600 dark:text-orange-400">
              Can only change one letter at a time
            </span>
          )}
          {hasExactlyOneChange && (
            <span className="text-green-600 dark:text-green-400">
              Ready to submit!
            </span>
          )}
        </div>

        {/* Error message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
            >
              <span className="text-red-600 dark:text-red-400 text-sm">
                {error}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit button */}
        <div className="text-center">
          <Button
            type="submit"
            variant="primary"
            disabled={!hasExactlyOneChange}
            className="min-w-[120px]"
          >
            Submit Word
          </Button>
        </div>
      </form>
    </div>
  );
};

export default WordLadderInput;