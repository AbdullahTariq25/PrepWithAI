# PrepWithAI — Production Environment & Release Checklist

Use this document as the minimum operational gate for a production release. Secrets must be configured in the deployment platform or secret manager—never committed to the repository.

## Core runtime — required

| Variable | Purpose |
|---|---|
| `MONGODB_URI` | MongoDB connection used by authentication, sessions, progress, study groups, distributed rate limits, and product data. |
| `NEXTAUTH_SECRET` or `AUTH_SECRET` | Strong random secret used for authenticated sessions and JWT validation. |
| `NEXT_PUBLIC_APP_URL` | Canonical public application URL used for links and application flows. |
| `GROQ_API_KEY` | AI interview and evaluation provider credential. |

Recommended generation for the auth secret:

```bash
openssl rand -base64 48
```

## AI configuration

| Variable | Purpose |
|---|---|
| `GROQ_API_KEY` | Required AI provider credential. |
| `GROQ_MODEL` | Optional model override. Defaults to the application-tested model. |
| `GROQ_DAILY_LIMIT` | Optional daily application call ceiling. Defaults to `1000`. |

The readiness endpoint reports AI configuration as degraded when the required AI key is missing.

## Code execution — optional feature

| Variable | Purpose |
|---|---|
| `JUDGE0_API_URL` | Judge0-compatible API base URL. Defaults to the RapidAPI endpoint when omitted. |
| `JUDGE0_API_KEY` | Required when using the default RapidAPI Judge0 endpoint. |
| `JUDGE0_RAPIDAPI_HOST` | Optional RapidAPI host override. |

When the execution provider is not configured, the API returns `503 EXECUTION_PROVIDER_NOT_CONFIGURED`. It does **not** return a fabricated successful run.

## Payments — required only when paid checkout is enabled

| Variable | Purpose |
|---|---|
| `STRIPE_SECRET_KEY` | Stripe server credential. |
| `STRIPE_WEBHOOK_SECRET` | Signature-verification secret for `/api/stripe/webhook`. |
| `STRIPE_PRO_MONTHLY_PRICE_ID` | Server-side Pro recurring price ID. |
| `STRIPE_TEAM_MONTHLY_PRICE_ID` | Server-side Team recurring price ID. |

Production release gate for billing:

- [ ] Stripe is in the intended live/test mode for the environment.
- [ ] Webhook endpoint targets the exact production `/api/stripe/webhook` URL.
- [ ] `checkout.session.completed`, `customer.subscription.updated`, and `customer.subscription.deleted` are delivered successfully.
- [ ] A real upgrade and cancellation cycle has been tested end to end.

## Transactional email — optional

| Variable | Purpose |
|---|---|
| `RESEND_API_KEY` | Transactional email provider credential. |
| `FROM_EMAIL` | Verified sender identity. |

Password reset remains safe from account enumeration, but production password-reset delivery requires a working email provider.

## Health checks and scheduled work

| Variable | Purpose |
|---|---|
| `HEALTH_CHECK_SECRET` | Preferred bearer secret for protected deep readiness checks. |
| `CRON_SECRET` | Secret for scheduled jobs; also used as readiness fallback only when `HEALTH_CHECK_SECRET` is absent. |

Endpoints:

- `GET /api/health` — public minimal liveness only.
- `HEAD /api/health` — lightweight liveness probe.
- `GET /api/health?deep=1` with `Authorization: Bearer <HEALTH_CHECK_SECRET>` — protected readiness diagnostics.

Do not expose the deep-check secret in browser code or public monitoring URLs.

## Monitoring and analytics — recommended

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SENTRY_DSN` | Client/server error reporting DSN. |
| `SENTRY_ORG` | Sentry organization slug for release tooling. |
| `SENTRY_PROJECT` | Sentry project slug for release tooling. |
| `SENTRY_AUTH_TOKEN` | Optional release/source-map upload token used only in secure build environments. |
| `NEXT_PUBLIC_POSTHOG_KEY` | PostHog project key. |
| `NEXT_PUBLIC_POSTHOG_HOST` | PostHog host. |

Do not fail the application merely because optional analytics are unavailable.

## Optional OAuth compatibility

The public sign-in and sign-up screens are credentials-only. Optional OAuth provider configuration may remain enabled in the backend for previously linked accounts.

| Variable | Purpose |
|---|---|
| `GOOGLE_CLIENT_ID` | Optional Google provider ID. |
| `GOOGLE_CLIENT_SECRET` | Optional Google provider secret. |
| `GITHUB_CLIENT_ID` | Optional GitHub provider ID. |
| `GITHUB_CLIENT_SECRET` | Optional GitHub provider secret. |

## Data and infrastructure prerequisites

- [ ] MongoDB network access is restricted appropriately for the deployment platform.
- [ ] Database credentials use least privilege and are not shared with local development.
- [ ] MongoDB backups or point-in-time recovery are configured according to the business recovery objective.
- [ ] TTL cleanup for rate-limit buckets is allowed to operate.
- [ ] Production and preview environments use separate secrets where practical.
- [ ] A domain and HTTPS are configured before sending password-reset or billing links to customers.

## Release gate

Before promoting any commit to production:

```bash
npm ci
npm run lint
npm run build
```

Then verify:

- [ ] The exact commit intended for release passed CI.
- [ ] `/api/health` returns `200` without leaking configuration details.
- [ ] Protected deep readiness returns `200`; any `503` is investigated before release.
- [ ] Credentials signup, login, logout, forgot-password, and reset-password flows work.
- [ ] A Free user can start the allowed Free interview flow and is blocked from Pro-only tracks/modes server-side.
- [ ] A Pro/trial user can start text, voice, and video modes.
- [ ] Interview completion produces one report only; repeated report requests do not duplicate ELO or progress.
- [ ] Evidence shown in the report is attributable to candidate transcript text.
- [ ] Resume upload extracts the actual PDF and rejects image-only PDFs honestly.
- [ ] Code execution either runs against the configured sandbox or returns an explicit unavailable state.
- [ ] Study groups persist after refresh; join, leave, capacity, privacy, and owner deletion behave correctly.
- [ ] Stripe upgrade/cancel lifecycle works when billing is enabled.
- [ ] Error monitoring receives a controlled test error when monitoring is enabled.
- [ ] Mobile and desktop smoke tests cover the landing page, auth, dashboard, interview setup, active interview, report, resume, pricing, and study groups.

## Rollback readiness

Before release, record:

- the exact Git commit SHA,
- the deployment ID/URL,
- the previous known-good deployment,
- the database migration or schema-change impact, if any.

Prefer promoting a validated immutable deployment and retain a known-good rollback candidate. Never describe a deployment as current until the deployed commit SHA has been verified.
