from sqlalchemy.orm import Session
from sqlmodel import select
from models import UserRole, Role
from typing import List

def assign_role_to_user(db: Session, user_id: int = None, role_id: int = None, role_name : str = None) -> UserRole:
    # Gán một vai trò cho người dùng
    
    if role_name:
        role = db.exec(select(Role).where(Role.name == role_name)).first()
        if not role:
            # create role if not exist
            role = Role(name=role_name)
            db.add(role)
            db.commit()
            db.refresh(role)
    
        user_role = UserRole(user_id=user_id, role_id=role.id)

    if role_id:
        if not db.exec(select(Role).where(Role.id == role_id)).first():
            raise Exception("Role not found")
        else:
            user_role = UserRole(user_id=user_id, role_id=role_id)

    db.add(user_role)
    db.commit()
    db.refresh(user_role)
    return user_role

def get_roles_by_user_id(db: Session, user_id: int) -> List[Role]:
    # Lấy danh sách vai trò của một người dùng dựa vào user_id
    result = db.exec(
        select(Role).join(UserRole, UserRole.role_id == Role.id).where(UserRole.user_id == user_id)
    ).all()
    return result

def remove_role_from_user(db: Session, user_id: int, role_id: int) -> None:
    # Xóa một vai trò của người dùng
    user_role = db.exec(
        select(UserRole).where(UserRole.user_id == user_id, UserRole.role_id == role_id)
    ).first()
    if user_role:
        db.delete(user_role)
        db.commit()
