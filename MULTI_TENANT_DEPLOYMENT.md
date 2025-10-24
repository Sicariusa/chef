# Multi-Tenant Chef Deployment Guide

This guide explains how to deploy Chef as a multi-tenant application where each user signs up with their own authentication and manages their own Convex projects.

## Architecture Overview

Chef now uses a two-tier system:

1. **Convex Auth** (`@convex-dev/auth`): Users sign in with Google or GitHub OAuth
2. **Convex OAuth**: Users connect their own Convex projects via OAuth flow

Each user:

- Signs up with their own Google/GitHub account
- Connects their own Convex team via OAuth
- Creates projects in their own Convex account
- Pays for their own Convex usage

## Setup Instructions

### 1. Authentication Provider Setup

#### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Configure OAuth consent screen
6. Add authorized redirect URIs:
   - `https://yourdomain.com/api/auth/callback/google`
   - `http://127.0.0.1:5173/api/auth/callback/google` (for local dev)
7. Save the Client ID and Client Secret

#### GitHub OAuth Setup

1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Click "New OAuth App"
3. Fill in the details:
   - Application name: Your Chef Instance
   - Homepage URL: `https://yourdomain.com`
   - Authorization callback URL: `https://yourdomain.com/api/auth/callback/github`
4. Save the Client ID and Client Secret

### 2. Convex OAuth Application Setup

1. Go to [Convex Dashboard](https://dashboard.convex.dev/team/settings/applications/oauth-apps)
2. Create a new OAuth application
3. Configure redirect URIs:
   - `https://yourdomain.com/api/convex/callback`
   - `http://127.0.0.1:5173/api/convex/callback` (for local dev)
4. Save the OAuth Client ID and Client Secret
5. Ensure the OAuth app has permissions to:
   - Create projects in user's teams
   - Manage deployments
   - Access team information

### 3. Environment Variables

Create a `.env.local` file (or configure in your deployment platform):

```bash
# Convex Configuration
VITE_CONVEX_URL=https://your-deployment.convex.cloud
CONVEX_OAUTH_CLIENT_ID=your-convex-oauth-client-id
CONVEX_OAUTH_CLIENT_SECRET=your-convex-oauth-client-secret
PROVISION_HOST=https://api.convex.dev

# Authentication - Google OAuth
AUTH_GOOGLE_ID=your-google-client-id
AUTH_GOOGLE_SECRET=your-google-client-secret

# Authentication - GitHub OAuth (optional)
AUTH_GITHUB_ID=your-github-client-id
AUTH_GITHUB_SECRET=your-github-client-secret

# AI Model API Keys (at least one required)
ANTHROPIC_API_KEY=your-anthropic-api-key
GOOGLE_API_KEY=your-google-ai-api-key
OPENAI_API_KEY=your-openai-api-key
XAI_API_KEY=your-xai-api-key
OPENROUTER_API_KEY=your-openrouter-api-key
```

### 4. Convex Deployment

Set up your Convex backend:

```bash
# Install dependencies
pnpm install

# Set up Convex
npx convex dev --once

# In the Convex dashboard, set environment variables:
# - CONVEX_OAUTH_CLIENT_ID
# - CONVEX_OAUTH_CLIENT_SECRET
# - AUTH_GOOGLE_ID
# - AUTH_GOOGLE_SECRET
# - AUTH_GITHUB_ID (optional)
# - AUTH_GITHUB_SECRET (optional)
# - PROVISION_HOST
```

### 5. Local Development

```bash
# Terminal 1: Start Convex
npx convex dev

# Terminal 2: Start the app
pnpm run dev

# Visit http://127.0.0.1:5173
```

### 6. Production Deployment

#### Recommended: Vercel

1. Connect your repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy!

#### Environment Variables in Vercel

Add all environment variables from `.env.example`:

- Authentication credentials (Google/GitHub)
- Convex OAuth credentials
- AI API keys
- Monitoring/analytics keys (optional)

#### Update OAuth Redirect URIs

Update your OAuth applications with production URLs:

- Google OAuth: Add `https://yourdomain.com/api/auth/callback/google`
- GitHub OAuth: Add `https://yourdomain.com/api/auth/callback/github`
- Convex OAuth: Add `https://yourdomain.com/api/convex/callback`

## User Journey

1. **User visits your Chef instance** → Sees homepage
2. **User clicks "Sign in"** → Chooses Google or GitHub
3. **OAuth flow completes** → User is authenticated
4. **User starts a chat** → Chef prompts to connect Convex project
5. **Convex OAuth flow** → User authorizes Chef to create projects
6. **Project creation** → Chef creates new Convex project in user's account
7. **App development** → User builds their app using Chef
8. **Deployment** → App deploys to user's own Convex project

## Multi-Tenant Verification

Verify your multi-tenant setup:

- ✅ Each user has their own authentication session
- ✅ Each user connects their own Convex account
- ✅ Projects are created in user's Convex teams
- ✅ Users pay for their own Convex usage
- ✅ Complete data isolation between users

## Security Considerations

1. **OAuth Security**

   - Use HTTPS in production
   - Validate OAuth state parameters
   - Store secrets securely (environment variables, not in code)

2. **Data Isolation**

   - Sessions are user-specific
   - Projects are created in user's accounts
   - No cross-user data access

3. **API Security**
   - Validate user permissions for all operations
   - Rate limiting (if needed)
   - Monitor for suspicious activity

## Troubleshooting

### Users can't sign in

- Verify OAuth credentials are correct
- Check redirect URIs match exactly
- Ensure OAuth apps are enabled

### Users can't create projects

- Verify Convex OAuth credentials
- Check that redirect URIs include the callback URL
- Ensure users have permission to create projects in their team

### Missing environment variables

- Check that all required variables are set in Convex dashboard
- Verify `.env.local` includes all needed keys
- For production, check deployment platform environment variables

## Differences from Single-Tenant Chef

| Feature         | Single-Tenant (Original) | Multi-Tenant (This Version)    |
| --------------- | ------------------------ | ------------------------------ |
| Authentication  | WorkOS (Convex internal) | Google/GitHub OAuth            |
| User Management | Convex internal system   | Your own auth system           |
| Billing         | Convex pays              | Each user pays for their usage |
| Deployment      | Single instance          | Independent instances          |
| Scalability     | Limited to Convex team   | Unlimited users                |

## Next Steps

1. Set up monitoring (Sentry, PostHog)
2. Configure custom domain
3. Add additional OAuth providers if needed
4. Customize branding
5. Add rate limiting if needed
6. Set up backup/disaster recovery

## Support

For issues with:

- **Chef functionality**: [GitHub Issues](https://github.com/get-convex/chef/issues)
- **Convex platform**: [Convex Discord](https://discord.gg/convex)
- **OAuth setup**: See provider documentation

## License

Same as Chef: MIT License
