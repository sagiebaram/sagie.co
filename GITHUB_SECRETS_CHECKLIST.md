# GitHub Secrets Required

Add these in: GitHub repo → Settings → Secrets and variables → Actions → New repository secret

| Secret name         | Where to get it                                          |
|---------------------|----------------------------------------------------------|
| NOTION_TOKEN        | Notion → Settings → My connections → API token          |
| SENTRY_AUTH_TOKEN   | sentry.io → Settings → Account → API → Auth Tokens      |

These are required for CI to pass.
