# Quick Start: Multi-Tenant Chef Deployment

## 🎯 What You're Building

A multi-tenant Chef instance where users:

- Sign in with Google or GitHub
- Connect their own Convex accounts
- Create and manage their own projects
- Pay for their own usage

## 📋 Prerequisites

1. A Convex account ([sign up free](https://dashboard.convex.dev))
2. Google OAuth credentials OR GitHub OAuth credentials
3. API keys for at least one AI provider (Anthropic, OpenAI, Google AI, etc.)

## 🚀 Setup (5 Steps)

### Step 1: Get OAuth Credentials

**Google OAuth** (Recommended):

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create project → APIs & Services → Credentials
3. Create OAuth 2.0 Client ID
4. Add redirect URI: `http://127.0.0.1:5173/api/auth/callback/google`
5. Copy Client ID and Secret

**GitHub OAuth** (Alternative):

1. GitHub Settings → Developer settings → OAuth Apps → New
2. Callback URL: `http://127.0.0.1:5173/api/auth/callback/github`
3. Copy Client ID and Secret

### Step 2: Create Convex OAuth App

1. Go to [Convex OAuth Apps](https://dashboard.convex.dev/team/settings/applications/oauth-apps)
2. Create new OAuth application
3. Redirect URI: `http://127.0.0.1:5173/api/convex/callback`
4. Copy OAuth Client ID and Secret

### Step 3: Clone and Setup

```bash
# Clone the repo
git clone https://github.com/get-convex/chef.git
cd chef

# Install dependencies
nvm install
nvm use
npm install -g pnpm
pnpm install

# Setup Convex
echo 'VITE_CONVEX_URL=placeholder' >> .env.local
npx convex dev --once  # Follow prompts to create project
```

### Step 4: Configure Environment

In Convex Dashboard (Settings → Environment Variables):

```bash
CONVEX_OAUTH_CLIENT_ID=<from step 2>
CONVEX_OAUTH_CLIENT_SECRET=<from step 2>
AUTH_GOOGLE_ID=<from step 1>
AUTH_GOOGLE_SECRET=<from step 1>
PROVISION_HOST=https://api.convex.dev
```

In `.env.local` file:

```bash
# Add at least one AI API key
ANTHROPIC_API_KEY=sk-ant-...
# OR
OPENAI_API_KEY=sk-...
# OR
GOOGLE_API_KEY=...
```

### Step 5: Run Chef

```bash
# Terminal 1: Start Convex
npx convex dev

# Terminal 2: Start Chef
pnpm run dev

# Visit http://127.0.0.1:5173
```

## ✅ Test Your Setup

1. Click "Sign in with Google" (or GitHub)
2. Authorize the app
3. Start a new chat
4. Select a Convex team when prompted
5. Click "Connect" to authorize project creation
6. Wait for project to be created
7. Start building! 🎉

## 🌍 Deploy to Production

### Vercel (Recommended)

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Deploy
vercel

# 3. Add environment variables in Vercel dashboard
# 4. Update OAuth redirect URIs to your production domain:
#    - https://yourdomain.com/api/auth/callback/google
#    - https://yourdomain.com/api/convex/callback
```

### Other Platforms

```bash
# Build
pnpm run build

# Deploy the build output to your platform
# Make sure to set all environment variables
```

## 📚 More Information

- **Complete Guide**: See `MULTI_TENANT_DEPLOYMENT.md`
- **Migration Info**: See `MIGRATION_SUMMARY.md`
- **Environment Variables**: See `.env.example`

## 🆘 Troubleshooting

**Can't sign in?**

- Check OAuth redirect URIs match exactly
- Verify CLIENT_ID and SECRET are correct
- Clear browser cookies and try again

**Can't create projects?**

- Verify Convex OAuth credentials are set
- Check you have permission to create projects in your team
- Look at Convex dashboard logs for errors

**Missing environment variables?**

- Check Convex dashboard → Settings → Environment Variables
- Check `.env.local` file in project root
- Restart `npx convex dev` after changes

## 🎓 What's Different from Original Chef

| Feature              | Original Chef        | Multi-Tenant Chef   |
| -------------------- | -------------------- | ------------------- |
| Sign In              | WorkOS (Convex team) | Google/GitHub       |
| Who Pays             | Convex               | Each user           |
| Project Ownership    | Shared               | User's own account  |
| Deployment Model     | Single instance      | Your own instance   |
| User Limit           | Convex team only     | Unlimited           |
| Authentication Setup | Built-in             | You configure OAuth |

## 🔐 Security Notes

- Always use HTTPS in production
- Keep OAuth secrets secure (environment variables only)
- Regularly update dependencies
- Monitor for suspicious activity
- Each user's data is completely isolated

## 💡 Tips

1. **Start with Google OAuth** - Easier setup than GitHub
2. **Use Vercel** - Simplest deployment platform
3. **Get API keys** - You need at least one AI provider
4. **Test locally first** - Make sure everything works before deploying
5. **Read the docs** - `MULTI_TENANT_DEPLOYMENT.md` has all the details

## 🎉 You're Ready!

Your multi-tenant Chef instance is ready to go. Users can now:

✅ Sign up independently  
✅ Connect their Convex accounts  
✅ Create and manage projects  
✅ Build amazing apps with AI assistance

Happy cooking! 👨‍🍳
