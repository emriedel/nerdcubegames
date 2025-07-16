'use client'

import { useState, useEffect, useCallback } from 'react';
import { GameEngine } from '@/games/shared/GameEngine';
import { GameState } from '@/games/shared/GameTypes';

export function useGameState<T extends GameEngine>(gameEngine: T) {
  const [gameState, setGameState] = useState<GameState>(gameEngine.getState());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateGameState = useCallback(() => {
    setGameState(gameEngine.getState());
  }, [gameEngine]);

  const startGame = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      gameEngine.startGame();
      updateGameState();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start game');
    } finally {
      setIsLoading(false);
    }
  }, [gameEngine, updateGameState]);

  const pauseGame = useCallback(() => {
    gameEngine.pauseGame();
    updateGameState();
  }, [gameEngine, updateGameState]);

  const resumeGame = useCallback(() => {
    gameEngine.resumeGame();
    updateGameState();
  }, [gameEngine, updateGameState]);

  const endGame = useCallback(() => {
    gameEngine.endGame();
    updateGameState();
  }, [gameEngine, updateGameState]);

  const resetGame = useCallback(() => {
    gameEngine.resetGame();
    updateGameState();
  }, [gameEngine, updateGameState]);

  // Update state when game engine changes
  useEffect(() => {
    updateGameState();
  }, [gameEngine, updateGameState]);

  return {
    gameState,
    isLoading,
    error,
    startGame,
    pauseGame,
    resumeGame,
    endGame,
    resetGame,
    updateGameState,
  };
}