import { ShieldAlert, CheckCircle, BarChart2 } from "lucide-react";
import { CircularProgress } from "@/features/dashboard/components/CircularProgress";

export function InterviewEvaluation() {
  return (
    <div className="flex flex-col h-full bg-muted/10 border-l border-border overflow-y-auto">
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold text-sm flex items-center">
          <BarChart2 className="h-4 w-4 mr-2 text-indigo-500" /> AI Evaluation
        </h3>
      </div>

      <div className="p-6 flex flex-col items-center border-b">
        <CircularProgress value={68} size={120} strokeWidth={8} className="text-amber-500" />
        <h4 className="mt-4 font-semibold text-sm">Overall Readiness</h4>
        <p className="text-xs text-muted-foreground text-center mt-2">You need more practice before the TechCorp interview.</p>
      </div>

      <div className="p-4 space-y-5">
        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-3">Live Scorecard</h4>
          <div className="space-y-4">
            
            <div>
              <div className="flex justify-between text-xs mb-1.5 font-medium">
                <span>Technical Accuracy</span>
                <span className="text-amber-600 dark:text-amber-400">65%</span>
              </div>
              <div className="w-full bg-border rounded-full h-1.5 overflow-hidden">
                <div className="bg-gradient-to-r from-amber-600 to-amber-400 h-1.5 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5 font-medium">
                <span>Communication</span>
                <span className="text-emerald-600 dark:text-emerald-400">85%</span>
              </div>
              <div className="w-full bg-border rounded-full h-1.5 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-1.5 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5 font-medium">
                <span>Problem Solving</span>
                <span className="text-amber-600 dark:text-amber-400">60%</span>
              </div>
              <div className="w-full bg-border rounded-full h-1.5 overflow-hidden">
                <div className="bg-gradient-to-r from-amber-600 to-amber-400 h-1.5 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5 font-medium">
                <span>Structure (STAR)</span>
                <span className="text-destructive">40%</span>
              </div>
              <div className="w-full bg-border rounded-full h-1.5 overflow-hidden">
                <div className="bg-gradient-to-r from-destructive to-rose-400 h-1.5 rounded-full" style={{ width: '40%' }}></div>
              </div>
            </div>

          </div>
        </div>

        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-3 flex items-center">
            <CheckCircle className="h-3 w-3 mr-1" /> Strengths
          </h4>
          <p className="text-xs text-foreground bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20 leading-relaxed shadow-sm">
            Clear articulation of fundamental concepts. Good initial approach to load balancing.
          </p>
        </div>

        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-destructive mb-3 flex items-center">
            <ShieldAlert className="h-3 w-3 mr-1" /> Areas to Improve
          </h4>
          <p className="text-xs text-foreground bg-destructive/10 p-3 rounded-xl border border-destructive/20 leading-relaxed shadow-sm">
            You missed handling message queues (e.g. Kafka/RabbitMQ) for data persistence during network drops. Need more structure in system design answers.
          </p>
        </div>

      </div>
    </div>
  );
}
