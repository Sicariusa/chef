# Chef Setup Guide

This guide will help you set up and run Chef with centralized project management.

## What This Does (Shared Project Model)

**For Your End Users (Simple!):**
- Sign in with **Google** or **GitHub** ✅
- Start building immediately - no setup! ✅
- See only their own projects ✅
- Never deal with Convex accounts, tokens, or OAuth ✅

**For You (The Admin - One-Time Setup):**
- All projects are created in **your Convex account**
- **You pay for all usage** (simplified billing)
- One-time setup with your admin credentials

### User Flow (Shared Model)

```
👤 User → Signs in with Google/GitHub → Starts chatting → Done! ✅

Behind the scenes:
👤 User request → 🔧 Chef Backend → Uses YOUR admin token → Creates project in YOUR Convex account
```

---

## Alternative: Multi-Tenant Setup

If you want each user to have their own Convex account:
- Each user connects **their own Convex account**
- Each user creates **their own projects**
- Each user **pays for their own usage**

See the Multi-Tenant section at the bottom of this document.

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

### 2. Get Your Convex Admin Access Token (For Shared Model)

**⚠️ YOU (THE ADMIN) DO THIS ONCE - NOT YOUR USERS!**

This token allows Chef to automatically create projects in your Convex account for all users.
Your users will just sign in with Google/GitHub and start using Chef immediately.

1. Log into [Convex Dashboard](https://dashboard.convex.dev)
2. Open your browser's Developer Tools (F12 or Cmd+Option+I)
3. Go to the **Console** tab
4. Run this command:
   ```javascript
   localStorage.getItem('convexProjectToken')
   ```
5. Copy the token (it's a long string that looks like `eyJ...`)
6. Save this as your `CHEF_ADMIN_ACCESS_TOKEN` (you'll add it to environment variables in step 6)
7. Note your team slug from the dashboard URL (e.g., `dashboard.convex.dev/t/YOUR_TEAM_SLUG`)
8. Save the team slug as your `CHEF_ADMIN_TEAM_SLUG` (you'll add it to environment variables in step 6)

**Important**: 
- This token gives full access to your Convex account. Keep it secure!
- You only do this once during setup
- Your end users never see this token or do any Convex setup

### 3. (Optional) Create Convex OAuth Application (For Multi-Tenant Model)

Skip this if you're using the shared project model. Otherwise:

1. Go to [Convex Dashboard](https://dashboard.convex.dev/team/settings/applications/oauth-apps)
2. Click **Create OAuth Application**
3. Fill in:
   - **Name**: Chef Local Dev (or your app name)
   - **Redirect URIs**: `http://127.0.0.1:5173/api/convex/callback`
   - (Later add production: `https://yourdomain.com/api/convex/callback`)
4. Click **Create**
5. Save the **OAuth Client ID** and **OAuth Client Secret**

### 4. Clone and Install

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

### 5. Setup Convex Backend

```bash
# Create .env.local file
echo 'VITE_CONVEX_URL=placeholder' >> .env.local

# Initialize Convex (creates a new Convex project)
npx convex dev --once
```

Follow the prompts to:

- Create a new project or select existing
- Choose your team

### 6. Configure Environment Variables

#### In Convex Dashboard

1. Open Convex Dashboard: `npx convex dashboard`
2. Go to **Settings** → **Environment Variables**
3. Add these variables:

```bash
# === FOR SHARED PROJECT MODEL ===
# Admin credentials (from Step 2)
CHEF_ADMIN_ACCESS_TOKEN=<your-convex-access-token-from-step-2>
CHEF_ADMIN_TEAM_SLUG=<your-team-slug-from-step-2>
PROVISION_HOST=https://api.convex.dev

# === FOR MULTI-TENANT MODEL (OPTIONAL) ===
# Convex OAuth (from Step 3, skip if using shared model)
# CONVEX_OAUTH_CLIENT_ID=<your-convex-oauth-client-id>
# CONVEX_OAUTH_CLIENT_SECRET=<your-convex-oauth-client-secret>

# === USER AUTHENTICATION (REQUIRED) ===
# Google OAuth (from Step 1)
AUTH_GOOGLE_ID=<your-google-client-id>
AUTH_GOOGLE_SECRET=<your-google-client-secret>

# OR GitHub OAuth (if using GitHub instead)
AUTH_GITHUB_ID=<your-github-client-id>
AUTH_GITHUB_SECRET=<your-github-client-secret>
```

#### In .env.local File

Edit `.env.local` and add:

```bash
# === FOR MULTI-TENANT MODEL (OPTIONAL) ===
# If you set up Convex OAuth in Step 3, add the Client ID here:
# VITE_CONVEX_OAUTH_CLIENT_ID=<your-convex-oauth-client-id>

# === AI API KEYS (REQUIRED) ===
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

### 7. Run Chef

Open two terminals:

**Terminal 1 - Convex Backend:**

```bash
npx convex dev
```

**Terminal 2 - Frontend:**

```bash
pnpm run dev
```

### 8. Test It!

#### For Shared Project Model (Simple User Experience):

**What your users see:**

1. Open http://127.0.0.1:5173 in your browser
2. Click **"Sign in with Google"** (or GitHub)
3. Authorize the app
4. Start typing a message and start building! 🎉

**That's it!** Behind the scenes:
- Projects are automatically created in YOUR (the admin's) Convex account
- Users only see their own projects
- Users never deal with Convex tokens or OAuth
- You (the admin) pay for all usage

#### For Multi-Tenant Model:

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
