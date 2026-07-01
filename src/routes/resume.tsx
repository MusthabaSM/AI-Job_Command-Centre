import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/resume')({
  component: AIResumeStudio,
})


import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { FeatureHeader } from "@/components/shared/FeatureHeader";
import { ResumeLibrary } from "@/features/resume/components/ResumeLibrary";
import { ResumeAnalysis } from "@/features/resume/components/ResumeAnalysis";
import { AIInsights } from "@/features/resume/components/AIInsights";
import { ResumePipeline } from "@/features/resume/components/ResumePipeline";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { RefreshCcw, Download, Sparkles, FileSearch } from "lucide-react";
import { toast } from "sonner";
import { useResumes, useAnalyzeResume } from "@/lib/lemma/queries";

function AdvancedProcessingOverlay() {
  const [phase, setPhase] = useState<'buffering' | 'progress' | 'skeleton'>('buffering');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Phase 1 -> 2: Switch to progress after 4 seconds
    const timer1 = setTimeout(() => {
      setPhase('progress');
    }, 4000);

    // Phase 2 -> 3: Switch to skeleton after 15 seconds total (11s of progress)
    const timer2 = setTimeout(() => {
      setPhase('skeleton');
    }, 15000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  useEffect(() => {
    if (phase === 'progress') {
      const interval = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            clearInterval(interval);
            return 100;
          }
          return p + (100 / (11000 / 50)); // 11000ms duration, 50ms interval = 220 steps
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [phase]);

  if (phase === 'buffering') {
    return (
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-xl border border-dashed border-indigo-200 dark:border-indigo-900">
        <RefreshCcw className="h-8 w-8 text-indigo-500 animate-spin mb-4" />
        <p className="font-semibold text-indigo-600 dark:text-indigo-400">Analyzing Resume...</p>
        <p className="text-sm text-muted-foreground mt-2">Extracting skills → Scoring sections → Generating insights</p>
      </div>
    );
  }

  if (phase === 'progress') {
    return (
      <div className="absolute inset-0 bg-background/95 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-xl border border-indigo-200 dark:border-indigo-900 p-8">
        <div className="w-full max-w-md space-y-4">
          <div className="flex justify-between items-end">
            <div>
              <p className="font-semibold text-indigo-600 dark:text-indigo-400">Processing Data Models</p>
              <p className="text-sm text-muted-foreground">Running through ATS simulator...</p>
            </div>
            <p className="font-bold text-lg text-indigo-600 dark:text-indigo-400">{Math.floor(progress)}%</p>
          </div>
          <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
            <div className="bg-indigo-500 h-3 rounded-full transition-all duration-75" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-background/95 backdrop-blur-sm z-10 flex flex-col p-6 rounded-xl border border-indigo-200 dark:border-indigo-900 overflow-hidden">
      <div className="w-full space-y-6 animate-in fade-in duration-500">
        <div className="flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
        <div className="space-y-3">
          <Skeleton className="h-8 w-64" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl hidden md:block" />
          </div>
        </div>
        <div className="space-y-3 mt-6">
          <Skeleton className="h-6 w-[150px]" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[80%]" />
        </div>
      </div>
      <div className="mt-auto pt-6 self-center flex items-center gap-2 text-indigo-500">
        <RefreshCcw className="h-4 w-4 animate-spin" />
        <span className="text-sm font-medium">Finalizing analysis...</span>
      </div>
    </div>
  );
}

function AIResumeStudio() {
  const [activeTab, setActiveTab] = useState("analysis");
  const [activeResumeId, setActiveResumeId] = useState<string | null>(null);

  const { data: resumes, isLoading: isLoadingResumes } = useResumes({
    refetchInterval: (query: any) => {
      // Poll every 2 seconds if any resume is pending or processing
      const hasProcessing = query?.state?.data?.some((r: any) => r.agent_status === 'pending' || r.agent_status === 'processing');
      return hasProcessing ? 2000 : false;
    }
  });

  const { mutate: uploadResume, isPending: isUploading } = useAnalyzeResume();

  const handleUpload = (file: File) => {
    uploadResume(file, {
      onSuccess: () => {
        toast.success("Resume uploaded. Processing will begin shortly.");
      },
      onError: (err: any) => {
        toast.error("Upload failed: " + err.message);
      }
    });
  };

  const activeResume = activeResumeId 
    ? resumes?.find((r: any) => r.id === activeResumeId) 
    : resumes?.[0];

  const isProcessing = isUploading || activeResume?.agent_status === 'pending' || activeResume?.agent_status === 'processing';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-12 max-w-[1600px] mx-auto"
    >
      <PageHeader 
        title="AI Resume Studio" 
        description="Upload, analyze, and optimize your resumes with AI."
        action={
          <div className="flex gap-2">
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow-md transition-all" onClick={() => setActiveTab('ats')} disabled={!activeResume}>
              <Sparkles className="h-4 w-4 mr-2" /> Optimize Resume
            </Button>
          </div>
        }
      />

      <FeatureHeader 
        title="AI Resume Analyzer"
        description="Upload a PDF resume. AI extracts skills, experience, and education, then scores your resume against industry benchmarks."
        agent="resume_analyzer"
        resources={["resumes table", "validate_resume function"]}
        estimatedTime="~5s per resume"
      />

      {/* AI Pipeline Visualization */}
      <div>
        <h3 className="text-sm font-semibold mb-3 text-foreground">AI Execution Pipeline</h3>
        <ResumePipeline />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 h-[calc(100vh-320px)] min-h-[600px]">
        {/* Left Panel - 30% */}
        <div className="lg:col-span-3 h-full overflow-y-auto pr-2 custom-scrollbar">
          <ResumeLibrary 
            onUpload={handleUpload} 
            resumes={resumes || []}
            activeResumeId={activeResume?.id}
            onSelect={setActiveResumeId}
            isLoading={isLoadingResumes}
          />
        </div>

        {/* Center Panel - 40% */}
        <div className="lg:col-span-4 flex flex-col h-full overflow-y-auto pr-2 custom-scrollbar">
          <div className="flex items-center gap-4 border-b pb-2 mb-4 sticky top-0 bg-background z-10 pt-1">
            <button 
              className={`text-sm font-medium pb-2 border-b-2 ${activeTab === 'analysis' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-muted-foreground hover:text-foreground dark:hover:text-white'}`}
              onClick={() => setActiveTab('analysis')}
            >
              Analysis
            </button>
            <button 
              className={`text-sm font-medium pb-2 border-b-2 ${activeTab === 'ats' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-muted-foreground hover:text-foreground dark:hover:text-white'}`}
              onClick={() => setActiveTab('ats')}
            >
              ATS Suggestions
            </button>
            <button 
              className={`text-sm font-medium pb-2 border-b-2 ${activeTab === 'history' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-muted-foreground hover:text-foreground dark:hover:text-white'}`}
              onClick={() => setActiveTab('history')}
            >
              History
            </button>
          </div>
          
          <div className="flex-1 relative min-h-[400px]">
            {isProcessing && <AdvancedProcessingOverlay />}
            
            {activeTab === 'analysis' && <ResumeAnalysis resume={activeResume} />}
            {activeTab === 'ats' && (
              <div className="flex flex-col items-center justify-center h-full border rounded-xl border-dashed p-12 text-center text-muted-foreground bg-muted/5">
                <FileSearch className="h-10 w-10 mb-4 text-slate-400 opacity-50" />
                <h3 className="text-lg font-medium text-foreground mb-1">ATS Optimization</h3>
                <p className="text-sm max-w-sm">{!activeResume ? 'Select a resume from your library to generate ATS suggestions.' : 'No ATS recommendations generated yet. Click "Optimize Resume" to begin.'}</p>
              </div>
            )}
            {activeTab === 'history' && (
               <div className="flex flex-col items-center justify-center h-full border rounded-xl border-dashed p-12 text-center text-muted-foreground bg-muted/5">
                 <RefreshCcw className="h-10 w-10 mb-4 text-slate-400 opacity-50" />
                 <h3 className="text-lg font-medium text-foreground mb-1">Optimization History</h3>
                 <p className="text-sm max-w-sm">{!activeResume ? 'Select a resume to view its optimization history.' : 'No optimization history found for this version.'}</p>
               </div>
            )}
          </div>
        </div>

        {/* Right Panel - 30% */}
        <div className="lg:col-span-3 h-full overflow-y-auto pr-2 custom-scrollbar">
          <AIInsights resume={activeResume} />
        </div>
      </div>
    </motion.div>
  );
}
