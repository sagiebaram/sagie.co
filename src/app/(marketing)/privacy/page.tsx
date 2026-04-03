import type { Metadata } from 'next'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CircuitBackground } from '@/components/ui/CircuitBackground'
import { Section } from '@/components/ui/Section'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { PageHeroAnimation } from '@/components/ui/PageHeroAnimation'

export const metadata: Metadata = {
  title: 'Privacy Policy — SAGIE',
  description: 'How SAGIE handles your data. No legalese, no fluff — just what you need to know.',
}

export default function PrivacyPage() {
  return (
    <main className="relative">
      <CircuitBackground />
      <Navbar />

      <Section className="pt-28 md:pt-36">
        <PageHeroAnimation>
          <Eyebrow className="page-hero-eyebrow">Legal</Eyebrow>
          <h1 className="font-display uppercase text-hero leading-[0.9] tracking-heading mb-8">
            <span className="page-hero-line block text-foreground">PRIVACY POLICY</span>
          </h1>
          <p className="page-hero-sub font-body italic text-foreground-muted font-light text-body-lg leading-[1.7] max-w-[480px] mb-14">
            What we collect, how we handle it, and what rights you have.
          </p>
        </PageHeroAnimation>

        <div className="legal-content font-body text-foreground-secondary text-body leading-[1.8] space-y-12">
          <div className="text-foreground-muted text-caption">
            <p><strong className="text-foreground-secondary">SAGIE</strong> &middot; sagie.co</p>
            <p>Operated by Sagie Baram &middot; Miami, FL, USA</p>
            <p>Contact: <a href="mailto:contact@sagie.co" className="text-silver hover:text-foreground transition-colors">contact@sagie.co</a></p>
            <p>Last updated: April 2, 2026</p>
          </div>

          <p>
            This policy explains what data we collect when you use sagie.co, how we handle it, and what rights you have. No legalese. No fluff. Just what you need to know.
          </p>

          <LegalSection title="What We Collect">
            <p>
              When you fill out a form on sagie.co — whether to join the community, get in touch, or apply for something — we collect the information you provide directly:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Full name</li>
              <li>Email address</li>
              <li>City</li>
              <li>Role or title</li>
              <li>LinkedIn URL</li>
              <li>Company or organization</li>
              <li>Any free-text you write in open fields</li>
            </ul>
            <p className="mt-4">
              We don&apos;t collect anything passively beyond what&apos;s described in the <strong className="text-foreground">How We Process Errors</strong> section below. No tracking pixels, no behavioral profiling, no third-party analytics — at least not yet. If that changes, this policy will be updated and you&apos;ll know about it.
            </p>
          </LegalSection>

          <LegalSection title="How We Store Your Data">
            <p>
              Form submissions are stored in <strong className="text-foreground">Notion</strong>, which serves as our operational database. Notion is a third-party service operated by Notion Labs, Inc. Data stored there is subject to{' '}
              <a href="https://www.notion.so/privacy" target="_blank" rel="noopener noreferrer" className="text-silver hover:text-foreground transition-colors underline">Notion&apos;s privacy policy</a>{' '}
              in addition to ours.
            </p>
            <p className="mt-4">
              We access this data to follow up with you, manage community membership, and keep our operations running. We don&apos;t share it with anyone else for marketing or commercial purposes.
            </p>
          </LegalSection>

          <LegalSection title="Who Processes Your Data">
            <p>We use a small, intentional set of tools. Here&apos;s what each one touches:</p>

            <div className="mt-6 space-y-6">
              <div>
                <p className="text-foreground font-medium">Notion</p>
                <p className="mt-1">Stores form submissions. This is where your data lives.</p>
              </div>
              <div>
                <p className="text-foreground font-medium">Resend</p>
                <p className="mt-1">
                  Handles transactional emails (like confirmations or follow-ups after you submit a form). Resend processes your email address to deliver messages on our behalf. See{' '}
                  <a href="https://resend.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-silver hover:text-foreground transition-colors underline">Resend&apos;s privacy policy</a>.
                </p>
              </div>
              <div>
                <p className="text-foreground font-medium">Sentry</p>
                <p className="mt-1">
                  Monitors for technical errors on the site. If something breaks, Sentry logs diagnostic information to help us fix it. This may include limited metadata about the request that caused the error (e.g., browser type, page URL). It does not capture your form content intentionally. See{' '}
                  <a href="https://sentry.io/privacy/" target="_blank" rel="noopener noreferrer" className="text-silver hover:text-foreground transition-colors underline">Sentry&apos;s privacy policy</a>.
                </p>
              </div>
              <div>
                <p className="text-foreground font-medium">Vercel</p>
                <p className="mt-1">
                  Hosts the sagie.co website. Vercel is US-based and may process standard web traffic data (IP addresses, request logs) as part of serving the site. See{' '}
                  <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-silver hover:text-foreground transition-colors underline">Vercel&apos;s privacy policy</a>.
                </p>
              </div>
            </div>
          </LegalSection>

          <LegalSection title="What We Don't Do">
            <ul className="list-disc pl-6 space-y-2">
              <li>We don&apos;t sell your data. Ever.</li>
              <li>We don&apos;t share your information with advertisers.</li>
              <li>We don&apos;t use your data to build profiles for third-party targeting.</li>
              <li>We only use essential cookies required for the site to function. We do not use tracking cookies. Our analytics (Vercel Analytics) are cookie-free and privacy-friendly.</li>
            </ul>
          </LegalSection>

          <LegalSection title="Data Retention">
            <p>
              We keep your data for as long as it&apos;s relevant to our relationship with you — typically as long as you&apos;re engaged with the SAGIE community or ecosystem. If you ask us to delete your data, we&apos;ll do it promptly (see Your Rights below).
            </p>
          </LegalSection>

          <LegalSection title="Your Rights">
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li><strong className="text-foreground">Access</strong> — Ask us what data we hold about you.</li>
              <li><strong className="text-foreground">Correct</strong> — Ask us to fix inaccurate information.</li>
              <li><strong className="text-foreground">Delete</strong> — Ask us to remove your data entirely.</li>
              <li><strong className="text-foreground">Opt out</strong> — Stop receiving emails from us at any time.</li>
            </ul>
            <p className="mt-4">
              To exercise any of these, email us at{' '}
              <a href="mailto:contact@sagie.co" className="text-silver hover:text-foreground transition-colors">contact@sagie.co</a>.
              {' '}We&apos;ll respond within a reasonable timeframe — no bureaucratic runaround.
            </p>
          </LegalSection>

          <LegalSection title="Security">
            <p>
              We take reasonable steps to protect the data you share with us. Our tools (Notion, Resend, Sentry, Vercel) all maintain their own security standards. That said, no system is 100% bulletproof, and we can&apos;t guarantee absolute security.
            </p>
          </LegalSection>

          <LegalSection title="Changes to This Policy">
            <p>
              If we make meaningful changes, we&apos;ll update the date at the top of this page. For significant changes — especially anything that affects how we use your data — we&apos;ll make a reasonable effort to let you know directly.
            </p>
          </LegalSection>

          <LegalSection title="Questions?">
            <p>
              Reach us at{' '}
              <a href="mailto:contact@sagie.co" className="text-silver hover:text-foreground transition-colors">contact@sagie.co</a>.
              {' '}We&apos;re real people and we actually respond.
            </p>
          </LegalSection>
        </div>
      </Section>

      <Footer />
    </main>
  )
}

function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-display uppercase text-chapter tracking-heading text-foreground mb-4">
        {title}
      </h2>
      {children}
    </div>
  )
}
