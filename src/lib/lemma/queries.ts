import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { lemmaClient, demoState } from './client';

// ============================================================================
// MOCK DATA (JUDGE MODE) — Coherent Career Story
// Persona: Arjun Patel, Full-Stack Developer at a startup.
// Goal: Land a Senior Frontend Engineer role at TechCorp.
// Story: Resume uploaded → AI analyzed (85/100) → Job matched (92%) →
//        Application submitted → Interview scheduled → Career plan generated.
// ============================================================================

const demoResumes = [
  {
    id: 'res-1',
    title: 'Arjun_Patel_Resume_v3.pdf',
    score: 85,
    overall_score: 85,
    parsed_skills: ['React', 'TypeScript', 'Node.js', 'Next.js', 'PostgreSQL', 'Docker', 'AWS', 'GraphQL'],
    extracted_skills: ['React', 'TypeScript', 'Node.js', 'Next.js', 'PostgreSQL', 'Docker', 'AWS', 'GraphQL'],
    experience: [
      { company: 'LaunchPad Inc.', role: 'Full-Stack Developer', duration: '2022 – Present', highlights: ['Built customer dashboard serving 50k+ users', 'Reduced API latency by 40% with caching layer'] },
      { company: 'CodeBridge Solutions', role: 'Frontend Developer', duration: '2020 – 2022', highlights: ['Led migration from CRA to Next.js', 'Implemented design system used across 3 products'] }
    ],
    education: [{ school: 'University of Mumbai', degree: 'B.Tech Computer Science', year: '2020' }],
    agent_status: 'completed',
    agent_notes: 'Strong frontend profile. Recommend highlighting system design experience for senior roles.',
    created_at: '2025-06-28T10:00:00Z'
  },
  {
    id: 'res-2',
    title: 'Arjun_Patel_Resume_v2.pdf',
    score: 72,
    overall_score: 72,
    parsed_skills: ['React', 'JavaScript', 'Node.js', 'CSS', 'MongoDB'],
    extracted_skills: ['React', 'JavaScript', 'Node.js', 'CSS', 'MongoDB'],
    experience: [],
    education: [],
    agent_status: 'completed',
    agent_notes: 'Previous version. Missing TypeScript and cloud experience.',
    created_at: '2025-06-15T10:00:00Z'
  }
];

const demoJobs = [
  { id: 'job-1', title: 'Senior Frontend Engineer', company: 'TechCorp', match_score: 92, status: 'Applied', description: 'Lead frontend architecture for enterprise SaaS platform. Requires React, TypeScript, Next.js, and system design experience.', missing_skills: ['Kubernetes', 'Terraform'], location: 'Remote', salary: '$180k–$220k' },
  { id: 'job-2', title: 'Staff Software Engineer', company: 'GlobalScale', match_score: 78, status: 'Saved', description: 'Full-stack role focused on distributed systems. Requires Go, React, and infrastructure experience.', missing_skills: ['Go', 'gRPC', 'Distributed Systems'], location: 'San Francisco', salary: '$200k–$260k' },
  { id: 'job-3', title: 'Frontend Lead', company: 'NovaPay', match_score: 88, status: 'Saved', description: 'Build the next-gen fintech dashboard. Requires React, TypeScript, and accessibility expertise.', missing_skills: ['WCAG 2.1', 'Storybook'], location: 'New York', salary: '$170k–$210k' }
];

const demoApplications = [
  { id: 'app-1', job_id: 'job-1', company: 'TechCorp', position: 'Senior Frontend Engineer', status: 'Technical Interview', match_score: 92, applied_date: '2025-06-20', resumeVersion: 'v3', priority: 'high', missing_skills: ['Kubernetes', 'Terraform'] },
  { id: 'app-2', job_id: 'job-3', company: 'NovaPay', position: 'Frontend Lead', status: 'Applied', match_score: 88, applied_date: '2025-06-25', resumeVersion: 'v3', priority: 'medium', missing_skills: ['WCAG 2.1'] },
  { id: 'app-3', job_id: 'job-2', company: 'GlobalScale', position: 'Staff Software Engineer', status: 'Saved', match_score: 78, applied_date: '2025-06-27', resumeVersion: 'v3', priority: 'low', missing_skills: ['Go', 'gRPC'] }
];

const demoInterviews = [
  { id: '1', company: 'TechCorp', role: 'Senior Frontend Engineer', application_id: 'app-1', type: 'System Design', date: 'Tomorrow, 10:00 AM', difficulty: 'Hard', matchScore: 92, scheduled_at: '2025-07-01T10:00:00Z', status: 'Scheduled' },
  { id: '2', company: 'TechCorp', role: 'Senior Frontend Engineer', application_id: 'app-1', type: 'Behavioral', date: 'Tomorrow, 2:00 PM', difficulty: 'Medium', matchScore: 92, scheduled_at: '2025-07-01T14:00:00Z', status: 'Scheduled' },
  { id: '3', company: 'NovaPay', role: 'Frontend Lead', application_id: 'app-2', type: 'Technical Coding', date: 'Thu, 11:00 AM', difficulty: 'Hard', matchScore: 88, scheduled_at: '2025-07-03T11:00:00Z', status: 'Scheduled' }
];

