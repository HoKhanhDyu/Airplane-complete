from sqlmodel import Field, SQLModel, Relationship
from typing import List, Optional
from datetime import datetime, timezone
from enum import Enum
import re

class UserRole(SQLModel, table=True):
    user_id: int = Field(ondelete="CASCADE", foreign_key="user.id", primary_key=True)
    role_id: int = Field(ondelete="CASCADE", foreign_key="role.id", primary_key=True)

class Role(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True, description="Unique identifier for the role")
    name: str = Field(index=True, description="The name of the role (e.g., ADMIN, CUSTOMER, SELLER, MODERATOR, SUPPORT)")
    # Thay thế các dòng tạo timestamp như sau:
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), description="Timestamp when the user was created")
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), description="Timestamp when the user was last updated")
    # Establish the relationship to UserRole
    users: List["User"] = Relationship(back_populates="roles", link_model=UserRole)

class UsetStatus(str, Enum):
    ACTIVE = "active"
    BLOCKED = "blocked"

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    full_name: str = Field(description="The full name of the user")
    email: str = Field(description="The email of the user", index=True, unique=True)
    password: str = Field(description="The password of the user")
    is_verified: bool = Field(default=False, description="Indicates if the user has verified their email")
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), description="Timestamp when the user was created")
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), description="Timestamp when the user was last updated") 
    last_login: Optional[datetime] = Field(default=None, description="Timestamp of the user's last login")
    profile_picture: Optional[str] = Field(default=None, description="URL or path of the user's profile picture")
    phone_number: Optional[str] = Field(default=None, description="The phone number of the user")
    status: UsetStatus = Field(default=UsetStatus.ACTIVE, description="The status of the user (active, blocked)")
    gender: Optional[str] = Field(default=None, description="Giới tính")
    birth_date: Optional[datetime] = Field(default=None, description="Ngày sinh")
    address: Optional[str] = Field(default=None, description="Địa chỉ")
    position: Optional[str] = Field(default=None, description="Vị trí")
    id_number: Optional[str] = Field(default=None, description="Số CMND")
    department: Optional[str] = Field(default=None, description="Phòng ban")
    flights_handled: Optional[int] = Field(default=None, description="Số chuyến bay đã xử lý")
    revenue_generated: Optional[str] = Field(default=None, description="Doanh thu đã tạo ra")
   
    # Establish the relationship to UserRole
    roles: List["Role"] = Relationship(back_populates="users", link_model=UserRole)

class RefreshToken(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(ondelete="CASCADE", foreign_key="user.id")  # Khóa ngoại tham chiếu đến bảng `User`
    refresh_token: str = Field(unique=True, description="refresh token của user")
    expires_at: datetime = Field(nullable=False, description="Thời gian hết hạn của refresh token")
    revoked: bool = Field(default=False, description="Refresh token này đã bị thu hồi hay chưa")
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), description="Timestamp when the user was created")

#Sân bay
class Airport(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    code: str = Field(description="Code thành phố")
    name: str = Field(description="Tên sân bay")
    city: str = Field(description="Thành phố")
    country: str = Field(description="Quốc gia")

#Hãng hàng không
class Airline(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(description="Tên hãng hàng không")
    country: str = Field(description="Quốc gia")
    code: str = Field(description="Code hang")
    logo: str = Field(description="Logo của hãng hàng không")

#Máy bay
class Aircraft(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    airline_id: int = Field(ondelete="CASCADE", foreign_key="airline.id", description="ID hãng hàng không")
    name: str = Field(description="Tên máy bay")
    rows: int = Field(description="Số hàng ghế")
    columns: int = Field(description="Số cột ghế")
    business_rows: int = Field(description="Số hàng ghế thương gia")
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), description="Timestamp when the aircraft was created")
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), description="Timestamp when the aircraft was last updated")

#Chuyến bay
class Flight(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    departure_airport_id: int = Field(ondelete="CASCADE", foreign_key="airport.id", description="Sân bay xuất phát")
    arrival_airport_id: int = Field(ondelete="CASCADE", foreign_key="airport.id", description="Sân bay đến")
    airline_id: int = Field(ondelete="CASCADE", foreign_key="airline.id", description="Hãng hàng không")
    aircraft_id: int = Field(ondelete="CASCADE", foreign_key="aircraft.id", description="Máy bay")
    departure_time: datetime = Field(description="Thời gian xuất phát")
    arrival_time: datetime = Field(description="Thời gian đến")
    price_economy: float = Field(description="Giá vé hạng phổ thông")
    price_business: float = Field(description="Giá vé hạng thương gia")
    flight_number: str = Field(description="Số hiệu chuyến bay")
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), description="Timestamp when the flight was created")
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), description="Timestamp when the flight was last updated")

