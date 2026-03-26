import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CircuitBackground } from '@/components/ui/CircuitBackground'
import { Section } from '@/components/ui/Section'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { BlogFilter } from '@/components/ui/BlogFilter'
import { PageHeroAnimation } from '@/components/ui/PageHeroAnimation'
import { getAllPosts, type BlogPost } from '@/lib/blog'

export const revalidate = 3600

export default async function BlogPage() {
  let posts: BlogPost[] = []

  try {
    posts = await getAllPosts()
  } catch (e) {
    console.error('Failed to fetch blog posts:', e)
  }

  return (
    <main className="relative">
      <CircuitBackground />
      <Navbar />

      <Section className="pt-28 md:pt-36">
        <PageHeroAnimation>
          <Eyebrow>The Blog</Eyebrow>
          <h1 className="font-display uppercase text-hero leading-[0.9] tracking-heading mb-8">
            <span className="page-hero-line block text-foreground-dim">IDEAS FROM</span>
            <span className="page-hero-line block text-foreground-secondary">THE ECOSYSTEM.</span>
          </h1>
          <p className="page-hero-sub font-body italic text-foreground-muted font-light text-body-lg leading-[1.7] max-w-[380px] mb-14">
            Personal writing, community spotlights, event recaps and thought leadership from SAGIE.
          </p>
        </PageHeroAnimation>

        <BlogFilter posts={posts} />
      </Section>

      <Footer />
    </main>
  )
}
