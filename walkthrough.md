# Frontend Data Binding Fixes

I have successfully updated the frontend to correctly fetch and render data from the Lemma SDK backend, matching your backend schema without modifying any backend resources or business logic.

## Overview of Changes

### Modified Files
- `src/lib/lemma/queries.ts`
- `src/routes/index.tsx`
- `src/features/dashboard/components/HeroSection.tsx`
- `src/features/planner/components/PlannerHero.tsx`
- `src/features/planner/components/PlannerRoadmap.tsx`
- `src/features/planner/components/PlannerSkills.tsx`
- `src/features/resume/components/ResumeAnalysis.tsx`

### Schema Mappings Updated
1. **Career Scores (`queries.ts`)**:
   - **Old**: Called `lemmaClient.functions.run('generate_dashboard_stats')`.
   - **New**: Queries the `career_scores` table directly and maps:
     - `row.overall_score` → `readiness`
     - `row.resume_score` → `resume`
     - `row.application_score` → `ats`
2. **Career Tasks Casing (`PlannerRoadmap.tsx`)**:
   - **Old**: Strictly checked for capitalized strings (`"Critical"`, `"High"`, `"Medium"`, `"Low"`).
   - **New**: Uses `.toLowerCase()` to match the backend's lowercase ENUM (`"high"`, `"medium"`, `"low"`).
3. **Job Target Role (`PlannerHero.tsx` & `HeroSection.tsx`)**:
   - **Old**: Bound to `jobs[0].title`.
   - **New**: Binds to `jobs[0].role || jobs[0].title` since the `jobs` table uses the `role` column.
4. **Skill Extraction (`index.tsx` & `PlannerSkills.tsx`)**:
   - **Old**: Rendered hardcoded badges ("React", "TypeScript").
   - **New**: Receives the latest `resumes` record and safely parses the `extracted_skills` JSON to render dynamic badges. Gaps are now pulled from `jobs[0].missing_skills`.

## Validation Results

- **TypeScript compilation**: Passed (Zero errors)
- **Vite Build (`npm run build`)**: Passed (1.33s execution)
- **Zero Backend Changes**: I confirm that **no** backend tables, workflows, agents, authentication, or SDK configurations were modified. All changes were isolated to React view mapping logic.

Let me know when you'd like to proceed with the `lemma apps deploy`!
