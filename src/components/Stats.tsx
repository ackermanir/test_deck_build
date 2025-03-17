import React from 'react';
import { Player, Enemy } from '../models/types';

interface StatsProps {
  player: Player;
  enemy: Enemy;
  round: number;
}

const Stats: React.FC<StatsProps> = ({ player, enemy, round }) => {
  return (
    <div className="stats-container" style={{ 
      display: 'flex', 
      justifyContent: 'space-between',
      padding: '10px',
      marginBottom: '20px',
      backgroundColor: '#f5f5f5',
      borderRadius: '8px'
    }}>
      <div className="player-stats" style={{ flex: 1 }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>Player</h3>
        <div className="stat-item">
          <span role="img" aria-label="health">❤️</span> Health: {player.health}
        </div>
        <div className="stat-item">
          <span role="img" aria-label="actions">⚡</span> Actions: {player.actions}
        </div>
        <div className="stat-item">
          <span role="img" aria-label="buys">🛒</span> Buys: {player.buys}
        </div>
        <div className="stat-item">
          <span role="img" aria-label="gold">💰</span> Gold: {player.gold}
        </div>
        <div className="stat-item">
          <span role="img" aria-label="deck">🃏</span> Draw: {player.drawPile.length} cards
        </div>
        <div className="stat-item">
          <span role="img" aria-label="discard">♻️</span> Discard: {player.discardPile.length} cards
        </div>
      </div>
      
      <div className="round-info" style={{ 
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <h2 style={{ margin: '0' }}>Round {round}</h2>
      </div>
      
      <div className="enemy-stats" style={{ flex: 1, textAlign: 'right' }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#c0392b' }}>Enemy</h3>
        <div className="stat-item">
          <span role="img" aria-label="health">❤️</span> Health: {enemy.health}
        </div>
        <div className="stat-item">
          <span role="img" aria-label="damage">⚔️</span> Damage: {enemy.damagePerTurn} per turn
        </div>
      </div>
    </div>
  );
};

export default Stats;