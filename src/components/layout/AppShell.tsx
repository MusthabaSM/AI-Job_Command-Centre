"use client";
import * as React from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { CommandPalette } from "@/components/shared/CommandPalette";
import { useNavigate, useLocation } from '@tanstack/react-router';
import { AuthContext } from "@/components/shared/Providers";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { session, loading } = React.useContext(AuthContext);

  const isAuthRoute = pathname === '/login' || pathname === '/signup' || pathname === '/forgot-password' || pathname === '/onboarding';

  React.useEffect(() => {
    if (!loading && !session && !isAuthRoute) {
      navigate({ to: '/login' });
    }
  }, [loading, session, isAuthRoute, navigate]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (isAuthRoute) {
    return <>{children}</>;
  }

  if (!session) {
    return null;
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/10 overflow-x-hidden">
      <Sidebar className="hidden md:flex flex-col fixed" />
      <div className="flex flex-col sm:gap-4 sm:py-4 md:pl-64">
        <Topbar />
        <main className="flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          {children}
        </main>
      </div>
      <CommandPalette />
    </div>
  );
}
