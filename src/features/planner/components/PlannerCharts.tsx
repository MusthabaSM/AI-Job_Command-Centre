"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

export function PlannerCharts({ scores }: { scores?: any }) {
  const readiness = scores?.readiness || 0;
  const ats = scores?.ats || 0;

  const scoreData = [
    { name: "Mon", score: Math.max(0, readiness - 17) },
    { name: "Tue", score: Math.max(0, readiness - 14) },
    { name: "Wed", score: Math.max(0, readiness - 10) },
    { name: "Thu", score: Math.max(0, readiness - 4) },
    { name: "Fri", score: readiness },
  ];

  const successData = [
    { name: "Mon", prob: Math.max(0, ats - 35) },
    { name: "Tue", prob: Math.max(0, ats - 30) },
    { name: "Wed", prob: Math.max(0, ats - 20) },
    { name: "Thu", prob: Math.max(0, ats - 10) },
    { name: "Fri", prob: ats },
  ];

  return (
    <div className="grid md:grid-cols-2 gap-4 mt-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Career Score Trend</CardTitle>
        </CardHeader>
        <CardContent className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={scoreData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis fontSize={10} tickLine={false} axisLine={false} domain={[0, 100]} />
              <Tooltip cursor={{fill: 'transparent'}} />
              <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Interview Success Prediction (%)</CardTitle>
        </CardHeader>
        <CardContent className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={successData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorProb" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis fontSize={10} tickLine={false} axisLine={false} domain={[0, 100]} />
              <Tooltip />
              <Area type="monotone" dataKey="prob" stroke="#10b981" fillOpacity={1} fill="url(#colorProb)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
