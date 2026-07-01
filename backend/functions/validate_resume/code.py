#input_type_name: ValidateResumeInput
#output_type_name: ValidateResumeResult
#function_name: validate_resume

from typing import List, Dict, Any
from pydantic import BaseModel
from lemma_sdk import FunctionContext, Pod

class ValidateResumeInput(BaseModel):
    resume_data: Dict[str, Any]

class ValidateResumeResult(BaseModel):
    is_valid: bool
    errors: List[str]
    warnings: List[str]

async def validate_resume(ctx: FunctionContext, data: ValidateResumeInput) -> ValidateResumeResult:
    raw = data.resume_data
    errors = []
    warnings = []
    
    # Required sections
    if not raw.get('skills'):
        errors.append("Missing required section: Skills")
    if not raw.get('education'):
        errors.append("Missing required section: Education")
    if not raw.get('experience'):
        warnings.append("Missing section: Experience (recommended for most roles)")
        
    # Duplicate skills
    skills = raw.get('skills', [])
    if isinstance(skills, list):
        skill_counts = {}
        for s in skills:
            if isinstance(s, str):
                s_lower = s.lower().strip()
                skill_counts[s_lower] = skill_counts.get(s_lower, 0) + 1
        duplicates = [s for s, count in skill_counts.items() if count > 1]
        if duplicates:
            warnings.append(f"Duplicate skills detected: {', '.join(duplicates)}")
            
    # Incomplete education
    education = raw.get('education', [])
    if isinstance(education, list):
        for idx, edu in enumerate(education):
            if isinstance(edu, dict):
                if not edu.get('degree') or not edu.get('institution'):
                    errors.append(f"Incomplete education entry at index {idx}: Missing degree or institution")
                    
    # Incomplete experience
    experience = raw.get('experience', [])
    if isinstance(experience, list):
        for idx, exp in enumerate(experience):
            if isinstance(exp, dict):
                if not exp.get('title') or not exp.get('company'):
                    errors.append(f"Incomplete experience entry at index {idx}: Missing title or company")

    is_valid = len(errors) == 0
    return ValidateResumeResult(is_valid=is_valid, errors=errors, warnings=warnings)
