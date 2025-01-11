from pydantic import BaseModel


class InvoiceBase(BaseModel):
    user_id: int
    flight_id: int
    total_price: float
    booking_code: str
    is_paid: bool = False
    is_canceled: bool = False

class InvoiceCreate(InvoiceBase):
    pass

class InvoiceUpdate(InvoiceBase):
    pass

class InvoiceResponse(InvoiceBase):
    id: int

    class Config:
        from_attributes = True