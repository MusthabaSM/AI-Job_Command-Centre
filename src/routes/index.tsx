import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: CareerOperatingSystem,
})


import React from "react";
import { motion } from "framer-motion";
import { PlannerHero } from "@/features/planner/components/PlannerHero";
import { PlannerActions } from "@/features/planner/components/PlannerActions";
import { PlannerRoadmap } from "@/features/planner/components/PlannerRoadmap";
import { PlannerSkills } from "@/features/planner/components/PlannerSkills";
import { PlannerOpportunities } from "@/features/planner/components/PlannerOpportunities";
import { PlannerTimeline } from "@/features/planner/components/PlannerTimeline";
import { PlannerCharts } from "@/features/planner/components/PlannerCharts";
import { FeatureHeader } from "@/components/shared/FeatureHeader";
import { useCareerScores, useCareerTasks, useJobs, useNotifications, useResumes } from "@/lib/firebase/queries";

function CareerOperatingSystem() {
  const { data: scores } = useCareerScores();
  const { data: tasks = [] } = useCareerTasks();
  const { data: jobs = [] } = useJobs();
  const { data: notifications = [] } = useNotifications();
  const { data: resumes = [] } = useResumes();
  
  const activeResume = resumes[0];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-12 max-w-[1600px] mx-auto"
    >
      <PlannerHero scores={scores} tasks={tasks} jobs={jobs} />

      <FeatureHeader 
        title="AI Career Planner"
        description="AI analyzes your resume, target roles, and skill gaps to generate a personalized career roadmap with weekly milestones and learning goals."
        agent="career_planner"
        resources={["career_scores", "career_tasks table", "jobs table"]}
        estimatedTime="~4s"
      />

      <PlannerActions />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column */}
        <PlannerRoadmap tasks={tasks} />

        {/* Right Column */}
        <div className="xl:col-span-1 space-y-6">
          <PlannerSkills resume={activeResume} jobs={jobs} />
          <PlannerOpportunities />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
        <div className="xl:col-span-2">
          <PlannerCharts scores={scores} />
        </div>
        <div className="xl:col-span-1">
          <PlannerTimeline notifications={notifications} />
        </div>
      </div>
    </motion.div>
  );
}
