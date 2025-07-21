import WordLadderGame from '@/components/games/WordLadderGame';

export default function WordLadderPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <WordLadderGame />
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Word Ladder - Daily Puzzle Game',
  description: 'Transform one word into another by changing one letter at a time. Challenge yourself with daily word ladder puzzles!',
};