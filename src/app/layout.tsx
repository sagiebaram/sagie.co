import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { Bebas_Neue, DM_Sans } from 'next/font/google'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { GSAPCleanup } from '@/components/ui/GSAPCleanup'
import { METADATA, SITE } from '@/constants/copy'
import './globals.css'

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas-neue',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: METADATA.title,
    template: `%s | ${SITE.name}`,
  },
  description: METADATA.description,
  openGraph: {
    title: METADATA.title,
    description: METADATA.ogDescription,
    url: SITE.url,
    siteName: SITE.name,
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: SITE.tagline,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: METADATA.title,
    description: METADATA.ogDescription,
    images: ['/og-image.png'],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE.url}/#organization`,
      name: SITE.name,
      url: SITE.url,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE.url}/logo-white.png`,
      },
      description: METADATA.description,
      sameAs: [
        'https://www.linkedin.com/company/sagie-co',
        'https://www.instagram.com/sagie.co/',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE.url}/#website`,
      url: SITE.url,
      name: SITE.name,
      description: METADATA.description,
      publisher: { '@id': `${SITE.url}/#organization` },
    },
  ],
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const nonce = (await headers()).get('x-nonce') ?? ''

  return (
    <html
      lang="en"
      className={`${bebasNeue.variable} ${dmSans.variable}`}
      suppressHydrationWarning
    >
      <body>
        {/* Block browser scroll restore on this page load (prevents stale
            position on refresh). GSAPCleanup switches to 'auto' after
            hydration so back/forward still works natively.
            Nonce required by CSP in proxy.ts. */}
        <script
          nonce={nonce}
          dangerouslySetInnerHTML={{ __html: `history.scrollRestoration='manual';window.scrollTo(0,0)` }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <GSAPCleanup />
        <NuqsAdapter>{children}</NuqsAdapter>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
