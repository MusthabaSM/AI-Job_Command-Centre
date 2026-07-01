"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionCard } from "@/components/shared/Cards";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const trendData = [
  { name: "Week 1", score: 65 },
  { name: "Week 2", score: 68 },
  { name: "Week 3", score: 74 },
  { name: "Week 4", score: 82 },
];

export function ChartsPanel({ applications = [] }: { applications?: any[] }) {
  // Compute stage data dynamically from applications
  const stageCounts = applications.reduce((acc, app) => {
    const status = app.status || 'Applied';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const stageData = Object.keys(stageCounts).map(name => ({
    name,
    count: stageCounts[name]
  })).sort((a, b) => b.count - a.count);

  // Fallback if no applications exist
  const displayStageData = stageData.length > 0 ? stageData : [
    { name: "Applied", count: 0 },
    { name: "Screen", count: 0 },
    { name: "Interview", count: 0 },
    { name: "Offer", count: 0 },
  ];
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <SectionCard title="Career Score Trend" className="h-full">
        <div className="h-[200px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" />
              <YAxis fontSize={11} tickLine={false} axisLine={false} domain={[0, 100]} stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: '1px solid hsl(var(--border))', boxShadow: 'var(--shadow-md)' }}
                cursor={{ stroke: 'hsl(var(--muted))', strokeWidth: 2 }}
              />
              <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: 'white' }} activeDot={{ r: 6, strokeWidth: 0 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>
      
      <SectionCard title="Applications by Stage" className="h-full">
        <div className="h-[200px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={displayStageData}>
              <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: '1px solid hsl(var(--border))', boxShadow: 'var(--shadow-md)' }}
                cursor={{fill: 'hsl(var(--muted))', opacity: 0.4}} 
              />
              <Bar dataKey="count" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>
    </div>
  );
}
