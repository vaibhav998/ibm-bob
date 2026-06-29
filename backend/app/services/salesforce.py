"""
Salesforce CRM Integration Service
Uses simple-salesforce for OAuth2 (username-password flow) or
JWT Bearer (server-to-server) depending on available credentials.

Required env vars (see .env.example):
  SF_USERNAME        — your Salesforce login e-mail
  SF_PASSWORD        — your Salesforce password
  SF_SECURITY_TOKEN  — appended to password for IP-restricted orgs
  SF_CONSUMER_KEY    — Connected App consumer key
  SF_CONSUMER_SECRET — Connected App consumer secret
  SF_DOMAIN          — 'test' for sandbox, 'login' for production (default)

All methods return plain Python dicts so they're JSON-serialisable by FastAPI.
"""
from __future__ import annotations

import logging
from datetime import date, datetime
from typing import Any, Dict, List, Optional

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Lazy import — don't blow up at import time if simple_salesforce isn't
# installed yet or credentials are missing.
# ---------------------------------------------------------------------------
def _get_sf():
    """Return an authenticated Salesforce connection or raise RuntimeError."""
    try:
        from simple_salesforce import Salesforce, SalesforceAuthenticationFailed
    except ImportError:
        raise RuntimeError(
            "simple-salesforce is not installed. "
            "Run: pip install simple-salesforce==1.12.5"
        )

    from app.config import settings

    if not settings.SF_USERNAME:
        raise RuntimeError(
            "Salesforce credentials not configured. "
            "Set SF_USERNAME, SF_PASSWORD, SF_SECURITY_TOKEN, "
            "SF_CONSUMER_KEY, SF_CONSUMER_SECRET in your .env file."
        )

    try:
        sf = Salesforce(
            username=settings.SF_USERNAME,
            password=settings.SF_PASSWORD,
            security_token=settings.SF_SECURITY_TOKEN,
            consumer_key=settings.SF_CONSUMER_KEY,
            consumer_secret=settings.SF_CONSUMER_SECRET,
            domain=settings.SF_DOMAIN,  # 'test' or 'login'
        )
        return sf
    except SalesforceAuthenticationFailed as exc:
        raise RuntimeError(f"Salesforce authentication failed: {exc}") from exc


# ---------------------------------------------------------------------------
# Field mappings  (Salesforce field → our internal name)
# ---------------------------------------------------------------------------

OPP_FIELDS = (
    "Id", "Name", "AccountId", "Account.Name",
    "StageName", "Amount", "Probability",
    "CloseDate", "CreatedDate", "LastActivityDate",
    "LeadSource", "OwnerId", "Owner.Name", "Owner.Email",
    "Description",
)

REP_FIELDS = (
    "Id", "Name", "Email", "Title",
    "Department", "Phone",
)

ACCOUNT_FIELDS = (
    "Id", "Name", "Industry", "AnnualRevenue",
    "NumberOfEmployees", "OwnerId", "Owner.Name",
    "BillingCity", "BillingState", "BillingCountry",
    "Type",  # Customer, Prospect, etc.
)

ACTIVITY_FIELDS = (
    "Id", "Subject", "ActivityDate", "Status",
    "WhoId", "WhatId", "What.Name",
    "OwnerId", "Owner.Name", "Owner.Email",
    "Type", "Description",
)


# ---------------------------------------------------------------------------
# Public sync functions
# ---------------------------------------------------------------------------

def sync_opportunities(
    owner_emails: Optional[List[str]] = None,
    since_date: Optional[str] = None,
) -> List[Dict[str, Any]]:
    """
    Pull open opportunities from Salesforce.

    Args:
        owner_emails: filter to specific rep e-mails (our 6 reps).
                      None = pull all open opportunities.
        since_date:   ISO date string (YYYY-MM-DD). Only return opps
                      created/modified on or after this date.

    Returns:
        List of dicts, each mapped to our Opportunity schema.
    """
    sf = _get_sf()

    fields = ", ".join(OPP_FIELDS)
    where_clauses = ["StageName NOT IN ('Closed Won', 'Closed Lost')"]

    if owner_emails:
        quoted = ", ".join(f"'{e}'" for e in owner_emails)
        where_clauses.append(f"Owner.Email IN ({quoted})")

    if since_date:
        where_clauses.append(f"LastModifiedDate >= {since_date}T00:00:00Z")

    soql = (
        f"SELECT {fields} FROM Opportunity "
        f"WHERE {' AND '.join(where_clauses)} "
        f"ORDER BY LastModifiedDate DESC "
        f"LIMIT 2000"
    )

    logger.info("Salesforce SOQL: %s", soql)
    result = sf.query_all(soql)
    records = result.get("records", [])
    logger.info("Fetched %d opportunities from Salesforce", len(records))

    return [_map_opportunity(r) for r in records]


def sync_reps(department: Optional[str] = None) -> List[Dict[str, Any]]:
    """
    Pull sales rep (User) records from Salesforce.

    Args:
        department: filter by Salesforce User.Department field.
                    None = pull all active users.

    Returns:
        List of dicts mapped to our Rep schema.
    """
    sf = _get_sf()

    fields = ", ".join(REP_FIELDS)
    where_clauses = ["IsActive = true", "UserType = 'Standard'"]

    if department:
        where_clauses.append(f"Department = '{department}'")

    soql = (
        f"SELECT {fields} FROM User "
        f"WHERE {' AND '.join(where_clauses)} "
        f"ORDER BY Name ASC LIMIT 500"
    )

    logger.info("Salesforce SOQL: %s", soql)
    result = sf.query_all(soql)
    records = result.get("records", [])
    logger.info("Fetched %d users from Salesforce", len(records))

    return [_map_rep(r) for r in records]


