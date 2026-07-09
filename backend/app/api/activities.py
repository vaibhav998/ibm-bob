"""
Activities API endpoints
GET /api/v1/activities          — list activities (filter by rep name or type)
GET /api/v1/activities/metrics  — aggregated per-rep activity metrics for a period
"""
from datetime import date, timedelta
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional

from app.database import get_db
from app.models.rep import Rep
from app.models.activity import Activity, ActivityMetric

router = APIRouter()


def _period_dates(period: str):
    """
    Return (start_date, end_date) for the requested period label.
      'week'    → last 7 days  (Mon–today is fine, we just use 7-day window)
      '30d'     → last 30 calendar days
      'quarter' → Q3 FY2026 start = 2026-05-01  (adjust if your fiscal calendar differs)
    """
    today = date.today()
    if period == "30d":
        return today - timedelta(days=30), today
    elif period == "quarter":
        # IBM FY2026 Q3: May 1 – Jul 31
        q_start = date(today.year, 5, 1) if today.month >= 5 else date(today.year - 1, 5, 1)
        return q_start, today
    else:  # default: 'week'
        return today - timedelta(days=7), today


@router.get("/")
async def list_activities(
    rep: Optional[str] = Query(None, description="Filter by rep name (partial match)"),
    activity_type: Optional[str] = Query(None, description="Filter by type: Meeting, Call, Email, Demo, Proposal"),
    period: Optional[str] = Query(None, description="Period filter: week | 30d | quarter"),
    limit: int = Query(200, le=500),
    db: Session = Depends(get_db),
):
    """
    Return recent activities, optionally filtered by rep name, type, and period.
    Ordered by activity_date descending.
    """
    q = db.query(Activity)

    if rep:
        matched = db.query(Rep).filter(Rep.name.ilike(f"%{rep}%")).first()
        if matched:
            q = q.filter(Activity.rep_id == matched.id)

    if activity_type:
        q = q.filter(Activity.activity_type.ilike(activity_type))

    if period:
        start, end = _period_dates(period)
        q = q.filter(
            func.date(Activity.activity_date) >= start,
            func.date(Activity.activity_date) <= end,
        )

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
    period: str = Query("week", description="Period: week | 30d | quarter"),
    db: Session = Depends(get_db),
):
    """
    Return per-rep activity counts for the requested period, computed live
    from the activities table so the three time-range buttons actually show
    different numbers.

    Response shape per rep:
      rep_name, rep_initials, role, region,
      calls, meetings, emails, connect_rate, reply_rate,
      period_label, period_start, period_end
    """
    start, end = _period_dates(period)

    period_labels = {
        "week":    "This week",
        "30d":     "Last 30 days",
        "quarter": "This quarter",
    }
    period_label = period_labels.get(period, period)

    all_reps = db.query(Rep).all()
    result = []

    for rep in all_reps:
        acts = (
            db.query(Activity)
            .filter(
                Activity.rep_id == rep.id,
                func.date(Activity.activity_date) >= start,
                func.date(Activity.activity_date) <= end,
            )
            .all()
        )

        calls    = sum(1 for a in acts if a.activity_type.lower() == "call")
        meetings = sum(1 for a in acts if a.activity_type.lower() in ("meeting", "demo"))
        emails   = sum(1 for a in acts if a.activity_type.lower() == "email")
        total    = len(acts)

        # connect_rate: calls that resulted in a completed outcome
        completed_calls = sum(
            1 for a in acts
            if a.activity_type.lower() == "call"
            and (a.outcome or "").lower() == "completed"
        )
        connect_rate = round(completed_calls / calls * 100) if calls else 0

        # reply_rate: emails with positive/neutral sentiment as proxy
        replied_emails = sum(
            1 for a in acts
            if a.activity_type.lower() == "email"
            and (a.sentiment or "").lower() in ("positive", "neutral")
        )
        reply_rate = round(replied_emails / emails * 100) if emails else 0

        result.append({
            "rep_name":     rep.name,
            "rep_initials": rep.initials,
            "role":         rep.role,
            "region":       rep.region,
            "calls":        calls,
            "meetings":     meetings,
            "emails":       emails,
            "connect_rate": connect_rate,
            "reply_rate":   reply_rate,
            "period_label": period_label,
            "period_start": start.isoformat(),
            "period_end":   end.isoformat(),
        })

    # Sort by calls desc so highest-activity rep is always first
    result.sort(key=lambda r: r["calls"], reverse=True)
    return result

# Made with Bob
