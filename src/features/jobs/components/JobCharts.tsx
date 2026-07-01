"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

export function JobCharts({ matchData }: { matchData?: any }) {
  const score = matchData?.match_score || 0;
  
  const radarData = matchData?.categories ? Object.entries(matchData.categories).map(([key, val]) => ({
    subject: key,
    A: Math.round(val as number),
    fullMark: 100
  })) : [
    { subject: 'Overall Match', A: score, fullMark: 100 },
    { subject: 'Skills', A: Math.max(0, score - 5), fullMark: 100 },
    { subject: 'Experience', A: Math.max(0, score + 5), fullMark: 100 },
  ];

  const missing = matchData?.missing_skills || [];
  const gapData = missing.length > 0 
    ? missing.map((skill: string) => ({ name: skill.substring(0, 10), gap: 100 - score }))
    : [{ name: 'None', gap: 0 }];

  return (
    <div className="grid md:grid-cols-2 gap-4 mt-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Skill Coverage (Radar)</CardTitle>
        </CardHeader>
        <CardContent className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
              <Radar name="Resume" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.4} />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Missing Skills Gap</CardTitle>
        </CardHeader>
        <CardContent className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={gapData} margin={{ top: 0, right: 20, left: 20, bottom: 0 }}>
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
              <Tooltip cursor={{fill: 'transparent'}} />
              <Bar dataKey="gap" fill="#ef4444" radius={[0, 4, 4, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
