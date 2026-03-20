import { Bebas_Neue, DM_Sans } from 'next/font/google'
import './globals.css'

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata = {
  title: 'SAGIE — Shape a Great Impact Everywhere',
  description:
    'A curated ecosystem for operators, founders & builders. Where founders and operators come to build cross-cultural impact.',
  openGraph: {
    title: 'SAGIE — Shape a Great Impact Everywhere',
    description: 'A curated ecosystem for operators, founders & builders.',
    url: 'https://sagie.co',
    siteName: 'SAGIE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SAGIE — Shape a Great Impact Everywhere',
    description: 'A curated ecosystem for operators, founders & builders.',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${bebasNeue.variable} ${dmSans.variable} bg-black text-white font-dm antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
