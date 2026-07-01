import { SectionCard } from "@/components/shared/Cards";
import { CircularProgress } from "@/features/dashboard/components/CircularProgress";

export function AIMatchAnalysis({ matchData }: { matchData?: any }) {
  const overallScore = Math.round(matchData?.match_score || 0);
  
  return (
    <SectionCard title="AI Match Analysis" description="How well your resume fits this role." className="h-full">
      <div className="flex flex-col items-center justify-center py-6 border-b border-border/50">
        <p className="text-[10px] text-muted-foreground mb-4 uppercase tracking-wider font-bold">Overall Match Score</p>
        <div className="relative">
          <div className="absolute inset-0 bg-indigo-500/10 blur-xl rounded-full"></div>
          <CircularProgress value={overallScore} size={140} strokeWidth={12} className="text-indigo-600 dark:text-indigo-400 relative z-10 drop-shadow-sm" />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 pt-6">
        <div className="flex flex-col items-center text-center bg-muted/30 p-4 rounded-xl border border-border/50">
          <CircularProgress value={Math.round(matchData?.skill_coverage || 0)} size={60} strokeWidth={6} className="text-emerald-500 mb-3" />
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Skill Coverage</span>
        </div>
        <div className="flex flex-col items-center text-center bg-muted/30 p-4 rounded-xl border border-border/50">
          <CircularProgress value={Math.round(matchData?.keyword_coverage || 0)} size={60} strokeWidth={6} className="text-amber-500 mb-3" />
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Keyword Match</span>
        </div>
        <div className="flex flex-col items-center text-center bg-muted/30 p-4 rounded-xl border border-border/50">
          <CircularProgress value={90} size={60} strokeWidth={6} className="text-emerald-500 mb-3" />
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Experience Fit</span>
        </div>
        <div className="flex flex-col items-center text-center bg-muted/30 p-4 rounded-xl border border-border/50">
          <CircularProgress value={Math.round(matchData?.categories?.['Frontend'] || matchData?.categories?.['Backend'] || 90)} size={60} strokeWidth={6} className="text-cyan-500 mb-3" />
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Tech Fit</span>
        </div>
      </div>
    </SectionCard>
  );
}
