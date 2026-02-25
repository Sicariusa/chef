---
name: simplify-auth-for-chef-fork
overview: Replace the current Convex control-plane/WorkOS based authentication with a production-ready approach while preserving the ability for users to connect and provision their own Convex projects.
todos:
  - id: audit-auth-envs
    content: Audit all auth-related env vars (WorkOS, Convex URL, OAuth client) and document how to configure them for dev/staging/prod.
    status: pending
  - id: lockdown-oauth-usage
    content: Ensure Convex OAuth app (CONVEX_OAUTH_CLIENT_ID/SECRET) is used only server-side for project provisioning and clearly documented as such.
    status: pending
  - id: provisioning-feature-flag
    content: Add an ENABLE_CONVEX_PROVISIONING flag to gate Convex project provisioning in both UI and Convex functions.
    status: pending
  - id: auth-service-abstraction
    content: Create an AuthService/useAppAuth wrapper so components don’t depend directly on WorkOS APIs, easing future migration to Convex Auth or Clerk.
    status: pending
  - id: staging-auth-test
    content: Deploy to staging and fully test user sign-in/out and Convex project provisioning flows with the hardened configuration.
    status: pending
isProject: false
---

## Goal

Implement a **simple, production-ready auth setup** for your Chef fork **that still lets users connect their own Convex projects**, while avoiding the unverified Convex OAuth app limitations you are worried about.

## High-level approach

- **Keep the existing WorkOS + custom JWT auth path for now** (it already works and is wired through the app), and
- **Minimize and harden the Convex OAuth usage** so it is clearly scoped to project provisioning and safe for production.
- Optionally, define a clear path to later migrate to **Convex Auth** or **Clerk** without breaking the Convex provisioning flow.

## Current architecture recap

- **Frontend auth**: `AuthKitProvider` + `ConvexProviderWithAuthKit` in `[app/root.tsx](app/root.tsx)` uses WorkOS AuthKit and passes auth state to Convex.
- **Convex auth config**: `[convex/auth.config.ts](convex/auth.config.ts)` defines a `customJwt` provider pointing at WorkOS (`apiauth.convex.dev/user_management/${WORKOS_CLIENT_ID}`).
- **Chef session layer**: `[app/components/chat/ChefAuthWrapper.tsx](app/components/chat/ChefAuthWrapper.tsx)` manages sessions stored in the `sessions` table via `api.sessions.`* queries/mutations.
- **Convex project provisioning**: `[convex/convexProjects.ts](convex/convexProjects.ts)` and `[app/routes/api.convex.callback.ts](app/routes/api.convex.callback.ts)` use **Convex OAuth (CONVEX_OAUTH_CLIENT_ID/SECRET)** to create/authorize Convex projects for the user.

## Detailed plan

### 1. Make the existing WorkOS-based user auth production-safe

- **1.1 Verify and document required env vars**
  - List all auth-related env vars used in the code (e.g. `WORKOS_CLIENT_ID`, `VITE_WORKOS_CLIENT_ID`, `VITE_WORKOS_API_HOSTNAME`, `WORKOS_REDIRECT_URI`, `CONVEX_URL`).
  - Add a short **“Auth configuration”** section to `README.md` documenting:
    - Which values go into your Remix runtime env vs. Vite `import.meta.env`.
    - How to configure WorkOS app redirect URIs for **production domain** (e.g. `https://your-app.com/auth/callback`).
- **1.2 Lock down public URLs
  - Ensure no secrets (client secrets, deploy keys, admin keys) are ever exposed in the browser: confirm they are only in Convex environment variables or backend loaders.
  - Review `app/root.tsx` and any sign-in routes to make sure only the **WorkOS client ID** and `CONVEX_URL` are sent to the client.
- **1.3 Confirm WorkOS <-> Convex JWT wiring**
  - Cross-check `convex/auth.config.ts` with your WorkOS JWKS endpoint and issuer.
  - Add a brief comment or README note that this `customJwt` provider is for **WorkOS-issued user tokens**, separate from the Convex OAuth app.

### 2. Harden and clarify the Convex project provisioning OAuth flow

- **2.1 Isolate provisioning OAuth config**
  - In `[convex/convexProjects.ts](convex/convexProjects.ts)` and `[app/routes/api.convex.callback.ts](app/routes/api.convex.callback.ts)`, clearly separate the **Convex OAuth app** usage from user auth:
    - Keep `CONVEX_OAUTH_CLIENT_ID/SECRET` strictly on the server (Convex env vars and Remix loader).
    - Confirm redirect URIs are only server-side (`/convex/callback` and any dashboard URLs) and match your Convex dashboard configuration.
