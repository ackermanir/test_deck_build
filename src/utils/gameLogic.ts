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
      health: 30,
      gold: 0,
      cardDraw: 5,
      hand: [],
      drawPile: starterDeck,
      discardPile: [],
      trashPile: []
    },
    enemy: {
      health: 20,
      damagePerTurn: 1,
    },
    round: 1,
    shopCards: createShopCards(),
    gameOver: false,
    winner: null,
    activeCard: null,
    activeEffectIndex: 0,
    pendingEffects: null,
    isWaitingForInput: false
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
    case 'ADD_BUY':
      updatedState.player.buys += effect.value;
      break;
    case 'TRASH_CARDS':
      // This effect requires user input - handled in selectCardFromHand
      if (effect.requireInput) {
        updatedState.isWaitingForInput = true;
        return updatedState;
      }
      break;
    case 'DISCARD_CARDS':
      // This effect requires user input - handled in selectCardFromHand
      if (effect.requireInput) {
        updatedState.isWaitingForInput = true;
        return updatedState;
      }
      break;
  }
  
  return updatedState;
};

// Play a card from hand - start card resolution
export const playCard = (gameState: GameState, cardId: string): GameState => {
  // If we're already processing a card with input requirements, don't allow playing another card
  if (gameState.activeCard) {
    return gameState;
  }

  const cardIndex = gameState.player.hand.findIndex(card => card.id === cardId);
  
  // Card not found in hand
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
  
  // Create a new state with the card removed from hand
  let updatedState: GameState = {
    ...gameState,
    player: {
      ...gameState.player,
      hand: updatedHand,
      actions: gameState.player.actions - card.actionCost,
    },
    activeCard: card,
    activeEffectIndex: 0
  };
  
  // If the card has any effects that require input, we'll handle them one by one
  // Otherwise, we'll apply all effects immediately
  if (card.effects.some(effect => effect.requireInput)) {
    return processCardEffect(updatedState);
  } else {
    // No input required, apply all effects and add card to discard pile
    for (const effect of card.effects) {
      updatedState = applyEffect(updatedState, effect);
    }
    
    // Move the card to the discard pile and clean up
    return {
      ...updatedState,
      player: {
        ...updatedState.player,
        discardPile: [...updatedState.player.discardPile, card]
      },
      activeCard: null,
      activeEffectIndex: 0
    };
  }
};

// Process the current effect of the active card
export const processCardEffect = (gameState: GameState): GameState => {
  // If no active card, nothing to process
  if (!gameState.activeCard || gameState.activeEffectIndex >= gameState.activeCard.effects.length) {
    // We're done processing all effects, move card to discard
    return {
      ...gameState,
      player: {
        ...gameState.player,
        discardPile: [...gameState.player.discardPile, gameState.activeCard!]
      },
      activeCard: null,
      activeEffectIndex: 0,
      isWaitingForInput: false
    };
  }
  
  const currentEffect = gameState.activeCard.effects[gameState.activeEffectIndex];
  
  // Apply the current effect
  const updatedState = applyEffect(gameState, currentEffect);
  
  // If the effect requires input, we'll stop here and wait for the user
  if (updatedState.isWaitingForInput) {
    return updatedState;
  }
  
  // Otherwise, move to the next effect
  return processCardEffect({
    ...updatedState,
    activeEffectIndex: updatedState.activeEffectIndex + 1
  });
};

