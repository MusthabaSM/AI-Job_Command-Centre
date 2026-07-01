import { Timeline, TimelineItem } from "@/components/shared/Timeline";
import { SectionCard } from "@/components/shared/Cards";
import { Bot, FileText, Briefcase, ListTodo, Mic, Bell, Target } from "lucide-react";

export function PlannerTimeline({ notifications }: { notifications?: any[] }) {
  return (
    <SectionCard title="Master AI Activity Stream" description="Live feed of all agent executions across your operating system.">
      <div className="pt-4 h-[400px] overflow-y-auto pr-4">
        <Timeline>
          {notifications && notifications.length > 0 ? (
            notifications.map((notif: any, i: number) => (
              <TimelineItem 
                key={notif.id}
                title={notif.title}
                time={new Date(notif.created_at).toLocaleDateString()}
                description={notif.message}
                icon={
                  notif.type === 'info' ? <Bot className="h-4 w-4 text-indigo-500" /> :
                  notif.type === 'success' ? <Target className="h-4 w-4 text-emerald-500" /> :
                  <Bell className="h-4 w-4 text-amber-500" />
                }
                isLast={i === notifications.length - 1}
              />
            ))
          ) : (
            <div className="text-sm text-muted-foreground py-8 text-center bg-muted/20 rounded-xl border border-dashed border-border mt-4">
              No recent AI activity in your timeline.
            </div>
          )}
        </Timeline>
      </div>
    </SectionCard>
  );
}
