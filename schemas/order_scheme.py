from pydantic import BaseModel, ConfigDict
from enum import Enum


class OrderStatus(str, Enum):
    NEW = "new"
    ACTIVE = "active"
    ARCHIVED = "archived"


class OrderInputData(BaseModel):
    client_id: int
    title: str
    description: str
    price: int
    status: OrderStatus
    notes: str
    is_paid: bool


class OrderOutputData(BaseModel):
    id: int
    user_id: int
    client_id: int
    title: str
    description: str
    price: int
    status: OrderStatus
    notes: str
    is_paid: bool

    model_config = ConfigDict(from_attributes=True)
