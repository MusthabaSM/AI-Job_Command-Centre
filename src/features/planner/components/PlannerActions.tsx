import { Button } from "@/components/ui/button";
import { UploadCloud, FileSearch, Mic, KanbanSquare, MessageSquare, Sparkles, Navigation } from "lucide-react";

export function PlannerActions() {
  const actions = [
    { label: "Upload Resume", icon: UploadCloud, variant: "default" },
    { label: "Analyze Job", icon: FileSearch, variant: "secondary" },
    { label: "Mock Interview", icon: Mic, variant: "outline" },
    { label: "Open Applications", icon: KanbanSquare, variant: "outline" },
    { label: "Chat with AI", icon: MessageSquare, variant: "outline" },
    { label: "Optimize Resume", icon: Sparkles, variant: "outline" },
    { label: "Generate Study Plan", icon: Navigation, variant: "outline" },
  ];

  return (
    <div className="flex flex-wrap gap-3 py-6">
      {actions.map((a, i) => (
        <Button key={i} variant={a.variant as any} className="flex items-center gap-2 rounded-full px-6 shadow-sm">
          <a.icon className="h-4 w-4" />
          {a.label}
        </Button>
      ))}
    </div>
  );
}
