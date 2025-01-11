from argon2.exceptions import VerifyMismatchError
from sqlalchemy.orm import Session
from datetime import timedelta, datetime, timezone  
from typing import Annotated
from models import User, RefreshToken
from fastapi import HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer
import os
from jose import jwt, JWTError
from core.utils import verify_password
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
# Khởi tạo CryptContext với argon2

oauth2_bearer = OAuth2PasswordBearer(tokenUrl='/api/auth/token')

def create_access_token(email: str, user_id: int, expires_delta: timedelta):
    
    # expires = datetime.now(datetime.timezone.utc) + expires_delta
    expires = datetime.now(timezone.utc) + expires_delta  
    encode = {'sub': email, 'id': user_id, 'exp': expires}
    access_token = jwt.encode(encode, SECRET_KEY, algorithm=ALGORITHM)
    return access_token
    
def create_refresh_token(email: str, user_id: int, expires_delta: timedelta):
    expires = datetime.now(timezone.utc) + expires_delta
    encode = {'sub': email, 'id': user_id, 'exp': expires}
    refresh_token = jwt.encode(encode, SECRET_KEY, algorithm=ALGORITHM)
    return refresh_token

def revoke_refresh_token(db: Session, refresh_token: str):
    """
    Thu hồi (revoked) một refresh token trong cơ sở dữ liệu.

    Hàm này tìm kiếm refresh token trong cơ sở dữ liệu, nếu tìm thấy,
    nó sẽ đánh dấu refresh token là đã bị thu hồi bằng cách thay đổi giá trị
    của trường `revoked` thành `True`. Sau khi thay đổi, hàm sẽ commit thay đổi vào cơ sở dữ liệu.

    Args:
        db (Session): Phiên làm việc của SQLAlchemy để tương tác với cơ sở dữ liệu.
        refresh_token (str): Refresh token cần được thu hồi.

    Raises:
        HTTPException: Nếu không tìm thấy refresh token trong cơ sở dữ liệu, một ngoại lệ sẽ được ném ra.
    """
    db_refresh_token = db.query(RefreshToken).filter(RefreshToken.refresh_token == refresh_token).first()
    if db_refresh_token:
        db_refresh_token.revoked = True
        db.commit()
    else:
        raise HTTPException(status_code=404, detail="Refresh token not found")

def validate_refresh_token(db: Session, refresh_token: str):
    """
    Xác thực một refresh token trong cơ sở dữ liệu.

    Hàm này sẽ giải mã refresh token sử dụng JWT, kiểm tra tính hợp lệ của token
    trong cơ sở dữ liệu, bao gồm việc xác minh:
    - Refresh token có tồn tại trong cơ sở dữ liệu.
    - Refresh token chưa bị thu hồi (revoked).
    - Refresh token chưa hết hạn.
    
    Nếu một trong các điều kiện trên không được thỏa mãn, hàm sẽ ném ra ngoại lệ HTTPException.
    Nếu tất cả các kiểm tra đều hợp lệ, hàm sẽ trả về đối tượng refresh token từ cơ sở dữ liệu.

    Args:
        db (Session): Phiên làm việc của SQLAlchemy để tương tác với cơ sở dữ liệu.
        refresh_token (str): Refresh token cần được xác thực.

    Returns:
        RefreshToken: Đối tượng refresh token nếu nó hợp lệ.

    Raises:
        HTTPException: Nếu refresh token không hợp lệ, bị thu hồi hoặc hết hạn, một ngoại lệ HTTPException sẽ được ném ra với mã lỗi 401.
        JWTError: Nếu giải mã JWT thất bại, một ngoại lệ HTTPException với mã lỗi 401 sẽ được ném ra.
    """
    try:
        payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("id")
        
        # Kiểm tra refresh token trong cơ sở dữ liệu
        db_refresh_token = db.query(RefreshToken).filter(RefreshToken.user_id == user_id, RefreshToken.refresh_token == refresh_token).first()
        if not db_refresh_token:
            raise HTTPException(status_code=401, detail="Invalid refresh token")
        if db_refresh_token.revoked:
            raise HTTPException(status_code=401, detail="Refresh token revoked")
        if db_refresh_token.expires_at < datetime.now(timezone.utc):  # Thay đổi ở đây
            raise HTTPException(status_code=401, detail="Refresh token expired")
        
        return db_refresh_token
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

def store_refresh_token(db: Session, user_id: int, refresh_token: str, expires_at: datetime):
    """
    Lưu trữ refresh token vào cơ sở dữ liệu.

    Hàm này tạo một đối tượng `RefreshToken` mới với thông tin người dùng, refresh token,
    và thời gian hết hạn của token, sau đó thêm đối tượng này vào cơ sở dữ liệu.
    Sau khi commit và refresh, hàm trả về đối tượng refresh token đã được lưu.

    Args:
        db (Session): Phiên làm việc của SQLAlchemy để tương tác với cơ sở dữ liệu.
        user_id (int): ID của người dùng để liên kết với refresh token.
        refresh_token (str): Refresh token cần lưu trữ.
        expires_at (datetime): Thời gian hết hạn của refresh token.

    Returns:
        RefreshToken: Đối tượng refresh token đã được lưu trữ trong cơ sở dữ liệu.

    Raises:
        SQLAlchemyError: Nếu có lỗi xảy ra trong quá trình thêm vào cơ sở dữ liệu.
    """
    db_refresh_token = RefreshToken(
        user_id=user_id,
        refresh_token=refresh_token,
        expires_at=expires_at
    )
    db.add(db_refresh_token)
    db.commit()
    db.refresh(db_refresh_token)
    return db_refresh_token

def authenticate_user(email: str, password: str, db: Session):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        return False
    if not verify_password(password, user.password):
        return False
    if not user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Email not verified"
        )
    return user


def get_current_user(token: Annotated[str, Depends(oauth2_bearer)]):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("id")
        email: str = payload.get("sub")
        if user_id is None or email is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")

        return {"email:": email, "id": user_id}
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    

