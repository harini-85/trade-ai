from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict

router = APIRouter()

class CostRequest(BaseModel):
    manufacturing_cost: float
    shipping_cost: float
    insurance_cost: float

class CostResponse(BaseModel):
    manufacturing_cost: float
    shipping_cost: float
    insurance_cost: float
    tariff: float
    tax: float
    total_cost: float
    selling_price: float
    estimated_profit: float

@router.post("/estimate", response_model=CostResponse)
def estimate_cost(req: CostRequest):
    # Dynamic calculations
    mfg = req.manufacturing_cost
    ship = req.shipping_cost
    ins = req.insurance_cost
    
    # Estimate customs tariff (5% of cost + shipping)
    tariff = (mfg + ship) * 0.05
    
    # Flat local taxes
    tax = 8.00
    
    # Landed cost
    total_cost = mfg + ship + ins + tariff + tax
    
    # Suggested selling price in target market (mfg cost * markup, e.g. 1.6)
    selling_price = mfg * 1.6
    
    # Estimated Profit
    profit = selling_price - total_cost

    return CostResponse(
        manufacturing_cost=mfg,
        shipping_cost=ship,
        insurance_cost=ins,
        tariff=round(tariff, 2),
        tax=round(tax, 2),
        total_cost=round(total_cost, 2),
        selling_price=round(selling_price, 2),
        estimated_profit=round(profit, 2)
    )
