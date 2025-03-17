import { useState, useCallback, useEffect } from 'react';
import { GameState } from '../models/types';
import { initializeGame, playCard, buyCard, endTurn, drawCards } from '../utils/gameLogic';

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>(initializeGame());
  
  // Initialize the game - start with drawing cards
  useEffect(() => {
    // Draw initial hand
    const initialState = initializeGame();
    const playerWithCards = {
      ...initialState,
      player: drawCards(initialState.player, initialState.player.cardDraw)
    };
    setGameState(playerWithCards);
  }, []);
  
  // Handle playing a card
  const handlePlayCard = useCallback((cardId: string) => {
    setGameState(currentState => playCard(currentState, cardId));
  }, []);
  
  // Handle buying a card
  const handleBuyCard = useCallback((cardId: string) => {
    setGameState(currentState => buyCard(currentState, cardId));
  }, []);
  
  // Handle ending the turn
  const handleEndTurn = useCallback(() => {
    setGameState(currentState => endTurn(currentState));
  }, []);
  
  // Handle starting a new game
  const handleNewGame = useCallback(() => {
    const newGame = initializeGame();
    const playerWithCards = {
      ...newGame,
      player: drawCards(newGame.player, newGame.player.cardDraw)
    };
    setGameState(playerWithCards);
  }, []);
  
  return {
    gameState,
    playCard: handlePlayCard,
    buyCard: handleBuyCard,
    endTurn: handleEndTurn,
    newGame: handleNewGame
  };
};