<div align="center">

# PrepWithAI
### AI interview preparation for developers who want measurable improvement

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css)](https://tailwindcss.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://mongodb.com)
[![Stripe](https://img.shields.io/badge/Stripe-Subscriptions-635BFF?logo=stripe&logoColor=white)](https://stripe.com)
[![License](https://img.shields.io/badge/License-MIT-purple)](LICENSE)

[**Live Product**](https://prepwithai.com) · [**Report an Issue**](https://github.com/AbdullahTariq25/PrepWithAI/issues) · [**Request a Feature**](https://github.com/AbdullahTariq25/PrepWithAI/issues)

</div>

## Overview

PrepWithAI is a full-stack interview-preparation platform for software developers. It combines AI-led mock interviews, technical and behavioral practice, company-specific preparation, voice/video modes, progress analytics, career tools, authentication, subscriptions, and transactional email in one product.

The platform is built around a deliberate practice loop: **choose a target → practice under realistic constraints → review specific feedback → repeat with one improvement goal**.

## Product capabilities

### Interview practice
- Multiple interview tracks including DSA, system design, behavioral, frontend, backend, DevOps, mobile, ML, leadership, and full-loop practice.
- AI follow-up questions and structured feedback.
- Voice and video interview modes for communication practice.
- Company-specific preparation contexts.
- Monaco-based coding workspace for technical sessions.

### Progress and career tooling
- Session history and detailed reports.
- Skill trends, streaks, ELO-style progression, and performance analytics.
- Resume review and resume builder.
- Cover-letter, job, salary, flashcard, leaderboard, and daily-practice surfaces.

### Commercial product infrastructure
- Credentials authentication with JWT sessions.
- Free, Pro, Team, and Enterprise plan support in the data model.
- Single-use 14-day Pro trial.
- Server-side enforcement of Free-plan interview limits.
- Stripe Checkout, subscription lifecycle webhooks, and customer records.
- Resend-powered transactional email.
- Vercel Analytics, Speed Insights, PostHog, and Sentry integration points.

## Access model

The current core access model is:

| Plan | Core access |
|---|---|
| **Free** | Up to 3 DSA text interview sessions per day and core practice access |
| **Pro** | Unlimited sessions, premium interview tracks, voice/video modes, company packs, deeper analytics, and personalized preparation |
| **Team** | Pro capabilities plus team-oriented access and collaboration features |
| **Enterprise** | Data-model support for larger deployments and custom commercial arrangements |

A Free account can activate a **single-use 14-day Pro trial**.

> Stripe price IDs and production billing secrets must be configured in the deployment environment before paid checkout is enabled.

## Technical architecture

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 App Router, React 19, TypeScript |
| Styling | Tailwind CSS v4, Radix UI primitives, selective Framer Motion |
| Database | MongoDB Atlas, Mongoose |
| AI | Groq SDK |
| Authentication | NextAuth/Auth.js v5 credentials flow with JWT sessions |
| Billing | Stripe Checkout and webhooks |
| Email | Resend |
| Monitoring | Sentry integration points |
| Product analytics | Vercel Analytics, Speed Insights, PostHog |

## Security and reliability notes

- Protected application routes validate authentication tokens rather than trusting only the presence of a cookie name.
- Sensitive credentials are expected through environment variables and must never be committed.
- Stripe webhook signatures are verified before subscription state changes are applied.
- Database configuration is validated when a database connection is actually requested, preventing missing database configuration from crashing unrelated static build work.
- CI runs lint and a production build independently on pull requests and relevant pushes.

## Local development

### Requirements

- Node.js 22 or another version supported by the current Next.js release.
- npm.
- MongoDB for database-backed product flows.
- A Groq API key for AI interview functionality.
- Optional Stripe, Resend, Sentry, and analytics credentials for their respective integrations.

### Setup

```bash
git clone https://github.com/AbdullahTariq25/PrepWithAI.git
cd PrepWithAI
npm ci
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

### Quality checks

```bash
npm run lint
npm run build
```

The repository also includes GitHub Actions CI for these checks.

## Important environment variables

Review `.env.example` for the complete configuration. Production commonly requires values for:

```text
MONGODB_URI
NEXTAUTH_SECRET or AUTH_SECRET
NEXT_PUBLIC_APP_URL
GROQ_API_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
STRIPE_PRO_MONTHLY_PRICE_ID
STRIPE_TEAM_MONTHLY_PRICE_ID
RESEND_API_KEY
FROM_EMAIL
CRON_SECRET
```

Optional OAuth provider credentials may exist in the backend configuration, but the current public login/signup experience is intentionally credentials-focused.

## Selected API routes

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/health` | Service health information |
| `POST` | `/api/auth/signup` | Create a credentials account |
| `POST` | `/api/interview/create` | Create an interview session with plan enforcement |
| `POST` | `/api/interview/[id]/chat` | Continue an AI interview session |
| `POST` | `/api/user/start-trial` | Start the one-time Pro trial |
| `POST` | `/api/stripe/checkout` | Create a Stripe subscription checkout session |
| `POST` | `/api/stripe/webhook` | Synchronize subscription lifecycle changes |
| `POST` | `/api/cron` | Run secret-protected maintenance jobs |

## Deployment

The project is designed for Vercel deployment through Git integration. The production branch is `main`; production releases should come from CI-validated commits on that branch. Keep all production secrets in the Vercel project environment and configure the Stripe webhook endpoint against the production `/api/stripe/webhook` route.

Before a production release:

1. Confirm the production environment variables.
2. Run CI successfully.
3. Validate authentication, account creation, interview creation, billing, and webhook flows.
4. Test mobile and desktop navigation.
5. Review runtime errors after deployment.

## Contributing

Contributions are welcome. Keep changes focused, avoid committing secrets or generated local files, and run lint/build checks before opening a pull request.

## License

Distributed under the [MIT License](LICENSE).

**Author:** [Abdullah Tariq](https://github.com/AbdullahTariq25) — Lahore, Pakistan.
