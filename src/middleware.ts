import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const ALLOWED_PATHS = new Set(['/', '/coming-soon'])

const ALLOWED_PREFIXES = [
  '/_next',
  '/api',
  '/favicon',
  '/sitemap',
  '/robots',
]

export function middleware(request: NextRequest) {
  // Only gate in launch mode
  if (process.env.NEXT_PUBLIC_LAUNCH_MODE !== 'simple') {
    return NextResponse.next()
  }

  const { pathname } = request.nextUrl

  // Allow exact matches
  if (ALLOWED_PATHS.has(pathname)) {
    return NextResponse.next()
  }

  // Allow prefix matches (static assets, API, Next.js internals)
  if (ALLOWED_PREFIXES.some(prefix => pathname.startsWith(prefix))) {
    return NextResponse.next()
  }

  // Allow static files (images, fonts, etc.)
  if (pathname.match(/\.(ico|png|jpg|jpeg|svg|gif|webp|woff|woff2|ttf|css|js|map)$/)) {
    return NextResponse.next()
  }

  // Block everything else → Coming Soon
  return NextResponse.rewrite(new URL('/coming-soon', request.url))
}

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)'],
}
