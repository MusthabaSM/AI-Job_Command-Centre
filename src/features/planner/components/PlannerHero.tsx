import { Card, CardContent } from "@/components/ui/card";
import { CircularProgress } from "@/features/dashboard/components/CircularProgress";
import { Target, ArrowUpRight, Clock, CheckCircle2 } from "lucide-react";

export function PlannerHero({ scores, tasks = [], jobs = [] }: { scores?: any, tasks?: any[], jobs?: any[] }) {
  const currentGoal = jobs.length > 0 ? `Land a ${jobs[0].role || jobs[0].title || 'New'} Role` : "Explore New Roles";
  const bestAction = tasks.length > 0 ? tasks[0].title : "Upload your Resume";
  const completedTasks = tasks.filter(t => t.completed).length;
  const remainingTasks = tasks.filter(t => !t.completed).length;
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2 bg-gradient-to-br from-indigo-900 to-slate-900 text-white border-0 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <CardContent className="p-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-8 justify-between">
            <div className="flex-1 space-y-6">
              <div>
                <p className="text-indigo-200 font-medium mb-1 uppercase tracking-widest text-xs">AI Career Operating System</p>
                <h2 className="text-4xl font-bold">Career Readiness</h2>
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                  <p className="text-indigo-200 text-xs mb-1">Resume Score</p>
                  <p className="font-bold text-xl">{scores?.resume || 85}%</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                  <p className="text-indigo-200 text-xs mb-1">ATS Match</p>
                  <p className="font-bold text-xl">{scores?.ats || 78}%</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                  <p className="text-indigo-200 text-xs mb-1">Interview Prep</p>
                  <p className="font-bold text-xl text-emerald-300">{scores?.interview || 75}%</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                  <p className="text-indigo-200 text-xs mb-1">App Health</p>
                  <p className="font-bold text-xl text-emerald-300">Strong</p>
                </div>
              </div>
            </div>

            <div className="flex-shrink-0 flex flex-col items-center">
              <CircularProgress value={scores?.readiness || 81} size={180} strokeWidth={12} className="text-white drop-shadow-lg" />
              <p className="text-center mt-4 text-sm font-medium text-indigo-200">Overall Readiness</p>
            </div>
          </div>
          
          <div className="mt-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="min-w-0 shrink">
              <div className="flex items-center gap-2 text-emerald-400 mb-1">
                <Target className="h-4 w-4 shrink-0" />
                <span className="text-xs font-bold uppercase tracking-wider truncate">Current Goal</span>
              </div>
              <p className="font-semibold text-lg truncate min-w-0">{currentGoal}</p>
            </div>
            
            <div className="h-10 w-px bg-white/20 hidden sm:block shrink-0"></div>

            <div className="flex-1 min-w-0">
              <p className="text-xs text-indigo-200 mb-1 truncate">Next Best Action</p>
              <p className="font-medium text-sm truncate min-w-0">{bestAction}</p>
            </div>

            <div className="text-right shrink-0">
              <p className="text-emerald-400 font-bold flex items-center text-lg">
                <ArrowUpRight className="h-5 w-5 mr-1" /> +5%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-1 border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-teal-700 text-white relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        <CardContent className="p-8 flex flex-col h-full relative z-10 justify-between">
          <div>
            <h3 className="font-bold text-xl mb-1">Weekly Mission</h3>
            <p className="text-emerald-100 text-sm">Stay on track with your AI roadmap.</p>
          </div>
          
          <div className="flex justify-center my-6">
            <CircularProgress value={tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0} size={140} strokeWidth={10} className="text-white" />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="flex items-center"><CheckCircle2 className="h-4 w-4 mr-2" /> Tasks Completed</span>
              <span className="font-bold">{completedTasks}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="flex items-center"><Clock className="h-4 w-4 mr-2 text-emerald-200" /> Tasks Remaining</span>
              <span className="font-bold text-emerald-200">{remainingTasks}</span>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-emerald-400/30 text-center">
            <p className="text-sm font-medium italic">&quot;You are 5% away from your target ATS score. Keep pushing!&quot;</p>
          </div>
        </CardContent>
      </Card>
      
      <div className="col-span-1 lg:col-span-3 mt-4">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight leading-tight max-w-2xl">
          You&apos;re <span className="text-indigo-600">{scores?.readiness || 81}% ready</span> for a {jobs[0]?.company ? `${jobs[0].company} ` : ''}{jobs[0]?.role || jobs[0]?.title || 'Software Engineer'} role. Let&apos;s close the gap.
        </h1>
        <p className="text-xl text-foreground/80 dark:text-slate-400 mt-4 max-w-2xl leading-relaxed">
          We&apos;ve analyzed your pipeline, skills, and the current job market. Here is your personalized action plan to maximize your chances of getting hired.
        </p>
      </div>
    </div>
  );
}
