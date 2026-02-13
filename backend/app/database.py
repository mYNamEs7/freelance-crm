from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy.orm import declarative_base
from backend.app.config import DATABASE_URL


engine = create_async_engine(DATABASE_URL, echo=False)
Session = async_sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()

def create_db():
    Base.metadata.create_all(engine)

def get_db():
    db = Session()
    try:
        yield db
    finally:
        db.close()
