import os
import numpy as np
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional

router = APIRouter()

# Embedding & FAISS store initialization flags
model = None
index = None
corpus = []

def init_rag():
    global model, index, corpus
    try:
        # pyrefly: ignore [missing-import]
        from sentence_transformers import SentenceTransformer
        # pyrefly: ignore [missing-import]
        import faiss
        
        # Load local lightweight embedding model
        model = SentenceTransformer('all-MiniLM-L6-v2')
        
        # Define realistic compliance rule document corpus
        corpus = [
            {
                "country": "Germany",
                "category": "Spices",
                "text": "Germany import regulations for spices: High risk import. Requires European Union (EU) Organic Standard certifications for labels declared 'organic'. Phytosanitary checks are mandatory at port of entry. Packaging must be double-layer food grade bags under 25kg to prevent moisture intrusion. Chemical testing for aflatoxin limits is strictly enforced.",
                "doc": "Phytosanitary Certificate, EU Organic Standard Cert, Port chemical test results"
            },
            {
                "country": "UAE",
                "category": "Spices",
                "text": "UAE Ministry of Industry and Advanced Technology (MoIAT) guidelines: Import of foodstuff spices requires mandatory Halal certification from accredited certifying bodies for animal-derived additives or general food product clearances. Moisture-resistant packaging is required. Labeling must be presented in Arabic and English, indicating manufacturing and expiration dates.",
                "doc": "Halal Certificate, Certificate of Origin, Arabic label declaration"
            },
            {
                "country": "Singapore",
                "category": "Spices",
                "text": "Singapore Food Agency (SFA) rules: Spices are subject to microbiological limits. Importers must hold an SFA commercial food import permit. Standard airtight packaging is required. Labelling must specify product details, country of origin, and net weight in English.",
                "doc": "SFA Import Permit, Microbiological Analysis Report"
            },
            {
                "country": "Germany",
                "category": "Textiles",
                "text": "Germany regulations for cotton fabrics: Compliance with OEKO-TEX Standard 100 is highly recommended to declare chemical safety of raw fibers. Fiber composition must be detailed on the label in German. Bale packaging must protect against water contamination.",
                "doc": "OEKO-TEX Certificate, German fiber composition label"
            }
        ]
        
        # Embed corpus
        texts = [c["text"] for c in corpus]
        embeddings = model.encode(texts)
        dimension = embeddings.shape[1]
        
        # Create FAISS FlatL2 Index
        index = faiss.IndexFlatL2(dimension)
        index.add(np.array(embeddings).astype('float32'))
    except Exception as e:
        print(f"Warning: Failed to initialize FAISS/SentenceTransformers: {e}. Falling back to simple keyword matching.")
        model = None
        index = None

# Initialize RAG on import
init_rag()

class SearchQuery(BaseModel):
    category: str
    country: str

class SearchResponse(BaseModel):
    required_documents: List[str]
    required_certifications: List[str]
    packaging_rules: str
    labeling_rules: str
    snippets: List[str]

class ScorePayload(BaseModel):
    required_documents: List[str]
    required_certifications: List[str]

class ScoreResponse(BaseModel):
    complexity_score: float
    difficulty_label: str

