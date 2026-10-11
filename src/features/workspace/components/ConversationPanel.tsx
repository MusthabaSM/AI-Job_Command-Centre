"use client";
import React, { useState, useRef, useEffect } from "react";
import { Send, Sparkles, RotateCcw, Bot, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

import { useRunAgent, useResumes, useJobs } from "@/lib/firebase/queries";

const QUICK_PROMPTS = [
  "How much do I match LinkedIn?",
  "What are my critical missing skills?",
  "Review my CodePulse AI project",
  "How should I prepare for interview rounds?"
];

export function ConversationPanel({ activeAgentId }: { activeAgentId?: string }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "agent",
      content: "Hello Mohamed! I'm your AI Career Advisor. I have full context on your resume from Sona College, your projects (CodePulse AI, Explainable AI), and target roles like LinkedIn Software Engineer.\n\nAsk me anything about your job match, missing skills, or interview strategy!"
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const runAgent = useRunAgent();
  const { data: resumes } = useResumes();
  const { data: jobs } = useJobs();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, runAgent.isPending]);

  // Auto-send pending prompt if coming from Task Action Modal
  useEffect(() => {
    const pendingPrompt = localStorage.getItem("pending_task_prompt") || new URLSearchParams(window.location.search).get("prompt");
    if (pendingPrompt) {
      localStorage.removeItem("pending_task_prompt");
      const timer = setTimeout(() => {
        handleSend(pendingPrompt);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || runAgent.isPending) return;
    
    const userMessage = { id: Date.now(), role: "user", content: textToSend };
    
    // Last 5 messages for conversation memory
    const recentHistory = messages.slice(-5).map(m => ({ role: m.role, content: m.content }));
    
    setMessages(prev => [...prev, userMessage]);
    if (!messageText) setInput("");

    const activeResume = resumes?.[0];
    const contextData = {
      candidateProfile: {
        title: activeResume?.title,
        skills: activeResume?.extracted_skills || activeResume?.parsed_skills || [],
        experience: activeResume?.experience || [],
        projects: activeResume?.projects || [],
        education: activeResume?.education || []
      },
      jobsTargeting: (jobs || []).slice(0, 5).map((j: any) => ({
        role: j.role || j.title,
        company: j.company,
        description: j.description
      }))
    };
    
    try {
      const response: any = await runAgent.mutateAsync({ 
        agentId: activeAgentId || "career_planner", 
        input: textToSend,
        contextData: contextData,
        history: recentHistory
      });
      setMessages(prev => [...prev, { 
        id: Date.now(), 
        role: "agent", 
        content: response.output || "No response received." 
      }]);
    } catch (error: any) {
      setMessages(prev => [...prev, { 
        id: Date.now(), 
        role: "agent", 
        content: `Error: ${error.message}` 
      }]);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        id: Date.now(),
        role: "agent",
        content: "Chat cleared. What would you like to explore next?"
      }
    ]);
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 h-full bg-background w-full">
      {/* Clean Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card/50 backdrop-blur-sm shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
            <Sparkles className="h-4.5 w-4.5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              AI Career Advisor
              <span className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Resume & Target Jobs Connected
              </span>
            </h2>
            <p className="text-xs text-muted-foreground">Ask anything about your job match, skills, or career strategy</p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleClear}
          className="text-xs text-muted-foreground hover:text-foreground cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5 mr-1.5" /> Clear Chat
        </Button>
      </div>

      {/* Chat Messages */}
      <ScrollArea className="flex-1 p-4 sm:p-6 bg-gradient-to-b from-background to-muted/10">
        <div className="max-w-3xl mx-auto space-y-6 pb-6">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={cn("flex gap-3", msg.role === "user" ? "justify-end" : "justify-start")}
            >
              {msg.role === "agent" && (
                <div className="h-8 w-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  <Bot className="h-4 w-4" />
                </div>
              )}

              <div className={cn(
                "max-w-[85%] sm:max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed shadow-sm whitespace-pre-wrap break-words",
                msg.role === "user" 
                  ? "bg-gradient-to-br from-indigo-600 to-violet-600 text-white rounded-br-xs shadow-indigo-500/20" 
                  : "bg-card border border-border text-card-foreground rounded-bl-xs shadow-xs"
              )}>
                {msg.content}
              </div>

              {msg.role === "user" && (
                <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          ))}
          
          {runAgent.isPending && (
            <div className="flex gap-3 justify-start">
              <div className="h-8 w-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                <Bot className="h-4 w-4" />
              </div>
              <div className="bg-card border border-indigo-500/20 rounded-2xl p-4 rounded-bl-xs flex items-center gap-3 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-500/5 shadow-xs">
                <div className="relative flex items-center justify-center size-4">
                  <Sparkles className="h-4 w-4 absolute animate-ping opacity-75" />
                  <Sparkles className="h-4 w-4 relative" />
                </div>
                Thinking & analyzing your career profile...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 bg-background border-t border-border shrink-0">
        <div className="max-w-3xl mx-auto flex flex-col gap-3">
          {/* Quick Prompts */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold text-muted-foreground mr-1">Suggestions:</span>
            {QUICK_PROMPTS.map((p) => (
              <button
                key={p}
                onClick={() => handleSend(p)}
                disabled={runAgent.isPending}
                className="text-xs bg-muted/60 hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 border border-border/60 hover:border-indigo-500/30 text-foreground/80 px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <span>{p}</span>
                <ArrowRight className="h-3 w-3 opacity-60" />
              </button>
            ))}
          </div>

          {/* Text Input */}
          <div className="flex items-center gap-2 p-1.5 pl-4 rounded-xl border border-border bg-card focus-within:border-indigo-500/60 focus-within:ring-2 focus-within:ring-indigo-500/10 shadow-sm transition-all">
            <Input 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask about your resume match, target skills, interview prep..." 
              className="border-0 bg-transparent shadow-none focus-visible:ring-0 flex-1 text-sm px-0 h-auto py-2 outline-none" 
              aria-label="Message input"
              disabled={runAgent.isPending}
            />
            <Button 
              onClick={() => handleSend()} 
              size="icon" 
              aria-label="Send message" 
              disabled={!input.trim() || runAgent.isPending} 
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shrink-0 h-9 w-9 transition-transform active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
