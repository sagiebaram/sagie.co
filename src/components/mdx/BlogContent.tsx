import ReactMarkdown from 'react-markdown'

interface BlogContentProps {
  markdown: string
}

export function BlogContent({ markdown }: BlogContentProps) {
  return (
    <ReactMarkdown
      components={{
        h1: ({ children }) => (
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', color: 'var(--text-primary)', letterSpacing: '0.04em', marginBottom: '16px' }}>{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', color: 'var(--silver)', letterSpacing: '0.04em', marginBottom: '12px', marginTop: '24px' }}>{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: 'var(--text-secondary)', letterSpacing: '0.04em', marginBottom: '10px' }}>{children}</h3>
        ),
        p: ({ children }) => (
          <p style={{ fontSize: '16px', color: 'var(--silver)', lineHeight: '1.85', fontWeight: 300, marginBottom: '14px' }}>{children}</p>
        ),
        blockquote: ({ children }) => (
          <blockquote style={{ borderLeft: '2px solid var(--silver)', paddingLeft: '16px', fontStyle: 'italic', color: 'var(--text-muted)', margin: '20px 0' }}>{children}</blockquote>
        ),
        a: ({ href, children }) => (
          <a href={href} style={{ color: 'var(--silver)', borderBottom: '0.5px solid var(--border-default)', paddingBottom: '1px', textDecoration: 'none' }}>{children}</a>
        ),
        code: ({ children }) => (
          <code style={{ fontFamily: 'monospace', fontSize: '11px', background: 'var(--bg-card-featured)', padding: '2px 6px', color: 'var(--text-muted)' }}>{children}</code>
        ),
      }}
    >
      {markdown}
    </ReactMarkdown>
  )
}
