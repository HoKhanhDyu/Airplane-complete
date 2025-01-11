from pydantic import BaseModel
from datetime import datetime
            # first_name=t.firstName,
            # last_name=t.lastName,
            # birth_date=t.dob,
            # male=t.male,
            # citizen_id='',
            # price=ticket_price,
            # passenger_email=t.email,
            # phone_number=t.phoneNumber,
            # invoice_id=invoice.id,
            # seat_id=seat.id,
            # flight_id=buy_ticket_input.flight_id
class TicketBase(BaseModel):
    first_name: str
    last_name: str
    birth_date: datetime
    male: str
    citizen_id: str
    passenger_email: str
    passenger_phone: str
    flight_id: int
    seat_id: int
    invoice_id: int
    price: float
    ticket_type_id: int


class TicketCreate(TicketBase):
    pass

class TicketUpdate(TicketBase):
    pass

class TicketResponse(TicketBase):
    id: int

    class Config:
        from_attributes = True

class TicketTypeBase(BaseModel):
    type: str
    name: str
    additional_Expense: float
    baggage: float
    exchangefee: float
    refundfee: float
    food: bool

class TicketTypeResponse(TicketTypeBase):
    id: int

    class Config:
        from_attributes = True
