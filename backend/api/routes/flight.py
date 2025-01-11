from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from crud import crud_flight, crud_aircraft, crud_seat, crud_airport, crud_airline
from schemas.flight import FlightCreate, FlightUpdate, FlightResponse
from schemas.aircraft import AircraftResponse
from schemas.seat import SeatCreate
from api.deps import get_session
from typing import Optional, List
from pydantic import BaseModel
from core.permissions import has_permission
from datetime import datetime

router = APIRouter()

class FlightInfo(BaseModel):
    id: int 
    departure: str = None
    departureAirport: str = None
    from_code: str = None
    fromDetail: str = None
    arrival: str = None
    arrivalAirport: str = None
    to_code: str = None
    toDetail: str = None
    company: str = None
    companyAbbreviation: str = None
    price: float = None
    duration: str = None
    flight_number: str = None
    # staff
    AirplaneID: int = None
    TakeOffPlace: str = None
    LandingPlace: str = None
    DepartureAirport: int = None
    ArrivalAirport: int = None
    DepartureTime: str = None
    ArrivalTime: str = None
    FlightDuration: str = None
    Giave: float = None
    Note: str = None



# Lấy danh sách chuyến bay
@router.get("/flights", response_model=list[FlightInfo])
def read_flights(db: Session = Depends(get_session), 
                    departure_airport_id: Optional[int] = None, 
                    arrival_airport_id: Optional[int] = None,
                    time_departure: Optional[str] = None,
                    airline_id: Optional[int] = None,
                    seat_class: Optional[str] = None,
                    number_of_passengers: Optional[int] = 0):
    
    if not departure_airport_id and not arrival_airport_id and not airline_id:
        list_flight = crud_flight.get_all_flights(db)
        all_flight = []
        for flight in list_flight:
            departure_airport = crud_airport.get_airport_by_id(db, flight.departure_airport_id)
            arrival_airport = crud_airport.get_airport_by_id(db, flight.arrival_airport_id)
            flight_info = FlightInfo(id=flight.id,
                                     flight_number=flight.flight_number,
                                    AirplaneID=flight.aircraft_id,
                                    TakeOffPlace=f'{departure_airport.city}, {departure_airport.country}',
                                    LandingPlace=f'{arrival_airport.city}, {arrival_airport.country}',
                                    DepartureAirport=flight.departure_airport_id,
                                    ArrivalAirport=flight.arrival_airport_id,
                                    DepartureTime=flight.departure_time.strftime("%H:%M %d/%m/%Y"),
                                    ArrivalTime=flight.arrival_time.strftime("%H:%M %d/%m/%Y"),
                                    FlightDuration=str(flight.arrival_time - flight.departure_time),
                                    Giave=flight.price_economy,
                                    Note='')
            all_flight.append(flight_info)
        return all_flight
            

    list_flight = crud_flight.get_all_flights(db, departure_airport_id, arrival_airport_id, airline_id,time_departure)
    departure_airport = crud_airport.get_airport_by_id(db, departure_airport_id)
    arrival_airport = crud_airport.get_airport_by_id(db, arrival_airport_id)
    airline = crud_airline.get_airline_by_id(db, airline_id) if airline_id else None
    
    seats = crud_seat.get_all_seats(db, flight_ids=[flight.id for flight in list_flight], seat_class=seat_class)

    list_available_flights = []
    for flight in list_flight:
        flight_seats = [seat for seat in seats if seat.flight_id == flight.id]
        if len(flight_seats) >= number_of_passengers:
            airport = crud_aircraft.get_aircraft_by_id(db, flight.aircraft_id)
            airline = crud_airline.get_airline_by_id(db, airport.airline_id)
            de_time = flight.departure_time.strftime("%H:%M %d/%m/%Y")
            ar_time = flight.arrival_time.strftime("%H:%M %d/%m/%Y")
            duration = str(flight.arrival_time - flight.departure_time)
            flight_info = FlightInfo(id=flight.id, 
                                    departure=de_time,
                                    flight_number=flight.flight_number,
                                    departureAirport=departure_airport.city, 
                                    from_code=departure_airport.code, 
                                    fromDetail=f'{departure_airport.city}, {departure_airport.country}',
                                    arrival=ar_time,
                                    arrivalAirport=arrival_airport.city, 
                                    to_code=arrival_airport.code, 
                                    toDetail=f'{arrival_airport.city}, {arrival_airport.country}',
                                    company=airline.name, 
                                    companyAbbreviation=airline.code,
                                    price=flight.price_economy if seat_class == "economy" else flight.price_business,
                                    duration=duration)
            list_available_flights.append(flight_info)

    return list_available_flights
        

@router.get("/flights/{flight_id}", response_model=FlightResponse)
def read_flight(flight_id: int, db: Session = Depends(get_session)):
    flight = crud_flight.get_flight_by_id(db, flight_id)
    if not flight:
        raise HTTPException(status_code=404, detail="Flight not found")
    return flight

@router.post("/flights", response_model=FlightResponse)
def create_flight(flight: FlightCreate, db: Session = Depends(get_session), has_permission: bool = Depends(has_permission(["FULL_ACCESS"]))):
    if not has_permission:
        raise HTTPException(status_code=403, detail="User does not have permission to access this resource")

    # return crud_flight.create_flight(db, flight)
    aircraft = crud_aircraft.get_aircraft_by_id(db, flight.aircraft_id)
    rows = aircraft.rows
    cols = aircraft.columns
    business_rows = aircraft.business_rows
    new_flight = crud_flight.create_flight(db, flight)
    seats = []
    for i in range(rows):
        for j in range(cols):
            if i < business_rows:
                seat = SeatCreate(flight_id=new_flight.id, seat_number=f"{i+1}{chr(65+j)}", seat_class="business", price=new_flight.price_business)
            else:
                seat = SeatCreate(flight_id=new_flight.id, seat_number=f"{i+1}{chr(65+j)}", seat_class="economy", price=new_flight.price_economy)

            seats.append(seat)
    crud_seat.create_seats(db, seats)

    return new_flight

@router.put("/flights/{flight_id}", response_model=FlightResponse)
def update_flight(flight_id: int, flight: FlightUpdate, db: Session = Depends(get_session), has_permission: bool = Depends(has_permission(["FULL_ACCESS"]))):

    if not has_permission:
        raise HTTPException(status_code=403, detail="User does not have permission to access this resource")

    updated_flight = crud_flight.update_flight(db, flight_id, flight)
    if not updated_flight:
        raise HTTPException(status_code=404, detail="Flight not found")
    return updated_flight

@router.delete("/flights/{flight_id}", response_model=FlightResponse)
def delete_flight(flight_id: int, db: Session = Depends(get_session), has_permission: bool = Depends(has_permission(["FULL_ACCESS"]))):

    if not has_permission:
        raise HTTPException(status_code=403, detail="User does not have permission to access this resource")

    deleted_flight = crud_flight.delete_flight(db, flight_id)
    if not deleted_flight:
        raise HTTPException(status_code=404, detail="Flight not found")
    return deleted_flight

