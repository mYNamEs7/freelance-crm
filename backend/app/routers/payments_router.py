from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from app.database import AsyncSessionLocal
from app.schemas.payment_scheme import PaymentInputData, PaymentOutputData
from typing import List
from app.models.payments_table import Payment
from app.models.user_table import User
from app.security.jwt import get_current_user_release

router = APIRouter(prefix="/payments", tags=["Payments"])


@router.post("/add")
async def add_payment(data: PaymentInputData, current_user: User = Depends(get_current_user_release)):
    new_payment = Payment(user_id=current_user.id, order_id=data.order_id,
                          amount=data.amount, is_paid=data.is_paid)
    
    async with AsyncSessionLocal() as session:
        session.add(new_payment)
        await session.commit()
        await session.refresh(new_payment)
        return new_payment


@router.get("/all/{order_id}", response_model=List[PaymentOutputData])
async def get_payment_by_order(order_id: int, current_user: User = Depends(get_current_user_release)):
    async with AsyncSessionLocal() as session:
        result = await session.execute(
            select(Payment).where(Payment.user_id == current_user.id, Payment.order_id == order_id)
        )
        payment = result.scalar_one_or_none()
        return payment
