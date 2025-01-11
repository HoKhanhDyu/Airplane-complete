from core.auth import oauth2_bearer
from fastapi import HTTPException, status, Depends, Header
from core.auth import oauth2_bearer
from typing import Optional

from jose import jwt, JWTError
from models import User, Permission, RolePermission, UserPermission
from sqlalchemy.orm import Session
from api.deps import SessionDep
from core.config import settings
import logging
from typing import List
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
def get_current_user(db: SessionDep , token: str = Depends(oauth2_bearer)) -> User:
    # with open("/backend/log.txt", "a") as f:
    #     f.write(token)

    logger.info(token)  # Ghi log thay vì in
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        user_id: int = payload.get("id")
        if email is None or user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token",
                headers={"WWW-Authenticate": "Bearer"},
            )
        # Lấy thông tin user từ database
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return user
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

# def get_current_user(db: SessionDep, token: str = Depends(oauth2_bearer)) -> User:
#     if authorization is None:
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Authorization token is missing",
#             headers={"WWW-Authenticate": "Bearer"},
#         )
#     try:
#         token = authorization.split(" ")[1]  # Lấy token sau "Bearer"
#         payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
#         email: str = payload.get("sub")
#         user_id: int = payload.get("id")
#         if email is None or user_id is None:
#             raise HTTPException(
#                 status_code=status.HTTP_401_UNAUTHORIZED,
#                 detail="Invalid token",
#                 headers={"WWW-Authenticate": "Bearer"},
#             )
#         # Lấy thông tin user từ database
#         user = db.query(User).filter(User.id == user_id).first()
#         if not user:
#             raise HTTPException(
#                 status_code=status.HTTP_401_UNAUTHORIZED,
#                 detail="User not found",
#                 headers={"WWW-Authenticate": "Bearer"},
#             )
#         return user
#     except JWTError:
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Could not validate credentials",
#             headers={"WWW-Authenticate": "Bearer"},
#         )
    

def has_permission(permissions_name: List[str]):
    async def dependency(
        session: SessionDep,
        current_user: User = Depends(get_current_user),
    ):
        return True
        # Lấy danh sách quyền từ Role
        role_permissions = (
            session.query(Permission)
            .join(RolePermission, Permission.id == RolePermission.permission_id)
            .filter(
                RolePermission.role_id.in_([role.id for role in current_user.roles])
            )
            .all()
        )

        # Lấy danh sách quyền trực tiếp từ UserPermission
        user_permissions = (
            session.query(Permission)
            .join(UserPermission, Permission.id == UserPermission.permission_id)
            .filter(UserPermission.user_id == current_user.id)
            .all()
        )

        # Kết hợp tất cả các quyền
        all_permissions = set([perm.name for perm in role_permissions + user_permissions])

        # Kiểm tra nếu quyền được yêu cầu có trong danh sách
        for permission_name in permissions_name:
            if permission_name not in all_permissions:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Permission denied",
                )
        
        return True

    return dependency
