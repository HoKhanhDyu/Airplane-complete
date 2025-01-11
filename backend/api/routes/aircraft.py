from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from crud import crud_aircraft, crud_airline
from schemas.aircraft import AircraftCreate, AircraftUpdate, AircraftResponse
from schemas.seat import SeatCreate
from api.deps import get_session
from typing import Optional, List
from pydantic import BaseModel
from core.permissions import has_permission

router = APIRouter()

class Aircraft_Info(BaseModel):
    id: int
    name: str
    rows: int
    columns: int
    business_rows: int
    airline_name: str

# Lấy danh sách máy bay
@router.get("/aircrafts", response_model=list[Aircraft_Info])
def read_aircrafts(db: Session = Depends(get_session), has_permission: bool = Depends(has_permission(["FULL_ACCESS"]))):

    if not has_permission:
        raise HTTPException(status_code=403, detail="User does not have permission to access this resource")

    aircrafts = crud_aircraft.get_all_aircrafts(db)

    list_aircraft = []
    for aircraft in aircrafts:
        airline = crud_airline.get_airline_by_id(db, aircraft.airline_id)
        list_aircraft.append(Aircraft_Info(id=aircraft.id,
                                            name=aircraft.name,
                                            rows=aircraft.rows,
                                            columns=aircraft.columns,
                                            business_rows=aircraft.business_rows,
                                            airline_name=airline.name))
    return list_aircraft

# Lấy máy bay theo ID
@router.get("/aircrafts/{aircraft_id}", response_model=AircraftResponse)
def read_aircraft(aircraft_id: int, db: Session = Depends(get_session), has_permission: bool = Depends(has_permission([]))):

    if not has_permission:
        raise HTTPException(status_code=403, detail="User does not have permission to access this resource")

    aircraft = crud_aircraft.get_aircraft_by_id(db, aircraft_id)
    if not aircraft:
        raise HTTPException(status_code=404, detail="Aircraft not found")
    return aircraft

# Thêm máy bay mới
@router.post("/aircrafts", response_model=AircraftResponse)
def create_aircraft(aircraft: AircraftCreate, db: Session = Depends(get_session), has_permission: bool = Depends(has_permission(["FULL_ACCESS"]))):
    if not has_permission:
        raise HTTPException(status_code=403, detail="User does not have permission to access this resource")
    return crud_aircraft.create_aircraft(db, aircraft)

# Cập nhật máy bay
@router.put("/aircrafts/{aircraft_id}", response_model=AircraftResponse)
def update_aircraft(aircraft_id: int, aircraft: AircraftUpdate, db: Session = Depends(get_session), has_permission: bool = Depends(has_permission(["FULL_ACCESS"]))):
    if not has_permission:
        raise HTTPException(status_code=403, detail="User does not have permission to access this resource")
    updated_aircraft = crud_aircraft.update_aircraft(db, aircraft_id, aircraft)
    if not updated_aircraft:
        raise HTTPException(status_code=404, detail="Aircraft not found")
    return

# Xóa máy bay
@router.delete("/aircrafts/{aircraft_id}", response_model=AircraftResponse)
def delete_aircraft(aircraft_id: int, db: Session = Depends(get_session), has_permission: bool = Depends(has_permission(["FULL_ACCESS"]))):
    if not has_permission:
        raise HTTPException(status_code=403, detail="User does not have permission to access this resource")
    deleted_aircraft = crud_aircraft.delete_aircraft(db, aircraft_id)
    if not deleted_aircraft:
        raise HTTPException(status_code=404, detail="Aircraft not found")
    return deleted_aircraft