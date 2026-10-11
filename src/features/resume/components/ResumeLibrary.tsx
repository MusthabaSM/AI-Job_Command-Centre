import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { SectionCard } from "@/components/shared/Cards";
import { UploadCloud, FileText, Clock, Star, Trash2, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useDeleteResume } from "@/lib/firebase/queries";

export function ResumeLibrary({ 
  onUpload, 
  resumes = [], 
  activeResumeId, 
  onSelect, 
  isLoading 
}: { 
  onUpload?: (file: File) => void;
  resumes?: any[];
  activeResumeId?: string;
  onSelect?: (id: string) => void;
  isLoading?: boolean;
}) {
  const deleteResume = useDeleteResume();

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this resume? This action cannot be undone.")) {
      deleteResume.mutateAsync(id).then(() => {
        toast.success("Resume deleted.");
      }).catch(() => {
        toast.error("Failed to delete resume.");
      });
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      if (onUpload) onUpload(acceptedFiles[0]);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1
  });

  return (
    <SectionCard 
      title="Resume Library" 
      description="Manage and upload your resumes."
      className="w-full shadow-2xs"
    >
      <div className="flex flex-col lg:flex-row items-stretch gap-5 mt-2">
        {/* Left Bento Module: Drag & Drop Upload Zone */}
        <div 
          {...getRootProps()} 
          className={cn(
            "w-full lg:w-[320px] xl:w-[360px] shrink-0 border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center min-h-[170px]",
            isDragActive 
              ? "border-indigo-500 bg-indigo-500/10 scale-[0.99]" 
              : "border-border/80 hover:border-indigo-500/50 hover:bg-muted/30 bg-muted/5 shadow-2xs"
          )}
        >
          <input {...getInputProps()} />
          <div className="h-11 w-11 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3 ring-4 ring-background shadow-xs">
            <UploadCloud className="h-5 w-5" />
          </div>
          <p className="text-xs sm:text-sm font-bold text-foreground">Drag & drop your PDF here</p>
          <p className="text-[11px] text-muted-foreground mt-1">or click to browse files</p>
          <span className="text-[10px] font-medium text-muted-foreground/75 mt-3 bg-muted/40 px-2 py-0.5 rounded-full border border-border/40">
            PDF format • Instant AI Parsing
          </span>
        </div>

        {/* Right Bento Module: Uploaded Resumes Grid */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-indigo-500" /> Active & Saved Resumes
            </p>
            <span className="text-[11px] font-medium text-muted-foreground">
              {resumes.length} {resumes.length === 1 ? 'file' : 'files'}
            </span>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-10 bg-muted/5 rounded-xl border border-dashed border-border min-h-[140px]">
              <span className="text-xs text-muted-foreground animate-pulse font-medium">Loading resumes...</span>
            </div>
          ) : resumes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 bg-muted/5 rounded-xl border border-dashed border-border text-center min-h-[140px]">
              <FileText className="h-8 w-8 text-muted-foreground/30 mb-2" />
              <h4 className="text-xs font-semibold text-foreground">No resumes found</h4>
              <p className="text-[11px] text-muted-foreground mt-0.5 max-w-[220px]">
                Drop a PDF resume on the left to start analyzing skills and ATS compatibility.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3 max-h-[280px] overflow-y-auto pr-1">
              {resumes.map((resume) => {
                const isActive = resume.id === activeResumeId;
                const isProcessing = resume.agent_status === 'pending' || resume.agent_status === 'processing';
                const isError = resume.agent_status === 'error';
                const score = resume.overall_score || resume.score ? Math.round(resume.overall_score || resume.score) : 85;

                return (
                  <div 
                    key={resume.id}
                    onClick={() => onSelect?.(resume.id)}
                    className={cn(
                      "group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border rounded-xl cursor-pointer transition-all duration-200 min-w-0",
                      isActive 
                        ? "bg-indigo-500/5 border-indigo-500/40 ring-1 ring-indigo-500/20 shadow-xs" 
                        : "bg-card hover:bg-muted/30 border-border/70 hover:border-border shadow-2xs"
                    )}
                  >
                    {/* Left: Icon, Title & Date */}
                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                      <div className={cn(
                        "h-10 w-10 shrink-0 rounded-xl flex items-center justify-center ring-2 ring-background shadow-xs",
                        isActive ? "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400" : "bg-muted text-muted-foreground"
                      )}>
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-foreground truncate" title={resume.title || "Untitled Resume"}>
                            {resume.title || "Untitled Resume"}
                          </p>
                          {resume.is_primary && <Star className="h-3.5 w-3.5 shrink-0 fill-amber-400 text-amber-400" />}
                        </div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1 font-medium">
                          <Clock className="h-3.5 w-3.5 opacity-70 shrink-0" />
                          <span>Uploaded {resume.created_at ? new Date(resume.created_at).toLocaleDateString() : "Active"}</span>
                        </p>
                      </div>
                    </div>

                    {/* Middle: Active Status Badge */}
                    <div className="shrink-0 flex items-center">
                      {isProcessing ? (
                        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 animate-pulse bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                          AI Analyzing...
                        </span>
                      ) : isError ? (
                        <span className="text-xs font-bold uppercase tracking-wider text-destructive bg-destructive/10 px-3 py-1 rounded-full border border-destructive/20">
                          Error
                        </span>
                      ) : isActive ? (
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 inline-flex items-center gap-1.5 shadow-2xs">
                          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                          Active Resume
                        </span>
                      ) : (
                        <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground px-2.5 py-1 rounded-md bg-muted/40 border border-border/50 transition-colors">
                          Click to Select
                        </span>
                      )}
                    </div>

                    {/* Right: Score & Actions */}
                    <div className="shrink-0 flex items-center gap-4 sm:pl-4 sm:border-l sm:border-border/60">
                      <div className="text-right min-w-[60px]">
                        <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground block">
                          Score
                        </span>
                        <span className={cn(
                          "font-black text-base sm:text-lg tracking-tight",
                          score >= 80 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"
                        )}>
                          {score}%
                        </span>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => handleDelete(e, resume.id)}
                        className="h-8 w-8 text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 transition-colors"
                        disabled={deleteResume.isPending}
                        title="Delete resume"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </SectionCard>
  );
}
