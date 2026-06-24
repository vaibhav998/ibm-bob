"""
Account Product model
"""
from sqlalchemy import Column, String, Numeric, Integer, Date, TIMESTAMP, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid

from app.database import Base, UUID


class AccountProduct(Base):
    """Current Product Usage by Account"""
    __tablename__ = "account_products"
    
    id = Column(UUID, primary_key=True, default=uuid.uuid4)
    account_name = Column(String(200), nullable=False)
    product_id = Column(UUID, ForeignKey("ibm_products.id"), nullable=False)
    contract_start_date = Column(Date, nullable=False)
    contract_end_date = Column(Date, nullable=False)
    annual_value = Column(Numeric(12, 2), nullable=False)
    usage_level = Column(String(50), nullable=False)  # Low, Medium, High
    satisfaction_score = Column(Integer)  # 1-10
    renewal_risk = Column(String(20), nullable=False)  # Low, Medium, High
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    updated_at = Column(TIMESTAMP(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    product = relationship("IBMProduct", back_populates="account_products")
    
    def __repr__(self):
        return f"<AccountProduct(account='{self.account_name}', product_id='{self.product_id}')>"

# Made with Bob
