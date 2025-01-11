from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from api.deps import get_session
from typing import Optional, List, Dict
from pydantic import BaseModel
import matplotlib.pyplot as plt
import io
import base64
from core.permissions import has_permission

class ChartInfo(BaseModel):
    year: int
    revenue: List[int]
    businessClass: List[int]
    economyClass: List[int]

router = APIRouter()

# Lấy doanh thu theo tháng
def revenue_by_month(db: Session, year: int) -> List[Dict[str, float]]:
    query = f"""
        SELECT 
            EXTRACT(MONTH FROM i.created_at) as month,
            SUM(t.price) as revenue
        FROM invoices i
        JOIN tickets t ON i.id = t.invoice_id
        WHERE EXTRACT(YEAR FROM i.created_at) = {year}
        GROUP BY EXTRACT(MONTH FROM i.created_at)
        ORDER BY month
    """
    return db.execute(query).fetchall()

def revenue_by_day(db: Session, year: int, month: int) -> List[Dict[str, float]]:
    query = f"""
        SELECT 
            EXTRACT(DAY FROM i.created_at) as day,
            SUM(t.price) as revenue
        FROM invoices i
        JOIN tickets t ON i.id = t.invoice_id
        WHERE EXTRACT(YEAR FROM i.created_at) = {year}
            AND EXTRACT(MONTH FROM i.created_at) = {month}
        GROUP BY EXTRACT(DAY FROM i.created_at)
        ORDER BY day
    """
    return db.execute(query).fetchall()

# lấy số lượng mỗi loại vé được bán trong năm
def get_ticket_type(db: Session, year: int) -> List[Dict[str, int]]:
    query = f"""
        SELECT 
            t.ticket_type,
            COUNT(t.id) as quantity
        FROM tickets t
        JOIN invoices i ON t.invoice_id = i.id
        WHERE EXTRACT(YEAR FROM i.created_at) = {year}
        GROUP BY t.ticket_type
    """
    return db.execute(query).fetchall()

# lấy số lượng mỗi loại vé được bán trong tháng
def get_ticket_type_month(db: Session, year: int, month: int) -> List[Dict[str, int]]:
    query = f"""
        SELECT 
            t.ticket_type,
            COUNT(t.id) as quantity
        FROM tickets t
        JOIN invoices i ON t.invoice_id = i.id
        WHERE EXTRACT(YEAR FROM i.created_at) = {year}
            AND EXTRACT(MONTH FROM i.created_at) = {month}
        GROUP BY t.ticket_type
    """
    return db.execute(query).fetchall()

# lấy số doanh thu được bán và còn trống trong năm theo tưng loại vé
def get_ticket_type_revenue(db: Session, year: int) -> List[Dict[str, float]]:
    query = f"""
        SELECT 
            t.ticket_type,
            SUM(t.price) as revenue
        FROM tickets t
        JOIN invoices i ON t.invoice_id = i.id
        WHERE EXTRACT(YEAR FROM i.created_at) = {year}
        GROUP BY t.ticket_type
    """
    return db.execute(query).fetchall()

# lấy số doanh thu được bán và còn trống trong tháng theo tưng loại vé
def get_ticket_type_revenue_month(db: Session, year: int, month: int) -> List[Dict[str, float]]:
    query = f"""
        SELECT 
            t.ticket_type,
            SUM(t.price) as revenue
        FROM tickets t
        JOIN invoices i ON t.invoice_id = i.id
        WHERE EXTRACT(YEAR FROM i.created_at) = {year}
            AND EXTRACT(MONTH FROM i.created_at) = {month}
        GROUP BY t.ticket_type
    """
    return db.execute(query).fetchall()

# lấy số lượng ghế được bán và còn trống trong năm
def get_seat_type(db: Session, year: int) -> List[Dict[str, int]]:
    query = f"""
        SELECT 
            t.seat_type,
            COUNT(t.id) as quantity
        FROM tickets t
        JOIN invoices i ON t.invoice_id = i.id
        WHERE EXTRACT(YEAR FROM i.created_at) = {year}
        GROUP BY t.seat_type, t.is_available
    """
    return db.execute(query).fetchall()

# lấy số lượng ghế được bán và còn trống trong tháng
def get_seat_type_month(db: Session, year: int, month: int) -> List[Dict[str, int]]:
    query = f"""
        SELECT 
            t.seat_type,
            COUNT(t.id) as quantity
        FROM tickets t
        JOIN invoices i ON t.invoice_id = i.id
        WHERE EXTRACT(YEAR FROM i.created_at) = {year}
            AND EXTRACT(MONTH FROM i.created_at) = {month}
        GROUP BY t.seat_type, t.is_available
    """
    return db.execute(query).fetchall()

def save_chart_as_base64():
    buffer = io.BytesIO()
    plt.savefig(buffer, format="png", bbox_inches="tight")
    buffer.seek(0)
    base64_image = base64.b64encode(buffer.read()).decode("utf-8")
    buffer.close()
    plt.close()
    return f"data:image/png;base64,{base64_image}"

def get_chart_info(db: Session):
    query = """
        SELECT 
            Extract(YEAR FROM i.created_at) as year,
            Extract(MONTH FROM i.created_at) as month,
            SUM(i.total_price) as revenue,
            t.ticket_type,
        FROM invoices i
        GROUP BY year, month, t.ticket_type
    """
    result = db.execute(query).fetchall()
    years = set([row["year"] for row in result])
    chart_info = {
        year: {
            "year": year,
            "revenue": [0] * 12,
            "businessClass": [0] * 12,
            "economyClass": [0] * 12
        }
        for year in years
    }

    for row in result:
        year = row["year"]
        month = row["month"]
        revenue = row["revenue"]
        ticket_type = row["ticket_type"]
        if ticket_type == "business":
            chart_info[year]["businessClass"][month-1] = revenue
        else:
            chart_info[year]["economyClass"][month-1] = revenue
        chart_info[year]["revenue"][month-1] += revenue

    return chart_info

def get_eco_bus(db: Session):
    query = """
        SELECT
            SUM(i.total_price) as revenue,
            t.ticket_type
        FROM invoices i
        GROUP BY t.ticket_type
    """
    result = db.execute(query).fetchall()
    eco = 0
    bus = 0
    for row in result:
        if row["ticket_type"] == "business":
            bus = row["revenue"]
        else:
            eco = row["revenue"]
    return eco, bus
    

@router.get("/chart_report", response_model=[ChartInfo])
def get_chart(db: Session = Depends(get_session), has_permission: bool = Depends(has_permission(["ADMIN"]))):

    if not has_permission:
        raise HTTPException(status_code=403, detail="User does not have permission to access this resource")

    chart_info = get_chart_info(db)
    return list(chart_info.values())

@router.get("/eco_bus", response_model=Dict[str, int])
def get_eco_bus_report(db: Session = Depends(get_session), has_permission: bool = Depends(has_permission(["ADMIN"]))):

    if not has_permission:
        raise HTTPException(status_code=403, detail="User does not have permission to access this resource")

    eco, bus = get_eco_bus(db)
    return {"economy": eco, "business": bus}


    
