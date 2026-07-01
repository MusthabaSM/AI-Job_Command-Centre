"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

export function PipelineCharts({ applications = [] }: { applications?: any[] }) {
  const STAGES = ["Saved", "Applied", "Online Assessment", "Technical Interview", "HR Interview", "Offer", "Rejected"];
  
  const stageData = STAGES.map(stage => {
    return {
      name: stage === "Online Assessment" ? "OA" : stage === "Technical Interview" ? "Tech" : stage === "HR Interview" ? "HR" : stage,
      count: applications.filter(a => (a.status || a.stage || 'Saved') === stage).length
    };
  });

  const timelineData = [
    { name: "Week 1", apps: applications.length > 0 ? applications.filter(a => new Date(a.created_at || a.applied_date).getTime() < Date.now() - 21 * 86400000).length : 0 },
    { name: "Week 2", apps: applications.length > 0 ? applications.filter(a => new Date(a.created_at || a.applied_date).getTime() >= Date.now() - 21 * 86400000 && new Date(a.created_at || a.applied_date).getTime() < Date.now() - 14 * 86400000).length : 0 },
    { name: "Week 3", apps: applications.length > 0 ? applications.filter(a => new Date(a.created_at || a.applied_date).getTime() >= Date.now() - 14 * 86400000 && new Date(a.created_at || a.applied_date).getTime() < Date.now() - 7 * 86400000).length : 0 },
    { name: "Week 4", apps: applications.length > 0 ? applications.filter(a => new Date(a.created_at || a.applied_date).getTime() >= Date.now() - 7 * 86400000).length : 0 },
  ];

  return (
    <div className="grid md:grid-cols-2 gap-4 mt-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Applications by Stage</CardTitle>
        </CardHeader>
        <CardContent className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stageData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip cursor={{fill: 'transparent'}} />
              <Bar dataKey="count" fill="#818cf8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Weekly Application Velocity</CardTitle>
        </CardHeader>
        <CardContent className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip />
              <Area type="monotone" dataKey="apps" stroke="#10b981" fillOpacity={1} fill="url(#colorApps)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
