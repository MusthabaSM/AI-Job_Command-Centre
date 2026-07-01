"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  ProfileSection, 
  AIPrefSection 
} from "./SettingsSections";

const CATEGORIES = [
  { id: "profile", label: "Profile" },
  { id: "ai", label: "AI Preferences" },
];

export function SettingsLayout() {
  const [activeTab, setActiveTab] = useState("profile");
  const [isDirty, setIsDirty] = useState(false);
  const [profileData, setProfileData] = useState({ name: "Alex Developer", role: "Senior Frontend Engineer", level: "senior", salary: "$150,000" });
  const [aiData, setAiData] = useState({ autoResume: true, autoPlan: true, autoInterview: true });

  React.useEffect(() => {
    try {
      const savedProfile = localStorage.getItem("alchemist_profile");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (savedProfile) setProfileData(JSON.parse(savedProfile));
      const savedAi = localStorage.getItem("alchemist_ai_pref");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (savedAi) setAiData(JSON.parse(savedAi));
    } catch (e) {}
  }, []);

  const handleProfileChange = (newData: any) => {
    setProfileData(newData);
    setIsDirty(true);
  };

  const handleAiChange = (newData: any) => {
    setAiData(newData);
    setIsDirty(true);
  };

  const handleSave = () => {
    try {
      localStorage.setItem("alchemist_profile", JSON.stringify(profileData));
      localStorage.setItem("alchemist_ai_pref", JSON.stringify(aiData));
    } catch (e) {}
    setIsDirty(false);
    toast.success("Workspace configuration saved successfully.");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "profile": return <ProfileSection data={profileData} onChange={handleProfileChange} onSave={handleSave} />;
      case "ai": return <AIPrefSection data={aiData} onChange={handleAiChange} onSave={handleSave} />;
      default: return <ProfileSection data={profileData} onChange={handleProfileChange} onSave={handleSave} />;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 bg-background p-6 rounded-2xl border border-border shadow-sm min-h-[700px]">
      
      {/* Left Navigation */}
      <aside className="lg:w-64 shrink-0">
        <nav className="flex flex-col space-y-1">
          {CATEGORIES.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveTab(category.id)}
              className={cn(
                "text-left px-4 py-2.5 rounded-lg text-[13px] transition-all duration-300 font-semibold",
                activeTab === category.id 
                  ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shadow-sm"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )}
            >
              {category.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="pb-20"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>

        {/* Floating Action Bar for Unsaved Changes */}
        <AnimatePresence>
          {isDirty && (
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="absolute bottom-0 left-0 right-0 p-4 bg-foreground text-background rounded-xl shadow-xl flex items-center justify-between max-w-2xl border border-border/20 backdrop-blur-md"
            >
              <span className="text-sm font-semibold">You have unsaved changes.</span>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => setIsDirty(false)} className="text-muted hover:text-background hover:bg-background/20 transition-colors">Reset</Button>
                <Button size="sm" onClick={handleSave} className="bg-indigo-500 hover:bg-indigo-600 text-white shadow-md shadow-indigo-500/20">Save Changes</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

    </div>
  );
}
