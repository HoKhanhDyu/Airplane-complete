from fastapi import APIRouter, Depends, HTTPException, Request
from payment.utils import get_client_ip
from payment.vnpay import VNPAY
from payment.serializers import PaymentRequest
from core.config import settings
from datetime import datetime
from fastapi.responses import RedirectResponse, JSONResponse

router = APIRouter()


@router.post("/payment")
async def payment_view(request: Request, payment_request: PaymentRequest):
    # Extract data from request
    ipaddr = get_client_ip(request)
    form = payment_request
    # return form
    # Build VNPAY URL
    vnp = VNPAY()
    vnp.request_data = {
        "vnp_Version": "2.1.0",
        "vnp_Command": "pay",
        "vnp_TmnCode": settings.VNPAY_TMN_CODE,
        "vnp_Amount": form.amount ,
        "vnp_CurrCode": "VND",
        "vnp_TxnRef": form.order_id,
        "vnp_OrderInfo": form.order_desc,
        "vnp_OrderType": form.order_type,
        "vnp_Locale": form.language,
        "vnp_CreateDate": datetime.now().strftime('%Y%m%d%H%M%S'),
        "vnp_IpAddr": ipaddr,
        "vnp_ReturnUrl": settings.VNPAY_RETURN_URL
    }

    if form.bank_code:
        vnp.request_data["vnp_BankCode"] = form.bank_code

    vnpay_payment_url = vnp.get_payment_url(settings.VNPAY_PAYMENT_URL, settings.VNPAY_HASH_SECRET_KEY)
    return JSONResponse(content={"url": vnpay_payment_url})
    # return vnpay_payment_url
    return RedirectResponse(url=vnpay_payment_url)

@router.get("/return")
async def payment_return_view(request: Request):
    input_data = dict(request.query_params)

    if input_data:
        vnp = VNPAY()
        vnp.response_data = input_data
        
        order_id = input_data.get("vnp_TxnRef")
        amount = int(input_data.get("vnp_Amount", 0)) / 100
        order_desc = input_data.get("vnp_OrderInfo")
        vnp_TransactionNo = input_data.get("vnp_TransactionNo")
        vnp_ResponseCode = input_data.get("vnp_ResponseCode")

        if vnp.validate_response(settings.VNPAY_HASH_SECRET_KEY):
            if vnp_ResponseCode == "00":
                data = {
                    "title": "Kết quả thanh toán",
                    "result": "Thành công",
                    "order_id": order_id,
                    "amount": amount,
                    "order_desc": order_desc,
                    "vnp_TransactionNo": vnp_TransactionNo,
                    "vnp_ResponseCode": vnp_ResponseCode
                }
                return JSONResponse(content=data)
            else:
                data = {
                    "title": "Kết quả thanh toán",
                    "result": "Lỗi",
                    "order_id": order_id,
                    "amount": amount,
                    "order_desc": order_desc,
                    "vnp_TransactionNo": vnp_TransactionNo,
                    "vnp_ResponseCode": vnp_ResponseCode
                }
                return JSONResponse(content=data)
        else:
            data = {
                "title": "Kết quả thanh toán",
                "result": "Lỗi",
                "order_id": order_id,
                "amount": amount,
                "order_desc": order_desc,
                "vnp_TransactionNo": vnp_TransactionNo,
                "vnp_ResponseCode": vnp_ResponseCode,
                "msg": "Sai checksum"
            }
            return JSONResponse(content=data, status_code=400)
    else:
        data = {"title": "Kết quả thanh toán", "result": "Không có dữ liệu đầu vào"}
        return JSONResponse(content=data, status_code=400)
