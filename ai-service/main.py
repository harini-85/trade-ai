import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import compliance, cost, ranking, assistant, aggregator

app = FastAPI(
    title="TradeWise AI Platform AI Service",
    description="Python FastAPI Microservice for RAG document retrieval, XGBoost ranking models, and LLM explanation utilities.",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include sub-routers
app.include_router(compliance.router, prefix="/compliance", tags=["Compliance RAG"])
app.include_router(cost.router, prefix="/cost", tags=["Landed Cost Engine"])
app.include_router(ranking.router, prefix="/ranking", tags=["XGBoost & SHAP Country Ranking"])
app.include_router(assistant.router, prefix="/assistant", tags=["Explainable AI LLM Assistant"])
app.include_router(aggregator.router, prefix="/aggregator", tags=["Compliance Data Aggregation"])

@app.get("/")
def read_root():
    return {"status": "TradeWise AI Service is active and listening."}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
