from pydantic import BaseModel
from datetime import datetime

class FlightBase(BaseModel):
    departure_airport_id: int
    arrival_airport_id: int
    # airline_id: int
    aircraft_id: int
    departure_time: datetime
    arrival_time: datetime
    price_economy: float
    # price_business: float
    flight_number: str

class FlightCreate(FlightBase):
    pass

class FlightUpdate(FlightBase):
    pass

class FlightResponse(FlightBase):
    id: int

    class Config:
        from_attributes = True 
