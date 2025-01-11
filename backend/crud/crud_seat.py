from sqlalchemy.orm import Session
from fastapi import HTTPException
from models import Seat
from schemas.seat import SeatCreate, SeatUpdate
from typing import List, Optional

def create_seat(db: Session, seat: SeatCreate) -> Seat:
    """
    Thêm ghế mới vào cơ sở dữ liệu.

    Args:
        db (Session): Đối tượng session để tương tác với cơ sở dữ liệu.
        seat (SeatCreate): Thông tin ghế cần thêm.

    Returns:
        Seat: Đối tượng ghế đã thêm vào cơ sở dữ liệu.
    """
    new_seat = Seat(**seat.model_dump())
    db.add(new_seat)
    db.commit()
    db.refresh(new_seat)

    return new_seat

def get_seat_by_id(db: Session, seat_id: int) -> Seat:
    """
    Lấy thông tin ghế từ cơ sở dữ liệu theo ID.

    Args:
        db (Session): Đối tượng session để tương tác với cơ sở dữ liệu.
        seat_id (int): ID của ghế cần tìm.

    Returns:
        Seat: Đối tượng ghế tương ứng với ID.
    
    Raises:
        HTTPException: Nếu không tìm thấy ghế với ID đã cho.
    """
    seat = db.query(Seat).filter(Seat.id == seat_id).first()
    if not seat:
        raise HTTPException(status_code=404, detail="Seat not found.")
    
    return seat

def update_seat(db: Session, seat_id: int, seat: SeatUpdate) -> Seat:
    """
    Cập nhật thông tin ghế trong cơ sở dữ liệu theo ID.

    Args:
        db (Session): Đối tượng session để tương tác với cơ sở dữ liệu.
        seat_id (int): ID của ghế cần cập nhật.
        seat (SeatUpdate): Thông tin ghế mới.

    Returns:
        Seat: Đối tượng ghế đã cập nhật.
    
    Raises:
        HTTPException: Nếu không tìm thấy ghế với ID đã cho.
    """
    seat_db = db.query(Seat).filter(Seat.id == seat_id).first()
    if not seat_db:
        raise HTTPException(status_code=404, detail="Seat not found.")

    update_data = seat.model_dump()
    for key, value in update_data.items():
        setattr(seat_db, key, value)
    db.commit()
    db.refresh(seat_db)

    return seat_db

def get_seat_of_flight(db: Session, flight_id: int) -> List[Seat]:
    """
    Lấy danh sách ghế từ cơ sở dữ liệu theo ID của chuyến bay.

    Args:
        db (Session): Đối tượng session để tương tác với cơ sở dữ liệu.
        flight_id (int): ID của chuyến bay mà ghế thuộc về.

    Returns:
        list[Seat]: Danh sách
    """
    return db.query(Seat).filter(Seat.flight_id == flight_id).all()

def get_all_seats(db: Session, flight_ids: List[int], seat_class: str, is_available: bool = True) -> List[Seat]:
    """
    Lấy danh sách ghế từ cơ sở dữ liệu theo các điều kiện tùy chọn.

    Args:
        db (Session): Đối tượng session để tương tác với cơ sở dữ liệu.
        flight_id (int): ID của chuyến bay mà ghế thuộc về.
        seat_class (str): Loại ghế (economy hoặc business).
        is_available (bool): Trạng thái ghế (còn trống hay không).

    Returns:
        list[Seat]: Danh sách
    """
    query = db.query(Seat)
    if flight_ids:
        query = query.filter(Seat.flight_id.in_(flight_ids))
    if seat_class:
        query = query.filter(Seat.seat_class == seat_class)
    if is_available:
        query = query.filter(Seat.is_available == is_available)

    return query.all()

def delete_seat(db: Session, seat_id: int) -> Seat:
    """
    Xoá thông tin ghế trong cơ sở dữ liệu theo ID.

    Args:
        db (Session): Đối tượng session để tương tác với cơ sở dữ liệu.
        seat_id (int): ID của ghế cần xoá.

    Returns:
        Seat: Đối tượng ghế đã xoá.
    
    Raises:
        HTTPException: Nếu không tìm thấy ghế với ID đã cho.
    """
    seat = db.query(Seat).filter(Seat.id == seat_id).first()
    if not seat:
        raise HTTPException(status_code=404, detail="Seat not found.")

    db.delete(seat)
    db.commit()

    return seat

def update_available(db: Session, seat_id: int, is_available: bool) -> Seat:
    """
    Cập nhật trạng thái ghế trong cơ sở dữ liệu theo ID.

    Args:
        db (Session): Đối tượng session để tương tác với cơ sở dữ liệu.
        seat_id (int): ID của ghế cần cập nhật.
        is_available (bool): Trạng thái ghế mới.

    Returns:
        Seat: Đối tượng ghế đã cập nhật.
    
    Raises:
        HTTPException: Nếu không tìm thấy ghế với ID đã cho.
    """
    seat_db = db.query(Seat).filter(Seat.id == seat_id).first()
    if not seat_db:
        raise HTTPException(status_code=404, detail="Seat not found.")

    seat_db.is_available = is_available
    db.commit()
    db.refresh(seat_db)

    return seat_db

def delete_seat_flight(db: Session, flight_id: int) -> List[Seat]:
    """
    Xoá thông tin ghế trong cơ sở dữ liệu theo ID của chuyến bay.

    Args:
        db (Session): Đối tượng session để tương tác với cơ sở dữ liệu.
        flight_id (int): ID của chuyến bay mà ghế thuộc về.

    Returns:
        list[Seat]: Danh sách ghế đã xoá.
    """
    seats = db.query(Seat).filter(Seat.flight_id == flight_id).all()
    for seat in seats:
        db.delete(seat)
    db.commit()

    return seats

def create_seats(db: Session, seats: List[SeatCreate]) -> List[Seat]:
    """
    Thêm danh sách ghế mới vào cơ sở dữ liệu.

    Args:
        db (Session): Đối tượng session để tương tác với cơ sở dữ liệu.
        seats (list[SeatCreate]): Danh sách thông tin ghế cần thêm.

    Returns:
        list[Seat]: Danh sách ghế đã thêm vào cơ sở dữ liệu.
    """
    new_seats = [Seat(**s.model_dump()) for s in seats]
    db.add_all(new_seats)
    db.commit()

    return new_seats

def get_seat_by_flight_and_seat_number(db: Session, flight_id: int, seat_number: str) -> Seat:
    """
    Lấy thông tin ghế từ cơ sở dữ liệu theo ID của chuyến bay và số ghế.

    Args:
        db (Session): Đối tượng session để tương tác với cơ sở dữ liệu.
        flight_id (int): ID của chuyến bay mà ghế thuộc về.
        seat_number (str): Số ghế.

    Returns:
        Seat: Đối tượng ghế tương ứng với ID của chuyến bay và số ghế.
    
    Raises:
        HTTPException: Nếu không tìm thấy ghế với ID của chuyến bay và số ghế đã cho.
    """
    seat = db.query(Seat).filter(Seat.flight_id == flight_id, Seat.seat_number == seat_number).first()
    if not seat:
        raise HTTPException(status_code=404, detail="Seat not found.")
    
    return seat