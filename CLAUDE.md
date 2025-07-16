# CLAUDE.md - Project Memory

## Project Overview
This is a modern, mobile-first website for daily puzzle games inspired by New York Times games (Wordle, Connections, etc.). The site serves daily puzzles where all users get the same challenge each day, with built-in sharing capabilities.

**Primary Technologies:**
- Next.js 14+ with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- Vercel for deployment
- React hooks + Context API for state management

## Project Structure

```
/src/
├── /app/                           # Next.js App Router
│   ├── layout.tsx                  # Root layout with navigation
│   ├── page.tsx                    # Home page with game selection
│   └── /games/
│       └── /boggle/page.tsx        # Boggle game page
├── /components/                    # Reusable UI components
│   ├── /ui/                        # Generic UI components
│   ├── /games/                     # Game-specific components
│   └── /layout/                    # Layout components
├── /games/                         # Game logic and engines
│   ├── /shared/                    # Shared game utilities
│   │   ├── GameEngine.ts           # Abstract base class
│   │   ├── GameTypes.ts            # Common type definitions
│   │   ├── ShareUtils.ts           # Results sharing logic
│   │   └── PuzzleGenerator.ts      # Daily puzzle seeding
│   └── /boggle/                    # Boggle-specific logic
│       ├── BoggleEngine.ts         # Main game engine
│       ├── BoggleTypes.ts          # Type definitions
│       ├── GridGenerator.ts        # Letter grid generation
│       └── WordValidator.ts        # Dictionary validation
├── /lib/                           # Utility functions
│   ├── utils.ts                    # General utilities
│   ├── constants.ts                # App constants
│   └── /dictionary/                # Word dictionaries
├── /hooks/                         # Custom React hooks
│   ├── useGameState.ts             # Game state management
│   ├── useTimer.ts                 # Timer functionality
│   └── useSharing.ts               # Sharing functionality
└── /styles/                        # Styling
    └── globals.css                 # Global CSS with Tailwind
```

## Development Guidelines

### Code Standards
- Use TypeScript for all files
- Follow Next.js 14 App Router conventions
- Use Tailwind utility classes for styling
- Implement proper error boundaries and loading states
- Use React.memo for performance optimization
- Follow mobile-first responsive design principles

### Game Architecture
- All games must extend the abstract `GameEngine` class
- Each game should have its own directory in `/src/games/`
- Use deterministic seeding for daily puzzles: `new Date().toISOString().split('T')[0]`
- Implement standardized sharing format with emoji representations
- Games should be fully playable offline after initial load

### Component Guidelines
- Create reusable UI components in `/src/components/ui/`
- Use composition over inheritance for component design
- Implement proper accessibility (ARIA labels, keyboard navigation)
- Ensure touch-friendly interactions (minimum 44px touch targets)
- Use Framer Motion for smooth animations

### State Management
- Use React hooks and Context API (avoid external state libraries initially)
- Implement proper error handling and loading states
- Use local storage for game persistence
- Keep game state minimal and serializable

## Important Commands

### Development
```bash
npm run dev          # Start development server at localhost:3000
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
```

### Testing
```bash
npm run test         # Run Jest tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

### Deployment
- Automatic deployment on Vercel when pushing to main branch
- Environment variables managed through Vercel dashboard
- Build optimizations handled automatically by Next.js

## Priority Implementation Order

1. **Project Setup**: Initialize Next.js with TypeScript and Tailwind
2. **Base Architecture**: Create GameEngine abstract class and shared types
3. **Boggle Game**: Implement first game as proof of concept
   - Grid generation with letter frequency optimization
   - Word validation using dictionary
   - Touch-friendly grid selection
   - Timer functionality
   - Scoring system
4. **Daily Puzzles**: Add date-based seeding system
5. **Sharing System**: Implement results sharing with emoji grids
6. **UI Polish**: Add animations, dark mode, accessibility features
7. **Second Game**: Validate architecture extensibility

## Key Features to Implement

### Daily Puzzle System
- Deterministic puzzle generation using date seeds
- Consistent puzzles across all users for same date
- Archive system for previous days
- Metadata tracking (difficulty, expected score, completion rate)

### Sharing Functionality
- Generate shareable results with visual representations
- Copy to clipboard and native sharing API
- Spoiler-free format (no actual answers revealed)
- Social media optimized text format

### Mobile Optimization
- Touch-friendly grid interactions
- Responsive design for all screen sizes
- Smooth animations and feedback
- Offline capability after initial load
- Progressive Web App features

### Boggle Game Specifics
- 4x4 letter grid with weighted letter distribution
- Path validation for connected letter selection
- Dictionary-based word validation
- Scoring based on word length and rarity
- 3-minute timer with visual countdown
- Results showing found words and missed opportunities

## Technical Considerations

### Performance
- Code splitting for individual games
- Lazy loading of dictionary files
- Optimized bundle size with tree shaking
- Efficient re-rendering with React.memo
- Image optimization for game assets

### Accessibility
- Screen reader support with proper ARIA labels
- Keyboard navigation for all interactions
- High contrast mode support
- Focus management for modal dialogs
- Semantic HTML structure

### SEO & Analytics
- Meta tags for social sharing
- Open Graph tags for rich previews
- Privacy-conscious analytics implementation
- Sitemap generation for game pages
- JSON-LD structured data

## Error Handling Patterns
- Graceful degradation for network failures
- Fallback puzzles if generation fails
- User-friendly error messages
- Retry mechanisms for transient failures
- Comprehensive error boundaries

## Testing Strategy
- Unit tests for game logic and utilities
- Integration tests for game flow
- E2E tests for complete user journeys
- Performance testing for mobile devices
- Accessibility testing with automated tools

## Future Extensibility
The architecture is designed to easily support:
- Additional puzzle games
- User accounts and progress tracking
- Multiplayer features
- Advanced analytics
- Monetization options
- API for mobile apps