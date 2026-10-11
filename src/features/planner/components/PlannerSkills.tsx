import { SectionCard } from "@/components/shared/Cards";
import { SkillBadge } from "@/components/shared/Badges";
import { TrendingUp, AlertTriangle } from "lucide-react";

export function PlannerSkills({ resume, jobs = [] }: { resume?: any, jobs?: any[] }) {
  const safeArray = (val: any) => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    if (typeof val === 'string') {
      try {
        const parsed = JSON.parse(val);
        if (Array.isArray(parsed)) return parsed;
        if (typeof parsed === 'object' && parsed !== null) return Object.values(parsed).flat();
      } catch (e) {
        return [];
      }
    }
    if (typeof val === 'object' && val !== null) {
      return Object.values(val).flat();
    }
    return [];
  };

  const safeSkillsArray = (val: any): string[] => {
    const arr = safeArray(val);
    const extractStrings = (item: any): string[] => {
      if (!item) return [];
      if (typeof item === 'string') return [item];
      if (typeof item === 'number' || typeof item === 'boolean') return [String(item)];
      if (Array.isArray(item)) return item.map(extractStrings).flat();
      if (typeof item === 'object') return Object.values(item).map(extractStrings).flat();
      return [];
    };
    return arr.map(extractStrings).flat();
  };

  const skillsList = safeSkillsArray(resume?.extracted_skills || resume?.parsed_skills || ['Java', 'Python', 'TypeScript', 'React', 'Node.js', 'PostgreSQL', 'MongoDB', 'Redis', 'AWS']);

  const activeJob = jobs.length > 0 ? jobs[0] : null;
  const missingSkills = activeJob?.missing_skills || [];

  return (
    <SectionCard title="Skill Intelligence" description="Real-time analysis of your market value.">
      <div className="space-y-8 mt-4">
        
        <div>
          <h4 className="text-[10px] uppercase tracking-wider font-bold mb-3 flex items-center text-foreground">
            <TrendingUp className="h-3.5 w-3.5 mr-1.5 text-indigo-500" /> Current Strengths
          </h4>
          <div className="flex flex-wrap gap-2">
            {skillsList.length > 0 ? skillsList.slice(0, 10).map((skill, i) => (
              <SkillBadge key={i} skill={skill} className={i < 2 ? "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20" : ""} />
            )) : <p className="text-xs text-muted-foreground">Upload a resume to extract skills.</p>}
          </div>
        </div>

        <div>
          <h4 className="text-[10px] uppercase tracking-wider font-bold mb-4 flex items-center text-destructive">
            <AlertTriangle className="h-3.5 w-3.5 mr-1.5" /> Critical Gaps
          </h4>
          <div className="space-y-4">
            {missingSkills.length > 0 ? missingSkills.map((gap: string, i: number) => (
              <div key={i}>
                <div className="flex justify-between text-xs font-medium mb-1.5">
                  <span className="text-foreground">{gap}</span>
                  <span className="text-destructive font-bold">0%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                  <div className="bg-destructive h-1.5 rounded-full" style={{ width: '0%' }}></div>
                </div>
              </div>
            )) : <p className="text-xs text-muted-foreground">No critical gaps identified.</p>}
          </div>
        </div>

        <div className="bg-indigo-500/5 p-5 rounded-xl border border-indigo-500/10 text-sm shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl -mr-10 -mt-10 rounded-full"></div>
          <p className="font-bold text-xs uppercase tracking-wider mb-3 text-indigo-600 dark:text-indigo-400 flex items-center relative z-10">
            Recommended Learning Path
          </p>
          <ol className="list-decimal list-inside text-foreground/80 space-y-2.5 text-xs font-medium relative z-10">
            {missingSkills.length > 0 ? missingSkills.map((gap: string, i: number) => (
              <li key={i}>Master fundamentals of {gap}</li>
            )) : <li>Continue current path</li>}
          </ol>
        </div>

      </div>
    </SectionCard>
  );
}
