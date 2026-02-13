from sqlalchemy import Column, Integer, String, Boolean, Enum as SqlEnum, ForeignKey
from app.database import Base
from app.schemas.order_scheme import OrderStatus


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    client_id = Column(Integer, ForeignKey("clients.id"))
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    price = Column(Integer, nullable=False)
    status = Column(SqlEnum(OrderStatus), name="order_status_enum",
                    default=OrderStatus.NEW, nullable=False)
    notes = Column(String, nullable=True)
    is_paid = Column(Boolean, nullable=False)
