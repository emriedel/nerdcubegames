# Usage Guide

This guide covers how to run, develop, and use the Daily Puzzle Games project.

## Quick Start

### Development Server
```bash
npm run dev
```
Starts the development server at `http://localhost:3000` with hot reloading enabled.

### Production Build
```bash
npm run build
npm run start
```
Builds the application for production and starts the production server.

### Code Quality
```bash
npm run lint          # Run ESLint
npm run type-check    # Run TypeScript type checking
npm run test          # Run test suite
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

## Game Development

### Creating a New Game

1. **Generate Game Structure**
   ```bash
   # Create game directory
   mkdir -p src/games/your-game-name
   mkdir -p src/components/games/your-game-name
   mkdir -p src/app/games/your-game-name
   ```

2. **Implement Game Engine**
   Create `src/games/your-game-name/YourGameEngine.ts`:
   ```typescript
   import { GameEngine } from '../shared/GameEngine';
   
   export class YourGameEngine extends GameEngine {
     // Implement required methods
   }
   ```

3. **Create Game Components**
   Create React components in `src/components/games/your-game-name/`

4. **Add Game Route**
   Create `src/app/games/your-game-name/page.tsx`

5. **Update Game Registry**
   Add game configuration to `src/lib/constants.ts`

### Daily Puzzle System

The daily puzzle system ensures all users get the same challenge each day:

```typescript
// Generate today's puzzle
const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
const puzzle = gameEngine.generatePuzzle(today);

// Generate puzzle for specific date
const specificDate = '2024-01-15';
const historicalPuzzle = gameEngine.generatePuzzle(specificDate);
```

### Sharing Results

Games automatically generate shareable results:

```typescript
const shareResults = gameEngine.getShareableResults(gameState);
// Returns formatted text with emoji representations
```

## Available Commands

### Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reloading |
| `npm run build` | Build application for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint on all files |
| `npm run lint:fix` | Run ESLint and fix auto-fixable issues |
| `npm run type-check` | Run TypeScript type checking |

### Testing Commands

| Command | Description |
|---------|-------------|
| `npm run test` | Run all tests once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run test:ui` | Run tests with UI (if available) |

### Utility Commands

| Command | Description |
|---------|-------------|
| `npm run clean` | Clean build artifacts |
| `npm run analyze` | Analyze bundle size |
| `npm run format` | Format code with Prettier |

## Configuration

### Environment Variables

Create a `.env.local` file for local development:

```bash
# Optional: Analytics
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id

# Optional: Feature flags
NEXT_PUBLIC_ENABLE_BETA_FEATURES=false

# Optional: API endpoints
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### Tailwind Configuration

Customize styling in `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        'game-primary': '#your-color',
        'game-secondary': '#your-color',
      },
    },
  },
};
```

### Next.js Configuration

Modify `next.config.js` for build optimizations:

```javascript
module.exports = {
  experimental: {
    optimizeCss: true,
  },
  images: {
    domains: ['your-domain.com'],
  },
};
```

## Game Features

### Boggle Game

**How to Play:**
1. Find words by connecting adjacent letters
2. Drag or tap to select letter paths
3. Words must be at least 3 letters long
4. Use all the time available (3 minutes)
5. Share your results when finished

**Scoring:**
- 3-4 letters: 1 point
- 5 letters: 2 points
- 6 letters: 3 points
- 7 letters: 5 points
- 8+ letters: 11 points

**Controls:**
- **Touch**: Drag across letters to form words
- **Mouse**: Click and drag across letters
- **Keyboard**: Use arrow keys to navigate, Enter to select

### Sharing System

**Share Format:**
```
Word Grid 2024-01-15
Score: 42
Words: 15/89

🟩🟨🟩🟩
🟨🟩🟩🟨
🟩🟩🟨🟩
🟨🟩🟩🟩
```

**Share Options:**
- Copy to clipboard
- Native sharing (mobile)
- Social media optimized

## Development Workflow

### Adding Features

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Implement Feature**
   - Write code following established patterns
   - Add tests for new functionality
   - Update documentation if needed

3. **Test Changes**
   ```bash
   npm run test
   npm run type-check
   npm run lint
   ```

4. **Submit Pull Request**
   - Push branch to your fork
   - Create PR with descriptive title
   - Include screenshots for UI changes

### Debugging

**Development Tools:**
- React DevTools browser extension
- Next.js built-in error overlay
- TypeScript error checking
- ESLint warnings and errors

**Common Issues:**
- **Build errors**: Check TypeScript types and imports
- **Styling issues**: Verify Tailwind classes are correctly applied
- **Game logic bugs**: Use browser DevTools to debug state changes
- **Performance issues**: Use React Profiler to identify bottlenecks

## Deployment

### Vercel Deployment

1. **Connect Repository**
   - Link GitHub repository to Vercel
   - Configure build settings (automatic)

2. **Environment Variables**
   - Add environment variables in Vercel dashboard
   - Set production domains

3. **Deploy**
   ```bash
   git push origin main  # Automatic deployment
   ```

### Manual Deployment

1. **Build Application**
   ```bash
   npm run build
   ```

2. **Start Production Server**
   ```bash
   npm run start
   ```

3. **Deploy Static Files**
   Upload `.next` folder and `package.json` to your hosting provider

## Performance Optimization

### Bundle Analysis
```bash
npm run analyze
```
Generates bundle analysis report to identify optimization opportunities.

### Code Splitting
- Games are automatically code-split by route
- Use dynamic imports for heavy components:
  ```typescript
  const HeavyComponent = lazy(() => import('./HeavyComponent'));
  ```

### Mobile Optimization
- Touch events are debounced for better performance
- Images are optimized using Next.js Image component
- Critical CSS is inlined automatically

## Troubleshooting

### Common Issues

**Game Not Loading:**
- Check browser console for errors
- Verify all dependencies are installed
- Ensure TypeScript compilation succeeds

**Sharing Not Working:**
- Check clipboard permissions
- Verify navigator.share support
- Test fallback copy functionality

**Performance Issues:**
- Use React Profiler to identify slow components
- Check bundle size with analyzer
- Optimize images and assets

**Mobile Issues:**
- Test on actual devices
- Check touch event handling
- Verify responsive design breakpoints

### Getting Help

1. Check existing documentation
2. Review similar implementations in codebase
3. Open an issue with detailed description
4. Include error messages and browser information

## API Reference

### Game Engine Methods

```typescript
interface GameEngine {
  generatePuzzle(seed: string): PuzzleData;
  validateMove(move: GameMove, gameState: GameState): boolean;
  calculateScore(gameState: GameState): number;
  getShareableResults(gameState: GameState): ShareResults;
  isGameComplete(gameState: GameState): boolean;
}
```

### Hooks

```typescript
// Game state management
const { gameState, makeMove, resetGame, shareResults } = useGameState(engine, puzzle);

// Timer functionality
const { timeRemaining, startTimer, pauseTimer, resetTimer } = useTimer(duration);

// Local storage
const [value, setValue] = useLocalStorage(key, defaultValue);
```

## Best Practices

### Code Organization
- Keep components small and focused
- Use custom hooks for reusable logic
- Implement proper error boundaries
- Follow TypeScript best practices

### Performance
- Use React.memo for expensive components
- Implement proper loading states
- Optimize images and assets
- Monitor bundle size

### Accessibility
- Include proper ARIA labels
- Ensure keyboard navigation
- Maintain color contrast
- Test with screen readers

### Testing
- Write unit tests for game logic
- Test responsive design
- Verify sharing functionality
- Check accessibility compliance