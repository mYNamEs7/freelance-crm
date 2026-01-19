from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from config import DATABASE_URL


engine = create_engine(DATABASE_URL, connect_args={'check_same_thread': False})
Base = declarative_base()
Session = sessionmaker(bind=engine, autoflush=False, autocommit=False)

def create_db():
    Base.metadata.create_all(engine)

def get_db():
    db = Session()
    try:
        yield db
    finally:
        db.close()
