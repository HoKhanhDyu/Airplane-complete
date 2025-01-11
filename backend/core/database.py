from sqlmodel import SQLModel, create_engine, Session
from core.config import settings

DATABASE_URL = settings.SQLALCHEMY_DATABASE_URI
engine = create_engine(DATABASE_URL, echo=True)