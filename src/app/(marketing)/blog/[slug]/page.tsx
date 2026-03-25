import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Section } from '@/components/ui/Section'
import { MOCK_POSTS } from '@/constants/blog'
import { ShareButton } from './ShareButton'

function formatDate(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function generateStaticParams() {
  return MOCK_POSTS.map(post => ({ slug: post.slug }))
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = MOCK_POSTS.find(p => p.slug === slug)
  if (!post) redirect('/blog')

  const sortedPosts = [...MOCK_POSTS].sort((a, b) => new Date(a.publishDate).getTime() - new Date(b.publishDate).getTime())
  const currentIdx = sortedPosts.findIndex(p => p.id === post.id)
  const nextPost = sortedPosts[currentIdx + 1] || sortedPosts[0]

  const related = MOCK_POSTS
    .filter(p => p.category === post.category && p.id !== post.id)
    .slice(0, 3)

  const paragraphs = post.content.split('\n').filter(Boolean)

  return (
    <main className="relative">
      <Navbar />

      <Section className="pt-28 md:pt-36">
        <Link
          href="/blog"
          className="font-body text-foreground-muted text-label tracking-label uppercase hover:text-silver transition-colors duration-150 mb-8 inline-block"
        >
          ← Back to Blog
        </Link>

        <div className="flex items-center gap-2 mb-4 font-body text-label tracking-label">
          <span className="text-silver uppercase">{post.category}</span>
          <span className="text-foreground-ghost">·</span>
          <span className="text-foreground-muted">{formatDate(post.publishDate)}</span>
          <span className="text-foreground-ghost">·</span>
          <span className="text-foreground-muted">{post.readTime} min read</span>
        </div>

        <h1 className="font-display uppercase text-[40px] leading-[0.95] tracking-heading text-silver mb-4">
          {post.title}
        </h1>

        <p className="font-body text-foreground-muted text-[9px] uppercase tracking-eyebrow mb-2">
          {post.author}
        </p>
        <p className="font-body text-foreground-ghost text-[9px] uppercase tracking-eyebrow mb-4">
          {post.authorType === 'Community Member' ? 'Community Member' : 'Founder · Ecosystem Architect'}
        </p>

        <ShareButton />

        <hr className="border-border-subtle my-8" />

        <div className="max-w-[600px]">
          {paragraphs.map((p, i) => (
            <p key={i} className="font-body text-foreground-secondary font-light text-[13px] leading-[1.85] mb-6">
              {p}
            </p>
          ))}
        </div>

        {/* Related posts */}
        {related.length > 0 && (
          <div className="mt-16">
            <p className="font-body uppercase text-foreground-ghost text-label tracking-eyebrow mb-6">Related</p>
            <div className="grid md:grid-cols-3 gap-6">
              {related.map(r => (
                <Link
                  key={r.id}
                  href={`/blog/${r.slug}`}
                  className="group p-5 border border-border-subtle hover:border-border-default transition-all duration-150"
                >
                  <span className="font-body uppercase text-foreground-ghost text-[10px] tracking-label block mb-2">{r.category}</span>
                  <h4 className="font-display uppercase text-[14px] leading-tight text-foreground-dim group-hover:text-silver transition-colors duration-150 mb-3">
                    {r.title}
                  </h4>
                  <span className="font-body text-silver text-[10px] tracking-label group-hover:translate-x-0.5 transition-transform duration-150 inline-block">Read →</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </Section>

      {/* Next post bar */}
      {nextPost && nextPost.id !== post.id && (
        <Link
          href={`/blog/${nextPost.slug}`}
          className="group block border-t border-border-strong"
        >
          <div className="max-w-[880px] mx-auto px-6 md:px-8 py-6 flex items-center justify-between">
            <div>
              <span className="font-body uppercase text-foreground-ghost text-[10px] tracking-label block mb-1">Next post</span>
              <span className="font-display uppercase text-[18px] text-foreground-muted group-hover:text-silver transition-colors duration-150">
                {nextPost.title}
              </span>
            </div>
            <span className="font-display text-foreground-muted text-[24px] group-hover:translate-x-1 transition-transform duration-150">→</span>
          </div>
        </Link>
      )}

      <Footer />
    </main>
  )
}
