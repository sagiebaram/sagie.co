'use client'

import { useTheme } from 'next-themes'

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      className="font-dm uppercase text-ink-10 hover:text-silver transition-colors duration-150 text-label tracking-label"
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
    >
      {resolvedTheme === 'dark' ? 'Light' : 'Dark'}
    </button>
  )
}
