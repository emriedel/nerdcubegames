import Link from 'next/link'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Daily Puzzle Games
        </h1>
        <p className="text-lg text-gray-600">
          Challenge yourself with daily puzzles. All players get the same puzzles each day!
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
        <Link href="/games/boggle" className="group" prefetch={true}>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
              Boggle
            </h2>
            <p className="text-gray-600 mb-4">
              Find words by connecting adjacent letters in a 4x4 grid. You have 3 minutes!
            </p>
            <div className="text-sm text-gray-500">
              Daily puzzle • 3 minutes • Word finding
            </div>
          </div>
        </Link>

        <div className="bg-gray-50 rounded-lg shadow-sm border border-gray-200 p-6 opacity-60">
          <h2 className="text-2xl font-semibold text-gray-600 mb-2">
            Connections
          </h2>
          <p className="text-gray-500 mb-4">
            Group words into categories. Find the hidden connections!
          </p>
          <div className="text-sm text-gray-400">
            Coming soon...
          </div>
        </div>

        <Link href="/games/word-ladder" className="group" prefetch={true}>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
              Word Ladder
            </h2>
            <p className="text-gray-600 mb-4">
              Transform one word into another by changing one letter at a time.
            </p>
            <div className="text-sm text-gray-500">
              Daily puzzle • 5 minutes • Word transformation
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}