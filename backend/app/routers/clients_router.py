from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from models.client_table import Client
from models.orders_table import Order
from schemas.client_scheme import ClientInputData, ClientOutputData
from typing import List
from models.user_table import User
from security.jwt import get_current_user_test

router = APIRouter(prefix="/clients", tags=["Clients"])


@router.post("/add")
def add_client(data: ClientInputData, db: Session = Depends(get_db), current_user: User = Depends(get_current_user_test)):
    new_client = Client(user_id=current_user.id, name=data.name,
                        contact=data.contact, notes=data.notes)
    db.add(new_client)
    db.commit()
    db.refresh(new_client)
    return new_client


@router.get("/get/{client_id}", response_model=ClientOutputData)
def get_client(client_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user_test)):
    client = db.query(Client).filter(Client.user_id ==
                                     current_user.id, Client.id == client_id).first()

    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Клиент не найден!")

    return client


@router.get("/all", response_model=List[ClientOutputData])
def get_all_clients(db: Session = Depends(get_db), current_user: User = Depends(get_current_user_test)):
    return db.query(Client).filter(Client.user_id == current_user.id).all()


@router.put("/update/{client_id}", response_model=ClientOutputData)
def get_client(client_id: int, data: ClientInputData, db: Session = Depends(get_db), current_user: User = Depends(get_current_user_test)):
    client = db.query(Client).filter(Client.user_id ==
                                     current_user.id, Client.id == client_id).first()

    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Клиент не найден!")

    client.name = data.name
    client.contact = data.contact
    client.notes = data.notes

    db.commit()
    db.refresh(client)

    return client


@router.delete("/delete/{client_id}", status_code=status.HTTP_204_NO_CONTENT)
def get_client(client_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user_test)):
    orders = db.query(Order).filter(Order.user_id ==
                                    current_user.id, Order.client_id == client_id).all()
    client = db.query(Client).filter(Client.user_id ==
                                     current_user.id, Client.id == client_id).first()

    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Клиент не найден!")

    if orders:
        for order in orders:
            db.delete(order)

    db.delete(client)
    db.commit()
