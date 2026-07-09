"""
IBM YourLearning Integration Service
-------------------------------------
IBM YourLearning exposes a REST API for retrieving learning records,
assigned courses, and completion status per learner (identified by
their IBM email / serial number).

Required env vars (see .env.example):
  YL_CLIENT_ID      — OAuth2 client ID from the YourLearning App Registration
  YL_CLIENT_SECRET  — OAuth2 client secret
  YL_BASE_URL       — Base URL (default: https://yourlearning.ibm.com)
  YL_TOKEN_URL      — Token endpoint (default: https://iam.ibm.com/identity/token)

How to obtain credentials:
  1. Go to https://yourlearning.ibm.com → Admin → API Access
  2. Register a new application and note the Client ID and Secret.
  3. Tokens use IBM IAM OAuth2 (client_credentials grant).

Endpoints used:
  GET /api/v1/learners/{email}/activities   — Completed learning activities
  GET /api/v1/learners/{email}/assignments  — Assigned (pending) courses
  GET /api/v1/content                       — Course catalogue search

All methods return plain Python dicts so they're JSON-serialisable by FastAPI.
If credentials are not configured the service returns graceful mock data so
the dashboard works in local/demo mode without a real YourLearning tenant.
"""
from __future__ import annotations

import logging
from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional

import httpx

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Token cache (in-memory, good enough for a single-process server)
# ---------------------------------------------------------------------------
_token_cache: Dict[str, Any] = {"access_token": None, "expires_at": 0.0}


def _is_configured() -> bool:
    """Return True only if YourLearning credentials are present."""
    from app.config import settings
    return bool(settings.YL_CLIENT_ID and settings.YL_CLIENT_SECRET)


def _get_access_token() -> str:
    """
    Obtain (or return cached) IBM IAM access token via client_credentials.
    Raises RuntimeError if credentials are missing or the request fails.
    """
    import time
    from app.config import settings

    if not _is_configured():
        raise RuntimeError("YourLearning credentials not configured.")

    # Reuse cached token with 60-second buffer
    if _token_cache["access_token"] and time.time() < _token_cache["expires_at"] - 60:
        return _token_cache["access_token"]

    resp = httpx.post(
        settings.YL_TOKEN_URL,
        data={
            "grant_type": "client_credentials",
            "client_id": settings.YL_CLIENT_ID,
            "client_secret": settings.YL_CLIENT_SECRET,
        },
        headers={"Content-Type": "application/x-www-form-urlencoded"},
        timeout=10,
    )
    resp.raise_for_status()
    data = resp.json()

    import time
    _token_cache["access_token"] = data["access_token"]
    _token_cache["expires_at"] = time.time() + data.get("expires_in", 3600)
    return _token_cache["access_token"]


# ---------------------------------------------------------------------------
# Public API methods
# ---------------------------------------------------------------------------

def get_learner_completions(email: str) -> List[Dict[str, Any]]:
    """
    Return a list of completed learning activities for a learner.
    Each item: { title, course_id, completed_at, duration_minutes, score, badge_url }
    """
    from app.config import settings

    if not _is_configured():
        return _mock_completions(email)

    try:
        token = _get_access_token()
        resp = httpx.get(
            f"{settings.YL_BASE_URL}/api/v1/learners/{email}/activities",
            headers={"Authorization": f"Bearer {token}"},
            params={"status": "COMPLETED", "limit": 50},
            timeout=10,
        )
        resp.raise_for_status()
        raw = resp.json().get("activities", [])
        return [
            {
                "title": a.get("title", ""),
                "course_id": a.get("contentId", ""),
                "completed_at": a.get("completedAt", ""),
                "duration_minutes": a.get("durationMinutes", 0),
                "score": a.get("score"),
                "badge_url": a.get("badgeUrl"),
            }
            for a in raw
        ]
    except Exception as exc:
        logger.warning("YourLearning completions fetch failed (%s) — returning mock data", exc)
        return _mock_completions(email)


def get_learner_assignments(email: str) -> List[Dict[str, Any]]:
    """
    Return a list of courses currently assigned (not yet completed) to a learner.
    Each item: { title, course_id, due_date, priority, url }
    """
    from app.config import settings

    if not _is_configured():
        return _mock_assignments(email)

    try:
        token = _get_access_token()
        resp = httpx.get(
            f"{settings.YL_BASE_URL}/api/v1/learners/{email}/assignments",
            headers={"Authorization": f"Bearer {token}"},
            params={"status": "PENDING", "limit": 20},
            timeout=10,
        )
        resp.raise_for_status()
        raw = resp.json().get("assignments", [])
        return [
            {
                "title": a.get("title", ""),
                "course_id": a.get("contentId", ""),
                "due_date": a.get("dueDate", ""),
                "priority": a.get("priority", "MEDIUM"),
                "url": f"{settings.YL_BASE_URL}/content/{a.get('contentId', '')}",
            }
            for a in raw
        ]
    except Exception as exc:
        logger.warning("YourLearning assignments fetch failed (%s) — returning mock data", exc)
        return _mock_assignments(email)


def get_team_learning_summary(emails: List[str]) -> List[Dict[str, Any]]:
    """
    Return a per-rep summary: completions count, hours learned, pending assignments.
    Used to populate the training modal cards on the dashboard.
    """
    summary = []
    for email in emails:
        completions = get_learner_completions(email)
        assignments = get_learner_assignments(email)
        total_minutes = sum(c.get("duration_minutes", 0) for c in completions)
        summary.append({
            "email": email,
            "completions": len(completions),
            "hours_learned": round(total_minutes / 60, 1),
            "pending_assignments": len(assignments),
            "recent_completions": completions[:3],
            "pending": assignments[:3],
        })
    return summary


# ---------------------------------------------------------------------------
# Mock data — returned when credentials are not configured
# ---------------------------------------------------------------------------

def _mock_completions(email: str) -> List[Dict[str, Any]]:
    name = email.split("@")[0].replace(".", " ").title()
    base = [
        {"title": "watsonx.ai Sales Foundations", "course_id": "WX-AI-001", "completed_at": "2026-05-12", "duration_minutes": 45, "score": 92, "badge_url": None},
        {"title": "IBM Guardium Data Security", "course_id": "GD-SEC-003", "completed_at": "2026-04-20", "duration_minutes": 30, "score": 88, "badge_url": None},
        {"title": "Competitive Selling: Snowflake vs watsonx.data", "course_id": "WX-DATA-005", "completed_at": "2026-03-08", "duration_minutes": 20, "score": 95, "badge_url": None},
    ]
    return base


def _mock_assignments(email: str) -> List[Dict[str, Any]]:
    return [
        {"title": "watsonx.ai Advanced Demo Certification", "course_id": "WX-AI-CERT-002", "due_date": "2026-07-31", "priority": "HIGH", "url": "https://yourlearning.ibm.com/content/WX-AI-CERT-002"},
        {"title": "IBM Instana Observability — Talk Track", "course_id": "INST-TT-007", "due_date": "2026-08-15", "priority": "MEDIUM", "url": "https://yourlearning.ibm.com/content/INST-TT-007"},
    ]

# Made with Bob
