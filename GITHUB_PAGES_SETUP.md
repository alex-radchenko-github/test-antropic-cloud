# GitHub Pages Setup Instructions

## ⚠️ Important: Enable GitHub Pages First!

Before the deployment can work, you need to enable GitHub Pages in your repository settings.

## Step-by-Step Instructions:

### 1. Go to Repository Settings

Visit: https://github.com/alex-radchenko-github/test-antropic-cloud/settings/pages

### 2. Configure GitHub Pages

In the **"Build and deployment"** section:

- **Source**: Select `GitHub Actions` from the dropdown
  - ❌ DO NOT select "Deploy from a branch"
  - ✅ SELECT "GitHub Actions"

This will look like:
```
Build and deployment
Source: [GitHub Actions ▼]
```

### 3. Save (automatic)

The settings save automatically when you change the source.

### 4. Trigger Deployment

After enabling GitHub Pages, you have two options:

**Option A: Manual Re-run (Fastest)**
1. Go to: https://github.com/alex-radchenko-github/test-antropic-cloud/actions
2. Click on the failed "Deploy to GitHub Pages" workflow
3. Click "Re-run all jobs" button in the top right

**Option B: Push a Small Change**
```bash
# Make a small change and push
git commit --allow-empty -m "Trigger GitHub Pages deployment"
git push origin main
```

### 5. Wait for Deployment

- Go to Actions tab: https://github.com/alex-radchenko-github/test-antropic-cloud/actions
- Watch the "Deploy to GitHub Pages" workflow
- It should complete successfully in 1-2 minutes

### 6. Visit Your Live Site!

Once deployment succeeds, your site will be available at:

**https://alex-radchenko-github.github.io/test-antropic-cloud**

## Troubleshooting

### If you still see 404 error:
- Make sure you selected "GitHub Actions" as source, not "Deploy from a branch"
- Wait a few minutes after enabling
- Check Actions tab for any errors

### If the workflow doesn't appear:
- Make sure your changes are merged into the `main` branch
- Check that `.github/workflows/pages.yml` exists in main branch

### If deployment succeeds but site shows 404:
- Wait 5-10 minutes for DNS propagation
- Try clearing your browser cache
- Try incognito/private mode

## Expected Result

After successful deployment, you should see:
- ✅ Green checkmark in Actions tab
- ✅ Deployment summary with live URL
- ✅ Your Todo Manager app live at the GitHub Pages URL

## Features of Your Deployed Site

- 📝 Classic view
- 🌳 Workflowy (hierarchical) view
- 📊 Kanban board
- 📅 Calendar view
- 💾 localStorage persistence (data saves in browser)
- 📱 Responsive design

---

Need help? Check the GitHub Actions logs for detailed error messages.
