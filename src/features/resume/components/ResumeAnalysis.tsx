"use client";
import React, { useState } from "react";
import { SectionCard } from "@/components/shared/Cards";
import { ChevronDown, ChevronUp, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SkillBadge } from "@/components/shared/Badges";

const CollapsibleCard = ({ title, children, confidence }: { title: string, children: React.ReactNode, confidence?: number }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="border border-border rounded-xl overflow-hidden mb-4 shadow-sm bg-background transition-all duration-300 hover:shadow-md hover:border-indigo-500/30">
      <div 
        className="flex items-center justify-between p-4 bg-muted/20 cursor-pointer select-none transition-colors hover:bg-muted/40"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          <h4 className="font-semibold text-sm text-foreground">{title}</h4>
          {confidence && (
            <span className="text-[10px] uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2.5 rounded-md py-0.5 flex items-center gap-1 font-bold">
              <CheckCircle2 className="h-3 w-3" /> {confidence}% Match
            </span>
          )}
        </div>
        {isOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-background border-t">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export function ResumeAnalysis({ resume }: { resume?: any }) {
  if (!resume) {
    return (
      <SectionCard title="Resume Analysis" description="Structured data extracted by the AI Resume Analyzer." className="h-full">
        <div className="mt-4 flex flex-col items-center justify-center h-48 text-muted-foreground border border-dashed rounded-xl">
          <p>No resume selected.</p>
        </div>
      </SectionCard>
    );
  }

  const safeArray = (val: any) => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    if (typeof val === 'string') {
      try {
        const parsed = JSON.parse(val);
        if (Array.isArray(parsed)) return parsed;
        if (typeof parsed === 'object' && parsed !== null) return Object.values(parsed).flat();
      } catch (e) {
        return [];
      }
    }
    if (typeof val === 'object' && val !== null) {
      return Object.values(val).flat();
    }
    return [];
  };

  const safeSkillsArray = (val: any): string[] => {
    const arr = safeArray(val);
    const extractStrings = (item: any): string[] => {
      if (!item) return [];
      if (typeof item === 'string') return [item];
      if (typeof item === 'number' || typeof item === 'boolean') return [String(item)];
      if (Array.isArray(item)) return item.map(extractStrings).flat();
      if (typeof item === 'object') return Object.values(item).map(extractStrings).flat();
      return [];
    };
    return arr.map(extractStrings).flat();
  };

  const skills = safeSkillsArray(resume.extracted_skills);
  const experience = safeArray(resume.experience);
  const projects = safeArray(resume.projects);
  const education = safeArray(resume.education);

  return (
    <SectionCard title="Resume Analysis" description="Structured data extracted by the AI Resume Analyzer.">
      <div className="mt-4 pb-6">
        <CollapsibleCard title="Extracted Skills">
          <div className="flex flex-wrap gap-2">
            {skills.map((skill: string, i: number) => (
              <SkillBadge key={i} skill={skill} />
            ))}
            {skills.length === 0 && <span className="text-sm text-muted-foreground">No skills extracted.</span>}
          </div>
        </CollapsibleCard>

        <CollapsibleCard title="Experience">
          <div className="space-y-4">
            {experience.map((exp: any, i: number) => (
              <div key={i} className={i > 0 ? "pt-4 border-t" : ""}>
                <h5 className="font-medium text-sm">{exp.title}</h5>
                <p className="text-xs text-muted-foreground">{exp.company} {exp.date ? `• ${exp.date}` : ""}</p>
                {exp.description && (
                  <ul className="list-disc list-outside ml-4 text-sm mt-2 text-slate-700 dark:text-slate-300 space-y-1">
                    {Array.isArray(exp.description) 
                      ? exp.description.map((d: string, j: number) => <li key={j}>{d}</li>) 
                      : <li>{exp.description}</li>}
                  </ul>
                )}
              </div>
            ))}
            {experience.length === 0 && (
              <div className="flex flex-col items-center justify-center py-4 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1">Fresher</span>
                <span className="text-xs text-muted-foreground">No professional experience listed</span>
              </div>
            )}
          </div>
        </CollapsibleCard>

        <CollapsibleCard title="Projects">
          <div className="space-y-4">
            {projects.map((proj: any, i: number) => (
              <div key={i} className={i > 0 ? "pt-4 border-t" : ""}>
                <h5 className="font-medium text-sm">{proj.title}</h5>
                {proj.date && <p className="text-xs text-muted-foreground">{proj.date}</p>}
                <p className="text-sm mt-2 text-slate-700 dark:text-slate-300">
                  {proj.description}
                </p>
              </div>
            ))}
            {projects.length === 0 && <span className="text-sm text-muted-foreground">No projects extracted.</span>}
          </div>
        </CollapsibleCard>

        <CollapsibleCard title="Education">
          <div className="space-y-4">
            {education.map((edu: any, i: number) => (
              <div key={i} className={i > 0 ? "pt-4 border-t" : ""}>
                <h5 className="font-medium text-sm">{edu.degree}</h5>
                <p className="text-xs text-muted-foreground">{edu.institution} {edu.date ? `• ${edu.date}` : ""}</p>
              </div>
            ))}
            {education.length === 0 && <span className="text-sm text-muted-foreground">No education extracted.</span>}
          </div>
        </CollapsibleCard>
      </div>
    </SectionCard>
  );
}
