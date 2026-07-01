import React from "react";
import { Target } from "lucide-react";

export function AuthLayout({ children, title, subtitle }: { children: React.ReactNode, title: string, subtitle: string }) {
  return (
    <div className="min-h-screen flex w-full bg-background">
      
      {/* Left Form Panel */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-12 lg:px-24 xl:px-32 relative z-10">
        <div className="w-full max-w-[420px] mx-auto">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xl mb-8">
            <Target className="h-6 w-6" /> AI Alchemist
          </div>
          
          <h1 className="text-3xl font-bold tracking-tight mb-2 text-foreground dark:text-slate-100">{title}</h1>
          <p className="text-sm text-muted-foreground mb-8">{subtitle}</p>
          
          {children}
        </div>
      </div>

      {/* Right Graphic Panel */}
      <div className="hidden lg:flex flex-1 bg-muted/10 relative items-center justify-center overflow-hidden">
        {/* Decorative Gradients */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-500/20 rounded-full blur-3xl mix-blend-multiply filter animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-500/20 rounded-full blur-3xl mix-blend-multiply filter"></div>
        
        {/* Central Graphic */}
        <div className="relative z-10 max-w-lg text-center">
          <div className="w-64 h-64 mx-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl flex items-center justify-center mb-8 transform -rotate-6 hover:rotate-0 transition-transform duration-300">
            <Target className="h-24 w-24 text-indigo-500" />
          </div>
          <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-slate-200">The Ultimate Career Operating System</h2>
          <p className="text-foreground/80 dark:text-slate-400 text-lg">Harness multi-agent AI to optimize your resume, prepare for interviews, and land your dream job.</p>
        </div>
      </div>

    </div>
  );
}
