import React from 'react';
import { Card as CardType } from '../models/types';
import Card from './Card';

interface ShopProps {
  cards: CardType[];
  onBuyCard: (cardId: string) => void;
  playerGold: number;
  playerBuys: number;
  disabled?: boolean;
  isUpgrading?: boolean;
  upgradeMaxCost?: number;
}

const Shop: React.FC<ShopProps> = ({ 
  cards, 
  onBuyCard, 
  playerGold, 
  playerBuys, 
  disabled = false,
  isUpgrading = false,
  upgradeMaxCost = 0
}) => {
  // Group cards by type for better display
  const groupedCards: { [key: string]: CardType[] } = {};
  
  cards.forEach(card => {
    if (!groupedCards[card.name]) {
      groupedCards[card.name] = [];
    }
    groupedCards[card.name].push(card);
  });
  
  // Sort card entries by cost
  const sortedCardEntries = Object.entries(groupedCards).sort((a, b) => {
    // a and b are [cardName, cardsOfType] entries
    const costA = a[1][0].cost;
    const costB = b[1][0].cost;
    return costA - costB; // Sort by cost ascending
  });
  
  return (
    <div className="shop-container" style={{ marginTop: '20px' }}>
      <h3 style={{ marginBottom: '10px' }}>Shop</h3>
      
      {isUpgrading && (
        <div style={{ 
          padding: '10px', 
          backgroundColor: '#f1f8e9', 
          borderRadius: '5px', 
          marginBottom: '15px',
          textAlign: 'center',
          fontWeight: 'bold'
        }}>
          Select a card from the shop costing up to {upgradeMaxCost} gold
        </div>
      )}
      
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '15px'
      }}>
        {sortedCardEntries.map(([cardName, cardsOfType]) => {
          const card = cardsOfType[0];
          
          // Determine if a card can be clicked
          let canBuy;
          if (isUpgrading) {
            canBuy = card.cost <= upgradeMaxCost;
          } else {
            canBuy = playerGold >= card.cost && playerBuys > 0 && !disabled;
          }
          
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
        
        {sortedCardEntries.length === 0 && (
          <div style={{ padding: '20px', color: '#888' }}>
            Shop is empty
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;