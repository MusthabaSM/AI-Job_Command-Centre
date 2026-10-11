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
import { AddApplicationModal } from "@/features/pipeline/components/AddApplicationModal";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";

import { useApplications } from "@/lib/firebase/queries";

function CareerPipeline() {
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
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
            <Button 
              size="sm" 
              onClick={() => setIsAddModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
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

      <div className="space-y-6">
        {/* Full-width Single Row: Pipeline Board & 3D Circular Orbit */}
        <div className="w-full">
          {isLoading ? (
            <div className="h-[560px] flex items-center justify-center border rounded-xl bg-muted/10">
              <span className="text-muted-foreground animate-pulse">Loading Pipeline...</span>
            </div>
          ) : (
            <PipelineBoard applications={applications} onSelectApp={setSelectedApp} />
          )}
        </div>

        {/* Directly Below: AI Insights Dashboard */}
        <div className="w-full">
          <PipelineSidebar selectedApp={selectedApp || applications[0]} />
        </div>

        {/* Pipeline Analytics Charts */}
        <div className="w-full">
          <PipelineCharts applications={applications} />
        </div>
      </div>

      <AddApplicationModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
    </motion.div>
  );
}
