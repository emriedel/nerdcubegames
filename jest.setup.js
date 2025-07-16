import '@testing-library/jest-dom'

// Mock framer-motion to avoid issues with animations in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: 'div',
    button: 'button',
    span: 'span',
  },
  AnimatePresence: ({ children }) => children,
}))

// Mock window.navigator for sharing tests
Object.defineProperty(window, 'navigator', {
  value: {
    clipboard: {
      writeText: jest.fn(() => Promise.resolve()),
    },
    share: jest.fn(() => Promise.resolve()),
  },
  writable: true,
})