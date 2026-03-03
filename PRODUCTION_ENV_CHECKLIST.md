# PrepWithAI — Production Environment Checklist

> All environment variables needed for a full production deployment on Vercel.

---

## ✅ REQUIRED (App will not work without these)

| Variable | Description | Example |
|---|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/prepwithai` |
| `NEXTAUTH_SECRET` | Random secret for NextAuth session encryption | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Full production URL (Vercel sets this automatically) | `https://prepwithai.vercel.app` |
| `GROQ_API_KEY` | Groq API key for LLaMA 3.3 70B AI responses | `gsk_...` |

---

## 🟡 OPTIONAL — OAuth Providers (app works without, Google/GitHub login disabled)

| Variable | Description |
|---|---|
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `GITHUB_CLIENT_ID` | GitHub OAuth client ID |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth client secret |

---

## 🟡 OPTIONAL — Payments (Stripe)

| Variable | Description |
|---|---|
| `STRIPE_SECRET_KEY` | Stripe API secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `STRIPE_PRO_MONTHLY_PRICE_ID` | Stripe price ID for Pro plan |
| `STRIPE_TEAM_MONTHLY_PRICE_ID` | Stripe price ID for Team plan |
| `NEXT_PUBLIC_STRIPE_PRO_PRICE_ID` | Public Stripe Pro price ID (for client) |
| `NEXT_PUBLIC_STRIPE_TEAM_PRICE_ID` | Public Stripe Team price ID (for client) |

---

## 🟡 OPTIONAL — Email (Resend)

| Variable | Description |
|---|---|
| `RESEND_API_KEY` | Resend API key for transactional emails |
| `FROM_EMAIL` | Sender email address (default: `PrepWithAI <noreply@prepwithai.com>`) |

---

## 🟡 OPTIONAL — Code Execution (Judge0)

| Variable | Description |
|---|---|
| `JUDGE0_API_URL` | Judge0 API endpoint |
| `JUDGE0_API_KEY` | Judge0 RapidAPI key |

---

## 🟡 OPTIONAL — Monitoring & Analytics

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SENTRY_DSN` | Sentry DSN for error tracking |
| `SENTRY_ORG` | Sentry organization slug |
| `SENTRY_PROJECT` | Sentry project slug |
| `NEXT_PUBLIC_POSTHOG_KEY` | PostHog project API key |
| `NEXT_PUBLIC_POSTHOG_HOST` | PostHog host (default: `https://us.i.posthog.com`) |

---

## 🟡 OPTIONAL — Other

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_APP_URL` | Full production URL (used for share links, emails) |
| `CRON_SECRET` | Secret for Vercel cron job authentication |
| `GROQ_DAILY_LIMIT` | Max Groq API calls per day (default: `1000`) |

---

## 🚀 Deployment Steps

```bash
# 1. Set env vars in Vercel dashboard or CLI
vercel env add MONGODB_URI
vercel env add NEXTAUTH_SECRET
vercel env add GROQ_API_KEY
# ... add all required vars

# 2. Build locally to verify zero errors
npm run build

# 3. Deploy to production
vercel --prod
```

## 📝 Post-Deploy Verification

- [ ] Landing page loads with real stats from `/api/stats`
- [ ] Signup/Login works (email + optional OAuth)
- [ ] Interview session starts and AI responds
- [ ] Dashboard shows real data from MongoDB
- [ ] Leaderboard loads from `/api/leaderboard`
- [ ] Daily challenges load from `/api/daily`
- [ ] Progress page shows charts from `/api/progress`
- [ ] Study Groups page shows "Coming Soon"
- [ ] All footer links resolve (no 404s)
- [ ] Stripe checkout flow works (if Stripe keys set)
