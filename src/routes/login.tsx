import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate, useLocation } from '@tanstack/react-router';
import { Link } from '@tanstack/react-router';
import { ArrowRight, Sparkles, Hexagon } from "lucide-react";
import { AuthLayout } from "@/features/auth/components/AuthLayout";

function LoginPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleLemmaOAuth = () => {
    setIsLoading(true);
    // Simulate OAuth redirect to lemma.work
    setTimeout(() => {
      document.cookie = "demo_mode=false; path=/";
      document.cookie = "auth_session=true; path=/";
      window.location.href = "/";
    }, 1500);
  };

  const handleJudgeMode = () => {
    setIsLoading(true);
    setTimeout(() => {
      document.cookie = "demo_mode=true; path=/";
      window.location.href = "/";
    }, 800);
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Log in to your AI Alchemist workspace.">
      <div className="space-y-4">
        <Button 
          onClick={handleLemmaOAuth} 
          className="w-full bg-slate-900 hover:bg-slate-800 text-white shadow-md shadow-slate-500/20 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 h-12" 
          disabled={isLoading}
        >
          {isLoading ? "Redirecting to lemma.work..." : (
            <>
              <Hexagon className="mr-2 h-5 w-5" />
              Continue with Lemma
            </>
          )}
        </Button>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <span className="w-1/5 border-b dark:border-slate-800 lg:w-1/4"></span>
        <span className="text-xs text-center text-muted-foreground uppercase">Or</span>
        <span className="w-1/5 border-b dark:border-slate-800 lg:w-1/4"></span>
      </div>

      <div className="mt-8">
        <Button 
          onClick={handleJudgeMode} 
          variant="outline" 
          className="w-full border-indigo-200 bg-indigo-50/50 hover:bg-indigo-100 text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950/30 dark:text-indigo-400 dark:hover:bg-indigo-900/50 group transition-all h-12"
        >
          <Sparkles className="mr-2 h-4 w-4 group-hover:animate-pulse" /> 
          Enter Judge Mode
          <ArrowRight className="ml-2 h-4 w-4 opacity-50 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </AuthLayout>
  );
}
