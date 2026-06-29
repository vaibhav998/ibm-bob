"""
Sync API — pull live data from Salesforce CRM into the local database.

Endpoints
---------
GET  /api/v1/sync/status          — Check Salesforce connection
POST /api/v1/sync/salesforce       — Full sync (reps + opps + accounts + activities)
POST /api/v1/sync/salesforce/opportunities  — Opps only
POST /api/v1/sync/salesforce/accounts       — Accounts only
POST /api/v1/sync/salesforce/activities     — Activities only
"""
from __future__ import annotations

import logging
from datetime import date, datetime
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, BackgroundTasks
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.rep import Rep
from app.models.opportunity import Opportunity
from app.models.account import Account

logger = logging.getLogger(__name__)
router = APIRouter()


# ---------------------------------------------------------------------------
# Status check
# ---------------------------------------------------------------------------

@router.get("/status")
async def salesforce_status():
    """
    Check whether Salesforce credentials are configured and the connection works.
    Returns connected=true/false with org metadata or an error message.
    """
    try:
        from app.services.salesforce import get_salesforce_status
        return get_salesforce_status()
    except Exception as exc:
        return {"connected": False, "error": str(exc)}


# ---------------------------------------------------------------------------
# Full sync
# ---------------------------------------------------------------------------

@router.post("/salesforce")
async def full_sync(
    background_tasks: BackgroundTasks,
    since_date: Optional[str] = Query(
        default=None,
        description="ISO date (YYYY-MM-DD). Only sync records modified on/after this date.",
        example="2025-01-01",
    ),
    db: Session = Depends(get_db),
):
    """
    Trigger a full Salesforce sync in the background.
    Pulls opportunities, accounts, and activities for all configured reps.
    Returns immediately with a job receipt; sync runs asynchronously.
    """
    try:
        from app.services.salesforce import _get_sf  # validate creds up front
        _get_sf()
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc))

    job_id = datetime.utcnow().strftime("%Y%m%d%H%M%S")
    background_tasks.add_task(_run_full_sync, since_date)

    return {
        "status": "started",
        "job_id": job_id,
        "message": "Salesforce sync running in background. Reload the dashboard in ~30 seconds.",
        "since_date": since_date,
    }


# ---------------------------------------------------------------------------
# Granular sync endpoints
# ---------------------------------------------------------------------------

@router.post("/salesforce/opportunities")
async def sync_opportunities_endpoint(
    since_date: Optional[str] = Query(default=None, description="ISO date YYYY-MM-DD"),
    db: Session = Depends(get_db),
):
    """Pull open opportunities from Salesforce and upsert into local DB."""
    try:
        from app.services.salesforce import sync_opportunities
        rep_emails = _get_rep_emails(db)
        records = sync_opportunities(owner_emails=rep_emails, since_date=since_date)
        upserted = _upsert_opportunities(db, records)
        return {
            "synced": upserted,
            "source": "salesforce",
            "entity": "opportunities",
            "timestamp": datetime.utcnow().isoformat(),
        }
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc))
    except Exception as exc:
        logger.exception("Opportunity sync failed")
        raise HTTPException(status_code=500, detail=f"Sync error: {exc}")


@router.post("/salesforce/accounts")
async def sync_accounts_endpoint(
    db: Session = Depends(get_db),
):
    """Pull Account records from Salesforce and upsert into local DB."""
    try:
        from app.services.salesforce import sync_accounts
        rep_emails = _get_rep_emails(db)
        records = sync_accounts(owner_emails=rep_emails)
        upserted = _upsert_accounts(db, records)
        return {
            "synced": upserted,
            "source": "salesforce",
            "entity": "accounts",
            "timestamp": datetime.utcnow().isoformat(),
        }
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc))
    except Exception as exc:
        logger.exception("Account sync failed")
        raise HTTPException(status_code=500, detail=f"Sync error: {exc}")


