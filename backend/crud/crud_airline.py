from sqlalchemy.orm import Session
from sqlmodel import select
from models import Airline
from typing import Optional, List
from fastapi import HTTPException
from schemas.airline import AirlineCreate, AirlineUpdate, AirlineResponse

def create_airline(db: Session, airline: AirlineCreate) -> Airline:
    """
    Thêm hãng hàng không mới vào cơ sở dữ liệu.

    Args:
        db (Session): Đối tượng session để tương tác với cơ sở dữ liệu.
        airline (AirlineCreate): Thông tin hãng hàng không cần thêm.

    Returns:
        Airline: Đối tượng hãng hàng không đã thêm vào cơ sở dữ liệu.
    """
    new_airline = Airline(**airline.model_dump(), logo="")
    db.add(new_airline)
    db.commit()
    db.refresh(new_airline)
    
    return new_airline

def get_airline_by_id(db: Session, airline_id: int) -> Airline:
    """
    Lấy thông tin hãng hàng không từ cơ sở dữ liệu theo ID.

    Args:
        db (Session): Đối tượng session để tương tác với cơ sở dữ liệu.
        airline_id (int): ID của hãng hàng không cần tìm.

    Returns:
        Airline: Đối tượng hãng hàng không tương ứng với ID.
    
    Raises:
        HTTPException: Nếu không tìm thấy hãng hàng không với ID đã cho.
    """
    airline = db.query(Airline).filter(Airline.id == airline_id).first()
    if not airline:
        raise HTTPException(status_code=404, detail="Airline not found.")
    
    return airline

def update_airline(db: Session, airline_id: int, airline: AirlineUpdate) -> Airline:
    """
    Cập nhật thông tin hãng hàng không trong cơ sở dữ liệu theo ID.

    Args:
        db (Session): Đối tượng session để tương tác với cơ sở dữ liệu.
        airline_id (int): ID của hãng hàng không cần cập nhật.
        airline (AirlineUpdate): Thông tin hãng hàng không mới.

    Returns:
        Airline: Đối tượng hãng hàng không đã cập nhật.
    
    Raises:
        HTTPException: Nếu không tìm thấy hãng hàng không với ID đã cho.
    """
    old_airline = get_airline_by_id(db, airline_id)
    for key, value in airline.model_dump().items():
        if key in airline.model_dump(exclude_unset=True):
            setattr(old_airline, key, getattr(airline, key))
    db.commit()
    db.refresh(old_airline)
    
    return old_airline

def delete_airline(db: Session, airline_id: int) -> Airline:
    """
    Xoá hãng hàng không từ cơ sở dữ liệu theo ID.

    Args:
        db (Session): Đối tượng session để tương tác với cơ sở dữ liệu.
        airline_id (int): ID của hãng hàng không cần xoá.

    Returns:
        Airline: Đối tượng hãng hàng không đã xoá.
    
    Raises:
        HTTPException: Nếu không tìm thấy hãng hàng không với ID đã cho.
    """
    airline = get_airline_by_id(db, airline_id)
    db.delete(airline)
    db.commit()
    
    return airline

def get_all_airlines(db: Session, country: Optional[str] = None) -> List[Airline]:
    """
    Lấy danh sách tất cả hãng hàng không từ cơ sở dữ liệu.

    Args:
        db (Session): Đối tượng session để tương tác với cơ sở dữ liệu.
        country (Optional[str]): Quốc gia của hãng hàng không (tùy chọn).

    Returns:
        List[Airline]: Danh sách tất cả hãng hàng không.
    """
    if country:
        return db.exec(select(Airline).where(Airline.country == country)).all()
    return db.exec(select(Airline)).all()

def get_airline_by_name(db: Session, name: str) -> Airline:
    """
    Lấy thông tin hãng hàng không từ cơ sở dữ liệu theo tên.

    Args:
        db (Session): Đối tượng session để tương tác với cơ sở dữ liệu.
        name (str): Tên của hãng hàng không cần tìm.

    Returns:
        Airline: Đối tượng hãng hàng không tương ứng với tên.
    
    Raises:
        HTTPException: Nếu không tìm thấy hãng hàng không với tên đã cho.
    """
    airline = db.query(Airline).filter(Airline.name == name).first()
    if not airline:
        raise HTTPException(status_code=404, detail="Airline not found.")

    return airline
