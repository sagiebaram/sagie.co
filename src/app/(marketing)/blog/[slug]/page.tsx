import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CircuitBackground } from '@/components/ui/CircuitBackground'
import { Section } from '@/components/ui/Section'
import { BlogPostHeaderAnimation } from '@/components/ui/BlogPostHeaderAnimation'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { BlogContent } from '@/components/mdx/BlogContent'
import { getAllPosts, getPostBySlug } from '@/lib/blog'
import { ShareButton } from './ShareButton'

export const revalidate = 3600

function formatDate(dateStr: string) {
  return new Date(dateStr + 'T00:00:00Z').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
}

export async function generateStaticParams() {
  try {
    const posts = await getAllPosts()
    return posts.map(post => ({ slug: post.slug }))
  } catch {
    return []
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  const allPosts = await getAllPosts()

  const sortedPosts = [...allPosts].sort((a, b) => {
    const aDate = a.publishDate ? new Date(a.publishDate).getTime() : 0
    const bDate = b.publishDate ? new Date(b.publishDate).getTime() : 0
    return aDate - bDate
  })
  const currentIdx = sortedPosts.findIndex(p => p.id === post.id)
  const nextPost = sortedPosts[currentIdx + 1] || sortedPosts[0]

  const related = allPosts
    .filter(p => p.category === post.category && p.id !== post.id)
    .slice(0, 3)

  return (
    <main className="relative">
      <CircuitBackground />
      <Navbar />

      <Section className="pt-28 md:pt-36">
        <BlogPostHeaderAnimation>
          <Link
            href="/blog"
            className="post-back font-body text-foreground-muted text-label tracking-label uppercase hover:text-silver hover:-translate-y-px transition-all duration-150 mb-8 inline-block"
          >
            ← Back to Blog
          </Link>

          <div className="post-meta flex items-center gap-2 mb-4 font-body text-label tracking-spaced">
            <span className="text-foreground-muted uppercase">{post.category}</span>
            <span className="text-foreground-dim">·</span>
            <span className="text-foreground-muted">{post.publishDate ? formatDate(post.publishDate) : ''}</span>
            <span className="text-foreground-dim">·</span>
            <span className="text-foreground-muted">{post.readTime} min read</span>
          </div>

          <h1 className="post-title font-display uppercase text-[40px] leading-[0.95] tracking-heading text-foreground-secondary mb-4">
            {post.title}
          </h1>

          <div className="post-author">
            <p className="font-body text-foreground-muted text-label uppercase tracking-eyebrow mb-1">
              {post.author}
            </p>
            <p className="font-body text-foreground-dim text-label uppercase tracking-eyebrow mb-4">
              {post.authorType === 'Community Member' ? 'Community Member' : 'Founder · Ecosystem Architect'}
            </p>

            <ShareButton />
          </div>
        </BlogPostHeaderAnimation>

        <hr className="border-border-default my-8" />

        <ScrollReveal y={16} duration={0.5}>
          <div className="max-w-[600px]">
            <BlogContent markdown={post.markdown} />
          </div>
        </ScrollReveal>

        {/* Related posts */}
        {related.length > 0 && (
          <ScrollReveal selector=".related-card" stagger={0.1} y={16} duration={0.45} className="mt-16">
            <p className="font-body uppercase text-foreground-dim text-label tracking-eyebrow mb-6">Related</p>
            <div className="grid md:grid-cols-3 gap-px">
              {related.map(r => (
                <Link
                  key={r.id}
                  href={`/blog/${r.slug}`}
                  className="related-card group p-6 border border-border-default hover:bg-background-card-featured transition-colors duration-200"
                >
                  <span className="font-body uppercase text-foreground-muted text-label tracking-spaced block mb-2">{r.category}</span>
                  <h4 className="font-display uppercase text-[14px] leading-tight text-foreground-dim group-hover:text-foreground-secondary transition-colors duration-150 mb-3">
                    {r.title}
                  </h4>
                  <span className="font-body text-foreground-secondary text-label tracking-mid group-hover:translate-x-0.5 transition-transform duration-150 inline-block">Read →</span>
                </Link>
              ))}
            </div>
          </ScrollReveal>
        )}
      </Section>

      {/* Next post bar */}
      {nextPost && nextPost.id !== post.id && (
        <ScrollReveal y={12} duration={0.4}>
          <Link
            href={`/blog/${nextPost.slug}`}
            className="group block border-t border-border-strong"
          >
            <div className="max-w-[880px] mx-auto px-6 md:px-8 py-6 flex items-center justify-between">
              <div>
                <span className="font-body uppercase text-foreground-dim text-label tracking-label block mb-1">Next post</span>
                <span className="font-display uppercase text-[18px] text-foreground-muted group-hover:text-foreground-secondary transition-colors duration-150">
                  {nextPost.title}
                </span>
              </div>
              <span className="font-display text-foreground-dim text-[24px] group-hover:text-foreground-muted group-hover:translate-x-1 transition-all duration-150">→</span>
            </div>
          </Link>
        </ScrollReveal>
      )}

      <Footer />
    </main>
  )
}
