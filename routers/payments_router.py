from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from schemas.payment_scheme import PaymentInputData, PaymentOutputData
from typing import List
from models.payments_table import Payment
from models.user_table import User
from security.jwt import get_current_user_test

router = APIRouter(prefix="/payments", tags=["Payments"])


@router.post("/add")
def add_payment(data: PaymentInputData, db: Session = Depends(get_db), current_user: User = Depends(get_current_user_test)):
    new_payment = Payment(user_id=current_user.id, order_id=data.order_id,
                          amount=data.amount, is_paid=data.is_paid)
    db.add(new_payment)
    db.commit()
    db.refresh(new_payment)
    return new_payment


@router.get("/all/{order_id}", response_model=List[PaymentOutputData])
def get_payment_by_order(order_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user_test)):
    return db.query(Payment).filter(Payment.user_id == current_user.id, Payment.order_id == order_id).first()
