import os
import joblib
import numpy as np
import pandas as pd
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional

router = APIRouter()

MODEL_DIR = "models"
MODEL_PATH = os.path.join(MODEL_DIR, "ranking_xgb.joblib")

# Ensure models directory exists
os.makedirs(MODEL_DIR, exist_ok=True)

# Feature Names list
FEATURES = ["demand_index", "logistics_score", "risk_score", "compliance_score", "total_cost", "estimated_profit"]

class CandidateCountry(BaseModel):
    country_id: int
    country_name: str
    demand_index: float
    logistics_score: float
    risk_score: float
    compliance_score: float
    total_cost: float
    estimated_profit: float

class ComputeRankingRequest(BaseModel):
    product_name: str
    candidates: List[CandidateCountry]

class ComputeRankingResponse(BaseModel):
    rankings: List[Dict[str, Any]]

class WhatIfRequest(BaseModel):
    manufacturing_cost: float
    shipping_cost: float
    insurance_cost: float
    certifications: List[str]
    demand_index: float
    logistics_score: float
    risk_score: float
    compliance_score: Optional[float] = None

class WhatIfResponse(BaseModel):
    landed_cost: float
    estimated_profit: float
    margin: float
    ai_score: float
    compliance_score: float

@router.post("/train")
def train_model():
    try:
        from xgboost import XGBRegressor
        
        # 1. Generate synthetic data (200 rows)
        np.random.seed(42)
        
        demand = np.random.uniform(30, 100, 200)
        logistics = np.random.uniform(40, 100, 200)
        risk = np.random.uniform(50, 100, 200)
        compliance = np.random.uniform(30, 100, 200)
        total_cost = np.random.uniform(100, 1500, 200)
        selling_price = total_cost * np.random.uniform(1.2, 1.8, 200)
        profit = selling_price - total_cost
        
        # Normalized profit margin (0-100)
        margin = (profit / selling_price) * 100.0
        
        # Target formula (expert defined weights)
        # Demand: 25%, Logistics: 10%, Risk: 10%, Compliance: 20%, Margin: 35%
        target = (demand * 0.25 + 
                  logistics * 0.10 + 
                  risk * 0.10 + 
                  compliance * 0.20 + 
                  margin * 0.35)
                  
        # Introduce tiny random noise
        target += np.random.normal(0, 2, 200)
        target = np.clip(target, 0.0, 100.0)

        df = pd.DataFrame({
            "demand_index": demand,
            "logistics_score": logistics,
            "risk_score": risk,
            "compliance_score": compliance,
            "total_cost": total_cost,
            "estimated_profit": profit
        })

        # 2. Train model
        model = XGBRegressor(n_estimators=50, max_depth=4, learning_rate=0.1, random_state=42)
        model.fit(df, target)

        # 3. Save model
        joblib.dump(model, MODEL_PATH)
        return {"status": "success", "message": "XGBoost Ranking Model trained successfully.", "saved_path": MODEL_PATH}
    except Exception as e:
        return {"status": "error", "message": f"Training failed: {e}"}

def load_or_train_model():
    if not os.path.exists(MODEL_PATH):
        train_model()
    try:
        return joblib.load(MODEL_PATH)
    except Exception as e:
        print(f"Warning: Failed to load XGBoost model: {e}. Using rule-based fallback.")
        return None

