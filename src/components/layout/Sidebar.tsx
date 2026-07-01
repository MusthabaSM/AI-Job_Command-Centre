"use client";

import { Link } from '@tanstack/react-router';
import { useNavigate, useLocation } from '@tanstack/react-router';
import { cn } from "@/lib/utils";
import { demoState } from "@/lib/lemma/client";
import { 
  LayoutDashboard, 
  FileText, 
  Briefcase, 
  KanbanSquare, 
  Target, 
  MessageSquare,
  Settings,
  BrainCircuit,
  Mic,
  Beaker
} from "lucide-react";

const NAV_ITEMS = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "AI Career OS", href: "/", icon: Target },
  { title: "AI Resume Studio", href: "/resume", icon: FileText },
  { title: "Job Intelligence Studio", href: "/jobs", icon: Briefcase },
  { title: "Career Pipeline", href: "/applications", icon: KanbanSquare },
  { title: "AI Mission Control", href: "/workspace", icon: BrainCircuit },
  { title: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar({ className }: { className?: string }) {
  const { pathname } = useLocation();

  return (
    <aside className={cn("bg-background border-r inset-y-0 left-0 z-50 w-64 h-full", className)}>
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6 font-semibold text-lg text-indigo-600 dark:text-indigo-400">
        <Beaker className="mr-2 h-6 w-6" />
        AI Alchemist
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                  isActive 
                    ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400" 
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.title}
              </Link>
            );
          })}
        </nav>
      </div>
      
      {/* Judge Mode Badge */}
      {demoState.enabled && (
        <div className="mx-3 mb-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Judge Mode</span>
          </div>
          <p className="text-[10px] text-amber-600/70 dark:text-amber-400/70 mt-1">Using demonstration dataset</p>
        </div>
      )}
    </aside>
  );
}

