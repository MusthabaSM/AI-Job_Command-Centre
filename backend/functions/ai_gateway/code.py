#input_type_name: AIGatewayInput
#output_type_name: AIGatewayResult
#function_name: ai_gateway

from typing import List, Dict, Any, Optional
from pydantic import BaseModel
import os
import urllib.request
import urllib.error
import json
import time
from lemma_sdk import FunctionContext, Pod

from prompts import get_system_prompt

class AIGatewayInput(BaseModel):
    action: str
    payload: Dict[str, Any]
    options: Optional[Dict[str, Any]] = None

class AIGatewayResult(BaseModel):
    provider_used: str
    execution_status: str
    processing_time: float
    warnings: List[str]
    parsed_analysis: Optional[Dict[str, Any]] = None

async def ai_gateway(ctx: FunctionContext, data: AIGatewayInput) -> AIGatewayResult:
    start_time = time.time()
    action = data.action
    payload = data.payload
    warnings = []
    
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        if hasattr(ctx, 'secrets'):
            api_key = ctx.secrets.get("GEMINI_API_KEY")
    
    if not api_key:
        return AIGatewayResult(
            provider_used="none",
            execution_status="error: missing_api_key",
            processing_time=time.time() - start_time,
            warnings=["GEMINI_API_KEY is not configured in the backend environment."],
            parsed_analysis=None
        )

    if action == "resume_analysis":
        base64_data = payload.get("base64_data")
        mime_type = payload.get("mime_type", "application/pdf")
        resume_id = payload.get("resume_id")
        
        if not base64_data or not resume_id:
            return AIGatewayResult(
                provider_used="none",
                execution_status="error: invalid_payload",
                processing_time=time.time() - start_time,
                warnings=["Missing base64_data or resume_id in payload."],
                parsed_analysis=None
            )
            
        prompt_text = """
            Analyze this resume and provide a JSON response with exactly this structure:
            {
              "extracted_skills": ["skill1", "skill2", "skill3", "skill4", "skill5"],
              "projects": [{"title": "Project Name", "description": "Project details", "date": "Jan 2020 - Feb 2021"}],
              "education": [{"degree": "BSc Computer Science", "institution": "University Name", "date": "2016 - 2020"}],
              "experience": [{"title": "Software Engineer", "company": "Company Name", "date": "2020 - Present", "description": ["Did X", "Did Y"]}],
              "certifications": ["AWS Certified Solutions Architect"],
              "overall_score": 85
            }
            Extract as much real data from the resume as possible. 
            Do NOT hallucinate. If sections are missing, leave them empty.
        """
        
        gemini_payload = json.dumps({
            "contents": [{
                "parts": [
                    { "inlineData": { "mimeType": mime_type, "data": base64_data } },
                    { "text": prompt_text }
                ]
            }],
            "generationConfig": {
                "responseMimeType": "application/json"
            }
        }).encode('utf-8')
        
        models_to_try = [
            'gemini-1.5-flash-latest',
            'gemini-1.5-pro-latest',
            'gemini-2.5-flash',
            'gemini-2.0-flash',
            'gemini-2.0-flash-lite-001'
        ]
        
        parsed_result = None
        successful_model = "unknown"
        last_error = ""
        
        for model in models_to_try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
            req = urllib.request.Request(url, data=gemini_payload, headers={'Content-Type': 'application/json'}, method='POST')
            
            try:
                with urllib.request.urlopen(req, timeout=30) as response:
                    res_body = response.read().decode('utf-8')
                    data_json = json.loads(res_body)
                    
                    if "candidates" in data_json and len(data_json["candidates"]) > 0:
                        content_parts = data_json["candidates"][0].get("content", {}).get("parts", [])
                        if content_parts:
                            text = content_parts[0].get("text", "")
                            # Clean markdown if exists
                            text = text.replace('```json', '').replace('```', '').strip()
                            parsed_result = json.loads(text)
                            successful_model = f"gemini ({model})"
                            break
            except urllib.error.HTTPError as e:
                err_text = e.read().decode('utf-8')
                last_error = f"HTTP {e.code}: {err_text}"
                warnings.append(f"Model {model} failed: {e.code}")
            except Exception as e:
                last_error = str(e)
                warnings.append(f"Model {model} exception: {str(e)}")
                
        if not parsed_result:
            return AIGatewayResult(
                provider_used="none",
                execution_status="error: all_models_failed",
                processing_time=time.time() - start_time,
                warnings=warnings + [f"Last error: {last_error}"],
                parsed_analysis=None
            )
            
        # Optional: Attempt DB update if ctx.records is available in this SDK version
        if hasattr(ctx, 'records'):
            try:
                score = parsed_result.get('overall_score', 85)
                await ctx.records.update('resumes', resume_id, {
                    'agent_status': 'completed',
                    'extracted_skills': parsed_result.get('extracted_skills', []),
                    'projects': parsed_result.get('projects', []),
                    'education': parsed_result.get('education', []),
                    'experience': parsed_result.get('experience', []),
                    'certifications': parsed_result.get('certifications', []),
                    'overall_score': score,
                    'agent_notes': f'Processed by AI Gateway ({successful_model})'
                })
                
                await ctx.records.create('career_scores', {
                    'resume_score': score,
                    'application_score': score - 5,
                    'interview_score': score - 10,
                    'overall_score': score - 5
                })
            except Exception as e:
                warnings.append(f"Database update failed (client should fallback to update): {str(e)}")
        
        return AIGatewayResult(
            provider_used=successful_model,
            execution_status="success",
            processing_time=time.time() - start_time,
            warnings=warnings,
            parsed_analysis=parsed_result
        )

    elif action == "run_agent":
        agent_id = payload.get("agent_id", "system")
        system_prompt = get_system_prompt(agent_id)
        input_text = payload.get("input", "")
        context_data = payload.get("context_data", {})
        history = payload.get("history", [])
        
        # 1. Fetch Backend Native Context
        backend_context = ""
        if hasattr(ctx, 'records'):
            try:
                resumes = await ctx.records.list('resumes')
                if resumes and hasattr(resumes, 'items') and len(resumes.items) > 0:
                    best_resume = resumes.items[0]
                    backend_context += "\n--- USER RESUME CONTEXT ---\n"
                    backend_context += f"Skills: {', '.join(best_resume.get('extracted_skills', []))}\n"
                    if best_resume.get('experience'):
                        backend_context += f"Experience Roles: {', '.join([exp.get('title', '') for exp in best_resume.get('experience', [])])}\n"
            except Exception as e:
                warnings.append(f"Could not fetch native context: {str(e)}")
                
        # 2. Format Frontend Context
        frontend_context = ""
        if context_data:
            frontend_context += f"\n--- SPECIFIC FEATURE CONTEXT ---\n{json.dumps(context_data, indent=2)}\n"
            
        # 3. Format History
        history_text = ""
        if history:
            history_text += "\n--- CONVERSATION HISTORY ---\n"
            for msg in history:
                history_text += f"{msg.get('role', 'unknown').capitalize()}: {msg.get('content', '')}\n"
                
        prompt_text = f"{system_prompt}\n\n{backend_context}{frontend_context}{history_text}\n\n--- CURRENT USER INPUT ---\nUser: {input_text}"
        
        gemini_payload = json.dumps({
            "contents": [{"parts": [{"text": prompt_text}]}],
            "generationConfig": {"responseMimeType": "text/plain"}
        }).encode('utf-8')

        
        models_to_try = [
            'gemini-1.5-flash-latest',
            'gemini-1.5-pro-latest',
            'gemini-2.5-flash',
            'gemini-2.0-flash',
            'gemini-2.0-flash-lite-001'
        ]
        
        parsed_result = None
        successful_model = "unknown"
        last_error = ""
        
        for model in models_to_try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
            req = urllib.request.Request(url, data=gemini_payload, headers={'Content-Type': 'application/json'}, method='POST')
            
            try:
                with urllib.request.urlopen(req, timeout=30) as response:
                    res_body = response.read().decode('utf-8')
                    data_json = json.loads(res_body)
                    
                    if "candidates" in data_json and len(data_json["candidates"]) > 0:
                        content_parts = data_json["candidates"][0].get("content", {}).get("parts", [])
                        if content_parts:
                            text = content_parts[0].get("text", "")
                            parsed_result = {"response": text.strip()}
                            successful_model = f"gemini ({model})"
                            break
            except urllib.error.HTTPError as e:
                err_text = e.read().decode('utf-8')
                last_error = f"HTTP {e.code}: {err_text}"
                warnings.append(f"Model {model} failed: {e.code}")
            except Exception as e:
                last_error = str(e)
                warnings.append(f"Model {model} exception: {str(e)}")
                
        if not parsed_result:
            return AIGatewayResult(
                provider_used="none",
                execution_status="error: all_models_failed",
                processing_time=time.time() - start_time,
                warnings=warnings + [f"Last error: {last_error}"],
                parsed_analysis=None
            )
            
        return AIGatewayResult(
            provider_used=successful_model,
            execution_status="success",
            processing_time=time.time() - start_time,
            warnings=warnings,
            parsed_analysis=parsed_result
        )

    return AIGatewayResult(
        provider_used="none",
        execution_status="error: unknown_action",
        processing_time=time.time() - start_time,
        warnings=[f"Action {action} is not supported by AI Gateway."],
        parsed_analysis=None
    )
