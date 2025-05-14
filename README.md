# Tübingen Teacher Feedback Tool

A web-based tool for generating high-quality feedback on student teacher reflections, developed in collaboration between UNC and Tübingen University.

## Features

- AI-generated feedback on teaching reflections
- Support for both English and German languages
- Academic and user-friendly feedback styles
- Feedback quality dimensions based on research
- Save feedback to database and revise reflections
- Rate feedback quality and usefulness

## Setup and Installation

### Prerequisites

- Node.js 14 or higher
- npm or yarn

### Installation

1. Clone this repository
   ```
   git clone https://github.com/yourusername/tubingen-teacher-feedback-tool.git
   cd tubingen-teacher-feedback-tool
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Create a `.env` file in the root directory and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_api_key_here
   PORT=3000
   ```

4. Start the development server
   ```
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`

#

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

## API Integration

The tool connects to the OpenAI API to generate feedback. It makes a single API call with:
1. A system prompt that defines the feedback style and quality criteria
2. The student's reflection text as the user message

The response is displayed to the user and can be saved to the database.



## License

This project is licensed under the Tübingen University License.

## Acknowledgments

This tool was developed in collaboration between the University of North Carolina at Chapel Hill and the University of Tübingen.

### Running Locally

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file with your OpenAI API key:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```
4. Start the CORS proxy server:
   ```
   node cors-proxy.js
   ```
5. In a separate terminal, start a simple HTTP server to serve the static files:
   ```
   python3 -m http.server 8080
   ```
6. Access the application at http://localhost:8080

### Deploying to Render

This application is configured for deployment on Render using the provided `render.yaml` file.

1. Push your code to a Git repository (GitHub, GitLab, etc.)

2. Create a new Render account or log in at https://render.com

3. Click "New" and select "Blueprint" from the dropdown menu

4. Connect your Git repository and select it

5. Render will automatically detect the `render.yaml` file and create two services:
   - `tubingen-feedback-tool` - Static site for the frontend
   - `tubingen-feedback-cors-proxy` - Node.js service for the CORS proxy

6. Set the following environment variables for the CORS proxy service:
   - `OPENAI_API_KEY` - Your OpenAI API key

7. Deploy the services

8. Access your application via the URL provided by Render for the frontend service

### Data Structure

The application uses Supabase for data storage with the following schema:

```sql
CREATE TABLE reflections (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  student_name TEXT NOT NULL,
  reflection_text TEXT NOT NULL,
  feedback_text TEXT NOT NULL,
  revised_text TEXT,
  feedback_rating INT,
  usefulness_rating INT,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ,
  rated_at TIMESTAMPTZ
);
```

### Technology Stack

- Frontend: HTML, CSS, JavaScript, Bootstrap 5
- Backend: Node.js, Express
- Database: Supabase (PostgreSQL)
- AI: OpenAI GPT-4o
- Deployment: Render 