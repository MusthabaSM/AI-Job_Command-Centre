import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/workspace')({
  component: AIMissionControl,
})

import React from "react";
import { ConversationPanel } from "@/features/workspace/components/ConversationPanel";
import { motion } from "framer-motion";

function AIMissionControl() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-[calc(100vh-80px)] -m-4 sm:-m-6 md:-m-8 flex flex-col overflow-hidden bg-background"
    >
      <div className="flex-1 min-h-0 flex flex-col w-full max-w-4xl mx-auto border-x border-border/40 shadow-sm">
        <ConversationPanel activeAgentId="career_planner" />
      </div>
    </motion.div>
  );
}
