from pydantic import BaseModel, model_validator

class AirportBase(BaseModel):
    name: str
    city: str
    country: str
    code: str

class AirportCreate(AirportBase):
    pass

class AirportUpdate(AirportBase):
    pass

class AirportResponse(AirportBase):
    id: int
    #postion: country_city
    # position: str

    class Config:
        from_attributes = True  # Hỗ trợ chuyển đổi từ SQLAlchemy object sang Pydantic

    # @model_validator(mode="after")
    # def set_position(cls, v):
    #     if not v.position:
    #         v.position = f"{v.country}_{v.city}"
    #     return v
