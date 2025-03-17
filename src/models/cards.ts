import { Card } from './types';
import { v4 as uuidv4 } from 'uuid';

// Starting cards
export const COPPER: Card = {
  id: 'copper',
  name: 'Copper',
  cost: 1,
  actionCost: 0,
  effects: [{ type: 'ADD_GOLD', value: 1 }]
};

export const PUNCH: Card = {
  id: 'punch',
  name: 'Punch',
  cost: 1,
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

export const SILVER: Card = {
  id: 'silver',
  name: 'Silver',
  cost: 3,
  actionCost: 0,
  effects: [{ type: 'ADD_GOLD', value: 2 }]
};

export const DIAMOND: Card = {
  id: 'diamond',
  name: 'Diamond',
  cost: 6,
  actionCost: 0,
  effects: [{ type: 'ADD_GOLD', value: 3 }]
};

export const QUICK_HANDS: Card = {
  id: 'quick-hands',
  name: 'Quick Hands',
  cost: 6,
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

// New cards from add_actions.md
export const CLEANUP: Card = {
  id: 'cleanup',
  name: 'Cleanup',
  cost: 3,
  actionCost: 1,
  effects: [
    { 
      type: 'TRASH_CARDS', 
      value: 0, 
      requireInput: true, 
      maxCardsToTrash: 3,
      description: 'Trash up to 3 cards from your hand'
    }
  ]
};

export const SEARCH: Card = {
  id: 'search',
  name: 'Search',
  cost: 4,
  actionCost: 1,
  effects: [
    { type: 'DRAW_CARDS', value: 3 }
  ]
};

export const REPURPOSE: Card = {
  id: 'repurpose',
  name: 'Repurpose',
  cost: 2,
  actionCost: 0,
  effects: [
    { 
      type: 'DISCARD_CARDS', 
      value: 0,
      requireInput: true,
      description: 'Discard any number of cards and draw that many'
    }
  ]
};

export const EVERYTHING: Card = {
  id: 'everything',
  name: 'Everything',
  cost: 5,
  actionCost: 0,
  effects: [
    { type: 'DRAW_CARDS', value: 1 },
    { type: 'ADD_BUY', value: 1 },
    { type: 'ADD_GOLD', value: 1 }
  ]
};

export const ACCOUNTANT: Card = {
  id: 'accountant',
  name: 'Accountant',
  cost: 4,
  actionCost: 1,
  effects: [
    { 
      type: 'TRASH_CARDS', 
      value: 0, 
      requireInput: true,
      maxCardsToTrash: 1,
      description: 'You may trash a Copper from hand for +3 gold'
    }
  ]
};

export const UPGRADE: Card = {
  id: 'upgrade',
  name: 'Upgrade',
  cost: 5,
  actionCost: 1,
  effects: [
    { 
      type: 'TRASH_CARDS', 
      value: 0, 
      requireInput: true,
      maxCardsToTrash: 1,
      targetCost: 2,
      description: 'Trash a card, then gain a card costing up to 2 more'
    }
  ]
};

export const SPEAR: Card = {
  id: 'spear',
  name: 'Spear',
  cost: 6,
  actionCost: 1,
  effects: [
    { type: 'DAMAGE_ENEMY', value: 5 }
  ]
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
  const shopTemplates = [
    STAB, SILVER, DIAMOND, QUICK_HANDS, MEDKIT,
    CLEANUP, SEARCH, REPURPOSE, EVERYTHING, ACCOUNTANT, UPGRADE, SPEAR
  ];
  
  for (const template of shopTemplates) {
    for (let i = 0; i < 10; i++) {
      shop.push(createCard(template));
    }
  }
  
  return shop;
};
