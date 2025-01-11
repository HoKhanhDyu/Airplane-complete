from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Request, Query, status, Response, Cookie
from datetime import timedelta, datetime
from fastapi.responses import JSONResponse

from fastapi import status, Path, Request
from crud.user import update_user_password

import json
from sqlmodel import col, delete, func, select
from api.deps import SessionDep
from pydantic import BaseModel
from crud.user_role import assign_role_to_user, get_roles_by_user_id, remove_role_from_user
from crud.user import create_user, get_user_by_email, get_user_by_id, update_user_verification, get_user_roles, user_has_role, update_user, get_all_staffs
from core.security import verify_password
import random  # Sử dụng để tạo mã OTP
import time
import pyotp
from core.config import redis_client
from models import *
from core.email_conf import send_email
import shutil
import hashlib
from core.config import settings
from core.security import verify_password, create_access_token, create_refresh_token, store_refresh_token, revoke_refresh_token
from core.permissions import has_permission
from enum import Enum
from core.permissions import get_current_user

class UserCreate(BaseModel):
    full_name: str
    email: str
    password: str

class RoleOfUser(str, Enum):
    ADMIN = "ADMIN"
    CUSTOMER = "CUSTOMER"
    STAFF = "STAFF"

class SuperUserCreate(BaseModel):
    full_name: str
    email: str
    password: str
    role: RoleOfUser
    

class UserLogin(BaseModel):
    email: str
    password: str

class UserRead(BaseModel):
    id: int
    full_name: str
    email: str

router = APIRouter()



# Hàm để hash email
def hash_email(email: str) -> str:
    return hashlib.sha256(email.encode()).hexdigest()


def generate_otp_email_body(otp: str, description: str = "Thank you for choosing yourbrand. Use the following OTP to complete your Sign Up procedures. OTP is valid for 5 minutes") -> str:
    """
    Tạo nội dung HTML cho email với mã OTP được truyền vào.
    """
    return f"""
    <html>
    <body>
        <div style="font-family: Helvetica,Arial,sans-serif;min-width:730px;overflow:auto;line-height:2">
            <div style="margin-top:10px;width:100%;">
                <div style="border-bottom:1px solid #eee">
                <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Yourbrand</a>
                </div>
                <p style="font-size:1.1em">Hi,</p>
                <p>{description}</p>
                <div style="display: flex; gap: 10px; height: 25px;">
                <span style="margin-right: 10px; text-align: center; color: red;     display: inline-block; text-align: center; border-radius: 4px; border: 1px solid #000;  width: 25px;
            height: 25px;
            box-sizing: border-box;">{otp[0]}</span>
                <span style="margin-right: 10px; color: red; text-align: center;     display: inline-block; text-align: center; border-radius: 4px; border: 1px solid #000;  width: 25px;
            height: 25px;
            box-sizing: border-box;">{otp[1]}</span>
                <span style="margin-right: 10px; color: red; text-align: center;     display: inline-block; text-align: center; border-radius: 4px; border: 1px solid #000;  width: 25px;
            height: 25px;
            box-sizing: border-box;">{otp[2]}</span>
                <span style="margin-right: 10px; color: red; text-align: center;     display: inline-block; text-align: center; border-radius: 4px; border: 1px solid #000;  width: 25px;
            height: 25px;
            box-sizing: border-box;">{otp[3]}</span>
                <span style="margin-right: 10px; color: red; text-align: center;     display: inline-block; text-align: center; border-radius: 4px; border: 1px solid #000;  width: 25px;
            height: 25px;
            box-sizing: border-box;">{otp[4]}</span>
                <span style="margin-right: 10px; color: red; text-align: center;     display: inline-block; text-align: center; border-radius: 4px; border: 1px solid #000;  width: 25px;
            height: 25px;
            box-sizing: border-box;">{otp[5]}</span>
                </div>
                <p style="font-size:0.9em;">Regards,<br />Yourbrand</p>
                <hr style="border:none;border-top:1px solid #eee" />
                <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
                <p>KTX khu B</p>
                <p>Mạc Đĩnh Chi</p>
                <p>Bình Dương</p>
                </div>
            </div>
        </div>
    </body>
    </html>
    """

