import { ReactNode } from "react";

interface TimelineItemProps {
  title: string;
  description: ReactNode;
  time?: string;
  icon?: ReactNode;
  isLast?: boolean;
}

export function TimelineItem({ title, description, time, icon, isLast }: TimelineItemProps) {
  return (
    <div className="relative pb-8">
      {!isLast && (
        <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-border" aria-hidden="true" />
      )}
      <div className="relative flex items-start space-x-4">
        <div>
          <div className="relative px-1 mt-1">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted ring-4 ring-background shadow-sm">
              {icon ? icon : <div className="h-2.5 w-2.5 rounded-full bg-indigo-500 shadow-sm shadow-indigo-500/50" />}
            </div>
          </div>
        </div>
        <div className="min-w-0 flex-1 py-1">
          <div className="text-sm text-muted-foreground flex items-center justify-between">
            <span className="font-semibold text-foreground mr-2">{title}</span>
            {time && <span className="whitespace-nowrap text-xs font-medium">{time}</span>}
          </div>
          <div className="mt-2 text-sm text-muted-foreground/90 leading-relaxed bg-muted/20 p-3 rounded-lg border border-border/50">
            {description}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Timeline({ children }: { children: ReactNode }) {
  return <div className="flow-root"><ul role="list" className="-mb-8">{children}</ul></div>;
}
