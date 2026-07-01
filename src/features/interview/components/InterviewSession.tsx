"use client";
import React, { useState } from "react";
import { Send, Sparkles, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useRunAgent } from "@/lib/lemma/queries";

export function InterviewSession({ interview }: { interview?: any }) {
  const [input, setInput] = useState("");
  const runAgent = useRunAgent();
  const [messages, setMessages] = useState([
    { id: 1, role: "interviewer", content: `Welcome to your ${interview?.type || 'System Design'} Mock Interview for the ${interview?.role || interview?.position || 'Role'} role at ${interview?.company || 'Company'}. Let's get started!` }
  ]);

  const handleSend = async () => {
    if (!input.trim() || runAgent.isPending) return;
    const userMessage = { id: Date.now(), role: "user", content: input };
    
    // Grab the last 5 messages for history before adding the new one
    const recentHistory = messages.slice(-5).map(m => ({ role: m.role, content: m.content }));
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    
    try {
      const response: any = await runAgent.mutateAsync({ 
        agentId: "interview_coach", 
        input: input,
        contextData: interview,
        history: recentHistory
      });
      setMessages(prev => [...prev, { 
        id: Date.now(), 
        role: "interviewer", 
        content: response.output || "No response received." 
      }]);
    } catch (error: any) {
      setMessages(prev => [...prev, { 
        id: Date.now(), 
        role: "interviewer", 
        content: `Error: ${error.message}` 
      }]);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      
      <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-premium border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 p-2 rounded-xl shadow-sm">
            <Mic className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">{interview?.type || 'System Design'} Interview</h3>
            <p className="text-xs text-muted-foreground">{interview?.company || 'Company'} • Question 1 of 5</p>
          </div>
        </div>
        <div className="flex gap-1.5">
          <div className="h-1.5 w-8 bg-indigo-500 rounded-full shadow-sm shadow-indigo-500/20"></div>
          <div className="h-1.5 w-8 bg-border rounded-full"></div>
          <div className="h-1.5 w-8 bg-border rounded-full"></div>
          <div className="h-1.5 w-8 bg-border rounded-full"></div>
          <div className="h-1.5 w-8 bg-border rounded-full"></div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-6 bg-gradient-to-b from-background to-muted/20">
        <div className="space-y-6 pb-24">
          {messages.map((msg) => (
            <div key={msg.id} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
              {msg.role === "interviewer" && (
                <div className="size-8 rounded-xl bg-card border border-border shadow-sm flex items-center justify-center mr-3 mt-1 shrink-0">
                  <Sparkles className="h-4 w-4 text-indigo-500" />
                </div>
              )}
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
               <div className="size-8 rounded-xl bg-card border border-border shadow-sm flex items-center justify-center mr-3 mt-1 shrink-0">
                  <Sparkles className="h-4 w-4 text-indigo-500 animate-ping opacity-75 absolute" />
                  <Sparkles className="h-4 w-4 text-indigo-500 relative" />
                </div>
              <div className="glass-panel rounded-2xl p-4 rounded-bl-sm flex items-center gap-3 text-sm font-medium text-indigo-600 dark:text-indigo-400">
                Evaluating response and generating follow-up...
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="absolute bottom-4 left-6 right-6">
        <div className="glass-panel rounded-2xl p-3 flex flex-col gap-3 shadow-floating border-indigo-500/20 focus-within:border-indigo-500/50 transition-colors">
          <div className="flex items-center gap-2 px-2">
            <Input 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type your answer... (e.g. 'I would use WebSockets...')" 
              className="border-0 bg-transparent shadow-none focus-visible:ring-0 flex-1 text-base px-0 h-auto py-2" 
            />
            <Button onClick={handleSend} size="icon" aria-label="Send response" disabled={!input.trim() || runAgent.isPending} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shrink-0 h-10 w-10 transition-transform active:scale-95 disabled:opacity-50">
              <Send className="h-4 w-4 ml-0.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
