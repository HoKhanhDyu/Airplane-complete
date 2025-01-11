from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from crud import crud_airport as crud_airport
from schemas.airport import AirportCreate, AirportUpdate, AirportResponse
from api.deps import get_session
from typing import Optional, List
from pydantic import BaseModel
from core.permissions import has_permission

router = APIRouter()

class AirportCity(BaseModel):
    id: int
    code: str
    Name: str
    City: str
    Country: str
    Code: str
    detail_name: str

# Lấy danh sách sân bay
# @router.get("/airports", response_model=list[AirportResponse])
# def read_airports(city: Optional[str] = None, country: Optional[str] = None, db: Session = Depends(get_session)):
#     return crud_airport.get_all_airports(db, city, country)


# Lấy sân bay theo ID
@router.get("/airports/{airport_id}", response_model=AirportResponse)
def read_airport(airport_id: int, db: Session = Depends(get_session)):
    airport = crud_airport.get_airport_by_id(db, airport_id)
    if not airport:
        raise HTTPException(status_code=404, detail="Airport not found")
    airport_info = AirportCity(code=airport.code,
                                 detail_name=f'{airport.city}, {airport.country}',
                                 Name=airport.name,
                                 id=airport.id,
                                 City=airport.city,
                                 Country=airport.country,
                                 Code=airport.code)
    return airport_info

# Thêm sân bay mới
@router.post("/airports", response_model=AirportResponse)
def create_airport(airport: AirportCreate, db: Session = Depends(get_session), has_permission: bool = Depends(has_permission(["FULL_ACCESS"]))):
    if not has_permission:
        raise HTTPException(status_code=403, detail="User does not have permission to access this resource")
    return crud_airport.create_airport(db, airport)

# Cập nhật sân bay
@router.put("/airports/{airport_id}", response_model=AirportResponse)
def update_airport(airport_id: int, airport: AirportUpdate, db: Session = Depends(get_session), has_permission: bool = Depends(has_permission(["FULL_ACCESS"]))):
    if not has_permission:
        raise HTTPException(status_code=403, detail="User does not have permission to access this resource")
    updated_airport = crud_airport.update_airport(db, airport_id, airport)
    if not updated_airport:
        raise HTTPException(status_code=404, detail="Airport not found")
    return updated_airport

# Xóa sân bay
@router.delete("/airports/{airport_id}", response_model=AirportResponse)
def delete_airport(airport_id: int, db: Session = Depends(get_session), has_permission: bool = Depends(has_permission(["FULL_ACCESS"]))):

    if not has_permission:
        raise HTTPException(status_code=403, detail="User does not have permission to access this resource")

    deleted_airport = crud_airport.delete_airport(db, airport_id)
    if not deleted_airport:
        raise HTTPException(status_code=404, detail="Airport not found")
    return deleted_airport

@router.get("/airports", response_model=list[AirportCity])
def get_airport_city(db: Session = Depends(get_session)):
    all_airport_city = crud_airport.get_all_airports(db)
    airport_city = []
    for airport in all_airport_city:
        city = AirportCity(code=airport.code, 
                           detail_name=f'{airport.city}, {airport.country}', 
                           Name=airport.name,
                           id=airport.id,
                            City=airport.city,
                            Country=airport.country,
                            Code=airport.code)
        airport_city.append(city)
    return airport_city