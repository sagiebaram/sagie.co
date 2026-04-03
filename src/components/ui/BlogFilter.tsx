'use client'

import { useQueryStates, parseAsString } from 'nuqs'
import { BLOG_CATEGORIES, BLOG_AUTHORS } from '@/constants/blog'
import type { BlogPost } from '@/lib/blog'
import Link from 'next/link'
import { useScrollReveal } from '@/hooks/useScrollReveal'

function formatDate(dateStr: string) {
  return new Date(dateStr + 'T00:00:00Z').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
}

export function BlogFilter({ posts }: { posts: BlogPost[] }) {
  const [filters, setFilters] = useQueryStates(
    {
      category: parseAsString.withDefault('All'),
      author: parseAsString.withDefault('All'),
    },
    { history: 'replace', shallow: true }
  )

  const filterRef = useScrollReveal({ y: 10, duration: 0.35 })
  const featuredRef = useScrollReveal({ y: 24, duration: 0.6 })
  const gridRef = useScrollReveal({ selector: '.post-card', stagger: 0.07, y: 20, duration: 0.5, filterKey: filters.category + '|' + filters.author })

  const featuredPost = posts.find(p => p.featured)

  const filtered = posts.filter(p => {
    if (p.featured) return false
    const catMatch = filters.category === 'All' || p.category === filters.category
    const authorMatch =
      filters.author === 'All' ||
      (filters.author === 'Sagie Baram' && p.authorType === 'Sagie') ||
      (filters.author === 'Community Members' && p.authorType === 'Community Member')
    return catMatch && authorMatch
  })

  return (
    <>
      {/* Featured post */}
      {featuredPost && (
        <div ref={featuredRef}>
          <Link href={`/blog/${featuredPost.slug}`} className="block mb-14 group">
            <div className="grid md:grid-cols-2 gap-10 border border-border-default p-8 hover:bg-background-card-featured transition-colors duration-200">
              <div className="bg-background-card border border-border-subtle aspect-16/10 flex items-center justify-center">
                <span className="font-body text-foreground-dim text-label tracking-label uppercase">Cover Image</span>
              </div>
              <div className="flex flex-col justify-center py-2">
                <p className="font-body text-caption tracking-spaced mb-4">
                  <span className="text-foreground-muted uppercase">{featuredPost.category}</span>
                  <span className="text-foreground-dim mx-2">·</span>
                  <span className="text-foreground-muted">{featuredPost.publishDate ? formatDate(featuredPost.publishDate) : ''}</span>
                  <span className="text-foreground-dim mx-2">·</span>
                  <span className="text-foreground-muted">{featuredPost.readTime} min read</span>
                </p>
                <h3 className="font-display uppercase text-founder leading-none text-foreground-secondary group-hover:text-silver transition-colors duration-150 mb-4">
                  {featuredPost.title}
                </h3>
                <p className="font-body text-foreground-muted font-light text-body leading-[1.75] mb-6">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-body text-foreground-dim text-caption tracking-label uppercase">{featuredPost.author}</span>
                  <span className="font-body text-foreground-secondary text-caption tracking-mid group-hover:translate-x-0.5 transition-transform duration-150">Read →</span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      )}

      <hr className="border-border-default mb-10" />

      {/* Filters */}
      <div ref={filterRef} className="mb-14 grid gap-4" style={{ gridTemplateColumns: 'auto 1fr' }}>
        <span className="font-body uppercase text-foreground-dim text-label tracking-label pt-1.5">Category</span>
        <div className="flex items-center gap-2 flex-wrap" role="group" aria-label="Filter posts by category">
          {BLOG_CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setFilters({ category: cat })}
              aria-pressed={filters.category === cat}
              className={`font-body uppercase text-label tracking-label px-3 py-1.5 border transition-all duration-150 ${filters.category === cat
                  ? 'text-silver border-border-strong'
                  : 'text-foreground-muted border-transparent hover:text-foreground-secondary'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <span className="font-body uppercase text-foreground-dim text-label tracking-label pt-1.5">Author</span>
        <div className="flex items-center gap-2 flex-wrap" role="group" aria-label="Filter posts by author">
          {BLOG_AUTHORS.map(author => {
            const isActive = filters.author === author
            const isCommunity = author === 'Community Members'
            return (
              <button
                key={author}
                onClick={() => setFilters({ author: author })}
                aria-pressed={isActive}
                className={`font-body uppercase text-label tracking-label px-3 py-1.5 border transition-all duration-150 ${isActive
                    ? isCommunity
                      ? 'text-eco border-eco/30'
                      : 'text-silver border-border-strong'
                    : 'text-foreground-muted border-transparent hover:text-foreground-secondary'
                  }`}
              >
                {author}
              </button>
            )
          })}
        </div>
      </div>

      {/* Post grid */}
      {filtered.length === 0 ? (
        <p className="font-body text-foreground-muted text-center py-16">No posts match this filter.</p>
      ) : (
        <div ref={gridRef} className="grid md:grid-cols-3 gap-px">
          {filtered.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </>
  )
}

function PostCard({ post }: { post: BlogPost }) {
  const isCommunity = post.authorType === 'Community Member'
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`post-card group flex flex-col p-8 border border-border-default hover:bg-background-card-featured transition-colors duration-200 ${isCommunity ? 'border-l-eco/20' : ''
        }`}
    >
      <div className="flex items-center gap-2.5 mb-4">
        <span className="font-body uppercase text-foreground-muted text-label tracking-spaced">{post.category}</span>
        {isCommunity && (
          <span className="font-body uppercase text-label tracking-spaced text-eco border border-eco/20 px-2 py-0.5">
            Community
          </span>
        )}
      </div>

      <h3 className="font-display uppercase text-quote leading-tight text-foreground-secondary group-hover:text-silver transition-colors duration-150 mb-3">
        {post.title}
      </h3>

      <p className="font-body text-foreground-muted font-light text-caption leading-[1.75] mb-6 flex-1 line-clamp-2">
        {post.excerpt}
      </p>

      <div className="mt-auto pt-3 border-t border-border-subtle">
        <p className="font-body text-foreground-dim text-label tracking-label mb-1">
          {post.publishDate ? formatDate(post.publishDate) : ''} · {post.readTime} min
        </p>
        <p className="font-body text-foreground-muted text-label tracking-label mb-3">
          {post.author}
        </p>
        <span className="font-body text-foreground-secondary text-label tracking-mid group-hover:translate-x-0.5 transition-transform duration-150 inline-block">Read →</span>
      </div>
    </Link>
  )
}
