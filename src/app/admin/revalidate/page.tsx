'use client'

import { useState } from 'react'

const CONTENT_TYPES: { label: string; tag: string }[] = [
  { label: 'Blog', tag: 'notion:blog' },
  { label: 'Events', tag: 'notion:events' },
  { label: 'Resources', tag: 'notion:resources' },
  { label: 'Solutions', tag: 'notion:solutions' },
  { label: 'Members', tag: 'notion:members' },
  { label: 'Chapters', tag: 'notion:chapters' },
]

export default function RevalidatePage() {
  const [secret, setSecret] = useState('')
  const [secretEntered, setSecretEntered] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  async function handleRevalidate(tags: string[]) {
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch('/api/revalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret, tags }),
      })
      const json = await res.json()
      if (!res.ok) {
        setResult(`Error: ${json.error ?? 'Unknown error'}`)
      } else {
        setResult(`Revalidated: ${json.tags.join(', ')}`)
      }
    } catch (err) {
      setResult(`Error: ${err instanceof Error ? err.message : 'Network error'}`)
    } finally {
      setLoading(false)
    }
  }

  if (!secretEntered) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 w-full max-w-sm">
          <h1 className="text-white text-xl font-semibold mb-6">Cache Admin</h1>
          <label className="block text-gray-400 text-sm mb-2">Revalidation Secret</label>
          <input
            type="password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && secret) setSecretEntered(true) }}
            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm mb-4 focus:outline-none focus:border-gray-500"
            placeholder="Enter secret..."
          />
          <button
            onClick={() => setSecretEntered(true)}
            disabled={!secret}
            className="w-full bg-white text-gray-900 rounded px-4 py-2 text-sm font-medium hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 p-8">
      <div className="max-w-xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-white text-xl font-semibold">Cache Revalidation</h1>
          <button
            onClick={() => { setSecretEntered(false); setSecret(''); setResult(null) }}
            className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
          >
            Change secret
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          {CONTENT_TYPES.map(({ label, tag }) => (
            <button
              key={tag}
              onClick={() => handleRevalidate([tag])}
              disabled={loading}
              className="bg-gray-800 border border-gray-700 rounded px-4 py-3 text-white text-sm hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-left"
            >
              {label}
            </button>
          ))}
        </div>

        <button
          onClick={() => handleRevalidate([])}
          disabled={loading}
          className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-3 text-white text-sm font-medium hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mb-6"
        >
          {loading ? 'Refreshing...' : 'Refresh All'}
        </button>

        {result && (
          <p className={`text-sm ${result.startsWith('Error') ? 'text-red-400' : 'text-green-400'}`}>
            {result}
          </p>
        )}
      </div>
    </div>
  )
}
