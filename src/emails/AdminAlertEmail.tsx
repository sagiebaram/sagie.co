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

interface AdminAlertEmailProps {
  formType: string
  data: Record<string, unknown>
}

function camelToLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim()
}

function formatValue(value: unknown): string {
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  if (Array.isArray(value)) return value.join(', ')
  return String(value)
}

function isEmptyValue(value: unknown): boolean {
  return value === null || value === undefined || value === ''
}

export function AdminAlertEmail({ formType, data }: AdminAlertEmailProps) {
  const entries = Object.entries(data).filter(([, value]) => !isEmptyValue(value))

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
              fontSize: '22px',
              fontWeight: '700',
              color: '#111111',
              margin: '0 0 24px 0',
              lineHeight: '1.3',
            }}
          >
            [ADMIN] New {formType}
          </Heading>

          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              marginBottom: '24px',
            }}
          >
            <tbody>
              {entries.map(([key, value]) => (
                <tr key={key}>
                  <td
                    style={{
                      padding: '8px 12px 8px 0',
                      verticalAlign: 'top',
                      fontWeight: '600',
                      fontSize: '13px',
                      color: '#555555',
                      whiteSpace: 'nowrap',
                      width: '40%',
                      borderBottom: '1px solid #f0f0f0',
                    }}
                  >
                    {camelToLabel(key)}
                  </td>
                  <td
                    style={{
                      padding: '8px 0',
                      verticalAlign: 'top',
                      fontSize: '14px',
                      color: '#111111',
                      borderBottom: '1px solid #f0f0f0',
                    }}
                  >
                    {formatValue(value)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

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
