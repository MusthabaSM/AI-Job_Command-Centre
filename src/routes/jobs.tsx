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
import { JobCharts, SkillRadarCard, MissingSkillsGapCard } from "@/features/jobs/components/JobCharts";
import { VisualComparison } from "@/features/jobs/components/VisualComparison";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { RefreshCcw, FolderPlus, Sparkles, Mic, Briefcase, FileSearch, Clock, Plus } from "lucide-react";
import { toast } from "sonner";
import { useCreateJob, useCalculateJobMatch, useResumes, useRunAgent, useCreateApplication, useJobs } from "@/lib/firebase/queries";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

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
  const { data: savedJobs = [] } = useJobs();
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  // Auto-restore previously analyzed job from Firestore so records never reset
  useEffect(() => {
    if (!hasAnalyzed && !matchData && savedJobs.length > 0) {
      const previouslyAnalyzed = savedJobs.find((j: any) => j.match_score) || savedJobs[0];
      if (previouslyAnalyzed && previouslyAnalyzed.match_score) {
        setSelectedJobId(previouslyAnalyzed.id);
        setMatchData({
          job_id: previouslyAnalyzed.id,
          company: previouslyAnalyzed.company,
          role: previouslyAnalyzed.role || previouslyAnalyzed.title,
          match_score: previouslyAnalyzed.match_score,
          skill_coverage: previouslyAnalyzed.skill_coverage || 80,
          keyword_coverage: previouslyAnalyzed.keyword_coverage || 75,
          categories: previouslyAnalyzed.categories || { "Backend & Cloud": 85, "Full-Stack": 90, "Distributed Systems": 65, "CS Fundamentals": 70 },
          missing_skills: previouslyAnalyzed.missing_skills || ["Apache Kafka", "DSA (LeetCode)"]
        });
        setHasAnalyzed(true);
      }
    }
  }, [savedJobs, hasAnalyzed, matchData]);

  const handleSelectJob = (job: any) => {
    setSelectedJobId(job.id);
    setMatchData({
      job_id: job.id,
      company: job.company,
      role: job.role || job.title,
      match_score: job.match_score || 78,
      skill_coverage: job.skill_coverage || 80,
      keyword_coverage: job.keyword_coverage || 75,
      categories: job.categories || { "Backend & Cloud": 85, "Full-Stack": 90, "Distributed Systems": 65, "CS Fundamentals": 70 },
      missing_skills: job.missing_skills || ["Apache Kafka", "DSA (LeetCode)"]
    });
    setHasAnalyzed(true);
    setAtsOptimizationResult(null);
  };

  const handleStartNewAnalysis = () => {
    setSelectedJobId(null);
    setMatchData(null);
    setHasAnalyzed(false);
    setAtsOptimizationResult(null);
  };

  const currentSelectedJob = selectedJobId ? savedJobs.find((j: any) => j.id === selectedJobId) : null;

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
      const minDuration = 2000; // Brief animation duration for sleek experience
      const delay = Math.max(0, minDuration - elapsed);

      setTimeout(() => {
        setSelectedJobId(job.id);
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

      {/* Saved Analyses History Bar */}
      {savedJobs.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-card border border-border rounded-xl shadow-xs">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-indigo-500" /> Saved Analyses:
            </span>
            {savedJobs.map((j: any) => {
              const isSelected = selectedJobId === j.id;
              return (
                <button
                  key={j.id}
                  onClick={() => handleSelectJob(j)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-2 shrink-0 cursor-pointer",
                    isSelected
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                      : "bg-muted/40 text-foreground border-border hover:bg-muted"
                  )}
                >
                  <span className="font-semibold">{j.company}</span>
                  <span className="opacity-80">({j.role || j.title})</span>
                  {j.match_score && (
                    <span className={cn(
                      "px-1.5 py-0.5 rounded text-[10px] font-bold",
                      isSelected ? "bg-white/20 text-white" : "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                    )}>
                      {j.match_score}%
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleStartNewAnalysis}
            className="text-xs shrink-0 cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5 mr-1.5" /> + New Analysis
          </Button>
        </div>
      )}

      {/* AI Pipeline Visualization */}
      {hasAnalyzed && (
        <div>
          <h3 className="text-sm font-semibold mb-3 text-foreground">Analysis Workflow</h3>
          <JobPipeline />
        </div>
      )}

      {/* Bento Grid Layout */}
      <div className="space-y-6 pb-16">
        {/* Bento Item 1: Horizontal Full-Width Job Requisition Input */}
        <div className="w-full">
          <JobInput onAnalyze={handleAnalyze} isLoading={isAnalyzing} selectedJob={currentSelectedJob} />
        </div>

        {/* Bento Item 2: Analysis Section Directly Below Job Input */}
        <div className="space-y-5 min-w-0" ref={analysisRef}>
          <div className="flex items-center justify-between border-b pb-2 mb-2 sticky top-0 bg-background/95 backdrop-blur-sm z-10 pt-1">
            <div className="flex items-center gap-6">
              <button 
                className={`text-sm font-semibold pb-2 border-b-2 transition-all cursor-pointer ${activeTab === 'skill-gap' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                onClick={() => setActiveTab('skill-gap')}
              >
                Skill Gap & Match Analysis
              </button>
              <button 
                className={`text-sm font-semibold pb-2 border-b-2 transition-all cursor-pointer ${activeTab === 'improvements' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                onClick={() => setActiveTab('improvements')}
              >
                Resume Improvements & ATS
              </button>
            </div>
            {hasAnalyzed && (
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 hidden sm:inline-flex items-center gap-1">
                ✓ Requisition Evaluated
              </span>
            )}
          </div>
          
          <div className="flex-1 relative">
            {isAnalyzing && (
              <AdvancedJobProcessingOverlay />
            )}

            {!hasAnalyzed && !isAnalyzing && (
              <div className="flex flex-col items-center justify-center min-h-[380px] border rounded-xl border-dashed bg-muted/5 p-12 text-center text-muted-foreground">
                <Briefcase className="h-10 w-10 mb-4 text-slate-400 opacity-50" />
                <h3 className="text-lg font-medium text-foreground mb-1">Waiting for Job Analysis</h3>
                <p className="text-sm max-w-sm">Paste a job description in the form above or import from a URL. AI will compare it against your resume to identify skill gaps, match scores, and interview focus areas.</p>
              </div>
            )}
            
            {hasAnalyzed && activeTab === 'skill-gap' && (
              <div className="animate-in fade-in duration-300 space-y-6">
                {/* Action Banner: Track in Career Pipeline */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-transparent border border-indigo-500/20 shadow-sm">
                  <div>
                    <h4 className="font-semibold text-sm text-foreground flex items-center gap-2">
                      <FolderPlus className="h-4 w-4 text-indigo-500" /> Track in Career Pipeline
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Save this analyzed role directly to your applications Kanban board.
                    </p>
                  </div>
                  <Button 
                    onClick={handleAddToApplications} 
                    disabled={createApplication.isPending}
                    size="sm"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shrink-0 cursor-pointer"
                  >
                    <FolderPlus className="h-4 w-4 mr-2" />
                    {createApplication.isPending ? "Adding..." : "Add to Pipeline"}
                  </Button>
                </div>

                {/* Row 1: AI Match Analysis (Left) + AI Recommendations (Right) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                  <div className="lg:col-span-7 xl:col-span-7">
                    <AIMatchAnalysis matchData={matchData} />
                  </div>
                  <div className="lg:col-span-5 xl:col-span-5">
                    <JobRecommendations matchData={matchData} />
                  </div>
                </div>

                {/* Row 2: Skill Category Comparison, Skill Coverage (Radar), and Missing Skills Gap in the SAME row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">
                  <VisualComparison matchData={matchData} />
                  <SkillRadarCard matchData={matchData} />
                  <MissingSkillsGapCard matchData={matchData} />
                </div>
              </div>
            )}
            
            {hasAnalyzed && activeTab === 'improvements' && (
              <div className="h-full min-h-[450px] border rounded-xl p-6 relative bg-card shadow-xs">
                {isOptimizing ? (
                  <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground py-16">
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
                    <div className="prose prose-sm dark:prose-invert max-w-none bg-muted/30 p-5 rounded-xl whitespace-pre-wrap text-sm leading-relaxed border border-amber-100 dark:border-amber-900/50">
                      {atsOptimizationResult}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground border-dashed border-2 border-muted rounded-xl p-12">
                    <Sparkles className="h-8 w-8 mb-4 text-amber-500" />
                    <h4 className="font-semibold text-foreground mb-1">Tailor Resume with Targeted ATS Keywords</h4>
                    <p className="text-sm max-w-md">Generate custom achievement bullets tailored to this JD to bridge your missing skills ({matchData?.missing_skills?.join(", ") || "Kafka, System Design"}).</p>
                    <Button 
                      className="mt-5 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm" 
                      onClick={async () => {
                        setIsOptimizing(true);
                        try {
                          const response: any = await runAgent.mutateAsync({
                            agentId: 'ats_optimizer',
                            input: "Optimize my resume for this role and generate concrete bullet points focused on my missing skills.",
                            contextData: matchData
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
      </div>
    </motion.div>
  );
}
