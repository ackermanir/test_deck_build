import { useState, useCallback, useEffect } from 'react';
import { Card, Effect, GameState } from '../models/types';
import { 
  initializeGame, 
  playCard, 
  buyCard, 
  endTurn, 
  drawCards, 
  selectCardFromHand, 
  cancelCardAction,
  finishCardAction
} from '../utils/gameLogic';

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
  
  // Handle selecting a card from hand (for trash/discard effects)
  const handleSelectCard = useCallback((cardId: string) => {
    setGameState(currentState => selectCardFromHand(currentState, cardId));
  }, []);
  
  // Handle canceling a card action
  const handleCancelAction = useCallback(() => {
    setGameState(currentState => cancelCardAction(currentState));
  }, []);
  
  // Handle finishing a card action
  const handleFinishAction = useCallback(() => {
    setGameState(currentState => finishCardAction(currentState));
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
  
  // Get current active effect if there is one
  const getCurrentEffect = (): Effect | null => {
    if (!gameState.activeCard || gameState.activeEffectIndex >= gameState.activeCard.effects.length) {
      return null;
    }
    return gameState.activeCard.effects[gameState.activeEffectIndex];
  };
  
  // Get the selected cards for the current effect
  const getSelectedCards = (): Card[] => {
    if (!gameState.pendingEffects) {
      return [];
    }
    return gameState.pendingEffects.cardsSelected || [];
  };
  
  return {
    gameState,
    playCard: handlePlayCard,
    selectCard: handleSelectCard,
    cancelAction: handleCancelAction,
    finishAction: handleFinishAction,
    buyCard: handleBuyCard,
    endTurn: handleEndTurn,
    newGame: handleNewGame,
    currentEffect: getCurrentEffect(),
    selectedCards: getSelectedCards()
  };
};