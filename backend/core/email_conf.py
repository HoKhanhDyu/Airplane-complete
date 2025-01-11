from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
import asyncio

conf = ConnectionConfig(
    MAIL_USERNAME='tranvandiepp2105@gmail.com',
    MAIL_PASSWORD='kkos mrpa zgpe jmrv',  
    MAIL_FROM='tranvandiepp2105@gmail.com',
    MAIL_PORT=465,  # Sử dụng cổng SSL
    MAIL_SERVER='smtp.gmail.com',
    MAIL_FROM_NAME='viperphone',
    MAIL_STARTTLS=False,  # Không sử dụng STARTTLS
    MAIL_SSL_TLS=True,    # Sử dụng SSL
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True
)

fast_mail = FastMail(conf)

async def send_email(email: str, subject: str, body: str):
    message = MessageSchema(
        subject=subject,
        recipients=[email],  # Danh sách người nhận
        body=body,
        subtype="html"  # Loại nội dung là HTML
    )
    await fast_mail.send_message(message)

