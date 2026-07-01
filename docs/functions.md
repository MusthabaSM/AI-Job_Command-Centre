# AI Alchemist Functions

The Lemma Backend exposes the following pure functions designed to process data before storing it in the tables.

- `calculate_job_match`: Vector-compares the `resumes` and `jobs` schema to output a match score.
- `calculate_career_score`: Aggregates the resume ATS score and interview mock scores to produce a final `readiness` metric.
- `normalize_resume`: Cleanses raw PDF parsed data into a standard schema.
- `validate_resume`: Ensures all mandatory schema fields (education, skills, experience) are populated.
- `generate_dashboard_stats`: Compiles `career_scores` and `career_tasks` specifically for the Dashboard UI payload.
