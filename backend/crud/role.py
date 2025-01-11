from sqlalchemy.orm import Session
from sqlmodel import select
from models import Role
from typing import Optional, List

def create_role(db: Session, role_name: str) -> Role:
    # Tạo mới một vai trò trong hệ thống
    db_role = Role(name=role_name)
    db.add(db_role)
    db.commit()
    db.refresh(db_role)
    return db_role

def get_role_by_name(db: Session, role_name: str) -> Optional[Role]:
    # Lấy một vai trò dựa vào tên
    return db.exec(select(Role).where(Role.name == role_name)).first()

def get_all_roles(db: Session) -> List[Role]:
    # Lấy tất cả các vai trò
    return db.exec(select(Role)).all()

def delete_role(db: Session, role_id: int) -> None:
    # Xóa một vai trò dựa vào ID
    role = db.get(Role, role_id)
    if role:
        db.delete(role)
        db.commit()