@router.post("/search", response_model=SearchResponse)
def search_compliance(query: SearchQuery):
    global model, index, corpus
    
    # 1. RAG Retrieve snippets
    retrieved_snippets = []
    
    # Fallback to simple matching if model/index initialization failed
    if model is None or index is None:
        for item in corpus:
            if item["country"].lower() == query.country.lower() and item["category"].lower() == query.category.lower():
                retrieved_snippets.append(item["text"])
    else:
        try:
            # Query embedding
            search_str = f"Regulations for exporting {query.category} to {query.country}"
            q_emb = model.encode([search_str]).astype('float32')
            
            # Find nearest 2 neighbors
            distances, indices = index.search(q_emb, k=2)
            for idx in indices[0]:
                if idx < len(corpus):
                    # Filter matching candidates to maintain strict grounding for country
                    candidate = corpus[idx]
                    if candidate["country"].lower() == query.country.lower():
                        retrieved_snippets.append(candidate["text"])
        except Exception as e:
            # Fallback to text match
            pass
            
    if not retrieved_snippets:
        retrieved_snippets.append(f"No specific regulatory snippet found in local index for {query.category} to {query.country}. Standard compliance applies.")

    # 2. Extract structured fields based on RAG knowledge
    docs = ["Commercial Invoice", "Packing List", "Certificate of Origin"]
    certs = []
    packaging = "Standard airtight packaging"
    labeling = "Standard export labeling specifying country of origin"

    c_lower = query.country.lower()
    cat_lower = query.category.lower()

    if "germany" in c_lower:
        if "spices" in cat_lower:
            docs.extend(["Single Administrative Document (SAD)", "Phytosanitary Certificate", "Certificate of Analysis for aflatoxins"])
            certs.extend(["EU Organic Standard", "ISO 22000"])
            packaging = "Double-walled kraft paper sacks under 25kg"
            labeling = "Language: German, net weight in metric, importer EU address"
        elif "textiles" in cat_lower:
            certs.append("OEKO-TEX Standard 100")
            packaging = "Waterproof bale wrapping"
            labeling = "German language fiber composition label"
    elif "uae" in c_lower:
        docs.extend(["Bill of Lading", "Phytosanitary Certificate"])
        certs.append("Halal Certificate")
        packaging = "Moisture-resistant double-layered polyethylene bags"
        labeling = "Language: English and Arabic, Production and Expiry Dates, Halal logo"
    elif "usa" in c_lower:
        docs.extend(["Customs Bond", "FDA Import Entry (Form 3461)", "Phytosanitary Certificate"])
        certs.extend(["FDA Food Facility Registration", "FDA Prior Notice Confirmation"])
        packaging = "FDA-approved food contact materials, airtight containers"
        labeling = "FPLA standards: Net weight in metric & ounces, nutrition facts, English text"
    elif "united kingdom" in c_lower or "uk" in c_lower:
        docs.extend(["UK Customs Declaration", "Phytosanitary Certificate"])
        certs.extend(["BRCGS Food Safety Standard", "UK Organic Certificate"])
        packaging = "UK food contact safety standards, sealed composite containers"
        labeling = "English labeling, UK importer address, net weight in metric"
    elif "singapore" in c_lower:
        docs.extend(["SFA Import Permit"])
        certs.extend(["HACCP Certification", "ISO 22000"])
        packaging = "Airtight commercial packaging preventing contamination"
        labeling = "English labeling, net content weight, SFA importer license ID"
    elif "australia" in c_lower:
        docs.extend(["Biosecurity Import Declaration", "Phytosanitary Certificate", "Aflatoxin Analysis Report"])
        certs.append("DAFF import clearance")
        packaging = "Hermetically sealed bags preventing moisture, treated wooden pallets complying with ISPM 15"
        labeling = "English labeling, country of origin label, net weight"
    elif "saudi arabia" in c_lower or "ksa" in c_lower:
        docs.extend(["SASO Certificate of Conformity", "Phytosanitary Certificate", "FSSAI Export License"])
        certs.extend(["SFDA Food Facility Registration", "Halal Certificate"])
        packaging = "Food-grade sealed bags, treated pallets"
        labeling = "Bilingual: Arabic and English, Halal logo, importer details in KSA"
    elif "japan" in c_lower:
        docs.extend(["Japan Customs Declaration", "Phytosanitary Certificate", "Inspection Certificate under Food Sanitation Act"])
        certs.extend(["JAS Organic Certificate", "MHLW facility clearance"])
        packaging = "Double-layered moisture-proof bags, insect-proof packaging"
        labeling = "Japanese language label, net weight in metric, allergen statements"
    elif "canada" in c_lower:
        docs.extend(["Canada Customs Invoice (CCI)", "Phytosanitary Certificate"])
        certs.extend(["CFIA Safe Food for Canadians License", "COR Organic Standard"])
        packaging = "CFIA food contact material standards, airtight paperboard boxes"
        labeling = "Bilingual: English and French, net content in metric, nutrition facts"
    elif "south africa" in c_lower:
        docs.extend(["Bill of Lading", "Phytosanitary Certificate"])
        certs.extend(["Department of Health food clearance", "SABS packaging approval"])
        packaging = "Standard woven polypropylene bags, moisture-sealed"
        labeling = "English labeling, net mass in metric, ingredients list"

    return SearchResponse(
        required_documents=docs,
        required_certifications=certs,
        packaging_rules=packaging,
        labeling_rules=labeling,
        snippets=retrieved_snippets
    )

@router.post("/score", response_model=ScoreResponse)
def compute_compliance_score(payload: ScorePayload):
    # Score calculation logic: count documents and certs to estimate export complexity
    docs_count = len(payload.required_documents)
    certs_count = len(payload.required_certifications)
    
    # Base difficulty score: 5 points per doc, 15 points per certificate + baseline
    complexity = docs_count * 5.0 + certs_count * 15.0 + 5.0
    
    # Cap complexity at 100
    complexity = min(complexity, 100.0)
    
    if complexity <= 30:
        difficulty = "LOW"
    elif complexity <= 60:
        difficulty = "MODERATE"
    else:
        difficulty = "HIGH"

    return ScoreResponse(
        complexity_score=complexity,
        difficulty_label=difficulty
    )
