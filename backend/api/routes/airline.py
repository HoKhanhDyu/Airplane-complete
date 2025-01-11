from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from crud import crud_airline as crud_airline
from schemas.airline import AirlineCreate, AirlineUpdate, AirlineResponse
from api.deps import get_session
from typing import Optional, List
from pydantic import BaseModel
from core.permissions import has_permission

router = APIRouter()

class Airline(BaseModel):
    id: int
    code: str
    name: str
    Name: str
    Country: str
    Code: str

# Lấy danh sách hãng hàng không
# @router.get("/airlines", response_model=list[AirlineResponse])
# def read_airlines(city: Optional[str] = None, db: Session = Depends(get_session)):
#     return crud_airline.get_all_airlines(db, city)

@router.get("/airlines", response_model=list[Airline])  
def read_airlines(db: Session = Depends(get_session), has_permission: bool = Depends(has_permission([]))):
    airlines = crud_airline.get_all_airlines(db)
    list_airline = []
    for airline in airlines:
        list_airline.append(Airline(code=airline.code, 
                                    name=airline.name, 
                                    id=airline.id,
                                    Name=airline.name,
                                    Country=airline.country,
                                    Code=airline.code))
    return list_airline
    

@router.get("/airlines/{airline_id}", response_model=AirlineResponse)
def read_airline(airline_id: int, db: Session = Depends(get_session)):
    airline = crud_airline.get_airline_by_id(db, airline_id)
    if not airline:
        raise HTTPException(status_code=404, detail="Airline not found")
    return airline

@router.post("/airlines", response_model=AirlineResponse)
def create_airline(airline: AirlineCreate, db: Session = Depends(get_session), has_permission: bool = Depends(has_permission(["FULL_ACCESS"]))):
    if not has_permission:
        raise HTTPException(status_code=403, detail="User does not have permission to access this resource")
    return crud_airline.create_airline(db, airline)

@router.put("/airlines/{airline_id}", response_model=AirlineResponse)
def update_airline(airline_id: int, airline: AirlineUpdate, db: Session = Depends(get_session), has_permission: bool = Depends(has_permission([]))):
    updated_airline = crud_airline.update_airline(db, airline_id, airline)
    if not updated_airline:
        raise HTTPException(status_code=404, detail="Airline not found")
    return updated_airline

@router.delete("/airlines/{airline_id}", response_model=AirlineResponse)
def delete_airline(airline_id: int, db: Session = Depends(get_session), has_permission: bool = Depends(has_permission(["FULL_ACCESS"]))):
    if not has_permission:
        raise HTTPException(status_code=403, detail="User does not have permission to access this resource")
    deleted_airline = crud_airline.delete_airline(db, airline_id)
    if not deleted_airline:
        raise HTTPException(status_code=404, detail="Airline not found")
    return deleted_airline

