from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from schemas.order_scheme import OrderInputData, OrderOutputData
from typing import List
from models.orders_table import Order
from models.user_table import User
from security.jwt import get_current_user_test

router = APIRouter(prefix="/orders", tags=["Orders"])


@router.post("/add")
def add_order(data: OrderInputData, db: Session = Depends(get_db), current_user: User = Depends(get_current_user_test)):
    new_order = Order(user_id=current_user.id, client_id=data.client_id,
                      title=data.title, description=data.description,
                      price=data.price, status=data.status, notes=data.notes, is_paid=data.is_paid)
    db.add(new_order)
    db.commit()
    db.refresh(new_order)
    return new_order


@router.get("/get/{order_id}", response_model=OrderOutputData)
def get_order(order_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user_test)):
    order = db.query(Order).filter(Order.user_id ==
                                   current_user.id, Order.id == order_id).first()

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Заказ не найден!")

    return order


@router.get("/all/{client_id}", response_model=List[OrderOutputData])
def get_all_orders_by_client(client_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user_test)):
    return db.query(Order).filter(Order.user_id == current_user.id, Order.client_id == client_id).all()


@router.put("/update/{order_id}", response_model=OrderOutputData)
def update_order(order_id: int, data: OrderInputData, db: Session = Depends(get_db), current_user: User = Depends(get_current_user_test)):
    order = (db.query(Order).filter(Order.user_id ==
             current_user.id, Order.id == order_id).first())

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Заказ не найден!",
        )

    order.title = data.title
    order.description = data.description
    order.price = data.price
    order.status = data.status
    order.notes = data.notes
    order.is_paid = data.is_paid

    db.commit()
    db.refresh(order)

    return order


@router.delete("/delete/{order_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_order(order_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user_test)):
    order = (db.query(Order).filter(Order.user_id ==
             current_user.id, Order.id == order_id).first())

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Заказ не найден!",
        )

    db.delete(order)
    db.commit()
