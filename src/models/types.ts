// Game models

export interface Card {
  id: string;
  name: string;
  cost: number;
  actionCost: number;
  effects: Effect[];
}

export type EffectType = 
  | 'ADD_GOLD' 
  | 'ADD_ACTION' 
  | 'ADD_HEALTH_PLAYER' 
  | 'DAMAGE_ENEMY' 
  | 'DRAW_CARDS'
  | 'TRASH_CARDS'
  | 'DISCARD_CARDS'
  | 'ADD_BUY';

export interface Effect {
  type: EffectType;
  value: number;
  requireInput?: boolean;
  maxCardsToTrash?: number;
  maxCardsToDiscard?: number;
  targetCost?: number;
  description?: string;
}

export interface Player {
  actions: number;
  buys: number;
  health: number;
  gold: number;
  cardDraw: number;
  hand: Card[];
  drawPile: Card[];
  discardPile: Card[];
  trashPile: Card[];
}

export interface Enemy {
  health: number;
  damagePerTurn: number;
}

export interface GameState {
  player: Player;
  enemy: Enemy;
  round: number;
  shopCards: Card[];
  gameOver: boolean;
  winner: 'player' | 'enemy' | null;
  activeCard: Card | null;
  activeEffectIndex: number;
  pendingEffects: {
    effectIndex: number;
    cardsSelected: Card[];
    targetCost?: number;
  } | null;
  isWaitingForInput: boolean;
  shopUpgradeInProgress?: boolean;
}