import { Loader2, Sparkles, FolderSearch, ArrowRight } from "lucide-react";
import { ReactNode, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export function LoadingState({ text = "Loading...", steps }: { text?: string; steps?: string[] }) {
  const [stepIndex, setStepIndex] = useState(0);
  
  useEffect(() => {
    if (!steps || steps.length === 0) return;
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % steps.length);
    }, 1200);
    return () => clearInterval(interval);
  }, [steps]);

  return (
    <div className="flex flex-col items-center justify-center p-12 text-muted-foreground">
      <div className="relative mb-4">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
        <div className="absolute inset-0 h-8 w-8 animate-ping text-indigo-500 opacity-10 rounded-full" />
      </div>
      <p className="font-medium text-foreground text-sm">{steps ? steps[stepIndex] : text}</p>
      {steps && (
        <div className="flex gap-1 mt-3">
          {steps.map((_, i) => (
            <div 
              key={i} 
              className={`h-1 w-6 rounded-full transition-all duration-300 ${i <= stepIndex ? 'bg-indigo-500' : 'bg-muted'}`} 
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function AIThinking({ text = "AI is analyzing..." }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-muted-foreground">
      <div className="relative mb-4">
        <Sparkles className="h-8 w-8 text-indigo-500 animate-pulse" />
        <div className="absolute inset-0 h-8 w-8 text-indigo-500 animate-ping opacity-20 rounded-full" />
      </div>
      <p className="animate-pulse font-medium text-foreground text-sm">{text}</p>
    </div>
  );
}

export function EmptyState({ 
  title = "No data found", 
  description = "Get started by creating a new entry.",
  icon,
  action,
  hint
}: { 
  title?: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  hint?: string;
}) {
  return (
    <div className="text-center rounded-xl border border-dashed p-12 sm:p-16">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-500/10 mb-4">
        {icon || <FolderSearch className="h-6 w-6 text-indigo-500" />}
      </div>
      <h3 className="mt-2 text-sm font-semibold text-foreground">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground mb-4">{description}</p>
      {hint && (
        <p className="text-[11px] text-muted-foreground/70 mb-4 flex items-center justify-center gap-1">
          <Sparkles className="h-3 w-3" /> {hint}
        </p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}
