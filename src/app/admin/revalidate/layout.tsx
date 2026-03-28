import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin - Revalidate',
  robots: { index: false },
}

export default function RevalidateLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
