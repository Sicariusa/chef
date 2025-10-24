# Multi-Tenant Authentication Migration Summary

## Overview

Chef has been successfully migrated from a single-tenant (WorkOS-based) authentication system to a multi-tenant authentication system using Convex Auth. This enables anyone to deploy their own instance of Chef where users can sign up independently.

## What Changed

### Authentication System

**Before (WorkOS):**

- Users authenticated via Convex's internal WorkOS system
- Limited to Convex team members
- Single-tenant deployment model

**After (Convex Auth):**

- Users authenticate via Google OAuth or GitHub OAuth
- Open to any user with a Google/GitHub account
- Multi-tenant deployment model
- Each user manages their own Convex projects

### Key Files Modified

#### 1. Authentication Configuration

- **`convex/auth.ts`** (NEW): Convex Auth setup with Google/GitHub providers
- **`convex/auth.config.ts`**: Updated to use Convex Auth
- **`convex/http.ts`**: Added Convex Auth HTTP routes
- **`convex/sessions.ts`**: Added `getUserProfile` query for user data

#### 2. Frontend Components

- **`app/root.tsx`**: Replaced `AuthKitProvider` with `ConvexAuthProvider`
- **`app/components/UserProvider.tsx`**: Updated to use Convex Auth hooks
- **`app/components/chat/ChefAuthWrapper.tsx`**: Removed WorkOS dependencies
- **`app/components/settings/ProfileCard.tsx`**: Updated sign-out flow
- **`app/components/header/Header.tsx`**: Updated authentication hooks
- **`app/components/chat/MessageInput.tsx`**: Updated sign-in buttons
- **`app/lib/stores/startup/useInitializeChat.ts`**: Updated auth actions
- **`app/routes/create.$shareCode.tsx`**: Updated sign-in flow

#### 3. Dependencies

**Removed:**

- `@workos-inc/authkit-react`
- `@convex-dev/workos`

**Added:**

- `@convex-dev/auth`
- `@auth/core`

#### 4. Environment Variables

**Removed:**

- `VITE_WORKOS_CLIENT_ID`
- `VITE_WORKOS_REDIRECT_URI`
- `VITE_WORKOS_API_HOSTNAME`
- `WORKOS_CLIENT_ID`
- `WORKOS_REDIRECT_URI`

**Added:**

- `AUTH_GOOGLE_ID` - Google OAuth Client ID
- `AUTH_GOOGLE_SECRET` - Google OAuth Client Secret
- `AUTH_GITHUB_ID` - GitHub OAuth Client ID (optional)
- `AUTH_GITHUB_SECRET` - GitHub OAuth Client Secret (optional)

### What Remained Unchanged

The **Convex OAuth flow for project creation** remained completely unchanged:

- **`app/routes/api.convex.callback.ts`**: OAuth callback handler
- **`app/routes/convex.connect.tsx`**: OAuth connection UI
- **`convex/convexProjects.ts`**: Project creation logic
- **`app/components/convex/ConvexConnectButton.tsx`**: Project connection button

These files still use:

- `CONVEX_OAUTH_CLIENT_ID`
- `CONVEX_OAUTH_CLIENT_SECRET`
- `PROVISION_HOST`

## How It Works Now

### User Flow

1. **User visits Chef instance** → Sees homepage
2. **User clicks "Sign in"** → Redirected to Google/GitHub OAuth
3. **User authorizes** → Returns to Chef, authenticated via Convex Auth
4. **User starts chat** → Chef prompts to connect Convex project
5. **User clicks "Connect"** → Convex OAuth flow begins
6. **User authorizes** → Chef can create projects in user's Convex account
7. **Chef creates project** → New project in user's selected team
8. **User develops app** → Using Chef's AI assistance
9. **App deploys** → To user's own Convex deployment

### Multi-Tenancy

Each user:

