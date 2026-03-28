import {
  Html,
  Body,
  Container,
  Heading,
  Text,
  Img,
  Hr,
  Link,
  Section,
} from '@react-email/components'

interface ConfirmationEmailProps {
  formType: string
}

export function ConfirmationEmail({ formType }: ConfirmationEmailProps) {
  return (
    <Html lang="en">
      <Body
        style={{
          backgroundColor: '#ffffff',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          margin: '0',
          padding: '0',
        }}
      >
        <Container
          style={{
            maxWidth: '560px',
            margin: '40px auto',
            padding: '0 24px',
          }}
        >
          <Section style={{ marginBottom: '32px' }}>
            <Img
              src="https://sagie.co/logo-black.png"
              alt="SAGIE"
              width="120"
              height="auto"
              style={{ display: 'block' }}
            />
          </Section>

          <Heading
            style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#111111',
              margin: '0 0 16px 0',
              lineHeight: '1.3',
            }}
          >
            Thank you for your {formType}!
          </Heading>

          <Text
            style={{
              fontSize: '16px',
              color: '#444444',
              lineHeight: '1.6',
              margin: '0 0 24px 0',
            }}
          >
            {"We've received your application and our team will review it shortly."}
          </Text>

          <Hr
            style={{
              borderColor: '#e5e5e5',
              margin: '24px 0',
            }}
          />

          <Text
            style={{
              fontSize: '13px',
              color: '#888888',
              lineHeight: '1.5',
              margin: '0 0 8px 0',
            }}
          >
            Shape a Great Impact Everywhere
          </Text>

          <Section>
            <Link
              href="https://www.linkedin.com/company/sagie-co"
              style={{
                fontSize: '13px',
                color: '#555555',
                textDecoration: 'underline',
                marginRight: '16px',
              }}
            >
              LinkedIn
            </Link>
            <Link
              href="https://www.instagram.com/sagie.co/"
              style={{
                fontSize: '13px',
                color: '#555555',
                textDecoration: 'underline',
              }}
            >
              Instagram
            </Link>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}
