# Chef Multi-Tenant Setup Guide

This guide will help you set up and run Chef as a multi-tenant application where users sign in with Google or GitHub.

## What This Does

- Users sign in with **Google** or **GitHub**
- Each user connects **their own Convex account**
- Each user creates **their own projects**
- Each user **pays for their own usage**

## Prerequisites

- Node.js 18+ installed
- A Convex account ([sign up free](https://dashboard.convex.dev))
- At least one of:
  - Google OAuth credentials
  - GitHub OAuth credentials
- API key for at least one AI provider (Anthropic, OpenAI, Google AI, etc.)

## Setup Steps

### 1. Get Google OAuth Credentials (Recommended)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Go to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth 2.0 Client ID**
5. If prompted, configure the OAuth consent screen:
   - User Type: External
   - Add your email as a test user
6. Application type: **Web application**
7. Add **Authorized redirect URIs**:
   - `http://127.0.0.1:5173/api/auth/callback/google`
   - (Later add your production URL: `https://yourdomain.com/api/auth/callback/google`)
8. Click **Create** and save the **Client ID** and **Client Secret**

**OR Get GitHub OAuth Credentials (Alternative)**

1. Go to [GitHub Settings](https://github.com/settings/developers) → **OAuth Apps**
2. Click **New OAuth App**
3. Fill in:
   - **Application name**: Your Chef Instance
   - **Homepage URL**: `http://127.0.0.1:5173`
   - **Authorization callback URL**: `http://127.0.0.1:5173/api/auth/callback/github`
4. Click **Register application**
5. Click **Generate a new client secret**
6. Save the **Client ID** and **Client Secret**

### 2. Create Convex OAuth Application

1. Go to [Convex Dashboard](https://dashboard.convex.dev/team/settings/applications/oauth-apps)
2. Click **Create OAuth Application**
3. Fill in:
   - **Name**: Chef Local Dev (or your app name)
   - **Redirect URIs**: `http://127.0.0.1:5173/api/convex/callback`
   - (Later add production: `https://yourdomain.com/api/convex/callback`)
4. Click **Create**
5. Save the **OAuth Client ID** and **OAuth Client Secret**

### 3. Clone and Install

```bash
# Clone the repository
git clone https://github.com/get-convex/chef.git
cd chef

# Install Node.js (if using nvm)
nvm install
nvm use

# Install pnpm
npm install -g pnpm

# Install dependencies
pnpm install
```

### 4. Setup Convex Backend

```bash
# Create .env.local file
echo 'VITE_CONVEX_URL=placeholder' >> .env.local

# Initialize Convex (creates a new Convex project)
npx convex dev --once
```

Follow the prompts to:

- Create a new project or select existing
- Choose your team

### 5. Configure Environment Variables

#### In Convex Dashboard

1. Open Convex Dashboard: `npx convex dashboard`
2. Go to **Settings** → **Environment Variables**
3. Add these variables:

```bash
# Convex OAuth (from Step 2)
CONVEX_OAUTH_CLIENT_ID=<your-convex-oauth-client-id>
CONVEX_OAUTH_CLIENT_SECRET=<your-convex-oauth-client-secret>
PROVISION_HOST=https://api.convex.dev

# Google OAuth (from Step 1)
AUTH_GOOGLE_ID=<your-google-client-id>
AUTH_GOOGLE_SECRET=<your-google-client-secret>

# OR GitHub OAuth (if using GitHub instead)
AUTH_GITHUB_ID=<your-github-client-id>
AUTH_GITHUB_SECRET=<your-github-client-secret>
```

#### In .env.local File

Edit `.env.local` and add at least one AI API key:

```bash
# At least one of these is required:
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
GOOGLE_API_KEY=...
XAI_API_KEY=...
OPENROUTER_API_KEY=...

# Optional: Analytics & Monitoring
VITE_SENTRY_DSN=...
VITE_POSTHOG_KEY=...
VITE_POSTHOG_HOST=...
VITE_LD_CLIENT_SIDE_ID=...
```

### 6. Run Chef

Open two terminals:

**Terminal 1 - Convex Backend:**

```bash
npx convex dev
```

**Terminal 2 - Frontend:**

```bash
pnpm run dev
```

### 7. Test It!

1. Open http://127.0.0.1:5173 in your browser
2. Click **"Sign in with Google"** (or GitHub)
3. Authorize the app
4. Start a new chat
5. When prompted, select a Convex team
6. Click **"Connect"** to authorize project creation
7. Wait for the project to be created
8. Start building! 🎉

## Common Issues & Solutions

### "Can't sign in"

- **Check OAuth redirect URIs** - They must match exactly
- **Verify credentials** - CLIENT_ID and SECRET must be correct
- **Clear cookies** - Try incognito mode
- **Check OAuth consent screen** - Add yourself as a test user in Google

### "Can't create Convex project"

- **Verify Convex OAuth credentials** - Check they're set in Convex dashboard
- **Check team permissions** - Ensure you can create projects in your team
- **Look at Convex logs** - Check the dashboard for error messages

### "Missing environment variables"

- **Check Convex dashboard** - Settings → Environment Variables
- **Check .env.local** - Must be in project root
- **Restart servers** - After changing env vars, restart both terminals

### "TypeScript errors"

```bash
pnpm run typecheck
```

### "Linting errors"

```bash
pnpm run lint:fix
```

## Production Deployment

### Vercel (Recommended)

1. **Install Vercel CLI**

```bash
npm install -g vercel
```

2. **Deploy**

```bash
vercel
```

3. **Configure Environment Variables** in Vercel dashboard:

   - All the variables from `.env.local`
   - All the variables from Convex dashboard

4. **Update OAuth Redirect URIs**:
   - Google: Add `https://your-domain.vercel.app/api/auth/callback/google`
   - GitHub: Add `https://your-domain.vercel.app/api/auth/callback/github`
   - Convex: Add `https://your-domain.vercel.app/api/convex/callback`

### Other Platforms

```bash
# Build the app
pnpm run build

# Output is in build/ directory
# Deploy this to your hosting platform
# Make sure to set all environment variables
```

## Environment Variables Reference

### Required

| Variable                     | Where                 | Description                     |
| ---------------------------- | --------------------- | ------------------------------- |
| `VITE_CONVEX_URL`            | Auto-generated        | Your Convex deployment URL      |
| `CONVEX_OAUTH_CLIENT_ID`     | Convex Dashboard      | Convex OAuth app client ID      |
| `CONVEX_OAUTH_CLIENT_SECRET` | Convex Dashboard      | Convex OAuth app client secret  |
| `PROVISION_HOST`             | Convex Dashboard      | `https://api.convex.dev`        |
| `AUTH_GOOGLE_ID`             | Convex Dashboard      | Google OAuth client ID          |
| `AUTH_GOOGLE_SECRET`         | Convex Dashboard      | Google OAuth client secret      |
| At least one AI API key      | `.env.local` / Vercel | Anthropic, OpenAI, Google, etc. |

### Optional

| Variable                  | Where                 | Description                   |
| ------------------------- | --------------------- | ----------------------------- |
| `AUTH_GITHUB_ID`          | Convex Dashboard      | GitHub OAuth client ID        |
| `AUTH_GITHUB_SECRET`      | Convex Dashboard      | GitHub OAuth client secret    |
| `VITE_SENTRY_DSN`         | `.env.local` / Vercel | Error tracking                |
| `VITE_POSTHOG_KEY`        | `.env.local` / Vercel | Analytics                     |
| `VITE_LD_CLIENT_SIDE_ID`  | `.env.local` / Vercel | Feature flags                 |
| `CHEF_ADMIN_TOKEN`        | Convex Dashboard      | Admin debugging endpoints     |
| `DISABLE_USAGE_REPORTING` | `.env.local`          | Disable usage reporting (dev) |
| `DISABLE_BEDROCK`         | `.env.local`          | Disable AWS Bedrock models    |

## What Changed from Original Chef

| Feature          | Original Chef (WorkOS) | Multi-Tenant Chef (This) |
| ---------------- | ---------------------- | ------------------------ |
| Sign In          | Convex internal WorkOS | Google/GitHub OAuth      |
| User Management  | Convex team only       | Anyone can sign up       |
| Project Billing  | Convex pays            | User pays                |
| Project Creation | Shared namespace       | User's own account       |
| Scalability      | Limited to team        | Unlimited users          |

## Project Structure

```
chef/
├── app/                    # Frontend React app
│   ├── components/        # UI components
│   ├── routes/           # Remix routes
│   └── lib/              # Client utilities
├── convex/                # Convex backend
│   ├── auth.ts           # Auth configuration (NEW)
│   ├── sessions.ts       # Session management
│   └── convexProjects.ts # Project creation
├── .env.local            # Local environment vars
└── package.json          # Dependencies
```

## Next Steps

- **Customize branding** - Update logos and colors
- **Add more OAuth providers** - Microsoft, Apple, etc.
- **Set up monitoring** - Sentry, PostHog
- **Configure custom domain** - For production
- **Add rate limiting** - If needed for high traffic

## Support

- **Convex Docs**: https://docs.convex.dev/auth
- **Convex Discord**: https://discord.gg/convex
- **GitHub Issues**: https://github.com/get-convex/chef/issues

## Security Notes

- ✅ Use HTTPS in production
- ✅ Keep OAuth secrets secure (environment variables only)
- ✅ Each user's data is completely isolated
- ✅ Users pay for their own Convex usage
- ✅ Regular dependency updates recommended

---

**Ready to cook!** 👨‍🍳

If you encounter issues, check the troubleshooting section above or ask in the [Convex Discord](https://discord.gg/convex).
