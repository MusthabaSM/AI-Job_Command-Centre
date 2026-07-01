"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from "@/components/ui/tooltip";
import { MotionConfig } from "framer-motion";
import { AuthGuard } from "lemma-sdk/react";
import { lemmaClient, demoState } from "@/lib/lemma/client";

export function Providers({ children, ...props }: React.ComponentProps<typeof NextThemesProvider>) {
  const [queryClient] = React.useState(() => new QueryClient());

  // In demo mode, we might want to bypass AuthGuard or let it render.
  // The simplest integration that preserves existing functionality is to wrap children,
  // but if Demo Mode is enabled, we could skip AuthGuard to allow offline fallback.
  // "Keep Demo Mode available as an offline fallback, but only after authentication or when the backend is unavailable."
  // For now, we wrap AuthGuard if not in demo mode. If in demo mode, we render children directly.
  
  const content = React.useMemo(() => {
    // We defer the demoState check to avoid hydration mismatch if possible,
    // but demoState.enabled checks cookies/env sync so it's relatively safe.
    if (demoState.enabled) {
      return children;
    }
    return (
      <AuthGuard client={lemmaClient}>
        {children}
      </AuthGuard>
    );
  }, [children]);

  return (
    <NextThemesProvider {...props}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <MotionConfig reducedMotion="user">
            {content}
          </MotionConfig>
        </TooltipProvider>
      </QueryClientProvider>
    </NextThemesProvider>
  );
}
