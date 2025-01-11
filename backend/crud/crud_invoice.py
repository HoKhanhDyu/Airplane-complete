from sqlalchemy.orm import Session
from fastapi import HTTPException
from models import Invoice
from schemas.invoice import InvoiceCreate, InvoiceUpdate
from typing import List, Optional
from crud import crud_ticket, crud_flight
from datetime import date

def create_invoice(db: Session, invoice: InvoiceCreate) -> Invoice:
    """
    Thêm hóa đơn mới vào cơ sở dữ liệu.

    Args:
        db (Session): Đối tượng session để tương tác với cơ sở dữ liệu.
        invoice (InvoiceCreate): Thông tin hóa đơn cần thêm.

    Returns:
        Invoice: Đối tượng hóa đơn đã thêm vào cơ sở dữ liệu.
    """
    new_invoice = Invoice(**invoice.model_dump())
    db.add(new_invoice)
    db.commit()
    db.refresh(new_invoice)

    return new_invoice

def get_invoice_by_id(db: Session, invoice_id: int) -> Invoice:
    """
    Lấy thông tin hóa đơn từ cơ sở dữ liệu theo ID.

    Args:
        db (Session): Đối tượng session để tương tác với cơ sở dữ liệu.
        invoice_id (int): ID của hóa đơn cần tìm.

    Returns:
        Invoice: Đối tượng hóa đơn tương ứng với ID.
    
    Raises:
        HTTPException: Nếu không tìm thấy hóa đơn với ID đã cho.
    """
    invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found.")
    
    return invoice

def update_invoice(db: Session, invoice_id: int, invoice: InvoiceUpdate) -> Invoice:
    """
    Cập nhật thông tin hóa đơn trong cơ sở dữ liệu theo ID.

    Args:
        db (Session): Đối tượng session để tương tác với cơ sở dữ liệu.
        invoice_id (int): ID của hóa đơn cần cập nhật.
        invoice (InvoiceUpdate): Thông tin hóa đơn mới.

    Returns:
        Invoice: Đối tượng hóa đơn đã cập nhật.
    
    Raises:
        HTTPException: Nếu không tìm thấy hóa đơn với ID đã cho.
    """
    invoice_db = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not invoice_db:
        raise HTTPException(status_code=404, detail="Invoice not found.")

    update_data = invoice.dict()
    for key, value in update_data.items():
        setattr(invoice_db, key, value)
    db.commit()
    db.refresh(invoice_db)

    return invoice_db

def set_paid_status(db: Session, invoice_id: int, is_paid: bool) -> Invoice:
    """
    Cập nhật trạng thái thanh toán của hóa đơn trong cơ sở dữ liệu theo ID.

    Args:
        db (Session): Đối tượng session để tương tác với cơ sở dữ liệu.
        invoice_id (int): ID của hóa đơn cần cập nhật.
        is_paid (bool): Trạng thái thanh toán mới.

    Returns:
        Invoice: Đối tượng hóa đơn đã cập nhật.
    
    Raises:
        HTTPException: Nếu không tìm thấy hóa đơn với ID đã cho.
    """
    invoice_db = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not invoice_db:
        raise HTTPException(status_code=404, detail="Invoice not found.")

    invoice_db.is_paid = is_paid
    db.commit()
    db.refresh(invoice_db)

    return invoice_db

def get_all_invoices(db: Session, user_id: Optional[int] = None, is_cancelled: Optional[bool] = None) -> List[Invoice]:
    """
    Lấy danh sách tất cả hóa đơn từ cơ sở dữ liệu.

    Args:
        db (Session): Đối tượng session để tương tác với cơ sở dữ liệu.

    Returns:
        list[Invoice]: Danh sách tất cả hóa đơn.
    """
    invoices = db.query(Invoice).all()
    if user_id:
        invoices = [invoice for invoice in invoices if invoice.user_id == user_id]
    if is_cancelled is not None:
        invoices = [invoice for invoice in invoices if invoice.is_cancelled == is_cancelled]

    return invoices

def delete_invoice(db: Session, invoice_id: int) -> Invoice:
    """
    Xoá thông tin hóa đơn trong cơ sở dữ liệu theo ID.

    Args:
        db (Session): Đối tượng session để tương tác với cơ sở dữ liệu.
        invoice_id (int): ID của hóa đơn cần xoá.

    Returns:
        Invoice: Đối tượng hóa đơn đã xoá.
    
    Raises:
        HTTPException: Nếu không tìm thấy hóa đơn với ID đã cho.
    """
    invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found.")

    db.delete(invoice)
    db.commit()

    return invoice  

def get_flight_id_of_invoice(db: Session, invoice_id: int) -> int:
    """
    Lấy ID chuyến bay của hóa đơn từ cơ sở dữ liệu.

    Args:
        db (Session): Đối tượng session để tương tác với cơ sở dữ liệu.
        invoice_id (int): ID của hóa đơn cần tìm.

    Returns:
        int: ID chuyến bay của hóa đơn.
    """
    ticket = crud_ticket.get_ticket_by_invoice_id(db, invoice_id)[0]
    return ticket.flight_id

def get_filter_invoice(db: Session, invoice_id: Optional[int] = None, flight_number: Optional[str] = None,
                       date_created: Optional[date] = None) -> List[Invoice]:
    """
    Lấy danh sách hóa đơn từ cơ sở dữ liệu theo các điều kiện tùy chọn.

    Args:
        db (Session): Đối tượng session để tương tác với cơ sở dữ liệu.
        invoice_id (Optional[int]): ID của hóa đơn.
        flight_number (Optional[str]): Số hiệu chuyến bay.
        date_created (Optional[str]): Ngày tạo hóa đơn.

    Returns:
        List[Invoice]: Danh sách hóa đơn.
    """

    query = db.query(Invoice)

    if invoice_id:
        query = query.filter(Invoice.id == invoice_id)

    if flight_number:
        flight = crud_flight.get_flight_by_number(db, flight_number)
        query = query.filter(Invoice.flight_id == flight.id)

    if date_created:
        query = query.filter(Invoice.created_at == date_created)


    return query.all()

def set_is_paid(db: Session, invoice_id: int) -> Invoice:
    """
    Cập nhật trạng thái thanh toán của hóa đơn trong cơ sở dữ liệu theo ID.

    Args:
        db (Session): Đối tượng session để tương tác với cơ sở dữ liệu.
        invoice_id (int): ID của hóa đơn cần cập nhật.
        is_paid (bool): Trạng thái thanh toán mới.

    Returns:
        Invoice: Đối tượng hóa đơn đã cập nhật.
    
    Raises:
        HTTPException: Nếu không tìm thấy hóa đơn với ID đã cho.
    """
    invoice_db = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not invoice_db:
        raise HTTPException(status_code=404, detail="Invoice not found.")

    invoice_db.is_paid = True
    db.commit()
    db.refresh(invoice_db)

    return invoice_db