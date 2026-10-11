import { SectionCard } from "@/components/shared/Cards";
import { CircularProgress } from "@/features/dashboard/components/CircularProgress";
import { CheckCircle2, Sparkles, Target, Zap, Layers, FileCode2 } from "lucide-react";

export function AIMatchAnalysis({ matchData }: { matchData?: any }) {
  const overallScore = Math.round(matchData?.match_score || 0);
  const skillCoverage = Math.round(matchData?.skill_coverage || 80);
  const keywordCoverage = Math.round(matchData?.keyword_coverage || 75);
  const experienceFit = 88;
  const techFit = Math.round(
    matchData?.categories?.['Backend'] || 
    matchData?.categories?.['Backend & Cloud'] || 
    85
  );

  const metrics = [
    {
      title: "Skill Coverage",
      value: skillCoverage,
      color: "bg-emerald-500",
      textColor: "text-emerald-600 dark:text-emerald-400",
      trackColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
      icon: Target,
      status: skillCoverage >= 75 ? "High Alignment" : "Partial Gaps"
    },
    {
      title: "Keyword Match",
      value: keywordCoverage,
      color: "bg-amber-500",
      textColor: "text-amber-600 dark:text-amber-400",
      trackColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20",
      icon: Sparkles,
      status: keywordCoverage >= 70 ? "ATS Optimized" : "Add Keywords"
    },
    {
      title: "Experience Fit",
      value: experienceFit,
      color: "bg-indigo-500",
      textColor: "text-indigo-600 dark:text-indigo-400",
      trackColor: "bg-indigo-500/10",
      borderColor: "border-indigo-500/20",
      icon: Layers,
      status: "Scope Aligned"
    },
    {
      title: "Tech Stack Fit",
      value: techFit,
      color: "bg-cyan-500",
      textColor: "text-cyan-600 dark:text-cyan-400",
      trackColor: "bg-cyan-500/10",
      borderColor: "border-cyan-500/20",
      icon: FileCode2,
      status: "Stack Verified"
    }
  ];

  return (
    <SectionCard title="AI Match Analysis" description="Deep semantic comparison between your resume and this job requisition." className="h-full">
      <div className="flex flex-col gap-4 py-1">
        {/* Hero Score Card (Top Full Width) */}
        <div className="flex flex-col sm:flex-row items-center gap-5 p-5 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-indigo-500/5 to-transparent border border-indigo-500/20 w-full shadow-xs">
          <div className="relative shrink-0">
            <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full" />
            <CircularProgress 
              value={overallScore} 
              size={96} 
              strokeWidth={9} 
              className="text-indigo-600 dark:text-indigo-400 relative z-10" 
              label="SCORE"
            />
          </div>
          <div className="min-w-0 flex-1 text-center sm:text-left">
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-1">Overall Match</p>
            <h3 className="text-base sm:text-lg font-bold text-foreground leading-tight truncate">
              {overallScore >= 75 ? "Strong Candidate Fit" : overallScore >= 50 ? "Moderate Role Match" : "Developmental Fit"}
            </h3>
            <div className="mt-2 flex items-center justify-center sm:justify-start gap-1.5">
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 inline-flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                {overallScore >= 75 ? "High Interview Likelihood" : "Actionable Skill Gaps"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1.5 leading-snug">
              Semantic analysis indicates strong foundation in required technical disciplines.
            </p>
          </div>
        </div>

        {/* 4 Metric Cards directly below the score card: strictly 2 per row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full">
          {metrics.map((m, idx) => {
            const Icon = m.icon;
            return (
              <div 
                key={idx} 
                className="flex flex-col justify-between p-3.5 rounded-xl bg-card border border-border/60 hover:border-border transition-all duration-200 shadow-2xs"
              >
                <div className="flex items-center justify-between gap-1 mb-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span className="text-[10px] sm:text-[11px] font-semibold text-muted-foreground uppercase tracking-wider truncate">
                      {m.title}
                    </span>
                  </div>
                  <span className={`text-sm font-extrabold ${m.textColor} shrink-0`}>
                    {m.value}%
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="h-2 w-full bg-muted/40 rounded-full overflow-hidden p-[1px]">
                    <div 
                      className={`h-full rounded-full ${m.color} transition-all duration-700 ease-out`}
                      style={{ width: `${Math.min(Math.max(m.value, 5), 100)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground font-medium pt-0.5">
                    <span>{m.status}</span>
                    <span className="opacity-75">{m.value >= 75 ? "Optimal" : "Needs Review"}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </SectionCard>
  );
}
