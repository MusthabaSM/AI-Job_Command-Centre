import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/onboarding')({
  component: OnboardingPage,
})

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Target, UploadCloud, Rocket, ArrowRight, ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from '@tanstack/react-router';
import { motion, AnimatePresence } from "framer-motion";

function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isFinishing, setIsFinishing] = useState(false);

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);
  
  const handleFinish = () => {
    setIsFinishing(true);
    setTimeout(() => {
      navigate({ to: "/" });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-muted/10 flex flex-col items-center justify-center p-4">
      
      <div className="w-full max-w-xl bg-background rounded-3xl shadow-xl overflow-hidden border border-border">
        
        {/* Progress Bar */}
        <div className="w-full bg-muted/30 h-2">
          <div 
            className="h-full bg-indigo-500 transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          ></div>
        </div>

        <div className="p-8 sm:p-12 relative min-h-[400px] flex flex-col justify-between">
          <AnimatePresence mode="wait">
            
            {step === 1 && (
              <motion.div key="1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="h-16 w-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                  <Target className="h-8 w-8" />
                </div>
                <h1 className="text-2xl font-bold mb-2">Welcome to AI Alchemist</h1>
                <p className="text-muted-foreground mb-6">Let&apos;s set up your Career OS. What role are you currently targeting?</p>
                <div className="space-y-4">
                  <Input placeholder="e.g. Senior Frontend Engineer" className="text-lg py-6" />
                  <Input placeholder="Desired Salary (e.g. $150,000)" className="text-lg py-6" />
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                  <UploadCloud className="h-8 w-8" />
                </div>
                <h1 className="text-2xl font-bold mb-2">Initialize your Knowledge Base</h1>
                <p className="text-muted-foreground mb-6">Upload your most recent resume to give our AI specialists context on your background.</p>
                <div className="border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center bg-muted/10 hover:bg-muted/20/50 cursor-pointer transition-colors">
                  <UploadCloud className="h-10 w-10 text-slate-400 mb-4" />
                  <p className="font-medium">Drag & Drop Resume PDF</p>
                  <p className="text-sm text-muted-foreground mt-1">or click to browse files</p>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="h-16 w-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                  <Rocket className="h-8 w-8" />
                </div>
                <h1 className="text-2xl font-bold mb-2">You&apos;re ready to launch</h1>
                <p className="text-muted-foreground mb-6">Your operating system is configured. Our agents are standing by to optimize your career path.</p>
                
                {isFinishing && (
                  <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-medium text-sm animate-pulse flex items-center justify-center">
                    Generating initial roadmap...
                  </div>
                )}
              </motion.div>
            )}

          </AnimatePresence>

          <div className="flex justify-between mt-12 pt-6 border-t border-border">
            {step > 1 ? (
              <Button variant="ghost" onClick={handleBack} disabled={isFinishing}>
                <ArrowLeft className="h-4 w-4 mr-2" /> Back
              </Button>
            ) : (
              <div></div> // Empty div for spacing
            )}
            
            {step < 3 ? (
              <Button onClick={handleNext} className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20">
                Continue <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleFinish} disabled={isFinishing} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                {isFinishing ? "Launching..." : "Enter Workspace"}
              </Button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
