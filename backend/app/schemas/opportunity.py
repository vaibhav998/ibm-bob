"""
Pydantic schemas for Opportunity endpoints
"""
from pydantic import BaseModel, Field
from typing import Optional
from datetime import date
import uuid


class OpportunityCreate(BaseModel):
    """Request body for POST /api/v1/opportunities"""
    opportunity_name: str = Field(..., min_length=1, max_length=200)
    account_name: str = Field(..., min_length=1, max_length=200)
    product_name: str = Field(..., description="IBM product name e.g. watsonx.ai")
    amount: float = Field(..., gt=0)
    stage: str = Field(
        ...,
        pattern="^(Discovery|Qualification|Proposal|Negotiation|Closed Won|Closed Lost)$"
    )
    owner_name: str = Field(..., min_length=1, max_length=100)
    expected_close_date: date
    notes: Optional[str] = None

    model_config = {"json_schema_extra": {
        "example": {
            "opportunity_name": "Acme Corp — watsonx.ai Platform",
            "account_name": "Acme Corporation",
            "product_name": "watsonx.ai",
            "amount": 85000,
            "stage": "Discovery",
            "owner_name": "Priya Shah",
            "expected_close_date": "2026-09-30",
            "notes": "Initial discovery call completed. CTO interested in AI governance."
        }
    }}


class OpportunityStageUpdate(BaseModel):
    """Request body for PATCH /api/v1/opportunities/{id}/stage"""
    stage: str = Field(
        ...,
        pattern="^(Discovery|Qualification|Proposal|Negotiation|Closed Won|Closed Lost)$"
    )


class OpportunityResponse(BaseModel):
    """Response schema for a single opportunity"""
    id: str
    opportunity_name: str
    account_name: str
    product_name: str          # resolved from OpportunityProduct join (or stored directly)
    amount: float
    stage: str
    probability: int
    owner_name: str
    expected_close_date: str   # ISO date string
    created_date: str
    last_activity_date: Optional[str]
    notes: Optional[str]

    model_config = {"from_attributes": True}
