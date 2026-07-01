import { Card, CardContent } from "@/components/ui/card";
import { CircularProgress } from "./CircularProgress";
import { ArrowUpRight, Target, Sparkles, Brain } from "lucide-react";

export function HeroSection({ scores, tasks = [], jobs = [] }: { scores: any, tasks?: any[], jobs?: any[] }) {
  const currentGoal = jobs.length > 0 ? `Land a ${jobs[0].role || jobs[0].title || 'New'} Role` : "Explore New Roles";
  const bestAction = tasks.length > 0 ? tasks[0].title : "Upload your Resume";
  const readinessLabel = scores?.readiness > 80 ? 'Excellent' : scores?.readiness > 60 ? 'Good' : scores?.readiness > 40 ? 'Improving' : 'Getting Started';
  
  return (
    <div className="grid gap-4 md:grid-cols-5">
      {/* Career Readiness — Big Hero */}
      <Card className="md:col-span-2 bg-gradient-to-br from-indigo-600 via-violet-600 to-cyan-600 text-white border-0 shadow-lg shadow-indigo-500/20 overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
        <CardContent className="flex items-center justify-between p-6 h-full relative z-10">
          <div>
            <p className="text-indigo-200/80 text-[10px] font-bold uppercase tracking-widest mb-1">AI Career Readiness</p>
            <h2 className="text-3xl font-bold mb-1 tracking-tight">{readinessLabel}</h2>
            <p className="text-indigo-200/60 text-xs">Based on resume, skills, and active applications</p>
            <div className="flex gap-5 text-sm mt-4">
              <div>
                <p className="text-indigo-200/70 text-[10px] uppercase tracking-wider mb-0.5">Resume</p>
                <p className="font-bold text-lg">{scores?.resume || 0}<span className="text-sm font-normal text-indigo-200/70">/100</span></p>
              </div>
              <div>
                <p className="text-indigo-200/70 text-[10px] uppercase tracking-wider mb-0.5">ATS Match</p>
                <p className="font-bold text-lg">{scores?.ats || 0}<span className="text-sm font-normal text-indigo-200/70">%</span></p>
              </div>
            </div>
          </div>
          <div className="relative">
             <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full" />
             <CircularProgress value={scores?.readiness || 0} size={110} strokeWidth={8} className="text-white relative z-10 drop-shadow-md" />
          </div>
        </CardContent>
      </Card>

      {/* Current Goal */}
      <Card className="md:col-span-2 card-elevation border-transparent">
        <CardContent className="p-6 flex flex-col justify-center h-full">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <div className="p-1.5 bg-emerald-500/10 rounded-md border border-emerald-500/20">
              <Target className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Current Goal</span>
          </div>
          <h3 className="text-xl font-semibold mb-4 text-foreground tracking-tight">{currentGoal}</h3>
          
          <div className="bg-muted/30 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between border border-border gap-3">
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-muted-foreground mb-0.5 uppercase tracking-widest truncate">Next Best Action</p>
              <p className="font-medium text-sm text-foreground truncate min-w-0">{bestAction}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-end bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20 shadow-sm text-sm">
                <ArrowUpRight className="h-3.5 w-3.5 mr-1 shrink-0" /> +5%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Confidence Card */}
      <Card className="md:col-span-1 card-elevation border-transparent">
        <CardContent className="p-5 flex flex-col justify-center h-full">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 bg-indigo-500/10 rounded-md border border-indigo-500/20">
              <Brain className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">AI Status</span>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Agents Active</p>
              <p className="text-lg font-bold text-foreground">5 <span className="text-xs font-normal text-emerald-500">online</span></p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Tasks Generated</p>
              <p className="text-lg font-bold text-foreground">{tasks.length}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Jobs Tracked</p>
              <p className="text-lg font-bold text-foreground">{jobs.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