- **2.2 Document the unverified app behavior**
  - Add a short doc section (e.g. `docs/convex-provisioning-auth.md`) explaining that:
    - The Convex OAuth app is **only** used to authorize access to the Convex Platform APIs for project provisioning.
    - "Unverified" in the Convex dashboard just limits which teams can install the app; it doesn’t leak secrets to end users.
    - Production recommendation: you can keep this app **restricted to your own Convex team** if your users don’t need to install it on arbitrary Convex teams.
- **2.3 Optional: gate advanced provisioning behind a feature flag**
  - Add a boolean env flag like `ENABLE_CONVEX_PROVISIONING`.
  - In UI components that offer “Connect to a Convex project”, hide or disable this feature when the flag is `false`.
  - In Convex functions (`startProvisionConvexProject`, `connectConvexProjectForOauth`), early-return or throw a controlled error if provisioning is disabled.
  - This gives you a simple “safe default” production mode while you finalize OAuth verification.

### 3. Prepare a future path to a simpler provider (Convex Auth or Clerk)

Even if we don’t switch providers immediately (to keep things fast/simple), we can plan the migration seams now.

- **3.1 Extract an internal `AuthService` interface on the frontend**
  - In `ChefAuthWrapper` and any other auth-consuming components, standardize on a minimal interface:
    - `isAuthenticated`, `isLoading`, `getAccessToken()` (if needed), `signIn()`, `signOut()`.
  - Implement this using **WorkOS** today, possibly in a small wrapper hook (e.g. `useAppAuth()`).
  - This abstraction will make swapping WorkOS → Convex Auth or Clerk much simpler later.
- **3.2 Sketch Convex Auth migration (optional, not executed yet)**
  - Note which pieces would change if you move to Convex Auth:
    - Replace `AuthKitProvider`/`ConvexProviderWithAuthKit` with `ConvexProviderWithConvexAuth` (or equivalent from docs).
    - Update `convex/auth.config.ts` to use `convex auth` provider instead of `customJwt`.
    - Replace WorkOS-specific calls in `ChefAuthWrapper` (e.g. `getAccessToken`) with Convex Auth hooks.
  - Ensure Convex project provisioning stays server-side and continues to use the Convex OAuth app unchanged.
- **3.3 Sketch Clerk migration (alternative path)**
  - If you later prefer Clerk, plan to:
    - Replace WorkOS UI with Clerk components and hooks.
    - Change `convex/auth.config.ts` `customJwt` issuer/jwks to point at Clerk instead of WorkOS.
    - Update the `AuthService` implementation to call Clerk APIs instead of WorkOS.

### 4. Testing & validation

- **4.1 Local testing**
  - Run through flows in dev:
    - Sign-in and sign-out with WorkOS.
    - Start a chat, ensure sessions are created and persisted (`ChefAuthWrapper` works as expected).
    - Trigger the “connect Convex project” flow and confirm:
      - OAuth redirect goes to `auth.convex.dev` or `api.convex.dev` with your Convex OAuth client.
      - After callback, a project and deploy key are created and stored in Convex (`convexProjectCredentials` table).
- **4.2 Production-like testing**
  - Deploy to a staging environment with your production-like domain.
  - Verify:
    - WorkOS redirect URIs and callback work correctly on the staging domain.
    - Convex provisioning callback (`/convex/callback`) works and secrets remain strictly server-side.
    - Feature flag for provisioning behaves as expected.
- **4.3 Security review checklist**
  - Confirm no `CONVEX_OAUTH_CLIENT_SECRET`, project deploy keys, or admin keys are logged or sent to the browser.
  - Ensure all tokens are stored in Convex env vars or encrypted storage, and that any errors in OAuth flows return generic messages to the client.

## Todos

- `audit-auth-envs`: Audit and document all auth-related environment variables and how to populate them for dev/staging/prod.
- `lockdown-oauth-usage`: Ensure Convex OAuth client secret and deploy keys are strictly server-side and documented as provisioning-only.
- `provisioning-feature-flag`: Add an `ENABLE_CONVEX_PROVISIONING` feature flag and gate UI + Convex functions accordingly.
- `auth-service-abstraction`: Introduce a small `AuthService`/`useAppAuth` wrapper so the app depends on a minimal auth API instead of WorkOS directly.
- `staging-auth-test`: Run full sign-in and Convex project‑provisioning flows on a staging deployment and fix any issues.

