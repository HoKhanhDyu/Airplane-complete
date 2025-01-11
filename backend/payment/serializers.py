
from pydantic import BaseModel

class PaymentRequest(BaseModel):
    order_type: str = "other"
    order_id: int = 1
    amount: int = 200000
    order_desc: str = "Thanh toán cho đơn hàng X"
    bank_code: str = "VNBANK"
    language: str = "vn"