from sqlalchemy.orm import Session
from sqlmodel import select
from models import User
from core.utils import get_password_hash
from typing import Optional, List
from crud.role import get_role_by_name, create_role
from crud.user_role import assign_role_to_user


def create_user(db: Session, user: User, role_name: str = "CUSTOMER") -> User:
    """
    Tạo mới một người dùng và gán vai trò mặc định là 'CUSTOMER'.
    """
    # Băm mật khẩu trước khi lưu
    hashed_password = get_password_hash(user.password)
    db_user = User(
        full_name=user.full_name,
        email=user.email,
        password=hashed_password,
    )
    
    # Thêm người dùng vào cơ sở dữ liệu
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Lấy vai trò theo tên
    role = get_role_by_name(db, role_name)
    if not role:
        # Nếu vai trò chưa tồn tại, tạo mới vai trò này
        role = create_role(db, role_name)
    
    # Gán vai trò cho người dùng trong bảng UserRole
    assign_role_to_user(db, user_id=db_user.id, role_id=role.id)
    
    return db_user

def get_user_by_id(db: Session, user_id: int) -> Optional[User]:
    """
    Lấy thông tin người dùng theo ID.
    """
    return db.get(User, user_id)


def get_user_by_email(db: Session, email: str) -> Optional[User]:
    """
    Lấy thông tin người dùng theo email.
    """
    return db.exec(select(User).where(User.email == email)).first()


def get_all_users(db: Session) -> List[User]:
    """
    Lấy danh sách tất cả người dùng.
    """
    return db.exec(select(User)).all()


def update_user(db: Session, user_id: int, new_data: dict) -> Optional[User]:
    """
    Cập nhật thông tin người dùng.
    """
    db_user = db.get(User, user_id)
    if not db_user:
        return None
    
    # Cập nhật các thuộc tính cho db_user từ new_data
    for key, value in new_data.items():
        setattr(db_user, key, value)
    
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user_verification(db: Session, user: User):
    """
    Cập nhật trạng thái xác thực cho người dùng trong cơ sở dữ liệu.
    
    Args:
        db: Session - Kết nối tới cơ sở dữ liệu.
        user: User - Đối tượng người dùng cần cập nhật.

    Returns:
        User - Người dùng đã được cập nhật.
    """
    # Đảm bảo rằng người dùng đã có trong cơ sở dữ liệu
    db_user = db.get(User, user.id)
    if db_user:
        db_user.is_verified = True  # Cập nhật trạng thái is_verified
        db.commit()  # Lưu thay đổi
        db.refresh(db_user)  # Làm mới đối tượng người dùng để lấy giá trị cập nhật
        return db_user
    else:
        raise Exception("User not found")

def delete_user(db: Session, user_id: int) -> None:
    """
    Xóa một người dùng theo ID.
    """
    db_user = db.get(User, user_id)
    if db_user:
        db.delete(db_user)
        db.commit()

# Hàm lấy danh sách các vai trò của người dùng
def get_user_roles(db: Session, user_id: int):
    user = db.exec(select(User).where(User.id == user_id)).first()
    if not user:
        return None  # Không tìm thấy người dùng
    return [role.name for role in user.roles]

# Hàm kiểm tra xem người dùng có vai trò cụ thể hay không
def user_has_role(db: Session, role_name: str, user_id: int = None) -> bool:
    user = db.exec(select(User).where(User.id == user_id)).first()
    if not user:
        return False  # Người dùng không tồn tại
    
    # Kiểm tra vai trò trong danh sách roles của user
    for role in user.roles:
        if role.name == role_name:
            return True
    return False

# def check_role_by_name(db: Session, user_id: int, role_name: str) -> bool:
#     """
#     Kiểm tra xem người dùng có vai trò cụ thể hay không.
#     """
#     user = db.exec(select(User).where(User.id == user_id)).first()
#     if not user:
#         return False  # Người dùng không tồn tại
    
#     # Kiểm tra vai trò trong danh sách roles của user
#     for role in user.roles:
#         if role.name == role_name:
#             return True
#     return False

def get_all_staffs(db: Session) -> List[User]:
    """
    Lấy danh sách tất cả nhân viên.
    """
    #get id of role staff
    role = get_role_by_name(db, "STAFF")
    if not role:
        return []
    staffs = db.exec(select(User).join(User.roles).where(User.roles.any(id=role.id))).all()

    return staffs

def update_user_password(db: Session, user: User, new_password: str):
    """
    Cập nhật mật khẩu mới cho người dùng.
    """
    # Băm mật khẩu mới
    hashed_password = get_password_hash(new_password)
    user.password = hashed_password
    db.commit()
    db.refresh(user)
    return user