// Buy a card from the shop
export const buyCard = (gameState: GameState, cardId: string): GameState => {
  const cardIndex = gameState.shopCards.findIndex(card => card.id === cardId);
  
  // Card not found in shop
  if (cardIndex === -1) {
    return gameState;
  }
  
  const card = gameState.shopCards[cardIndex];
  
  // Special case for UPGRADE card - shop selection phase
  if (gameState.shopUpgradeInProgress && gameState.pendingEffects?.targetCost !== undefined) {
    // Check if the selected card is within the target cost
    if (card.cost <= gameState.pendingEffects.targetCost) {
      // Remove card from shop
      const updatedShop = [...gameState.shopCards];
      updatedShop.splice(cardIndex, 1);
      
      // Add the card to the discard pile and complete the upgrade
      return processCardEffect({
        ...gameState,
        shopCards: updatedShop,
        player: {
          ...gameState.player,
          discardPile: [...gameState.player.discardPile, card]
        },
        activeEffectIndex: gameState.activeEffectIndex + 1,
        pendingEffects: null,
        isWaitingForInput: false,
        shopUpgradeInProgress: false
      });
    } else {
      // Card costs too much for the upgrade
      return gameState;
    }
  }
  
  // Normal buying - check if player has enough gold and buys
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
// Handle card selection for trash/discard effects
export const selectCardFromHand = (gameState: GameState, cardId: string): GameState => {
  // If no active card or not waiting for input, ignore
  if (!gameState.activeCard || !gameState.isWaitingForInput) {
    return gameState;
  }

  const cardIndex = gameState.player.hand.findIndex(card => card.id === cardId);
  if (cardIndex === -1) return gameState;

  const currentEffect = gameState.activeCard.effects[gameState.activeEffectIndex];
  const selectedCard = gameState.player.hand[cardIndex];
  
  // Initialize or update pending effects
  const pendingEffects = gameState.pendingEffects || {
    effectIndex: gameState.activeEffectIndex,
    cardsSelected: []
  };

  // For ACCOUNTANT, check if selected card is Copper
  if (gameState.activeCard.id.startsWith('accountant') && 
      currentEffect.type === 'TRASH_CARDS' &&
      !selectedCard.name.toLowerCase().includes('copper')) {
    // Cannot trash non-Copper cards with Accountant
    return gameState;
  }
  
  // Check maxCardsToTrash limit for TRASH_CARDS effect
  if (currentEffect.type === 'TRASH_CARDS' && 
      currentEffect.maxCardsToTrash !== undefined && 
      pendingEffects.cardsSelected.length >= currentEffect.maxCardsToTrash) {
    // Already selected maximum number of cards to trash
    return gameState;
  }
  
  // Create a new state with the card removed from hand and added to selected cards
  const updatedState = {
    ...gameState,
    player: {
      ...gameState.player,
      hand: [
        ...gameState.player.hand.slice(0, cardIndex),
        ...gameState.player.hand.slice(cardIndex + 1)
      ]
    },
    pendingEffects: {
      ...pendingEffects,
      cardsSelected: [...pendingEffects.cardsSelected, selectedCard]
    }
  };
  
  return updatedState;
};

// Cancel current card action and undo changes
export const cancelCardAction = (gameState: GameState): GameState => {
  // If no active card or pendingEffects is null, ignore
  if (!gameState.activeCard || gameState.pendingEffects === null) {
    return gameState;
  }

  // Put all selected cards back in hand
  const updatedHand = [
    ...gameState.player.hand,
    ...(gameState.pendingEffects?.cardsSelected || [])
  ];

  // Undo action cost and other effects (like gold added)
  const currentEffectIndex = gameState.activeEffectIndex;
  let actions = gameState.player.actions;
  
  // Calculate action cost refund - first check ADD_ACTION effects
  for (let i = 0; i < currentEffectIndex; i++) {
    const effect = gameState.activeCard.effects[i];
    if (effect.type === 'ADD_ACTION') {
      actions -= effect.value; // Subtract the value that was added (or add if it was negative)
    }
  }
  
  // Also refund the action cost of playing the card
  actions += gameState.activeCard.actionCost;
  
  // Return the card to hand
  return {
    ...gameState,
    player: {
      ...gameState.player,
      hand: [...updatedHand, gameState.activeCard],
      actions
    },
    activeCard: null,
    activeEffectIndex: 0,
    pendingEffects: null,
    isWaitingForInput: false
  };
};

// Finish the current card action and apply effects
export const finishCardAction = (gameState: GameState): GameState => {
  // If no active card or not waiting for input, ignore
  if (!gameState.activeCard || !gameState.isWaitingForInput) {
    return gameState;
  }

  const currentEffect = gameState.activeCard.effects[gameState.activeEffectIndex];
  let updatedState = { ...gameState };
  
  // Apply the current effect based on selected cards
  if (gameState.pendingEffects) {
    const selectedCards = gameState.pendingEffects.cardsSelected;
    
    switch (currentEffect.type) {
      case 'TRASH_CARDS':
        // Move selected cards to trash pile
        updatedState = {
          ...updatedState,
          player: {
            ...updatedState.player,
            trashPile: [...updatedState.player.trashPile, ...selectedCards]
          }
        };
        
        // For ACCOUNTANT card, add gold if a Copper was trashed
        if (gameState.activeCard.id.startsWith('accountant') && selectedCards.length > 0) {
          updatedState = {
            ...updatedState,
            player: {
              ...updatedState.player,
              gold: updatedState.player.gold + 3
            }
          };
        }
        
        // For UPGRADE card, allow gaining a card from shop
        if (gameState.activeCard.id.startsWith('upgrade') && selectedCards.length > 0) {
          const trashedCard = selectedCards[0];
          const targetCost = trashedCard.cost + (currentEffect.targetCost || 0);
          
          // Instead of continuing the effect, we stop here to allow the player to select a card from the shop
          // We'll need to temporarily store this upgrade state
          if (updatedState.pendingEffects) {
            // Return immediately without continuing to the next effect
            return {
              ...updatedState,
              pendingEffects: {
                ...updatedState.pendingEffects,
                targetCost
              },
              shopUpgradeInProgress: true, // Add a new flag to indicate we're waiting for shop selection
              // We keep isWaitingForInput true to prevent other actions
            };
          }
        }
        break;
        
      case 'DISCARD_CARDS':
        // Move selected cards to discard pile and draw same number
        updatedState = {
          ...updatedState,
          player: {
            ...updatedState.player,
            discardPile: [...updatedState.player.discardPile, ...selectedCards]
          }
        };
        
        // For REPURPOSE card, draw cards equal to number discarded
        if (gameState.activeCard.id.startsWith('repurpose')) {
          updatedState.player = drawCards(updatedState.player, selectedCards.length);
        }
        break;
    }
  }
  
  // Move to the next effect
  return processCardEffect({
    ...updatedState,
    activeEffectIndex: updatedState.activeEffectIndex + 1,
    pendingEffects: null, 
    isWaitingForInput: false
  });
};

// End turn
export const endTurn = (gameState: GameState): GameState => {
  // Can't end turn while a card is being resolved
  if (gameState.activeCard) {
    return gameState;
  }

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
    discardPile: allDiscarded,
    trashPile: gameState.player.trashPile
  };
  
  // Draw cards for next turn
  const playerWithCards = drawCards(nextTurnPlayer, nextTurnPlayer.cardDraw);
  
  // Increment enemy damage every 5 rounds
  const shouldIncreaseDamage = gameState.round % 5 === 0;
  
  return {
    ...gameState,
    player: playerWithCards,
    enemy: {
      ...gameState.enemy,
      damagePerTurn: shouldIncreaseDamage ? 
        gameState.enemy.damagePerTurn + 1 : 
        gameState.enemy.damagePerTurn
    },
    round: gameState.round + 1
  };
};