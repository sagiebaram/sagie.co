# GitHub Secrets Required

Add these in: GitHub repo → Settings → Secrets and variables → Actions → New repository secret

| Secret name                     | Where to get it                                               |
| ------------------------------- | ------------------------------------------------------------- |
| NOTION_TOKEN                    | Notion → Settings → My connections → API token                |
| SENTRY_AUTH_TOKEN               | sentry.io → Settings → Account → API → Auth Tokens            |
| VERCEL_AUTOMATION_BYPASS_SECRET | Vercel → Settings → Deployment Protection → Automation Bypass |

These are required for CI/CD and E2E testing to pass.
