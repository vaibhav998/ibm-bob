"""
IBM Product model
"""
from sqlalchemy import Column, String, Text, Numeric, Boolean, TIMESTAMP
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid

from app.database import Base, UUID


class IBMProduct(Base):
    """IBM Data & AI Product model"""
    __tablename__ = "ibm_products"
    
    id = Column(UUID, primary_key=True, default=uuid.uuid4)
    product_name = Column(String(100), nullable=False, unique=True)
    product_family = Column(String(50), nullable=False)  # watsonx, Data Management, etc.
    category = Column(String(50), nullable=False)  # AI/ML, Database, ETL, etc.
    description = Column(Text)
    typical_deal_size = Column(Numeric(12, 2), nullable=False)
    license_type = Column(String(50), nullable=False)  # Subscription, Perpetual, Usage-based
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    
    # Relationships
    opportunity_products = relationship("OpportunityProduct", back_populates="product", cascade="all, delete-orphan")
    account_products = relationship("AccountProduct", back_populates="product", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<IBMProduct(name='{self.product_name}', family='{self.product_family}')>"

# Made with Bob
