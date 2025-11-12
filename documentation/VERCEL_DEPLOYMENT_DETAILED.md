# Vercel Deployment - Detailed Guide

## Overview

This guide provides comprehensive information about deploying Chef-built projects to Vercel. The deployment system has been integrated directly into Chef's Deploy button, allowing you to deploy your built projects to Vercel with a single click.

## Table of Contents

1. [How It Works](#how-it-works)
2. [Prerequisites](#prerequisites)
3. [Setup Instructions](#setup-instructions)
4. [Deployment Process](#deployment-process)
5. [Configuration Options](#configuration-options)
6. [Troubleshooting](#troubleshooting)
7. [Understanding the Deployment Flow](#understanding-the-deployment-flow)
8. [URL Handling and Normalization](#url-handling-and-normalization)
9. [File Format Handling](#file-format-handling)
10. [Project Settings](#project-settings)
11. [Deployment State Management](#deployment-state-management)
12. [Best Practices](#best-practices)

## How It Works

When you click the "Deploy" button in Chef:

1. **Build Phase**: Chef builds your project using Vite inside the WebContainer
2. **Package Phase**: The built files from the `dist` folder are packaged into a ZIP file
3. **Extract Phase**: The ZIP is extracted and files are processed
4. **Format Phase**: Files are formatted correctly for Vercel's API:
   - Text files (HTML, CSS, JS, etc.) → UTF-8 strings
   - Binary files (images, fonts, etc.) → Base64-encoded strings
5. **Deploy Phase**: Files are sent to Vercel's deployment API
6. **Result**: Your site is live at a Vercel URL

## Prerequisites

### Required

- **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
- **Vercel Token**: Get your API token from [vercel.com/account/tokens](https://vercel.com/account/tokens)
- **Chef Project**: A project built in Chef

### Optional

- **Vercel Team ID**: If deploying to a team account
- **Vercel Project ID**: If linking to an existing Vercel project

## Setup Instructions

### Step 1: Get Your Vercel Token

1. Go to [vercel.com/account/tokens](https://vercel.com/account/tokens)
2. Click "Create Token"
3. Give it a name (e.g., "Chef Deployment")
4. Set expiration (or leave as "No expiration")
5. Click "Create Token"
6. **Copy the token immediately** (you won't be able to see it again)

### Step 2: Add Token to Environment Variables

Add the token to your `.env.local` file in the Chef project root:

```env
VERCEL_TOKEN=your_vercel_token_here
```

### Step 3: Optional Configuration

If you want to deploy to a team or link to an existing project:

```env
VERCEL_TOKEN=your_vercel_token_here
VERCEL_TEAM_ID=your_team_id_here          # Optional: for team deployments
VERCEL_PROJECT_ID=your_project_id_here    # Optional: link to existing project
```

### Step 4: Restart Your Dev Server

After adding environment variables, restart your Chef dev server:

```bash
# Stop the server (Ctrl+C)
# Then restart
pnpm run dev
```

## Deployment Process

### Using the Deploy Button

1. **Build Your Project**: Make sure your project builds successfully in Chef
2. **Click Deploy**: Click the "Deploy" button in Chef's header
3. **Wait for Deployment**: The button will show progress:
   - "Building..." - Building your project
   - "Creating package..." - Packaging files
   - "Deploying..." - Uploading to Vercel
   - "Deployed" ✓ - Success!
4. **View Your Site**: Click "View site" to open your deployed application

### Deployment State Persistence

The deployment status and URL are automatically saved and persist across page refreshes:

- **Automatic Storage**: When deployment succeeds, the URL is saved to browser localStorage
- **Per-Project Storage**: Each project/chat has its own deployment URL stored separately
- **Auto-Restore**: When you refresh the page or return to a project, the "View site" button automatically reappears with the correct URL
- **URL Normalization**: The system ensures only valid Vercel URLs are stored (removes any Convex prefixes or invalid URLs)

**Note**: The deployment status is stored locally in your browser. If you clear browser data or use a different browser, you'll need to deploy again.

### What Gets Deployed

Only files from the `dist` folder (built output) are deployed:
- `index.html` - Your main HTML file
- `assets/*.js` - JavaScript bundles
- `assets/*.css` - CSS stylesheets
- `assets/*.png`, `assets/*.jpg`, etc. - Images and other assets
- Any other files in the `dist` folder

**Note**: Source files, `node_modules`, and development files are NOT deployed.

## Configuration Options

### Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `VERCEL_TOKEN` | Yes | Your Vercel API token | `vercel_abc123...` |
| `VERCEL_TEAM_ID` | No | Team ID for team deployments | `team_xyz789` |
| `VERCEL_PROJECT_ID` | No | Existing project ID to link to | `prj_abc123` |

### Project Settings

When creating a new project, Vercel automatically configures it as a static site with:
- **Framework**: None (static files)
- **Build Command**: None (files are pre-built)
- **Output Directory**: Root (files are at root level)
- **Install Command**: None

These settings are automatically applied and don't need manual configuration.

## Troubleshooting

### Error: "VERCEL_TOKEN environment variable is required"

**Solution**: 
1. Make sure you've added `VERCEL_TOKEN` to your `.env.local` file
2. Restart your dev server
3. Verify the token is correct (no extra spaces, quotes, etc.)

### Error: "Invalid request: `files` should be array"

**Solution**: This is a code issue that has been fixed. If you see this, make sure you're using the latest version of the deployment code.

### Error: "The `projectSettings` object is required"

**Solution**: This is automatically handled now. If you see this error, it means the code needs to be updated.

### Deployment Shows Base64 Content Instead of Website

**Solution**: This has been fixed. Text files are now sent as UTF-8 strings instead of base64. If you still see this:
1. Make sure you're using the latest code
2. Try deploying again
3. Check the server logs for file processing details

### Deployment Succeeds But Site Doesn't Load

**Possible Causes**:
1. **Missing `index.html`**: Make sure your build creates an `index.html` file
2. **Incorrect file paths**: Check that asset paths in your HTML are relative (e.g., `/assets/file.js` not `./assets/file.js`)
3. **CORS issues**: Vercel handles CORS automatically, but check your code
4. **Build errors**: Check that your project builds successfully before deploying

### Files Not Appearing on Deployed Site

**Check**:
1. Verify files are in the `dist` folder after building
2. Check file paths are correct (case-sensitive)
3. Ensure files aren't being filtered out by `.gitignore` or build config
4. Check Vercel deployment logs in the Vercel dashboard

## Understanding the Deployment Flow

### 1. Build Process (in Chef)

```typescript
// Chef builds your project
vite build --mode development
// Creates dist/ folder with:
// - index.html
// - assets/index-*.js
// - assets/index-*.css
// - other assets
```

### 2. Packaging Process

```typescript
// Files from dist/ are zipped
const zip = new JSZip();
await addFilesToZip(container, zip, 'dist');
const zipBlob = await zip.generateAsync({ type: 'blob' });
```

### 3. Server Processing

```typescript
// Server receives ZIP and extracts it
const zip = await JSZip.loadAsync(zipBuffer);

// Files are processed:
// - Text files → UTF-8 strings
// - Binary files → Base64 strings

// Sent to Vercel API as:
files: [
  { file: "index.html", data: "<!doctype html>..." },
  { file: "assets/image.png", data: "iVBORw0KGgo..." }
]
```

### 4. Vercel Deployment

Vercel receives the files and:
1. Creates a new project (if `VERCEL_PROJECT_ID` not set)
2. Uploads files to their CDN
3. Configures routing
4. Returns deployment URL

## URL Handling and Normalization

### Automatic URL Normalization

The deployment system automatically normalizes URLs to ensure only valid Vercel URLs are used:

- **Removes Convex Prefixes**: Any URLs containing `.convex.app` domains are filtered out
- **Ensures HTTPS**: URLs are automatically prefixed with `https://` if missing
- **Validates Vercel Domain**: Only URLs containing `vercel.app` are accepted
- **Handles Edge Cases**: Extracts Vercel URLs from embedded strings if needed

### URL Storage

- **LocalStorage Key**: `deployment_{chatId}` - Stores deployment URL per project
- **Data Stored**: 
  - `url`: The normalized Vercel deployment URL
  - `updateCounter`: File update counter to detect if redeployment is needed
- **Automatic Cleanup**: Invalid or non-Vercel URLs are automatically filtered out

### Example URL Formats

**Valid URLs** (accepted):
- `https://my-project.vercel.app`
- `https://my-project-abc123.vercel.app`
- `my-project.vercel.app` (automatically prefixed with `https://`)

**Invalid URLs** (filtered out):
- `https://something.convex.app/...` (Convex domain)
- `http://example.com` (not a Vercel domain)
- Relative URLs without domain

## File Format Handling

### Text Files (Sent as UTF-8 Strings)

These file types are decoded to UTF-8 strings:
- `.html` - HTML files
- `.css` - Stylesheets
- `.js` - JavaScript files
- `.json` - JSON data
- `.txt` - Text files
- `.xml` - XML files
- `.svg` - SVG images (text-based)
- `.md` - Markdown files
- `.mjs` - ES modules
- `.ts`, `.tsx`, `.jsx` - TypeScript/React files

**Why**: Vercel can serve these directly without decoding, and it's more efficient.

### Binary Files (Sent as Base64)

These file types are sent as base64-encoded strings:
- `.png`, `.jpg`, `.jpeg`, `.gif`, `.webp` - Images
- `.woff`, `.woff2`, `.ttf`, `.otf` - Fonts
- `.pdf` - PDF documents
- `.zip`, `.tar`, `.gz` - Archives
- Any other binary format

**Why**: Binary data must be base64-encoded for JSON transmission.

## Project Settings

### Automatic Configuration

When deploying a new project, these settings are automatically applied:

```json
{
  "framework": null,
  "buildCommand": null,
  "devCommand": null,
  "installCommand": null,
  "outputDirectory": null,
  "rootDirectory": null
}
```

This tells Vercel:
- No framework detection needed
- Files are already built
- Serve files as-is from root

### Customizing Settings

If you need different settings, you can:
1. Create the project manually in Vercel dashboard first
2. Get the `VERCEL_PROJECT_ID`
3. Set it in your `.env.local`
4. Vercel will use the project's existing settings

## Deployment State Management

### How State Persistence Works

The deployment button maintains state across page refreshes using browser localStorage:

1. **On Successful Deployment**:
   - The Vercel URL is normalized (ensures it's a valid Vercel URL)
   - URL and update counter are saved to localStorage with key `deployment_{chatId}`
   - Button state changes to "Deployed" with "View site" button visible

2. **On Page Load/Refresh**:
   - Component checks localStorage for stored deployment URL
   - If found and valid, restores the "Deployed" state
   - "View site" button appears automatically

3. **On Project Switch**:
   - When switching to a different project (different chatId), the component loads that project's deployment status
   - Each project maintains its own deployment state

### State Storage Format

```typescript
{
  url: "https://project-name.vercel.app",
  updateCounter: 12345
}
```

### Clearing Deployment State

To clear a project's deployment state:
1. Open browser DevTools (F12)
2. Go to Application/Storage → Local Storage
3. Find key `deployment_{chatId}` (replace `{chatId}` with your actual chat ID)
4. Delete the entry
5. Refresh the page

## Best Practices

### 1. Build Before Deploying

Always ensure your project builds successfully:
- Check for build errors in Chef's terminal
- Verify `dist` folder contains expected files
- Test locally if possible

### 2. Check File Sizes

Large files can slow deployment:
- Optimize images before building
- Use modern formats (WebP, AVIF)
- Consider CDN for very large assets

### 3. Environment Variables

For production deployments:
- Set environment variables in Vercel dashboard
- Don't commit secrets to code
- Use Vercel's environment variable system

### 4. Monitor Deployments

- Check Vercel dashboard for deployment status
- Review build logs if deployment fails
- Use Vercel's analytics for performance

### 5. Version Control

- Keep your Chef project code in version control
- Use "Download Code" to backup your work
- Document any custom configurations

## Advanced Topics

### Linking to Existing Projects

If you want to deploy to an existing Vercel project:

1. Go to your Vercel project settings
2. Find the Project ID (in General settings)
3. Add to `.env.local`:
   ```env
   VERCEL_PROJECT_ID=prj_abc123xyz
   ```
4. Deployments will now update that project instead of creating new ones

### Team Deployments

To deploy to a team account:

1. Get your team ID from Vercel dashboard
2. Add to `.env.local`:
   ```env
   VERCEL_TEAM_ID=team_xyz789
   ```
3. All deployments will be under that team

### Custom Domains

After deployment:
1. Go to Vercel dashboard → Your Project → Settings → Domains
2. Add your custom domain
3. Configure DNS as instructed
4. Vercel will handle SSL automatically

## Deployment Logs

The deployment process logs detailed information:

```
[Deploy] Starting deployment process...
[Deploy] Received deployment request: { fileName: 'dist.zip', fileSize: 439027, projectName: 'my-project' }
[Deploy] Vercel token found, proceeding with deployment
[Deploy] Extracting zip file...
[Deploy] Zip file size: 439027 bytes
[Deploy] Zip file loaded, processing files...
[Deploy] Processing file 1: index.html
[Deploy] File index.html sent as UTF-8 text (1234 chars)
[Deploy] Processing file 2: assets/image.png
[Deploy] File assets/image.png sent as base64 (45678 bytes)
[Deploy] File extraction complete: 4 files, total size: 570.92 KB
[Deploy] Preparing deployment payload...
[Deploy] Project ID: Not set (will create new project)
[Deploy] Project name: my-project
[Deploy] Deployment URL: https://api.vercel.com/v13/deployments?skipAutoDetectionConfirmation=1
[Deploy] Creating new project with name: my-project
[Deploy] Project settings configured for static site
[Deploy] Payload size: 571.27 KB
[Deploy] Sending deployment request to Vercel...
[Deploy] Vercel API response status: 200 OK
[Deploy] Deployment successful! Parsing response...
[Deploy] Deployment result: { id: 'dpl_...', url: 'my-project.vercel.app', ... }
[Deploy] Final deployment URL: https://my-project.vercel.app
```

## API Reference

### Deployment Endpoint

**URL**: `POST /api/deploy-simple`

**Request Body** (FormData):
- `file`: ZIP file containing built project (File)
- `deploymentName`: Project name for Vercel (string)

**Response** (Success):
```json
{
  "success": true,
  "url": "https://project-name.vercel.app",
  "deploymentId": "dpl_abc123",
  "message": "Deployment successful"
}
```

**Response** (Error):
```json
{
  "error": "Error message",
  "details": { /* Additional error details */ }
}
```

## Security Considerations

### Token Security

- **Never commit** `VERCEL_TOKEN` to version control
- Use `.env.local` (which should be in `.gitignore`)
- Rotate tokens periodically
- Use scoped tokens if possible

### File Security

- Only built files are deployed (no source code)
- No environment variables from Chef are exposed
- Vercel handles SSL/TLS automatically

## Limitations

### Current Limitations

1. **Static Sites Only**: Currently supports static site deployments
2. **No Build on Vercel**: Project must be built in Chef first
3. **No Environment Variables**: Can't set Vercel env vars through Chef (set in dashboard)
4. **Single Deployment**: Each deploy creates/updates one project

### Future Enhancements

Potential improvements:
- Support for serverless functions
- Build on Vercel option
- Environment variable management
- Multiple deployment targets
- Preview deployments

## Getting Help

### Common Issues

1. **Check Server Logs**: Look for `[Deploy]` prefixed messages
2. **Verify Token**: Ensure `VERCEL_TOKEN` is set correctly
3. **Check Vercel Dashboard**: See deployment status and logs
4. **Review Error Messages**: Error responses include detailed information

### Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel API Reference](https://vercel.com/docs/rest-api)
- [Chef Documentation](https://docs.convex.dev/chef)
- [Vercel Support](https://vercel.com/support)

## Examples

### Example: Basic Deployment

1. Build project in Chef
2. Click "Deploy"
3. Wait for success message
4. Visit the provided URL

### Example: Team Deployment

1. Set `VERCEL_TEAM_ID` in `.env.local`
2. Deploy as normal
3. Project appears under your team

### Example: Existing Project

1. Create project in Vercel dashboard
2. Get `VERCEL_PROJECT_ID`
3. Set in `.env.local`
4. Deployments update that project

---

**Last Updated**: Based on current implementation
**Version**: 1.0

