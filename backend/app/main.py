from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import create_db
from app.config import CORS_ORIGINS
from app.routers.user_router import router as user_router
from app.routers.auth_router import router as auth_router
from app.routers.clients_router import router as clients_router
from app.routers.orders_router import router as orders_router
from app.routers.payments_router import router as payments_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    await create_db()
    yield


app = FastAPI(title="Freelance CRM", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {"status": "ok"}


app.include_router(user_router)
app.include_router(auth_router)
app.include_router(clients_router)
app.include_router(orders_router)
app.include_router(payments_router)
