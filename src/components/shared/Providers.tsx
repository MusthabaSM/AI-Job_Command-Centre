"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from "@/components/ui/tooltip";
import { MotionConfig } from "framer-motion";
import { demoState, auth } from "@/lib/firebase/client";
import { onAuthStateChanged } from "firebase/auth";

export const AuthContext = React.createContext<{ session: any; user: any; loading: boolean }>({ session: null, user: null, loading: true });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = React.useState<any>(null);
  const [user, setUser] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      // Firebase doesn't use a 'session' object exactly like Supabase,
      // but we can pass currentUser as session or just rely on user.
      setSession(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ session, user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function Providers({ children, ...props }: React.ComponentProps<typeof NextThemesProvider>) {
  const [queryClient] = React.useState(() => new QueryClient());

  const content = React.useMemo(() => {
    if (demoState.enabled) {
      return children;
    }
    return (
      <AuthProvider>
        {children}
      </AuthProvider>
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
