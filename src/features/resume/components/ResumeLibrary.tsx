import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { SectionCard } from "@/components/shared/Cards";
import { UploadCloud, File, Clock, Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useDeleteResume } from "@/lib/lemma/queries";

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
    <SectionCard title="Resume Library" description="Manage and upload your resumes.">
      <div 
        {...getRootProps()} 
        className={cn(
          "border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-300 mt-4",
          isDragActive ? "border-indigo-500 bg-indigo-500/10" : "border-border hover:bg-muted/20 bg-muted/5"
        )}
      >
        <input {...getInputProps()} />
        <div className="mx-auto h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center mb-4 ring-4 ring-background">
          <UploadCloud className="h-5 w-5 text-muted-foreground" />
        </div>
        <p className="text-sm font-semibold text-foreground">Drag & drop your PDF here</p>
        <p className="text-xs text-muted-foreground mt-1">or click to browse files</p>
      </div>

      <div className="mt-8 space-y-3">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-10 bg-muted/5 rounded-xl border border-dashed border-border">
            <span className="text-sm text-muted-foreground animate-pulse">Loading resumes...</span>
          </div>
        ) : resumes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 bg-muted/5 rounded-xl border border-dashed border-border text-center">
            <File className="h-10 w-10 text-muted-foreground/30 mb-3" />
            <h4 className="text-sm font-semibold text-foreground">No resumes found</h4>
            <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">Upload a PDF resume to start analyzing your skills.</p>
          </div>
        ) : (
          resumes.map((resume) => {
            const isActive = resume.id === activeResumeId;
            const isProcessing = resume.agent_status === 'pending' || resume.agent_status === 'processing';
            const isError = resume.agent_status === 'error';
            
            return (
              <div 
                key={resume.id}
                onClick={() => onSelect?.(resume.id)}
                className={cn(
                  "group flex flex-wrap items-center justify-between gap-4 p-4 border rounded-xl cursor-pointer transition-all duration-300",
                  isActive ? "bg-indigo-500/5 border-indigo-500/20 shadow-sm" : "hover:bg-muted/30 border-border hover:shadow-sm",
                  !isActive && "opacity-90"
                )}
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className={cn(
                    "h-10 w-10 shrink-0 rounded-lg flex items-center justify-center ring-2 ring-background shadow-sm",
                    isActive ? "bg-indigo-500/10" : "bg-muted"
                  )}>
                    <File className={cn(
                      "h-4 w-4",
                      isActive ? "text-indigo-600 dark:text-indigo-400" : "text-muted-foreground"
                    )} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-foreground truncate">{resume.title || "Untitled Resume"}</p>
                      {resume.is_primary && <Star className="h-3 w-3 shrink-0 fill-amber-400 text-amber-400" />}
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center mt-1 font-medium min-w-0 truncate">
                      <Clock className="h-3 w-3 mr-1 opacity-70 shrink-0" /> 
                      <span className="truncate">{resume.created_at ? new Date(resume.created_at).toLocaleDateString() : "Just now"}</span>
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  {isProcessing ? (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 animate-pulse bg-indigo-500/10 px-2 py-1 rounded-md">Processing</span>
                  ) : isError ? (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-destructive bg-destructive/10 px-2 py-1 rounded-md">Error</span>
                  ) : (
                    <div className="flex flex-col items-end gap-1">
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-1">Score</p>
                          <p className={cn(
                            "font-bold text-sm",
                            (resume.overall_score || 0) > 80 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"
                          )}>{resume.overall_score ? Math.round(resume.overall_score) : 0}%</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => handleDelete(e, resume.id)}
                          className="h-8 w-8 text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10 transition-colors"
                          disabled={deleteResume.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </SectionCard>
  );
}
