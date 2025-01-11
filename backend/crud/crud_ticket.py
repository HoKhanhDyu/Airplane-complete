from sqlalchemy.orm import Session
from fastapi import HTTPException
from models import Ticket, Seat, TicketType
from schemas.ticket import TicketCreate, TicketUpdate, TicketResponse, TicketTypeResponse
from typing import List
from crud import crud_seat, crud_invoice, crud_flight

def get_ticket_type(db: Session, ticket_type: str) -> List[TicketTypeResponse]:
    """
    Lấy thông tin vé theo loại vé.

    Args:
        db (Session): Đối tượng session để tương tác với cơ sở dữ liệu.
        ticket_type (str): Loại vé cần lấy thông tin.

    Returns:
        List[TicketTypeResponse]: Danh sách vé theo loại vé.
    """
    tickets = db.query(Ticket).filter(Ticket.ticket_type == ticket_type).all()
    return tickets

def get_ticket_type_by_id(db: Session, ticket_id: int) -> TicketTypeResponse:
    """
    Lấy thông tin vé theo ID.

    Args:
        db (Session): Đối tượng session để tương tác với cơ sở dữ liệu.
        ticket_id (int): ID của vé cần lấy thông tin.

    Returns:
        TicketTypeResponse: Thông tin vé theo ID.
    """
    ticket = db.query(TicketType).filter(TicketType.id == ticket_id).first()
    return ticket

def create_ticket(db: Session, ticket: TicketCreate) -> Ticket:
    """
    Thêm vé mới vào cơ sở dữ liệu.

    Args:
        db (Session): Đối tượng session để tương tác với cơ sở dữ liệu.
        ticket (TicketCreate): Thông tin vé cần thêm.

    Returns:
        Ticket: Đối tượng vé đã thêm vào cơ sở dữ liệu.
    """
    # Tạo vé mới
    new_ticket = Ticket(**ticket.model_dump())
    db.add(new_ticket)
    db.commit()
    db.refresh(new_ticket)

    return new_ticket

def get_ticket_by_id(db: Session, ticket_id: int) -> Ticket:
    """
    Lấy thông tin vé từ cơ sở dữ liệu theo ID.

    Args:
        db (Session): Đối tượng session để tương tác với cơ sở dữ liệu.
        ticket_id (int): ID của vé cần tìm.

    Returns:
        Ticket: Đối tượng vé tương ứng với ID.
    
    Raises:
        HTTPException: Nếu không tìm thấy vé với ID đã cho.
    """
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found.")
    
    return ticket

def update_ticket(db: Session, ticket_id: int, ticket: TicketUpdate) -> Ticket:
    """
    Cập nhật thông tin vé trong cơ sở dữ liệu theo ID.

    Args:
        db (Session): Đối tượng session để tương tác với cơ sở dữ liệu.
        ticket_id (int): ID của vé cần cập nhật.
        ticket (TicketUpdate): Thông tin vé mới.

    Returns:
        Ticket: Đối tượng vé đã cập nhật.
    
    Raises:
        HTTPException: Nếu không tìm thấy vé với ID đã cho.
    """
    ticket_db = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not ticket_db:
        raise HTTPException(status_code=404, detail="Ticket not found.")
    
    # Cập nhật thông tin vé
    if ticket.ticket_id:
        ticket_db.ticket_id = ticket.ticket_id
    if ticket.ticket_type:
        ticket_db.ticket_type = ticket.ticket_type
    if ticket.price:
        ticket_db.price = ticket.price
    if ticket.seat_id:
        ticket_db.seat_id = ticket.seat_id
    if ticket.flight_id:
        ticket_db.flight_id = ticket.flight_id
    if ticket.passenger_name:
        ticket_db.passenger_name = ticket.passenger_name
    if ticket.passenger_email:
        ticket_db.passenger_email = ticket.passenger_email
    if ticket.passenger_phone:
        ticket_db.passenger_phone = ticket.passenger_phone
    if ticket.passenger_address:
        ticket_db.passenger_address = ticket.passenger_address
    if ticket.invoice_id:
        ticket_db.invoice_id = ticket.invoice_id

    db.commit()

    return ticket_db

def delete_ticket(db: Session, ticket_id: int) -> Ticket:
    """
    Xoá vé từ cơ sở dữ liệu theo ID.

    Args:
        db (Session): Đối tượng session để tương tác với cơ sở dữ liệu.
        ticket_id (int): ID của vé cần xoá.

    Returns:
        Ticket: Đối tượng vé đã xoá.

    Raises:
        HTTPException: Nếu không tìm thấy vé với ID đã cho.
    """
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found.")
    
    db.delete(ticket)
    db.commit()
    
    return ticket

def get_ticket_by_flight_id(db: Session, flight_id: int) -> List[Ticket]:
    """
    Lấy thông tin vé từ cơ sở dữ liệu theo ID chuyến bay.

    Args:
        db (Session): Đối tượng session để tương tác với cơ sở dữ liệu.
        flight_id (int): ID của chuyến bay cần lấy vé.

    Returns:
        List[Ticket]: Danh sách vé của chuyến bay.
    """
    tickets = db.query(Ticket).filter(Ticket.flight_id == flight_id).all()
    return tickets

def get_ticket_by_invoice_id(db: Session, invoice_id: int) -> List[Ticket]:
    """
    Lấy thông tin vé từ cơ sở dữ liệu theo ID hóa đơn.

    Args:
        db (Session): Đối tượng session để tương tác với cơ sở dữ liệu.
        invoice_id (int): ID của hóa đơn cần lấy vé.

    Returns:
        List[Ticket]: Danh sách vé của hóa đơn.
    """
    tickets = db.query(Ticket).filter(Ticket.invoice_id == invoice_id).all()
    return tickets

def get_ticket_by_user_id(db: Session, user_id: int) -> List[Ticket]:
    """
    Lấy thông tin vé từ cơ sở dữ liệu theo ID người dùng.

    Args:
        db (Session): Đối tượng session để tương tác với cơ sở dữ liệu.
        user_id (int): ID của người dùng cần lấy vé.

    Returns:
        List[Ticket]: Danh sách vé của người dùng.
    """
    invoices = crud_invoice.get_all_invoices(db, user_id=user_id)
    tickets = []
    for invoice in invoices:
        tickets.extend(get_ticket_by_invoice_id(db, invoice.id))

    return tickets