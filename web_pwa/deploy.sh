#!/bin/bash
# Quick deploy script for Metro Pulse PWA

echo "🚀 Metro Pulse PWA Deploy Helper"
echo ""
echo "Choose your deployment target:"
echo "1. Vercel (recommended, <2 min)"
echo "2. Netlify (easy drag-n-drop)"
echo "3. Vercel CLI (if installed)"
echo ""
read -p "Enter choice (1-3): " choice

case $choice in
  1)
    echo ""
    echo "📦 Building for Vercel..."
    npm run build
    echo ""
    echo "✅ Build complete! Files are in dist/"
    echo ""
    echo "Next steps:"
    echo "1. Commit and push to GitHub"
    echo "2. Go to https://vercel.com/new"
    echo "3. Import your repo"
    echo "4. Vercel will auto-detect Vite config and deploy"
    echo "5. Your PWA is live! 🎉"
    ;;
  2)
    echo ""
    echo "📦 Building for Netlify..."
    npm run build
    echo ""
    echo "✅ Build complete! Folder 'dist' is ready."
    echo ""
    echo "Next steps:"
    echo "1. Go to https://netlify.com"
    echo "2. Click 'Add new project' > 'Deploy manually'"
    echo "3. Drag the 'dist' folder into the upload zone"
    echo "4. Wait ~1 min for deployment"
    echo "5. Your PWA is live! 🎉"
    ;;
  3)
    echo ""
    echo "🔧 Using Vercel CLI..."
    npm run build
    vercel --prod
    ;;
  *)
    echo "Invalid choice. Exiting."
    exit 1
    ;;
esac
