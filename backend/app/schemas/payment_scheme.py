from pydantic import BaseModel, ConfigDict
from enum import Enum


class PaymentInputData(BaseModel):
    order_id: int
    amount: int
    is_paid: bool


class PaymentOutputData(BaseModel):
    id: int
    user_id: int
    order_id: int
    amount: int
    is_paid: bool

    model_config = ConfigDict(from_attributes=True)
