from sqlalchemy.orm import Session
from sqlmodel import select
from models import Airport
from typing import Optional, List
from fastapi import HTTPException
from schemas.airport import AirportCreate, AirportUpdate, AirportResponse
import logging

def create_airport(db: Session, airport: AirportCreate) -> Airport:
    """
    Tạo một sân bay mới trong cơ sở dữ liệu.

    Args:
        db (Session): Đối tượng session để tương tác với cơ sở dữ liệu.
        airport (AirportCreate): Thông tin của sân bay mới.

    Returns:
        Airport: Đối tượng sân bay mới được tạo.
    """
    # Kiểm tra xem sân bay đã tồn tại chưa
    existing_airport = db.query(Airport).filter(Airport.code == airport.code).first()
    if existing_airport:
        raise HTTPException(status_code=400, detail="Airport already exists.")
    
    # Tạo sân bay mới
    new_airport = Airport(**airport.model_dump())
    db.add(new_airport)
    db.commit()
    db.refresh(new_airport)

    return new_airport

def get_airport_by_id(db: Session, airport_id: int) -> Airport:
    """
    Lấy thông tin sân bay từ cơ sở dữ liệu theo ID.

    Args:
        db (Session): Đối tượng session để tương tác với cơ sở dữ liệu.
        airport_id (int): ID của sân bay cần tìm.

    Returns:
        Airport: Đối tượng sân bay tương ứng với ID.
    
    Raises:
        HTTPException: Nếu không tìm thấy sân bay với ID đã cho.
    """
    airport = db.query(Airport).filter(Airport.id == airport_id).first()
    if not airport:
        raise HTTPException(status_code=404, detail="Airport not found.")
    
    return airport

def update_airport(db: Session, airport_id: int, update_data: AirportUpdate) -> Airport:
    """
    Cập nhật thông tin của sân bay theo ID.

    Args:
        db (Session): Đối tượng session để tương tác với cơ sở dữ liệu.
        airport_id (int): ID của sân bay cần cập nhật.
        name (Optional[str]): Tên sân bay mới (tùy chọn).
        city (Optional[str]): Thành phố mới (tùy chọn).
        country (Optional[str]): Quốc gia mới (tùy chọn).

    Returns:
        Airport: Đối tượng sân bay sau khi cập nhật.

    Raises:
        HTTPException: Nếu không tìm thấy sân bay với ID đã cho.
    """
    old_airport = db.query(Airport).filter(Airport.id == airport_id).first()
    if not old_airport:
        raise HTTPException(status_code=404, detail="Airport not found.")
    
    # Cập nhật thông tin sân bay
    for key, value in update_data.model_dump().items():
        if key in update_data.model_dump(exclude_unset=True):
            setattr(old_airport, key, getattr(update_data, key))    

    db.commit()
    db.refresh(old_airport)

    return old_airport

def delete_airport(db: Session, airport_id: int) -> Airport:
    """
    Xóa một sân bay khỏi cơ sở dữ liệu theo ID.

    Args:
        db (Session): Đối tượng session để tương tác với cơ sở dữ liệu.
        airport_id (int): ID của sân bay cần xóa.

    Returns:
        Airport: Đối tượng sân bay đã bị xóa.

    Raises:
        HTTPException: Nếu không tìm thấy sân bay với ID đã cho.
    """
    airport = db.query(Airport).filter(Airport.id == airport_id).first()
    if not airport:
        raise HTTPException(status_code=404, detail="Airport not found.")
    
    db.delete(airport)
    db.commit()

    return airport

def get_all_airports(db: Session, city: Optional[str] = None, country: Optional[str] = None) -> List[Airport]:
    """
    Lấy tất cả sân bay, có thể lọc theo thành phố, quốc gia và phân trang.

    Args:
        db (Session): Đối tượng session để tương tác với cơ sở dữ liệu.
        city (Optional[str]): Thành phố sân bay để lọc (tùy chọn).
        country (Optional[str]): Quốc gia sân bay để lọc (tùy chọn).
        page (int): Trang hiện tại (mặc định là 1).
        page_size (int): Số lượng sân bay trên mỗi trang (mặc định là 10).

    Returns:
        List[Airport]: Danh sách các sân bay phù hợp với điều kiện lọc và phân trang.
    """
    query = db.query(Airport)
    
    if city:
        query = query.filter(Airport.city == city)
    if country:
        query = query.filter(Airport.country == country)

    airports = query.all()

    return airports

def get_airport_by_name(db: Session, name: str) -> Airport:
    """
    Lấy thông tin sân bay từ cơ sở dữ liệu theo tên.

    Args:
        db (Session): Đối tượng session để tương tác với cơ sở dữ liệu.
        name (str): Tên của sân bay cần tìm.

    Returns:
        Airport: Đối tượng sân bay tương ứng với tên.
    
    Raises:
        HTTPException: Nếu không tìm thấy sân bay với tên đã cho.
    """
    airport = db.query(Airport).filter(Airport.name == name).first()
    if not airport:
        raise HTTPException(status_code=404, detail="Airport not found.")
    
    return airport