# Render Deployment Guide - Simplified INFER Version

## ✅ Changes Made

I've updated your `render.yaml` to include TWO services:

1. **tubingen-feedback-cors-proxy** (original) - Your CORS proxy
2. **infer-task-survey** (NEW) - Your simplified version

## 🚀 Next Steps - Deploy on Render

### Option 1: Automatic (Recommended)

If your Render account is connected to GitHub with auto-deploy enabled:

1. Go to https://dashboard.render.com
2. Wait 1-2 minutes for Render to detect the new `render.yaml`
3. You should see a new service called **"infer-task-survey"** being created
4. Once deployed, you'll get a URL like: `https://infer-task-survey.onrender.com`

### Option 2: Manual Deployment

If automatic deployment doesn't work:

1. **Go to Render Dashboard:**
   - Visit: https://dashboard.render.com

2. **Create New Static Site:**
   - Click "New +" → "Static Site"
   - Connect your GitHub repository: `SiruiruiRen/tubingen-feedback-tool`
   - Configure:
     ```
     Name: infer-task-survey
     Branch: main
     Root Directory: infer-task-survey-version
     Build Command: (leave empty)
     Publish Directory: .
     ```

3. **Deploy:**
   - Click "Create Static Site"
   - Wait 1-2 minutes for deployment

4. **Get Your URL:**
   - You'll get: `https://infer-task-survey.onrender.com`

## 🔗 Your Two Render Services

After deployment, you'll have:

| Service | Type | URL | Purpose |
|---------|------|-----|---------|
| **tubingen-feedback-cors-proxy** | Web Service | `https://tubingen-feedback-cors-proxy.onrender.com` | CORS proxy for API calls |
| **infer-task-survey** | Static Site | `https://infer-task-survey.onrender.com` | Simplified INFER version |

## ✅ What to Expect

**Your simplified version will:**
- Be hosted at: `https://infer-task-survey.onrender.com`
- Use the same CORS proxy (no changes needed)
- Work independently from your original version
- Auto-deploy when you push changes to GitHub

**Your original version:**
- Stays exactly the same
- No changes to existing setup
- Still works at your current URL

## 🔧 Troubleshooting

### Issue: New service not appearing
**Solution:** 
1. Check Render dashboard after 2-3 minutes
2. Or manually create the static site (Option 2 above)

### Issue: 404 errors on the new site
**Solution:**
1. Check "Root Directory" is set to: `infer-task-survey-version`
2. Check "Publish Directory" is set to: `.` (dot)
3. Redeploy the service

### Issue: "CORS error" on the new site
**Solution:**
- The CORS proxy URL is already configured correctly
- Wait 30 seconds for the proxy to wake up (free tier)
- Both sites use the same proxy: `https://tubingen-feedback-cors-proxy.onrender.com`

## 📝 Update Process

To update the simplified version in the future:

```bash
cd /Users/sirui/Desktop/tubigen/infer-task-survey-version
# Make your changes to index.html, app.js, etc.

# Commit and push
git add .
git commit -m "Update simplified version"
git push origin clean-branch:main

# Render will auto-deploy in 1-2 minutes
```

## 🎯 Verify Deployment

Once deployed, test your new site:

1. **Open:** `https://infer-task-survey.onrender.com`
2. **Check:** Should start at Task 1 (no consent page)
3. **Test:** Generate feedback (wait for CORS proxy to wake up)
4. **Navigate:** Submit → Survey 1 → Task 2 → Survey 2 → Complete

## 💡 Benefits of Render

✅ **Same Platform** - Both services on Render  
✅ **Auto-Deploy** - Push to GitHub = automatic deployment  
✅ **Free Tier** - Static sites are free on Render  
✅ **Custom Domains** - Can add your own domain later  
✅ **SSL/HTTPS** - Automatic SSL certificates  

## 🔗 Useful Links

- **Render Dashboard:** https://dashboard.render.com
- **Your Repository:** https://github.com/SiruiruiRen/tubingen-feedback-tool
- **Render Docs (Static Sites):** https://render.com/docs/static-sites

---

**Need help?** Check the Render dashboard for deployment logs or refer to this guide.