#Vé chuyến bay
class SeatType(str, Enum):
    ECONOMY = "economy"
    BUSINESS = "business"

# Ghế của các chuyến bay
class Seat(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    flight_id: int = Field(ondelete="CASCADE", foreign_key="flight.id", description="ID chuyến bay")
    seat_number: str = Field(description="Số ghế")
    seat_class: SeatType = Field(description="Loại ghế (economy hoặc business)")
    price: float = Field(description="Giá vé ghế")
    is_available: bool = Field(default=True, description="Trạng thái ghế (còn trống hay không)")
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), description="Timestamp when the seat was created")
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), description="Timestamp when the seat was last updated")

    def get_seat_position(self):
        match = re.match(r"([0-9]+)([a-zA-Z]+)", self.seat_number, re.I)
        if match:
            items = match.groups()
            return items[0], items[1]
        return None, None

class TicketType(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    type: SeatType = Field(description="Loại vé")
    name: str = Field(description="Tên loại vé")
    additional_expense: float = Field(description="Phụ phí")
    baggage: float = Field(description="Hành lý")
    exchangefee: float = Field(description="Phí đổi vé")
    refundfee: float = Field(description="Phí hoàn vé")
    food: bool = Field(description="Bữa ăn")

class Gender(str, Enum):
    MALE = 'male'
    FEMALE = 'female'

#Vé chuyến bay
class Ticket(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    first_name: str = Field(description="Tên hành khách")
    last_name: str = Field(description="Họ hành khách")
    birth_date: datetime = Field(description="Ngày sinh của hành khách")
    male: Gender = Field(description="Giới tính của hành khách")
    citizen_id: str = Field(description="Chứng minh nhân dân hoặc hộ chiếu của hành khách")
    passenger_email: str = Field(description="Email của hành khách")
    passenger_phone: str = Field(description="Số điện thoại của hành khách")
    price: float = Field(description="Giá vé gồm phí")
    ticket_type_id: int = Field(ondelete="CASCADE", foreign_key="tickettype.id", description="ID loại vé")
    flight_id: int = Field(ondelete="CASCADE", foreign_key="flight.id", description="ID chuyến bay")
    seat_id: int = Field(ondelete="CASCADE", foreign_key="seat.id", description="ID ghế")
    invoice_id: int = Field(ondelete="CASCADE", foreign_key="invoice.id", description="ID hóa đơn")
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), description="Timestamp when the ticket was created")
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), description="Timestamp when the ticket was last updated")

#Hóa đơn
class Invoice(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(ondelete="CASCADE", foreign_key="user.id", description="ID người dùng")
    total_price: float = Field(description="Tổng giá vé")
    flight_id: int = Field(ondelete="CASCADE", foreign_key="flight.id", description="ID chuyến bay")
    booking_code: str = Field(description="Mã đặt chỗ")
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), description="Timestamp when the invoice was created")
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), description="Timestamp when the invoice was last updated")
    is_paid: bool = Field(default=False, description="Trạng thái thanh toán (đã thanh toán hay chưa)")
    is_cancelled: bool = Field(default=False, description="Trạng thái hủy vé (đã hủy hay chưa)")


class Permission(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True, description="Unique identifier for the permission")
    name: str = Field(index=True, description="The name of the permission (e.g., view, add, change, delete)")
    detail: Optional[str] = Field(default=None, description="Detailed description of the permission")
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), description="Timestamp when the permission was created")
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), description="Timestamp when the permission was last updated")


class RolePermission(SQLModel, table=True):
    role_id: int = Field(ondelete="CASCADE", foreign_key="role.id", primary_key=True)
    permission_id: int = Field(ondelete="CASCADE", foreign_key="permission.id", primary_key=True)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), description="Timestamp when the role permission was created")

class UserPermission(SQLModel, table=True):
    user_id: int = Field(ondelete="CASCADE", foreign_key="user.id", primary_key=True)
    permission_id: int = Field(ondelete="CASCADE", foreign_key="permission.id", primary_key=True)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), description="Timestamp when the user permission was created")
