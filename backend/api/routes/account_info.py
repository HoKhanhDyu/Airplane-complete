from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from crud import user
from api.deps import get_session
from typing import Optional, List
from pydantic import BaseModel
from core.permissions import get_current_user
from models import User, Permission, RolePermission, UserPermission

router = APIRouter()

# name: employee.name || 'N/A',
# id: employee.id || 'N/A',
# email: employee.email || 'N/A',
# phone: employee.phone || 'N/A',
# startDate: employee.startDate || 'N/A',
# status: employee.status || 'N/A',
# gender: employee.gender || 'N/A',
# birthDate: employee.birthDate ? new Date(employee.birthDate) : null,
# address: employee.address || 'N/A',
# position: employee.position || 'N/A',
# idNumber: employee.idNumber || 'N/A',
# department: employee.department || 'N/A',
# flightsHandled: employee.flightsHandled || 0,
# revenueGenerated: employee.revenueGenerated || '0',

class Employee(BaseModel):
    name: str = None
    id: str = None
    email: str  = None
    phone: str = None
    startDate: str= None
    status: str= None
    gender: str= None
    birthDate: str= None
    address: str= None
    position: str= None
    idNumber: str= None
    department: str= None
    flightsHandled: int= None
    revenueGenerated: str= None

@router.get("/employee_info", response_model=Employee)
async def get_employee_info(session: Session = Depends(get_session), user: User = Depends(get_current_user)):
    employee = Employee(
        name=user.full_name,
        id=user.id,
        email=user.email,
        startDate=user.created_at,
    )
    return employee


