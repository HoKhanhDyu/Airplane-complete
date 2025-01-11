from passlib.context import CryptContext

argon_context = CryptContext(schemes=["argon2"], deprecated="auto")
def get_password_hash(password: str) -> str:
    # Sử dụng argon_context để băm mật khẩu
    return argon_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    # Sử dụng argon_context để xác minh mật khẩu
    return argon_context.verify(plain_password, hashed_password)