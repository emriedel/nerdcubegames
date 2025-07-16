import Link from 'next/link'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Daily Puzzle Games
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Challenge yourself with daily puzzles. All players get the same puzzles each day!
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
        <Link href="/games/boggle" className="group" prefetch={true}>
          <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400">
              Boggle
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Find words by connecting adjacent letters in a 4x4 grid. You have 3 minutes!
            </p>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Daily puzzle • 3 minutes • Word finding
            </div>
          </div>
        </Link>

        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg shadow-md p-6 opacity-50">
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Connections
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Group words into categories. Find the hidden connections!
          </p>
          <div className="text-sm text-gray-400 dark:text-gray-500">
            Coming soon...
          </div>
        </div>

        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg shadow-md p-6 opacity-50">
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Word Ladder
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Transform one word into another by changing one letter at a time.
          </p>
          <div className="text-sm text-gray-400 dark:text-gray-500">
            Coming soon...
          </div>
        </div>
      </div>
    </div>
  )
}