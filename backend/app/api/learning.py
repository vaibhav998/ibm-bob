"""
YourLearning API Router
------------------------
Endpoints
---------
GET  /api/v1/learning/status                     — Check YourLearning connectivity
GET  /api/v1/learning/rep/{email}/completions    — Completed courses for one rep
GET  /api/v1/learning/rep/{email}/assignments    — Pending assignments for one rep
GET  /api/v1/learning/team/summary               — Per-rep summary for all reps
POST /api/v1/learning/rep/{email}/assign         — Assign a course to a rep (mock)
"""
from __future__ import annotations

import logging
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel

from app.services import yourlearning

logger = logging.getLogger(__name__)
router = APIRouter()


# ---------------------------------------------------------------------------
# Status / health
# ---------------------------------------------------------------------------

@router.get("/status")
async def yourlearning_status():
    """
    Check whether YourLearning credentials are configured.
    Returns connected=true/false so the frontend can show the right UI state.
    """
    from app.config import settings
    configured = bool(settings.YL_CLIENT_ID and settings.YL_CLIENT_SECRET)
    return {
        "connected": configured,
        "mode": "live" if configured else "mock",
        "base_url": settings.YL_BASE_URL if configured else None,
        "message": (
            "YourLearning API connected."
            if configured
            else "No YourLearning credentials configured — running in mock-data mode. "
                 "Set YL_CLIENT_ID and YL_CLIENT_SECRET in your .env file."
        ),
    }


# ---------------------------------------------------------------------------
# Per-rep endpoints
# ---------------------------------------------------------------------------

@router.get("/rep/{email}/completions")
async def rep_completions(email: str):
    """Completed learning activities for one rep (identified by IBM email)."""
    try:
        data = yourlearning.get_learner_completions(email)
        return {"email": email, "completions": data, "count": len(data)}
    except Exception as exc:
        logger.error("Error fetching completions for %s: %s", email, exc)
        raise HTTPException(status_code=502, detail=str(exc))


@router.get("/rep/{email}/assignments")
async def rep_assignments(email: str):
    """Pending course assignments for one rep."""
    try:
        data = yourlearning.get_learner_assignments(email)
        return {"email": email, "assignments": data, "count": len(data)}
    except Exception as exc:
        logger.error("Error fetching assignments for %s: %s", email, exc)
        raise HTTPException(status_code=502, detail=str(exc))


# ---------------------------------------------------------------------------
# Team summary
# ---------------------------------------------------------------------------

@router.get("/team/summary")
async def team_summary(
    emails: str = Query(
        ...,
        description="Comma-separated list of IBM email addresses, e.g. priya.shah@ibm.com,maya.chen@ibm.com",
        example="priya.shah@ibm.com,maya.chen@ibm.com"
    )
):
    """
    Return a learning summary for each rep in the list.
    Used by the dashboard training modal to show completions, hours, and pending courses.
    """
    email_list = [e.strip() for e in emails.split(",") if e.strip()]
    if not email_list:
        raise HTTPException(status_code=400, detail="Provide at least one email in the 'emails' query param.")
    try:
        data = yourlearning.get_team_learning_summary(email_list)
        return {"team": data}
    except Exception as exc:
        logger.error("Error fetching team learning summary: %s", exc)
        raise HTTPException(status_code=502, detail=str(exc))


# ---------------------------------------------------------------------------
# Assign a course (mock — real implementation would POST to YourLearning)
# ---------------------------------------------------------------------------

class AssignCourseRequest(BaseModel):
    course_id: str
    due_date: Optional[str] = None
    priority: str = "MEDIUM"


@router.post("/rep/{email}/assign")
async def assign_course(email: str, body: AssignCourseRequest):
    """
    Assign a course to a rep. In production this calls the YourLearning
    assignment API; in mock mode it returns a success acknowledgement.
    """
    from app.config import settings
    configured = bool(settings.YL_CLIENT_ID and settings.YL_CLIENT_SECRET)

    if configured:
        # Live path — POST to YourLearning assignments endpoint
        try:
            from app.services.yourlearning import _get_access_token
            import httpx
            token = _get_access_token()
            resp = httpx.post(
                f"{settings.YL_BASE_URL}/api/v1/learners/{email}/assignments",
                headers={"Authorization": f"Bearer {token}"},
                json={
                    "contentId": body.course_id,
                    "dueDate": body.due_date,
                    "priority": body.priority,
                },
                timeout=10,
            )
            resp.raise_for_status()
            return {"success": True, "email": email, "course_id": body.course_id, "mode": "live"}
        except Exception as exc:
            raise HTTPException(status_code=502, detail=f"YourLearning assignment failed: {exc}")
    else:
        # Mock path
        return {
            "success": True,
            "email": email,
            "course_id": body.course_id,
            "mode": "mock",
            "message": f"Course {body.course_id} assignment queued for {email} (mock mode).",
        }

# Made with Bob
