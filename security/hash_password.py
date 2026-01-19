from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_pwd(password: str) -> str:
    return pwd_context.hash(password)

def verify_pwd(password: str, password_hash: str) -> bool:
    return pwd_context.verify(password, password_hash)