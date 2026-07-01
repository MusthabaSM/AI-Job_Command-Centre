import React, { useState } from "react";
import { SectionCard } from "@/components/shared/Cards";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Link, Upload, Building2, MapPin, Briefcase, DollarSign, Globe } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useFetchJobUrl } from "@/lib/lemma/queries";
export function JobInput({ onAnalyze, isLoading }: { onAnalyze: (p: { title: string, company: string, description: string }) => void, isLoading?: boolean }) {
  const [activeTab, setActiveTab] = useState("paste");
  const [description, setDescription] = useState("Senior Frontend Engineer (React/Next.js)\nRequires 5+ years experience, Docker, CI/CD...");
  const [company, setCompany] = useState("TechCorp Inc.");
  const [title, setTitle] = useState("Senior Frontend Engineer");
  const [url, setUrl] = useState("");
  const fetchUrlMutation = useFetchJobUrl();

  const handleFetchUrl = async () => {
    if (!url) return;
    try {
      const res = await fetchUrlMutation.mutateAsync(url) as any;
      if (res.error) {
        toast.error(res.error);
        return;
      }
      if (res.title) setTitle(res.title);
      if (res.company) setCompany(res.company);
      if (res.description) setDescription(res.description);
      toast.success("Job details extracted successfully!");
      setActiveTab("paste"); // Switch to paste tab to review
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch URL");
    }
  };

  return (
    <SectionCard title="Job Input" description="Add a job description to analyze.">
      <div className="flex items-center gap-2 mb-6 border-b border-border/50 pb-3">
        <button 
          onClick={() => setActiveTab("paste")}
          className={cn("text-[10px] uppercase tracking-wider font-bold px-4 py-2 rounded-lg transition-colors", activeTab === "paste" ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground")}
        >
          Paste Text
        </button>
        <button 
          onClick={() => setActiveTab("url")}
          className={cn("text-[10px] uppercase tracking-wider font-bold px-4 py-2 rounded-lg transition-colors", activeTab === "url" ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground")}
        >
          <Link className="h-3 w-3 inline mr-1.5" /> Import URL
        </button>
      </div>

      {activeTab === "paste" && (
        <div className="space-y-4 mb-6">
          <Input 
            placeholder="Job Title" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-muted/20 border-border shadow-sm focus-visible:ring-indigo-500/50"
          />
          <Input 
            placeholder="Company" 
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="bg-muted/20 border-border shadow-sm focus-visible:ring-indigo-500/50"
          />
          <Textarea 
            placeholder="Paste the full job description here..." 
            className="min-h-[160px] resize-y bg-muted/20 border-border shadow-sm focus-visible:ring-indigo-500/50 leading-relaxed"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      )}
      {activeTab === "url" && (
        <div className="flex gap-3 mb-6">
          <Input 
            placeholder="https://linkedin.com/jobs/view/..." 
            className="bg-muted/20 border-border shadow-sm focus-visible:ring-indigo-500/50" 
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <Button 
            variant="secondary" 
            className="shadow-sm" 
            onClick={handleFetchUrl}
            disabled={fetchUrlMutation.isPending || !url}
          >
            {fetchUrlMutation.isPending ? "Fetching..." : "Fetch"}
          </Button>
        </div>
      )}

      {/* Extracted Job Info Display */}
      <div className="bg-indigo-500/5 border border-indigo-500/10 p-5 rounded-xl space-y-4 mb-6 shadow-sm">
        <h4 className="font-semibold text-xs tracking-wider uppercase text-indigo-600 dark:text-indigo-400 border-b border-indigo-500/10 pb-3">Extracted Details</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 text-foreground font-medium">
            <Building2 className="h-4 w-4 text-indigo-500/70" /> <span>{company || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-2 text-foreground font-medium">
            <Briefcase className="h-4 w-4 text-indigo-500/70" /> <span>{title || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" /> <span>Remote (Auto)</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <DollarSign className="h-4 w-4" /> <span>TBD</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Globe className="h-4 w-4" /> <span>Auto-extracted</span>
          </div>
        </div>
      </div>

      <div className="flex gap-3 sticky bottom-0 bg-card pt-4 pb-2 border-t mt-6 z-10">
        <Button 
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20" 
          disabled={isLoading || !title || !company || !description}
          onClick={() => {
            onAnalyze({ title, company, description });
          }}
        >
          {isLoading ? "Processing..." : "Analyze Job"}
        </Button>
      </div>
    </SectionCard>
  );
}
