## Convex project provisioning auth

This document explains how this Chef fork uses a Convex OAuth application **only for project provisioning**, separate from end‑user authentication via WorkOS.

### Overview

- End‑user auth is handled by **WorkOS AuthKit** + Convex `customJwt` in `convex/auth.config.ts`.
- A separate **Convex OAuth application** (`CONVEX_OAUTH_CLIENT_ID` / `CONVEX_OAUTH_CLIENT_SECRET`) is used to:
  - let a logged‑in user authorize access to their Convex team, and
  - obtain a short‑lived application token to call Convex Platform APIs and fetch a project deploy key.
- Project provisioning can be globally enabled/disabled with the `ENABLE_CONVEX_PROVISIONING` feature flag.

### OAuth application: registration and verification

1. In the Convex dashboard, create an OAuth application for project provisioning.
2. Configure the **redirect URI** to point at this app’s callback route, e.g.:
   - `https://your-app.com/convex/callback` (production)
   - `http://127.0.0.1:5173/convex/callback` (local dev)
3. Copy the generated:
   - **Client ID** → `CONVEX_OAUTH_CLIENT_ID`
   - **Client secret** → `CONVEX_OAUTH_CLIENT_SECRET`
   and store them **only** in Convex / server‑side environment variables.

> The “Unverified” badge in the Convex dashboard only controls which teams can install the OAuth app.  
> It does **not** expose your secrets to users, and this project never sends the client secret to the browser.

### Where the Convex OAuth app is used

- `convex/convexProjects.ts`
  - Uses `CONVEX_OAUTH_CLIENT_ID` and `CONVEX_OAUTH_CLIENT_SECRET` (via `ensureEnvVar`) when calling Convex’s internal provisioning APIs to create a **project deploy key**.
  - Stores the deploy key in the `convexProjectCredentials` table and exposes it to the UI only where explicitly required (for connecting the generated project).
- `app/routes/api.convex.callback.ts`
  - Handles the `/convex/callback` route.
  - Reads the authorization `code` query parameter.
  - Exchanges it on the server for an application token by POSTing to the Convex OAuth token endpoint (`${PROVISION_HOST}/oauth/token`) with an `application/x-www-form-urlencoded` body containing:
    - `client_id`, `client_secret`, `grant_type=authorization_code`, `redirect_uri`, and `code`.
  - Uses the resulting token to request deployment credentials and **never** sends the token or client secret to the browser.

### Provisioning feature flag

- The `ENABLE_CONVEX_PROVISIONING` environment variable controls whether users can connect/provision Convex projects:
  - In `convex/convexProjects.ts`, `isProvisioningEnabled()` checks this flag and `startProvisionConvexProjectHelper` / `_connectConvexProjectForMember` throw a `ConvexError` when provisioning is disabled.
  - In the Remix route `app/routes/convex.connect.tsx`, the client‑side flag `VITE_ENABLE_CONVEX_PROVISIONING` determines whether to redirect the user to the Convex dashboard OAuth authorize URL or show a “connection disabled” message instead.
- Recommended values:
  - Local / staging while iterating: `ENABLE_CONVEX_PROVISIONING=true`, `VITE_ENABLE_CONVEX_PROVISIONING=true`.
  - Locked‑down production: set both flags to `false` to disable project provisioning entirely.

### Secrets and safety guarantees

- `CONVEX_OAUTH_CLIENT_SECRET` is **only** read on the server:
  - Convex functions (`convex/convexProjects.ts`) via `process.env`.
  - The Remix callback route (`app/routes/api.convex.callback.ts`) via `globalThis.process.env`.
- Project deploy keys and admin keys are never written into client bundles or front‑end environment variables.
- The only values exposed to the browser are:
  - `CONVEX_URL` (Convex deployment URL),
  - WorkOS client ID and redirect URI (for user auth),
  - Optional `VITE_ENABLE_CONVEX_PROVISIONING` and `VITE_DASHBOARD_HOST` flags.

Together, this ensures that Convex OAuth credentials and project deploy keys are **provisioning‑only** concerns, kept server‑side, and safe to use in a production deployment of this Chef fork.

