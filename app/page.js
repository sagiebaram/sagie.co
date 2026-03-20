'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

// ─────────────────────────────────────────────────────────────────────────────
// NAV
// ─────────────────────────────────────────────────────────────────────────────
function NavBar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-black/95 backdrop-blur-md border-b border-white/[0.06]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-5 flex items-center justify-between">
        <div className="relative w-24 h-8">
          <Image
            src="/sagie-logo-white.png"
            alt="SAGIE"
            fill
            className="object-contain object-left"
            priority
          />
        </div>

        <a
          href="#apply"
          className="font-dm text-xs font-medium tracking-[0.2em] uppercase text-white border border-white/25 px-5 py-2.5 hover:bg-white hover:text-black transition-all duration-200"
        >
          Apply →
        </a>
      </div>
    </nav>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// HERO
// ─────────────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden px-6 md:px-12 lg:px-20 pt-28 pb-24">
      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(192,192,192,0.06) 0%, transparent 70%)',
        }}
      />
      {/* Fine grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      <div className="relative max-w-7xl mx-auto w-full">
        {/* Eyebrow */}
        <div className="flex items-center gap-4 mb-10">
          <div className="w-10 h-px bg-silver/50" />
          <span className="font-dm text-[#C0C0C0] text-[11px] tracking-[0.3em] uppercase">
            A curated ecosystem for operators, founders &amp; builders
          </span>
        </div>

        {/* Headline */}
        <h1
          className="font-bebas uppercase leading-[0.9] tracking-[0.01em] mb-10"
          style={{ fontSize: 'clamp(3.2rem, 9.5vw, 8.5rem)' }}
        >
          Where Founders
          <br />
          and Operators
          <br />
          Come to Build
          <br />
          <span className="text-[#C0C0C0]">Cross-Cultural Impact</span>
        </h1>

        {/* Three-pillar sub-headline */}
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-0 mb-14 max-w-2xl">
          <div className="sm:pr-10 sm:border-r sm:border-white/10">
            <p className="font-dm text-[10px] text-[#757575] tracking-[0.25em] uppercase mb-1">
              Community
            </p>
            <p className="font-dm text-[#C0C0C0] text-sm font-medium">SAGIE ECO</p>
          </div>
          <div className="sm:px-10 sm:border-r sm:border-white/10">
            <p className="font-dm text-[10px] text-[#757575] tracking-[0.25em] uppercase mb-1">
              Consulting
            </p>
            <p className="font-dm text-[#C0C0C0] text-sm font-medium">SAGIE SOLUTIONS</p>
          </div>
          <div className="sm:pl-10">
            <p className="font-dm text-[10px] text-[#757575] tracking-[0.25em] uppercase mb-1">
              Capital
            </p>
            <p className="font-dm text-[#C0C0C0] text-sm font-medium">SAGIE VENTURES</p>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href="#apply"
            className="inline-flex items-center justify-center bg-white text-black font-dm font-semibold text-sm tracking-wide px-8 py-4 hover:bg-[#C0C0C0] transition-colors duration-200"
          >
            Apply for Membership →
          </a>
          <a
            href="#apply"
            className="inline-flex items-center justify-center border border-white/25 text-white font-dm font-medium text-sm tracking-wide px-8 py-4 hover:border-white/60 hover:bg-white/[0.04] transition-all duration-200"
          >
            Lead a Chapter →
          </a>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2.5 opacity-30">
        <span className="font-dm text-[10px] tracking-[0.25em] uppercase text-white">Scroll</span>
        <div className="w-px h-7 bg-white" />
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// THREE PILLARS
// ─────────────────────────────────────────────────────────────────────────────
const PILLARS = [
  {
    name: 'SAGIE ECO',
    label: 'Community',
    color: '#2E7D32',
    description:
      'A global network of operators and founders sharing insight, opportunity, and momentum across cultures and borders.',
    points: ['Chapter meetups worldwide', 'Curated peer introductions', 'Private community platform'],
  },
  {
    name: 'SAGIE SOLUTIONS',
    label: 'Consulting',
    color: '#1565C0',
    description:
      'Strategic consulting for businesses entering new markets, scaling operations, and building cross-cultural teams that actually perform.',
    points: ['Market entry strategy', 'Cross-cultural operations', 'Leadership development'],
  },
  {
    name: 'SAGIE VENTURES',
    label: 'Capital',
    color: '#757575',
    description:
      'Early-stage investment backing founders with the vision and grit to build something that transcends borders and lasts.',
    points: ['Pre-seed & seed backing', 'Founder-first approach', 'Portfolio network access'],
  },
]

