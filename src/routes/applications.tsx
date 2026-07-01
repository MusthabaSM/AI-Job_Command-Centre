import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/applications')({
  component: CareerPipeline,
})


import React, { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { FeatureHeader } from "@/components/shared/FeatureHeader";
import { PipelineKPIs } from "@/features/pipeline/components/PipelineKPIs";
import { PipelineBoard } from "@/features/pipeline/components/PipelineBoard";
import { PipelineSidebar } from "@/features/pipeline/components/PipelineSidebar";
import { PipelineWorkflow } from "@/features/pipeline/components/PipelineWorkflow";
import { PipelineCharts } from "@/features/pipeline/components/PipelineCharts";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Plus, Mail } from "lucide-react";

import { useApplications } from "@/lib/lemma/queries";

function CareerPipeline() {
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const { data: applications = [], isLoading } = useApplications();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-12 max-w-[1600px] mx-auto"
    >
      <PageHeader 
        title="Career Pipeline" 
        description="Actively manage your job applications and interview lifecycle."
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Mail className="h-4 w-4 mr-2" /> Follow-up Email
            </Button>
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white">
              <Plus className="h-4 w-4 mr-2" /> Add Application
            </Button>
          </div>
        }
      />

      <FeatureHeader 
        title="AI Pipeline Manager"
        description="Drag-and-drop Kanban board for tracking applications. AI generates follow-up recommendations and interview preparation tasks for each application."
        agent="pipeline_manager"
        resources={["applications table", "interviews table"]}
      />

      <PipelineKPIs applications={applications} />

      <div>
        <h3 className="text-sm font-semibold mb-3 text-foreground">Workflow Automation</h3>
        <PipelineWorkflow />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-3">
          {isLoading ? (
            <div className="h-[600px] flex items-center justify-center border rounded-xl bg-muted/10">
              <span className="text-muted-foreground animate-pulse">Loading Pipeline...</span>
            </div>
          ) : (
            <PipelineBoard applications={applications} onSelectApp={setSelectedApp} />
          )}
          <PipelineCharts applications={applications} />
        </div>
        <div className="xl:col-span-1">
          <PipelineSidebar selectedApp={selectedApp} />
        </div>
      </div>
    </motion.div>
  );
}
