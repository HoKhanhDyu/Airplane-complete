from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from crud import crud_seat as crud_seat
from schemas.seat import SeatCreate, SeatUpdate, SeatResponse
from api.deps import get_session
from typing import Optional, List

router = APIRouter()

# Lấy danh sách ghế
@router.get("/seats", response_model=list[SeatResponse])
def read_seats(db: Session = Depends(get_session), 
                    flight_id: Optional[int] = None, 
                    seat_class: Optional[str] = None,
                    is_available: Optional[bool] = None):
    return crud_seat.get_all_seats(db, flight_id, seat_class, is_available)

@router.get("/seats/{seat_id}", response_model=SeatResponse)
def read_seat(seat_id: int, db: Session = Depends(get_session)):
    seat = crud_seat.get_seat_by_id(db, seat_id)
    if not seat:
        raise HTTPException(status_code=404, detail="Seat not found")
    return seat

@router.post("/seats", response_model=SeatResponse)
def create_seat(seat: SeatCreate, db: Session = Depends(get_session)):
    return crud_seat.create_seat(db, seat)

@router.put("/seats/{seat_id}", response_model=SeatResponse)
def update_seat(seat_id: int, seat: SeatUpdate, db: Session = Depends(get_session)):
    updated_seat = crud_seat.update_seat(db, seat_id, seat)
    if not updated_seat:
        raise HTTPException(status_code=404, detail="Seat not found")
    return updated_seat

@router.delete("/seats/{seat_id}", response_model=SeatResponse)
def delete_seat(seat_id: int, db: Session = Depends(get_session)):
    deleted_seat = crud_seat.delete_seat(db, seat_id)
    if not deleted_seat:
        raise HTTPException(status_code=404, detail="Seat not found")
    return deleted_seat
