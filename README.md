# Tübingen Teacher Feedback Tool

A web-based tool for generating high-quality feedback on student teacher reflections, developed in collaboration between UNC and Tübingen University.

## Features

- AI-generated feedback on teaching reflections
- Support for both English and German languages
- Academic and user-friendly feedback styles
- Feedback quality dimensions based on research
- Save feedback to database and revise reflections
- Rate feedback quality and usefulness

## Live Demos

- [Render Deployment](https://tubingen-feedback-tool.onrender.com)
- [GitHub Repository](https://github.com/SiruiruiRen/tubingen-feedback-tool)

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
2. Select your preferred language (English or German)
3. Choose a feedback style (Academic or User-friendly)
4. Enter or paste the student teacher's reflection in the text area
5. Click "Generate Feedback"
6. Review the generated feedback
7. Optionally:
   - Copy the feedback to clipboard
   - Save the feedback to the database
   - Rate the quality and usefulness of the feedback
   - Edit and revise the reflection based on feedback

## Project Structure

- `index.html`: Main application interface
- `app.js`: Application logic and API integration
- `cors-proxy.js`: Local proxy server for handling API requests
- `supabase-setup.sql`: Database schema for Supabase

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
- reflection_text - Original reflection text
- feedback_text - Generated feedback
- revised_text - Student's revised reflection (optional)
- feedback_rating - Numerical rating of feedback quality (1-5)
- usefulness_rating - Numerical rating of feedback usefulness (1-5)
- timestamps - For creation, updates, and ratings

## License

This project is licensed under the Tubigen University License.

## Acknowledgments

This tool was developed in collaboration between the University of North Carolina at Chapel Hill and the University of Tübingen. 