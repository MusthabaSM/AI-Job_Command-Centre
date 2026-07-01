import { Button } from "@/components/ui/button";
import { UploadCloud, FileSearch, Mic, Target, ListTodo } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function QuickActions() {
  const actions = [
    { label: "Upload Resume", icon: UploadCloud, variant: "default", href: "/resume" },
    { label: "Analyze Job", icon: FileSearch, variant: "secondary", href: "/jobs" },
    { label: "Mock Interview", icon: Mic, variant: "outline", href: "/workspace" },
    { label: "Career Planner", icon: Target, variant: "outline", href: "/" },
    { label: "Applications", icon: ListTodo, variant: "outline", href: "/applications" },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {actions.map((a, i) => (
        <Link key={i} to={a.href}>
          <Button variant={a.variant as any} className="flex items-center gap-2">
            <a.icon className="h-4 w-4" />
            {a.label}
          </Button>
        </Link>
      ))}
    </div>
  );
}
