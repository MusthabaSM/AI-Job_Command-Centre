import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/workspace')({
  component: AIMissionControl,
})

import React, { useState } from "react";
import { SpecialistList } from "@/features/workspace/components/SpecialistList";
import { ConversationPanel } from "@/features/workspace/components/ConversationPanel";
import { ExecutionInspector } from "@/features/workspace/components/ExecutionInspector";
import { FeatureHeader } from "@/components/shared/FeatureHeader";
import { motion } from "framer-motion";

function AIMissionControl() {
  const [activeAgent, setActiveAgent] = useState("career_planner");

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-[calc(100vh-80px)] -m-4 sm:-m-6 md:-m-8 flex flex-col overflow-hidden"
    >
      <div className="px-4 sm:px-6 md:px-8 pt-4 pb-2 shrink-0">
        <FeatureHeader 
          title="AI Mission Control"
          description="Chat with specialized AI agents. Each agent has access to your career data and can execute backend functions in real-time. The Execution Inspector shows exactly what the AI is doing."
          agent="multi-agent system"
          resources={["all tables", "all functions"]}
        />
      </div>

      <div className="flex-1 flex min-h-0">
        {/* 20% Sidebar */}
        <div className="hidden lg:block w-72 shrink-0">
          <SpecialistList activeAgentId={activeAgent} onSelect={setActiveAgent} />
        </div>

        {/* 55% Center Panel */}
        <div className="flex-1 min-w-0 flex flex-col relative z-10 shadow-xl border-x border-border">
          <ConversationPanel activeAgentId={activeAgent} />
        </div>

        {/* 25% Right Sidebar */}
        <div className="hidden xl:block w-80 shrink-0">
          <ExecutionInspector />
        </div>
      </div>
    </motion.div>
  );
}
