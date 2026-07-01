import { UploadCloud, Bot, Code, RefreshCcw, Target } from "lucide-react";

export function ResumePipeline() {
  return (
    <div className="py-5 px-6 border border-border rounded-xl bg-background shadow-sm overflow-x-auto relative">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay"></div>
      <div className="flex items-center space-x-0 min-w-max relative z-10">
        
        <div className="flex flex-col items-center">
          <div className="h-10 w-10 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center z-10 relative ring-4 ring-background">
            <UploadCloud className="h-4 w-4" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider mt-2 whitespace-nowrap text-muted-foreground">Uploaded</span>
        </div>

        <div className="h-1 w-16 bg-emerald-500/10 -ml-2 -mt-6"></div>
        <div className="h-1 w-8 bg-indigo-500/10 -ml-1 -mt-6 relative"><div className="absolute inset-0 bg-indigo-500 animate-pulse w-full rounded-full"></div></div>

        <div className="flex flex-col items-center -ml-1">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center z-10 relative ring-4 ring-background shadow-md shadow-indigo-500/20">
            <Bot className="h-4 w-4 animate-bounce" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider mt-2 whitespace-nowrap text-indigo-600 dark:text-indigo-400">Resume Analyzer</span>
        </div>

        <div className="h-1 w-16 bg-muted -ml-2 -mt-6"></div>

        <div className="flex flex-col items-center -ml-1 opacity-50 grayscale">
          <div className="h-10 w-10 rounded-full bg-muted text-muted-foreground flex items-center justify-center z-10 relative ring-4 ring-background">
            <Code className="h-4 w-4" />
          </div>
          <span className="text-[10px] font-medium mt-2 whitespace-nowrap text-muted-foreground">normalize()</span>
        </div>

        <div className="h-1 w-16 bg-muted -ml-2 -mt-6"></div>

        <div className="flex flex-col items-center -ml-1 opacity-50 grayscale">
          <div className="h-10 w-10 rounded-full bg-muted text-muted-foreground flex items-center justify-center z-10 relative ring-4 ring-background">
            <RefreshCcw className="h-4 w-4" />
          </div>
          <span className="text-[10px] font-medium mt-2 whitespace-nowrap text-muted-foreground">ATS Optimizer</span>
        </div>
        
        <div className="h-1 w-16 bg-muted -ml-2 -mt-6"></div>

        <div className="flex flex-col items-center -ml-1 opacity-50 grayscale">
          <div className="h-10 w-10 rounded-full bg-muted text-muted-foreground flex items-center justify-center z-10 relative ring-4 ring-background">
            <Target className="h-4 w-4" />
          </div>
          <span className="text-[10px] font-medium mt-2 whitespace-nowrap text-muted-foreground">Career Planner</span>
        </div>

      </div>
    </div>
  );
}
