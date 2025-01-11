from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from api.deps import get_session
from typing import Optional, List
from pydantic import BaseModel
from crud import crud_invoice, crud_flight, crud_ticket, crud_airline, crud_airport
from models import User
from core.permissions import get_current_user, has_permission
from datetime import datetime

class TicketDetail(BaseModel):
    TicketID: int
    SeatClass: str
    TicketPrice: float
class InvoiceDetail(BaseModel):
    FlightNumber: str
    Airline: str
    Model: str
    Departure: str
    Arrival: str
    DepartureTime: str
    ArrivalTime: str
    TotalCount: int
    TicketAmount: float
    InvoiceDetails: List[TicketDetail]

class InvoiceInfo(BaseModel):
    InvoiceID: int
    FlightNumber: str
    TicketCount: int
    TotalAmount: float
    InvoiceDate: str

router = APIRouter()

# Lấy danh sách hóa đơn
@router.get("/invoices", response_model=List[InvoiceInfo])
def read_invoices(db: Session = Depends(get_session), user: User = Depends(get_current_user)):
    invoices = crud_invoice.get_all_invoices(db, user.id)

    list_invoice = []
    for invoice in invoices:
        flight_id = invoice.flight_id
        flight = crud_flight.get_flight_by_id(db, flight_id)
        tickets = crud_ticket.get_ticket_by_invoice_id(db, invoice.id)
        list_invoice.append(InvoiceInfo(InvoiceID=invoice.id,
                                        FlightNumber=flight.flight_number,
                                        TicketCount=len(tickets),
                                        TotalAmount=invoice.total_price,
                                        InvoiceDate=invoice.created_at.strftime('%Y-%m-%d')))
    return list_invoice

# Lấy thông tin chi tiết hóa đơn
@router.get("/invoices/{invoice_id}", response_model=InvoiceDetail)
def read_invoice(invoice_id: int, db: Session = Depends(get_session)):
    invoice = crud_invoice.get_invoice_by_id(db, invoice_id)
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    flight_id = invoice.flight_id
    flight = crud_flight.get_flight_by_id(db, flight_id)
    tickets = crud_ticket.get_ticket_by_invoice_id(db, invoice.id)
    airline = crud_airline.get_airline_by_id(db, flight.airline_id)
    departure_airport = crud_airport.get_airport_by_id(db, flight.departure_airport_id)
    arrival_airport = crud_airport.get_airport_by_id(db, flight.arrival_airport_id)
    ticket_details = []
    for ticket in tickets:
        t_type = crud_ticket.get_ticket_type_by_id(db, ticket.ticket_type_id)
        ticket_details.append(TicketDetail(TicketID=ticket.id,
                                            SeatClass=t_type.name,
                                            TicketPrice=ticket.price))
    return InvoiceDetail(FlightNumber=flight.flight_number,
                        Airline=airline.name,
                        Model="",
                        Departure=f'{departure_airport.city}, {departure_airport.country}',
                        Arrival=f'{arrival_airport.city}, {arrival_airport.country}',
                        DepartureTime=flight.departure_time.strftime('%H:%M %d/%m/%Y'),
                        ArrivalTime=flight.arrival_time.strftime('%H:%M %d/%m/%Y'),
                        TotalCount=len(tickets),
                        TicketAmount=invoice.total_price,
                        InvoiceDetails=ticket_details)

class FilterInvoice(BaseModel):
    InvoiceID: Optional[int] = None
    FlightNumber: Optional[str] = None
    InvoiceDate: Optional[str] = None

# loc hoa don theo ngay tao, flight_number, invoice_id
@router.post("/filter", response_model=List[InvoiceInfo])
def filter_invoices(filter_invoice: FilterInvoice, db: Session = Depends(get_session)):
    filter_date = (
            datetime.fromisoformat(filter_invoice.InvoiceDate.replace("Z", "+00:00"))
            if filter_invoice.InvoiceDate
            else None  # Ngày mặc định
        )
    invoices = crud_invoice.get_filter_invoice(db, filter_invoice.InvoiceID, filter_invoice.FlightNumber, filter_date)
    list_invoice = []
    for invoice in invoices:
        flight_id = invoice.flight_id
        flight = crud_flight.get_flight_by_id(db, flight_id)
        tickets = crud_ticket.get_ticket_by_invoice_id(db, invoice.id)
        list_invoice.append(InvoiceInfo(InvoiceID=invoice.id,
                                        FlightNumber=flight.flight_number,
                                        TicketCount=len(tickets),
                                        TotalAmount=invoice.total_price,
                                        InvoiceDate=invoice.created_at.strftime('%Y-%m-%d')))
    return list_invoice

class TicketInfo(BaseModel):
    dob: str
    email: str  
    firstName: str
    gender: str
    lastName: str
    phoneNumber : str
    seat_id: str
    ticket_type_id: int

# Lấy thông tin ticket
@router.get("/ticket_show/{invoice_id}")
def get_tickets(invoice_id: int, db: Session = Depends(get_session)):
    crud_invoice.set_is_paid(db, invoice_id)

    invoice = crud_invoice.get_invoice_by_id(db, invoice_id)
    flight = crud_flight.get_flight_by_id(db, invoice.flight_id)
    tickets = crud_ticket.get_ticket_by_invoice_id(db, invoice_id)
    depart_airport = crud_airport.get_airport_by_id(db, flight.departure_airport_id)
    arrival_airport = crud_airport.get_airport_by_id(db, flight.arrival_airport_id)
    # depart_time - arrival_time 
    flight_time = flight.arrival_time - flight.departure_time
    flight_time = f'{flight_time.seconds // 3600:02}:{(flight_time.seconds // 60) % 60:02}'

    response = {
        "invoice": invoice,
        "flight": flight,
        "depart_airport": depart_airport,
        "arrival_airport": arrival_airport,
        "depart_time": flight.departure_time,
        "arrival_time": flight.arrival_time,
        "flight_time": flight_time,
        "tickets": tickets
    }
    return response
