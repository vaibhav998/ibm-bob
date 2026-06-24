"""
Report model
"""
from sqlalchemy import Column, String, TIMESTAMP, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid

from app.database import Base, UUID


class Report(Base):
    """Generated Reports model"""
    __tablename__ = "reports"
    
    id = Column(UUID, primary_key=True, default=uuid.uuid4)
    report_name = Column(String(200), nullable=False)
    report_type = Column(String(50), nullable=False)  # Pipeline, Activity, Product, Forecast
    generated_by = Column(UUID, ForeignKey("reps.id"), nullable=False)
    parameters = Column(JSON)  # Filter criteria used
    file_path = Column(String(500))
    file_format = Column(String(20), nullable=False)  # PDF, Excel, CSV
    status = Column(String(20), nullable=False, default="Pending")  # Pending, Completed, Failed
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    expires_at = Column(TIMESTAMP(timezone=True))
    
    # Relationships
    generated_by_rep = relationship("Rep", back_populates="reports")
    
    def __repr__(self):
        return f"<Report(name='{self.report_name}', type='{self.report_type}', status='{self.status}')>"

# Made with Bob
