"""
Reps API endpoints
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.rep import Rep

router = APIRouter()


@router.get("/")
async def get_all_reps(db: Session = Depends(get_db)):
    """Get all sales reps with their metrics"""
    reps = db.query(Rep).all()
    
    result = []
    for rep in reps:
        result.append({
            "id": str(rep.id),
            "name": rep.name,
            "initials": rep.initials,
            "role": rep.role,
            "region": rep.region,
            "email": rep.email,
            "pipeline": float(rep.pipeline),
            "goal": float(rep.goal),
            "coverage": float(rep.coverage),
            "risk": rep.risk_score,
            "opportunities": len(rep.opportunities),
            "meetings": len([a for a in rep.activities if a.activity_type == "Meeting"]),
            "created_at": rep.created_at.isoformat() if rep.created_at else None,
            "updated_at": rep.updated_at.isoformat() if rep.updated_at else None
        })
    
    return result


@router.get("/{rep_id}")
async def get_rep(rep_id: str, db: Session = Depends(get_db)):
    """Get a specific rep by ID"""
    rep = db.query(Rep).filter(Rep.id == rep_id).first()
    
    if not rep:
        raise HTTPException(status_code=404, detail="Rep not found")
    
    return {
        "id": str(rep.id),
        "name": rep.name,
        "initials": rep.initials,
        "role": rep.role,
        "region": rep.region,
        "email": rep.email,
        "pipeline": float(rep.pipeline),
        "goal": float(rep.goal),
        "coverage": float(rep.coverage),
        "risk": rep.risk_score,
        "opportunities": len(rep.opportunities),
        "meetings": len([a for a in rep.activities if a.activity_type == "Meeting"]),
        "created_at": rep.created_at.isoformat() if rep.created_at else None,
        "updated_at": rep.updated_at.isoformat() if rep.updated_at else None
    }

# Made with Bob
