# INFER - Simplified Version (With In-Between Surveys)

This is a simplified version of the INFER (Intelligent Feedback System) that keeps the important in-between surveys but removes the consent pages and final survey.

## Study Flow

```
Task 1 → Survey 1 → Task 2 → Survey 2 → Complete
  0%       25%        50%       75%       100%
```

## What's Different

### ✅ Kept (Important for Study):
- **Task 1** - Full feedback generation system
- **Survey 1** - Post-Task 1 survey (Qualtrics)
- **Task 2** - Full feedback generation system  
- **Survey 2** - Post-Task 2 survey (Qualtrics)
- Same AI feedback generation
- Same prompts and analysis logic
- English and German language support
- Professional vision analysis

### ❌ Removed (Streamlined):
- Welcome/consent page
- Participant information forms
- Pre-study survey
- Final survey (SUS)
- Database logging (no Supabase)

## Why This Version?

This version is ideal when you:
- Already have participant consent
- Don't need pre-study demographics
- Don't need final usability ratings
- Still want to collect post-task feedback

## How to Use

### 1. Local Testing

Simply open `index.html` in your browser:

```bash
cd /Users/sirui/Desktop/tubigen/infer-simple
open index.html
```

### 2. Flow Through the Study

**Task 1:**
1. Enter name and select video
2. Paste reflection
3. Generate feedback (choose Extended or Short)
4. Revise and regenerate as needed
5. Click "Submit Final Reflection"

**Survey 1:**
- Complete the embedded Qualtrics survey
- Click "Continue to Task 2"

**Task 2:**
- Same process as Task 1
- Different video selection

**Survey 2:**
- Complete the embedded Qualtrics survey
- Click "Complete Study"

**Thank You Page:**
- Study complete!
- Citation information

### 3. Deploy Online

**GitHub Pages:**
```bash
cd /Users/sirui/Desktop/tubigen
git add infer-simple/
git commit -m "Add simplified INFER with surveys"
git push origin main
```

Then enable GitHub Pages in repository settings → Pages → select branch and `/infer-simple` folder.

**Netlify:**
Just drag and drop the `infer-simple` folder to netlify.com

**Vercel:**
```bash
npm install -g vercel
cd /Users/sirui/Desktop/tubigen/infer-simple
vercel --prod
```

## Technical Details

### Pages Structure
- `page-task1` - First feedback task
- `page-survey1` - Post-Task 1 survey (Qualtrics iframe)
- `page-task2` - Second feedback task
- `page-survey2` - Post-Task 2 survey (Qualtrics iframe)
- `page-thankyou` - Completion page

### Same Quality Feedback
Uses identical components from research version:
- GPT-4o model
- Same prompts (academic & user-friendly)
- Same 4-step analysis pipeline
- Same feedback formatting
- Same educational theories

### Qualtrics Surveys
The surveys are embedded via iframes:
- **Survey 1:** `https://unc.az1.qualtrics.com/jfe/form/SV_eh9QGc1SrGFCl5s`
- **Survey 2:** `https://unc.az1.qualtrics.com/jfe/form/SV_2o83No2bgQoDMLs`

To change surveys, edit the `src` attribute in `index.html`.

### No Database Logging
- All processing happens in browser
- No data sent to Supabase
- Completely privacy-focused
- Qualtrics handles survey responses

## API Configuration

**Production (Automatic):**
- Uses: `https://tubingen-feedback-cors-proxy.onrender.com`
- No configuration needed

**Local Development:**
```bash
# Terminal 1: Start proxy
cd /Users/sirui/Desktop/tubigen
node cors-proxy.js

# Terminal 2: Open app
open infer-simple/index.html
```

## Comparison

| Feature | Research Version | Simplified Version |
|---------|------------------|-------------------|
| Consent Forms | Yes | No |
| Pre-Study Survey | Yes | No |
| Task 1 | Yes | ✅ Yes |
| Post-Task 1 Survey | Yes | ✅ Yes |
| Task 2 | Yes | ✅ Yes |
| Post-Task 2 Survey | Yes | ✅ Yes |
| Final Survey (SUS) | Yes | No |
| Database Logging | Yes | No |
| Pages | 7 pages | 5 pages |
| Feedback Quality | High | Same High Quality |

## Use Cases

Perfect for:
- **Continuing Studies** - When participants already consented
- **Follow-up Studies** - Don't need pre-survey again
- **Workshops** - Want feedback collection between tasks
- **A/B Testing** - Need task comparison data
- **Training Programs** - Track progress across sessions

## Files

```
infer-simple/
├── index.html              # Main page with all 5 pages
├── app.js                  # Full logic with page navigation
├── styles.css              # Styling
├── University-*.png        # Logos
├── UNC_logo.avif          # Logo
├── README.md              # This file
├── START_HERE.md          # Quick start guide
├── DEPLOYMENT.md          # Deployment instructions
└── QUICK_START.txt        # Visual guide
```

## Progress Tracking

The app shows progress at the top:
- Task 1: 0%
- Survey 1: 25%
- Task 2: 50%
- Survey 2: 75%
- Complete: 100%

## Language Support

Both English and German fully supported:
- UI translations
- Feedback in selected language
- Analysis prompts in selected language
- Survey instructions in selected language

## Troubleshooting

**Proxy Issues:**
- First load may take 30-60 seconds (Render wake-up)
- Check: https://tubingen-feedback-cors-proxy.onrender.com
- Should see: "CORS Proxy for OpenAI is running"

**Survey Not Loading:**
- Check internet connection
- Qualtrics may be slow to load
- Try refreshing the page

**Stuck on Survey Page:**
- Survey must be completed in Qualtrics
- Then click the navigation button below
- Button works immediately (doesn't check survey completion)

## Support

For questions:
- Check `START_HERE.md` for overview
- Read `DEPLOYMENT.md` for hosting help
- Review main INFER repository
- Contact development team

## Citation

Fütterer, T., Nguyen, H., Ren, S., & Stürmer, K. (2025). INFER - An intelligent feedback system for classroom observation [Computer software]. University of Tübingen & University of North Carolina, Chapel Hill.

## License

Same as main INFER project.
