#input_type_name: GenerateDashboardStatsInput
#output_type_name: GenerateDashboardStatsResult
#function_name: generate_dashboard_stats

from pydantic import BaseModel
from lemma_sdk import FunctionContext, Pod

class GenerateDashboardStatsInput(BaseModel):
    pass

class GenerateDashboardStatsResult(BaseModel):
    total_applications: int
    pending_interviews: int
    tasks_due: int
    notifications_count: int
    offer_count: int
    rejection_count: int

async def generate_dashboard_stats(ctx: FunctionContext, data: GenerateDashboardStatsInput) -> GenerateDashboardStatsResult:
    pod = Pod.from_env()
    
    apps = pod.table("applications").list()
    tasks = pod.table("career_tasks").list()
    interviews = pod.table("interviews").list()
    notifications = pod.table("notifications").list()
    
    apps_data = apps.data if hasattr(apps, 'data') else apps
    tasks_data = tasks.data if hasattr(tasks, 'data') else tasks
    interviews_data = interviews.data if hasattr(interviews, 'data') else interviews
    notifs_data = notifications.data if hasattr(notifications, 'data') else notifications
    
    total_applications = len(apps_data)
    
    offer_count = 0
    rejection_count = 0
    for a in apps_data:
        if a.get("status") == "offer":
            offer_count += 1
        elif a.get("status") == "rejected":
            rejection_count += 1
            
    pending_interviews = 0
    for i in interviews_data:
        if i.get("status") == "scheduled":
            pending_interviews += 1
            
    tasks_due = 0
    for t in tasks_data:
        if t.get("status") == "pending":
            tasks_due += 1
            
    notifications_count = 0
    for n in notifs_data:
        if not n.get("is_read", False):
            notifications_count += 1
    
    return GenerateDashboardStatsResult(
        total_applications=total_applications,
        pending_interviews=pending_interviews,
        tasks_due=tasks_due,
        notifications_count=notifications_count,
        offer_count=offer_count,
        rejection_count=rejection_count
    )
