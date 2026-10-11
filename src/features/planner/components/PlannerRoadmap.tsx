import { useState } from "react";
import { SectionCard } from "@/components/shared/Cards";
import { Button } from "@/components/ui/button";
import { 
  ArrowUpRight, 
  Clock, 
  AlertCircle, 
  Target, 
  Sparkles, 
  CheckCircle2, 
  RefreshCcw, 
  BookOpen, 
  Lightbulb, 
  Bot, 
  X,
  ChevronRight
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useGenerateRoadmapTasks, useToggleCareerTask } from "@/lib/firebase/queries";

interface TaskItemProps {
  id: string;
  title: string;
  priority?: string;
  difficulty?: string;
  impact?: string;
  time?: string;
  category?: string;
  completed?: boolean;
  onOpenModal: (task: any) => void;
  onToggle: (id: string, currentStatus: boolean, e: React.MouseEvent) => void;
}

function getTaskActionPlan(task: any) {
  const title = (task?.title || "").toLowerCase();
  
  if (title.includes("kafka") || title.includes("stream") || title.includes("event")) {
    return {
      overview: "Integrate Apache Kafka event streaming to handle real-time code analysis jobs, decoupling workloads and proving large-scale distributed systems capabilities.",
      steps: [
        {
          step: 1,
          title: "Architecture & Core Concepts",
          desc: "Master topics, partitions, consumer groups, offset commits, and broker cluster topology."
        },
        {
          step: 2,
          title: "Hands-on Integration in CodePulse AI",
          desc: "Spin up Kafka & Zookeeper via Docker. Build an event producer in your service to stream code repository analysis tasks."
        },
        {
          step: 3,
          title: "Consumer Groups & Fault Resilience",
          desc: "Implement a worker consumer group with manual offset commits, retry topics, and dead-letter queue (DLQ) handling."
        },
        {
          step: 4,
          title: "Benchmark & Portfolio Documentation",
          desc: "Measure throughput (events/sec) vs existing Redis queues and document latency reductions in your README."
        }
      ],
      keywords: ["Event Streaming", "Consumer Groups", "Offset Commits", "At-Least-Once Delivery", "Idempotency", "DLQ"]
    };
  }

  if (title.includes("leetcode") || title.includes("algorithm") || title.includes("tree") || title.includes("graph") || title.includes("dp")) {
    return {
      overview: "Sharpen algorithmic speed and articulate Big-O trade-offs for technical screening rounds at LinkedIn and top tech companies.",
      steps: [
        {
          step: 1,
          title: "Pattern Identification Drill",
          desc: "Master Two Pointers, BFS/DFS tree traversals, Binary Search variations, and top-down memoization."
        },
        {
          step: 2,
          title: "Solve 15 Curated Mediums",
          desc: "Complete 5 Binary Tree/Graph problems, 5 Dynamic Programming (0/1 Knapsack, Coin Change), and 5 Array/String manipulation questions."
        },
        {
          step: 3,
          title: "Articulate Complexity Out Loud",
          desc: "Practice walking through Time Complexity (O(N), O(log N)) and Auxiliary Space before writing code."
        },
        {
          step: 4,
          title: "Timed Mock Interview Simulation",
          desc: "Solve 2 unseen Medium problems within a strict 45-minute timer without referencing external hints."
        }
      ],
      keywords: ["Time Complexity (Big-O)", "Space Complexity", "Binary Trees", "DFS/BFS", "Dynamic Programming", "Edge Cases"]
    };
  }

  if (title.includes("resume") || title.includes("metrics") || title.includes("polish")) {
    return {
      overview: "Refine your resume bullets with quantified impact metrics and aligned ATS keywords to stand out to LinkedIn recruiters.",
      steps: [
        {
          step: 1,
          title: "Convert Bullets to Google XYZ Format",
          desc: "Reframe bullets: 'Accomplished [X] as measured by [Y] by doing [Z]'. (e.g. 'Reduced AST parsing latency by 40% using Redis caching')."
        },
        {
          step: 2,
          title: "Incorporate Target Role Keywords",
          desc: "Ensure keywords like Distributed Systems, Microservices, CI/CD, and Cloud Architecture are organically integrated."
        },
        {
          step: 3,
          title: "Format for ATS Parsers",
          desc: "Use clean single-column structure, standard section headings, and explicit graduation dates."
        },
        {
          step: 4,
          title: "Run Verification Scan",
          desc: "Re-upload the revised resume to the Resume Analyzer to confirm ATS Match score exceeds 85%."
        }
      ],
      keywords: ["Quantified Impact", "XYZ Formula", "ATS Optimization", "Action Verbs", "Distributed Architecture"]
    };
  }

  if (title.includes("redis") || title.includes("caching") || title.includes("architecture") || title.includes("system design")) {
    return {
      overview: "Deep dive into low-latency distributed caching, message queues, and high-availability microservices architecture.",
      steps: [
        {
          step: 1,
          title: "Caching Topologies & Patterns",
          desc: "Compare Cache-Aside vs Write-Through vs Write-Back. Study cache invalidation strategies and eviction policies (LRU/LFU)."
        },
        {
          step: 2,
          title: "Redis Pub/Sub vs Message Queues",
          desc: "Understand trade-offs: Ephemeral Redis Pub/Sub vs persistent Kafka/RabbitMQ event streams."
        },
        {
          step: 3,
          title: "End-to-End System Design Blueprint",
          desc: "Diagram client request flow -> API Gateway -> Distributed Cache -> DB write replica with failover."
        },
        {
          step: 4,
          title: "Practice Architectural Defense",
          desc: "Prepare to answer trade-off questions: CAP theorem choices, cache thundering herd prevention, and data consistency."
        }
      ],
      keywords: ["Cache-Aside", "Cache Invalidation", "CAP Theorem", "Redis Pub/Sub", "Data Consistency", "Microservices"]
    };
  }

  if (title.includes("aws") || title.includes("cloud") || title.includes("docker") || title.includes("devops")) {
    return {
      overview: "Gain hands-on proficiency with cloud infrastructure, containerization, and automated CI/CD deployment pipelines.",
      steps: [
        {
          step: 1,
          title: "Core Services Mastery",
          desc: "Review AWS ECS/EKS container workflows, S3 event triggers, API Gateway routing, and DynamoDB/RDS databases."
        },
        {
          step: 2,
          title: "Containerize & Deploy Services",
          desc: "Write multi-stage Dockerfiles for frontend and backend microservices with minimal image footprint."
        },
        {
          step: 3,
          title: "IAM Security & Secret Management",
          desc: "Configure role-based access policies and environment variable secret rotation."
        },
        {
          step: 4,
          title: "Cost & Scalability Optimization",
          desc: "Learn auto-scaling trigger policies, health check alarms, and CloudWatch monitoring basics."
        }
      ],
      keywords: ["AWS ECS/EKS", "Docker", "CI/CD Pipelines", "IAM Policies", "CloudWatch", "Microservice Deployment"]
    };
  }

  // Generic technical fallback
  return {
    overview: "Actionable strategy to master this technical milestone and boost your hireability for target software engineering roles.",
    steps: [
      {
        step: 1,
        title: "Theoretical Foundation",
        desc: "Review key documentation, core principles, and architectural trade-offs."
      },
      {
        step: 2,
        title: "Practical Implementation",
        desc: "Build a proof-of-concept module integrating this technology into one of your portfolio projects."
      },
      {
        step: 3,
        title: "Validation & Testing",
        desc: "Write unit and integration tests covering edge cases and performance boundaries."
      },
      {
        step: 4,
        title: "Interview Storytelling",
        desc: "Prepare a concise 2-minute STAR response explaining why and how you applied this technology."
      }
    ],
    keywords: ["Architecture", "Production Ready", "Edge Cases", "Scalability", "Clean Code"]
  };
}

