'use client'

import { useEffect, useRef } from 'react'

export interface RevealLine {
  text: string
  className?: string
}

interface SplitTextRevealProps {
  lines: RevealLine[]
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'span'
}

export function SplitTextReveal({
  lines,
  className = '',
  as: Tag = 'span',
}: SplitTextRevealProps) {
  const containerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    if (prefersReduced) {
      el.querySelectorAll<HTMLElement>('.split-word').forEach((word) => {
        word.classList.add('vis')
      })
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          el.querySelectorAll<HTMLElement>('.split-word').forEach((word) => {
            word.classList.add('vis')
          })
          observer.disconnect()
        }
      },
      { threshold: 0.2 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  let wordIndex = 0

  return (
    <Tag ref={containerRef as React.RefObject<never>} className={className}>
      {lines.map((line, lineIdx) => {
        const words = line.text.split(/\s+/)
        const lineWords = words.map((word, wi) => {
          const delay = wordIndex * 0.07
          wordIndex++
          return (
            <span key={wi}>
              <span className="split-word-wrap">
                <span
                  className="split-word"
                  style={{ transitionDelay: `${delay}s` }}
                >
                  {word}
                </span>
              </span>
              {wi < words.length - 1 ? ' ' : ''}
            </span>
          )
        })
        return (
          <span key={lineIdx} className={`block ${line.className ?? ''}`}>
            {lineWords}
          </span>
        )
      })}
    </Tag>
  )
}
