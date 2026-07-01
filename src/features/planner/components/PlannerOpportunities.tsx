import { SectionCard } from "@/components/shared/Cards";
import { Briefcase, Calendar, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PlannerOpportunities() {
  return (
    <SectionCard title="Opportunity Intelligence" description="Prioritized targets based on your current profile.">
      <div className="space-y-4 mt-4">
        
        <div className="p-3 border rounded-lg hover:border-emerald-400 transition-colors">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-emerald-500" />
              <h4 className="font-semibold text-sm">Best Matching Jobs</h4>
            </div>
            <span className="text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-2 py-0.5 rounded-full">3 New</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2 mb-3">You have an 88%+ match for these roles.</p>
          <Button variant="outline" size="sm" className="w-full text-xs h-7">View Matches</Button>
        </div>

        <div className="p-3 border rounded-lg hover:border-amber-400 transition-colors">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-amber-500" />
              <h4 className="font-semibold text-sm">Upcoming Interviews</h4>
            </div>
          </div>
          <div className="mt-2 text-sm">
            <p className="font-medium text-slate-800 dark:text-slate-200">TechCorp - System Design</p>
            <p className="text-xs text-amber-600 mt-1">Tomorrow, 10:00 AM</p>
          </div>
        </div>

        <div className="p-3 border rounded-lg">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-500" />
              <h4 className="font-semibold text-sm">Resume Recommendation</h4>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2 mb-2">Use <span className="font-medium text-slate-700 dark:text-slate-300">Senior_Frontend_v3.pdf</span> for all upcoming applications to maximize ATS parsing.</p>
        </div>

      </div>
    </SectionCard>
  );
}
