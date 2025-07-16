import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Nerd Cube Games',
  description: 'Daily puzzle games inspired by New York Times games',
  keywords: ['puzzle', 'games', 'daily', 'wordle', 'connections', 'boggle'],
  openGraph: {
    title: 'Nerd Cube Games',
    description: 'Daily puzzle games inspired by New York Times games',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="bg-white dark:bg-gray-900 shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Nerd Cube Games
              </h1>
              <nav className="space-x-4">
                <a href="/" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                  Home
                </a>
              </nav>
            </div>
          </div>
        </header>
        <main className="min-h-screen bg-gray-50 dark:bg-gray-800">
          {children}
        </main>
      </body>
    </html>
  )
}