#input_type_name: NormalizeResumeInput
#output_type_name: NormalizeResumeResult
#function_name: normalize_resume

from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from lemma_sdk import FunctionContext, Pod

class NormalizeResumeInput(BaseModel):
    raw_data: Dict[str, Any]

class NormalizeResumeResult(BaseModel):
    normalized_data: Dict[str, Any]

async def normalize_resume(ctx: FunctionContext, data: NormalizeResumeInput) -> NormalizeResumeResult:
    raw = data.raw_data
    normalized = {}
    
    # Normalize skills
    skills = raw.get('skills', [])
    if isinstance(skills, str):
        skills = [s.strip() for s in skills.split(',') if s.strip()]
    normalized['skills'] = list(set([s.title() for s in skills if isinstance(s, str)]))
    
    # Normalize education
    education = raw.get('education', [])
    if isinstance(education, list):
        normalized['education'] = [
            {
                "degree": str(edu.get('degree', '')).title(),
                "institution": str(edu.get('institution', '')).title(),
                "year": str(edu.get('year', ''))
            } for edu in education if isinstance(edu, dict)
        ]
    else:
        normalized['education'] = []
        
    # Normalize certifications
    certs = raw.get('certifications', [])
    if isinstance(certs, list):
        normalized['certifications'] = [
            str(c).title() if isinstance(c, str) else c.get('name', '').title()
            for c in certs
        ]
    else:
        normalized['certifications'] = []
        
    # Normalize projects
    projects = raw.get('projects', [])
    if isinstance(projects, list):
        normalized['projects'] = [
            {
                "name": str(p.get('name', '')).title(),
                "description": str(p.get('description', ''))
            } for p in projects if isinstance(p, dict)
        ]
    else:
        normalized['projects'] = []
        
    # Normalize experience
    experience = raw.get('experience', [])
    if isinstance(experience, list):
        normalized['experience'] = [
            {
                "title": str(exp.get('title', '')).title(),
                "company": str(exp.get('company', '')).title(),
                "duration": str(exp.get('duration', ''))
            } for exp in experience if isinstance(exp, dict)
        ]
    else:
        normalized['experience'] = []

    return NormalizeResumeResult(normalized_data=normalized)
