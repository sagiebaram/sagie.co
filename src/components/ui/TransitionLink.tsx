'use client'

import { useRouter } from 'next/navigation'
import { useCallback, type AnchorHTMLAttributes, type MouseEvent } from 'react'

type TransitionLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string
}

/**
 * Drop-in `<a>` replacement that triggers a View Transition API crossfade
 * before client-side navigating via Next.js router.
 *
 * Falls back to normal navigation when the API is unavailable or the user
 * prefers reduced motion.
 */
export function TransitionLink({ href, onClick, children, ...rest }: TransitionLinkProps) {
  const router = useRouter()

  const handleClick = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      // Let the caller's onClick run first (e.g. closing mobile menu)
      onClick?.(e)

      // Bail on modifier-key clicks (open-in-new-tab, etc.)
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.defaultPrevented) return

      // Only handle internal links
      if (href.startsWith('#') || href.startsWith('http')) return

      e.preventDefault()

      const prefersReduced =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches

      // If View Transition API is available and motion is OK, use it
      if ('startViewTransition' in document && !prefersReduced) {
        ;(document as any).startViewTransition(() => {
          router.push(href)
        })
      } else {
        router.push(href)
      }
    },
    [href, onClick, router],
  )

  return (
    <a href={href} onClick={handleClick} {...rest}>
      {children}
    </a>
  )
}
