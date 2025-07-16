# Contributing to Daily Puzzle Games

Thank you for your interest in contributing to Daily Puzzle Games! This document outlines the coding standards, development workflow, and best practices for this project.

## Development Setup

### Prerequisites
- Node.js 18.0.0 or higher
- npm or yarn package manager
- Git for version control

### Initial Setup
1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/daily-puzzle-games.git`
3. Install dependencies: `npm install`
4. Create a new branch: `git checkout -b feature/your-feature-name`
5. Start development server: `npm run dev`

## Coding Standards

### TypeScript Guidelines
- Use TypeScript for all new files
- Define proper interfaces and types
- Avoid `any` type - use proper typing or `unknown`
- Use strict mode settings in tsconfig.json
- Export types and interfaces from dedicated type files

### React Best Practices
- Use functional components with hooks
- Implement proper error boundaries
- Use React.memo for performance optimization when needed
- Follow the single responsibility principle for components
- Use custom hooks for reusable logic

### File Organization
```
/src/
├── /app/                 # Next.js App Router pages
├── /components/          # Reusable UI components
│   ├── /ui/             # Generic UI components
│   ├── /games/          # Game-specific components
│   └── /layout/         # Layout components
├── /games/              # Game logic and engines
│   ├── /shared/         # Shared game utilities
│   └── /[game-name]/    # Individual game implementations
├── /lib/                # Utility functions and constants
├── /hooks/              # Custom React hooks
└── /styles/             # Global styles
```

### Naming Conventions
- **Files**: PascalCase for components (`BoggleGrid.tsx`), camelCase for utilities (`wordValidator.ts`)
- **Components**: PascalCase (`BoggleGrid`, `ShareButton`)
- **Functions**: camelCase (`generateGrid`, `validateWord`)
- **Constants**: UPPER_SNAKE_CASE (`GAME_CONFIG`, `SCORING_RULES`)
- **Interfaces**: PascalCase with descriptive names (`GameState`, `BoggleMove`)

### Styling Guidelines
- Use Tailwind CSS utility classes
- Create reusable component variants in `/components/ui/`
- Follow mobile-first responsive design
- Ensure minimum 44px touch targets for mobile
- Use consistent spacing scale (4px increments)
- Implement dark mode support using Tailwind's dark mode utilities

## Game Development Standards

### Adding a New Game

1. **Create Game Directory Structure**
   ```
   /src/games/[game-name]/
   ├── [GameName]Engine.ts     # Main game logic
   ├── [GameName]Types.ts      # Type definitions
   ├── [GameName]Utils.ts      # Utility functions
   └── [GameName]Scoring.ts    # Scoring algorithm
   ```

2. **Implement GameEngine Interface**
   ```typescript
   export class YourGameEngine extends GameEngine {
     generatePuzzle(seed: string): PuzzleData { /* ... */ }
     validateMove(move: GameMove, gameState: GameState): boolean { /* ... */ }
     calculateScore(gameState: GameState): number { /* ... */ }
     getShareableResults(gameState: GameState): ShareResults { /* ... */ }
     isGameComplete(gameState: GameState): boolean { /* ... */ }
   }
   ```

3. **Create Game Components**
   ```
   /src/components/games/[game-name]/
   ├── [GameName]Grid.tsx      # Main game interface
   ├── [GameName]Controls.tsx  # Game controls
   └── [GameName]Results.tsx   # Results display
   ```

4. **Add Game Route**
   - Create `/src/app/games/[game-name]/page.tsx`
   - Update navigation in layout components
   - Add game config to constants

### Daily Puzzle Requirements
- Use deterministic seeding: `new Date().toISOString().split('T')[0]`
- Ensure consistent puzzle generation across all users
- Implement proper difficulty scaling
- Add puzzle metadata (expected score, completion rate)

### Sharing System Requirements
- Generate spoiler-free visual representations
- Use emoji or symbols for result grids
- Include essential metadata (score, date, game type)
- Support both clipboard and native sharing APIs

## Testing Guidelines

### Unit Testing
- Test game logic and utility functions
- Use Jest with React Testing Library
- Aim for 80%+ code coverage
- Test edge cases and error conditions

### Integration Testing
- Test complete game flows
- Verify sharing functionality
- Test responsive design on different screen sizes
- Validate accessibility features

### Test File Structure
```
/src/
├── /games/
│   └── /[game-name]/
│       ├── __tests__/
│       │   ├── [GameName]Engine.test.ts
│       │   └── [GameName]Utils.test.ts
│       └── [GameName]Engine.ts
```

## Performance Guidelines

### Code Splitting
- Use dynamic imports for game components
- Lazy load dictionary files
- Implement proper loading states

### Mobile Optimization
- Minimize bundle size
- Use React.memo for expensive renders
- Implement touch event debouncing
- Optimize images and assets

### Accessibility Requirements
- Implement proper ARIA labels
- Ensure keyboard navigation
- Support screen readers
- Maintain color contrast ratios
- Provide alternative text for visual elements

## Git Workflow

### Branch Naming
- Feature branches: `feature/game-name-feature`
- Bug fixes: `fix/issue-description`
- Documentation: `docs/section-name`

### Commit Messages
Follow conventional commits format:
```
type(scope): description

Examples:
feat(boggle): add word validation logic
fix(ui): resolve mobile grid sizing issue
docs(readme): update installation instructions
```

### Pull Request Process
1. Create feature branch from `main`
2. Implement changes with tests
3. Run full test suite: `npm run test`
4. Check TypeScript: `npm run type-check`
5. Lint code: `npm run lint`
6. Create pull request with descriptive title and description
7. Request review from maintainers

## Code Review Guidelines

### What to Look For
- Code follows established patterns
- Proper error handling
- Mobile-friendly implementation
- Accessibility compliance
- Performance considerations
- Test coverage

### Review Process
- All PRs require at least one approval
- Automated tests must pass
- Type checking must pass
- No linting errors

## Common Patterns

### Game State Management
```typescript
const { gameState, makeMove, resetGame, shareResults } = useGameState(gameEngine, puzzle);
```

### Error Handling
```typescript
try {
  const result = await gameAction();
  // Handle success
} catch (error) {
  console.error('Game error:', error);
  // Show user-friendly error message
}
```

### Responsive Design
```typescript
// Use Tailwind responsive utilities
<div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
```

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Jest Documentation](https://jestjs.io/docs/getting-started)

## Getting Help

- Review existing code for patterns and examples
- Check the `ARCHITECTURE.md` file for detailed technical information
- Open an issue for bugs or feature requests
- Join discussions in pull requests

## License

By contributing, you agree that your contributions will be licensed under the MIT License.