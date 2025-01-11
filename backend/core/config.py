import os
import urllib.parse
import redis

class Settings:
    MYSQL_USER = os.getenv('MYSQL_USER')
    MYSQL_ROOT_PASSWORD = os.getenv('MYSQL_ROOT_PASSWORD')
    MYSQL_HOST = os.getenv('MYSQL_HOST')
    MYSQL_PORT = os.getenv('MYSQL_PORT')
    MYSQL_DATABASE = os.getenv('MYSQL_DATABASE')
    ACCESS_TOKEN_EXPIRE_MINUTES = 24 * 60
    REFRESH_TOKEN_EXPIRE_DAYS = 7
    REDIS_PORT: int = 6379  
    REDIS_DB: int = 0               # Cơ sở dữ liệu Redis
    REDIS_PASSWORD: str = ''        # Mật khẩu Redis nếu cần
    VNPAY_RETURN_URL: str = 'https://127.0.0.1:3000/show-ticket'  # get from config
    VNPAY_PAYMENT_URL = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html'  # get from config
    VNPAY_API_URL = 'https://sandbox.vnpayment.vn/merchant_webapi/api/transaction'
    VNPAY_TMN_CODE = 'W3Y4F8FB'  
    VNPAY_HASH_SECRET_KEY = 'FKX7TKNLUNI941O9P7RIJVEMKO9765C9'  # Secret key for create checksum,get from config
    SECRET_KEY = os.getenv("SECRET_KEY")
    ALGORITHM = os.getenv("ALGORITHM")
    @property
    def REDIS_HOST(self) -> str:
        return 'redis'
    @property
    def MYSQL_PASSWORD_ENCODE(self) -> str:
        return urllib.parse.quote(self.MYSQL_ROOT_PASSWORD.encode("utf-8"))
    
    @property
    def SQLALCHEMY_DATABASE_URI(self):
        return f"mysql+pymysql://{self.MYSQL_USER}:{self.MYSQL_PASSWORD_ENCODE}@{self.MYSQL_HOST}:{self.MYSQL_PORT}/{self.MYSQL_DATABASE}?connect_timeout=60"


settings = Settings()

redis_client = redis.Redis(
    host=settings.REDIS_HOST,
    port=settings.REDIS_PORT,
    db=settings.REDIS_DB,
    password=settings.REDIS_PASSWORD
)