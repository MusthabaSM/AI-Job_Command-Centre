"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { Radar as RadarIcon, BarChart3 } from "lucide-react";

export function SkillRadarCard({ matchData }: { matchData?: any }) {
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

  return (
    <Card className="border border-border shadow-xs flex flex-col h-full">
      <CardHeader className="pb-2.5 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
          <RadarIcon className="h-4 w-4 text-indigo-500" /> Skill Coverage (Radar)
        </CardTitle>
        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Multivariate</span>
      </CardHeader>
      <CardContent className="h-[270px] p-2 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
            <PolarGrid strokeOpacity={0.4} />
            <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: 'currentColor', opacity: 0.8 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
            <Radar name="Resume" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.35} />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function MissingSkillsGapCard({ matchData }: { matchData?: any }) {
  const score = matchData?.match_score || 0;
  const missing = matchData?.missing_skills || [];
  const gapData = missing.length > 0 
    ? missing.map((skill: string) => ({ 
        name: skill.length > 16 ? skill.substring(0, 14) + "..." : skill, 
        gap: 100 - score 
      }))
    : [{ name: 'None', gap: 0 }];

  return (
    <Card className="border border-border shadow-xs flex flex-col h-full">
      <CardHeader className="pb-2.5 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
          <BarChart3 className="h-4 w-4 text-destructive" /> Missing Skills Gap
        </CardTitle>
        <span className="text-[10px] font-semibold text-destructive uppercase tracking-wider">Gap Index</span>
      </CardHeader>
      <CardContent className="h-[270px] p-2 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart layout="vertical" data={gapData} margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
            <XAxis type="number" hide domain={[0, 100]} />
            <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'currentColor', opacity: 0.8 }} width={100} />
            <Tooltip cursor={{ fill: 'transparent' }} />
            <Bar dataKey="gap" fill="#ef4444" radius={[0, 6, 6, 0]} barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function JobCharts({ matchData }: { matchData?: any }) {
  return (
    <div className="grid md:grid-cols-2 gap-4 mt-6">
      <SkillRadarCard matchData={matchData} />
      <MissingSkillsGapCard matchData={matchData} />
    </div>
  );
}
