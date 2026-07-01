#input_type_name: CalculateCareerScoreInput
#output_type_name: CalculateCareerScoreResult
#function_name: calculate_career_score

from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
from lemma_sdk import FunctionContext, Pod
import uuid

class CalculateCareerScoreInput(BaseModel):
    user_id: str
    resume_data: Dict[str, Any] = Field(default_factory=dict)
    applications: List[Dict[str, Any]] = Field(default_factory=list)
    interview_progress: List[Dict[str, Any]] = Field(default_factory=list)
    career_tasks: List[Dict[str, Any]] = Field(default_factory=list)

class CalculateCareerScoreResult(BaseModel):
    resume_score: float
    ats_score: float
    interview_readiness: float
    application_health: float
    overall_career_score: float

async def calculate_career_score(ctx: FunctionContext, data: CalculateCareerScoreInput) -> CalculateCareerScoreResult:
    pod = Pod.from_env()
    
    # Deterministic calculation logic
    resume_score = 70.0 + min(len(data.resume_data.get('skills', [])), 15) * 2.0
    ats_score = min(resume_score * 0.95, 100.0)
    
    interview_readiness = 50.0 + min(len(data.interview_progress), 5) * 10.0
    
    app_health = 40.0
    if len(data.applications) > 0:
        active_apps = sum(1 for app in data.applications if app.get('status') != 'rejected')
        app_health = min(40.0 + (active_apps / len(data.applications)) * 60.0, 100.0)
        
    completed_tasks = sum(1 for task in data.career_tasks if task.get('status') == 'completed')
    task_bonus = min(completed_tasks * 2.0, 20.0)
    
    overall = (resume_score * 0.3) + (ats_score * 0.2) + (interview_readiness * 0.25) + (app_health * 0.25) + task_bonus
    overall = min(max(overall, 0.0), 100.0)
    
    # Update career_scores table
    record_id = str(uuid.uuid4())
    pod.table("career_scores").create({
        "id": record_id,
        "resume_id": data.resume_data.get("id", ""),
        "score_type": "overall",
        "score_value": overall,
        "details": {
            "resume_score": resume_score,
            "ats_score": ats_score,
            "interview_readiness": interview_readiness,
            "application_health": app_health
        }
    })
    
    return CalculateCareerScoreResult(
        resume_score=resume_score,
        ats_score=ats_score,
        interview_readiness=interview_readiness,
        application_health=app_health,
        overall_career_score=overall
    )
