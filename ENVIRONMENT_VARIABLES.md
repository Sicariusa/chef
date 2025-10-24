# Environment Variables Setup

This document explains the environment variables needed for Chef to work in production, particularly for multi-tenant OAuth setup.

## Overview

Chef has two distinct authentication flows:

1. **Platform Authentication** - Users sign into the Chef platform itself
2. **Per-Store Project OAuth** - Users connect their own Convex accounts for their e-commerce stores

## Required Environment Variables

### Platform Authentication (WorkOS/Convex for Chef platform itself)

These credentials authenticate users to the Chef platform:

```bash
# WorkOS client ID for platform authentication
VITE_WORKOS_CLIENT_ID=<your_platform_workos_client_id>
WORKOS_CLIENT_ID=<your_platform_workos_client_id>

# WorkOS redirect URI (your domain)
VITE_WORKOS_REDIRECT_URI=https://yourdomain.com

# WorkOS API hostname
VITE_WORKOS_API_HOSTNAME=apiauth.convex.dev
```

### OAuth App Credentials (for users connecting their Convex projects)

**CRITICAL:** These must be from a **public OAuth application** registered with Convex, not developer-specific credentials.

```bash
# Public OAuth app credentials that work for ANY Convex user
CONVEX_OAUTH_CLIENT_ID=<public_oauth_app_client_id>
CONVEX_OAUTH_CLIENT_SECRET=<public_oauth_app_secret>
```

### Convex Backend

```bash
# Your main Chef platform Convex deployment URL
CONVEX_URL=<your_platform_convex_deployment_url>

# Convex API host
BIG_BRAIN_HOST=https://api.convex.dev
```

## Development vs Production

### Development (.env.local)
```bash
# Platform auth (same as production)
VITE_WORKOS_CLIENT_ID=<your_platform_workos_client_id>
WORKOS_CLIENT_ID=<your_platform_workos_client_id>
VITE_WORKOS_REDIRECT_URI=http://127.0.0.1:5173
VITE_WORKOS_API_HOSTNAME=apiauth.convex.dev

# OAuth app credentials (same as production)
CONVEX_OAUTH_CLIENT_ID=<public_oauth_app_client_id>
CONVEX_OAUTH_CLIENT_SECRET=<public_oauth_app_secret>

# Convex backend
CONVEX_URL=<your_platform_convex_deployment_url>
BIG_BRAIN_HOST=https://api.convex.dev
```

### Production (hosting platform environment variables)
```bash
# Platform auth
VITE_WORKOS_CLIENT_ID=<your_platform_workos_client_id>
WORKOS_CLIENT_ID=<your_platform_workos_client_id>
VITE_WORKOS_REDIRECT_URI=https://yourdomain.com
VITE_WORKOS_API_HOSTNAME=apiauth.convex.dev

# OAuth app credentials
CONVEX_OAUTH_CLIENT_ID=<public_oauth_app_client_id>
CONVEX_OAUTH_CLIENT_SECRET=<public_oauth_app_secret>

# Convex backend
CONVEX_URL=<your_platform_convex_deployment_url>
BIG_BRAIN_HOST=https://api.convex.dev
```

## How to Get OAuth App Credentials

1. **Contact Convex Support** to register Chef as a public OAuth application
2. **Provide the following information:**
   - App Name: Chef (or your platform name)
   - Redirect URIs:
     - `https://yourdomain.com/convex/callback` (production)
     - `http://127.0.0.1:5173/convex/callback` (development)
   - Scopes: Project creation and management permissions

3. **You'll receive:**
   - `CONVEX_OAUTH_CLIENT_ID` - public identifier for your app
   - `CONVEX_OAUTH_CLIENT_SECRET` - secret key (keep secure, server-side only)

## Why This Setup is Needed

The error `"Invalid client ID or client secret"` occurs because:

- **Current Problem:** OAuth credentials are developer-specific and only work when YOU connect YOUR Convex account
- **Solution:** Public OAuth app credentials work for ANY user who authorizes your app

## Authentication Flow

1. **User signs into Chef:** Uses `VITE_WORKOS_CLIENT_ID` → authenticates to Chef platform
2. **User clicks "Connect Convex Project":** Redirects to Convex dashboard
3. **User logs into THEIR Convex account:** Gets access token for their account
4. **Chef creates project in user's account:** Uses their access token
5. **Chef registers OAuth app with project:** Uses YOUR public OAuth app credentials
6. **User's project is connected:** Chef can now access it via deploy key

## Troubleshooting

### Error: "Invalid client ID or client secret"
- **Cause:** Using developer-specific OAuth credentials instead of public OAuth app credentials
- **Solution:** Register Chef as a public OAuth application with Convex

### Error: "Failed to create project deploy key"
- **Cause:** Same as above - OAuth credentials don't work for other users' accounts
- **Solution:** Get proper public OAuth app credentials

## Security Notes

- `CONVEX_OAUTH_CLIENT_SECRET` must be kept secure and server-side only
- `VITE_WORKOS_CLIENT_ID` is safe to expose client-side (it's public)
- Never commit secrets to version control
- Use environment variable management in your hosting platform
