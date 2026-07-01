import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/signup')({
  component: SignupPage,
})

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate, useLocation } from '@tanstack/react-router';
import { Link } from '@tanstack/react-router';
import { Hexagon } from "lucide-react";
import { AuthLayout } from "@/features/auth/components/AuthLayout";

function SignupPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleLemmaOAuth = () => {
    setIsLoading(true);
    // Simulate OAuth redirect to lemma.work
    setTimeout(() => {
      document.cookie = "demo_mode=false; path=/";
      document.cookie = "auth_session=true; path=/";
      window.location.href = "/onboarding";
    }, 1500);
  };

  return (
    <AuthLayout title="Create an account" subtitle="Start building your ultimate career pipeline.">
      <div className="space-y-4">
        <Button 
          onClick={handleLemmaOAuth} 
          className="w-full bg-slate-900 hover:bg-slate-800 text-white shadow-md shadow-slate-500/20 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 h-12" 
          disabled={isLoading}
        >
          {isLoading ? "Redirecting to lemma.work..." : (
            <>
              <Hexagon className="mr-2 h-5 w-5" />
              Sign up with Lemma
            </>
          )}
        </Button>
      </div>

      <p className="mt-8 text-center text-sm text-foreground/80 dark:text-slate-400">
        Already have an account? <Link to="/login" className="font-semibold text-indigo-600 hover:underline">Sign in</Link>
      </p>
    </AuthLayout>
  );
}
