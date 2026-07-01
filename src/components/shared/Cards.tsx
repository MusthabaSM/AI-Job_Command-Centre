import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface SectionCardProps {
  title?: string;
  description?: string;
  children: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function SectionCard({ title, description, children, action, className }: SectionCardProps) {
  return (
    <Card className={cn("card-elevation", className)}>
      {(title || description || action) && (
        <CardHeader className="flex flex-row items-start justify-between border-b border-border/50 bg-muted/20 pb-4 mb-4">
          <div>
            {title && <CardTitle className="text-base tracking-tight">{title}</CardTitle>}
            {description && <CardDescription className="mt-1.5 text-xs">{description}</CardDescription>}
          </div>
          {action && <div>{action}</div>}
        </CardHeader>
      )}
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export function GlassCard({ children, className }: { children: ReactNode, className?: string }) {
  return (
    <div className={cn("glass-panel p-6", className)}>
      {children}
    </div>
  );
}
