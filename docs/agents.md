# AI Alchemist Agents

The Lemma Pod architecture exposes multiple specialized AI Agents to coordinate tasks.

## 1. Resume Analyzer (`resume_analyzer`)
Parses uploaded PDF resumes into structured JSON schemas, extracts hard skills, and generates an initial compatibility score.

## 2. ATS Optimizer (`ats_optimizer`)
Compares the parsed resume JSON against specific job descriptions and rewrites bullet points to maximize ATS compatibility.

## 3. Job Matcher (`job_matcher`)
Scrapes or ingests job descriptions and vector-matches them against the user's profile to output a 1-100 `match_score`.

## 4. Career Planner (`career_planner`)
Orchestrates long-term goal setting. Generates the `career_tasks` roadmap items displayed in the Dashboard.

## 5. Interview Coach (`interview_coach`)
Drives the interactive chat interface during Interview Prep. Generates technical questions on the fly and streams markdown responses.

## 6. Notification Manager (`notification_manager`)
Monitors application state changes and dispatches alerts to the user when a job status advances or a task becomes overdue.
