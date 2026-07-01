import { Button } from "@/components/ui/button";
import { UploadCloud, FileSearch, Mic, KanbanSquare, Sparkles, Navigation } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function PlannerActions() {
  const actions = [
    { label: "Upload Resume", icon: UploadCloud, variant: "default", href: "/resume" },
    { label: "Analyze Job", icon: FileSearch, variant: "secondary", href: "/jobs" },
    { label: "Mock Interview", icon: Mic, variant: "outline", href: "/workspace" },
    { label: "Open Applications", icon: KanbanSquare, variant: "outline", href: "/applications" },
  ];

  return (
    <div className="flex flex-wrap gap-3 py-6">
      {actions.map((a, i) => (
        <Link key={i} to={a.href}>
          <Button variant={a.variant as any} className="flex items-center gap-2 rounded-full px-6 shadow-sm">
            <a.icon className="h-4 w-4" />
            {a.label}
          </Button>
        </Link>
      ))}
    </div>
  );
}
