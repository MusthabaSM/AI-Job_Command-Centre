import { Button } from "@/components/ui/button";
import { UploadCloud, FileSearch, Mic, Target, ListTodo } from "lucide-react";

export function QuickActions() {
  const actions = [
    { label: "Upload Resume", icon: UploadCloud, variant: "default" },
    { label: "Analyze Job", icon: FileSearch, variant: "secondary" },
    { label: "Mock Interview", icon: Mic, variant: "outline" },
    { label: "Career Planner", icon: Target, variant: "outline" },
    { label: "Applications", icon: ListTodo, variant: "outline" },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {actions.map((a, i) => (
        <Button key={i} variant={a.variant as any} className="flex items-center gap-2">
          <a.icon className="h-4 w-4" />
          {a.label}
        </Button>
      ))}
    </div>
  );
}
