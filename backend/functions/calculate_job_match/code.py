#input_type_name: CalculateJobMatchInput
#output_type_name: CalculateJobMatchResult
#function_name: calculate_job_match

from typing import List, Dict, Any, Set
from pydantic import BaseModel
import re
import math
from lemma_sdk import FunctionContext, Pod

class CalculateJobMatchInput(BaseModel):
    resume_data: Dict[str, Any]
    job_data: Dict[str, Any]

class CalculateJobMatchResult(BaseModel):
    match_score: int
    matched_skills: List[str]
    missing_skills: List[str]
    skill_coverage: int
    keyword_coverage: int
    categories: Dict[str, float]
    recommendations: List[str]

STOP_WORDS = {
    "frontend", "backend", "fullstack", "developer", "engineer", "required", 
    "experience", "knowledge", "candidate", "role", "position", "company", 
    "responsible", "looking", "must", "should", "preferred", "years", "plus",
    "understanding", "ability", "working", "team", "environment", "design", "development",
    "skills", "strong", "excellent", "good", "written", "verbal", "communication",
    "software", "application", "applications", "web", "data", "systems", "solutions",
    "business", "requirements", "technical", "support", "management", "project",
    "development", "end", "front", "back", "full", "stack", "user", "interface",
    "building", "creating", "using", "work", "help", "build", "create", "use",
    "part", "join", "our", "we", "are", "you", "will", "be", "with", "and", "or",
    "in", "on", "at", "to", "for", "a", "an", "the", "of", "is", "as", "by",
    "this", "that", "it", "from", "up", "about", "into", "over", "after", "beneath",
    "under", "above", "your"
}

TECH_ALIASES = {
    "reactjs": "React", "react.js": "React", "react": "React",
    "nextjs": "Next.js", "next.js": "Next.js", "next": "Next.js",
    "nodejs": "Node.js", "node.js": "Node.js", "node": "Node.js",
    "javascript": "JavaScript", "js": "JavaScript",
    "typescript": "TypeScript", "ts": "TypeScript",
    "mongo": "MongoDB", "mongodb": "MongoDB",
    "expressjs": "Express.js", "express.js": "Express.js", "express": "Express.js",
    "postgres": "PostgreSQL", "postgresql": "PostgreSQL", "psql": "PostgreSQL",
    "aws": "AWS", "amazon web services": "AWS",
    "gcp": "GCP", "google cloud": "GCP", "google cloud platform": "GCP",
    "azure": "Azure", "microsoft azure": "Azure",
    "docker": "Docker", "kubernetes": "Kubernetes", "k8s": "Kubernetes",
    "python": "Python", "java": "Java", "c++": "C++", "c#": "C#",
    "ruby": "Ruby", "php": "PHP", "go": "Go", "golang": "Go",
    "rust": "Rust", "swift": "Swift", "kotlin": "Kotlin",
    "html": "HTML", "html5": "HTML", "css": "CSS", "css3": "CSS",
    "sass": "Sass", "less": "LESS",
    "tailwind": "Tailwind CSS", "tailwindcss": "Tailwind CSS",
    "bootstrap": "Bootstrap", "vue": "Vue.js", "vuejs": "Vue.js", "vue.js": "Vue.js",
    "angular": "Angular", "angularjs": "Angular",
    "django": "Django", "flask": "Flask", "spring": "Spring", "spring boot": "Spring Boot",
    "mysql": "MySQL", "redis": "Redis", "elasticsearch": "Elasticsearch",
    "graphql": "GraphQL", "rest": "REST APIs", "api": "REST APIs", "apis": "REST APIs",
    "git": "Git", "github": "GitHub", "gitlab": "GitLab",
    "ci/cd": "CI/CD", "jenkins": "Jenkins", "github actions": "GitHub Actions",
    "linux": "Linux", "unix": "Unix", "agile": "Agile", "scrum": "Scrum",
    "machine learning": "Machine Learning", "ml": "Machine Learning",
    "artificial intelligence": "AI", "ai": "AI"
}

CATEGORIES = {
    "Programming Languages": ["JavaScript", "TypeScript", "Python", "Java", "C++", "C#", "Ruby", "PHP", "Go", "Rust", "Swift", "Kotlin"],
    "Frontend": ["React", "Next.js", "HTML", "CSS", "Sass", "LESS", "Tailwind CSS", "Bootstrap", "Vue.js", "Angular"],
    "Backend": ["Node.js", "Express.js", "Django", "Flask", "Spring", "Spring Boot", "REST APIs", "GraphQL"],
    "Database": ["MongoDB", "PostgreSQL", "MySQL", "Redis", "Elasticsearch"],
    "Cloud": ["AWS", "GCP", "Azure"],
    "DevOps": ["Docker", "Kubernetes", "Git", "GitHub", "GitLab", "CI/CD", "Jenkins", "GitHub Actions", "Linux", "Unix"],
    "AI/ML": ["Machine Learning", "AI"],
    "Methodologies": ["Agile", "Scrum"]
}

