from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from api.deps import get_session
from typing import Optional, List
from pydantic import BaseModel
from core.permissions import get_current_user, has_permission
from crud import crud_invoice, crud_flight, crud_airport, crud_ticket, crud_seat
from schemas.invoice import InvoiceResponse

router = APIRouter()

#ve da mua
class FlightBooked(BaseModel):
    invoive_id: int
    departure_airport: str
    arrival_airport: str
    departure_time: str
    flight_number : int
    flight_day: str
    flight_time: str
    price: float

class TicketBooked(BaseModel):
    ticket_id: int
    seat_number: str
    seat_class: str
    price: float

class InvoiceBooked(BaseModel):
    invoice_id: int
    total_price: float
    tickets: List[TicketBooked]
    flight_number: str
    flight_name: str
    departure_airport: str
    arrival_airport: str
    departure_time: str
    arrival_time: str
    invoice_day: str

# Lấy danh sách ve may bay da mua
@router.get("/list_ticket", response_model=list[FlightBooked])
def read_tickets(db: Session = Depends(get_session),
                user: dict = Depends(get_current_user)):
    user_id = user.id
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    invoices = crud_invoice.get_all_invoices(db, user_id=user_id, is_cancelled=False)
    list_ticket = []
    for invoice in invoices:
        flight = crud_flight.get_flight_by_id(db, invoice.flight_id)
        departure_airport = crud_airport.get_airport_by_id(db, flight.departure_airport_id)
        arrival_airport = crud_airport.get_airport_by_id(db, flight.arrival_airport_id)
        flight_day = f'{flight.departure_time.day}/{flight.departure_time.month}/{flight.departure_time.year}'
        flight_time = f'{flight.departure_time.hour}h{flight.departure_time.minute}'
        flight_booked = FlightBooked(invoive_id=invoice.id, 
                                    departure_airport=departure_airport.name,
                                    arrival_airport=arrival_airport.name,
                                    departure_time=flight.departure_time,
                                    flight_number=flight.flight_number,
                                    flight_day=flight_day,
                                    flight_time=flight_time,
                                    price=invoice.total_price)
        
        list_ticket.append(flight_booked)

    return list_ticket

#chi tiet ve may bay da mua
@router.get("/ticket_detail", response_model=InvoiceBooked)
def read_ticket_detail(db: Session = Depends(get_session),
                        invoice_id: int = None):
    invoice = crud_invoice.get_invoice_by_id(db, invoice_id)
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    
    flight = crud_flight.get_flight_by_id(db, invoice.flight_id)
    departure_airport = crud_airport.get_airport_by_id(db, flight.departure_airport_id).name
    arrival_airport = crud_airport.get_airport_by_id(db, flight.arrival_airport_id).name
    flight_day = f'{flight.departure_time.day}/{flight.departure_time.month}/{flight.departure_time.year}'
    flight_time = f'{flight.departure_time.hour}h{flight.departure_time.minute}'
    arrival_time = f'{flight.arrival_time.hour}h{flight.arrival_time.minute}'
    invoice_day = f'{invoice.created_at.day}/{invoice.created_at.month}/{invoice.created_at.year}'
    tickets = crud_ticket.get_ticket_by_invoice_id(db, invoice_id)
    list_ticket = []
    for ticket in tickets:
        ticket_booked = TicketBooked(ticket_id=ticket.id, 
                                    seat_number=ticket.seat_number,
                                    seat_class=ticket.seat_class,
                                    price=ticket.price)
        list_ticket.append(ticket_booked)
    
    invoice_booked = InvoiceBooked(invoice_id=invoice.id,
                                    total_price=invoice.total_price,
                                    tickets=list_ticket,
                                    flight_number=flight.flight_number,
                                    flight_name=flight.name,
                                    departure_airport=departure_airport.name,
                                    arrival_airport=arrival_airport.name,
                                    departure_time=flight_time,
                                    arrival_time=arrival_time,
                                    invoice_day=invoice_day)
    
    return invoice_booked

#huy ve
@router.get("/ticket_cancelled", response_model=InvoiceResponse)
def cancel_ticket(db: Session = Depends(get_session),
                    invoice_id: int = None, has_permission: bool = Depends(has_permission(["FULL_ACCESS"]))):
    
    if not has_permission:
        raise HTTPException(status_code=403, detail="User does not have permission to access this resource")

    invoice = crud_invoice.get_invoice_by_id(db, invoice_id)

    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    
    if invoice.is_cancelled:
        raise HTTPException(status_code=400, detail="Invoice is already cancelled")
    
    tickets = crud_ticket.get_ticket_by_invoice_id(db, invoice_id)
    for ticket in tickets:
        ticket_db = crud_ticket.get_ticket_by_id(db, ticket.id)
        ticket_db.is_cancelled = True
        seat_db = crud_seat.get_seat_by_id(db, ticket_db.seat_id)
        seat_db.is_available = True
        db.commit()

    invoice = crud_invoice.update_invoice(db, invoice_id, is_cancelled=True)

    return invoice

class UserTicket(BaseModel):
    bookingCode: str
    departure: str
    arrive: str
    departureDate: str
    flightCode: str
    seat: str
    type: str

@router.get("/user_ticket", response_model=list[UserTicket])
def get_user_ticket(db: Session = Depends(get_session),
                    user: dict = Depends(get_current_user)):
    user_id = user.id
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    tickets = crud_ticket.get_ticket_by_user_id(db, user_id)
    list_ticket = []
    for ticket in tickets:
        flight = crud_flight.get_flight_by_id(db, ticket.flight_id)
        departure_airport = crud_airport.get_airport_by_id(db, flight.departure_airport_id)
        arrival_airport = crud_airport.get_airport_by_id(db, flight.arrival_airport_id)
        flight_day = f'{flight.departure_time.day}/{flight.departure_time.month}/{flight.departure_time.year}'
        seat = crud_seat.get_seat_by_id(db, ticket.seat_id)
        invoice = crud_invoice.get_invoice_by_id(db, ticket.invoice_id)
        user_ticket = UserTicket(bookingCode=invoice.booking_code,
                                departure=departure_airport.name,
                                arrive=arrival_airport.name,
                                departureDate=flight_day,
                                flightCode=flight.flight_number,
                                seat=seat.seat_number,
                                type=seat.seat_class)
        list_ticket.append(user_ticket)

    return list_ticket