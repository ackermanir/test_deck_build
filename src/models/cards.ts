import { Card } from './types';
import { v4 as uuidv4 } from 'uuid';

// Starting cards
export const COPPER: Card = {
  id: 'copper',
  name: 'Copper',
  cost: 0,
  actionCost: 0,
  effects: [{ type: 'ADD_GOLD', value: 1 }]
};

export const PUNCH: Card = {
  id: 'punch',
  name: 'Punch',
  cost: 0,
  actionCost: 1,
  effects: [{ type: 'DAMAGE_ENEMY', value: 1 }]
};

// Shop cards
export const STAB: Card = {
  id: 'stab',
  name: 'Stab',
  cost: 3,
  actionCost: 1,
  effects: [{ type: 'DAMAGE_ENEMY', value: 2 }]
};

export const DIAMOND: Card = {
  id: 'diamond',
  name: 'Diamond',
  cost: 5,
  actionCost: 0,
  effects: [{ type: 'ADD_GOLD', value: 3 }]
};

export const QUICK_HANDS: Card = {
  id: 'quick-hands',
  name: 'Quick Hands',
  cost: 7,
  actionCost: 1,
  effects: [
    { type: 'ADD_ACTION', value: 1 },
    { type: 'DRAW_CARDS', value: 2 }
  ]
};

export const MEDKIT: Card = {
  id: 'medkit',
  name: 'Med-kit',
  cost: 6,
  actionCost: 1,
  effects: [{ type: 'ADD_HEALTH_PLAYER', value: 3 }]
};

// Helper function to create a copy of a card with unique ID
export const createCard = (template: Card): Card => {
  return {
    ...template,
    id: `${template.id}-${uuidv4()}`
  };
};

// Create initial deck (7 copper, 3 punch)
export const createStarterDeck = (): Card[] => {
  const deck: Card[] = [];
  
  // Add 7 Copper cards
  for (let i = 0; i < 7; i++) {
    deck.push(createCard(COPPER));
  }
  
  // Add 3 Punch cards
  for (let i = 0; i < 3; i++) {
    deck.push(createCard(PUNCH));
  }
  
  return deck;
};

// Create shop cards
export const createShopCards = (): Card[] => {
  const shop: Card[] = [];
  
  // Add 10 of each shop card
  const shopTemplates = [STAB, DIAMOND, QUICK_HANDS, MEDKIT];
  
  for (const template of shopTemplates) {
    for (let i = 0; i < 10; i++) {
      shop.push(createCard(template));
    }
  }
  
  return shop;
};