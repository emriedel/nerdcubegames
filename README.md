# Daily Puzzle Games

A modern, mobile-first website for daily puzzle games inspired by New York Times games like Wordle and Connections.

## Overview

This project creates a platform for daily puzzle games where all users receive the same challenge each day, with built-in sharing capabilities for results. The architecture is designed to be extensible, making it easy to add new games while maintaining a consistent user experience.

## Features

- **Daily Puzzles**: New puzzle every day, same for all users
- **Mobile-First**: Optimized for touch interactions and small screens  
- **Sharing**: Share your results with friends (spoiler-free)
- **Multiple Games**: Extensible architecture for adding new games
- **Clean Design**: Minimalist aesthetic with smooth animations
- **Offline Ready**: Games work offline after initial load

## Games

### Boggle (Word Grid)
Find as many words as possible in a grid of letters within the time limit.

- 4x4 letter grid with optimized letter distribution
- 3-minute timer with visual countdown
- Dictionary-based word validation
- Score based on word length and rarity
- Daily challenges with consistent seeding
- Touch-friendly grid selection

## Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Deployment**: Vercel
- **State Management**: React hooks + Context API
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Development

### Project Structure

```
/src/
├── /app/                 # Next.js App Router pages
├── /components/          # Reusable UI components
├── /games/              # Game-specific logic and components
│   ├── /boggle/         # Boggle game implementation
│   └── /shared/         # Shared game utilities
├── /lib/                # Utility functions and constants
├── /hooks/              # Custom React hooks
└── /styles/             # Global styles
```

### Adding a New Game

1. Create a new directory in `/src/games/`
2. Implement the game engine extending the base `GameEngine` class
3. Create game-specific components
4. Add a new route in `/src/app/games/`
5. Update navigation and game registry

### Daily Puzzle System

Each game uses a deterministic seed based on the current date to ensure all users get the same puzzle each day. The seed is generated using:

```typescript
const seed = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
```

### Sharing System

Games implement a standardized sharing format:
- Emoji representations of results
- No spoilers (actual words/answers hidden)
- Copy-to-clipboard functionality
- Social media optimized text

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
npm run test         # Run Jest tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage
```

## Deployment

This project is optimized for Vercel deployment:

```bash
npm run build
```

The app will automatically deploy on pushes to main branch when connected to Vercel.

## Architecture

The project uses a modular, game-agnostic architecture:
- Abstract `GameEngine` class for consistent game implementation
- Shared utilities for daily puzzles and result sharing
- Component-based UI with reusable elements
- Mobile-first responsive design
- TypeScript for type safety

## License

MIT License - see LICENSE file for details