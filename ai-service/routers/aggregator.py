from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict, Any, Optional
from services.aggregator import merge_compliance_data

router = APIRouter()

class LookupRequest(BaseModel):
    hs_code: str
    country: str
    manufacturing_cost: Optional[float] = 350.0

@router.post("/lookup")
def lookup_aggregation(req: LookupRequest):
    try:
        merged = merge_compliance_data(req.hs_code, req.country, req.manufacturing_cost)
        return merged
    except Exception as e:
        return {"status": "error", "message": f"Aggregation compilation failed: {e}"}
