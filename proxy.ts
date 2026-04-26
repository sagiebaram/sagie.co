import { NextRequest, NextResponse } from 'next/server'

const LAUNCH_ALLOWED_PATHS = new Set(['/', '/coming-soon'])
const LAUNCH_ALLOWED_PREFIXES = ['/_next', '/api', '/favicon', '/sitemap', '/robots']

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Launch-mode route gate: only homepage + coming-soon accessible
  if (process.env.NEXT_PUBLIC_LAUNCH_MODE === 'simple') {
    if (
      !LAUNCH_ALLOWED_PATHS.has(pathname) &&
      !LAUNCH_ALLOWED_PREFIXES.some(p => pathname.startsWith(p)) &&
      !pathname.match(/\.(ico|png|jpg|jpeg|svg|gif|webp|woff|woff2|ttf|css|js|map)$/)
    ) {
      return NextResponse.rewrite(new URL('/coming-soon', request.url))
    }
  }

  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')
  const isDev = process.env.NODE_ENV === 'development'

  // Origin check for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const origin = request.headers.get('origin') ?? ''
    const allowedOriginsStr = process.env.ALLOWED_ORIGINS ?? ''
    const allowed = new Set(allowedOriginsStr.split(',').map(s => s.trim()))
    if (origin && !allowed.has(origin)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
  }

  const cspHeader = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ''}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' https: data:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "connect-src 'self' https://api.notion.com https://*.ingest.sentry.io",
  ].join('; ')

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-nonce', nonce)
  requestHeaders.set('Content-Security-Policy', cspHeader)

  const response = NextResponse.next({ request: { headers: requestHeaders } })
  response.headers.set('Content-Security-Policy', cspHeader)
  return response
}

export const config = {
  matcher: [
    {
      source: '/((?!_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
}
