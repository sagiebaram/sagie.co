export interface BlogPost {
  id: string
  title: string
  slug: string
  category: 'Personal' | 'Ecosystem' | 'Spotlight' | 'Event Recap' | 'Thought Leadership'
  excerpt: string
  author: string
  authorType: 'Sagie' | 'Community Member'
  coverImage: string | null
  featured: boolean
  publishDate: string
  readTime: number
  content: string
}

export const BLOG_CATEGORIES = ['All', 'Personal', 'Ecosystem', 'Spotlight', 'Event Recap', 'Thought Leadership'] as const
export const BLOG_AUTHORS = ['All', 'Sagie Baram', 'Community Members'] as const

export const MOCK_POSTS: BlogPost[] = [
  { id: '1', title: 'What it means to build a movement', slug: 'what-it-means-to-build-a-movement', category: 'Personal', excerpt: 'A vision started this. A system scaled it. A movement is what happened when the right people showed up.', author: 'Sagie Baram', authorType: 'Sagie', coverImage: null, featured: true, publishDate: '2026-03-01', readTime: 5, content: 'A vision started this. Not a business plan. Not a pitch deck. A belief that people who think in ecosystems rather than transactions could build something that outlasts any individual effort.\n\nThe system came next. Structure does not kill movements — it enables them. Every agent, every database, every protocol exists to protect the human layer, not replace it.\n\nAnd then the people showed up. That is when it became a movement.' },
  { id: '2', title: 'The ecosystem is live — what happens next', slug: 'the-ecosystem-is-live', category: 'Ecosystem', excerpt: 'SAGIE ECO Miami launched. Here is what we built, what we learned, and where we go from here.', author: 'Sagie Baram', authorType: 'Sagie', coverImage: null, featured: false, publishDate: '2026-02-15', readTime: 4, content: 'Full post content here.' },
  { id: '3', title: 'Why I joined SAGIE as an operator', slug: 'why-i-joined-sagie-operator', category: 'Spotlight', excerpt: 'I was not looking for another community. I was looking for a room where execution matters as much as vision.', author: 'Alex M.', authorType: 'Community Member', coverImage: null, featured: false, publishDate: '2026-03-08', readTime: 3, content: 'Full post content here.' },
  { id: '4', title: 'Miami Season Opener — what came out of it', slug: 'miami-season-opener-recap', category: 'Event Recap', excerpt: '60 people. One room. The conversations that happened and the connections that came out of it.', author: 'Sagie Baram', authorType: 'Sagie', coverImage: null, featured: false, publishDate: '2026-03-12', readTime: 6, content: 'Full post content here.' },
  { id: '5', title: 'Why trust is the only currency that compounds', slug: 'trust-compounds', category: 'Thought Leadership', excerpt: 'Every ecosystem has a currency. In most networks it is access. In SAGIE it is trust.', author: 'Sagie Baram', authorType: 'Sagie', coverImage: null, featured: false, publishDate: '2026-03-18', readTime: 7, content: 'Full post content here.' },
  { id: '6', title: 'Building in Miami — a founder perspective', slug: 'building-in-miami', category: 'Ecosystem', excerpt: 'Miami gets a lot of hype. Here is what it actually looks like to build a company here in 2026.', author: 'Jordan R.', authorType: 'Community Member', coverImage: null, featured: false, publishDate: '2026-03-20', readTime: 4, content: 'Full post content here.' },
  { id: '7', title: 'On building with ADHD', slug: 'building-with-adhd', category: 'Personal', excerpt: 'The same brain that makes focus hard makes pattern recognition effortless.', author: 'Sagie Baram', authorType: 'Sagie', coverImage: null, featured: false, publishDate: '2026-02-28', readTime: 5, content: 'Full post content here.' },
]
