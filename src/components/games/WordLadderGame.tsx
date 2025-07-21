'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WordLadderEngine } from '@/games/word-ladder/WordLadderEngine';
import { useGameState } from '@/hooks/useGameState';
import { useSharing } from '@/hooks/useSharing';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import WordLadderPath from './WordLadderPath';
import WordLadderInput from './WordLadderInput';
import GameTimer from './GameTimer';

const WordLadderGame: React.FC = () => {
  const [engine] = useState(() => new WordLadderEngine());
  const { gameState, startGame, endGame, resetGame } = useGameState(engine);
  const { share, copySuccess, shareError } = useSharing();
  
  const [wordLadderState, setWordLadderState] = useState(engine.getWordLadderState());
  const [showResults, setShowResults] = useState(false);
  const [inputWord, setInputWord] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  // Update word ladder state when game state changes
  useEffect(() => {
    setWordLadderState(engine.getWordLadderState());
    if (gameState.isComplete) {
      setShowResults(true);
    }
  }, [gameState, engine]);

  const handleWordSubmit = useCallback((word: string): boolean => {
    if (!gameState.isPlaying || gameState.isComplete) return false;
    
    const validation = engine.validateWord(word);
    
    if (!validation.isValid) {
      setValidationError(validation.error || 'Invalid word');
      return false;
    }

    const success = engine.submitWord(word);
    if (success) {
      setWordLadderState(engine.getWordLadderState());
      setInputWord('');
      setValidationError(null);
      return true;
    } else {
      setValidationError('Failed to submit word');
      return false;
    }
  }, [gameState.isPlaying, gameState.isComplete, engine]);

  const handleRemoveLastStep = useCallback(() => {
    if (!gameState.isPlaying || gameState.isComplete) return;
    
    const success = engine.removeLastStep();
    if (success) {
      setWordLadderState(engine.getWordLadderState());
    }
  }, [gameState.isPlaying, gameState.isComplete, engine]);

  const handleGetHint = useCallback(() => {
    if (!gameState.isPlaying || gameState.isComplete) return;
    
    const hint = engine.getHint();
    if (hint) {
      // Show hint feedback (could be improved with a toast system)
      alert(hint.message);
      setWordLadderState(engine.getWordLadderState());
    } else {
      alert('No more hints available!');
    }
  }, [gameState.isPlaying, gameState.isComplete, engine]);

  const handleStartGame = useCallback(() => {
    setShowResults(false);
    setInputWord('');
    setValidationError(null);
    startGame();
  }, [startGame]);

  const handleResetGame = useCallback(() => {
    setShowResults(false);
    setInputWord('');
    setValidationError(null);
    resetGame();
    setWordLadderState(engine.getWordLadderState());
  }, [resetGame, engine]);

  const handleShare = useCallback(async () => {
    if (!gameState.isComplete) return;
    
    const shareableResult = engine.getShareableResult();
    await share(shareableResult);
  }, [gameState.isComplete, engine, share]);

  return (
    <div className="game-container space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Daily Word Ladder</CardTitle>
          <p className="text-center text-gray-600 dark:text-gray-300">
            Transform one word into another by changing one letter at a time
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Puzzle Info */}
          <div className="text-center bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="text-lg font-semibold mb-2">
              Transform: 
              <span className="text-blue-600 dark:text-blue-400 mx-2">
                {wordLadderState.puzzle.startWord.toUpperCase()}
              </span>
              →
              <span className="text-green-600 dark:text-green-400 mx-2">
                {wordLadderState.puzzle.targetWord.toUpperCase()}
              </span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Minimum steps: {wordLadderState.puzzle.minimumSteps} • 
              Difficulty: {wordLadderState.puzzle.difficulty}
            </div>
          </div>

          {/* Game Stats */}
          <div className="flex items-center justify-between">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {wordLadderState.currentPath.length - 1}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Steps</div>
            </div>
            
            {gameState.isPlaying && (
              <GameTimer
                timeRemaining={gameState.timeRemaining}
                totalTime={300} // 5 minutes
                isRunning={gameState.isPlaying}
                className="flex-1 max-w-xs mx-4"
              />
            )}
            
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {wordLadderState.hints}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Hints</div>
            </div>
          </div>

          {/* Word Path */}
          <WordLadderPath
            path={wordLadderState.currentPath}
            targetWord={wordLadderState.puzzle.targetWord}
            currentWord={wordLadderState.currentWord}
          />

          {/* Word Input */}
          {gameState.isPlaying && !wordLadderState.isComplete && (
            <WordLadderInput
              currentWord={wordLadderState.currentWord}
              onSubmit={handleWordSubmit}
              value={inputWord}
              onChange={setInputWord}
              error={validationError}
              onErrorClear={() => setValidationError(null)}
            />
          )}

          {/* Game Controls */}
          <div className="flex gap-2 justify-center flex-wrap">
            {!gameState.isPlaying && !gameState.isComplete && (
              <Button onClick={handleStartGame} variant="primary" size="lg">
                Start Game
              </Button>
            )}
            
            {gameState.isPlaying && !wordLadderState.isComplete && (
              <>
                <Button
                  onClick={handleRemoveLastStep}
                  variant="outline"
                  disabled={wordLadderState.currentPath.length <= 1}
                >
                  Remove Last
                </Button>
                <Button
                  onClick={handleGetHint}
                  variant="outline"
                  disabled={wordLadderState.hints <= 0}
                >
                  Hint ({wordLadderState.hints})
                </Button>
              </>
            )}
            
            <Button onClick={handleResetGame} variant="outline">
              New Game
            </Button>
          </div>

          {/* Completion Message */}
          {wordLadderState.isSolved && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center bg-green-50 dark:bg-green-900/20 p-4 rounded-lg"
            >
              <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
                🎉 Congratulations!
              </div>
              <div className="text-green-700 dark:text-green-300">
                You solved the puzzle in {wordLadderState.currentPath.length - 1} steps!
              </div>
              <div className="text-sm text-green-600 dark:text-green-400 mt-1">
                Score: {wordLadderState.score}
              </div>
            </motion.div>
          )}

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
              <h2 className="text-2xl font-bold text-center mb-4">
                {wordLadderState.isSolved ? 'Puzzle Solved!' : 'Time\'s Up!'}
              </h2>
              
              <div className="space-y-4 text-center">
                {wordLadderState.isSolved ? (
                  <>
                    <div>
                      <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                        {wordLadderState.score}
                      </div>
                      <div className="text-gray-600 dark:text-gray-300">Final Score</div>
                    </div>
                    
                    <div>
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {wordLadderState.currentPath.length - 1}
                      </div>
                      <div className="text-gray-600 dark:text-gray-300">
                        Steps (min: {wordLadderState.puzzle.minimumSteps})
                      </div>
                    </div>

                    {wordLadderState.hintsUsed > 0 && (
                      <div>
                        <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                          {wordLadderState.hintsUsed}
                        </div>
                        <div className="text-gray-600 dark:text-gray-300">Hints Used</div>
                      </div>
                    )}
                  </>
                ) : (
                  <div>
                    <div className="text-xl text-gray-600 dark:text-gray-300 mb-4">
                      You made it {wordLadderState.currentPath.length - 1} steps toward the target.
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      The target was: {wordLadderState.puzzle.targetWord.toUpperCase()}
                    </div>
                  </div>
                )}

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

export default WordLadderGame;