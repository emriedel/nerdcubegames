'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BoggleEngine } from '@/games/boggle/BoggleEngine';
import { useGameState } from '@/hooks/useGameState';
import { useSharing } from '@/hooks/useSharing';
import { GridPosition } from '@/games/boggle/BoggleTypes';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import BoggleGrid from './BoggleGrid';
import WordDisplay from './WordDisplay';
import GameTimer from './GameTimer';
import WordList from './WordList';

const BoggleGame: React.FC = () => {
  const [engine] = useState(() => new BoggleEngine());
  const { gameState, startGame, endGame, resetGame } = useGameState(engine);
  const { share, copySuccess, shareError } = useSharing();
  
  const [boggleState, setBoggleState] = useState(engine.getBoggleState());
  const [showResults, setShowResults] = useState(false);

  // Update boggle state when game state changes
  useEffect(() => {
    setBoggleState(engine.getBoggleState());
    if (gameState.isComplete) {
      setShowResults(true);
    }
  }, [gameState, engine]);

  const handleCellSelect = useCallback((position: GridPosition) => {
    if (!gameState.isPlaying || gameState.isComplete) return;
    
    engine.selectLetter(position);
    setBoggleState(engine.getBoggleState());
  }, [gameState.isPlaying, gameState.isComplete, engine]);

  const handleSubmitWord = useCallback(() => {
    if (!gameState.isPlaying || gameState.isComplete) return;
    
    const success = engine.submitWord();
    setBoggleState(engine.getBoggleState());
    
    // Could add success/failure feedback here
  }, [gameState.isPlaying, gameState.isComplete, engine]);

  const handleClearWord = useCallback(() => {
    if (!gameState.isPlaying || gameState.isComplete) return;
    
    engine.clearCurrentPath();
    setBoggleState(engine.getBoggleState());
  }, [gameState.isPlaying, gameState.isComplete, engine]);

  const handleBackspace = useCallback(() => {
    if (!gameState.isPlaying || gameState.isComplete) return;
    
    engine.deselectLastLetter();
    setBoggleState(engine.getBoggleState());
  }, [gameState.isPlaying, gameState.isComplete, engine]);

  const handleStartGame = useCallback(() => {
    setShowResults(false);
    startGame();
  }, [startGame]);

  const handleResetGame = useCallback(() => {
    setShowResults(false);
    resetGame();
    setBoggleState(engine.getBoggleState());
  }, [resetGame, engine]);

  const handleShare = useCallback(async () => {
    if (!gameState.isComplete) return;
    
    const shareableResult = engine.getShareableResult();
    await share(shareableResult);
  }, [gameState.isComplete, engine, share]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (!gameState.isPlaying || gameState.isComplete) return;
      
      if (event.key === 'Enter') {
        handleSubmitWord();
      } else if (event.key === 'Backspace') {
        handleBackspace();
      } else if (event.key === 'Escape') {
        handleClearWord();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState.isPlaying, gameState.isComplete, handleSubmitWord, handleBackspace, handleClearWord]);

  const foundWords = engine.getFoundWords();
  const currentWord = engine.getCurrentWord();

  return (
    <div className="game-container space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Daily Boggle</CardTitle>
          <p className="text-center text-gray-600 dark:text-gray-300">
            Find words by connecting adjacent letters
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Game Timer and Score */}
          <div className="flex items-center justify-between">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {boggleState.score}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Score</div>
            </div>
            
            {gameState.isPlaying && (
              <GameTimer
                timeRemaining={gameState.timeRemaining}
                totalTime={180} // 3 minutes
                isRunning={gameState.isPlaying}
                className="flex-1 max-w-xs mx-4"
              />
            )}
            
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {foundWords.length}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Words</div>
            </div>
          </div>

          {/* Current Word Display */}
          {gameState.isPlaying && (
            <WordDisplay currentWord={currentWord} />
          )}

          {/* Game Grid */}
          <BoggleGrid
            grid={boggleState.grid}
            onCellSelect={handleCellSelect}
            disabled={!gameState.isPlaying || gameState.isComplete}
          />

          {/* Game Controls */}
          <div className="flex gap-2 justify-center">
            {!gameState.isPlaying && !gameState.isComplete && (
              <Button onClick={handleStartGame} variant="primary" size="lg">
                Start Game
              </Button>
            )}
            
            {gameState.isPlaying && (
              <>
                <Button
                  onClick={handleSubmitWord}
                  variant="primary"
                  disabled={currentWord.length < 3}
                >
                  Submit Word
                </Button>
                <Button
                  onClick={handleBackspace}
                  variant="outline"
                  disabled={currentWord.length === 0}
                >
                  Backspace
                </Button>
                <Button
                  onClick={handleClearWord}
                  variant="outline"
                  disabled={currentWord.length === 0}
                >
                  Clear
                </Button>
              </>
            )}
            
            {(gameState.isComplete || foundWords.length > 0) && (
              <Button onClick={handleResetGame} variant="outline">
                New Game
              </Button>
            )}
          </div>

          {/* Share Button and Feedback */}
          {gameState.isComplete && (
            <div className="text-center space-y-2">
              <Button onClick={handleShare} variant="primary">
                Share Results
              </Button>
              {copySuccess && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-green-600 dark:text-green-400"
                >
                  Results copied to clipboard!
                </motion.div>
              )}
              {shareError && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-600 dark:text-red-400"
                >
                  {shareError}
                </motion.div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Found Words List */}
      {foundWords.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <WordList words={foundWords} />
          </CardContent>
        </Card>
      )}

      {/* Game Results Modal */}
      <AnimatePresence>
        {showResults && gameState.isComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowResults(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-center mb-4">Game Complete!</h2>
              
              <div className="space-y-4 text-center">
                <div>
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {boggleState.score}
                  </div>
                  <div className="text-gray-600 dark:text-gray-300">Final Score</div>
                </div>
                
                <div>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {foundWords.length}
                  </div>
                  <div className="text-gray-600 dark:text-gray-300">Words Found</div>
                </div>

                <div className="flex gap-2 justify-center mt-6">
                  <Button onClick={handleShare} variant="primary">
                    Share Results
                  </Button>
                  <Button onClick={handleResetGame} variant="outline">
                    Play Again
                  </Button>
                  <Button onClick={() => setShowResults(false)} variant="ghost">
                    Close
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BoggleGame;