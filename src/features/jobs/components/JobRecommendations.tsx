import { useState } from "react";
import { SectionCard } from "@/components/shared/Cards";
import { ArrowUpRight, AlertCircle, Lightbulb, Target, Sparkles, RefreshCcw } from "lucide-react";
import { SkillBadge } from "@/components/shared/Badges";
import { Button } from "@/components/ui/button";
import { useCreateCareerTask } from "@/lib/firebase/queries";
import { toast } from "sonner";

export function JobRecommendations({ matchData }: { matchData?: any }) {
  const missingSkills = matchData?.missing_skills || [];
  const createCareerTask = useCreateCareerTask();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCareerTasks = async () => {
    setIsAdding(true);
    try {
      let count = 0;
      if (missingSkills.length > 0) {
        for (const skill of missingSkills) {
          await createCareerTask.mutateAsync({
            title: `Bridge Skill Gap: Master ${skill} for ${matchData?.company || 'target role'}`,
            priority: 'High',
            impact: '10',
            time: '2 hours',
            difficulty: 'Medium',
            category: 'Skill Gap'
          });
          count++;
        }
      }

      // Also add interview prep task
      const focusAreas = matchData?.recommendations?.slice(1) || [
        "System design and microservices architecture.",
        "Performance optimization and streaming pipelines."
      ];
      if (focusAreas.length > 0) {
        await createCareerTask.mutateAsync({
          title: `Interview Prep: ${focusAreas[0]} for ${matchData?.company || 'target role'}`,
          priority: 'Medium',
          impact: '8',
          time: '1 hour',
          difficulty: 'Medium',
          category: 'Interview Prep'
        });
        count++;
      }

      toast.success(`Added ${count} actionable tasks to your AI Strategic Roadmap!`);
    } catch (err: any) {
      toast.error("Failed to add tasks: " + err.message);
    } finally {
      setIsAdding(false);
    }
  };
  
  return (
    <SectionCard title="AI Recommendations" className="bg-transparent overflow-visible">
      
      <div className="p-4 bg-gradient-to-br from-indigo-500/10 via-indigo-500/5 to-transparent rounded-xl border border-indigo-500/15 mb-5 shadow-2xs">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs tracking-wider uppercase font-bold flex items-center text-indigo-600 dark:text-indigo-400">
            <Lightbulb className="h-3.5 w-3.5 mr-1.5" /> Next Best Action
          </h4>
          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
            <ArrowUpRight className="h-3.5 w-3.5 mr-0.5" /> +12% Match
          </span>
        </div>
        <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
          {matchData?.recommendations?.[0] || (missingSkills.length > 0 
            ? `Your resume is missing ${missingSkills[0]} experience, which is heavily emphasized in this JD.` 
            : "Your resume is a strong match. Focus on targeted interview prep.")}
        </p>
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
        <Button 
          onClick={handleAddToCareerTasks}
          disabled={isAdding}
          variant="outline" 
          className="w-full text-xs shadow-sm flex items-center justify-center gap-2 border-indigo-500/20 hover:bg-indigo-500/5 text-indigo-600 dark:text-indigo-400"
        >
          {isAdding ? (
            <>
              <RefreshCcw className="h-3.5 w-3.5 animate-spin" />
              Adding to AI Strategic Roadmap...
            </>
          ) : (
            <>
              <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
              Add to Career Tasks
            </>
          )}
        </Button>
      </div>
    </SectionCard>
  );
}