@router.put("/init_admin")
def create_fisrt_admin_user(db: SessionDep):

    db_user = get_user_by_email(db, "admin@gmail.com")
    if db_user:
        return db_user

    user = UserCreate(
        full_name="admin",
        email="admin@gmail.com",
        password="admin"
    )
    new_user = create_user(db=db, user=user, role_name="ADMIN")

    return new_user

@router.post("/send-otp")
async def send_email_route(email: str):
    # Hash email để lưu trữ OTP
    hashed_email = hash_email(email)
    
    # Kiểm tra nếu OTP đã tồn tại trong Redis
    if redis_client.exists(hashed_email):
        return {"message": "OTP đã được gửi trước đó. Vui lòng kiểm tra email của bạn.", "status": "EXIST"}
    
    # Nếu OTP chưa tồn tại trong Redis, tạo mã OTP mới và lưu vào Redis
    secret = pyotp.random_base32()
    totp = pyotp.TOTP(secret)
    otp = totp.now()  # Lấy mã OTP hiện tại
    expiration_time = 5 * 60  # Thời gian sống của OTP là 5 phút
    
    # Lưu mã OTP vào Redis với thời gian sống 5 phút
    redis_client.set(hashed_email, otp, ex=expiration_time)
    
    # Gửi email với mã OTP
    subject = f'[IMPORTANT] Please enter this OTP to authenticate your account!'
    body = generate_otp_email_body(otp)
    
    try:
        # Gọi hàm send_email từ đây
        await send_email(email, subject, body)
        return {"message": "OTP được gửi thành công", "status": "SUCCESS"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


class UserOTP(BaseModel):
    user_email: str
    otp: str

@router.post("/register")
async def register_user_route(user: UserCreate, db: SessionDep):
    # Kiểm tra xem người dùng đã tồn tại trong cơ sở dữ liệu hay chưa
    db_user = get_user_by_email(db, user.email)
    
    if db_user:
        if db_user.is_verified:  # Nếu người dùng đã xác thực email
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered and verified.",
            )
        else:  # Nếu người dùng chưa xác thực
            secret = pyotp.random_base32()
            totp = pyotp.TOTP(secret)
            otp = totp.now()  # Lấy mã OTP hiện tại
            
            # Hash email trước khi lưu vào Redis
            hashed_email = hash_email(user.email)
            expiration_time = 5 * 60  # Thời gian sống của OTP là 5 phút (300 giây)
            
            # Lưu mã OTP vào Redis với thời gian sống 5 phút
            redis_client.set(hashed_email, otp, ex=expiration_time)
            subject = f'[IMPORTANT] Please enter this OTP to authenticate your account!'
            body = generate_otp_email_body(otp)
            try:
                # Gọi hàm send_email từ đây
                await send_email(user.email, subject, body)
                return {"message": "Email already registered but not verified.", "status": "PENDING"}
            except Exception as e:
                raise HTTPException(status_code=500, detail=str(e))
            
    # Nếu người dùng chưa tồn tại, tạo tài khoản mới
    new_user = create_user(db=db, user=user)  # Tạo tài khoản người dùng mới
    secret = pyotp.random_base32()
    totp = pyotp.TOTP(secret)
    otp = totp.now()  # Lấy mã OTP hiện tại
    
    # Hash email trước khi lưu vào Redis
    hashed_email = hash_email(user.email)
    expiration_time = 5 * 60  # Thời gian sống của OTP là 5 phút (300 giây)
    
    # Lưu mã OTP vào Redis với thời gian sống 5 phút
    redis_client.set(hashed_email, otp, ex=expiration_time)

    
    try:
        # Gọi hàm send_email từ đây
        subject = f'[IMPORTANT] Please enter this OTP to authenticate your account!'
        body = generate_otp_email_body(otp)
        await send_email(user.email, subject, body)
        return {"message": "User created successfully.", "status": "CREATE", "user": new_user}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/add-admin-user")
