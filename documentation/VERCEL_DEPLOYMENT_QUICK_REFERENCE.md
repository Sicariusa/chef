# Vercel Deployment - Quick Reference

## Quick Setup

### 1. Get Vercel Token
- Visit: https://vercel.com/account/tokens
- Create token → Copy it

### 2. Add to `.env.local`
```env
VERCEL_TOKEN=your_token_here
```

### 3. Restart Dev Server
```bash
pnpm run dev
```

### 4. Deploy
Click "Deploy" button in Chef → Done! 🚀

---

## Environment Variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `VERCEL_TOKEN` | ✅ Yes | Your Vercel API token |
| `VERCEL_TEAM_ID` | ❌ No | Deploy to team account |
| `VERCEL_PROJECT_ID` | ❌ No | Link to existing project |

---

## Deployment Steps

1. **Build** your project in Chef (happens automatically)
2. **Click** "Deploy" button
3. **Wait** for "Deployed" status
4. **Click** "View site" to open

**Note**: The deployment URL persists across page refreshes - the "View site" button will automatically reappear when you return!

---

## File Handling

- **Text files** (HTML, CSS, JS) → Sent as UTF-8 strings
- **Binary files** (images, fonts) → Sent as base64

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "VERCEL_TOKEN required" | Add token to `.env.local` and restart server |
| Base64 content showing | Update to latest code (text files now sent as UTF-8) |
| Site doesn't load | Check `index.html` exists in `dist` folder |
| Files missing | Verify files are in `dist` after build |

---

## Deployment Logs

Watch server console for `[Deploy]` messages:
- File processing progress
- Deployment status
- Error details

---

## Quick Commands

```bash
# Check if Vercel CLI is installed
vercel --version

# Login to Vercel (if needed)
vercel login

# View deployments
vercel ls
```

---

## Deployment URL Format

```
https://{project-name}-{hash}-{team}.vercel.app
```

Example:
```
https://my-project-abc123-sicariusas-projects.vercel.app
```

**URL Handling**:
- ✅ URLs are automatically normalized (removes Convex prefixes)
- ✅ Only valid Vercel URLs are stored
- ✅ URLs persist across page refreshes
- ✅ Each project has its own deployment URL stored separately

---

## What Gets Deployed

✅ **Included**:
- Files from `dist/` folder
- Built HTML, CSS, JS
- Images and assets

❌ **Not Included**:
- Source files (`src/`)
- `node_modules/`
- Development files
- `.env.local`

---

## Project Settings (Auto-Configured)

- Framework: None (static)
- Build Command: None (pre-built)
- Output Directory: Root
- Target: Production

---

## Common File Types

**Text (UTF-8)**:
- `.html`, `.css`, `.js`, `.json`
- `.svg`, `.md`, `.txt`

**Binary (Base64)**:
- `.png`, `.jpg`, `.gif`, `.webp`
- `.woff`, `.woff2`, `.ttf`

---

## Success Indicators

✅ **Deployment Successful**:
- Button shows "Deployed" with checkmark
- "View site" button appears
- Toast notification shows URL
- Server logs show "Deployment successful"
- **URL persists** - "View site" button remains after page refresh

---

## Error Messages

| Error | Meaning |
|-------|---------|
| `VERCEL_TOKEN required` | Token not set in environment |
| `No file provided` | Build failed or no dist folder |
| `Invalid request: files should be array` | Code issue (should be fixed) |
| `projectSettings required` | Code issue (should be fixed) |

---

## Next Steps After Deployment

1. **Set Custom Domain** (optional)
   - Vercel Dashboard → Project → Settings → Domains

2. **Add Environment Variables** (if needed)
   - Vercel Dashboard → Project → Settings → Environment Variables

3. **Enable Analytics** (optional)
   - Vercel Dashboard → Project → Analytics

---

## Quick Links

- **Get Token**: https://vercel.com/account/tokens
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Vercel Docs**: https://vercel.com/docs
- **Chef Docs**: https://docs.convex.dev/chef

---

## Tips

💡 **Always build before deploying** - Check for errors first

💡 **Check file sizes** - Large files slow deployment

💡 **Monitor logs** - Server console shows detailed progress

💡 **Use Vercel dashboard** - View deployment history and logs

💡 **Keep token secure** - Never commit to git

💡 **Deployment persists** - URL is saved and "View site" button reappears after refresh

💡 **URL normalization** - System automatically ensures only valid Vercel URLs are used

---

## State Persistence

The deployment URL is automatically saved to browser localStorage:
- **Key**: `deployment_{chatId}` (unique per project)
- **Stored**: Vercel URL + file update counter
- **Auto-restore**: "View site" button appears automatically on page load
- **Per-project**: Each project maintains its own deployment state

---

**Need More Details?** See `VERCEL_DEPLOYMENT_DETAILED.md`

