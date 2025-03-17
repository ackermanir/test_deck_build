import { Card, Effect, GameState, Player } from '../models/types';
import { createStarterDeck, createShopCards } from '../models/cards';

// Shuffle an array using Fisher-Yates algorithm
export const shuffleCards = (cards: Card[]): Card[] => {
  const shuffled = [...cards];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Initialize a new game state
export const initializeGame = (): GameState => {
  const starterDeck = shuffleCards(createStarterDeck());
  
  return {
    player: {
      actions: 1,
      buys: 1,
      health: 20,
      gold: 0,
      cardDraw: 5,
      hand: [],
      drawPile: starterDeck,
      discardPile: []
    },
    enemy: {
      health: 20,
      damagePerTurn: 1,
    },
    round: 1,
    shopCards: createShopCards(),
    gameOver: false,
    winner: null
  };
};

// Draw cards from the deck to the hand
export const drawCards = (player: Player, count: number): Player => {
  const updatedPlayer = { ...player };
  
  for (let i = 0; i < count; i++) {
    // If draw pile is empty, shuffle discard pile into draw pile
    if (updatedPlayer.drawPile.length === 0) {
      if (updatedPlayer.discardPile.length === 0) {
        // No cards left to draw
        break;
      }
      updatedPlayer.drawPile = shuffleCards([...updatedPlayer.discardPile]);
      updatedPlayer.discardPile = [];
    }
    
    // Draw a card
    const drawnCard = updatedPlayer.drawPile.pop();
    if (drawnCard) {
      updatedPlayer.hand.push(drawnCard);
    }
  }
  
  return updatedPlayer;
};

// Apply an effect to the game state
export const applyEffect = (
  gameState: GameState, 
  effect: Effect
): GameState => {
  const updatedState = { ...gameState };
  
  switch (effect.type) {
    case 'ADD_GOLD':
      updatedState.player.gold += effect.value;
      break;
    case 'ADD_ACTION':
      updatedState.player.actions += effect.value;
      break;
    case 'ADD_HEALTH_PLAYER':
      updatedState.player.health += effect.value;
      break;
    case 'DAMAGE_ENEMY':
      updatedState.enemy.health -= effect.value;
      // Check if enemy is defeated
      if (updatedState.enemy.health <= 0) {
        updatedState.gameOver = true;
        updatedState.winner = 'player';
      }
      break;
    case 'DRAW_CARDS':
      updatedState.player = drawCards(updatedState.player, effect.value);
      break;
  }
  
  return updatedState;
};

// Play a card from hand
export const playCard = (gameState: GameState, cardId: string): GameState => {
  const cardIndex = gameState.player.hand.findIndex(card => card.id === cardId);
  
  // Card not found in hand or not enough actions
  if (cardIndex === -1) {
    return gameState;
  }
  
  const card = gameState.player.hand[cardIndex];
  
  // Check if player has enough actions to play this card
  if (gameState.player.actions < card.actionCost) {
    return gameState;
  }
  
  // Remove card from hand
  const updatedHand = [...gameState.player.hand];
  updatedHand.splice(cardIndex, 1);
  
  // Update game state with reduced actions
  let updatedState: GameState = {
    ...gameState,
    player: {
      ...gameState.player,
      hand: updatedHand,
      actions: gameState.player.actions - card.actionCost,
      discardPile: [...gameState.player.discardPile, card]
    }
  };
  
  // Apply all card effects
  for (const effect of card.effects) {
    updatedState = applyEffect(updatedState, effect);
  }
  
  return updatedState;
};

// Buy a card from the shop
export const buyCard = (gameState: GameState, cardId: string): GameState => {
  const cardIndex = gameState.shopCards.findIndex(card => card.id === cardId);
  
  // Card not found in shop
  if (cardIndex === -1) {
    return gameState;
  }
  
  const card = gameState.shopCards[cardIndex];
  
  // Check if player has enough gold and buys
  if (gameState.player.gold < card.cost || gameState.player.buys < 1) {
    return gameState;
  }
  
  // Remove card from shop
  const updatedShop = [...gameState.shopCards];
  updatedShop.splice(cardIndex, 1);
  
  // Update game state
  return {
    ...gameState,
    player: {
      ...gameState.player,
      gold: gameState.player.gold - card.cost,
      buys: gameState.player.buys - 1,
      discardPile: [...gameState.player.discardPile, card]
    },
    shopCards: updatedShop
  };
};

// End the current turn
export const endTurn = (gameState: GameState): GameState => {
  // Enemy attacks player
  const playerHealthAfterDamage = gameState.player.health - gameState.enemy.damagePerTurn;
  
  // Check if player is defeated
  if (playerHealthAfterDamage <= 0) {
    return {
      ...gameState,
      player: {
        ...gameState.player,
        health: 0
      },
      gameOver: true,
      winner: 'enemy'
    };
  }
  
  // Discard hand
  const allDiscarded = [
    ...gameState.player.discardPile,
    ...gameState.player.hand
  ];
  
  // Set up for next turn
  const nextTurnPlayer: Player = {
    actions: 1,
    buys: 1,
    health: playerHealthAfterDamage,
    gold: 0,
    cardDraw: gameState.player.cardDraw,
    hand: [],
    drawPile: gameState.player.drawPile,
    discardPile: allDiscarded
  };
  
  // Draw cards for next turn
  const playerWithCards = drawCards(nextTurnPlayer, nextTurnPlayer.cardDraw);
  
  // Increment enemy damage
  return {
    ...gameState,
    player: playerWithCards,
    enemy: {
      ...gameState.enemy,
      damagePerTurn: gameState.enemy.damagePerTurn + 1
    },
    round: gameState.round + 1
  };
};