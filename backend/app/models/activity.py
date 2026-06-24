"""
Activity and Activity Metrics models
"""
from sqlalchemy import Column, String, Text, Integer, Date, TIMESTAMP, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid

from app.database import Base, UUID


class Activity(Base):
    """Activity Intelligence model"""
    __tablename__ = "activities"
    
    id = Column(UUID, primary_key=True, default=uuid.uuid4)
    rep_id = Column(UUID, ForeignKey("reps.id"), nullable=False)
    opportunity_id = Column(UUID, ForeignKey("opportunities.id"), nullable=True)
    activity_type = Column(String(50), nullable=False)  # Meeting, Call, Email, Demo, Proposal
    subject = Column(String(200), nullable=False)
    description = Column(Text)
    activity_date = Column(TIMESTAMP(timezone=True), nullable=False)
    duration_minutes = Column(Integer)
    outcome = Column(String(50))  # Scheduled, Completed, No Show, Rescheduled
    sentiment = Column(String(20))  # Positive, Neutral, Negative
    next_steps = Column(Text)
    attendees = Column(JSON)  # Array of attendee objects
    products_discussed = Column(JSON)  # Array of product IDs
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    updated_at = Column(TIMESTAMP(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    rep = relationship("Rep", back_populates="activities")
    opportunity = relationship("Opportunity", back_populates="activities")
    
    def __repr__(self):
        return f"<Activity(type='{self.activity_type}', subject='{self.subject}')>"


class ActivityMetric(Base):
    """Aggregated Activity Intelligence metrics"""
    __tablename__ = "activity_metrics"
    
    id = Column(UUID, primary_key=True, default=uuid.uuid4)
    rep_id = Column(UUID, ForeignKey("reps.id"), nullable=False)
    period_start = Column(Date, nullable=False)
    period_end = Column(Date, nullable=False)
    total_meetings = Column(Integer, default=0)
    total_calls = Column(Integer, default=0)
    total_emails = Column(Integer, default=0)
    total_demos = Column(Integer, default=0)
    meeting_to_opp_conversion = Column(Integer, default=0)  # Percentage
    avg_response_time_hours = Column(Integer, default=0)
    engagement_score = Column(Integer, default=0)  # 0-100
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    
    # Relationships
    rep = relationship("Rep", back_populates="activity_metrics")
    
    def __repr__(self):
        return f"<ActivityMetric(rep_id='{self.rep_id}', period='{self.period_start} to {self.period_end}')>"

# Made with Bob
