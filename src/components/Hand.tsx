import React from 'react';
import { Card as CardType, Effect } from '../models/types';
import Card from './Card';

interface HandProps {
  cards: CardType[];
  onPlayCard: (cardId: string) => void;
  onSelectCard?: (cardId: string) => void;
  onCancelAction?: () => void;
  onFinishAction?: () => void;
  playerActions: number;
  waitingForInput: boolean;
  activeCard: CardType | null;
  activeEffect: Effect | null;
  selectedCards: CardType[];
}

const Hand: React.FC<HandProps> = ({ 
  cards, 
  onPlayCard, 
  onSelectCard,
  onCancelAction,
  onFinishAction,
  playerActions,
  waitingForInput,
  activeCard,
  activeEffect,
  selectedCards = []
}) => {
  const getActionPrompt = () => {
    if (!activeCard || !activeEffect) return null;
    
    let promptText = '';
    
    if (activeEffect.description) {
      promptText = activeEffect.description;
    } else {
      switch (activeEffect.type) {
        case 'TRASH_CARDS':
          promptText = `Select ${activeEffect.maxCardsToTrash ? `up to ${activeEffect.maxCardsToTrash}` : ''} card${activeEffect.maxCardsToTrash !== 1 ? 's' : ''} to trash`;
          break;
        case 'DISCARD_CARDS':
          promptText = 'Select any number of cards to discard';
          break;
      }
    }
    
    return (
      <div style={{ padding: '15px', backgroundColor: '#f8f8f8', borderRadius: '5px', marginBottom: '15px' }}>
        <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>
          <span>{activeCard.name}:</span> {promptText}
        </div>
        <div style={{ marginBottom: '10px' }}>
          Selected: {selectedCards.length} card{selectedCards.length !== 1 ? 's' : ''}
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={onCancelAction}
            style={{
              padding: '8px 15px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button 
            onClick={onFinishAction}
            style={{
              padding: '8px 15px',
              backgroundColor: '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Finish
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="hand-container">
      <h3 style={{ marginBottom: '10px' }}>Your Hand ({cards.length} cards)</h3>
      
      {waitingForInput && getActionPrompt()}
      
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
            onClick={() => {
              if (waitingForInput && onSelectCard) {
                onSelectCard(card.id);
              } else {
                onPlayCard(card.id);
              }
            }}
            disabled={!waitingForInput && playerActions < card.actionCost}
            selectable={waitingForInput}
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