async def register_user_route(user: SuperUserCreate, db: SessionDep, has_permission: bool = Depends(has_permission(['ADMIN']))):
    # Kiểm tra xem người dùng đã tồn tại trong cơ sở dữ liệu hay chưa
    db_user = get_user_by_email(db, user.email)
    
    if db_user:
        if db_user.is_verified:  # Nếu người dùng đã xác thực email
            if not user_has_role(db, db_user.id, user.role):
                assign_role_to_user(db, user_id=db_user.id, role_name=user.role)
                return {"message": "User is already registered and verified. Admin role assigned successfully.", "status": "ASSIGN_ROLE"}


            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered and verified.",
            )
        
        else:  # Nếu người dùng chưa xác thực
            update_user_verification(db, db_user)  # Cập nhật thông tin người dùng
            assign_role_to_user(db, user_id=db_user.id, role_name=user.role)
            return {"message": "Email already registered but not verified. User verified successfully.", "status": "VERIFY"}
        
    
    # Nếu người dùng chưa tồn tại, tạo tài khoản mới
    new_user = create_user(db=db, user=user, role_name=user.role)  # Tạo tài khoản người dùng mới

    return {"message": "User created successfully.", "status": "CREATE", "user": new_user}


@router.post("/verify-otp")
async def verify_otp_route(userOTP: UserOTP, db: SessionDep):
    hashed_email = hash_email(userOTP.user_email)

    # Kiểm tra xem email đã được lưu vào Redis chưa
    stored_otp = redis_client.get(hashed_email)
    if stored_otp:
        stored_otp = stored_otp.decode('utf-8')
    print("stored_otp: ", stored_otp)
    if not stored_otp:
        raise HTTPException(status_code=404, detail="OTP not found or expired")

    # Xác thực mã OTP
    if userOTP.otp == stored_otp:
        redis_client.delete(hashed_email)  # Xóa OTP sau khi xác thực thành công
        
        user = get_user_by_email(db, userOTP.user_email)
        if user:
            user.is_verified = True
            update_user_verification(db, user)  # Cập nhật thông tin người dùng
            return {"message": "OTP verified successfully, user is now verified."}
        else:
            raise HTTPException(status_code=404, detail="User not found")
    else:
        raise HTTPException(status_code=400, detail="Invalid OTP")

@router.put("/{user_id}", response_model=UserRead)
def update_user_route(user_id: int, user: UserCreate, db: SessionDep, current_user: User = Depends(get_current_user)):
    if current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Permission denied")

    db_user = get_user_by_id(db, user_id)  # Giả sử bạn đã có hàm này để lấy người dùng theo ID

    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    # Cập nhật thông tin người dùng
    db_user.full_name = user.full_name
    db_user.email = user.email
    db_user.password = user.password  # Cần mã hóa password nếu có

    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return db_user

@router.delete("/{user_id}", status_code=204)
def delete_user_route(user_id: int, db: SessionDep, has_permission: bool = Depends(has_permission(['ADMIN']))):

    if not has_permission:
        raise HTTPException(status_code=403, detail="Permission denied")

    db_user = get_user_by_id(db, user_id)  # Giả sử bạn đã có hàm này để lấy người dùng theo ID

    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    db.delete(db_user)
    db.commit()
    return  # Trả về None cho mã trạng thái 204

@router.get("/", response_model=List[UserRead])
def get_all_users_route(db: SessionDep, has_permission: bool = Depends(has_permission(['ADMIN']))):

    if not has_permission:
        raise HTTPException(status_code=403, detail="Permission denied")

    users = db.exec(select(User)).all()  # Giả sử bạn đã có mô hình User trong SQLModel
    return users

from fastapi import UploadFile, File
import shutil

