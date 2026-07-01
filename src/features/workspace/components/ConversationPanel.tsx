"use client";
import React, { useState } from "react";
import { Send, FileUp, Sparkles, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

import { useRunAgent } from "@/lib/lemma/queries";

const PROMPTS = [
  "Analyze my resume",
  "Find missing skills",
  "Improve ATS score",
  "Prepare interview",
  "Optimize applications",
  "Generate weekly plan"
];

export function ConversationPanel({ activeAgentId }: { activeAgentId: string }) {
  const [activeTab, setActiveTab] = useState("conversation");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { id: 1, role: "agent", content: "Hello! I am the AI Career Planner. I've analyzed your recent job matches and noticed a gap in Docker skills. Would you like me to generate a study plan, or should we focus on preparing for your upcoming TechCorp interview?" }
  ]);
  const runAgent = useRunAgent();

  const handleSend = async () => {
    if (!input.trim() || runAgent.isPending) return;
    const currentMessage = input;
    const userMessage = { id: Date.now(), role: "user", content: currentMessage };
    
    // Grab the last 5 messages for history before adding the new one
    const recentHistory = messages.slice(-5).map(m => ({ role: m.role, content: m.content }));
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    
    try {
      const response: any = await runAgent.mutateAsync({ 
        agentId: activeAgentId || "system", 
        input: currentMessage,
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

  return (
    <div className="flex flex-col flex-1 min-h-0 h-full bg-background w-full">
      {/* Tabs */}
      <div className="flex items-center gap-6 px-6 border-b pt-4 pb-3">
        <span className="text-sm font-medium border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400">
          Conversation
        </span>
      </div>

      {/* Chat Area */}
      <ScrollArea className="flex-1 p-4 bg-gradient-to-b from-background to-muted/20">
        <div className="space-y-6 pb-4">
          {messages.map((msg) => (
            <div key={msg.id} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
              <div className={cn(
                "max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed shadow-sm",
                msg.role === "user" 
                  ? "bg-gradient-to-br from-indigo-500 to-violet-600 text-white rounded-br-sm shadow-indigo-500/20" 
                  : "bg-card border border-border text-card-foreground rounded-bl-sm"
              )}>
                {msg.content}
              </div>
            </div>
          ))}
          
          {runAgent.isPending && (
            <div className="flex justify-start">
              <div className="glass-panel rounded-2xl p-4 rounded-bl-sm flex items-center gap-3 text-sm font-medium text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 bg-indigo-500/5">
                <div className="relative flex items-center justify-center size-5">
                  <Sparkles className="h-4 w-4 absolute animate-ping opacity-75" />
                  <Sparkles className="h-4 w-4 relative" />
                </div>
                Agent is thinking...
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-3 bg-background border-t border-border/50 shrink-0">
        <div className="bg-muted/30 rounded-2xl p-2 flex flex-col gap-2 border border-border focus-within:border-indigo-500/50 transition-colors shadow-sm focus-within:ring-1 focus-within:ring-indigo-500/50">
          <div className="flex flex-nowrap overflow-x-auto gap-2 px-2 pb-1 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
            {PROMPTS.map(p => (
              <button key={p} onClick={() => setInput(p)} className="text-[10px] uppercase tracking-wider font-semibold bg-muted text-muted-foreground px-3 py-1.5 rounded-full hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors whitespace-nowrap shrink-0">
                {p}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 px-2">
            <Input 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask your AI specialists..." 
              className="border-0 bg-transparent shadow-none focus-visible:ring-0 flex-1 text-base px-0 h-auto py-2 outline-none" 
              aria-label="Message input"
            />
            <Button onClick={handleSend} size="icon" aria-label="Send message" disabled={!input.trim() || runAgent.isPending} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shrink-0 h-10 w-10 transition-transform active:scale-95 disabled:opacity-50">
              <Send className="h-4 w-4 ml-0.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
