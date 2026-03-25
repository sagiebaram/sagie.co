import type { Metadata } from 'next'
import { Bebas_Neue, DM_Sans } from 'next/font/google'
import { ThemeProvider } from '@/components/layout/ThemeProvider'
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
  title: METADATA.title,
  description: METADATA.description,
  openGraph: {
    title: METADATA.title,
    description: METADATA.ogDescription,
    url: SITE.url,
    siteName: SITE.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: METADATA.title,
    description: METADATA.ogDescription,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${bebasNeue.variable} ${dmSans.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <body className="bg-surface text-white font-dm antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
