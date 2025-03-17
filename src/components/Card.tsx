import React from 'react';
import { Card as CardType } from '../models/types';

interface CardProps {
  card: CardType;
  onClick: () => void;
  disabled?: boolean;
  isShopCard?: boolean;
}

const Card: React.FC<CardProps> = ({ card, onClick, disabled = false, isShopCard = false }) => {
  // Helper to describe effects in user-friendly way
  const getEffectDescription = () => {
    return card.effects.map((effect, index) => {
      let description = '';
      
      switch (effect.type) {
        case 'ADD_GOLD':
          description = `+${effect.value} Gold`;
          break;
        case 'ADD_ACTION':
          description = `+${effect.value} Action${effect.value > 1 ? 's' : ''}`;
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
      className={`card ${disabled ? 'disabled' : ''} ${isShopCard ? 'shop-card' : ''}`}
      onClick={disabled ? undefined : onClick}
      style={{
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '10px',
        margin: '5px',
        width: '150px',
        backgroundColor: disabled ? '#f0f0f0' : '#fff',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.7 : 1,
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