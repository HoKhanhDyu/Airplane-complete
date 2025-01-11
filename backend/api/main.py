from fastapi import APIRouter
from api.routes import user, auth, airport, airline, flight, aircraft, ticket_manage, buy_ticket, payment, account_info, permission, invote_manage
api_router = APIRouter()
api_router.include_router(user.router, prefix="/user", tags=["users"])
api_router.include_router(auth.router, prefix='/auth', tags=["auth"])
api_router.include_router(airport.router, prefix='/airport', tags=["airports"])
api_router.include_router(airline.router, prefix='/airline', tags=["airlines"])
api_router.include_router(flight.router, prefix='/flight', tags=["flights"])
api_router.include_router(aircraft.router, prefix='/aircraft', tags=["aircrafts"])
api_router.include_router(ticket_manage.router, prefix='/ticket', tags=["tickets"])
api_router.include_router(buy_ticket.router, prefix='/buy_ticket', tags=["buy_ticket"])
api_router.include_router(payment.router, prefix='/payment', tags=["payment"])
api_router.include_router(account_info.router, prefix='/account_info', tags=["account_info"])
api_router.include_router(permission.router, prefix='/permission', tags=["permissions"])
api_router.include_router(invote_manage.router, prefix='/invoice', tags=["invoices"])