const demoScores = { readiness: 78, resume: 85, ats: 90 };

const demoTasks = [
  { id: 't-1', title: 'Prepare System Design answers for TechCorp interview', completed: false, priority: 'Critical', source: 'Interview scheduled for tomorrow' },
  { id: 't-2', title: 'Learn Kubernetes basics to close skill gap', completed: false, priority: 'High', source: 'Missing from TechCorp JD (92% match)' },
  { id: 't-3', title: 'Update resume with Docker project metrics', completed: false, priority: 'Medium', source: 'AI Resume Analyzer recommendation' },
  { id: 't-4', title: 'Follow up with NovaPay recruiter', completed: false, priority: 'Medium', source: 'Application status: Applied (5 days ago)' }
];

// ============================================================================
// TYPED SERVICE HOOKS (PRODUCTION / LEMMA INTEGRATION)
// ============================================================================

export const useResumes = (options?: { refetchInterval?: number | ((query: any) => number | false) }) => {
  return useQuery({
    queryKey: ['resumes'],
    queryFn: async () => {
      if (demoState.enabled) return demoResumes;
      const response = await lemmaClient.records.list('resumes');
      return response.items;
    },
    refetchInterval: options?.refetchInterval ?? 5000,
    ...options
  });
};

export const useJobs = () => {
  return useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      if (demoState.enabled) return demoJobs;
      const response = await lemmaClient.records.list('jobs');
      return response.items;
    },
    refetchInterval: 5000,
  });
};

const mapStatusToUI = (status: string) => {
  if (!status) return 'Saved';
  const mapping: Record<string, string> = {
    'saved': 'Saved',
    'applied': 'Applied',
    'online_assessment': 'Online Assessment',
    'interview': 'Technical Interview',
    'hr_round': 'HR Interview',
    'offered': 'Offer',
    'rejected': 'Rejected'
  };
  return mapping[status.toLowerCase()] || 'Saved';
};

const mapStatusToBackend = (status: string) => {
  if (!status) return 'saved';
  const mapping: Record<string, string> = {
    'Saved': 'saved',
    'Applied': 'applied',
    'Online Assessment': 'online_assessment',
    'Technical Interview': 'interview',
    'HR Interview': 'hr_round',
    'Offer': 'offered',
    'Rejected': 'rejected'
  };
  return mapping[status] || 'saved';
};

export const useApplications = () => {
  return useQuery({
    queryKey: ['applications'],
    queryFn: async () => {
      if (demoState.enabled) return demoApplications;
      
      // Fetch both applications and jobs to join them
      const appsRes = await lemmaClient.records.list('applications');
      const jobsRes = await lemmaClient.records.list('jobs');
      
      const jobsMap = new Map(jobsRes.items.map((j: any) => [j.id, j]));
      
      return appsRes.items.map((app: any) => {
        const job = jobsMap.get(app.job_id);
        return {
          ...app,
          company: job?.company || 'Unknown Company',
          position: job?.title || job?.role || 'Unknown Position',
          status: mapStatusToUI(app.status),
          matchScore: app.match_score || 0
        };
      });
    },
    refetchInterval: 5000,
  });
};

export const useInterviews = () => {
  return useQuery({
    queryKey: ['interviews'],
    queryFn: async () => {
      if (demoState.enabled) {
        return demoInterviews;
      }
      const records = await lemmaClient.records.list('interviews');
      return records.items;
    },
    refetchInterval: 5000,
  });
};

export const useCareerScores = () => {
  return useQuery({
    queryKey: ['career_scores'],
    queryFn: async () => {
      if (demoState.enabled) return demoScores;
      const response = await lemmaClient.records.list('career_scores');
      if (response.items && response.items.length > 0) {
        const row = response.items[0];
        return {
          readiness: row.overall_score || 0,
          resume: row.resume_score || 0,
          ats: row.application_score || 0,
          interview: row.interview_score || 0,
          raw: row
        };
      }
      return { readiness: 0, resume: 0, ats: 0 };
    },
    refetchInterval: 5000,
  });
};

export const useCareerTasks = () => {
  return useQuery({
    queryKey: ['career_tasks'],
    queryFn: async () => {
      if (demoState.enabled) return demoTasks;
      const response = await lemmaClient.records.list('career_tasks');
      return response.items;
    },
  });
};

export const useNotifications = () => {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      if (demoState.enabled) {
        return [
          { id: 'n-1', title: 'Interview Confirmed', message: 'TechCorp System Design interview confirmed for tomorrow at 10:00 AM.', type: 'success', created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), read: false },
          { id: 'n-2', title: 'Resume Score Updated', message: 'Your resume score improved from 72 to 85 after v3 optimizations.', type: 'info', created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), read: false },
          { id: 'n-3', title: 'New Skill Gap Detected', message: 'Kubernetes identified as missing skill for TechCorp role.', type: 'warning', created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), read: true },
          { id: 'n-4', title: 'Application Submitted', message: 'Your application to NovaPay (Frontend Lead) was submitted successfully.', type: 'success', created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), read: true },
          { id: 'n-5', title: 'Career Plan Generated', message: 'AI Career Planner created a 4-week roadmap based on your targets.', type: 'info', created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), read: true }
        ];
      }
      const response = await lemmaClient.records.list('notifications');
      return response.items;
    },
  });
};