def sync_accounts(
    owner_emails: Optional[List[str]] = None,
) -> List[Dict[str, Any]]:
    """
    Pull Account records from Salesforce.

    Returns:
        List of dicts mapped to our Account schema.
    """
    sf = _get_sf()

    fields = ", ".join(ACCOUNT_FIELDS)
    where_clauses = ["IsDeleted = false"]

    if owner_emails:
        quoted = ", ".join(f"'{e}'" for e in owner_emails)
        where_clauses.append(f"Owner.Email IN ({quoted})")

    soql = (
        f"SELECT {fields} FROM Account "
        f"WHERE {' AND '.join(where_clauses)} "
        f"ORDER BY LastModifiedDate DESC LIMIT 2000"
    )

    logger.info("Salesforce SOQL: %s", soql)
    result = sf.query_all(soql)
    records = result.get("records", [])
    logger.info("Fetched %d accounts from Salesforce", len(records))

    return [_map_account(r) for r in records]


def sync_activities(
    owner_emails: Optional[List[str]] = None,
    since_date: Optional[str] = None,
) -> List[Dict[str, Any]]:
    """
    Pull Task + Event activity records from Salesforce.

    Returns:
        List of dicts mapped to our Activity schema.
    """
    sf = _get_sf()

    fields = ", ".join(ACTIVITY_FIELDS)
    where_clauses: List[str] = []

    if owner_emails:
        quoted = ", ".join(f"'{e}'" for e in owner_emails)
        where_clauses.append(f"Owner.Email IN ({quoted})")

    if since_date:
        where_clauses.append(f"ActivityDate >= {since_date}")

    where_str = f"WHERE {' AND '.join(where_clauses)}" if where_clauses else ""

    tasks_soql = (
        f"SELECT {fields} FROM Task {where_str} "
        f"ORDER BY ActivityDate DESC LIMIT 2000"
    )

    logger.info("Salesforce tasks SOQL: %s", tasks_soql)
    tasks = sf.query_all(tasks_soql).get("records", [])
    logger.info("Fetched %d tasks from Salesforce", len(tasks))

    mapped = [_map_activity(r, kind="Task") for r in tasks]
    return mapped


def get_salesforce_status() -> Dict[str, Any]:
    """
    Check connectivity and return basic org metadata.
    Returns a dict with 'connected' bool and optional error message.
    """
    try:
        sf = _get_sf()
        info = sf.describe()
        return {
            "connected": True,
            "org_id": sf.sf_instance,
            "api_version": sf.sf_version,
            "sobjects_count": len(info.get("sobjects", [])),
        }
    except Exception as exc:
        return {
            "connected": False,
            "error": str(exc),
        }


# ---------------------------------------------------------------------------
# Private field mappers
# ---------------------------------------------------------------------------

def _sf_date(val: Any) -> Optional[str]:
    """Normalise a Salesforce date/datetime string to YYYY-MM-DD or None."""
    if not val:
        return None
    try:
        if "T" in str(val):
            return datetime.fromisoformat(str(val).replace("Z", "+00:00")).date().isoformat()
        return str(val)[:10]
    except Exception:
        return str(val)[:10] if val else None


def _map_opportunity(r: Dict) -> Dict[str, Any]:
    account = r.get("Account") or {}
    owner = r.get("Owner") or {}
    return {
        "salesforce_id": r.get("Id"),
        "name": r.get("Name"),
        "account_name": account.get("Name") or r.get("AccountId"),
        "stage": r.get("StageName"),
        "amount": float(r.get("Amount") or 0),
        "probability": int(r.get("Probability") or 0),
        "close_date": _sf_date(r.get("CloseDate")),
        "created_date": _sf_date(r.get("CreatedDate")),
        "last_activity_date": _sf_date(r.get("LastActivityDate")),
        "source": r.get("LeadSource"),
        "owner_email": owner.get("Email"),
        "owner_name": owner.get("Name"),
        "notes": r.get("Description"),
    }


def _map_rep(r: Dict) -> Dict[str, Any]:
    name = r.get("Name", "")
    parts = name.split()
    initials = "".join(p[0].upper() for p in parts[:2]) if parts else "??"
    return {
        "salesforce_id": r.get("Id"),
        "name": name,
        "initials": initials,
        "email": r.get("Email"),
        "role": r.get("Title"),
        "department": r.get("Department"),
        "phone": r.get("Phone"),
    }


def _map_account(r: Dict) -> Dict[str, Any]:
    owner = r.get("Owner") or {}
    return {
        "salesforce_id": r.get("Id"),
        "name": r.get("Name"),
        "industry": r.get("Industry"),
        "annual_revenue": float(r.get("AnnualRevenue") or 0),
        "employees": r.get("NumberOfEmployees"),
        "owner_name": owner.get("Name"),
        "city": r.get("BillingCity"),
        "state": r.get("BillingState"),
        "country": r.get("BillingCountry"),
        "type": r.get("Type"),
    }


def _map_activity(r: Dict, kind: str = "Task") -> Dict[str, Any]:
    owner = r.get("Owner") or {}
    what = r.get("What") or {}
    return {
        "salesforce_id": r.get("Id"),
        "kind": kind,
        "subject": r.get("Subject"),
        "activity_date": _sf_date(r.get("ActivityDate")),
        "status": r.get("Status"),
        "related_to": what.get("Name"),
        "owner_email": owner.get("Email"),
        "owner_name": owner.get("Name"),
        "activity_type": r.get("Type"),
        "notes": r.get("Description"),
    }

# Made with Bob
