from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer
# Khởi tạo crypt context với thuật toán argon2
argon_context = CryptContext(schemes=["argon2"], deprecated="auto")
oauth2_bearer = OAuth2PasswordBearer(tokenUrl='/api/auth/token')