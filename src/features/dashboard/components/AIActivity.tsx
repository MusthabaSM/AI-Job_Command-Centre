import { Timeline, TimelineItem } from "@/components/shared/Timeline";
import { Bot, FileText, Sparkles, CheckCircle2 } from "lucide-react";

export function AIActivity({ notifications = [] }: { notifications?: any[] }) {
  return (
    <div className="pt-4 px-2">
      <Timeline>
        {notifications.length > 0 ? (
          notifications.map((notif: any, index: number) => (
            <TimelineItem
              key={notif.id}
              title={notif.title}
              time={new Date(notif.created_at).toLocaleDateString()}
              description={notif.message}
              icon={
                notif.type === 'info' ? <Bot className="h-4 w-4 text-indigo-500" /> :
                notif.type === 'success' ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> :
                <Sparkles className="h-4 w-4 text-amber-500" />
              }
              isLast={index === notifications.length - 1}
            />
          ))
        ) : (
          <div className="text-sm text-muted-foreground py-4 text-center">No recent AI activity.</div>
        )}
      </Timeline>
    </div>
  );
}
