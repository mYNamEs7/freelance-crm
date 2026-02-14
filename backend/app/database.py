from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy.orm import declarative_base
from app.config import DATABASE_URL

engine = create_async_engine(DATABASE_URL, echo=False)
AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False)
Base = declarative_base()

# Импорт моделей после Base, чтобы create_all видел все таблицы
from app.models import user_table, client_table, orders_table, payments_table  # noqa: F401


async def create_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)