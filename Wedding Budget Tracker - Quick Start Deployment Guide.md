# Wedding Budget Tracker - Quick Start Deployment Guide

## Files Included

✅ **index.html** - Main application file (ready to use)
✅ **styles.css** - All styling (ready to use)
✅ **script.js** - Firebase integration (ready to use)
✅ **README.md** - User documentation
✅ **GITHUB-PAGES-SETUP.md** - Detailed setup instructions
✅ **.gitignore** - Git configuration

## 3-Minute Quick Start

### Step 1: Create GitHub Repository
1. Go to https://github.com/new
2. Repository name: `wedding-budget-tracker`
3. Choose "Public"
4. Click "Create repository"

### Step 2: Upload Files to GitHub
**Option A: Using Git (Recommended)**
```bash
git clone https://github.com/YOUR-USERNAME/wedding-budget-tracker.git
cd wedding-budget-tracker
# Copy all files here
git add .
git commit -m "Initial commit: Wedding Budget Tracker"
git push origin main
```

**Option B: Using GitHub Web Interface**
1. Go to your repository
2. Click "Add file" → "Upload files"
3. Drag and drop all files (index.html, styles.css, script.js, README.md, .gitignore)
4. Commit the changes

### Step 3: Enable GitHub Pages
1. Go to repository "Settings"
2. Scroll to "GitHub Pages"
3. Select "Deploy from a branch"
4. Choose "main" branch and "/ (root)" folder
5. Click "Save"

Your site will be live at: `https://YOUR-USERNAME.github.io/wedding-budget-tracker`

### Step 4: Configure Firebase
1. Go to https://console.firebase.google.com/
2. Select "wedding-planner-48e08" project
3. Click "Build" → "Authentication" → "Settings"
4. Scroll to "Authorized domains"
5. Click "Add domain"
6. Enter: `YOUR-USERNAME.github.io`
7. Click "Add"

### Step 5: Done! 🎉
Your wedding budget tracker is now live and ready to use!

## Sharing with Your Partner

1. Share the URL: `https://YOUR-USERNAME.github.io/wedding-budget-tracker`
2. They create an account
3. You invite them by entering their email in "Share Budget"
4. Changes sync in real-time!

## Troubleshooting

**"Firebase is not defined"?**
- Wait a few minutes for GitHub Pages to deploy
- Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)

**"Authentication error"?**
- Make sure your domain is added to Firebase authorized domains
- Check that Email/Password auth is enabled in Firebase

**Still having issues?**
- See GITHUB-PAGES-SETUP.md for detailed troubleshooting

## What's Next?

- Read README.md for user guide
- See GITHUB-PAGES-SETUP.md for advanced configuration
- Test with a friend to verify real-time sync

---

**Your wedding budget tracker is ready! 💍**
