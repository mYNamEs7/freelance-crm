from sqlalchemy import Column, Integer, String, ForeignKey
from app.database import Base


class Client(Base):
    __tablename__ = "clients"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name =Column(String, index=True, nullable=False)
    contact = Column(String, index=True, nullable=False)
    notes = Column(String, nullable=True)