@router.post("/salesforce/activities")
async def sync_activities_endpoint(
    since_date: Optional[str] = Query(
        default=None,
        description="ISO date YYYY-MM-DD",
        example="2025-06-01",
    ),
    db: Session = Depends(get_db),
):
    """Pull Task records from Salesforce and return them (no DB write for now — Activities schema varies widely)."""
    try:
        from app.services.salesforce import sync_activities
        rep_emails = _get_rep_emails(db)
        records = sync_activities(owner_emails=rep_emails, since_date=since_date)
        return {
            "fetched": len(records),
            "source": "salesforce",
            "entity": "activities",
            "timestamp": datetime.utcnow().isoformat(),
            "records": records[:50],  # Return first 50 for inspection
        }
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc))
    except Exception as exc:
        logger.exception("Activity sync failed")
        raise HTTPException(status_code=500, detail=f"Sync error: {exc}")


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _get_rep_emails(db: Session) -> List[str]:
    """Return all rep e-mails from the local DB to scope Salesforce queries."""
    reps = db.query(Rep).all()
    return [r.email for r in reps if r.email]


def _upsert_opportunities(db: Session, records: list) -> int:
    """
    Upsert Salesforce opportunities into local DB.
    Matches on salesforce_id stored in the `notes` field (simple approach).
    Skips records whose owner e-mail doesn't match a known rep.
    """
    reps_by_email: dict = {
        r.email.lower(): r for r in db.query(Rep).all() if r.email
    }
    upserted = 0

    for rec in records:
        owner_email = (rec.get("owner_email") or "").lower()
        rep = reps_by_email.get(owner_email)
        if not rep:
            continue  # Unknown rep — skip

        # Try to find existing record by Salesforce ID stored in notes field
        sf_id = rec.get("salesforce_id")
        existing = (
            db.query(Opportunity)
            .filter(Opportunity.rep_id == rep.id)
            .filter(Opportunity.notes.like(f"%sf:{sf_id}%"))
            .first()
            if sf_id else None
        )

        try:
            close_date = date.fromisoformat(rec["close_date"]) if rec.get("close_date") else date.today()
        except ValueError:
            close_date = date.today()

        if existing:
            existing.account_name = rec["account_name"] or existing.account_name
            existing.opportunity_name = rec["name"] or existing.opportunity_name
            existing.stage = rec["stage"] or existing.stage
            existing.amount = rec["amount"]
            existing.probability = rec["probability"]
            existing.expected_close_date = close_date
        else:
            opp = Opportunity(
                rep_id=rep.id,
                account_name=rec.get("account_name") or "Unknown",
                opportunity_name=rec.get("name") or "Untitled",
                stage=rec.get("stage") or "Discovery",
                amount=rec.get("amount") or 0,
                probability=rec.get("probability") or 0,
                expected_close_date=close_date,
                source=rec.get("source"),
                notes=f"sf:{sf_id}" if sf_id else None,
            )
            db.add(opp)

        upserted += 1

    db.commit()
    return upserted


def _upsert_accounts(db: Session, records: list) -> int:
    """
    Upsert Account records. The Account model may not exist yet in all
    deployments — we do a best-effort import and skip gracefully.
    """
    try:
        upserted = 0
        for rec in records:
            existing = (
                db.query(Account)
                .filter(Account.name == rec.get("name"))
                .first()
            )
            if existing:
                existing.industry = rec.get("industry") or existing.industry
                existing.revenue = rec.get("annual_revenue") or existing.revenue
            else:
                acc = Account(
                    name=rec.get("name") or "Unknown",
                    industry=rec.get("industry"),
                    revenue=rec.get("annual_revenue") or 0,
                )
                db.add(acc)
            upserted += 1
        db.commit()
        return upserted
    except Exception as exc:
        db.rollback()
        logger.warning("Account upsert skipped: %s", exc)
        return 0


def _run_full_sync(since_date: Optional[str]):
    """Background task: run all sync operations sequentially."""
    from app.database import SessionLocal
    db = SessionLocal()
    try:
        from app.services.salesforce import sync_opportunities, sync_accounts, sync_activities
        logger.info("Background Salesforce full sync started (since=%s)", since_date)

        rep_emails = _get_rep_emails(db)

        opp_records = sync_opportunities(owner_emails=rep_emails, since_date=since_date)
        n_opps = _upsert_opportunities(db, opp_records)
        logger.info("Upserted %d opportunities", n_opps)

        acc_records = sync_accounts(owner_emails=rep_emails)
        n_accs = _upsert_accounts(db, acc_records)
        logger.info("Upserted %d accounts", n_accs)

        act_records = sync_activities(owner_emails=rep_emails, since_date=since_date)
        logger.info("Fetched %d activities (not persisted)", len(act_records))

        logger.info("Background Salesforce full sync complete")
    except Exception as exc:
        logger.exception("Background sync error: %s", exc)
    finally:
        db.close()

# Made with Bob
