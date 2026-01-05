# Deploy Wedding Budget Tracker to GitHub Pages

This guide will help you deploy the Firebase-enabled wedding budget tracker to GitHub Pages for free hosting.

## Prerequisites

- GitHub account (free)
- Firebase project (already set up with your config)
- Git installed on your computer

## Step 1: Create a GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Create a new repository named `wedding-budget-tracker`
3. Choose "Public" (required for GitHub Pages free tier)
4. Click "Create repository"

## Step 2: Prepare Your Files

You need these files in your repository:

```
wedding-budget-tracker/
├── index-firebase.html    (rename to index.html)
├── styles-firebase.css    (rename to styles.css)
├── script-firebase.js     (rename to script.js)
├── README.md
└── .gitignore
```

### Renaming Files

Before uploading, rename the Firebase files:
- `index-firebase.html` → `index.html`
- `styles-firebase.css` → `styles.css`
- `script-firebase.js` → `script.js`

### Create .gitignore

Create a `.gitignore` file with:
```
node_modules/
.DS_Store
*.log
```

## Step 3: Upload to GitHub

### Option A: Using Git (Recommended)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YOUR-USERNAME/wedding-budget-tracker.git
   cd wedding-budget-tracker
   ```

2. **Add your files:**
   ```bash
   cp index-firebase.html index.html
   cp styles-firebase.css styles.css
   cp script-firebase.js script.js
   ```

3. **Commit and push:**
   ```bash
   git add .
   git commit -m "Initial commit: Wedding Budget Tracker with Firebase"
   git push origin main
   ```

### Option B: Using GitHub Web Interface

1. Go to your repository on GitHub
2. Click "Add file" → "Upload files"
3. Drag and drop your files or select them
4. Commit the changes

## Step 4: Enable GitHub Pages

1. Go to your repository settings
2. Scroll down to "GitHub Pages" section
3. Under "Source", select "Deploy from a branch"
4. Select "main" branch and "/ (root)" folder
5. Click "Save"

Your site will be published at: `https://YOUR-USERNAME.github.io/wedding-budget-tracker`

## Step 5: Configure Firebase Security Rules

Your Firebase database needs proper security rules to work with GitHub Pages. Update your rules:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to "Realtime Database" → "Rules"
4. Replace the rules with:

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    },
    "budgets": {
      "$budgetId": {
        ".read": "root.child('budgets').child($budgetId).child('createdBy').val() === auth.uid || root.child('budgets').child($budgetId).child('sharedWith').child(auth.uid).exists()",
        ".write": "root.child('budgets').child($budgetId).child('createdBy').val() === auth.uid",
        "expenses": {
          ".read": "root.child('budgets').child($budgetId).child('createdBy').val() === auth.uid || root.child('budgets').child($budgetId).child('sharedWith').child(auth.uid).exists()",
          ".write": "root.child('budgets').child($budgetId).child('createdBy').val() === auth.uid || root.child('budgets').child($budgetId).child('sharedWith').child(auth.uid).exists()"
        },
        "sharedWith": {
          ".read": "root.child('budgets').child($budgetId).child('createdBy').val() === auth.uid",
          ".write": "root.child('budgets').child($budgetId).child('createdBy').val() === auth.uid"
        }
      }
    }
  }
}
```

5. Click "Publish"

## Step 6: Configure Firebase Authentication

1. Go to Firebase Console → Authentication
2. Go to "Settings" tab
3. Under "Authorized domains", add:
   - `YOUR-USERNAME.github.io`
   - `wedding-budget-tracker.firebaseapp.com`

## Step 7: Test Your App

1. Visit: `https://YOUR-USERNAME.github.io/wedding-budget-tracker`
2. Create an account
3. Add some expenses
4. Share the budget with another email address
5. Test real-time sync by opening the app in two different browsers

## Troubleshooting

### "Firebase is not defined"
- Make sure the Firebase SDK scripts are loaded in your HTML
- Check browser console for errors

### Authentication not working
- Verify your Firebase config is correct
- Check that Email/Password auth is enabled in Firebase Console
- Ensure your domain is in the authorized domains list

### Database not syncing
- Check Firebase security rules
- Verify the user has permission to read/write
- Check browser console for error messages

### CORS errors
- Firebase handles CORS automatically
- If you see CORS errors, check your Firebase config

## Sharing the App

Once deployed, share the URL with your partner:
- **URL:** `https://YOUR-USERNAME.github.io/wedding-budget-tracker`
- They can create their own account
- You can share your budget by inviting their email address
- Changes sync in real-time across all devices

## Updating the App

To make changes:

1. Edit your files locally
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Update: description of changes"
   git push origin main
   ```
3. GitHub Pages automatically deploys within 1-2 minutes

## Custom Domain (Optional)

To use your own domain instead of `github.io`:

1. Buy a domain (e.g., from GoDaddy, Namecheap)
2. In your repository settings → Pages
3. Under "Custom domain", enter your domain
4. Follow GitHub's DNS configuration instructions
5. Update Firebase authorized domains

## Cost

- **GitHub Pages:** FREE
- **Firebase:** FREE (includes 100 simultaneous connections, 1GB storage)

This is completely free and will handle a wedding budget tracker perfectly!

## Support

If you encounter issues:

1. Check the browser console (F12 → Console tab)
2. Verify all files are named correctly
3. Ensure Firebase config is correct
4. Check GitHub Pages deployment status in repository settings

---

**Happy wedding planning! 💍**