const RoadmapItem = ({ 
  id, 
  title, 
  priority, 
  difficulty, 
  impact, 
  time, 
  category, 
  completed, 
  onOpenModal, 
  onToggle 
}: TaskItemProps) => {
  const isCritical = priority?.toLowerCase() === "critical";
  const isHigh = priority?.toLowerCase() === "high";

  return (
    <div 
      onClick={() => onOpenModal({ id, title, priority, difficulty, impact, time, category, completed })}
      className={`group flex flex-col sm:flex-row sm:items-center justify-between p-4.5 border rounded-xl bg-background shadow-sm hover:border-indigo-500/40 hover:shadow-md transition-all duration-300 cursor-pointer ${
        completed ? "opacity-60 bg-muted/10 border-border/60" : "border-border hover:bg-muted/10"
      }`}
    >
      <div className="mb-4 sm:mb-0 min-w-0 pr-4 flex-1">
        <div className="flex items-start sm:items-center gap-2.5 mb-1.5 min-w-0">
          <button 
            onClick={(e) => onToggle(id, !!completed, e)}
            className="mt-0.5 sm:mt-0 text-muted-foreground hover:text-emerald-500 transition-colors shrink-0"
            title={completed ? "Mark incomplete" : "Mark completed"}
          >
            <CheckCircle2 className={`h-4.5 w-4.5 ${completed ? "text-emerald-500 fill-emerald-500/20" : "opacity-40"}`} />
          </button>
          <h4 className={`font-semibold text-sm truncate min-w-0 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors ${
            completed ? "line-through text-muted-foreground" : "text-foreground"
          }`}>
            {title}
          </h4>
          {isCritical && <AlertCircle className="h-3.5 w-3.5 text-rose-500 animate-pulse shrink-0" />}
          {isHigh && <AlertCircle className="h-3.5 w-3.5 text-amber-500 shrink-0" />}
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3 text-xs text-muted-foreground mt-2 font-medium pl-7">
          <span className="flex items-center text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-md border border-emerald-500/20 whitespace-nowrap">
            <ArrowUpRight className="h-3 w-3 mr-1 shrink-0" /> +{impact || "10"}% Impact
          </span>
          <span className="flex items-center whitespace-nowrap">
            <Clock className="h-3 w-3 mr-1 opacity-70 shrink-0" /> {time || "1 hour"}
          </span>
          <span className="flex items-center opacity-80 whitespace-nowrap">
            Diff: {difficulty || "Medium"}
          </span>
          {category && (
            <span className="hidden md:inline-flex items-center px-1.5 py-0.5 rounded bg-muted text-[11px] text-muted-foreground">
              {category}
            </span>
          )}
        </div>
      </div>
      <div className="shrink-0 flex items-center gap-2">
        <Button 
          size="sm" 
          variant={completed ? "outline" : "default"}
          onClick={(e) => {
            e.stopPropagation();
            onOpenModal({ id, title, priority, difficulty, impact, time, category, completed });
          }}
          className={`shrink-0 rounded-lg text-xs font-medium transition-all ${
            completed 
              ? "border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10" 
              : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-500/20"
          }`}
        >
          {completed ? (
            <span className="flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5" /> Completed</span>
          ) : (
            <span className="flex items-center gap-1">Action Plan <ChevronRight className="h-3.5 w-3.5" /></span>
          )}
        </Button>
      </div>
    </div>
  );
};

