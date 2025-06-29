# Troubleshooting Guide

## Quick Fixes Applied

✅ **Fixed Issues:**
1. **Base Path**: Changed from `/Minizero/` to `/` in `vite.config.ts`
2. **TONConnect Manifest**: Updated to use local manifest instead of demo URL
3. **SPA Routing**: Added `_redirects` and `netlify.toml` for proper routing
4. **Error Handling**: Added fallback data and better error handling
5. **Test Page**: Created simple test page to verify app loading

## Current Status

The app should now work! Here's what to do:

### 1. Test Locally First
```bash
npm run dev
```
Open http://localhost:5173 and you should see the test page.

### 2. Build and Deploy
```bash
npm run build
```
Deploy the `dist` folder to Netlify.

### 3. If Still Not Working

#### Check Browser Console
1. Open Developer Tools (F12)
2. Go to Console tab
3. Look for any red error messages
4. Common errors and fixes:

**Error: "Cannot find module"**
- Run `npm install` to ensure all dependencies are installed

**Error: "Failed to fetch"**
- Check if Supabase is accessible
- The app now has fallback data, so it should still work

**Error: "TONConnect manifest not found"**
- Verify `public/tonconnect-manifest.json` exists
- Check the manifest URL in the browser network tab

#### Check Network Tab
1. Open Developer Tools (F12)
2. Go to Network tab
3. Refresh the page
4. Look for failed requests (red entries)
5. Check if all assets are loading (JS, CSS files)

#### Test Individual Components
The app now has a test page at the root (`/`) that should always load. If this works, the issue is with the main MemePad page.

## Common Deployment Issues

### Netlify Issues
1. **Build Fails**: Check Netlify build logs
2. **404 Errors**: Ensure `_redirects` file is in `public/` folder
3. **Blank Page**: Check browser console for JavaScript errors

### Telegram Web App Issues
1. **App Not Loading**: Ensure HTTPS is enabled
2. **Bot Not Responding**: Check bot token and Web App URL
3. **Styling Issues**: Telegram Web App has specific CSS requirements

### Environment Issues
1. **Missing Dependencies**: Run `npm install`
2. **Node Version**: Use Node.js 18+ (configured in `netlify.toml`)
3. **Build Cache**: Clear Netlify cache if needed

## Debug Steps

### Step 1: Verify Build
```bash
npm run build
```
Should complete without errors.

### Step 2: Check Built Files
```bash
ls dist/
```
Should contain:
- `index.html`
- `assets/` folder
- `tonconnect-manifest.json`

### Step 3: Test Assets
Open `dist/index.html` in a browser. You should see the app.

### Step 4: Deploy to Netlify
1. Drag `dist` folder to Netlify
2. Wait for deployment
3. Check the live URL

### Step 5: Update Configuration
After deployment, update:
- `public/tonconnect-manifest.json` with your actual domain
- Environment variables in Netlify dashboard if needed

## Fallback Features

The app now includes:
- **Mock Data**: Shows demo tokens if database fails
- **Error Messages**: Clear feedback when things go wrong
- **Test Page**: Simple page to verify basic functionality
- **Graceful Degradation**: App works even with partial failures

## Still Having Issues?

1. **Check the test page**: Visit `/` to see if basic app loads
2. **Check console errors**: Look for specific error messages
3. **Try different browser**: Test in incognito/private mode
4. **Check network**: Ensure no firewall/proxy issues
5. **Verify deployment**: Make sure you're viewing the correct URL

## Contact Support

If you're still having issues:
1. Share the browser console errors
2. Share the Netlify deployment URL
3. Describe what you see (blank page, error message, etc.)
4. Mention which platform (Netlify, Telegram Web App, or both) 