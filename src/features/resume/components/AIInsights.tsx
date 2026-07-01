import { SectionCard } from "@/components/shared/Cards";
import { ArrowUpRight, TrendingUp, AlertTriangle, Lightbulb } from "lucide-react";
import { ScoreBadge, SkillBadge } from "@/components/shared/Badges";

export function AIInsights({ resume }: { resume?: any }) {
  if (!resume) {
    return (
      <SectionCard title="AI Insights" className="h-full bg-muted/5 border-dashed">
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-12 text-center">
          <Lightbulb className="h-10 w-10 mb-4 text-slate-400 opacity-50" />
          <h3 className="text-lg font-medium text-foreground mb-1">No Resume Selected</h3>
          <p className="text-sm">Select a resume to view AI-generated insights, scoring, and analysis notes.</p>
        </div>
      </SectionCard>
    );
  }

  const isProcessing = resume.agent_status === 'pending' || resume.agent_status === 'processing';
  const isError = resume.agent_status === 'error';

  if (isProcessing) {
    return (
      <SectionCard title="AI Insights" className="h-full bg-muted/10">
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-sm p-6 text-center">
          <p className="animate-pulse">AI is currently analyzing this resume...</p>
          <p className="mt-2 text-xs">Insights will appear here once processing is complete.</p>
        </div>
      </SectionCard>
    );
  }

  if (isError) {
    return (
      <SectionCard title="AI Insights" className="h-full bg-muted/10">
        <div className="flex flex-col items-center justify-center h-full text-red-500 text-sm p-6 text-center">
          <AlertTriangle className="h-8 w-8 mb-4" />
          <p className="font-semibold mb-2">Analysis Failed</p>
          <p className="text-xs">{resume.agent_notes || "An unknown error occurred during parsing."}</p>
        </div>
      </SectionCard>
    );
  }

  return (
    <SectionCard title="AI Insights" className="bg-transparent">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mt-4">
        <div className="p-4 bg-background shadow-sm rounded-xl border border-border flex flex-col items-center justify-center text-center">
          <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-3">Overall Score</p>
          <ScoreBadge score={resume.overall_score ? Math.round(resume.overall_score) : 0} className="text-xl px-5 py-2.5 shadow-sm" />
        </div>
        <div className="p-4 bg-background shadow-sm rounded-xl border border-border flex flex-col items-center justify-center text-center">
          <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-3">Status</p>
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1.5 rounded-lg border border-emerald-500/20 text-center break-words">{resume.agent_status || "Completed"}</span>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {resume.agent_notes && (
          <div className="p-5 bg-indigo-500/5 rounded-xl border border-indigo-500/10 relative overflow-hidden shadow-sm">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Lightbulb className="h-16 w-16 text-indigo-500" />
            </div>
            <h4 className="text-xs uppercase tracking-wider font-bold flex items-center text-indigo-600 dark:text-indigo-400 mb-3 relative z-10">
              <Lightbulb className="h-3.5 w-3.5 mr-1.5" /> Agent Notes
            </h4>
            <p className="text-sm text-foreground/90 leading-relaxed relative z-10">
              {resume.agent_notes}
            </p>
          </div>
        )}
      </div>
    </SectionCard>
  );
}
