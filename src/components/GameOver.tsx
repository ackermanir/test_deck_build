import React from 'react';

interface GameOverProps {
  winner: 'player' | 'enemy' | null;
  onNewGame: () => void;
  round: number;
}

const GameOver: React.FC<GameOverProps> = ({ winner, onNewGame, round }) => {
  return (
    <div className="game-over-container" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 100
    }}>
      <div style={{
        backgroundColor: '#fff',
        padding: '30px',
        borderRadius: '10px',
        textAlign: 'center',
        maxWidth: '400px'
      }}>
        <h2 style={{ marginTop: 0 }}>
          Game Over - {winner === 'player' ? 'Victory!' : 'Defeat'}
        </h2>
        
        <p style={{ fontSize: '18px', margin: '20px 0' }}>
          {winner === 'player' 
            ? 'You defeated the enemy!' 
            : 'You were defeated by the enemy.'}
        </p>
        
        <p>You survived for {round} rounds.</p>
        
        <button 
          onClick={onNewGame}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#3498db',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Play Again
        </button>
      </div>
    </div>
  );
};

export default GameOver;