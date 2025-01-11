from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from crud import crud_airline, crud_flight, crud_seat, crud_ticket, crud_invoice
from schemas.airline import AirlineCreate, AirlineUpdate, AirlineResponse
from schemas.flight import FlightResponse
from schemas.ticket import TicketCreate
from schemas.invoice import InvoiceCreate, InvoiceResponse
from api.deps import get_session
from typing import Optional, List
from core.permissions import get_current_user
from pydantic import BaseModel
from models import User

router = APIRouter()

class SeatInfo(BaseModel):
    id: int
    seatRow: str
    seatNumber: str
    available: bool

class seatFlight(BaseModel):
    economySeats: List[SeatInfo]
    businessSeats: List[SeatInfo]

@router.get("/seats/{flight_id}", response_model=List[seatFlight])
def read_seats(flight_id: int, db: Session = Depends(get_session)):
    flight = crud_flight.get_flight_by_id(db, flight_id)
    if not flight:
        raise HTTPException(status_code=404, detail="Flight not found")
    
    seats = crud_seat.get_seat_of_flight(db, flight_id=flight_id)
    economy_seats = []
    business_seats = []
    for seat in seats:
        row, col = seat.get_seat_position()
        seat_info = SeatInfo(id=seat.id, seatRow=row, seatNumber=col, available=seat.is_available)
        if seat.seat_class == "economy":
            economy_seats.append(seat_info)
        else:
            business_seats.append(seat_info)

    return [seatFlight(economySeats=economy_seats, businessSeats=business_seats)]

# Lấy danh sách sân bay
@router.get("/airlines", response_model=list[AirlineResponse])
def read_airlines(db: Session = Depends(get_session)):
    return crud_airline.get_all_airlines(db)

# Lấy danh sách hãng hàng không
@router.get("/airlines", response_model=list[AirlineResponse])
def read_airlines(db: Session = Depends(get_session)):
    return crud_airline.get_all_airlines(db)

# Lay nhung chuyen bay hop le
@router.get("/search_flight", response_model=list[FlightResponse])
def read_flights(db: Session = Depends(get_session), 
                    departure_airport_id: Optional[int] = None, 
                    arrival_airport_id: Optional[int] = None,
                    airline_id: Optional[int] = None,
                    seat_class: Optional[str] = None,
                    number_of_passengers: Optional[int] = 0):
    list_flight = crud_flight.get_all_flights(db, departure_airport_id, arrival_airport_id, airline_id)

    seats = crud_seat.get_all_seats(db, flight_ids=[flight.id for flight in list_flight], seat_class=seat_class)

    list_available_flights = []
    for flight in list_flight:
        flight_seats = [seat for seat in seats if seat.flight_id == flight.id]
        if len(flight_seats) >= number_of_passengers:
            list_available_flights.append(flight)

    return list_available_flights

class TicketInfo(BaseModel):
    dob: str
    email: str  
    firstName: str
    gender: str
    lastName: str
    phoneNumber : str
    seat_id: str
    ticket_type_id: int

class BuyTicketInput(BaseModel):
    flight_id: int
    ticket: List[TicketInfo]
    booking_code: str
    additional: float
    seat_type: str

# mua ve
@router.post("/buy_ticket", response_model=InvoiceResponse)
def buy_ticket( buy_ticket_input: BuyTicketInput,
                db: Session = Depends(get_session), 
                user: User = Depends(get_current_user)):
    
    # Kiểm tra ghế
    for t in buy_ticket_input.ticket:
        seat = crud_seat.get_seat_by_flight_and_seat_number(db, buy_ticket_input.flight_id, t.seat_id)
        if not seat:
            raise HTTPException(status_code=404, detail="Seat not found")
        if not seat.is_available:
            raise HTTPException(status_code=400, detail="Seat is already booked")
        if seat.flight_id != buy_ticket_input.flight_id:
            raise HTTPException(status_code=400, detail="Seat does not belong to this flight")
    
    # Kiểm tra chuyến bay
    flight = crud_flight.get_flight_by_id(db, buy_ticket_input.flight_id)
    if not flight:
        raise HTTPException(status_code=404, detail="Flight not found")
    
    ticket_price = buy_ticket_input.additional

    if buy_ticket_input.seat_type == "business":
        ticket_price += flight.price_business
    else:
        ticket_price += flight.price_economy
    
    # Tạo hóa đơn
    user_id = user.id
    total_price = ticket_price * len(buy_ticket_input.ticket)
    invoice_create = InvoiceCreate(flight_id=buy_ticket_input.flight_id, user_id=user_id, total_price=total_price, booking_code=buy_ticket_input.booking_code)
    invoice = crud_invoice.create_invoice(db, invoice_create)
    
    # Tạo vé
    created_tickets = []
    for t in buy_ticket_input.ticket:
        seat = crud_seat.get_seat_by_flight_and_seat_number(db, buy_ticket_input.flight_id, t.seat_id)
        ticket_info = TicketCreate(
            first_name=t.firstName,
            last_name=t.lastName,
            birth_date=t.dob,
            male=t.gender,
            citizen_id='',
            price=ticket_price,
            passenger_email=t.email,
            passenger_phone=t.phoneNumber,
            invoice_id=invoice.id,
            seat_id=seat.id,
            flight_id=buy_ticket_input.flight_id,
            ticket_type_id=t.ticket_type_id
        )
        ticket = crud_ticket.create_ticket(db, ticket_info)
        created_tickets.append(ticket)

        # Cập nhật trạng thái ghế
        seat = crud_seat.get_seat_by_flight_and_seat_number(db, buy_ticket_input.flight_id, t.seat_id)
        seat.is_available = False
        crud_seat.update_seat(db, seat.id, seat)

    return invoice