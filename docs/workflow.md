# AI Alchemist Workflows

These are the primary interconnected state-machine workflows executed by the Lemma Pod.

## 1. Resume Processing Workflow
1. User uploads PDF.
2. `resume_analyzer` Agent processes it.
3. `normalize_resume` Function cleans it.
4. `ats_optimizer` Agent rewrites it.
5. Saved to `resumes` table.
6. `calculate_career_score` updates the Dashboard.

## 2. Job Matching Workflow
1. User saves a Job.
2. `job_matcher` Agent analyzes JD.
3. `calculate_job_match` Function outputs score.
4. `career_planner` Agent identifies missing skills and adds to `career_tasks`.
5. Dashboard instantly reflects the new Tasks.

## 3. Interview Preparation Workflow
1. Application status transitions to "Interview".
2. `interview_coach` Agent reads JD and Resume.
3. Chat session generates mock questions.
4. `calculate_career_score` Function updates `readiness` based on interview performance.
