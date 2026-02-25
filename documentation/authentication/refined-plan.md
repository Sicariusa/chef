---
name: refined-auth-hardening-plan
overview: Use WorkOS-based user auth while hardening Convex OAuth project provisioning and documenting a production-ready configuration for your Chef fork.
todos:
  - id: audit-auth-envs
    content: Audit and document all auth-related environment variables and how to populate them for dev/staging/prod.
    status: pending
  - id: lockdown-oauth-usage
    content: Ensure Convex OAuth client secret and deploy keys are strictly server-side and documented as provisioning-only.
    status: pending
  - id: provisioning-feature-flag
    content: Add an ENABLE_CONVEX_PROVISIONING feature flag and gate Convex project provisioning in both UI and Convex functions.
    status: pending
  - id: auth-service-abstraction
    content: Introduce a small AuthService/useAppAuth wrapper so the app depends on a minimal auth API instead of WorkOS directly.
    status: pending
  - id: staging-auth-test
    content: Deploy to staging and fully test user sign-in/out and Convex project-provisioning flows with the hardened configuration.
    status: pending
  - id: update-root-config
    content: Review and update app/root.tsx to ensure only non-secret environment variables are exposed to the client and that redirect URIs are correct for production.
    status: pending
  - id: update-convex-projects
    content: Refactor convex/convexProjects.ts to read Convex OAuth-related env vars safely, respect ENABLE_CONVEX_PROVISIONING, and never expose secrets.
    status: pending
  - id: update-oauth-callback
    content: Update app/routes/api.convex.callback.ts to use the documented Convex OAuth token endpoint for exchanging authorization codes for tokens, keeping all secrets server-side.
    status: pending
  - id: update-auth-config
    content: Review convex/auth.config.ts to ensure the WorkOS customJwt provider is correctly configured and note how to change it for future Convex Auth or Clerk migrations.
    status: pending
  - id: create-auth-service-wrapper
    content: Implement the AuthService/useAppAuth abstraction and update ChefAuthWrapper.tsx to use it.
    status: pending
  - id: write-convex-provisioning-doc
    content: Add docs/convex-provisioning-auth.md describing Convex OAuth apps, unverified vs verified state, redirect URIs, and the provisioning OAuth flow used by this project.
    status: pending
  - id: update-readme
    content: Extend README.md with an Auth configuration section and link to the new provisioning documentation.
    status: pending
  - id: update-env-sample
    content: Create or update .env.example with placeholders for all required auth and provisioning environment variables.
    status: pending
  - id: production-security-review
    content: Perform a final security review to ensure no secrets leak to the client and the OAuth flow follows best practices (HTTPS, state parameter, error handling).
    status: pending
isProject: false
---

# Authentication Hardening and Documentation Plan

## Goal

Implement a simple, production-ready auth setup for your Chef fork that still lets users connect their own Convex projects, while clearly scoping Convex OAuth to project provisioning and keeping all secrets server-side.

## High-level approach

- Keep the existing **WorkOS + custom JWT** user auth path for now (no major architectural change).
- Harden and clearly separate **Convex OAuth** usage for project provisioning only.
- Add documentation, sample env files, and a small auth abstraction so future migrations to Convex Auth or Clerk are easy.

## Current architecture recap

- **Frontend auth**: `AuthKitProvider` + `ConvexProviderWithAuthKit` in `[app/root.tsx](app/root.tsx)` using WorkOS AuthKit and passing auth to Convex.
- **Convex auth config**: `[convex/auth.config.ts](convex/auth.config.ts)` defines a `customJwt` provider pointing at the WorkOS-based issuer (`https://apiauth.convex.dev/user_management/${WORKOS_CLIENT_ID}`) with JWKS at `https://apiauth.convex.dev/sso/jwks/${WORKOS_CLIENT_ID}`.
- **Session layer**: `[app/components/chat/ChefAuthWrapper.tsx](app/components/chat/ChefAuthWrapper.tsx)` manages `sessions` documents via `api.sessions.*` and ties WorkOS identity to Convex sessions.
- **Project provisioning**: `[convex/convexProjects.ts](convex/convexProjects.ts)` plus `[app/routes/api.convex.callback.ts](app/routes/api.convex.callback.ts)` use a Convex OAuth application (`CONVEX_OAUTH_CLIENT_ID/SECRET`) to call Convex Platform APIs and fetch project deploy keys.

## Detailed plan

### 1. Make the existing WorkOS-based user auth production-safe

1. **Audit and document auth-related environment variables**
  - Search the codebase for all env usages related to auth and Convex URLs (e.g. `WORKOS_CLIENT_ID`, `VITE_WORKOS_CLIENT_ID`, `VITE_WORKOS_API_HOSTNAME`, `VITE_WORKOS_REDIRECT_URI`, `WORKOS_REDIRECT_URI`, `VITE_CONVEX_URL`, `CONVEX_URL`, `CONVEX_OAUTH_CLIENT_ID`, `CONVEX_OAUTH_CLIENT_SECRET`, `PROVISION_HOST`, `BIG_BRAIN_HOST`, `ENABLE_CONVEX_PROVISIONING`).
  - Group them into: Remix server env, Vite client env, and Convex deployment env.
2. **Update `app/root.tsx` to expose only non-secret values**
  - In the `loader`, ensure only public values (Convex URL, WorkOS client ID, redirect URI) are returned in `ENV`.
  - Confirm that **client secrets** (e.g. `WORKOS_API_KEY`, `CONVEX_OAUTH_CLIENT_SECRET`) are never read from `import.meta.env` or sent to the browser.
  - Check `AuthKitProvider` props to ensure they are fed only from public env vars (e.g. `VITE_WORKOS_CLIENT_ID`, `VITE_WORKOS_API_HOSTNAME`, and a non-secret redirect URI).
