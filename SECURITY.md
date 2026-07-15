# PrepWithAI Security Policy

## Supported release

Security fixes should be applied to the current `main` branch and the currently deployed production release. Older commits and preview deployments are not treated as supported production versions.

## Reporting a vulnerability

Do not open a public issue for a vulnerability that could expose user data, authentication, billing, secrets, or infrastructure.

Send a private report to the project owner with:

- the affected route or component,
- reproduction steps,
- expected and observed behavior,
- impact assessment,
- relevant request IDs, timestamps, screenshots, or logs,
- a minimal proof of concept when safe.

Do not include real user credentials, production secrets, or unnecessary personal data in a report.

## Security boundaries

PrepWithAI treats the following as untrusted input:

- interview answers and transcripts,
- resume files and extracted resume text,
- cover-letter source material,
- study-group content,
- code submissions and standard input,
- query parameters and API request bodies.

The application should never treat user-supplied content as system instructions, a trusted score, executable server code, or proof of identity.

## Authentication and authorization

- Authenticated routes validate signed session tokens rather than checking for cookie-name presence alone.
- Credential authentication is rate limited.
- Signup and password-reset workflows are rate limited.
- Password-reset responses do not reveal whether an account exists.
- Resource APIs must enforce ownership or explicit membership server-side; client-side hiding is not authorization.
- Free/Pro access rules must be enforced by server routes, not only by pricing or navigation UI.

## AI evaluation safety

AI evaluation is coaching support, not a guaranteed hiring outcome.

- Interview transcripts are isolated as untrusted content in the evaluator prompt.
- Candidate transcript quotes are verified before being displayed as evidence.
- Evaluation confidence is reduced when transcript evidence is weak.
- The final practice signal is derived from normalized rubric scoring so it cannot contradict the calibrated score.
- Company-specific practice is a preparation lens and must not be represented as access to private or current employer hiring rubrics.

## Resume handling

- Resume upload accepts PDF files within the configured size limit.
- The API verifies the PDF signature and extracts actual document text.
- Image-only/scanned PDFs are rejected when usable text cannot be extracted; the product must not fabricate a resume profile.
- Resume quality scores are deterministic preparation signals, not promises of ATS ranking or employment outcomes.

## Code execution

Submitted code must run only through the configured external execution sandbox. The application does not execute arbitrary candidate code inside the Next.js server process.

- Input and code sizes are bounded.
- Execution requests have timeouts.
- Test counts are bounded.
- Missing sandbox configuration returns an explicit service-unavailable response.
- The application must never return a fabricated successful execution result.

## Rate limiting

Production rate limits use hashed identifiers and MongoDB-backed buckets so limits apply across serverless instances. A bounded in-process fallback is used only during transient database failures.

Rate limiting is one control, not a substitute for platform-level firewall, bot, abuse, and DDoS protections.

## Health endpoints

- Public `/api/health` exposes minimal liveness only.
- Detailed readiness checks require a bearer secret.
- Health responses must not expose secret values, connection strings, raw environment variables, or unnecessary infrastructure details.

## Secrets

Never commit:

- MongoDB credentials,
- auth secrets,
- AI provider keys,
- Stripe keys or webhook secrets,
- email provider keys,
- health/cron secrets,
- deployment tokens.

Use deployment-platform environment variables or a dedicated secret manager. Rotate a secret immediately if it is exposed.

## Dependency and release hygiene

Before production release:

```bash
npm ci
npm run lint
npm run build
```

The exact release commit must pass CI. Review dependency advisories and framework security releases regularly. Production deployment identity must be verified by commit SHA rather than assumed from a URL or branch name.

## Incident response baseline

For a suspected incident:

1. Preserve timestamps, request IDs, affected deployment IDs, and relevant logs.
2. Contain access by revoking or rotating exposed credentials.
3. Roll back to a verified known-good deployment when appropriate.
4. Assess affected accounts and data.
5. Patch and validate the root cause before redeployment.
6. Notify affected users when legally or ethically required.
7. Document the incident and preventive follow-up actions.

## Out of scope for public testing

Without explicit written authorization, do not perform:

- destructive testing against production data,
- denial-of-service or resource-exhaustion attacks,
- credential stuffing,
- social engineering,
- accessing or modifying another user's real data beyond the minimum safe proof needed to report an issue.
