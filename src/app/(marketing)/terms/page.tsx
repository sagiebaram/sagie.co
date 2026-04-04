import type { Metadata } from 'next'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CircuitBackground } from '@/components/ui/CircuitBackground'
import { Section } from '@/components/ui/Section'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { PageHeroAnimation } from '@/components/ui/PageHeroAnimation'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms governing your use of sagie.co and participation in the SAGIE ecosystem.',
}

export default function TermsPage() {
  return (
    <main className="relative">
      <CircuitBackground />
      <Navbar />

      <Section className="pt-28 md:pt-36">
        <PageHeroAnimation>
          <Eyebrow className="page-hero-eyebrow">Legal</Eyebrow>
          <h1 className="font-display uppercase text-hero leading-[0.9] tracking-heading mb-8">
            <span className="page-hero-line block text-foreground">TERMS OF SERVICE</span>
          </h1>
          <p className="page-hero-sub font-body italic text-foreground-muted font-light text-body-lg leading-[1.7] max-w-[480px] mb-14">
            What governs your use of sagie.co and participation in the SAGIE ecosystem.
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
            These terms govern your use of sagie.co and participation in the SAGIE ecosystem. By using the site or submitting any form, you&apos;re agreeing to what&apos;s written here.
          </p>

          <LegalSection title="What SAGIE Is">
            <p>
              SAGIE — Shape a Great Impact Everywhere — is a community ecosystem for founders, operators, and builders. It&apos;s a place to connect, collaborate, and grow alongside people who are building things that matter.
            </p>
            <p className="mt-4">
              SAGIE operates across three pillars: <strong className="text-foreground">SAGIE ECO</strong> — the community arm, <strong className="text-foreground">SAGIE Solutions</strong> — a for-profit operated by the community, and <strong className="text-foreground">SAGIE Ventures</strong> — venture/startup portfolio of impact/innovation projects or companies SAGIE supports.
            </p>
            <p className="mt-4">
              SAGIE is not a law firm, financial advisor, or investment platform. Nothing on this site — or communicated through it — constitutes legal, financial, tax, or investment advice. The service providers of SAGIE Solutions are vetted but independently and legally responsible for their business. We share perspectives, frameworks, and connections. What you do with them is your call.
            </p>
          </LegalSection>

          <LegalSection title="Acceptance of Terms">
            <p>
              By accessing sagie.co or submitting a form on it, you agree to these terms. If you don&apos;t agree, please don&apos;t use the site.
            </p>
            <p className="mt-4">
              You must be at least 18 years old to use this site or participate in SAGIE programs.
            </p>
          </LegalSection>

          <LegalSection title="Membership and Community Access">
            <p>
              Membership tiers and community access within SAGIE are earned, not purchased. Participation, contribution, and alignment with the ecosystem&apos;s values are what determine how you move through the community.
            </p>
            <p className="mt-4">
              SAGIE reserves the right to accept, decline, or revoke community access at its sole discretion — particularly if someone&apos;s conduct is harmful, dishonest, or counter to the community&apos;s culture.
            </p>
          </LegalSection>

          <LegalSection title="What You Submit">
            <p>
              When you fill out a form or send us information through the site, you&apos;re giving us permission to use that information to follow up, onboard you into the right part of the ecosystem, and communicate with you going forward.
            </p>
            <p className="mt-4">
              You represent that anything you submit is accurate and that you have the right to share it. Don&apos;t submit confidential information belonging to others without their consent.
            </p>
          </LegalSection>

          <LegalSection title="Intellectual Property">
            <p>
              All original content on sagie.co — copy, structure, frameworks, branding — belongs to SAGIE / Sagie Baram unless otherwise stated. You&apos;re welcome to share and reference our work with proper attribution. Reproducing it wholesale, repackaging it, or passing it off as your own isn&apos;t okay.
            </p>
            <p className="mt-4">
              If you submit content to us (a bio, a project description, application materials, etc.), you retain ownership of it. You&apos;re granting us a limited license to use it for ecosystem-related purposes — matching you with opportunities, featuring you in community contexts, that kind of thing. We won&apos;t use your content for commercial purposes without asking.
            </p>
          </LegalSection>

          <LegalSection title="Limitation of Liability">
            <p>
              SAGIE and Sagie Baram are not liable for any direct, indirect, incidental, or consequential damages arising from your use of this site, participation in the ecosystem, or reliance on anything communicated through SAGIE channels.
            </p>
            <p className="mt-4">
              The site and its services are provided as-is. We do our best to keep things accurate and functional, but we make no guarantees.
            </p>
          </LegalSection>

          <LegalSection title="Third-Party Links and Connections">
            <p>
              SAGIE may connect you with other people, organizations, or resources. We don&apos;t control third parties and aren&apos;t responsible for their actions, content, or outcomes. Any relationship you form through SAGIE is yours to manage.
            </p>
          </LegalSection>

          <LegalSection title="Termination">
            <p>
              We can suspend or terminate your access to any part of the SAGIE ecosystem at any time, with or without notice, if we believe you&apos;ve violated these terms or acted in a way that&apos;s harmful to the community.
            </p>
            <p className="mt-4">
              You can also stop participating at any time. Just email us at{' '}
              <a href="mailto:contact@sagie.co" className="text-silver hover:text-foreground transition-colors">contact@sagie.co</a>
              {' '}if you&apos;d like us to remove your data as well.
            </p>
          </LegalSection>

          <LegalSection title="Governing Law">
            <p>
              These terms are governed by the laws of the State of Florida, USA. Any disputes will be handled in the courts of Miami-Dade County, Florida, unless otherwise agreed.
            </p>
          </LegalSection>

          <LegalSection title="Changes to These Terms">
            <p>
              We&apos;ll update these terms as the ecosystem evolves. The date at the top reflects the latest version. If you keep using the site after changes are posted, that counts as acceptance. For material changes, we&apos;ll do our best to give you a heads-up.
            </p>
          </LegalSection>

          <LegalSection title="Questions?">
            <p>
              Email us at{' '}
              <a href="mailto:contact@sagie.co" className="text-silver hover:text-foreground transition-colors">contact@sagie.co</a>.
              {' '}We&apos;re straightforward people. If something here is unclear, just ask.
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
