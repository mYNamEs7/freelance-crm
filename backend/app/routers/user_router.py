from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from security.hash_password import hash_pwd
from models.user_table import User
from schemas.user_scheme import UserInputData, UserOutputData
from security.jwt import get_current_user_test

router = APIRouter(prefix="/user", tags=["User"])


@router.post("/register")
def create_user(user: UserInputData, db: Session = Depends(get_db)):
    # зашифровали
    hashed_password = hash_pwd(user.password)
    # создали
    new_user = User(username=user.username, email=user.email,
                    password_hash=hashed_password)
    # добавили
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"Пользователь создан!"}


@router.get("/me", response_model=UserOutputData)
def get_user(db: Session = Depends(get_db), current_user: User = Depends(get_current_user_test)):
    return {
        "username": current_user.username,
        "email": current_user.email
    }
