from models import Permission, RolePermission, UserPermission
from core.permissions import has_permission
from fastapi import APIRouter, Depends, HTTPException
from models import Permission, Role, User, RolePermission, UserPermission
from core.permissions import has_permission, get_current_user
from api.deps import SessionDep
router = APIRouter()


def is_admin(current_user: User) -> bool:
    """
    Kiểm tra nếu người dùng có vai trò ADMIN.
    """
    if not any(role.name == "ADMIN" for role in current_user.roles):
        raise HTTPException(status_code=403, detail="User does not have admin privileges")
    return True

@router.get("/test-has-permision")
def test_has_permission( has_permission: bool = Depends(has_permission(["FULL_ACCESS","ADMIN"]))):
    return {"has_permission": has_permission}

# API để thêm một quyền mới
@router.post("/permissions", status_code=201)
def add_permission(
    session: SessionDep,
    name: str,
    detail: str,
    current_user: User = Depends(get_current_user),
):
    # Kiểm tra vai trò admin
    is_admin(current_user)

    # Kiểm tra nếu quyền đã tồn tại
    existing_permission = session.query(Permission).filter_by(name=name).first()
    if existing_permission:
        raise HTTPException(status_code=400, detail="Permission already exists")

    # Tạo quyền mới
    permission = Permission(name=name, detail=detail)
    session.add(permission)
    session.commit()
    session.refresh(permission)

    return {"message": "Permission added successfully", "permission": permission}


# API để gán quyền vào vai trò
@router.post("/role-permissions", status_code=201)
def add_permission_to_role(
    session: SessionDep,
    role_name: str,
    permission_id: int,
    current_user: User = Depends(get_current_user),
):
    # Kiểm tra vai trò admin
    is_admin(current_user)

    # Kiểm tra role có tồn tại
    role = session.query(Role).filter_by(name=role_name).first()
    if not role:
        raise HTTPException(status_code=404, detail="Role not found")

    # Kiểm tra permission có tồn tại
    permission = session.query(Permission).filter_by(id=permission_id).first()
    if not permission:
        raise HTTPException(status_code=404, detail="Permission not found")

    # Kiểm tra nếu quyền đã được gán vào vai trò
    existing_role_permission = (
        session.query(RolePermission)
        .filter_by(role_id=role.id, permission_id=permission_id)
        .first()
    )
    if existing_role_permission:
        raise HTTPException(status_code=400, detail="Permission already assigned to role")

    # Gán quyền vào vai trò
    role_permission = RolePermission(role_id=role.id, permission_id=permission_id)
    session.add(role_permission)
    session.commit()

    return {"message": "Permission assigned to role successfully"}
    
