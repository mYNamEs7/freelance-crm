from sqlalchemy import Column, Integer, Boolean, ForeignKey
from app.database import Base


class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    order_id = Column(Integer, ForeignKey("orders.id"))
    amount = Column(Integer, nullable=False)
    is_paid = Column(Boolean, nullable=False)
