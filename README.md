# Metro Pulse 🚇

[![Deploy to GitHub Pages](https://github.com/zulankm/metropulse/actions/workflows/deploy.yml/badge.svg)](https://github.com/zulankm/metropulse/actions/workflows/deploy.yml)
[![Vercel Deployment](https://img.shields.io/badge/deployed_on-Vercel-black?logo=vercel)](https://metropulse.in)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-orange?logo=pwa)](https://web.dev/progressive-web-apps/)

**Metro Pulse** is a fast, offline-first Progressive Web App (PWA) designed to provide instant departure schedules and real-time ETA estimates for the Noida Metro Rail Corporation (NMRC) Aqua Line. Built with mobile-first experiences in mind, it functions as a lightweight home screen widget with physical haptic responses, offline capabilities, and instant loading times.

Live Demo: **[metropulse.in](https://metropulse.in)**

---

## ✨ Features

- ⏱️ **Real-time ETAs**: Computes the exact minutes and seconds remaining for the next departures.
- 📶 **Offline-First Support**: Fully cached assets and schedules via custom-configured service workers.
- 📱 **Installable Widget UI**: Custom app manifest allows adding to home screen on iOS and Android for a native app feel.
- 📳 **Haptic Feedback**: Simulates native device vibrations for user interactions on supported touch screens.
- 🌓 **Automated Theme Detection**: Follows OS preferences for dark or light modes, with a manual override option.
- ⚡ **Zero Latency**: Calculations run entirely on-device (no database API calls or backend delays).
- 🔄 **Quick Jumps**: Pin your favorite `Home` and `Work` stations for single-tap ETA checking.

---

## 📂 Repository Structure

The project has been organized with clear segregation between deployment configs and the PWA codebase:

```bash
metropulse/
├── .github/                 # GitHub workflows configuration
│   └── workflows/
│       └── deploy.yml       # Automates building and deploying PWA to GitHub Pages
├── web_pwa/                 # Primary workspace containing the React/Vite PWA
│   ├── public/              # Static assets, icons, and manifest.json
│   ├── src/                 # React component source code & ETA logic
│   │   ├── App.jsx          # Main application view with state & UI
│   │   ├── App.css          # Vanilla custom CSS theme styles
│   │   ├── etaEngine.js     # Algorithm calculating departure times
│   │   └── scheduleData.js  # NMRC Aqua Line station listing & static schedules
│   ├── vite.config.js       # Vite configuration with PWA plugin definitions
│   ├── package.json         # Project metadata and dependencies
│   ├── DEPLOY.md            # Detailed multi-platform deployment instructions
│   └── README.md            # Sub-workspace README file
└── README.md                # Main repository documentation (this file)
```

---

## 🛠️ Quick Start & Local Development

To run Metro Pulse on your machine, follow these steps:

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (version 18 or 20 is recommended).

### Running locally:
1. Navigate into the PWA directory:
   ```bash
   cd web_pwa
   ```
2. Install npm packages:
   ```bash
   npm install
   ```
3. Boot up the Vite local server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🚀 Deployment

Metro Pulse supports automated and manual deployments. The active main website is configured on Vercel at `metropulse.in`.

### GitHub Pages (Automated CI/CD)
The project includes a GitHub Action in `.github/workflows/deploy.yml`. Every commit pushed to the `main` branch is built and deployed automatically.

### Vercel Integration
To configure your own Vercel deployment:
1. Connect your repository to Vercel.
2. Ensure the framework preset is set to **Vite**.
3. Set the Root Directory to `web_pwa`.
4. Click **Deploy**.

For detailed instructions on other hosts (like Netlify), check out the [web_pwa Deployment Guide](file:///Users/kartikaymehta/metropulse/web_pwa/DEPLOY.md).

---

## 🏗️ Technical Stack

- **Framework**: React 18
- **Bundler & Dev Server**: Vite
- **Styling**: Vanilla CSS (CSS Variables, Responsive Flexbox/Grid, Dark Mode mapping)
- **PWA Service Worker**: `vite-plugin-pwa` with custom caching structures
- **Icons**: Custom vectors configured inside `web_pwa/public/manifest.json`

---

## ⚖️ License

Created as a personal project. Not officially affiliated with or endorsed by Noida Metro Rail Corporation (NMRC). All schedule information is compiled from public timetables.
