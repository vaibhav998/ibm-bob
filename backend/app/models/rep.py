"""
Sales Representative model
"""
from sqlalchemy import Column, String, Numeric, Integer, TIMESTAMP
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid

from app.database import Base, UUID


class Rep(Base):
    """Sales Representative model"""
    __tablename__ = "reps"
    
    id = Column(UUID, primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False)
    initials = Column(String(5), nullable=False)
    role = Column(String(50), nullable=False)
    region = Column(String(50), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    pipeline = Column(Numeric(12, 2), nullable=False, default=0)
    goal = Column(Numeric(12, 2), nullable=False, default=0)
    coverage = Column(Numeric(4, 2), nullable=False, default=0)
    risk_score = Column(Integer, nullable=False, default=0)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    updated_at = Column(TIMESTAMP(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    opportunities = relationship("Opportunity", back_populates="rep", cascade="all, delete-orphan")
    activities = relationship("Activity", back_populates="rep", cascade="all, delete-orphan")
    activity_metrics = relationship("ActivityMetric", back_populates="rep", cascade="all, delete-orphan")
    reports = relationship("Report", back_populates="generated_by_rep", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Rep(name='{self.name}', region='{self.region}')>"

# Made with Bob