function ThreePillars() {
  return (
    <section className="px-6 md:px-12 lg:px-20 py-28 border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-16">
          <div>
            <p className="font-dm text-[11px] tracking-[0.3em] uppercase text-[#757575] mb-4">
              The Ecosystem
            </p>
            <h2
              className="font-bebas uppercase tracking-[0.02em]"
              style={{ fontSize: 'clamp(2.4rem,5vw,3.8rem)' }}
            >
              Three Pillars.
              <br className="sm:hidden" />{' '}
              <span className="text-[#C0C0C0]">One Direction.</span>
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PILLARS.map((pillar) => (
            <div
              key={pillar.name}
              className="relative bg-[#0a0a0a] p-8 border border-white/[0.05] hover:border-white/[0.1] transition-colors duration-300 group overflow-hidden"
            >
              {/* Top color bar */}
              <div
                className="absolute top-0 left-0 right-0 h-[2px]"
                style={{ backgroundColor: pillar.color }}
              />

              <p
                className="font-dm text-[10px] tracking-[0.28em] uppercase mb-5 mt-3"
                style={{ color: pillar.color }}
              >
                {pillar.label}
              </p>

              <h3 className="font-bebas text-[1.8rem] tracking-[0.04em] text-white mb-4 leading-none">
                {pillar.name}
              </h3>

              <p className="font-dm text-[#C0C0C0] text-sm leading-relaxed mb-7">
                {pillar.description}
              </p>

              <ul className="space-y-2.5">
                {pillar.points.map((point) => (
                  <li key={point} className="flex items-center gap-3 font-dm text-[12px] text-[#757575]">
                    <div
                      className="w-1 h-1 rounded-full flex-shrink-0"
                      style={{ backgroundColor: pillar.color }}
                    />
                    {point}
                  </li>
                ))}
              </ul>

              {/* Subtle glow on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: `radial-gradient(ellipse 60% 40% at 50% 100%, ${pillar.color}0d 0%, transparent 70%)`,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MANIFESTO
// ─────────────────────────────────────────────────────────────────────────────
function Manifesto() {
  return (
    <section className="px-6 md:px-12 lg:px-20 py-32 border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto">
        <p className="font-dm text-[11px] tracking-[0.3em] uppercase text-[#757575] mb-14">
          Our Manifesto
        </p>

        <blockquote
          className="font-bebas uppercase leading-[0.93] tracking-[0.01em]"
          style={{ fontSize: 'clamp(2.4rem,5.8vw,5.2rem)' }}
        >
          <span className="text-white">We exist because </span>
          <span className="text-[#C0C0C0]">opportunity is</span>
          <br />
          <span className="text-[#C0C0C0]">unevenly distributed.</span>
          <br className="hidden sm:block" />
          <span className="text-white"> The right people, ideas,</span>
          <br />
          <span className="text-white">and resources </span>
          <span className="text-[#C0C0C0]">rarely find each other</span>
          <br />
          <span className="text-[#C0C0C0]">at the right time.</span>
          <br />
          <span className="text-white">SAGIE </span>
          <span
            className="inline-block"
            style={{
              WebkitTextStroke: '1px #C0C0C0',
              color: 'transparent',
            }}
          >
            is the fix.
          </span>
        </blockquote>

        <div className="mt-16 w-full h-px bg-white/[0.06]" />
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// WHO IT'S FOR
// ─────────────────────────────────────────────────────────────────────────────
const AUDIENCE = [
  {
    num: '01',
    title: 'Founders',
    description:
      'Building a company and need the right network, insight, and capital to scale it across borders.',
  },
  {
    num: '02',
    title: 'Investors',
    description:
      'Deploying capital and looking for proprietary deal flow, co-investors, and real ecosystem access.',
  },
  {
    num: '03',
    title: 'Operators',
    description:
      'Running the day-to-day of fast-growing companies and need peers who have been in the exact same room.',
  },
  {
    num: '04',
    title: 'Ecosystem Builders',
    description:
      'Building the infrastructure — accelerators, institutions, government — that makes it all possible.',
  },
]

function WhoItsFor() {
  return (
    <section className="px-6 md:px-12 lg:px-20 py-28 bg-[#050505] border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <p className="font-dm text-[11px] tracking-[0.3em] uppercase text-[#757575] mb-4">
            Built For
          </p>
          <h2
            className="font-bebas uppercase tracking-[0.02em]"
            style={{ fontSize: 'clamp(2.4rem,5vw,3.8rem)' }}
          >
            Who It&apos;s For
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/[0.05]">
          {AUDIENCE.map((item) => (
            <div
              key={item.num}
              className="relative bg-[#050505] p-10 group hover:bg-[#0a0a0a] transition-colors duration-300 overflow-hidden"
            >
              {/* Large background number */}
              <span className="absolute top-4 right-6 font-bebas text-[6rem] leading-none text-white/[0.04] group-hover:text-white/[0.06] transition-colors duration-300 select-none">
                {item.num}
              </span>

              <p className="font-dm text-[11px] tracking-[0.25em] uppercase text-[#757575] mb-4">
                {item.num}
              </p>
              <h3
                className="font-bebas uppercase tracking-[0.04em] text-white mb-3"
                style={{ fontSize: 'clamp(1.8rem,3vw,2.4rem)' }}
              >
                {item.title}
              </h3>
              <p className="font-dm text-[#757575] text-sm leading-relaxed max-w-xs">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MEMBERSHIP TIERS
// ─────────────────────────────────────────────────────────────────────────────
const TIERS = [
  {
    name: 'Explorer',
    tagline: 'Start your journey',
    featured: false,
    benefits: [
      'Community forum access',
      'Monthly SAGIE newsletter',
      'Virtual event invitations',
      'Digital membership card',
      'Public member directory',
    ],
  },
  {
    name: 'Builder',
    tagline: 'For the serious operator',
    featured: true,
    benefits: [
      'Everything in Explorer',
      'Chapter meetup access',
      'Curated introductions',
      'Quarterly strategy calls',
      'Private member directory',
      'Priority event access',
      'SAGIE Solutions discount',
    ],
  },
  {
    name: 'Shaper',
    tagline: 'Lead the movement',
    featured: false,
    benefits: [
      'Everything in Builder',
      'Direct founder access',
      'Investment visibility',
      'Advisory consideration',
      'Chapter leadership track',
      'Dedicated concierge',
    ],
  },
]

function MembershipTiers() {
  return (
    <section
      id="apply"
      className="px-6 md:px-12 lg:px-20 py-28 border-t border-white/[0.06]"
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <p className="font-dm text-[11px] tracking-[0.3em] uppercase text-[#757575] mb-4">
            Membership
          </p>
          <h2
            className="font-bebas uppercase tracking-[0.02em]"
            style={{ fontSize: 'clamp(2.4rem,5vw,3.8rem)' }}
          >
            Choose Your Level
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`relative flex flex-col ${
                tier.featured
                  ? 'bg-white text-black md:-mt-6 md:-mb-6 md:py-14 py-10 px-8'
                  : 'bg-[#0a0a0a] border border-white/[0.06] p-8'
              }`}
            >
              {tier.featured && (
                <div className="absolute top-0 left-8 -translate-y-1/2">
                  <span className="bg-black text-white font-dm text-[10px] tracking-[0.2em] uppercase px-3 py-1 inline-block">
                    Most Applied
                  </span>
                </div>
              )}

              <div className="mb-8">
                <p
                  className={`font-dm text-[10px] tracking-[0.25em] uppercase mb-2 ${
                    tier.featured ? 'text-black/40' : 'text-[#757575]'
                  }`}
                >
                  {tier.tagline}
                </p>
                <h3
                  className={`font-bebas tracking-[0.04em] leading-none ${
                    tier.featured ? 'text-black' : 'text-white'
                  }`}
                  style={{ fontSize: 'clamp(2.2rem,4vw,2.8rem)' }}
                >
                  {tier.name}
                </h3>
              </div>

              <ul className="space-y-3 mb-10 flex-1">
                {tier.benefits.map((benefit, i) => (
                  <li
                    key={benefit}
                    className={`flex items-start gap-3 font-dm text-[13px] ${
                      tier.featured ? 'text-black/80' : 'text-[#C0C0C0]'
                    }`}
                  >
                    <span
                      className={`mt-0.5 text-xs flex-shrink-0 ${
                        tier.featured ? 'text-black/40' : 'text-[#757575]'
                      }`}
                    >
                      {i === 0 && tier.name !== 'Explorer' ? '↳' : '–'}
                    </span>
                    {benefit}
                  </li>
                ))}
              </ul>

              <a
                href="#"
                className={`inline-flex items-center justify-center font-dm font-semibold text-[13px] tracking-wide py-4 transition-all duration-200 ${
                  tier.featured
                    ? 'bg-black text-white hover:bg-[#111]'
                    : 'border border-white/20 text-white hover:border-white/50 hover:bg-white/[0.04]'
                }`}
              >
                Apply for {tier.name} →
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// FOUNDER SECTION
// ─────────────────────────────────────────────────────────────────────────────
function FounderSection() {
  return (
    <section className="px-6 md:px-12 lg:px-20 py-28 bg-[#050505] border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Portrait */}
          <div className="order-2 md:order-1">
            <div className="relative aspect-[4/5] max-w-sm mx-auto md:mx-0 overflow-hidden">
              <Image
                src="/founder-portrait.png"
                alt="Sagie Baram, Founder of SAGIE"
                fill
                className="object-cover object-top"
                sizes="(max-width: 768px) 80vw, 40vw"
              />
              {/* Subtle vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/60 via-transparent to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#050505]/20" />
            </div>
          </div>

          {/* Text */}
          <div className="order-1 md:order-2">
            <p className="font-dm text-[11px] tracking-[0.3em] uppercase text-[#757575] mb-10">
              The Founder
            </p>

            <h2
              className="font-bebas uppercase tracking-[0.02em] leading-[0.9] text-white mb-3"
              style={{ fontSize: 'clamp(3rem,6vw,5rem)' }}
            >
              Sagie Baram
            </h2>

            <p
              className="font-bebas tracking-[0.1em] uppercase text-[#C0C0C0] mb-10"
              style={{ fontSize: 'clamp(1.2rem,2vw,1.6rem)' }}
            >
              Founder
            </p>

            <p className="font-dm text-[#C0C0C0] text-[15px] leading-relaxed mb-10 max-w-sm">
              Connector, operator, and builder — Sagie Baram built SAGIE to solve the problem he
              kept running into: the right people and ideas rarely find each other at the right
              time. SAGIE is the fix.
            </p>

            <div className="flex items-center gap-4">
              <div className="w-8 h-px bg-white/15" />
              <a
                href="https://instagram.com/sagie.co"
                target="_blank"
                rel="noopener noreferrer"
                className="font-dm text-[11px] tracking-[0.2em] uppercase text-[#757575] hover:text-white transition-colors duration-200"
              >
                @sagie.co
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// FINAL CTA
// ─────────────────────────────────────────────────────────────────────────────
function FinalCTA() {
  return (
    <section className="px-6 md:px-12 lg:px-20 py-36 border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto text-center">
        <p className="font-dm text-[11px] tracking-[0.3em] uppercase text-[#757575] mb-8">
          Ready?
        </p>

        <h2
          className="font-bebas uppercase leading-[0.9] tracking-[0.01em] max-w-4xl mx-auto mb-14"
          style={{ fontSize: 'clamp(3rem,8.5vw,7.5rem)' }}
        >
          Build Something
          <br />
          <span
            style={{
              WebkitTextStroke: '1px #C0C0C0',
              color: 'transparent',
            }}
          >
            That Matters
          </span>
        </h2>

        <a
          href="#"
          className="inline-flex items-center justify-center bg-white text-black font-dm font-semibold text-sm tracking-wide px-10 py-5 hover:bg-[#C0C0C0] transition-colors duration-200 mb-6"
        >
          Apply for Membership →
        </a>

        <p className="font-dm text-[12px] text-[#757575] tracking-wide block">
          Applications reviewed on the 1st of each month
        </p>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────────────────────────────────────
function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="px-6 md:px-12 lg:px-20 pt-14 pb-10 border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-10 mb-14">
          {/* Logo */}
          <div className="relative w-24 h-8 flex-shrink-0">
            <Image
              src="/sagie-logo-white.png"
              alt="SAGIE"
              fill
              className="object-contain object-left"
            />
          </div>

          {/* Tagline — SAGIE acronym spelled out */}
          <p
            className="font-bebas tracking-[0.18em] text-[#757575] uppercase text-center"
            style={{ fontSize: 'clamp(1rem,2vw,1.25rem)' }}
          >
            <span className="text-[#C0C0C0]">S</span>hape a{' '}
            <span className="text-[#C0C0C0]">G</span>reat{' '}
            <span className="text-[#C0C0C0]">I</span>mpact{' '}
            <span className="text-[#C0C0C0]">E</span>verywhere
          </p>

          {/* Instagram */}
          <a
            href="https://instagram.com/sagie.co"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 font-dm text-[11px] tracking-[0.2em] uppercase text-[#757575] hover:text-white transition-colors duration-200"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
            </svg>
            @sagie.co
          </a>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-8 border-t border-white/[0.05]">
          <p className="font-dm text-[11px] text-[#757575]/60">
            &copy; {year} SAGIE. All rights reserved.
          </p>
          <p className="font-dm text-[11px] text-[#757575]/40">sagie.co</p>
        </div>
      </div>
    </footer>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <>
      <NavBar />
      <main>
        <Hero />
        <ThreePillars />
        <Manifesto />
        <WhoItsFor />
        <MembershipTiers />
        <FounderSection />
        <FinalCTA />
      </main>
      <Footer />
    </>
  )
}
