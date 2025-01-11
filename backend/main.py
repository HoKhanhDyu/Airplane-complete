from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from api.main import api_router
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from core.email_conf import send_email
import os
from fastapi.staticfiles import StaticFiles

app = FastAPI()

origins = [
    "http://localhost:3000",  
    "https://127.0.0.1:3000",
    "http://localhost:80",
    "https://127.0.0.1:80",
    "http://localhost:443",
    "https://127.0.0.1:443",
    "https://127.0.0.1",
]

app.add_middleware(
    CORSMiddleware,
    # allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# @app.middleware("https")
# async def add_cors_headers(request: Request, call_next):
#     response = await call_next(request)
#     response.headers["Access-Control-Allow-Origin"] = "*"
#     response.headers["Access-Control-Allow-Methods"] = "POST, GET, OPTIONS, DELETE, PUT"
#     response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
#     return response

app.include_router(api_router, prefix="/api")

# CONTAINER_PRODUCT_IMAGE_DIR = os.getenv('CONTAINER_PRODUCT_IMAGE_DIR')

# # Stream frames
# if os.path.isdir(CONTAINER_PRODUCT_IMAGE_DIR):
#     app.mount("/stream/product-image/", StaticFiles(directory=CONTAINER_PRODUCT_IMAGE_DIR), name="stream-product-image")
# else:
#     raise Exception(f"Directory {CONTAINER_PRODUCT_IMAGE_DIR} does not exist")