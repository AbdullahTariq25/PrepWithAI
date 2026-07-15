# PrepWithAI — Production Environment & Release Checklist

Use this document as the minimum operational gate for a production release. Secrets must be configured in the deployment platform or secret manager—never committed to the repository.

## Core runtime — required

| Variable | Purpose |
|---|---|
| `MONGODB_URI` | MongoDB connection used by authentication, sessions, progress, study groups, job targets, flashcard review history, distributed rate limits, and product data. |
| `AUTH_SECRET` or `NEXTAUTH_SECRET` | Strong random secret used for authenticated sessions and JWT validation. **Required for production.** |
| `NEXT_PUBLIC_APP_URL` | Canonical public application URL used for links and application flows. |
| `GROQ_API_KEY` | AI interview and evaluation provider credential. |

Recommended generation for the auth secret:

```bash
openssl rand -base64 48
```

### Authentication environment policy

- Production must have an explicit `AUTH_SECRET` or `NEXTAUTH_SECRET`. The application intentionally fails closed without it.
- Preview deployments should also receive an explicit Preview-scoped auth secret in the hosting platform.
- As a recovery mechanism for **non-production Vercel Preview deployments only**, PrepWithAI can derive a stable deployment-scoped signing secret from server-only credentials already available to that preview. This exists to prevent a preview-only `MissingSecret` failure from hiding the rest of the release during testing.
- The preview fallback is **not** the production configuration and should not replace a properly managed Preview secret.
- `GET /api/auth/readiness` reports whether the current deployment can initialize authentication without exposing the secret.
- Auth.js and the Next.js proxy must always use the same secret resolver; do not configure one independently of the other.

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
- `GET /api/health?deep=1` with `Authorization: Bearer <HEALTH_CHECK_SECRET>` — protected infrastructure readiness diagnostics.
- `GET /api/auth/readiness` — public safe signal that authentication can initialize on this deployment.
- `GET /api/readiness` — authenticated product readiness diagnostics used by the Readiness Center.

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
- [ ] New persistent models—flashcard progress and job targets—are included in backup, export, and deletion verification.

## Release gate

Before promoting any commit to production:

```bash
npm ci
npm run lint
npm run build
```

Then verify:

### Authentication and deployment

- [ ] The exact commit intended for release passed CI.
- [ ] `/api/health` returns `200` without leaking configuration details.
- [ ] `/api/auth/readiness` returns `200` and `ready: true` on the exact deployment under test.
- [ ] Protected deep readiness returns `200`; any `503` is investigated before release.
- [ ] Credentials signup, login, logout, forgot-password, and reset-password flows work.
- [ ] A protected route redirects an unauthenticated visitor to login with a safe internal callback URL.
- [ ] A successful login returns the user to the requested internal route and does not redirect to an untrusted external URL.
- [ ] Runtime logs contain no `MissingSecret` or repeated Auth.js configuration errors after the smoke test.

### Interview core

- [ ] The authenticated Readiness Center reports auth, database, and AI-interviewer state accurately.
- [ ] Microphone and camera checks request permissions only when the user runs the device check and stop acquired media tracks after testing.
- [ ] A Free user can start the allowed Free interview flow and is blocked from Pro-only tracks/modes server-side.
- [ ] A Pro/trial user can start text, voice, and video modes.
- [ ] Interview completion produces one report only; repeated report requests do not duplicate ELO or progress.
- [ ] Evidence shown in the report is attributable to candidate transcript text.

### Learning and career workflows

- [ ] Flashcards load from the real question bank, not a hard-coded browser list.
- [ ] Again/Hard/Good/Easy ratings persist after refresh and produce a new `nextReviewAt` schedule.
- [ ] Due-card filtering and mastery state are user-specific.
- [ ] Resume upload extracts the actual PDF and rejects image-only PDFs honestly.
- [ ] Optional resume-to-job matching uses the supplied job description and remains labeled as a deterministic preparation signal—not a hiring, recruiter, or ATS guarantee.
- [ ] The Job Target Pipeline stores only user-entered opportunities; no fabricated listings, posting ages, salary claims, or match percentages are shown.
- [ ] Job status changes, follow-up dates, archive, delete, and source URLs persist correctly.
- [ ] Code execution either runs against the configured sandbox or returns an explicit unavailable state.
- [ ] Study groups persist after refresh; join, leave, capacity, privacy, and owner deletion behave correctly.

### Data lifecycle and commercial operations

- [ ] Account data export downloads a private JSON archive containing the expected profile, interview, progress, study-group, flashcard, job-pipeline, and user AI-usage records.
- [ ] Account deletion removes user-owned sessions, progress, flashcard history, job targets, user AI usage, owned study groups, and group membership references before deleting the user.
- [ ] Stripe upgrade/cancel lifecycle works when billing is enabled.
- [ ] Error monitoring receives a controlled test error when monitoring is enabled.
- [ ] Mobile and desktop smoke tests cover the landing page, auth, dashboard, readiness, interview setup, active interview, report, resume, job pipeline, flashcards, pricing, settings export, and study groups.

## Rollback readiness

Before release, record:

- the exact Git commit SHA,
- the deployment ID/URL,
- the previous known-good deployment,
- the database/schema impact of new persistent models,
- whether a rollback changes authentication secret resolution or session compatibility.

Prefer promoting a validated immutable deployment and retain a known-good rollback candidate. Never describe a deployment as current until the deployed commit SHA—or an application-tree-identical commit—has been verified.
