from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta

from app.database import get_db
from app.models.user_table import User
from app.security.hash_password import verify_pwd
from app.security.jwt import create_access_token, get_current_user_test
from app.config import ACCESS_TOKEN_EXPIRE_MINUTES
from app.schemas.auth_scheme import LoginOutputData, LoginInputData
from app.schemas.user_scheme import UserOutputData

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/login", response_model=LoginOutputData)
def login(data: LoginInputData, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()

    if not user or not verify_pwd(data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверный username или пароль"
        )

    access_token = create_access_token(
        data={"sub": str(user.id)},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


@router.get("/me", response_model=UserOutputData)
def get_me(current_user: User = Depends(get_current_user_test)):
    return {
        "username": current_user.username,
        "email": current_user.email
    }
