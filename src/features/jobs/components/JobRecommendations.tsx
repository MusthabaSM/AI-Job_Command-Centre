import { SectionCard } from "@/components/shared/Cards";
import { ArrowUpRight, AlertCircle, Lightbulb, Target } from "lucide-react";
import { SkillBadge } from "@/components/shared/Badges";
import { Button } from "@/components/ui/button";

export function JobRecommendations({ matchData }: { matchData?: any }) {
  const missingSkills = matchData?.missing_skills || [];
  
  return (
    <SectionCard title="AI Recommendations" className="h-full bg-transparent">
      
      <div className="p-5 bg-indigo-500/5 rounded-xl border border-indigo-500/10 mb-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Lightbulb className="h-16 w-16 text-indigo-500" />
        </div>
        <h4 className="text-xs tracking-wider uppercase font-bold flex items-center text-indigo-600 dark:text-indigo-400 mb-2">
          <Lightbulb className="h-3.5 w-3.5 mr-1.5" /> Next Best Action
        </h4>
        <p className="text-sm text-foreground/80 leading-relaxed mb-4 relative z-10">
          {matchData?.recommendations?.[0] || (missingSkills.length > 0 
            ? `Your resume is missing ${missingSkills[0]} experience, which is emphasized in this JD.` 
            : "Your resume is a strong match. Focus on interview prep.")}
        </p>
        <div className="flex items-center justify-between border-t border-indigo-500/10 pt-3 relative z-10">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Expected Gain</span>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">
            <ArrowUpRight className="h-3.5 w-3.5 mr-1" /> +12% Match
          </span>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="text-[10px] uppercase tracking-wider font-bold flex items-center text-destructive mb-3">
            <AlertCircle className="h-3.5 w-3.5 mr-1.5" /> Missing Skills (Critical)
          </h4>
          <div className="flex flex-wrap gap-2">
            {missingSkills.length > 0 ? (
              missingSkills.map((skill: string, i: number) => (
                <SkillBadge key={i} skill={skill} className="bg-destructive/10 text-destructive border-destructive/20 shadow-sm" />
              ))
            ) : (
              <span className="text-xs text-muted-foreground italic">None identified</span>
            )}
          </div>
        </div>

        <div>
          <h4 className="text-[10px] uppercase tracking-wider font-bold flex items-center text-foreground mb-3">
            <Target className="h-3.5 w-3.5 mr-1.5 text-indigo-500" /> Interview Focus Areas
          </h4>
          <ul className="text-sm space-y-2.5 text-muted-foreground pl-6 list-disc">
            {matchData?.recommendations?.slice(1).map((rec: string, i: number) => (
              <li key={i}>{rec}</li>
            )) || (
              <>
                <li>System design and microservices architecture.</li>
                <li>Performance optimization in React (memo, useMemo).</li>
                <li>Behavioral questions on leading small teams.</li>
              </>
            )}
          </ul>
        </div>
      </div>

      <div className="mt-8">
        <Button variant="outline" className="w-full text-xs shadow-sm">Add to Career Tasks</Button>
      </div>
    </SectionCard>
  );
}
