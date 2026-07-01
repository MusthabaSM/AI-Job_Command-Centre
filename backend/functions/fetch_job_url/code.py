#input_type_name: FetchJobUrlInput
#output_type_name: FetchJobUrlResult
#function_name: fetch_job_url

import re
import urllib.request
import urllib.error
from typing import Optional
from pydantic import BaseModel
from lemma_sdk import FunctionContext, Pod

class FetchJobUrlInput(BaseModel):
    url: str

class FetchJobUrlResult(BaseModel):
    title: str
    company: str
    description: str
    error: Optional[str] = None

async def fetch_job_url(ctx: FunctionContext, data: FetchJobUrlInput) -> FetchJobUrlResult:
    url = data.url.strip()
    
    if not url:
        return FetchJobUrlResult(title="", company="", description="", error="URL cannot be empty.")
        
    if "linkedin.com/jobs" not in url:
        return FetchJobUrlResult(
            title="", 
            company="", 
            description="", 
            error="Currently, only LinkedIn job URLs are supported (e.g., https://www.linkedin.com/jobs/view/1234567)."
        )
        
    # Extract job ID from URL (e.g., linkedin.com/jobs/view/1234567 or linkedin.com/jobs/view/title-1234567?...)
    job_id_match = re.search(r'/jobs/view/(?:.*?[-])?(\d+)', url)
    if not job_id_match:
        # try another format: currentJobId=1234567
        job_id_match = re.search(r'currentJobId=(\d+)', url)
        
    if not job_id_match:
        return FetchJobUrlResult(title="", company="", description="", error="Could not extract LinkedIn Job ID from the URL.")
        
    job_id = job_id_match.group(1)
    
    # Use the guest API endpoint which returns HTML without login
    guest_url = f"https://www.linkedin.com/jobs-guest/jobs/api/jobPosting/{job_id}"
    
    req = urllib.request.Request(guest_url, headers={
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
    })
    
    try:
        with urllib.request.urlopen(req, timeout=10) as response:
            html = response.read().decode('utf-8')
            
        # Parse Title
        title_match = re.search(r'<h2[^>]*top-card-layout__title[^>]*>(.*?)<\/h2>', html, re.IGNORECASE | re.DOTALL)
        title = title_match.group(1).strip() if title_match else ""
        
        # Parse Company
        company_match = re.search(r'<a[^>]*topcard__org-name-link[^>]*>(.*?)<\/a>', html, re.IGNORECASE | re.DOTALL)
        if not company_match:
            company_match = re.search(r'<span[^>]*topcard__flavor[^>]*>(.*?)<\/span>', html, re.IGNORECASE | re.DOTALL)
        company = company_match.group(1).strip() if company_match else ""
        
        # Parse Description
        desc_match = re.search(r'<div[^>]*show-more-less-html__markup[^>]*>(.*?)<\/div>', html, re.IGNORECASE | re.DOTALL)
        if desc_match:
            desc_html = desc_match.group(1)
            # Basic cleanup: replace <br> and <p> with newlines, strip other tags
            desc_text = re.sub(r'<br\s*/?>', '\n', desc_html, flags=re.IGNORECASE)
            desc_text = re.sub(r'</p>', '\n\n', desc_text, flags=re.IGNORECASE)
            desc_text = re.sub(r'<li>', '• ', desc_text, flags=re.IGNORECASE)
            desc_text = re.sub(r'</li>', '\n', desc_text, flags=re.IGNORECASE)
            desc_text = re.sub(r'<[^>]+>', ' ', desc_text)
            
            # Clean up excessive whitespace
            desc_text = re.sub(r' +', ' ', desc_text)
            desc_text = re.sub(r'\n\s*\n', '\n\n', desc_text)
            description = desc_text.strip()
        else:
            description = ""
            
        if not title and not description:
            return FetchJobUrlResult(
                title="", 
                company="", 
                description="", 
                error="Successfully reached LinkedIn, but failed to parse the job posting. The page format may have changed or the job may be expired."
            )
            
        return FetchJobUrlResult(title=title, company=company, description=description, error=None)
        
    except urllib.error.HTTPError as e:
        return FetchJobUrlResult(
            title="", 
            company="", 
            description="", 
            error=f"HTTP Error {e.code}: Could not fetch the job from LinkedIn. It might be private or expired."
        )
    except Exception as e:
        return FetchJobUrlResult(
            title="", 
            company="", 
            description="", 
            error=f"An error occurred while fetching the URL: {str(e)}"
        )
