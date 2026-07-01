import { PlusCircle, Search, Target, Mic, Bell, TrendingUp } from "lucide-react";

export function PipelineWorkflow() {
  return (
    <div className="py-4 px-6 border rounded-xl bg-background shadow-sm overflow-x-auto">
      <div className="flex items-center space-x-0 min-w-max">
        
        <div className="flex flex-col items-center">
          <div className="h-10 w-10 rounded-full bg-muted/30 text-foreground/80 flex items-center justify-center z-10 relative ring-4 ring-background">
            <PlusCircle className="h-5 w-5" />
          </div>
          <span className="text-[10px] font-medium mt-2 whitespace-nowrap">App Created</span>
        </div>

        <div className="h-1 w-12 bg-muted/30 -ml-2 -mt-6"></div>

        <div className="flex flex-col items-center -ml-1">
          <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center z-10 relative ring-4 ring-background">
            <Search className="h-5 w-5" />
          </div>
          <span className="text-[10px] font-medium mt-2 whitespace-nowrap">Job Matcher</span>
        </div>

        <div className="h-1 w-12 bg-blue-100 -ml-2 -mt-6"></div>

        <div className="flex flex-col items-center -ml-1">
          <div className="h-10 w-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center z-10 relative ring-4 ring-background">
            <Target className="h-5 w-5" />
          </div>
          <span className="text-[10px] font-medium mt-2 whitespace-nowrap">Career Planner</span>
        </div>
        
        <div className="h-1 w-12 bg-indigo-100 -ml-2 -mt-6"></div>

        <div className="flex flex-col items-center -ml-1">
          <div className="h-10 w-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center z-10 relative ring-4 ring-background">
            <Mic className="h-5 w-5" />
          </div>
          <span className="text-[10px] font-medium mt-2 whitespace-nowrap">Interview Coach</span>
        </div>

        <div className="h-1 w-12 bg-purple-100 -ml-2 -mt-6"></div>
        <div className="h-1 w-6 bg-amber-100 -ml-1 -mt-6 relative"><div className="absolute inset-0 bg-amber-500 animate-pulse w-full"></div></div>

        <div className="flex flex-col items-center -ml-1">
          <div className="h-10 w-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center z-10 relative ring-4 ring-background shadow-lg shadow-amber-200">
            <Bell className="h-5 w-5 animate-bounce" />
          </div>
          <span className="text-[10px] font-medium mt-2 whitespace-nowrap text-amber-600">Notifying...</span>
        </div>

        <div className="h-1 w-12 bg-muted/30 -ml-2 -mt-6"></div>

        <div className="flex flex-col items-center -ml-1 opacity-50">
          <div className="h-10 w-10 rounded-full bg-muted/30 text-muted-foreground flex items-center justify-center z-10 relative ring-4 ring-background">
            <TrendingUp className="h-5 w-5" />
          </div>
          <span className="text-[10px] font-medium mt-2 whitespace-nowrap">Score Updated</span>
        </div>

      </div>
    </div>
  );
}
