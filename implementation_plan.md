# Fix Frontend Data Binding Bugs

The frontend is currently rendering hardcoded UI elements and filtering data using incorrect schema keys, resulting in "0%" scores and "undefined" roles despite the backend successfully populating the tables.

## Proposed Changes

### `src/lib/lemma/queries.ts`
- **[MODIFY]**: Update `useCareerScores` to fetch from the `career_scores` table instead of calling the `generate_dashboard_stats` function (which returns completely different metrics like `offer_count`). We will fetch `lemmaClient.records.list('career_scores')` and map the latest row's `overall_score`, `resume_score`, and `application_score` to the `{ readiness, resume, ats }` object expected by the UI.
- **[MODIFY]**: Remove the `generate_dashboard_stats` API call from `useCareerScores`.

### `src/routes/index.tsx`
- **[MODIFY]**: Add `useResumes()` to fetch the latest resume record.
- **[MODIFY]**: Pass the latest resume data (which contains `extracted_skills`) to the `PlannerSkills` component.

### `src/features/planner/components/PlannerSkills.tsx`
- **[MODIFY]**: Accept `resume` as a prop.
- **[MODIFY]**: Replace the hardcoded `SkillBadge` elements ("React", "TypeScript", etc.) with a dynamic map over `resume?.extracted_skills` or `resume?.parsed_skills`.
- **[MODIFY]**: Remove hardcoded Critical Gaps and dynamically map from `jobs[0]?.required_skills` or `jobs[0]?.missing_skills` if available (falling back gracefully).

### `src/features/planner/components/PlannerRoadmap.tsx`
- **[MODIFY]**: The UI filters tasks looking for `t.priority === "Critical" | "High" | "Medium" | "Low"`. The backend table uses lowercase enums: `"high", "medium", "low"`. We will normalize the priority string comparison using `.toLowerCase()` so the tasks actually render in the Roadmap and count towards the Weekly Mission.

### `src/features/planner/components/PlannerHero.tsx`
- **[MODIFY]**: The `jobs` table has a `role` column, not a `title` column. Update `jobs[0]?.title` to `jobs[0]?.role` to fix the "Land a undefined Role" bug.
- **[MODIFY]**: Update `tasks[0]?.title` fallback to ensure it handles lowercase priorities properly.

## Verification Plan
1. Ensure the app builds without errors (`npm run build`).
2. Run `lemma apps deploy ai-alchemist --dist-dir dist` to push the code to the pod.
3. The live website should immediately show the real scores (~78%), real extracted skills (Java, Python, etc.), real career tasks in the roadmap, and the correct job role.
