from pydantic import BaseModel


class SeatBase(BaseModel):
    flight_id: int
    seat_number: str
    seat_class: str
    price: float

class SeatCreate(SeatBase):
    pass

class SeatUpdate(SeatBase):
    pass

class SeatResponse(SeatBase):
    id: int
    is_available: bool

    class Config:
        from_attributes = True
