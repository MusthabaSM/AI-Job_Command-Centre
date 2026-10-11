-- Create tables for AI Career OS

CREATE TABLE IF NOT EXISTS public.resumes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    file_path TEXT,
    score INTEGER DEFAULT 0,
    overall_score INTEGER DEFAULT 0,
    parsed_skills TEXT[] DEFAULT '{}',
    extracted_skills TEXT[] DEFAULT '{}',
    experience JSONB DEFAULT '[]',
    education JSONB DEFAULT '[]',
    agent_status TEXT DEFAULT 'pending',
    agent_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
    
);

CREATE TABLE IF NOT EXISTS public.jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    description TEXT,
    match_score INTEGER DEFAULT 0,
    status TEXT DEFAULT 'saved',
    missing_skills TEXT[] DEFAULT '{}',
    location TEXT,
    salary TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
    resume_id UUID REFERENCES public.resumes(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'applied',
    match_score INTEGER DEFAULT 0,
    missing_skills TEXT[] DEFAULT '{}',
    applied_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.interviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE,
    type TEXT,
    date TEXT,
    difficulty TEXT,
    match_score INTEGER DEFAULT 0,
    scheduled_at TIMESTAMPTZ,
    status TEXT DEFAULT 'scheduled',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.career_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    overall_score INTEGER DEFAULT 0,
    resume_score INTEGER DEFAULT 0,
    application_score INTEGER DEFAULT 0,
    interview_score INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.career_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    priority TEXT,
    source TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT,
    type TEXT DEFAULT 'info',
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS (Users can only see and modify their own data)
CREATE POLICY "Users can access their own resumes" ON public.resumes
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can access their own jobs" ON public.jobs
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can access their own applications" ON public.applications
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can access their own interviews" ON public.interviews
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can access their own career scores" ON public.career_scores
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can access their own career tasks" ON public.career_tasks
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can access their own notifications" ON public.notifications
    FOR ALL USING (auth.uid() = user_id);

-- Create storage bucket for resumes
INSERT INTO storage.buckets (id, name, public) VALUES ('resumes', 'resumes', false)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS policies
CREATE POLICY "Users can upload their own resumes" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own resumes" ON storage.objects
    FOR SELECT USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);
