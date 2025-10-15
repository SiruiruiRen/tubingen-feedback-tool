# Deployment Guide - INFER Simplified Version

## Quick Start

This simplified version is a standalone web application that can be hosted anywhere. No database or complex backend required!

## Option 1: GitHub Pages (Recommended - Free)

1. **Create a new repository or use existing one:**
   ```bash
   cd /Users/sirui/Desktop/tubigen
   git init  # if not already a git repo
   ```

2. **Add and commit the files:**
   ```bash
   git add infer-simple/
   git commit -m "Add simplified INFER version"
   ```

3. **Push to GitHub:**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

4. **Enable GitHub Pages:**
   - Go to your repository on GitHub
   - Settings → Pages
   - Source: Deploy from a branch
   - Branch: `main` → `/infer-simple` folder
   - Save

5. **Access your site:**
   - URL: `https://YOUR_USERNAME.github.io/YOUR_REPO/`
   - Wait 1-2 minutes for deployment

## Option 2: Netlify (Very Easy - Free)

1. **Via Netlify Web Interface:**
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop the `infer-simple` folder
   - Done! You'll get a URL like `https://random-name.netlify.app`

2. **Via Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   cd /Users/sirui/Desktop/tubigen/infer-simple
   netlify deploy --prod
   ```

## Option 3: Vercel (Fast - Free)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   cd /Users/sirui/Desktop/tubigen/infer-simple
   vercel --prod
   ```

## Option 4: Local Testing

Simply open `index.html` in your browser:

```bash
cd /Users/sirui/Desktop/tubigen/infer-simple
open index.html  # macOS
# or
start index.html  # Windows
# or
xdg-open index.html  # Linux
```

**Note:** The CORS proxy must be running for API calls to work:
- Production proxy: `https://tubingen-feedback-cors-proxy.onrender.com` (already configured)
- Local proxy: Start with `node cors-proxy.js` from main tubigen folder

## Custom Domain (Optional)

### For GitHub Pages:
1. Buy a domain (e.g., from Namecheap, Google Domains)
2. In GitHub repository settings → Pages → Custom domain
3. Add your domain and configure DNS:
   ```
   Type: CNAME
   Name: www (or @)
   Value: YOUR_USERNAME.github.io
   ```

### For Netlify/Vercel:
- Follow their custom domain guides in the dashboard
- Very straightforward process

## Environment Configuration

The app automatically detects the environment:

```javascript
const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
const CORS_PROXY_URL = isProduction 
    ? 'https://tubingen-feedback-cors-proxy.onrender.com'
    : 'http://localhost:3000';
```

No configuration changes needed!

## Troubleshooting

### Issue: "CORS error" or "Failed to fetch"

**Solution 1:** Make sure the Render proxy is running:
- Visit: https://tubingen-feedback-cors-proxy.onrender.com
- Should see: "CORS Proxy for OpenAI is running"
- If it's sleeping, wait ~30 seconds for it to wake up

**Solution 2:** For local testing:
```bash
cd /Users/sirui/Desktop/tubigen
node cors-proxy.js
```

### Issue: Images not loading

**Solution:** Check that these files exist in the same folder:
- `University-of-Tubingen-01.png`
- `UNC_logo.avif`

### Issue: Styles look wrong

**Solution:** Clear browser cache or hard refresh:
- Chrome/Edge: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- Firefox: `Ctrl+F5` (Windows) or `Cmd+Shift+R` (Mac)

## Security Notes

- ✅ No API keys in frontend code (proxied through server)
- ✅ No database credentials needed
- ✅ All data stays in browser (no logging)
- ✅ Safe to deploy publicly

## Updating the Deployment

After making changes:

### GitHub Pages:
```bash
git add infer-simple/
git commit -m "Update INFER simplified version"
git push origin main
# Wait 1-2 minutes for automatic deployment
```

### Netlify:
```bash
cd /Users/sirui/Desktop/tubigen/infer-simple
netlify deploy --prod
```

### Vercel:
```bash
cd /Users/sirui/Desktop/tubigen/infer-simple
vercel --prod
```

## Monitoring

### Check if it's working:
1. Open the deployed URL
2. Enter name and select video
3. Paste a test reflection
4. Click "Generate Feedback"
5. Should see loading spinner, then feedback

### Common Success Indicators:
- ✅ Page loads without errors
- ✅ Language switcher works
- ✅ Word count updates as you type
- ✅ Generate button is clickable
- ✅ Feedback appears after ~30-60 seconds

## Performance Tips

1. **First Load:** May take 30-60 seconds if Render proxy is sleeping
2. **Subsequent Loads:** Much faster (~15-20 seconds)
3. **Caching:** Styles and scripts are cached for faster reloads
4. **Optimization:** Already minified Bootstrap and icons from CDN

## Cost

- **GitHub Pages:** 100% Free
- **Netlify Free Tier:** 100GB bandwidth/month (more than enough)
- **Vercel Free Tier:** 100GB bandwidth/month
- **Render Proxy:** Free tier (sleeps after inactivity)

## Support

If you encounter issues:
1. Check browser console (F12) for errors
2. Verify proxy is awake
3. Try different browser
4. Check README.md for more details

## Next Steps

After deployment:
1. Test with sample reflections
2. Share URL with colleagues
3. Gather feedback
4. Customize if needed (edit HTML/CSS/JS)

Enjoy using INFER! 🎉

