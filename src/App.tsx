// React import is implicitly used by JSX
import './App.css';
import { useGameState } from './hooks/useGameState';
import Stats from './components/Stats';
import Hand from './components/Hand';
import Shop from './components/Shop';
import GameOver from './components/GameOver';

function App() {
  const { gameState, playCard, buyCard, endTurn, newGame } = useGameState();
  
  return (
    <div className="app">
      <div className="game-container" style={{ 
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px'
      }}>
        <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Deck Builder Game</h1>
        
        <Stats 
          player={gameState.player} 
          enemy={gameState.enemy} 
          round={gameState.round} 
        />
        
        <div className="game-actions" style={{ 
          display: 'flex', 
          justifyContent: 'center',
          marginBottom: '20px'
        }}>
          <button 
            onClick={endTurn}
            disabled={gameState.gameOver}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              backgroundColor: '#e74c3c',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: gameState.gameOver ? 'not-allowed' : 'pointer',
              opacity: gameState.gameOver ? 0.6 : 1
            }}
          >
            End Turn
          </button>
        </div>
        
        <Hand 
          cards={gameState.player.hand} 
          onPlayCard={playCard} 
          playerActions={gameState.player.actions} 
        />
        
        <Shop 
          cards={gameState.shopCards} 
          onBuyCard={buyCard} 
          playerGold={gameState.player.gold}
          playerBuys={gameState.player.buys}
        />
        
        {gameState.gameOver && (
          <GameOver 
            winner={gameState.winner} 
            onNewGame={newGame} 
            round={gameState.round}
          />
        )}
      </div>
    </div>
  );
}

export default App;
