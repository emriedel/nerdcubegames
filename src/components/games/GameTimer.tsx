'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/Progress';

interface GameTimerProps {
  timeRemaining: number;
  totalTime: number;
  isRunning: boolean;
  className?: string;
}

const GameTimer: React.FC<GameTimerProps> = ({ 
  timeRemaining, 
  totalTime, 
  isRunning,
  className 
}) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const percentage = (timeRemaining / totalTime) * 100;
  const isLowTime = timeRemaining <= 30;
  const isCriticalTime = timeRemaining <= 10;

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
          Time Remaining
        </span>
        <motion.span
          className={cn(
            'text-lg font-bold transition-colors duration-200',
            {
              'text-gray-900 dark:text-white': !isLowTime,
              'text-orange-600 dark:text-orange-400': isLowTime && !isCriticalTime,
              'text-red-600 dark:text-red-400': isCriticalTime,
            }
          )}
          animate={isCriticalTime && isRunning ? { scale: [1, 1.1, 1] } : { scale: 1 }}
          transition={{ duration: 1, repeat: isCriticalTime && isRunning ? Infinity : 0 }}
        >
          {formatTime(timeRemaining)}
        </motion.span>
      </div>
      
      <Progress
        value={percentage}
        max={100}
        className={cn(
          'h-2 transition-colors duration-200',
          {
            'bg-gray-200 dark:bg-gray-700': !isLowTime,
            'bg-orange-200 dark:bg-orange-900': isLowTime && !isCriticalTime,
            'bg-red-200 dark:bg-red-900': isCriticalTime,
          }
        )}
      />
      
      {isCriticalTime && isRunning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-sm font-medium text-red-600 dark:text-red-400"
        >
          Hurry up! Time is running out!
        </motion.div>
      )}
    </div>
  );
};

export default GameTimer;