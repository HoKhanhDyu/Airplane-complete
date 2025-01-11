from fastapi import APIRouter, Depends, HTTPException, status, Cookie, Response, Form
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel
from api.deps import SessionDep
from typing import Annotated
from datetime import timedelta
from models import RefreshToken
from core.security import create_access_token, validate_refresh_token, verify_password, create_refresh_token, store_refresh_token
from datetime import datetime, timedelta
from crud.user import get_user_by_email
from core.config import settings
from fastapi.responses import JSONResponse
from models import User
import json
from api.routes.user import UserLogin
# from fastapi_login import LoginManager
# from fastapi_login.exceptions import InvalidCredentialsException
# from requests_oauthlib import OAuth2Session
# import os

router = APIRouter()

class Token(BaseModel):
    access_token: str
    token_type: str

# Đường dẫn để lấy token JWT
@router.post("/token", response_model=Token)
async def login_for_access_token(session: SessionDep, form_data: OAuth2PasswordRequestForm = Depends()  ):
    # Kiểm tra client_id và client_secret (có thể kiểm tra từ database hoặc file cấu hình)
    # if client_id != "your_client_id" or client_secret != "your_client_secret":
    #     raise HTTPException(status_code=401, detail="Invalid client_id or client_secret")
    db_user = get_user_by_email(session, form_data.username)
    if not db_user or not verify_password(form_data.password, db_user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    refresh_token_expires = timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    # Tạo access token
    access_token = create_access_token(
        email=db_user.email,
        user_id=db_user.id,
        expires_delta=access_token_expires
    )

    refresh_token = create_refresh_token(
        email=db_user.email,
        user_id=db_user.id,
        expires_delta=refresh_token_expires
    )    
    # Lưu refresh token vào cơ sở dữ liệu
    refresh_token_expiration = datetime.now() + refresh_token_expires
    store_refresh_token(session, user_id=db_user.id, refresh_token=refresh_token, expires_at=refresh_token_expiration)
    
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/token/refresh")
def refresh_access_token(
    db: SessionDep,
    response: Response,
    refresh: str = Cookie(default=None),
):
    if not refresh:
        raise HTTPException(status_code=400, detail="Refresh token missing in cookies")

    # Xác thực refresh token
    db_refresh_token = validate_refresh_token(db, refresh)

    # Lấy thông tin user từ cơ sở dữ liệu
    user = db.query(User).filter(User.id == db_refresh_token.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Tạo access token mới
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    new_access_token = create_access_token(
        email=user.email,  # Sử dụng email của user
        user_id=user.id,
        expires_delta=access_token_expires
    )

    content = {
        "access": new_access_token,
    }
    response = JSONResponse(content=content)
    response.set_cookie(
        key="access",
        value=new_access_token,
        httponly=False,
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        secure=True,
        samesite="none"
    )

    return response