# Deck Builder Game

A deck building game inspired by Dominion and Slay the Spire, built with React and TypeScript.

## Game Rules

- Play cards from your hand to deal damage to the enemy or gain resources
- Use gold to buy new, more powerful cards for your deck
- Survive as long as possible against an enemy that gets stronger each round
- Manage your resources (actions, gold, health) strategically

## Starting Deck

- 7x Copper: +1 gold, 0 action cost
- 3x Punch: -1 enemy health, 1 action cost

## Shop Cards

- Stab (3 gold): -2 enemy health, 1 action cost
- Diamond (5 gold): +3 gold, 0 action cost
- Quick Hands (7 gold): +1 action, draw 2 cards, 1 action cost
- Med-kit (6 gold): +3 player health, 1 action cost

## Development

This project is built with Vite, React, and TypeScript.

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Architecture

The game is built with a clear separation between game logic and UI:

- `models/`: Data structures and types
- `utils/`: Game logic functions
- `components/`: React UI components
- `hooks/`: Custom React hooks for state management

## Deployment

The game is automatically deployed to GitHub Pages when changes are pushed to the main branch.
