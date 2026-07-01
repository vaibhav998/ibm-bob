"""
Activities API endpoints
GET /api/v1/activities          — list activities (filter by rep name or type)
GET /api/v1/activities/metrics  — aggregated per-rep activity metrics
"""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional

from app.database import get_db
from app.models.rep import Rep
from app.models.activity import Activity, ActivityMetric

router = APIRouter()


@router.get("/")
async def list_activities(
    rep: Optional[str] = Query(None, description="Filter by rep name (partial match)"),
    activity_type: Optional[str] = Query(None, description="Filter by type: Meeting, Call, Email, Demo, Proposal"),
    limit: int = Query(200, le=500),
    db: Session = Depends(get_db),
):
    """
    Return recent activities, optionally filtered by rep name and/or type.
    Ordered by activity_date descending.
    """
    q = db.query(Activity)

    if rep:
        matched = db.query(Rep).filter(Rep.name.ilike(f"%{rep}%")).first()
        if matched:
            q = q.filter(Activity.rep_id == matched.id)

    if activity_type:
        q = q.filter(Activity.activity_type.ilike(activity_type))

    activities = q.order_by(Activity.activity_date.desc()).limit(limit).all()

    result = []
    for act in activities:
        rep_obj = db.query(Rep).filter(Rep.id == act.rep_id).first()
        result.append({
            "id": str(act.id),
            "rep_name": rep_obj.name if rep_obj else "Unknown",
            "rep_initials": rep_obj.initials if rep_obj else "??",
            "activity_type": act.activity_type,
            "subject": act.subject,
            "activity_date": act.activity_date.isoformat() if act.activity_date else None,
            "duration_minutes": act.duration_minutes,
            "outcome": act.outcome,
            "sentiment": act.sentiment,
            "next_steps": act.next_steps,
        })

    return result


@router.get("/metrics")
async def get_activity_metrics(
    db: Session = Depends(get_db),
):
    """
    Return the latest ActivityMetric row per rep — used by the Activity
    Intelligence tab to show per-rep call/meeting/email/demo counts.
    """
    # Get all reps so we can join names
    all_reps = {str(r.id): r for r in db.query(Rep).all()}

    # For each rep, grab their most recent metric row
    metrics = (
        db.query(ActivityMetric)
        .order_by(ActivityMetric.period_end.desc())
        .all()
    )

    # Deduplicate to latest-per-rep
    seen = {}
    for m in metrics:
        rid = str(m.rep_id)
        if rid not in seen:
            seen[rid] = m

    result = []
    for rid, m in seen.items():
        rep = all_reps.get(rid)
        if not rep:
            continue

        # Also compute live activity counts from the Activity table for richer data
        activities = db.query(Activity).filter(Activity.rep_id == m.rep_id).all()
        calls   = sum(1 for a in activities if a.activity_type.lower() == "call")
        meetings = sum(1 for a in activities if a.activity_type.lower() == "meeting")
        emails  = sum(1 for a in activities if a.activity_type.lower() == "email")
        demos   = sum(1 for a in activities if a.activity_type.lower() == "demo")
        total   = len(activities)
        connect_rate = round((calls / total * 100)) if total else 0

        result.append({
            "rep_id": rid,
            "rep_name": rep.name,
            "rep_initials": rep.initials,
            "role": rep.role,
            "region": rep.region,
            "calls": calls,
            "meetings": meetings,
            "emails": emails,
            "demos": demos,
            "connect_rate": connect_rate,
            "reply_rate": m.meeting_to_opp_conversion,   # reuse conversion field
            "engagement_score": m.engagement_score,
            "period_start": m.period_start.isoformat() if m.period_start else None,
            "period_end": m.period_end.isoformat() if m.period_end else None,
        })

    return result

# Made with Bob
