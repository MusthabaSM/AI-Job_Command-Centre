import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GitBranch, Globe, Calendar, HardDrive, Bot, Target, Shield, Bell } from "lucide-react";

export function ProfileSection({ data, onChange, onSave }: { data: any, onChange: (d: any) => void, onSave: () => void }) {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-sm text-muted-foreground">Manage your public and AI-facing profile details.</p>
      </div>
      <div className="space-y-4">
        <div className="grid gap-2">
          <label className="text-sm font-medium">Full Name</label>
          <Input value={data?.name || ""} onChange={e => onChange({ ...data, name: e.target.value })} />
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium">Target Role</label>
          <Input value={data?.role || ""} onChange={e => onChange({ ...data, role: e.target.value })} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Experience Level</label>
            <Select value={data?.level || "senior"} onValueChange={(v: string) => onChange({ ...data, level: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="junior">Junior (0-2 yrs)</SelectItem>
                <SelectItem value="mid">Mid-Level (3-5 yrs)</SelectItem>
                <SelectItem value="senior">Senior (5+ yrs)</SelectItem>
                <SelectItem value="lead">Lead / Staff</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Target Salary</label>
            <Input value={data?.salary || ""} onChange={e => onChange({ ...data, salary: e.target.value })} />
          </div>
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium">Primary Industry</label>
          <Select value={data?.industry || "tech"} onValueChange={(v: string) => onChange({ ...data, industry: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="tech">Technology / Software</SelectItem>
              <SelectItem value="finance">Finance / Fintech</SelectItem>
              <SelectItem value="health">Healthcare / Biotech</SelectItem>
              <SelectItem value="ecommerce">E-Commerce</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button className="w-fit" onClick={onSave}>Save Profile</Button>
      </div>
    </div>
  );
}

export function AIPrefSection({ data, onChange, onSave }: any) {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h3 className="text-lg font-medium">AI Preferences</h3>
        <p className="text-sm text-muted-foreground">Configure how the Alchemist agents automate your workflow.</p>
      </div>
      <div className="space-y-4">
        <div className="grid gap-2">
          <label className="text-sm font-medium">Default Agent Persona</label>
          <Select value={data?.persona || "coach"} onValueChange={(v: string) => onChange({ ...data, persona: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="coach">Supportive Coach</SelectItem>
              <SelectItem value="direct">Direct & Critical</SelectItem>
              <SelectItem value="executive">Executive Tone</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-between p-4 border rounded-lg bg-background">
          <div>
            <h4 className="font-medium text-sm">Auto Resume Optimization</h4>
            <p className="text-xs text-muted-foreground">Automatically generate a new ATS-friendly resume for high-match jobs.</p>
          </div>
          <Switch 
            key={`resume-${data?.autoResume}`} 
            defaultChecked={data?.autoResume ?? true} 
            onClick={() => onChange({ ...data, autoResume: !(data?.autoResume ?? true) })} 
          />
        </div>
        <div className="flex items-center justify-between p-4 border rounded-lg bg-background">
          <div>
            <h4 className="font-medium text-sm">Auto Career Planning</h4>
            <p className="text-xs text-muted-foreground">Allow Career Planner to automatically insert tasks into your roadmap.</p>
          </div>
          <Switch 
            key={`plan-${data?.autoPlan}`} 
            defaultChecked={data?.autoPlan ?? true} 
            onClick={() => onChange({ ...data, autoPlan: !(data?.autoPlan ?? true) })} 
          />
        </div>
        <div className="flex items-center justify-between p-4 border rounded-lg bg-background">
          <div>
            <h4 className="font-medium text-sm">Auto Interview Generation</h4>
            <p className="text-xs text-muted-foreground">Draft mock interviews instantly when an application reaches the Interview stage.</p>
          </div>
          <Switch 
            key={`interview-${data?.autoInterview}`} 
            defaultChecked={data?.autoInterview ?? true} 
            onClick={() => onChange({ ...data, autoInterview: !(data?.autoInterview ?? true) })} 
          />
        </div>
      </div>
    </div>
  );
}

export function IntegrationsSection() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h3 className="text-lg font-medium">Integrations</h3>
        <p className="text-sm text-muted-foreground">Connect your external accounts to synchronize data.</p>
      </div>
      <div className="space-y-4">
        
        <div className="flex items-center justify-between p-4 border border-border rounded-xl bg-background shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-500/10 p-2.5 rounded-lg text-indigo-600 dark:text-indigo-400">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-foreground">Lemma Backend</h4>
              <p className="text-[10px] uppercase tracking-wider font-bold text-emerald-600 dark:text-emerald-400 flex items-center mt-1">Connected (Demo Mode)</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="shadow-sm">Configure</Button>
        </div>

        <div className="flex items-center justify-between p-4 border border-border rounded-xl bg-background shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="bg-muted p-2.5 rounded-lg text-muted-foreground">
              <GitBranch className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-foreground">GitHub</h4>
              <p className="text-xs font-medium text-muted-foreground mt-0.5">Not connected</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="shadow-sm">Connect</Button>
        </div>

        <div className="flex items-center justify-between p-4 border border-border rounded-xl bg-background shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="bg-blue-500/10 p-2.5 rounded-lg text-blue-600 dark:text-blue-400">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-foreground">LinkedIn</h4>
              <p className="text-xs font-medium text-muted-foreground mt-0.5">Not connected</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="shadow-sm">Connect</Button>
        </div>

      </div>
    </div>
  );
}

export function SecuritySection() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h3 className="text-lg font-medium text-destructive">Security & Privacy</h3>
        <p className="text-sm text-muted-foreground">Manage your data and account security.</p>
      </div>
      <div className="space-y-4">
        <div className="p-5 border border-destructive/20 rounded-xl bg-destructive/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Shield className="h-16 w-16 text-destructive" />
          </div>
          <h4 className="font-bold text-sm text-destructive tracking-wider uppercase mb-1">Data Export</h4>
          <p className="text-xs font-medium text-destructive/80 mt-1 mb-4 relative z-10">Download all your resumes, jobs, and execution history as JSON.</p>
          <Button variant="outline" size="sm" className="border-destructive/30 text-destructive hover:bg-destructive/10 shadow-sm relative z-10">Export Data</Button>
        </div>
        
        <div className="p-5 border border-destructive/20 rounded-xl bg-destructive/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Shield className="h-16 w-16 text-destructive" />
          </div>
          <h4 className="font-bold text-sm text-destructive tracking-wider uppercase mb-1">Delete Account</h4>
          <p className="text-xs font-medium text-destructive/80 mt-1 mb-4 relative z-10">Permanently delete your AI Alchemist account and all associated data.</p>
          <Button variant="destructive" size="sm" className="shadow-sm relative z-10">Delete Account</Button>
        </div>
      </div>
    </div>
  );
}

export function PlaceholderSection({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <Target className="h-10 w-10 text-muted-foreground/30 mb-4" />
      <h3 className="text-lg font-medium text-foreground">{title} Settings</h3>
      <p className="text-sm text-muted-foreground mt-2">This configuration module is available in the production environment.</p>
    </div>
  );
}
