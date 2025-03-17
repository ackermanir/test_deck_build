# CLAUDE.md - Guidance for the Deck Builder Game Project

## Build & Test Commands
- Dev server: `npm run dev`
- Build: `npm run build`
- Preview build: `npm run preview`
- Lint: `npm run lint`
- Typecheck: `npm run typecheck`

## Code Style Guidelines
- **Formatting**: Use 2 spaces for indentation
- **Naming**: 
  - camelCase for variables/functions
  - PascalCase for components/classes
  - UPPER_CASE for constants
- **Comments**: Document complex logic and component props
- **Error Handling**: Use try/catch for async operations
- **Types**: Use TypeScript interfaces and types for all data structures
- **Imports**: Group imports by React, third-party, and local modules
- **File Structure**: One component per file, organize by feature

## Project Structure
This project is a deck building game with:
- `src/components/`: React UI components
- `src/models/`: TypeScript interfaces and types
- `src/utils/`: Game logic functions
- `src/hooks/`: Custom React hooks for state management
- `src/assets/`: Static assets like images

## Architecture Principles
- Separate game logic from UI components
- Use React hooks for state management
- Keep components small and focused
- Use TypeScript for type safety
- Follow functional programming principles