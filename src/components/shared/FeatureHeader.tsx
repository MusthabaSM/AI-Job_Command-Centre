import { Bot, Database, Cpu, Clock } from "lucide-react";
import { demoState } from "@/lib/firebase/client";

interface FeatureHeaderProps {
  title: string;
  description: string;
  agent: string;
  resources: string[];
  estimatedTime?: string;
}

export function FeatureHeader({ title, description, agent, resources, estimatedTime }: FeatureHeaderProps) {
  return (
    <div className="relative rounded-xl border border-border bg-muted/10 p-4 mb-6 overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
      
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-lg font-bold tracking-tight text-foreground">{title}</h2>
            {demoState.enabled && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                Judge Mode
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 text-[11px] shrink-0">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/15 font-medium">
            <Bot className="h-3 w-3" />
            <span>{agent}</span>
          </div>
          {resources.map((r, i) => (
            <div key={i} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/15 font-medium">
              {r.includes("table") || r.includes("records") ? <Database className="h-3 w-3" /> : <Cpu className="h-3 w-3" />}
              <span>{r}</span>
            </div>
          ))}
          {estimatedTime && (
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/15 font-medium">
              <Clock className="h-3 w-3" />
              <span>{estimatedTime}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
