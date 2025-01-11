from sqlalchemy.orm import Session
from sqlmodel import select
from typing import Optional, List
from fastapi import HTTPException
from models import Flight
from schemas.flight  import FlightCreate, FlightUpdate
from schemas.seat import SeatCreate
from crud.crud_seat import *
from crud.crud_aircraft import *
from datetime import datetime, timedelta
from sqlalchemy import and_


def create_flight(db: Session, flight: FlightCreate) -> Flight:
    """
    Thêm chuyến bay mới vào cơ sở dữ liệu.

    Args:
        db (Session): Đối tượng session để tương tác với cơ sở dữ liệu.
        flight (FlightCreate): Thông tin chuyến bay cần thêm.

    Returns:
        Flight: Đối tượng chuyến bay đã thêm vào cơ sở dữ liệu.
    """
    aircraft = get_aircraft_by_id(db, flight.aircraft_id)
    new_flight = Flight(**flight.model_dump(), price_business=flight.price_economy * 1.3, airline_id=aircraft.airline_id)
    db.add(new_flight)

    db.commit()
    db.refresh(new_flight)
    
    return new_flight

def get_flight_by_id(db: Session, flight_id: int) -> Flight:
    """
    Lấy thông tin chuyến bay từ cơ sở dữ liệu theo ID.

    Args:
        db (Session): Đối tượng session để tương tác với cơ sở dữ liệu.
        flight_id (int): ID của chuyến bay cần tìm.

    Returns:
        Flight: Đối tượng chuyến bay tương ứng với ID.
    
    Raises:
        HTTPException: Nếu không tìm thấy chuyến bay với ID đã cho.
    """
    flight = db.query(Flight).filter(Flight.id == flight_id).first()
    if not flight:
        raise HTTPException(status_code=404, detail="Flight not found.")
    
    return flight

def update_flight(db: Session, flight_id: int, flight: FlightUpdate) -> Flight:
    """
    Cập nhật thông tin chuyến bay trong cơ sở dữ liệu theo ID.

    Args:
        db (Session): Đối tượng session để tương tác với cơ sở dữ liệu.
        flight_id (int): ID của chuyến bay cần cập nhật.
        flight (FlightUpdate): Thông tin chuyến bay mới.

    Returns:
        Flight: Đối tượng chuyến bay đã cập nhật.
    
    Raises:
        HTTPException: Nếu không tìm thấy chuyến bay với ID đã cho.
    """
    flight_db = get_flight_by_id(db, flight_id)
    flight_data = flight.dict(exclude_unset=True)
    for key, value in flight_data.items():
        setattr(flight_db, key, value)
    db.add(flight_db)
    db.commit()
    db.refresh(flight_db)
    
    return flight_db

def delete_flight(db: Session, flight_id: int) -> Flight:
    """
    Xoá thông tin chuyến bay trong cơ sở dữ liệu theo ID.

    Args:
        db (Session): Đối tượng session để tương tác với cơ sở dữ liệu.
        flight_id (int): ID của chuyến bay cần xoá.

    Returns:
        Flight: Đối tượng chuyến bay đã xoá.
    
    Raises:
        HTTPException: Nếu không tìm thấy chuyến bay với ID đã cho.
    """
    flight = get_flight_by_id(db, flight_id)
    if not flight:
        raise HTTPException(status_code=404, detail="Flight not found.")
    
    delete_seat_flight(db, flight_id)

    db.delete(flight)
    db.commit()
    
    return flight

def get_all_flights(db: Session, departure_airport_id: Optional[int] = None,
                     arrival_airport_id: Optional[int] = None,
                     airline_id: Optional[int] = None,
                     time_from: Optional[str] = None) -> List[Flight]:
    """
    Lấy danh sách tất cả chuyến bay từ cơ sở dữ liệu.

    Args:
        db (Session): Đối tượng session để tương tác với cơ sở dữ liệu.
        departure_airport_id (Optional[int]): ID của sân bay xuất phát.
        arrival_airport_id (Optional[int]): ID của sân bay đến.

    Returns:
        List[Flight]: Danh sách tất cả chuyến bay.
    """
    query = db.query(Flight)
    if departure_airport_id:
        query = query.filter(Flight.departure_airport_id == departure_airport_id)
    if arrival_airport_id:
        query = query.filter(Flight.arrival_airport_id == arrival_airport_id)
    if airline_id:
        query = query.filter(Flight.airline_id == airline_id)
    if time_from:
        try:
            # Chuyển đổi time_from thành datetime
            start_time = datetime.strptime(time_from, "%Y-%m-%d")
            end_time = start_time + timedelta(days=1)

            # Lọc theo khoảng thời gian
            query = query.filter(
                and_(Flight.departure_time >= start_time, Flight.departure_time < end_time)
            )
        except ValueError:
            raise ValueError("time_from phải có định dạng 'YYYY-MM-DD'")
        
    return query.all()

def get_flight_by_number(db: Session, flight_number: str) -> Flight:
    """
    Lấy thông tin chuyến bay từ cơ sở dữ liệu theo tên.

    Args:
        db (Session): Đối tượng session để tương tác với cơ sở dữ liệu.
        flight_name (str): Tên của chuyến bay cần lấy.

    Returns:
        Flight: Đối tượng chuyến bay tương ứng với tên.
    
    Raises:
        HTTPException: Nếu không tìm thấy chuyến bay với tên đã cho.
    """
    flight = db.query(Flight).filter(Flight.flight_number == flight_number).first()
    if not flight:
        raise HTTPException(status_code=404, detail="Flight not found.")
    
    return flight