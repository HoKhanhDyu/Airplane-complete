from pydantic import BaseModel


class AircraftBase(BaseModel):
    id: int
    airline_id: int
    name: str
    rows: int
    columns: int
    business_rows: int

class AircraftCreate(AircraftBase):
    pass

class AircraftUpdate(AircraftBase):
    pass

class AircraftResponse(AircraftBase):

    class Config:
        from_attributes = True