import * as React from "react";
import { cn } from "@/lib/utils";

export function CircularProgress({
  value,
  size = 120,
  strokeWidth = 10,
  className,
  showValue = true,
  valueClassName,
  label,
}: {
  value: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  showValue?: boolean;
  valueClassName?: string;
  label?: string;
}) {
  const radius = Math.max(0, (size - strokeWidth) / 2);
  const circumference = radius * 2 * Math.PI;
  const clampedValue = Math.min(Math.max(value, 0), 100);
  const offset = circumference - (clampedValue / 100) * circumference;

  // Proportional font sizing so numbers never overflow the circle bounds
  const getFontSize = () => {
    if (size <= 50) return "text-[10px] font-bold";
    if (size <= 70) return "text-xs font-bold";
    if (size <= 95) return "text-sm font-bold";
    if (size <= 130) return "text-2xl font-extrabold";
    return "text-3xl font-extrabold";
  };

  return (
    <div 
      className={cn("relative inline-flex items-center justify-center shrink-0", className)} 
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="rotate-[-90deg]">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-muted/30 opacity-40"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      {showValue && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none p-1">
          <span className={cn(getFontSize(), "tracking-tight leading-none", valueClassName)}>
            {clampedValue}%
          </span>
          {label && size >= 90 && (
            <span className="text-[9px] uppercase tracking-wider text-muted-foreground mt-0.5 font-semibold">
              {label}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
