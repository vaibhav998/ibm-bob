"""
Opportunities API endpoints
POST   /api/v1/opportunities          — create a new opportunity
GET    /api/v1/opportunities          — list all opportunities (optional ?rep= filter)
GET    /api/v1/opportunities/{id}     — get one opportunity
PATCH  /api/v1/opportunities/{id}/stage — advance/change stage
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date
from decimal import Decimal
import uuid

from app.database import get_db
from app.models.rep import Rep
from app.models.opportunity import Opportunity, OpportunityProduct
from app.models.product import IBMProduct
from app.schemas.opportunity import OpportunityCreate, OpportunityStageUpdate, OpportunityResponse

router = APIRouter()


# Probability defaults by stage
STAGE_PROBABILITY = {
    "Discovery":     25,
    "Qualification": 45,
    "Proposal":      65,
    "Negotiation":   80,
    "Closed Won":   100,
    "Closed Lost":    0,
}


def _serialize(opp: Opportunity, product_name: str = "Unknown") -> dict:
    """Convert ORM object to plain dict matching OpportunityResponse."""
    return {
        "id": str(opp.id),
        "opportunity_name": opp.opportunity_name,
        "account_name": opp.account_name,
        "product_name": product_name,
        "amount": float(opp.amount),
        "stage": opp.stage,
        "probability": opp.probability,
        "owner_name": opp.notes.split("owner:")[1].strip() if opp.notes and "owner:" in opp.notes else "—",
        "expected_close_date": opp.expected_close_date.isoformat() if opp.expected_close_date else None,
        "created_date": opp.created_date.isoformat() if opp.created_date else None,
        "last_activity_date": opp.last_activity_date.isoformat() if opp.last_activity_date else None,
        "notes": opp.notes,
    }


def _get_product_name(db: Session, opp: Opportunity) -> str:
    """Resolve primary product name for an opportunity."""
    op = db.query(OpportunityProduct).filter(
        OpportunityProduct.opportunity_id == opp.id
    ).first()
    if op:
        product = db.query(IBMProduct).filter(IBMProduct.id == op.product_id).first()
        if product:
            return product.product_name
    # Fall back to notes field where we store it for frontend-created opps
    if opp.notes and "product:" in opp.notes:
        for line in opp.notes.split("|"):
            if "product:" in line:
                return line.split("product:")[1].strip()
    return "—"


@router.post("/", response_model=dict, status_code=201)
async def create_opportunity(payload: OpportunityCreate, db: Session = Depends(get_db)):
    """
    Create a new sales opportunity.
    Looks up the rep by name and the IBM product by name;
    creates both the Opportunity row and an OpportunityProduct join row.
    """
    # Resolve rep
    rep = db.query(Rep).filter(Rep.name == payload.owner_name).first()
    if not rep:
        raise HTTPException(
            status_code=422,
            detail=f"Rep '{payload.owner_name}' not found. Check owner_name matches a rep in the database."
        )

    # Resolve product (case-insensitive partial match)
    product = db.query(IBMProduct).filter(
        IBMProduct.product_name.ilike(f"%{payload.product_name}%")
    ).first()

    # Build notes string so we can retrieve owner + product later without extra joins
    notes_parts = [f"owner:{payload.owner_name}", f"product:{payload.product_name}"]
    if payload.notes:
        notes_parts.append(payload.notes)

    opp = Opportunity(
        rep_id=rep.id,
        account_name=payload.account_name,
        opportunity_name=payload.opportunity_name,
        stage=payload.stage,
        amount=Decimal(str(payload.amount)),
        probability=STAGE_PROBABILITY.get(payload.stage, 30),
        expected_close_date=payload.expected_close_date,
        created_date=date.today(),
        last_activity_date=date.today(),
        source="Dashboard",
        is_upsell=False,
        notes=" | ".join(notes_parts),
    )
    db.add(opp)
    db.flush()  # get opp.id before creating the join row

    # Create OpportunityProduct join row if product found
    if product:
        unit_price = product.typical_deal_size or Decimal(str(payload.amount))
        op = OpportunityProduct(
            opportunity_id=opp.id,
            product_id=product.id,
            quantity=1,
            unit_price=unit_price,
            total_amount=unit_price,
            is_current_product=False,
            is_upsell_target=False,
            usage_status="Not Using",
        )
        db.add(op)

    db.commit()
    db.refresh(opp)

    resolved_product = product.product_name if product else payload.product_name
    return {
        **_serialize(opp, resolved_product),
        "owner_name": payload.owner_name,   # override the notes-parsed value
    }


@router.get("/", response_model=List[dict])
async def list_opportunities(
    rep: Optional[str] = Query(None, description="Filter by rep name"),
    stage: Optional[str] = Query(None, description="Filter by stage"),
    db: Session = Depends(get_db)
):
    """List all opportunities, optionally filtered by rep name or stage."""
    q = db.query(Opportunity)
    if rep:
        matched = db.query(Rep).filter(Rep.name.ilike(f"%{rep}%")).first()
        if matched:
            q = q.filter(Opportunity.rep_id == matched.id)
    if stage:
        q = q.filter(Opportunity.stage == stage)

    opps = q.order_by(Opportunity.created_date.desc()).all()
    result = []
    for opp in opps:
        product_name = _get_product_name(db, opp)
        serialized = _serialize(opp, product_name)
        # Re-parse owner from notes (always present for dashboard-created opps)
        if opp.notes and "owner:" in opp.notes:
            for part in opp.notes.split("|"):
                if "owner:" in part:
                    serialized["owner_name"] = part.split("owner:")[1].strip()
        result.append(serialized)
    return result


@router.get("/{opportunity_id}", response_model=dict)
async def get_opportunity(opportunity_id: str, db: Session = Depends(get_db)):
    """Get a single opportunity by ID."""
    opp = db.query(Opportunity).filter(
        Opportunity.id == opportunity_id
    ).first()
    if not opp:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    product_name = _get_product_name(db, opp)
    serialized = _serialize(opp, product_name)
    if opp.notes and "owner:" in opp.notes:
        for part in opp.notes.split("|"):
            if "owner:" in part:
                serialized["owner_name"] = part.split("owner:")[1].strip()
    return serialized


@router.patch("/{opportunity_id}/stage", response_model=dict)
async def update_stage(
    opportunity_id: str,
    payload: OpportunityStageUpdate,
    db: Session = Depends(get_db)
):
    """Advance or change the stage of an opportunity."""
    opp = db.query(Opportunity).filter(
        Opportunity.id == opportunity_id
    ).first()
    if not opp:
        raise HTTPException(status_code=404, detail="Opportunity not found")

    opp.stage = payload.stage
    opp.probability = STAGE_PROBABILITY.get(payload.stage, opp.probability)
    opp.last_activity_date = date.today()
    db.commit()
    db.refresh(opp)

    product_name = _get_product_name(db, opp)
    return _serialize(opp, product_name)
