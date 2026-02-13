from fastapi import APIRouter, Depends
from app.database import AsyncSessionLocal
from app.security.hash_password import hash_pwd
from app.models.user_table import User
from app.schemas.user_scheme import UserInputData, UserOutputData
from app.security.jwt import get_current_user_release

router = APIRouter(prefix="/user", tags=["User"])


@router.post("/register")
async def create_user(user: UserInputData):
    hashed_password = hash_pwd(user.password)
    new_user = User(username=user.username, email=user.email,
                    password_hash=hashed_password)
    
    async with AsyncSessionLocal() as session:
        session.add(new_user)
        await session.commit()
        await session.refresh(new_user)

        return {
            "id": new_user.id,
            "username": new_user.username,
            "email": new_user.email
        }


@router.get("/me", response_model=UserOutputData)
def get_user(current_user: User = Depends(get_current_user_release)):
    return {
        "username": current_user.username,
        "email": current_user.email
    }
