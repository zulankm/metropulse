# Deployment Guide — Metro Pulse PWA

Deploy your NMRC PWA app in <5 minutes to Vercel or Netlify.

## Option 1: Vercel (Recommended) ⭐

**Time: ~2 minutes**

### Prerequisites
- GitHub account
- Vercel account (free tier, sign up at https://vercel.com)

### Steps

1. **Push your code to GitHub**
   ```bash
   cd web_pwa
   git init
   git add .
   git commit -m "Initial Metro Pulse PWA"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/metro-pulse-pwa.git
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to https://vercel.com
   - Click "Add New Project"
   - Select your GitHub repo (`metro-pulse-pwa`)
   - Vercel auto-detects Vite. Click "Deploy"
   - Wait ~1-2 minutes

3. **Your app is live!**
   - Vercel gives you a URL like `metro-pulse-pwa.vercel.app`
   - Share this link on Twitter

### Auto-deploy on push
- Every time you push to `main`, Vercel auto-rebuilds and deploys
- No manual steps needed

---

## Option 2: Netlify (Easy)

**Time: ~3 minutes**

### Prerequisites
- Netlify account (free tier, sign up at https://netlify.com)

### Steps

1. **Build locally**
   ```bash
   cd web_pwa
   npm install
   npm run build
   ```

2. **Deploy via drag-n-drop**
   - Go to https://netlify.com
   - Click "Add new project" → "Deploy manually"
   - Drag the **`dist` folder** into the upload zone
   - Wait ~1 minute for deployment

3. **Your app is live!**
   - Netlify gives you a URL like `metro-pulse-pwa-123.netlify.app`
   - Share this link on Twitter

### (Optional) Connect to GitHub for auto-deploy
- Go to your site settings → "Build & Deploy" → "Link site to Git"
- Select your repo
- Netlify will auto-deploy on push

---

## Option 3: Vercel CLI (For power users)

**Time: ~2 minutes** (if Vercel CLI is installed)

1. **Install Vercel CLI** (one-time)
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   cd web_pwa
   npm run build
   vercel --prod
   ```

3. **Your app is live!**

---

## Testing Your Deployment

### On Android
1. Visit your deployed URL on your Android phone
2. Tap the three-dot menu → "Add to Home screen"
3. Tap "Install"
4. The app is now on your home screen—try it!

### On iOS
1. Visit your deployed URL on your iPhone/iPad
2. Tap the Share button (bottom center or top right)
3. Scroll and tap "Add to Home Screen"
4. Tap "Add"
5. The app is now on your home screen—try it!

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Build fails | Ensure `npm install` completed successfully; try deleting `node_modules` and running `npm install` again |
| Deployed site shows blank page | Check browser console for errors (F12); ensure `index.html` is being served |
| PWA won't install | Ensure HTTPS is enabled (both Vercel and Netlify default to HTTPS) |
| Service worker not caching | Check browser DevTools → Application → Service Workers; Vercel/Netlify cache headers are usually OK |

---

## Quick Links

- **Vercel Docs**: https://vercel.com/docs
- **Netlify Docs**: https://docs.netlify.com
- **PWA Standards**: https://web.dev/progressive-web-apps/

---

## Next Steps (Post-Launch)

1. **Share on Twitter**
   - Post a link to your deployed PWA
   - Include a GIF showing the app on a home screen
   - Mention it's an NMRC Aqua Line ETA app, free and no account needed

2. **Gather feedback**
   - Pin a Notion/Airtable form in your Twitter replies for feedback
   - Monitor for bugs, feature requests

3. **Scale to other NMRC lines**
   - Edit `src/scheduleData.js` to add more lines
   - Redeploy (Vercel auto-redeploys on push)

---

**Good luck! 🚀**
