import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/settings')({
  component: SettingsPage,
})

import React from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { FeatureHeader } from "@/components/shared/FeatureHeader";
import { SettingsLayout } from "@/features/settings/components/SettingsLayout";
import { motion } from "framer-motion";

function SettingsPage() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-12 max-w-[1200px] mx-auto"
    >
      <PageHeader 
        title="Workspace & AI Config" 
        description="Manage your profile, AI preferences, and integrations."
      />

      <FeatureHeader 
        title="AI Configuration Center"
        description="Configure AI agent behavior, manage integrations with GitHub/LinkedIn, and control your career data preferences."
        agent="system"
        resources={["user_settings", "integrations table"]}
      />

      <SettingsLayout />

    </motion.div>
  );
}
