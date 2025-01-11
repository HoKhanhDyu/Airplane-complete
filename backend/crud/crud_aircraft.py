from sqlalchemy.orm import Session
from sqlmodel import select
from models import Aircraft
from typing import Optional, List
from fastapi import HTTPException
from schemas.aircraft import AircraftCreate, AircraftUpdate, AircraftResponse

def create_aircraft(db: Session, aircraft: AircraftCreate) -> Aircraft:
    """
    Thêm máy bay mới vào cơ sở dữ liệu.

    Args:
        db (Session): Đối tượng session để tương tác với cơ sở dữ liệu.
        aircraft (AircraftCreate): Thông tin máy bay cần thêm.

    Returns:
        Aircraft: Đối tượng máy bay đã thêm vào cơ sở dữ liệu.
    """
    new_aircraft = Aircraft(**aircraft.model_dump())
    db.add(new_aircraft)
    db.commit()
    db.refresh(new_aircraft)
    
    return new_aircraft

def get_aircraft_by_id(db: Session, aircraft_id: int) -> Aircraft:
    """
    Lấy thông tin máy bay từ cơ sở dữ liệu theo ID.

    Args:
        db (Session): Đối tượng session để tương tác với cơ sở dữ liệu.
        aircraft_id (int): ID của máy bay cần tìm.

    Returns:
        Aircraft: Đối tượng máy bay tương ứng với ID.
    
    Raises:
        HTTPException: Nếu không tìm thấy máy bay với ID đã cho.
    """
    aircraft = db.query(Aircraft).filter(Aircraft.id == aircraft_id).first()
    if not aircraft:
        raise HTTPException(status_code=404, detail="Aircraft not found.")
    
    return aircraft

def get_aircraft_by_code(db: Session, aircraft_code: str) -> Aircraft:
    """
    Lấy thông tin máy bay từ cơ sở dữ liệu theo mã máy bay.

    Args:
        db (Session): Đối tượng session để tương tác với cơ sở dữ liệu.
        aircraft_code (str): Mã máy bay cần tìm.

    Returns:
        Aircraft: Đối tượng máy bay tương ứng với mã máy bay.
    
    Raises:
        HTTPException: Nếu không tìm thấy máy bay với mã máy bay đã cho.
    """
    aircraft = db.query(Aircraft).filter(Aircraft.code == aircraft_code).first()
    if not aircraft:
        raise HTTPException(status_code=404, detail="Aircraft not found.")
    
    return aircraft

def update_aircraft(db: Session, aircraft_id: int, aircraft: AircraftUpdate) -> Aircraft:
    """
    Cập nhật thông tin máy bay trong cơ sở dữ liệu theo ID.

    Args:
        db (Session): Đối tượng session để tương tác với cơ sở dữ liệu.
        aircraft_id (int): ID của máy bay cần cập nhật.
        aircraft (AircraftUpdate): Thông tin máy bay mới.

    Returns:
        Aircraft: Đối tượng máy bay đã cập nhật.
    
    Raises:
        HTTPException: Nếu không tìm thấy máy bay với ID đã cho.
    """
    aircraft_db = db.query(Aircraft).filter(Aircraft.id == aircraft_id).first()
    if not aircraft_db:
        raise HTTPException(status_code=404, detail="Aircraft not found.")
    
    update_data = aircraft.model_dump()
    for key, value in update_data.items():
        setattr(aircraft_db, key, value)
    
    db.commit()
    db.refresh(aircraft_db)
    
    return aircraft_db

def delete_aircraft(db: Session, aircraft_id: int) -> Aircraft:
    """
    Xoá máy bay từ cơ sở dữ liệu theo ID.

    Args:
        db (Session): Đối tượng session để tương tác với cơ sở dữ liệu.
        aircraft_id (int): ID của máy bay cần xoá.

    Returns:
        Aircraft: Đối tượng máy bay đã xoá.
    """
    aircraft = db.query(Aircraft).filter(Aircraft.id == aircraft_id).first()
    if not aircraft:
        raise HTTPException(status_code=404, detail="Aircraft not found.")
    
    db.delete(aircraft)
    db.commit()
    
    return aircraft

def get_all_aircrafts(db: Session, airline_id: Optional[int] = None) -> List[Aircraft]:
    """
    Lấy danh sách máy bay từ cơ sở dữ liệu.

    Args:
        db (Session): Đối tượng session để tương tác với cơ sở dữ liệu.
        airline_id (int, optional): ID của hãng hàng không để lọc máy bay.

    Returns:
        List[Aircraft]: Danh sách các máy bay tìm thấy.
    """
    if airline_id:
        aircrafts = db.query(Aircraft).filter(Aircraft.airline_id == airline_id).all()
    else:
        aircrafts = db.query(Aircraft).all()
    
    return aircrafts