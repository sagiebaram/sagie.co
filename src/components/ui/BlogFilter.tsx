'use client'

import { useState } from 'react'
import { BLOG_CATEGORIES, BLOG_AUTHORS, MOCK_POSTS } from '@/constants/blog'
import type { BlogPost } from '@/constants/blog'
import Link from 'next/link'

function formatDate(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function BlogFilter() {
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const [activeAuthor, setActiveAuthor] = useState<string>('All')

  const featuredPost = MOCK_POSTS.find(p => p.featured)

  const filtered = MOCK_POSTS.filter(p => {
    if (p.featured) return false
    const catMatch = activeCategory === 'All' || p.category === activeCategory
    const authorMatch =
      activeAuthor === 'All' ||
      (activeAuthor === 'Sagie Baram' && p.authorType === 'Sagie') ||
      (activeAuthor === 'Community Members' && p.authorType === 'Community Member')
    return catMatch && authorMatch
  })

  return (
    <>
      {/* Filters */}
      <div className="mb-10">
        <div className="flex items-center gap-3 flex-wrap mb-4">
          <span className="font-body uppercase text-foreground-ghost text-label tracking-label mr-1">Category</span>
          {BLOG_CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="font-body uppercase text-label tracking-label px-3 py-1.5 transition-all duration-150"
              style={{
                color: activeCategory === cat ? 'var(--silver)' : 'var(--text-muted)',
                border: activeCategory === cat ? '1px solid var(--silver)' : '1px solid transparent',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <span className="font-body uppercase text-foreground-ghost text-label tracking-label mr-1">Author</span>
          {BLOG_AUTHORS.map(author => {
            const isActive = activeAuthor === author
            const isCommunity = author === 'Community Members'
            return (
              <button
                key={author}
                onClick={() => setActiveAuthor(author)}
                className="font-body uppercase text-label tracking-label px-3 py-1.5 transition-all duration-150"
                style={{
                  color: isActive
                    ? isCommunity ? '#2a4a2a' : 'var(--silver)'
                    : 'var(--text-muted)',
                  border: isActive
                    ? isCommunity ? '1px solid #1a3a1a' : '1px solid var(--silver)'
                    : '1px solid transparent',
                }}
              >
                {author}
              </button>
            )
          })}
        </div>
      </div>

      <hr className="border-border-subtle mb-10" />

      {/* Featured post */}
      {featuredPost && (
        <Link href={`/blog/${featuredPost.slug}`} className="block mb-14 group">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-background-card border border-border-subtle aspect-[16/10] flex items-center justify-center">
              <span className="font-body text-foreground-ghost text-label tracking-label uppercase">Cover Image</span>
            </div>
            <div className="flex flex-col justify-center">
              <p className="font-body text-label tracking-label mb-3">
                <span className="text-silver uppercase">{featuredPost.category}</span>
                <span className="text-foreground-ghost mx-2">·</span>
                <span className="text-foreground-muted">{formatDate(featuredPost.publishDate)}</span>
                <span className="text-foreground-ghost mx-2">·</span>
                <span className="text-foreground-muted">{featuredPost.readTime} min read</span>
              </p>
              <h3 className="font-display uppercase text-[26px] leading-none text-silver group-hover:text-foreground transition-colors duration-150 mb-3">
                {featuredPost.title}
              </h3>
              <p className="font-body text-foreground-muted font-light text-[13px] leading-[1.7] mb-4">
                {featuredPost.excerpt}
              </p>
              <div className="flex items-center justify-between">
                <span className="font-body text-foreground-ghost text-label tracking-label uppercase">{featuredPost.author}</span>
                <span className="font-body text-silver text-label tracking-label group-hover:translate-x-0.5 transition-transform duration-150">Read →</span>
              </div>
            </div>
          </div>
        </Link>
      )}

      {/* Post grid */}
      {filtered.length === 0 ? (
        <p className="font-body text-foreground-muted text-center py-16">No posts match this filter.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
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
      className="group flex flex-col p-5 bg-background-card border border-border-subtle hover:border-border-default transition-all duration-150"
      style={isCommunity ? { borderLeft: '1px solid #1a2a1a' } : undefined}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="font-body uppercase text-foreground-ghost text-[10px] tracking-label">{post.category}</span>
        {isCommunity && (
          <span className="font-body uppercase text-[10px] tracking-label px-1.5 py-0.5" style={{ color: '#2a4a2a', border: '1px solid #1a3a1a' }}>
            Community
          </span>
        )}
      </div>

      <h3 className="font-display uppercase text-[17px] leading-tight text-silver group-hover:text-foreground transition-colors duration-150 mb-2">
        {post.title}
      </h3>

      <p className="font-body text-foreground-muted font-light text-[10px] leading-[1.7] mb-4 flex-1">
        {post.excerpt}
      </p>

      <div className="flex items-center justify-between">
        <div className="font-body text-foreground-ghost text-[10px] tracking-label">
          <span>{formatDate(post.publishDate)}</span>
          <span className="mx-1.5">·</span>
          <span>{post.readTime} min</span>
          <span className="mx-1.5">·</span>
          <span>{post.author}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-foreground-ghost text-[10px]">↗</span>
          <span className="font-body text-silver text-[10px] tracking-label group-hover:translate-x-0.5 transition-transform duration-150">Read →</span>
        </div>
      </div>
    </Link>
  )
}