@router.post("/upload-profile-picture/{user_id}")
async def upload_profile_picture(user_id: int, file: UploadFile = File(...), current_user: User = Depends(get_current_user)):
    if current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Permission denied")

    upload_folder = f"./uploads/profile_pictures/"
    file_location = f"{upload_folder}{user_id}.jpg"

    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Cập nhật đường dẫn vào cơ sở dữ liệu
    # update_user_profile_picture(user_id, f"/uploads/profile_pictures/{user_id}.jpg")
    return {"info": f"file '{file.filename}' saved at '{file_location}'"}


@router.get("/roles/{user_id}")
def get_user_roles_route(user_id: int, db: SessionDep):
    roles = get_user_roles(db, user_id)
    return roles

@router.post("/login")
def login_user(user: UserLogin, db: SessionDep):
    # Lấy thông tin user từ database
    db_user = get_user_by_email(db, user.email)
    if not db_user or not verify_password(user.password, db_user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    # Tạo access token và refresh token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    refresh_token_expires = timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)

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

    # Lưu refresh token vào database
    refresh_token_expiration = datetime.now() + refresh_token_expires
    store_refresh_token(db, user_id=db_user.id, refresh_token=refresh_token, expires_at=refresh_token_expiration)
    
    content = {
        "access": access_token,
        "refresh": refresh_token
    }
    response = JSONResponse(content=content)
    
    # Đặt cookie cho access token và refresh token
    response.set_cookie(
        key="access",
        value=access_token,
        httponly=False,
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        secure=True,
        samesite="none",
    )
    response.set_cookie(
        key="refresh",
        value=refresh_token,
        httponly=False,
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,
        secure=True,
        samesite="none",
    )

    return response

@router.post("/logout")
def logout_user(response: Response, db: SessionDep, refresh: str = Cookie(default=None)):
    if not refresh:
        raise HTTPException(status_code=400, detail="Refresh token missing in cookies")
    
    # Xóa refresh token khỏi database

    revoke_refresh_token(db, refresh)
    
    response.delete_cookie(key="access")
    response.delete_cookie(key="refresh")
    return {"message": "Logout successful"}

class Employee(BaseModel):
    name: str = None
    id: int = None
    email: str  = None
    phone: str = None
    startDate: datetime= None
    status: str= None
    gender: str= None
    birthDate: str= None
    address: str= None
    position: str= None
    idNumber: str= None
    department: str= None
    flightsHandled: int= None
    revenueGenerated: str= None

# class User(SQLModel, table=True):
#     id: Optional[int] = Field(default=None, primary_key=True)
#     full_name: str = Field(description="The full name of the user")
#     email: str = Field(description="The email of the user", index=True, unique=True)
#     password: str = Field(description="The password of the user")
#     is_verified: bool = Field(default=False, description="Indicates if the user has verified their email")
#     created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), description="Timestamp when the user was created")
#     updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), description="Timestamp when the user was last updated") 
#     last_login: Optional[datetime] = Field(default=None, description="Timestamp of the user's last login")
#     profile_picture: Optional[str] = Field(default=None, description="URL or path of the user's profile picture")
#     phone_number: Optional[str] = Field(default=None, description="The phone number of the user")
#     status: UsetStatus = Field(default=UsetStatus.ACTIVE, description="The status of the user (active, blocked)")
#     gender: Optional[str] = Field(default=None, description="Giới tính")
#     birth_date: Optional[datetime] = Field(default=None, description="Ngày sinh")
#     address: Optional[str] = Field(default=None, description="Địa chỉ")
#     position: Optional[str] = Field(default=None, description="Vị trí")
#     id_number: Optional[str] = Field(default=None, description="Số CMND")
#     department: Optional[str] = Field(default=None, description="Phòng ban")
#     flights_handled: Optional[int] = Field(default=None, description="Số chuyến bay đã xử lý")
#     revenue_generated: Optional[str] = Field(default=None, description="Doanh thu đã tạo ra")

@router.get("/info", response_model=Employee)
async def get_employee_info(session: SessionDep, user: User = Depends(get_current_user)):
    employee = Employee(
        name=user.full_name,
        id=user.id,
        email=user.email,
        startDate=user.created_at,
        phone=user.phone_number or 'N/A',
        status=user.status or 'N/A',
        gender=user.gender or 'N/A',
        birthDate=user.birth_date or 'N/A',
        address=user.address or 'N/A',
        position=user.position or 'N/A',
        idNumber=user.id_number or 'N/A',
        department=user.department or 'N/A',
        flightsHandled=user.flights_handled or 0,
        revenueGenerated=user.revenue_generated or '0',
    )
    return employee

@router.put("/info/{user_id}", response_model=Employee)
async def update_employee_info(user_id:int, employee: Employee, session: SessionDep, user: User = Depends(get_current_user)):
    info = {
        "full_name": employee.name,
        "phone_number": employee.phone,
        "gender": employee.gender,
        "address": employee.address,
        "id_number": employee.idNumber,
        "birth_date": (
            datetime.fromisoformat(employee.birthDate.replace("Z", "+00:00"))
            if employee.birthDate
            else None  # Ngày mặc định
        ),
    }
    db_user = update_user(session, user_id, info)
    return employee

class StaffInfo(BaseModel):
    name: str
    email: str
    StaffID: int

@router.get("/staffs", response_model=List[StaffInfo])
async def get_staffs(session: SessionDep, has_permission: bool = Depends(has_permission(['ADMIN']))):
    if not has_permission:
        raise HTTPException(status_code=403, detail="Permission denied")

    staff = get_all_staffs(session)
    staffs_info = []
    for s in staff:
        staffs_info.append(StaffInfo(name=s.full_name, 
                                     email=s.email, 
                                     StaffID=s.id))
        
    return staffs_info

class VerifyEmailSerializer(BaseModel):
    email: str

class VerifyOTPSerializer(BaseModel):
    email: str
    otp: str  

class ResetPasswordSerializer(BaseModel):
    email: str
    new_password: str

@router.post("/password-reset/send-otp")
async def send_otp(data: VerifyEmailSerializer, db: SessionDep):
    email = data.email
    user = get_user_by_email(db, email)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Người dùng không tồn tại.")
    
    secret = pyotp.random_base32()
    totp = pyotp.TOTP(secret)
    otp = totp.now()
    
    hashed_email = hash_email(user.email)
    expiration_time = 5 * 60
    
    redis_client.set(hashed_email, otp, ex=expiration_time)
    subject = f"[IMPORTANT] Please enter this OTP to authenticate your account!"
    body = generate_otp_email_body(otp)
    await send_email(user.email, subject, body)
    return {"message": "OTP sent successfully", "status": "SENT"}


@router.post("/password-reset/verify-otp")
async def verify_otp(data: VerifyOTPSerializer, db: SessionDep):
    email = data.email
    otp = data.otp
    hashed_email = hash_email(email)

    stored_otp = redis_client.get(hashed_email)
    if stored_otp:
        stored_otp = stored_otp.decode('utf-8')
    if not stored_otp:
        raise HTTPException(status_code=404, detail="OTP not found or expired")

    if otp == stored_otp:
        redis_client.delete(hashed_email)
        return {"message": "OTP verified successfully"}
    else:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid OTP.")


@router.post("/password-reset/reset-password")
async def reset_password(data: ResetPasswordSerializer, db: SessionDep):
    email = data.email
    new_password = data.new_password
    user = get_user_by_email(db, email)

    update_user_password(db, user, new_password)
    return {"message": "Password reset successfully"}

class CustomerInfo(BaseModel):
    name: str
    email: str
    phone: str
    address: str

@router.get("/customer_info")
async def get_customer_info(session: SessionDep, user: User = Depends(get_current_user)):
    info = {
        'name': user.full_name,
        'id': user.id,
        'username': user.full_name,
        'gender': user.gender,
        'dob': user.birth_date,
        'contact': {
            'phone': user.phone_number,
            'email': user.email,
        },
        'address': {
            'street': None,
            'city': None,
            'country': None,
        },
        'image': 'data:image/png;base64,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',
    }
    response = JSONResponse(content=info)
    return response