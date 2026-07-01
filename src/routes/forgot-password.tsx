import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/forgot-password')({
  component: ForgotPasswordPage,
})

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from '@tanstack/react-router';
import { AuthLayout } from "@/features/auth/components/AuthLayout";

function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1000);
  };

  return (
    <AuthLayout title="Reset Password" subtitle="Enter your email to receive a password reset link.">
      
      {!isSubmitted ? (
        <form onSubmit={handleReset} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Email</label>
            <Input type="email" placeholder="alex@example.com" required />
          </div>
          
          <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 mt-2" disabled={isLoading}>
            {isLoading ? "Sending link..." : "Send Reset Link"}
          </Button>
        </form>
      ) : (
        <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800 text-sm">
          Check your email! A password reset link has been sent to your inbox.
        </div>
      )}

      <p className="mt-8 text-center text-sm text-foreground/80 dark:text-slate-400">
        Remembered it? <Link to="/login" className="font-semibold text-indigo-600 hover:underline">Sign in</Link>
      </p>
    </AuthLayout>
  );
}
