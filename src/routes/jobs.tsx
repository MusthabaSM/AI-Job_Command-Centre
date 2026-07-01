import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/jobs')({
  component: JobIntelligenceStudio,
})


import React, { useState, useRef, useEffect } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { FeatureHeader } from "@/components/shared/FeatureHeader";
import { JobInput } from "@/features/jobs/components/JobInput";
import { AIMatchAnalysis } from "@/features/jobs/components/AIMatchAnalysis";
import { JobRecommendations } from "@/features/jobs/components/JobRecommendations";
import { JobPipeline } from "@/features/jobs/components/JobPipeline";
import { JobCharts } from "@/features/jobs/components/JobCharts";
import { VisualComparison } from "@/features/jobs/components/VisualComparison";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { RefreshCcw, FolderPlus, Sparkles, Mic, Briefcase, FileSearch } from "lucide-react";
import { toast } from "sonner";
import { useCreateJob, useCalculateJobMatch, useResumes, useRunAgent, useCreateApplication } from "@/lib/lemma/queries";
import { Skeleton } from "@/components/ui/skeleton";

function AdvancedJobProcessingOverlay() {
  const [phase, setPhase] = useState<'buffering' | 'progress' | 'skeleton'>('buffering');
  const [progress, setProgress] = useState(0);

  React.useEffect(() => {
    const timer1 = setTimeout(() => {
      setPhase('progress');
    }, 3000);

    const timer2 = setTimeout(() => {
      setPhase('skeleton');
    }, 10000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  React.useEffect(() => {
    if (phase === 'progress') {
      const interval = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            clearInterval(interval);
            return 100;
          }
          return p + (100 / (7000 / 50)); 
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [phase]);

  if (phase === 'buffering') {
    return (
      <div className="absolute inset-0 bg-white/80 bg-background/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-xl border border-dashed border-indigo-200 dark:border-indigo-900">
        <RefreshCcw className="h-8 w-8 text-indigo-500 animate-spin mb-4" />
        <p className="font-semibold text-indigo-600 dark:text-indigo-400">Running AI Job Matcher...</p>
        <p className="text-sm text-muted-foreground mt-2">Parsing JD → Extracting skills → Calculating semantic match</p>
      </div>
    );
  }

  if (phase === 'progress') {
    return (
      <div className="absolute inset-0 bg-background/95 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-xl border border-indigo-200 dark:border-indigo-900 p-8">
        <div className="w-full max-w-md space-y-4">
          <div className="flex justify-between items-end">
            <div>
              <p className="font-semibold text-indigo-600 dark:text-indigo-400">Processing Semantic Matches</p>
              <p className="text-sm text-muted-foreground">Running JD through Job Matcher...</p>
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
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
          </div>
        </div>
        <div className="space-y-3 mt-6">
          <Skeleton className="h-6 w-[150px]" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
      <div className="mt-auto pt-6 self-center flex items-center gap-2 text-indigo-500">
        <RefreshCcw className="h-4 w-4 animate-spin" />
        <span className="text-sm font-medium">Finalizing analysis...</span>
      </div>
    </div>
  );
}

function JobIntelligenceStudio() {
  const [activeTab, setActiveTab] = useState("skill-gap");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [matchData, setMatchData] = useState<any>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [atsOptimizationResult, setAtsOptimizationResult] = useState<string | null>(null);
  const analysisRef = useRef<HTMLDivElement>(null);
  const runAgent = useRunAgent();

  const createJob = useCreateJob();
  const calculateMatch = useCalculateJobMatch();
  const { data: resumes } = useResumes();
  const createApplication = useCreateApplication();

  const handleAddToApplications = async () => {
    if (!matchData?.job_id) {
      toast.error("Please analyze a job first.");
      return;
    }
    const resumeId = resumes?.[0]?.id;
    if (!resumeId) {
      toast.error("No resume found.");
      return;
    }
    try {
      await createApplication.mutateAsync({
        job_id: matchData.job_id,
        resume_id: resumeId,
        match_score: matchData.match_score || 0,
        missing_skills: matchData.missing_skills || []
      });
      toast.success("Added to Career Pipeline!");
    } catch (err: any) {
      toast.error("Failed to add application: " + err.message);
    }
  };

  const handleAnalyze = async (payload: { title: string, company: string, description: string }) => {
    try {
      setIsAnalyzing(true);
      const startTime = Date.now();

      const job: any = await createJob.mutateAsync(payload);
      
      const resumeId = resumes?.[0]?.id;
      if (!resumeId) {
        toast.error("Please upload a resume first to run the analysis.");
        setIsAnalyzing(false);
        return;
      }
      
      const result = await calculateMatch.mutateAsync({ 
        resume_id: resumeId, 
        job_id: job.id 
      });
      
      const elapsed = Date.now() - startTime;
      const minDuration = 12000; // Force 12 seconds to show buffering (3s), progress (7s) and skeleton (2s)
      const delay = Math.max(0, minDuration - elapsed);

      setTimeout(() => {
        setMatchData(result);
        setHasAnalyzed(true);
        setIsAnalyzing(false);
        toast.success("Job analysis complete. AI has mapped your skill gaps.");
        
        // Auto scroll to results
        setTimeout(() => {
          analysisRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }, delay);

    } catch (e: any) {
      toast.error("Failed to analyze job: " + (e.message || "Unknown error"));
      setIsAnalyzing(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-12 max-w-[1600px] mx-auto"
    >
      <PageHeader 
        title="Job Intelligence Studio" 
        description="Compare your resume against real job descriptions using AI."
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleAddToApplications} disabled={createApplication.isPending || !hasAnalyzed}>
              <FolderPlus className="h-4 w-4 mr-2" /> Add to Applications
            </Button>
          </div>
        }
      />

      <FeatureHeader 
        title="AI Job Matcher"
        description="Paste a job description. AI compares it semantically against your resume to calculate match score, identify skill gaps, and recommend improvements."
        agent="job_matcher"
        resources={["jobs table", "calculate_job_match function"]}
        estimatedTime="~3s per analysis"
      />

      {/* AI Pipeline Visualization */}
      {hasAnalyzed && (
        <div>
          <h3 className="text-sm font-semibold mb-3 text-foreground">Analysis Workflow</h3>
          <JobPipeline />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-260px)] min-h-[600px]">
        {/* Left Panel - 35% */}
        <div className="lg:col-span-4 h-full overflow-y-auto pr-2 custom-scrollbar">
          <JobInput onAnalyze={handleAnalyze} isLoading={isAnalyzing} />
        </div>

        {/* Center Panel - 40% */}
        <div className="lg:col-span-5 flex flex-col h-full overflow-y-auto pr-2 custom-scrollbar" ref={analysisRef}>
          <div className="flex items-center gap-4 border-b pb-2 mb-4 sticky top-0 bg-background z-10 pt-1">
            <button 
              className={`text-sm font-medium pb-2 border-b-2 ${activeTab === 'skill-gap' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-muted-foreground hover:text-foreground dark:hover:text-white'}`}
              onClick={() => setActiveTab('skill-gap')}
            >
              Skill Gap Analysis
            </button>
            <button 
              className={`text-sm font-medium pb-2 border-b-2 ${activeTab === 'improvements' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-muted-foreground hover:text-foreground dark:hover:text-white'}`}
              onClick={() => setActiveTab('improvements')}
            >
              Resume Improvements
            </button>
          </div>
          
          <div className="flex-1 relative">
            {isAnalyzing && (
              <AdvancedJobProcessingOverlay />
            )}

            {!hasAnalyzed && !isAnalyzing && (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px] border rounded-xl border-dashed p-12 text-center text-muted-foreground">
                <Briefcase className="h-10 w-10 mb-4 text-indigo-400" />
                <p className="font-semibold text-foreground text-sm">Job Intelligence Studio</p>
                <p className="text-sm mt-2 max-w-xs mx-auto">Paste a job description in the left panel. AI will compare it against your resume and identify skill gaps, match scores, and improvement areas.</p>
              </div>
            )}
            
            {hasAnalyzed && activeTab === 'skill-gap' && (
              <div className="animate-in fade-in duration-300 space-y-6">
                <AIMatchAnalysis matchData={matchData} />
                <VisualComparison matchData={matchData} />
                <JobCharts matchData={matchData} />
              </div>
            )}
            
            {hasAnalyzed && activeTab === 'improvements' && (
              <div className="h-full min-h-[400px] border rounded-xl p-6 relative">
                {isOptimizing ? (
                  <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                    <RefreshCcw className="h-8 w-8 text-amber-500 animate-spin mb-4" />
                    <p className="font-semibold text-foreground">ATS Optimizer running...</p>
                    <p className="text-sm mt-2">Generating optimized bullet points based on missing skills.</p>
                  </div>
                ) : atsOptimizationResult ? (
                  <div className="h-full overflow-y-auto pr-2 space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-amber-600 dark:text-amber-500">
                        <Sparkles className="h-5 w-5" />
                        <h3 className="font-semibold">Optimized Recommendations</h3>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => setAtsOptimizationResult(null)}>Reset</Button>
                    </div>
                    <div className="prose prose-sm dark:prose-invert max-w-none bg-muted/30 p-4 rounded-lg whitespace-pre-wrap text-sm leading-relaxed border border-amber-100 dark:border-amber-900/50">
                      {atsOptimizationResult}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground border-dashed border-2 border-muted rounded-lg m-4">
                    <Sparkles className="h-8 w-8 mb-4 text-amber-500" />
                    <p>Optimize your resume with suggested phrases and bullet points.</p>
                    <Button 
                      className="mt-4" 
                      variant="outline"
                      onClick={async () => {
                        setIsOptimizing(true);
                        try {
                          const response: any = await runAgent.mutateAsync({
                            agentId: 'ats_optimizer',
                            input: `Analyze my resume against the job description for ${matchData?.job_title || 'this role'}. Focus on missing skills like: ${(matchData?.missing_skills || []).join(', ')}. Provide 3 concrete resume bullet points.`
                          });
                          setAtsOptimizationResult(response.output);
                        } catch (e: any) {
                          toast.error("Failed to run ATS Optimizer: " + e.message);
                        } finally {
                          setIsOptimizing(false);
                        }
                      }}
                    >
                      Run ATS Optimizer
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - 25% */}
        <div className="lg:col-span-3 h-full overflow-y-auto pr-2 custom-scrollbar">
          {hasAnalyzed ? (
            <JobRecommendations matchData={matchData} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full border rounded-xl bg-muted/10 p-12 text-center text-muted-foreground">
              <FileSearch className="h-10 w-10 mb-4 text-indigo-400" />
              <p className="text-sm font-semibold text-foreground">AI Recommendations</p>
              <p className="text-sm mt-2">Analyze a job above to see personalized suggestions for improving your match score.</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