def normalize_skill(skill_str: str) -> List[str]:
    clean = re.sub(r'[(),;!|]', ' ', skill_str.lower())
    clean = clean.strip('.').strip()
    
    if '/' in clean and clean not in TECH_ALIASES:
        res = []
        for part in clean.split('/'):
            res.extend(normalize_skill(part))
        return res
        
    if clean in TECH_ALIASES:
        return [TECH_ALIASES[clean]]
    
    if len(clean) > 2 and clean not in STOP_WORDS and not clean.isnumeric():
        return [clean.title() if clean.isalpha() else clean]
    return []

def extract_skills_from_text(text: str) -> List[str]:
    words = re.findall(r'[a-zA-Z0-9.#+-]+', text.lower())
    skills = set()
    
    i = 0
    while i < len(words):
        if i < len(words) - 2:
            phrase = f"{words[i]} {words[i+1]} {words[i+2]}"
            if phrase in TECH_ALIASES:
                skills.add(TECH_ALIASES[phrase])
                i += 3
                continue
        if i < len(words) - 1:
            phrase = f"{words[i]} {words[i+1]}"
            if phrase in TECH_ALIASES:
                skills.add(TECH_ALIASES[phrase])
                i += 2
                continue
        
        word = words[i].rstrip('.,;:')
        if word in TECH_ALIASES:
            skills.add(TECH_ALIASES[word])
        elif word not in STOP_WORDS and len(word) > 2 and not word.isnumeric():
            pass 
        i += 1
        
    return list(skills)

def extract_strings(item):
    if isinstance(item, str):
        return [item]
    elif isinstance(item, list):
        res = []
        for i in item:
            res.extend(extract_strings(i))
        return res
    elif isinstance(item, dict):
        res = []
        for v in item.values():
            res.extend(extract_strings(v))
        return res
    return []

async def calculate_job_match(ctx: FunctionContext, data: CalculateJobMatchInput) -> CalculateJobMatchResult:
    # --- RESUME SKILLS ---
    raw_resume_skills = data.resume_data.get('extracted_skills') or data.resume_data.get('parsed_skills') or data.resume_data.get('skills', [])
    if isinstance(raw_resume_skills, str):
        import json
        try:
            raw_resume_skills = json.loads(raw_resume_skills)
        except Exception:
            raw_resume_skills = [raw_resume_skills]
    elif isinstance(raw_resume_skills, dict):
        raw_resume_skills = list(raw_resume_skills.values())
    elif not isinstance(raw_resume_skills, list):
        raw_resume_skills = []
    
    flat_resume_skills = extract_strings(raw_resume_skills)
    resume_skills_set = set()
    for s in flat_resume_skills:
        for ns in normalize_skill(s):
            resume_skills_set.add(ns.lower())
    
    # --- JOB SKILLS ---
    raw_job_reqs = data.job_data.get('required_skills', []) or data.job_data.get('description', '')
    job_reqs_set = set()
    
    if isinstance(raw_job_reqs, str):
        extracted = extract_skills_from_text(raw_job_reqs)
        for s in extracted:
            job_reqs_set.add(s.lower())
    else:
        flat_job_reqs = extract_strings(raw_job_reqs)
        for s in flat_job_reqs:
            for ns in normalize_skill(s):
                job_reqs_set.add(ns.lower())
    
    # Matching
    matched = [req for req in job_reqs_set if req in resume_skills_set]
    missing_lower = [req for req in job_reqs_set if req not in resume_skills_set]
    
    # Restore casing
    def restore_case(skill_lower: str) -> str:
        for k, v in TECH_ALIASES.items():
            if v.lower() == skill_lower:
                return v
        return skill_lower.title()
    
    missing_skills = [restore_case(s) for s in missing_lower]
    matched_skills = [restore_case(s) for s in matched]
    
    # Categorization for Radar Chart
    category_scores = {}
    for cat, skills in CATEGORIES.items():
        cat_reqs = [s for s in job_reqs_set if restore_case(s) in skills]
        if not cat_reqs:
            category_scores[cat] = 100.0 if not missing_skills else 50.0  # default baseline
            continue
        
        cat_matched = [s for s in cat_reqs if s in matched]
        category_scores[cat] = (len(cat_matched) / len(cat_reqs)) * 100.0

    if len(job_reqs_set) == 0:
        coverage = 100.0 if len(resume_skills_set) > 0 else 0.0
    else:
        coverage = (len(matched) / len(job_reqs_set)) * 100.0
    
    match_score = int(round(coverage))
    
    recommendations = []
    for skill in missing_skills[:3]:
        recommendations.append(f"Learn {skill}")
    if len(missing_skills) > 3:
        recommendations.append("Build a project using missing technologies")
    if not missing_skills:
        recommendations.append("Your skills match perfectly! Apply now.")

    return CalculateJobMatchResult(
        match_score=match_score,
        matched_skills=matched_skills,
        missing_skills=missing_skills,
        skill_coverage=int(round(coverage)),
        keyword_coverage=int(round(coverage)),
        categories=category_scores,
        recommendations=recommendations
    )
