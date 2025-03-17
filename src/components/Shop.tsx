import React from 'react';
import { Card as CardType } from '../models/types';
import Card from './Card';

interface ShopProps {
  cards: CardType[];
  onBuyCard: (cardId: string) => void;
  playerGold: number;
  playerBuys: number;
}

const Shop: React.FC<ShopProps> = ({ cards, onBuyCard, playerGold, playerBuys }) => {
  // Group cards by type for better display
  const groupedCards: { [key: string]: CardType[] } = {};
  
  cards.forEach(card => {
    if (!groupedCards[card.name]) {
      groupedCards[card.name] = [];
    }
    groupedCards[card.name].push(card);
  });
  
  return (
    <div className="shop-container" style={{ marginTop: '20px' }}>
      <h3 style={{ marginBottom: '10px' }}>Shop</h3>
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '15px'
      }}>
        {Object.entries(groupedCards).map(([cardName, cardsOfType]) => {
          const card = cardsOfType[0];
          const canBuy = playerGold >= card.cost && playerBuys > 0;
          
          return (
            <div key={cardName} style={{ textAlign: 'center' }}>
              <Card
                card={card}
                onClick={() => onBuyCard(card.id)}
                disabled={!canBuy}
                isShopCard={true}
              />
              <div style={{ marginTop: '5px', fontSize: '12px' }}>
                Available: {cardsOfType.length}
              </div>
            </div>
          );
        })}
        
        {Object.keys(groupedCards).length === 0 && (
          <div style={{ padding: '20px', color: '#888' }}>
            Shop is empty
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;