3. **Verify WorkOS ↔ Convex JWT configuration**
  - Review `[convex/auth.config.ts](convex/auth.config.ts)` to ensure the `issuer` and `jwks` URLs match the WorkOS setup for your team.
  - Add a short note in comments or docs that this config is for **WorkOS-issued end-user tokens** and is separate from the Convex OAuth application used for provisioning.

### 2. Harden and clarify the Convex project provisioning OAuth flow

1. **Refactor `convex/convexProjects.ts` to use safe env access and a feature flag**
  - Centralize reading of `CONVEX_OAUTH_CLIENT_ID`, `CONVEX_OAUTH_CLIENT_SECRET`, `BIG_BRAIN_HOST`, and `ENABLE_CONVEX_PROVISIONING` in helper functions that throw if required values are missing.
  - In functions like `startProvisionConvexProject`, `connectConvexProjectForOauth`, and `_connectConvexProjectForMember`, enforce `ENABLE_CONVEX_PROVISIONING` – if false, abort gracefully (e.g. throw a `ConvexError` with a clear message).
  - Confirm no project deploy keys or admin keys are ever returned to the client except where explicitly needed (and then only via Convex queries that you control).
2. **Implement the documented Convex OAuth token exchange in `api.convex.callback.ts`**
  - Ensure the Remix loader reads the `code` (and `state`) query parameters from the callback URL.
  - Replace any custom token-exchange logic with a POST to the **Convex OAuth token endpoint** documented in the Convex OAuth docs (e.g. `https://api.convex.dev/oauth/token`), sending an `application/x-www-form-urlencoded` body with:
    - `client_id`, `client_secret`, `grant_type=authorization_code`, `redirect_uri`, `code`, and `state` if required.
  - Use the token response (e.g. `access_token`) strictly on the server to call Convex Platform APIs, or to hand off to `convex/convexProjects.ts` via Convex internal functions.
  - Handle error responses (non-2xx HTTP) by logging server-side details and returning a generic error JSON/status to the client without leaking sensitive info.
3. **Clearly separate provisioning OAuth from user auth**
  - Ensure `CONVEX_OAUTH_CLIENT_ID/SECRET` are referenced only in `convex/convexProjects.ts`, `api.convex.callback.ts`, or other server-only code paths.
  - Confirm that the Convex OAuth app’s redirect URIs (including `/convex/callback`) match what is configured in the Convex dashboard and are all HTTPS in production.
4. **Add a provisioning feature flag across UI and backend**
  - Introduce an `ENABLE_CONVEX_PROVISIONING` env variable.
  - In any UI components that offer “Connect to a Convex project” (e.g. connection buttons in chat UIs), hide or disable them when the flag is false.
  - In Convex functions, use the same flag to short-circuit provisioning operations to avoid inconsistent states.

### 3. Introduce an auth abstraction to ease future migrations

1. **Create an `AuthService` / `useAppAuth` wrapper**
  - Implement a small hook or module (e.g. `app/lib/auth/useAppAuth.ts`) that wraps WorkOS AuthKit and `useConvexAuth`.
  - Expose a minimal interface:
    - `isAuthenticated`, `isLoading`, `getAccessToken()`, `signIn()`, `signOut()`.
  - Update `[ChefAuthWrapper.tsx](app/components/chat/ChefAuthWrapper.tsx)` to depend on this abstraction instead of directly importing `useAuth` from `@workos-inc/authkit-react`.
2. **Document Convex Auth and Clerk migration paths (no code changes yet)**
  - In comments or a short doc section, outline how `AuthService` would be reimplemented using:
    - **Convex Auth**: swap `AuthKitProvider` for Convex Auth’s provider, update `convex/auth.config.ts` to use a Convex Auth provider, and change `useAppAuth` to use Convex Auth hooks.
    - **Clerk**: use Clerk components/hooks for the UI, adjust `convex/auth.config.ts` issuer/jwks to Clerk’s, and adapt `useAppAuth` to call Clerk APIs.
  - Keep this strictly as documentation so current WorkOS-based behavior remains stable.

### 4. Documentation, env samples, and security review

1. **Write `docs/convex-provisioning-auth.md`**
  - Explain what a Convex OAuth application is, how to create one in the Convex dashboard, what “Unverified” vs “Verified” means, and that this app is only used for project provisioning in your fork.
    - Describe the three key steps of the OAuth flow: authorize URL redirect, callback with `code`/`state`, and server-side token exchange.
2. **Update the main `README.md` with an "Auth configuration" section**
  - List all required env vars (WorkOS, Convex URLs, Convex OAuth, provisioning feature flag) grouped by environment (dev, staging, prod).
    - Provide example values or patterns (e.g. dev redirect URI `http://127.0.0.1:5173`, prod redirect `https://your-app.com/...`).
    - Link to `docs/convex-provisioning-auth.md` for deeper details.
3. **Create or update `.env.example`**
  - Include placeholders for every environment variable used by auth and provisioning, with comments indicating which are required for production and which are optional/local.
4. **Run a focused security review and staging test**
  - Search for any remaining usages of `CONVEX_OAUTH_CLIENT_SECRET`, deploy keys, or admin keys in client bundles; ensure they exist only in Convex env or server-side code.
    - Confirm all OAuth and Platform API endpoints are HTTPS.
    - Deploy to a staging environment, run through:
      - WorkOS sign-in/sign-out.
      - Starting a chat and verifying sessions.
      - Connecting a Convex project (when `ENABLE_CONVEX_PROVISIONING=true`), and confirm credentials are stored only in Convex tables.
    - Fix any issues found and update docs if behavior differs from expectations.

