import { MetricCard } from "@/components/shared/MetricCard";
import { Briefcase, Activity, MessageSquare, Award, XOctagon, Percent } from "lucide-react";

export function PipelineKPIs({ applications = [] }: { applications?: any[] }) {
  const total = applications.length;
  const activeInterviews = applications.filter(a => ['Online Assessment', 'Technical Interview', 'HR Interview'].includes(a.status || a.stage)).length;
  const offers = applications.filter(a => (a.status || a.stage) === 'Offer').length;
  const rejections = applications.filter(a => (a.status || a.stage) === 'Rejected').length;
  const responseRate = total > 0 ? Math.round(((total - applications.filter(a => ['Saved', 'Applied'].includes(a.status || a.stage)).length) / total) * 100) : 0;
  
  const totalScore = applications.reduce((sum, a) => sum + (a.match_score || a.matchScore || 0), 0);
  const avgMatch = total > 0 ? Math.round(totalScore / total) : 0;

  return (
    <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
      <MetricCard 
        title="Total Applications" 
        value={total} 
        icon={<Briefcase />} 
      />
      <MetricCard 
        title="Active Interviews" 
        value={activeInterviews} 
        icon={<Activity className="text-indigo-500" />} 
        className="bg-indigo-500/5 border-indigo-500/20 shadow-sm"
      />
      <MetricCard 
        title="Response Rate" 
        value={`${responseRate}%`} 
        icon={<MessageSquare />} 
      />
      <MetricCard 
        title="Offers" 
        value={offers} 
        icon={<Award className="text-emerald-500" />} 
        className="bg-emerald-500/5 border-emerald-500/20 shadow-sm"
      />
      <MetricCard 
        title="Rejections" 
        value={rejections} 
        icon={<XOctagon className="text-destructive/70" />} 
        className="bg-destructive/5 border-destructive/20 shadow-sm"
      />
      <MetricCard 
        title="Avg Match Score" 
        value={`${avgMatch}%`} 
        icon={<Percent />} 
      />
    </div>
  );
}