export function PlannerRoadmap({ tasks = [] }: { tasks?: any[] }) {
  const navigate = useNavigate();
  const generateRoadmap = useGenerateRoadmapTasks();
  const toggleTask = useToggleCareerTask();
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any | null>(null);

  const handleOpenModal = (task: any) => {
    setSelectedTask(task);
  };

  const handleCloseModal = () => {
    setSelectedTask(null);
  };

  const handleToggleTask = (id: string, currentCompleted: boolean, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    toggleTask.mutate({ taskId: id, completed: !currentCompleted });
    
    // Update local modal state if open
    if (selectedTask && selectedTask.id === id) {
      setSelectedTask((prev: any) => ({ ...prev, completed: !currentCompleted }));
    }
    toast.success(currentCompleted ? "Task marked active" : "🎉 Milestone completed! +Hireability score added.");
  };

  const handleAskAICoach = (task: any) => {
    const prompt = `I'm working on this career roadmap task: "${task.title}".
Priority: ${task.priority || 'High'} | Estimated time: ${task.time || '2 hours'}.
Please act as my senior engineering mentor and guide me:
1. Provide a concrete, production-grade technical walkthrough or code example.
2. What are the top 3 interview questions LinkedIn recruiters ask about this topic?
3. How should I explain this achievement on my resume and in technical screens?`;

    localStorage.setItem("pending_task_prompt", prompt);
    toast.info(`Connecting with AI Career Coach for "${task.title.slice(0, 30)}..."`);
    setSelectedTask(null);
    navigate({ to: "/workspace" });
  };

  const handleGenerateRoadmap = async () => {
    setIsGenerating(true);
    try {
      await generateRoadmap.mutateAsync();
      toast.success("Strategic roadmap generated! Tasks tailored to your analyzed roles.");
    } catch (err: any) {
      toast.error("Failed to generate roadmap: " + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const immediate = tasks.filter(t => t.priority?.toLowerCase() === "critical" || t.priority?.toLowerCase() === "high");
  const thisWeek = tasks.filter(t => t.priority?.toLowerCase() === "medium");
  const longTerm = tasks.filter(t => t.priority?.toLowerCase() === "low" || !t.priority);

  const modalPlan = selectedTask ? getTaskActionPlan(selectedTask) : null;

  return (
    <>
      <SectionCard 
        title="AI Strategic Roadmap" 
        description="Your personalized path to maximum hireability." 
        className="col-span-full xl:col-span-2"
        action={
          <Button
            size="sm"
            variant="outline"
            onClick={handleGenerateRoadmap}
            disabled={isGenerating}
            className="text-xs flex items-center gap-1.5 border-indigo-500/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/10"
          >
            {isGenerating ? (
              <RefreshCcw className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
            )}
            {tasks.length === 0 ? "Generate Roadmap" : "Sync with AI"}
          </Button>
        }
      >
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[300px] border border-dashed border-border bg-muted/5 rounded-xl p-8 sm:p-12 text-center mt-4">
            <div className="p-3 bg-indigo-500/10 rounded-2xl mb-4 border border-indigo-500/20">
              <Target className="h-8 w-8 text-indigo-500" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">Generate Your Strategic Roadmap</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
              AI combines your uploaded resume and target job requirements to generate actionable, prioritized career milestones.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button 
                onClick={handleGenerateRoadmap}
                disabled={isGenerating}
                className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm flex items-center gap-2"
              >
                {isGenerating ? <RefreshCcw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                Generate Roadmap Now
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate({ to: "/jobs" })}
              >
                Analyze Target Job
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6 mt-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 ml-1 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-rose-500 inline-block"></span>
                Immediate (Today)
              </h3>
              <div className="space-y-3">
                {immediate.length > 0 ? immediate.map(t => (
                  <RoadmapItem 
                    key={t.id} 
                    id={t.id}
                    title={t.title} 
                    priority={t.priority} 
                    impact={t.impact || "12"} 
                    time={t.time || "2 hours"} 
                    difficulty={t.difficulty || "Hard"} 
                    category={t.category}
                    completed={t.completed}
                    onOpenModal={handleOpenModal}
                    onToggle={handleToggleTask}
                  />
                )) : <p className="text-sm text-muted-foreground pl-1">No immediate tasks.</p>}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 ml-1 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-indigo-500 inline-block"></span>
                This Week
              </h3>
              <div className="space-y-3">
                {thisWeek.length > 0 ? thisWeek.map(t => (
                  <RoadmapItem 
                    key={t.id} 
                    id={t.id}
                    title={t.title} 
                    priority={t.priority} 
                    impact={t.impact || "8"} 
                    time={t.time || "4 hours"} 
                    difficulty={t.difficulty || "Medium"} 
                    category={t.category}
                    completed={t.completed}
                    onOpenModal={handleOpenModal}
                    onToggle={handleToggleTask}
                  />
                )) : <p className="text-sm text-muted-foreground pl-1">No tasks for this week.</p>}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 ml-1 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-slate-400 inline-block"></span>
                Long Term
              </h3>
              <div className="space-y-3">
                {longTerm.length > 0 ? longTerm.map(t => (
                  <RoadmapItem 
                    key={t.id} 
                    id={t.id}
                    title={t.title} 
                    priority={t.priority} 
                    impact={t.impact || "5"} 
                    time={t.time || "1 week"} 
                    difficulty={t.difficulty || "Medium"} 
                    category={t.category}
                    completed={t.completed}
                    onOpenModal={handleOpenModal}
                    onToggle={handleToggleTask}
                  />
                )) : <p className="text-sm text-muted-foreground pl-1">No long-term tasks.</p>}
              </div>
            </div>
          </div>
        )}
      </SectionCard>

      {/* In-Place Task Action Modal */}
      {selectedTask && (
        <Dialog open={!!selectedTask} onOpenChange={(open) => !open && handleCloseModal()}>
          <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto p-6 bg-card border-border shadow-2xl">
            <DialogHeader className="space-y-3 text-left">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                  selectedTask.priority?.toLowerCase() === 'critical'
                    ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                    : selectedTask.priority?.toLowerCase() === 'high'
                    ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                    : "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20"
                }`}>
                  {selectedTask.priority || 'Medium'} Priority
                </span>

                {selectedTask.category && (
                  <span className="text-[10px] font-semibold text-muted-foreground px-2 py-0.5 rounded bg-muted">
                    {selectedTask.category}
                  </span>
                )}

                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 ml-auto">
                  +{selectedTask.impact || '10'}% Hireability Gain
                </span>
              </div>

              <DialogTitle className="text-lg font-bold text-foreground leading-snug">
                {selectedTask.title}
              </DialogTitle>

              <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium pt-1">
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 opacity-70" /> {selectedTask.time || '1-2 hours'}
                </span>
                <span>•</span>
                <span>Difficulty: {selectedTask.difficulty || 'Medium'}</span>
                <span>•</span>
                <span className={selectedTask.completed ? "text-emerald-500 font-semibold" : "text-amber-500"}>
                  {selectedTask.completed ? "Status: Completed" : "Status: In Progress"}
                </span>
              </div>
            </DialogHeader>

            {modalPlan && (
              <div className="space-y-5 my-4">
                {/* Overview box */}
                <div className="p-3.5 rounded-xl bg-indigo-500/5 border border-indigo-500/15 flex items-start gap-3">
                  <Lightbulb className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-foreground/80 leading-relaxed">
                    {modalPlan.overview}
                  </p>
                </div>

                {/* Step-by-Step Action Plan */}
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-bold text-foreground mb-3 flex items-center gap-2">
                    <BookOpen className="h-3.5 w-3.5 text-indigo-500" />
                    Step-by-Step Action Plan
                  </h4>
                  <div className="space-y-2.5">
                    {modalPlan.steps.map((s: any) => (
                      <div 
                        key={s.step} 
                        className="p-3 rounded-lg border border-border bg-background/50 hover:bg-muted/15 transition-colors flex items-start gap-3"
                      >
                        <span className="h-5 w-5 rounded-full bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {s.step}
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-foreground mb-0.5">{s.title}</p>
                          <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Keywords / Interview concepts */}
                <div>
                  <h4 className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground mb-2 flex items-center gap-1.5">
                    <Target className="h-3 w-3 text-emerald-500" />
                    Key Concepts for Technical Interviews
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {modalPlan.keywords.map((kw: string, i: number) => (
                      <span 
                        key={i} 
                        className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-muted text-foreground border border-border/60"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <DialogFooter className="flex-col sm:flex-row gap-2 pt-2 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAskAICoach(selectedTask)}
                className="w-full sm:w-auto text-xs flex items-center gap-1.5 border-indigo-500/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/10"
              >
                <Bot className="h-3.5 w-3.5 text-indigo-500" />
                Ask AI Coach About This
              </Button>

              <Button
                size="sm"
                onClick={() => handleToggleTask(selectedTask.id, !!selectedTask.completed)}
                className={`w-full sm:w-auto text-xs flex items-center gap-1.5 ${
                  selectedTask.completed
                    ? "bg-muted text-foreground hover:bg-muted/80"
                    : "bg-emerald-600 hover:bg-emerald-700 text-white"
                }`}
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                {selectedTask.completed ? "Mark Incomplete" : "Mark as Completed"}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleCloseModal}
                className="w-full sm:w-auto text-xs"
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

