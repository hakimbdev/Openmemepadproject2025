# Deployment Guide

## Issues Fixed

The following issues have been resolved to make your frontend work on Netlify and Telegram Web App:

1. **Base Path Configuration**: Changed from `/Minizero/` to `/` for universal compatibility
2. **SPA Routing**: Added `_redirects` file and `netlify.toml` for proper routing
3. **Telegram Web App Support**: Added proper manifest and meta tags
4. **TONConnect Configuration**: Updated manifest for your project

## Netlify Deployment

### Option 1: Drag & Drop (Quick)
1. Run `npm run build`
2. Drag the `dist` folder to Netlify's deploy area
3. Your site will be live immediately

### Option 2: Git Integration (Recommended)
1. Push your code to GitHub/GitLab
2. Connect your repository to Netlify
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Deploy

### Netlify Configuration
The `netlify.toml` file is already configured with:
- Build command: `npm run build`
- Publish directory: `dist`
- SPA routing redirects
- Security headers

## Telegram Web App Deployment

### 1. Deploy to a Public HTTPS Domain
Your app must be accessible via HTTPS. You can use:
- Netlify (recommended)
- Vercel
- GitHub Pages
- Any hosting service with HTTPS

### 2. Update TONConnect Manifest
After deployment, update `public/tonconnect-manifest.json`:
```json
{
  "url": "https://your-actual-domain.com",
  "name": "Open MemePad",
  "iconUrl": "https://your-actual-domain.com/logo.png"
}
```

### 3. Create Telegram Bot
1. Message @BotFather on Telegram
2. Create a new bot with `/newbot`
3. Get your bot token

### 4. Configure Web App
1. Use `/newapp` command with BotFather
2. Set your deployed URL as the Web App URL
3. Configure bot commands if needed

### 5. Test Your Web App
1. Open your bot in Telegram
2. Click the "Start" button or use your configured command
3. Your Web App should load properly

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Troubleshooting

### App Not Loading on Netlify
- Check that the `dist` folder contains all files
- Verify `_redirects` file is in the `public` folder
- Check Netlify build logs for errors

### Telegram Web App Issues
- Ensure your domain has HTTPS
- Check that the bot token is correct
- Verify the Web App URL in BotFather settings
- Test with the Telegram Web App debugger

### Build Errors
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npm run lint`
- Verify all dependencies are installed

## Environment Variables

For production, you may need to set these environment variables:
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

## Security Notes

- The app includes security headers in `netlify.toml`
- TONConnect manifest should be updated with your actual domain
- Always use HTTPS in production 