// ============================================================================
// MUTATIONS & FUNCTIONS
// ============================================================================

export const useDeleteResume = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (resumeId: string) => {
      if (demoState.enabled) {
        return new Promise(resolve => setTimeout(() => resolve({ id: resumeId }), 1000));
      }
      return lemmaClient.records.delete('resumes', resumeId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
      queryClient.invalidateQueries({ queryKey: ['career_scores'] });
    }
  });
};

export const useAnalyzeResume = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (resumeFile: File) => {
      if (demoState.enabled) {
        return new Promise(resolve => setTimeout(() => resolve({ success: true, score: 92 }), 2000));
      }
      
      // 1. Upload file using the SDK
      const uniqueName = `${Date.now()}_${resumeFile.name}`;
      const fileRes = await lemmaClient.files.upload(resumeFile, { directoryPath: '/resumes', name: uniqueName });
      
      // 2. Create the record for the agent to process
      const record = await lemmaClient.records.create('resumes', {
        title: resumeFile.name,
        file_path: fileRes.path,
        agent_status: 'pending'
      });
      
      // 3. Trigger the workflow manually as a reliable fallback
      try {
        await lemmaClient.workflows.runs.create('resume_processing');
      } catch (err) {
        console.error('Failed to trigger resume_processing workflow:', err);
      }
      
      return record;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
      queryClient.invalidateQueries({ queryKey: ['career_scores'] });
    }
  });
};

export const useCalculateJobMatch = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { resume_id: string; job_id: string }) => {
      if (demoState.enabled) {
        return { match_score: 88, missing_skills: ['GraphQL'] };
      }
      const resume = await lemmaClient.records.get('resumes', payload.resume_id);
      const job = await lemmaClient.records.get('jobs', payload.job_id);
      const response = await lemmaClient.functions.run('calculate_job_match', { 
        input: { resume_data: resume, job_data: job }
      });
      return response.output_data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['career_tasks'] });
    }
  });
};

export const useCreateJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { title: string; company: string; description: string }) => {
      if (demoState.enabled) {
        return new Promise(resolve => setTimeout(() => resolve({ id: 'demo-job', ...payload }), 1000));
      }
      const record = await lemmaClient.records.create('jobs', {
        role: payload.title,
        company: payload.company,
        description: payload.description,
        agent_status: 'pending'
      });
      return record;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    }
  });
};

export const useFetchJobUrl = () => {
  return useMutation({
    mutationFn: async (url: string) => {
      if (demoState.enabled) {
        return new Promise(resolve => setTimeout(() => resolve({ 
          title: 'Senior Product Designer', 
          company: 'LinkedIn Demo', 
          description: 'This is a demo description fetched from URL.' 
        }), 1500));
      }
      const response = await lemmaClient.functions.run('fetch_job_url', { 
        input: { url }
      });
      return response.output_data;
    }
  });
};

export const useUpdateApplicationStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      if (demoState.enabled) {
        return new Promise(resolve => setTimeout(() => resolve({ id, status }), 500));
      }
      const backendStatus = mapStatusToBackend(status);
      const record = await lemmaClient.records.update('applications', id, { status: backendStatus });
      return record;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    }
  });
};

export const useRunAgent = () => {
  return useMutation({
    mutationFn: async ({ agentId, input }: { agentId: string; input: string }) => {
      if (demoState.enabled) {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              output: `I am simulating a response as the ${agentId} agent. I've processed your request: "${input}".`
            });
          }, 2000);
        });
      }
      try {
        const conv = await lemmaClient.agents.run(agentId, input) as any;
        
        // Poll for agent reply
        for (let i = 0; i < 20; i++) {
          await new Promise(r => setTimeout(r, 1000));
          const res = await lemmaClient.conversations.messages.list(conv.id);
          const msgs = res.items || [];
          const agentMsg = msgs.find((m: any) => (m.role === 'model' || m.role === 'assistant' || m.role === 'agent') && m.kind === 'TEXT');
          
          if (agentMsg && agentMsg.text) {
            return { output: agentMsg.text };
          }
        }
        
        return { output: "The agent took too long to respond. Please check the logs." };
      } catch (err: any) {
        console.error("Agent error:", err);
        const errorMessage = err.body?.message || err.message || "Unknown error";
        throw new Error(errorMessage);
      }
    }
  });
};

export const useCreateApplication = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { job_id: string; resume_id: string; match_score: number; missing_skills: string[] }) => {
      if (demoState.enabled) {
        return new Promise(resolve => setTimeout(() => resolve({ id: 'demo-app', ...payload }), 1000));
      }
      const record = await lemmaClient.records.create('applications', {
        job_id: payload.job_id,
        resume_id: payload.resume_id,
        status: 'saved',
        match_score: payload.match_score,
        missing_skills: payload.missing_skills,
        agent_status: 'pending'
      });
      return record;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['career_scores'] });
    }
  });
};
