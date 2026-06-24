"""
Opportunity model
"""
from sqlalchemy import Column, String, Text, Numeric, Integer, Date, Boolean, TIMESTAMP, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid

from app.database import Base, UUID


class Opportunity(Base):
    """Sales Opportunity model"""
    __tablename__ = "opportunities"
    
    id = Column(UUID, primary_key=True, default=uuid.uuid4)
    rep_id = Column(UUID, ForeignKey("reps.id"), nullable=False)
    account_name = Column(String(200), nullable=False)
    opportunity_name = Column(String(200), nullable=False)
    stage = Column(String(50), nullable=False)  # Discovery, Qualification, Proposal, Negotiation, Closed Won/Lost
    amount = Column(Numeric(12, 2), nullable=False)
    probability = Column(Integer, nullable=False)  # 0-100
    expected_close_date = Column(Date, nullable=False)
    created_date = Column(Date, nullable=False, server_default=func.current_date())
    last_activity_date = Column(Date)
    source = Column(String(50))  # Inbound, Outbound, Referral, Partner
    is_upsell = Column(Boolean, default=False)
    parent_opportunity_id = Column(UUID, ForeignKey("opportunities.id"), nullable=True)
    notes = Column(Text)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    updated_at = Column(TIMESTAMP(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    rep = relationship("Rep", back_populates="opportunities")
    products = relationship("OpportunityProduct", back_populates="opportunity", cascade="all, delete-orphan")
    activities = relationship("Activity", back_populates="opportunity", cascade="all, delete-orphan")
    parent_opportunity = relationship("Opportunity", remote_side=[id], backref="child_opportunities")
    
    def __repr__(self):
        return f"<Opportunity(name='{self.opportunity_name}', account='{self.account_name}', stage='{self.stage}')>"


class OpportunityProduct(Base):
    """Products associated with an opportunity"""
    __tablename__ = "opportunity_products"
    
    id = Column(UUID, primary_key=True, default=uuid.uuid4)
    opportunity_id = Column(UUID, ForeignKey("opportunities.id"), nullable=False)
    product_id = Column(UUID, ForeignKey("ibm_products.id"), nullable=False)
    quantity = Column(Integer, nullable=False, default=1)
    unit_price = Column(Numeric(12, 2), nullable=False)
    total_amount = Column(Numeric(12, 2), nullable=False)
    is_current_product = Column(Boolean, default=False)  # Customer already uses this
    is_upsell_target = Column(Boolean, default=False)  # Potential upsell
    usage_status = Column(String(50))  # Active, Trial, Expired, Not Using
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    
    # Relationships
    opportunity = relationship("Opportunity", back_populates="products")
    product = relationship("IBMProduct", back_populates="opportunity_products")
    
    def __repr__(self):
        return f"<OpportunityProduct(opportunity_id='{self.opportunity_id}', product_id='{self.product_id}')>"

# Made with Bob
