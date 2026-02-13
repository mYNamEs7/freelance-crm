from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import create_db
from routers.user_router import router as user_router
from routers.auth_router import router as auth_router
from routers.clients_router import router as clients_router
from routers.orders_router import router as orders_router
from routers.payments_router import router as payments_router


app = FastAPI(title="Freelance CRM")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://freelance-di5j6jk9b-mynames7s-projects.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],  # GET, POST, PUT, DELETE и т.д.
    allow_headers=["*"],  # Authorization, Content-Type и т.д.
)

create_db()


@app.get("/health")
def health_check():
    return {"status": "ok"}


app.include_router(user_router)
app.include_router(auth_router)
app.include_router(clients_router)
app.include_router(orders_router)
app.include_router(payments_router)
