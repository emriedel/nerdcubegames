'use client'

import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { LetterCell, GridPosition } from '@/games/boggle/BoggleTypes';

interface BoggleGridProps {
  grid: LetterCell[][];
  onCellSelect: (position: GridPosition) => void;
  disabled?: boolean;
}

const BoggleGrid: React.FC<BoggleGridProps> = React.memo(({ grid, onCellSelect, disabled = false }) => {
  const handleCellClick = useCallback((position: GridPosition) => {
    if (!disabled) {
      onCellSelect(position);
    }
  }, [onCellSelect, disabled]);

  const handleTouchStart = useCallback((e: React.TouchEvent, position: GridPosition) => {
    e.preventDefault();
    if (!disabled) {
      onCellSelect(position);
    }
  }, [onCellSelect, disabled]);

  return (
    <div className="grid grid-cols-4 gap-2 max-w-sm mx-auto p-4">
      {grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <motion.button
            key={`${rowIndex}-${colIndex}`}
            className={cn(
              'touch-target aspect-square rounded-lg font-bold text-xl border-2 transition-all duration-200 ease-in-out',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
              'active:scale-95',
              {
                'bg-white border-gray-300 text-gray-900 hover:bg-gray-50 shadow-sm': 
                  !cell.isInCurrentPath && !disabled,
                'bg-yellow-400 border-yellow-500 text-gray-900 shadow-md': 
                  cell.isInCurrentPath,
                'bg-green-500 border-green-600 text-white shadow-md': 
                  cell.isSelected,
                'opacity-50 cursor-not-allowed': 
                  disabled,
                'cursor-pointer': 
                  !disabled,
              }
            )}
            onClick={() => handleCellClick(cell.position)}
            onTouchStart={(e) => handleTouchStart(e, cell.position)}
            disabled={disabled}
            whileHover={!disabled ? { scale: 1.05 } : {}}
            whileTap={!disabled ? { scale: 0.95 } : {}}
            animate={{
              scale: cell.isSelected ? 1.1 : 1,
              backgroundColor: cell.isInCurrentPath 
                ? cell.isSelected 
                  ? '#10b981' 
                  : '#fbbf24'
                : undefined,
            }}
            transition={{ duration: 0.2 }}
          >
            {cell.letter.toUpperCase()}
          </motion.button>
        ))
      )}
    </div>
  );
});

BoggleGrid.displayName = 'BoggleGrid';

export default BoggleGrid;