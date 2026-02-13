from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_pwd(password: str) -> str:
    password_bytes = password.encode("utf-8")
    return pwd_context.hash(password_bytes)

def verify_pwd(password: str, password_hash: str) -> bool:
    password_bytes = password.encode("utf-8")
    return pwd_context.verify(password_bytes, password_hash)