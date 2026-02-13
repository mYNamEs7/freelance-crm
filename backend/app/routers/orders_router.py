from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from app.database import AsyncSessionLocal
from app.schemas.order_scheme import OrderInputData, OrderOutputData
from typing import List
from app.models.orders_table import Order
from app.models.user_table import User
from app.security.jwt import get_current_user_release

router = APIRouter(prefix="/orders", tags=["Orders"])


@router.post("/add")
async def add_order(data: OrderInputData, current_user: User = Depends(get_current_user_release)):
    new_order = Order(user_id=current_user.id, client_id=data.client_id,
                      title=data.title, description=data.description,
                      price=data.price, status=data.status, notes=data.notes, is_paid=data.is_paid)
    
    async with AsyncSessionLocal() as session:
        session.add(new_order)
        await session.commit()
        await session.refresh(new_order)
        return new_order


@router.get("/get/{order_id}", response_model=OrderOutputData)
async def get_order(order_id: int, current_user: User = Depends(get_current_user_release)):
    async with AsyncSessionLocal() as session:
        result = await session.execute(
            select(Order).where(Order.user_id == current_user.id, Order.id == order_id)
        )
        order = result.scalar_one_or_none()

        if not order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Заказ не найден!")

        return order


@router.get("/all/{client_id}", response_model=List[OrderOutputData])
async def get_all_orders_by_client(client_id: int, current_user: User = Depends(get_current_user_release)):
    async with AsyncSessionLocal() as session:
        result = await session.execute(
            select(Order).where(Order.user_id == current_user.id, Order.client_id == client_id)
        )
        orders = result.scalars().all()


@router.put("/update/{order_id}", response_model=OrderOutputData)
async def update_order(order_id: int, data: OrderInputData, current_user: User = Depends(get_current_user_release)):
    async with AsyncSessionLocal() as session:
        result = await session.execute(
            select(Order).where(Order.user_id == current_user.id, Order.id == order_id)
        )
        order = result.scalar_one_or_none()

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

        await session.commit()
        await session.refresh(order)

        return order


@router.delete("/delete/{order_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_order(order_id: int, current_user: User = Depends(get_current_user_release)):
    async with AsyncSessionLocal() as session:
        result = await session.execute(
            select(Order).where(Order.user_id == current_user.id, Order.id == order_id)
        )
        order = result.scalar_one_or_none()

        if not order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Заказ не найден!",
            )

        await session.delete(order)
        await session.commit()
