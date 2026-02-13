from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from app.models.client_table import Client
from app.models.orders_table import Order
from app.schemas.client_scheme import ClientInputData, ClientOutputData
from typing import List
from app.models.user_table import User
from app.security.jwt import get_current_user_release
from app.database import AsyncSessionLocal

router = APIRouter(prefix="/clients", tags=["Clients"])


@router.post("/add")
async def add_client(data: ClientInputData, current_user: User = Depends(get_current_user_release)):
    new_client = Client(user_id=current_user.id, name=data.name,
                        contact=data.contact, notes=data.notes)
    
    async with AsyncSessionLocal() as session:
        session.add(new_client)
        await session.commit()
        await session.refresh(new_client)
        return new_client


@router.get("/get/{client_id}", response_model=ClientOutputData)
async def get_client(client_id: int, current_user: User = Depends(get_current_user_release)):
    async with AsyncSessionLocal() as session:
        result = await session.execute(
            select(Client).where(Client.user_id == current_user.id, Client.id == client_id)
        )
        client = result.scalar_one_or_none()

        if not client:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Клиент не найден!")

        return client


@router.get("/all", response_model=List[ClientOutputData])
async def get_all_clients(current_user: User = Depends(get_current_user_release)):
    async with AsyncSessionLocal() as session:
        result = await session.execute(
            select(Client).where(Client.user_id == current_user.id)
        )
        clients = result.scalars().all()
        return clients


@router.put("/update/{client_id}", response_model=ClientOutputData)
async def get_client(client_id: int, data: ClientInputData, current_user: User = Depends(get_current_user_release)):
    async with AsyncSessionLocal() as session:
        result = await session.execute(
            select(Client).where(Client.user_id == current_user.id, Client.id == client_id)
        ) 
        client = result.scalar_one_or_none()

        if not client:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Клиент не найден!")

        client.name = data.name
        client.contact = data.contact
        client.notes = data.notes

        await session.commit()
        await session.refresh(client)

        return client


@router.delete("/delete/{client_id}", status_code=status.HTTP_204_NO_CONTENT)
async def get_client(client_id: int, current_user: User = Depends(get_current_user_release)):
    async with AsyncSessionLocal() as session:
        result = await session.execute(
            select(Order).where(Order.user_id == current_user.id, Order.client_id == client_id)
        )
        orders = result.scalars().all()

        result = await session.execute(
            select(Client).where(Client.user_id == current_user.id, Client.id == client_id)
        )
        client = result.scalars().all()

        if not client:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Клиент не найден!")

        if orders:
            for order in orders:
                await session.delete(order)

        await session.delete(client)
        await session.commit()