- Has their own authentication session (via Google/GitHub)
- Connects their own Convex account (via OAuth)
- Creates projects in their own Convex teams
- Pays for their own Convex usage
- Has complete data isolation from other users

## Deployment Checklist

### Prerequisites

- [ ] Google OAuth credentials (or GitHub OAuth credentials)
- [ ] Convex OAuth application created
- [ ] Convex deployment set up
- [ ] API keys for AI models

### Setup Steps

1. [ ] Set up OAuth providers (Google/GitHub)
2. [ ] Create Convex OAuth application
3. [ ] Configure environment variables
4. [ ] Deploy Convex backend
5. [ ] Deploy frontend (e.g., to Vercel)
6. [ ] Update OAuth redirect URIs for production
7. [ ] Test full user flow

### Environment Variables to Configure

**In Convex Dashboard:**

```
CONVEX_OAUTH_CLIENT_ID=...
CONVEX_OAUTH_CLIENT_SECRET=...
AUTH_GOOGLE_ID=...
AUTH_GOOGLE_SECRET=...
PROVISION_HOST=https://api.convex.dev
```

**In Frontend Deployment (e.g., Vercel):**

```
VITE_CONVEX_URL=...
ANTHROPIC_API_KEY=...
GOOGLE_API_KEY=...
OPENAI_API_KEY=...
```

## Testing

### Local Testing

```bash
# Start Convex
npx convex dev

# Start frontend
pnpm run dev

# Visit http://127.0.0.1:5173
```

### Production Testing

1. Sign up with a test Google/GitHub account
2. Connect a test Convex team
3. Create a new project
4. Verify project appears in Convex dashboard
5. Build an app and verify deployment

## Breaking Changes

### For Users

- Users must now sign in with Google or GitHub instead of WorkOS
- Existing WorkOS sessions will be invalidated
- Users need to reconnect their Convex projects

### For Developers

- All WorkOS imports must be replaced with Convex Auth
- `useAuth()` from WorkOS replaced with `useAuthActions()` from Convex Auth
- Environment variables must be updated
- `signIn()` now requires a provider parameter: `signIn('google')`

## Migration Path for Existing Users

If you're migrating an existing Chef instance:

1. **Data Migration**: User sessions and memberships are preserved via `convexMembers` table
2. **Re-authentication**: Users must sign in again with Google/GitHub
3. **Project Reconnection**: Users may need to reconnect their Convex projects

The migration logic in `convex/sessions.ts` handles merging multiple member records when users authenticate.

## Security Improvements

1. **OAuth Standards**: Now uses industry-standard OAuth 2.0 flows
2. **Provider Security**: Leverages Google/GitHub's security infrastructure
3. **Token Management**: Convex Auth handles token refresh and validation
4. **Data Isolation**: Each user's data is completely isolated

## Performance Considerations

- No significant performance changes
- OAuth flows add minimal latency
- Token validation is handled by Convex Auth
- Session management remains efficient

## Monitoring & Debugging

Key things to monitor:

1. OAuth callback success rates
2. Session creation/validation errors
3. Convex project creation success rates
4. User authentication failures

Debug with:

- Browser DevTools Network tab (OAuth flows)
- Convex Dashboard logs
- Sentry error tracking (if configured)

## Support & Documentation

- **Multi-Tenant Deployment Guide**: `MULTI_TENANT_DEPLOYMENT.md`
- **Environment Variables**: `.env.example`
- **Convex Auth Docs**: https://docs.convex.dev/auth
- **OAuth Setup**: https://docs.convex.dev/platform-apis/oauth-applications

## Future Enhancements

Potential improvements:

- [ ] Add more OAuth providers (Microsoft, Apple, etc.)
- [ ] Implement email/password authentication
- [ ] Add 2FA support
- [ ] Custom branding per deployment
- [ ] Advanced user management features

## Conclusion

The migration to Convex Auth enables Chef to be deployed as a true multi-tenant SaaS application while maintaining all existing functionality. Each user now has complete control over their own Convex projects and billing.
