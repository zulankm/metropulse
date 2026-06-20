# Metro Pulse — NMRC PWA App

A Progressive Web App (PWA) for quick access to NMRC Aqua Line ETAs. Save to your home screen on Android or iOS for instant access.

## Quick Start

Install dependencies and run locally:

```bash
npm install
npm run dev
```

The app will start on `http://localhost:3000`.

## Build for Production

```bash
npm run build
```

Output goes to `dist/`. Ready to deploy to Vercel, Netlify, or any static host.

## Deploy to Vercel (Fastest)

1. Fork or clone this repo.
2. Go to [vercel.com](https://vercel.com) and sign in.
3. Click "Add New Project" and select your repo.
4. Vercel auto-detects Vite. Click "Deploy".
5. Your app is live in ~1 minute. Share the link on Twitter.

## Deploy to Netlify

1. Connect your repo on [netlify.com](https://netlify.com).
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Deploy.

## Features

- **Real-time ETA**: Shows next NMRC Aqua Line departure (updates every second).
- **Offline Support**: Works offline via service worker caching.
- **Installable**: Add to home screen on Android or iOS — looks like a native app.
- **Responsive**: Optimized for mobile and tablet screens.
- **No Backend**: Schedule data is bundled; no server calls needed.

## Usage

1. Visit the deployed link on your phone.
2. On Android: Tap the menu → "Add to Home screen".
3. On iOS: Tap Share → "Add to Home Screen".
4. Open the widget anytime for instant ETA.

## Tech Stack

- React 18
- Vite
- Manifest + Service Worker (PWA standards)
- CSS (no dependencies)

## Notes

- Schedule data (NMRC Aqua Line) is hardcoded in `src/scheduleData.js`.
- ETA calculations happen on-device (no API calls).
- To update the schedule, edit `scheduleData.js` and redeploy.
- Future: Add support for multiple NMRC lines and crowdsourced signals.

## License

Unofficial. Not affiliated with NMRC.
