import React, { useState } from "react";
import { SectionCard } from "@/components/shared/Cards";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Link, Building2, MapPin, Briefcase, DollarSign, Globe, Sparkles, RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useFetchJobUrl } from "@/lib/firebase/queries";

export function JobInput({ 
  onAnalyze, 
  isLoading,
  selectedJob
}: { 
  onAnalyze: (p: { title: string, company: string, description: string }) => void, 
  isLoading?: boolean,
  selectedJob?: { title?: string, role?: string, company?: string, description?: string } | null
}) {
  const [activeTab, setActiveTab] = useState("paste");
  const [description, setDescription] = useState("Senior Frontend Engineer (React/Next.js)\nRequires 5+ years experience, Docker, CI/CD...");
  const [company, setCompany] = useState("TechCorp Inc.");
  const [title, setTitle] = useState("Senior Frontend Engineer");
  const [url, setUrl] = useState("");
  const fetchUrlMutation = useFetchJobUrl();

  React.useEffect(() => {
    if (selectedJob) {
      if (selectedJob.title || selectedJob.role) setTitle(selectedJob.title || selectedJob.role || "");
      if (selectedJob.company) setCompany(selectedJob.company || "");
      if (selectedJob.description) setDescription(selectedJob.description || "");
    }
  }, [selectedJob]);

  const handleFetchUrl = async () => {
    if (!url) return;
    try {
      const res = await fetchUrlMutation.mutateAsync(url) as any;
      if (!res) {
        toast.error("Could not extract details from this URL. Please paste the job description.");
        return;
      }
      if (res.error) {
        toast.error(res.error);
        return;
      }
      if (res.title) setTitle(res.title);
      if (res.company) setCompany(res.company);
      if (res.description) setDescription(res.description);
      toast.success("Job details extracted successfully!");
      setActiveTab("paste");
    } catch (err: any) {
      toast.error(err?.message || "Failed to fetch URL");
    }
  };

  return (
    <SectionCard 
      title="Job Description & Role Requisition" 
      description="Add a target job description or import from a job listing URL to evaluate semantic match."
      className="w-full shadow-2xs"
    >
      <div className="space-y-4 mt-2">
        {/* Requisition Summary Banner at the TOP within the box */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-500/10 via-indigo-500/5 to-muted/20 border border-indigo-500/20 shadow-xs">
          <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-indigo-500/15">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" /> Requisition Summary
              </span>
            </div>
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 inline-flex items-center gap-1.5 shadow-2xs">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Ready
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0 border border-indigo-500/20">
                <Briefcase className="h-4 w-4 text-indigo-500" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-muted-foreground uppercase font-bold block">Role</span>
                <span className="font-bold text-foreground truncate block text-xs" title={title || 'Not specified'}>
                  {title || 'Not specified'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0 border border-indigo-500/20">
                <Building2 className="h-4 w-4 text-indigo-500" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-muted-foreground uppercase font-bold block">Organization</span>
                <span className="font-bold text-foreground truncate block text-xs" title={company || 'Not specified'}>
                  {company || 'Not specified'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0 border border-indigo-500/20">
                <MapPin className="h-4 w-4 text-indigo-500" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-muted-foreground uppercase font-bold block">Location</span>
                <span className="font-medium text-foreground truncate block text-xs">Remote / Flexible</span>
              </div>
            </div>
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0 border border-indigo-500/20">
                <Globe className="h-4 w-4 text-indigo-500" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-muted-foreground uppercase font-bold block">Match Engine</span>
                <span className="font-medium text-indigo-600 dark:text-indigo-400 truncate block text-xs">Gemini Semantic AI</span>
              </div>
            </div>
          </div>
        </div>

        {/* Input Controls Header */}
        <div className="flex items-center justify-between border-b border-border/50 pb-2">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setActiveTab("paste")}
              className={cn(
                "text-xs uppercase tracking-wider font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer", 
                activeTab === "paste" ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )}
            >
              Paste Text
            </button>
            <button 
              onClick={() => setActiveTab("url")}
              className={cn(
                "text-xs uppercase tracking-wider font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer", 
                activeTab === "url" ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )}
            >
              <Link className="h-3 w-3 inline mr-1" /> Import from URL
            </button>
          </div>
          <span className="text-[11px] text-muted-foreground font-medium hidden sm:inline">
            Step 1: Input Job Details
          </span>
        </div>

        {/* URL Input Form (if tab active) */}
        {activeTab === "url" && (
          <div className="flex gap-2.5 p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/15">
            <Input 
              placeholder="https://linkedin.com/jobs/view/... or Indeed / Lever Requisition URL" 
              className="bg-background border-border shadow-xs focus-visible:ring-indigo-500/50 text-xs sm:text-sm" 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <Button 
              variant="secondary" 
              className="shrink-0 font-semibold cursor-pointer" 
              onClick={handleFetchUrl}
              disabled={fetchUrlMutation.isPending || !url}
            >
              {fetchUrlMutation.isPending ? "Extracting..." : "Fetch Requisition"}
            </Button>
          </div>
        )}

        {/* Title and Company spanning full width */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Job Title</label>
            <Input 
              placeholder="e.g. Senior Backend Engineer" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-muted/20 border-border shadow-xs focus-visible:ring-indigo-500/50 text-sm font-semibold"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Company Name</label>
            <Input 
              placeholder="e.g. Netflix, Stripe, Google" 
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="bg-muted/20 border-border shadow-xs focus-visible:ring-indigo-500/50 text-sm font-semibold"
            />
          </div>
        </div>

        {/* Job Description Content FULLY covering the box horizontally */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Job Description Content
            </label>
            <span className="text-[11px] text-muted-foreground">Full Text Area</span>
          </div>
          <Textarea 
            placeholder="Paste the requirements, qualifications, and role responsibilities here..." 
            className="w-full min-h-[140px] resize-y bg-muted/20 border-border shadow-xs focus-visible:ring-indigo-500/50 text-xs sm:text-sm leading-relaxed"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Action Button Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-border/50">
          <p className="text-xs text-muted-foreground">
            Evaluates skill coverage, keyword taxonomy, and system architecture fit.
          </p>
          <Button 
            className="h-11 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-500/20 transition-all cursor-pointer shrink-0" 
            disabled={isLoading || !title || !company || !description}
            onClick={() => {
              onAnalyze({ title, company, description });
            }}
          >
            {isLoading ? (
              <>
                <RefreshCcw className="h-4 w-4 mr-2 animate-spin" />
                Analyzing Match...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Analyze Job Match
              </>
            )}
          </Button>
        </div>
      </div>
    </SectionCard>
  );
}
