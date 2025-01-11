from pydantic import BaseModel

class AirlineBase(BaseModel):
    name: str
    country: str
    code: str

class AirlineCreate(AirlineBase):
    pass
    # logo: str

class AirlineUpdate(AirlineBase):
    # id: int
    pass

class AirlineResponse(AirlineBase):
    id: int

    class Config:
        from_attributes = True  # Hỗ trợ chuyển đổi từ SQLAlchemy object sang Pydantic