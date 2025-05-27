# Teacher Professional Vision Feedback

A web-based tool for generating high-quality feedback on student teacher reflections with support for multiple languages and feedback styles.

## Live Demo

- [Render Deployment](https://tubingen-feedback-tool.onrender.com)

## Deployment to Render

1.  **Fork this repository** to your own GitHub account.
2.  **Create a free account** on [Render](https://render.com).
3.  **Create a new "Blueprint Instance"** on Render:
    *   Connect your forked GitHub repository.
    *   Render will automatically detect the `render.yaml` file in the repository.
    *   This blueprint will set up two services:
        *   A **Static Site** for the frontend.
        *   A **Web Service** for the backend CORS proxy.
4.  **Add Environment Variables** to the **CORS proxy service** on Render:
    *   `OPENAI_API_KEY`: Your OpenAI API key.
    *   `PORT`: `10000` (Render dynamically assigns and uses this for web services).
5.  **Deploy both services.** The frontend will be available at the URL provided by Render for the Static Site, and the backend proxy will support it.

*Note: The `main` branch is configured for auto-deploys on Render. Pushing to `main` will trigger a new deployment.*

## Features

- AI-generated feedback on teaching reflections in both extended and short formats
- Support for both English and German languages with full UI translation
- Automatic analysis of reflection content distribution (description, explanation, prediction)
- Targeted feedback based on areas needing improvement
- Video selection tracking for different teaching scenarios
- Interactive definitions for professional vision concepts
- Save feedback to database and revise reflections
- Rate feedback quality and usefulness

## Setup and Installation

### Prerequisites

- Node.js 14 or higher
- npm or yarn

### Installation

1. Clone this repository
   ```
   git clone https://github.com/SiruiruiRen/tubingen-feedback-tool.git
   cd tubingen-feedback-tool
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Create a `.env` file in the root directory (see `.env.example`) and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_api_key_here
   PORT=3000
   ```

4. Start the development server
   ```
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`

## Database Updates

If you have an existing database, run the following SQL to add new columns:

```sql
-- Add video_id column
ALTER TABLE reflections ADD COLUMN IF NOT EXISTS video_id VARCHAR(10);

-- Add short feedback column
ALTER TABLE reflections ADD COLUMN IF NOT EXISTS feedback_text_short TEXT;

-- Add analysis percentages column
ALTER TABLE reflections ADD COLUMN IF NOT EXISTS analysis_percentages JSONB;
```

## Deployment Options

### Option 1: Render

1. Create a free account on [Render](https://render.com)
2. Connect your GitHub repository 
3. Render will automatically detect the `render.yaml` blueprint file and create:
   - Frontend static site
   - Backend CORS proxy server
4. Add your OpenAI API key as an environment variable in the CORS proxy service
5. Deploy both services

### Option 2: Vercel

1. Create a [Vercel](https://vercel.com) account
2. Import your GitHub repository
3. Configure as follows:
   - Framework: Other
   - Build Command: `npm install`
   - Output Directory: `./`
   - Install Command: `npm install`
4. Add environment variables for your OpenAI API key
5. Deploy

### Option 3: GitHub Pages (Frontend Only)

For the frontend part:
1. Set up GitHub Pages for your repository
2. Configure a separate service like Render or Railway for the CORS proxy
3. Update the `CORS_PROXY_URL` in app.js to point to your deployed proxy

## Usage

1. Enter your name in the settings panel
2. Select the video you watched (Videos 1-8)
3. Select your preferred language (English or German) - the entire interface will update
4. Enter or paste the student teacher's reflection in the text area
5. Click "Generate Feedback"
6. View both extended and short versions of the feedback using the tabs
7. Review the generated feedback
8. Optionally:
   - Copy the current feedback to clipboard
   - Rate the quality and usefulness of the feedback
   - Revise your reflection based on the feedback

## Project Structure

- `index.html`: Main application interface
- `app.js`: Application logic and API integration
- `cors-proxy.js`: Local proxy server for handling API requests
- `supabase-setup.sql`: Database schema for Supabase
- `supabase-update.sql`: Database update script for new features

## Security Note

This application uses a proxy server to handle API requests securely. Never expose your API keys in client-side code in production.

## Project Background

This tool was developed as part of a collaboration between UNC and Tübingen University to improve feedback quality for teacher education students. The feedback focuses on professional vision dimensions:

1. **Description** - Accurately noting what happened in the classroom
2. **Explanation** - Interpreting classroom events using educational theory
3. **Prediction** - Forecasting how teacher actions might affect student learning

The feedback adheres to four quality criteria:
- **Specificity** - References precise aspects of the student's analysis rather than making vague statements
- **Constructive Suggestions** - Provides actionable recommendations that students can practically implement
- **Explanations/Justifications** - Grounds feedback in educational research and theory
- **Clarity** - Uses straightforward language that is accessible to early-stage students

## Data Schema

The application uses a simple data schema with a primary "reflections" table:
- student_name - Name of the student
- video_id - ID of the video watched
- reflection_text - Original reflection text
- feedback_text - Generated extended feedback
- feedback_text_short - Generated short feedback
- analysis_percentages - JSON object with percentage distribution of content types
- revised_text - Student's revised reflection (optional)
- feedback_rating - Numerical rating of feedback quality (1-5)
- usefulness_rating - Numerical rating of feedback usefulness (1-5)
- interaction_data - JSON object tracking user interaction with feedback tabs:
  - extendedTime - Time spent viewing extended feedback (seconds)
  - shortTime - Time spent viewing short feedback (seconds)
  - switchCount - Number of times user switched between tabs
  - lastViewedVersion - Which version was being viewed when rating was submitted
- revision_initiated_from - Which feedback version ('extended' or 'short') was active when revision was initiated
- pre_revision_interaction - JSON object with interaction data captured when revision was initiated
- timestamps - For creation, updates, and ratings

## Interaction Tracking

The application tracks how users interact with the dual feedback system:

1. **Time Tracking** - Measures time spent on each feedback version
2. **Switch Count** - Counts how many times users switch between Extended and Short feedback
3. **Revision Source** - Records which version was being viewed when "Revise Reflection" was clicked
4. **Rating Context** - Captures the interaction pattern when feedback is rated

This data helps researchers understand:
- Which feedback format is more engaging
- How students compare the two versions
- Which version is more useful for revision
- User preferences and behavior patterns

## License

This project is licensed under the Tubigen University License.

## Acknowledgments

This tool was developed in collaboration between the University of North Carolina at Chapel Hill and the University of Tübingen. 