@router.post("/compute", response_model=ComputeRankingResponse)
def compute_rankings(req: ComputeRankingRequest):
    model = load_or_train_model()
    
    # Assemble input dataframe
    rows = []
    for c in req.candidates:
        rows.append({
            "demand_index": c.demand_index,
            "logistics_score": c.logistics_score,
            "risk_score": c.risk_score,
            "compliance_score": c.compliance_score,
            "total_cost": c.total_cost,
            "estimated_profit": c.estimated_profit
        })
        
    df = pd.DataFrame(rows)
    scores = []
    
    # 1. Predict Scores using XGBoost
    if model is not None:
        try:
            scores = model.predict(df).tolist()
        except Exception:
            scores = []
            
    # Fallback to rule-based evaluation if model prediction failed
    if not scores:
        for r in rows:
            margin = (r["estimated_profit"] / (r["total_cost"] + r["estimated_profit"])) * 100.0 if (r["total_cost"] + r["estimated_profit"]) > 0 else 0
            score = (r["demand_index"] * 0.25 + 
                     r["logistics_score"] * 0.10 + 
                     r["risk_score"] * 0.10 + 
                     r["compliance_score"] * 0.20 + 
                     margin * 0.35)
            scores.append(round(score, 1))

    # 2. Compute SHAP Values (Heuristic Fallback or TreeExplainer)
    shap_values = []
    shap_success = False
    
    if model is not None:
        try:
            import shap
            explainer = shap.TreeExplainer(model)
            # shap_values has shape (n_samples, n_features)
            raw_shap = explainer.shap_values(df)
            # Convert to list
            shap_values = raw_shap.tolist()
            shap_success = True
        except Exception:
            pass

    # Heuristic SHAP calculation if python shap library fails
    if not shap_success:
        # Calculate feature contributions relative to their weighted impact
        means = df.mean().to_dict()
        for idx, row in df.iterrows():
            row_shap = []
            # Weights: demand:0.25, logistics:0.10, risk:0.10, compliance:0.20, profit/cost combo:0.35
            # We construct a mock contribution centered around mean values
            row_shap.append(0.25 * (row["demand_index"] - means["demand_index"]))
            row_shap.append(0.10 * (row["logistics_score"] - means["logistics_score"]))
            row_shap.append(0.10 * (row["risk_score"] - means["risk_score"]))
            row_shap.append(0.20 * (row["compliance_score"] - means["compliance_score"]))
            # cost and profit
            row_shap.append(-0.15 * (row["total_cost"] - means["total_cost"]))
            row_shap.append(0.20 * (row["estimated_profit"] - means["estimated_profit"]))
            shap_values.append(row_shap)

    # 3. Compile output list
    results = []
    for i, c in enumerate(req.candidates):
        # Create map of feature contribution
        breakdown = {}
        for f_idx, feat in enumerate(FEATURES):
            breakdown[feat] = round(shap_values[i][f_idx], 2)
            
        results.append({
            "country_id": c.country_id,
            "country_name": c.country_name,
            "xgb_score": round(max(min(scores[i], 100.0), 0.0), 1),
            "shap_breakdown": breakdown
        })

    # Sort by score descending and assign rank
    results.sort(key=lambda x: x["xgb_score"], reverse=True)
    for rank_idx, res in enumerate(results):
        res["rank"] = rank_idx + 1

    return ComputeRankingResponse(rankings=results)

@router.post("/what-if", response_model=WhatIfResponse)
def compute_what_if(req: WhatIfRequest):
    # Recalculate RAG Complexity, dynamic duty, and profit
    if req.compliance_score is not None:
        compliance_score = req.compliance_score
    else:
        docs_count = 3 # base docs
        certs_count = len(req.certifications)
        complexity = docs_count * 5.0 + certs_count * 15.0 + 5.0
        complexity = min(complexity, 100.0)
        compliance_score = 100.0 - complexity

    # Calculate landed cost
    mfg = req.manufacturing_cost
    ship = req.shipping_cost
    ins = req.insurance_cost
    tariff = (mfg + ship) * 0.05
    tax = 8.00
    total_cost = mfg + ship + ins + tariff + tax
    selling_price = mfg * 1.6
    profit = selling_price - total_cost
    margin = (profit / selling_price) * 100.0 if selling_price > 0 else 0

    # Model evaluation
    model = load_or_train_model()
    features = pd.DataFrame([{
        "demand_index": req.demand_index,
        "logistics_score": req.logistics_score,
        "risk_score": req.risk_score,
        "compliance_score": compliance_score,
        "total_cost": total_cost,
        "estimated_profit": profit
    }])
    
    score = 0.0
    if model is not None:
        try:
            score = float(model.predict(features)[0])
        except Exception:
            pass
            
    if score == 0.0:
        # Fallback target formula
        score = (req.demand_index * 0.25 + 
                 req.logistics_score * 0.10 + 
                 req.risk_score * 0.10 + 
                 compliance_score * 0.20 + 
                 margin * 0.35)

    return WhatIfResponse(
        landed_cost=round(total_cost, 2),
        estimated_profit=round(profit, 2),
        margin=round(margin, 1),
        ai_score=round(max(min(score, 100.0), 0.0), 1),
        compliance_score=round(compliance_score, 1)
    )
