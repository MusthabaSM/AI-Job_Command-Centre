import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Briefcase, Building2, Calendar, Link2, Sparkles, AlertCircle, FileText, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateApplication } from "@/lib/firebase/queries";
import { toast } from "sonner";

const STAGES = [
  "Saved",
  "Applied",
  "Online Assessment",
  "Technical Interview",
  "HR Interview",
  "Offer",
  "Rejected"
];

const PRIORITIES = [
  { value: "high", label: "High Priority", color: "text-red-500" },
  { value: "medium", label: "Medium Priority", color: "text-amber-500" },
  { value: "low", label: "Low Priority", color: "text-emerald-500" },
];

interface AddApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddApplicationModal({ isOpen, onClose }: AddApplicationModalProps) {
  const createApplication = useCreateApplication();

  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [stage, setStage] = useState("Applied");
  const [priority, setPriority] = useState("medium");
  const [matchScore, setMatchScore] = useState(80);
  const [appliedDate, setAppliedDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [url, setUrl] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!company.trim()) {
      toast.error("Please enter a company name.");
      return;
    }
    if (!position.trim()) {
      toast.error("Please enter a position or job title.");
      return;
    }

    try {
      await createApplication.mutateAsync({
        company: company.trim(),
        position: position.trim(),
        status: stage,
        stage: stage,
        priority,
        match_score: Number(matchScore) || 75,
        applied_date: appliedDate,
        url: url.trim(),
        notes: notes.trim(),
      });

      toast.success(`${position} at ${company} added to Career Pipeline!`);
      // Reset form
      setCompany("");
      setPosition("");
      setStage("Applied");
      setPriority("medium");
      setMatchScore(80);
      setUrl("");
      setNotes("");
      onClose();
    } catch (err: any) {
      toast.error("Failed to add application: " + (err?.message || "Unknown error"));
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl z-10 overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-transparent">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
                  <Briefcase className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground">Add to Career Pipeline</h3>
                  <p className="text-xs text-muted-foreground">Track a new job opportunity and AI interview lifecycle</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
              {/* Company & Position */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5 text-indigo-500" /> Company <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder="e.g. Google, LinkedIn"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    required
                    autoFocus
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Briefcase className="h-3.5 w-3.5 text-indigo-500" /> Position / Role <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder="e.g. Software Engineer"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Stage & Priority */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Initial Stage</label>
                  <select
                    value={stage}
                    onChange={(e) => setStage(e.target.value)}
                    className="h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-sm transition-all focus:border-indigo-500 focus:outline-none"
                  >
                    {STAGES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-sm transition-all focus:border-indigo-500 focus:outline-none"
                  >
                    {PRIORITIES.map((p) => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Match Score & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-amber-500" /> Match Score
                    </label>
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{matchScore}%</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="100"
                    value={matchScore}
                    onChange={(e) => setMatchScore(Number(e.target.value))}
                    className="w-full accent-indigo-600 h-2 bg-muted rounded-lg cursor-pointer mt-2"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" /> Applied Date
                  </label>
                  <Input
                    type="date"
                    value={appliedDate}
                    onChange={(e) => setAppliedDate(e.target.value)}
                  />
                </div>
              </div>

              {/* Job URL */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Link2 className="h-3.5 w-3.5 text-muted-foreground" /> Job Posting URL (Optional)
                </label>
                <Input
                  type="url"
                  placeholder="https://jobs.lever.co/... or LinkedIn URL"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-muted-foreground" /> Notes & Compensation (Optional)
                </label>
                <Textarea
                  placeholder="e.g. Referral by senior engineer, expected range ₹18-24 LPA, next step is OA"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              {/* Footer Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={createApplication.isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createApplication.isPending}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20"
                >
                  {createApplication.isPending ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-2" /> Add Application
                    </>
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
