import React from 'react';
import { Card as CardType } from '../models/types';
import Card from './Card';

interface HandProps {
  cards: CardType[];
  onPlayCard: (cardId: string) => void;
  playerActions: number;
}

const Hand: React.FC<HandProps> = ({ cards, onPlayCard, playerActions }) => {
  return (
    <div className="hand-container">
      <h3 style={{ marginBottom: '10px' }}>Your Hand ({cards.length} cards)</h3>
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '10px'
      }}>
        {cards.map(card => (
          <Card
            key={card.id}
            card={card}
            onClick={() => onPlayCard(card.id)}
            disabled={playerActions < card.actionCost}
          />
        ))}
        
        {cards.length === 0 && (
          <div style={{ padding: '20px', color: '#888' }}>
            No cards in hand
          </div>
        )}
      </div>
    </div>
  );
};

export default Hand;