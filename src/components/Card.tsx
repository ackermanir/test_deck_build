import React from 'react';
import { Card as CardType } from '../models/types';

interface CardProps {
  card: CardType;
  onClick: () => void;
  disabled?: boolean;
  isShopCard?: boolean;
  selectable?: boolean;
}

const Card: React.FC<CardProps> = ({ 
  card, 
  onClick, 
  disabled = false, 
  isShopCard = false,
  selectable = false 
}) => {
  // Helper to describe effects in user-friendly way
  const getEffectDescription = () => {
    return card.effects.map((effect, index) => {
      let description = '';
      
      if (effect.description) {
        description = effect.description;
      } else {
        switch (effect.type) {
          case 'ADD_GOLD':
            description = `+${effect.value} Gold`;
            break;
          case 'ADD_ACTION':
            if (effect.value > 0) {
              description = `+${effect.value} Action${effect.value > 1 ? 's' : ''}`;
            } else {
              description = `${effect.value} Action${effect.value < -1 ? 's' : ''}`;
            }
            break;
          case 'ADD_BUY':
            description = `+${effect.value} Buy${effect.value > 1 ? 's' : ''}`;
            break;
          case 'ADD_HEALTH_PLAYER':
            description = `+${effect.value} Health`;
            break;
          case 'DAMAGE_ENEMY':
            description = `Deal ${effect.value} Damage`;
            break;
          case 'DRAW_CARDS':
            description = `Draw ${effect.value} Card${effect.value > 1 ? 's' : ''}`;
            break;
          case 'TRASH_CARDS':
            if (effect.maxCardsToTrash) {
              description = `Trash up to ${effect.maxCardsToTrash} card${effect.maxCardsToTrash > 1 ? 's' : ''}`;
            } else {
              description = 'Trash cards';
            }
            break;
          case 'DISCARD_CARDS':
            description = 'Discard cards';
            break;
        }
      }
      
      return (
        <div key={index} className="card-effect">
          {description}
        </div>
      );
    });
  };

  return (
    <div 
      className={`card ${disabled ? 'disabled' : ''} ${isShopCard ? 'shop-card' : ''} ${selectable ? 'selectable' : ''}`}
      onClick={disabled ? undefined : onClick}
      style={{
        border: `1px solid ${selectable ? '#4caf50' : '#ccc'}`,
        borderRadius: '8px',
        padding: '10px',
        margin: '5px',
        width: '150px',
        backgroundColor: disabled ? '#f0f0f0' : (selectable ? '#f0fff0' : '#fff'),
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.7 : 1,
        boxShadow: selectable ? '0 0 5px #4caf50' : 'none'
      }}
    >
      <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>{card.name}</h3>
      
      {card.actionCost > 0 && (
        <div style={{ fontSize: '12px', color: '#555', marginBottom: '5px' }}>
          Cost: {card.actionCost} Action{card.actionCost > 1 ? 's' : ''}
        </div>
      )}
      
      {isShopCard && (
        <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#e9a537', marginBottom: '5px' }}>
          Price: {card.cost} Gold
        </div>
      )}
      
      <div style={{ fontSize: '13px' }}>
        {getEffectDescription()}
      </div>
    </div>
  );
};

export default Card;