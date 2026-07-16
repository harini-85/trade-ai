import os
import json
import urllib.request
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict, List, Any, Optional

router = APIRouter()

class ExplainRequest(BaseModel):
    product_name: str
    country_name: str
    xgb_score: float
    shap_breakdown: Dict[str, float]
    compliance_rules: Dict[str, Any]
    language: str # EN, HI, TE

class ExplainResponse(BaseModel):
    explanation: str

class ChatRequest(BaseModel):
    message: str
    language: str
    context_product: Optional[str] = None
    context_country: Optional[str] = None
    compliance_rules: Optional[Dict[str, Any]] = None   # RAG data from DB
    complexity_score: Optional[float] = None            # compliance_scores.complexity_score from DB

class ChatResponse(BaseModel):
    reply: str

def call_gemini_api(prompt: str) -> Optional[str]:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return None
        
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
    payload = {
        "contents": [{
            "parts": [{"text": prompt}]
        }]
    }
    
    try:
        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"},
            method="POST"
        )
        with urllib.request.urlopen(req, timeout=10) as response:
            res_data = json.loads(response.read().decode("utf-8"))
            return res_data["candidates"][0]["content"]["parts"][0]["text"].strip()
    except Exception as e:
        print(f"Warning: Gemini API call failed: {e}")
        return None

@router.post("/explain", response_model=ExplainResponse)
def explain_metrics(req: ExplainRequest):
    # Assemble details for LLM
    product = req.product_name
    country = req.country_name
    score = req.xgb_score
    shap = req.shap_breakdown
    rules = req.compliance_rules
    lang = req.language.upper()

    # Formulate prompts for LLM
    prompt = f"""
You are an expert AI Export Consultant. Your task is to write a concise explanation of the country ranking details for an Indian SME.
Product: {product}
Target Country: {country}
XGBoost Ranking Score: {score}/100

SHAP Feature Contribution values (explaining how they affected the score):
- Demand Index contribution: {shap.get('demand_index', 0.0)} points
- Logistics Performance contribution: {shap.get('logistics_score', 0.0)} points
- Country Credit Safety Risk contribution: {shap.get('risk_score', 0.0)} points
- Compliance simplicity contribution: {shap.get('compliance_score', 0.0)} points
- Manufacturing/Export Landed Cost penalty: {shap.get('total_cost', 0.0)} points
- Estimated Profit contribution: {shap.get('estimated_profit', 0.0)} points

Retrieve compliance guidelines:
- Required documents: {rules.get('required_documents', 'Invoice, packing list')}
- Required certifications: {rules.get('required_certifications', 'ISO')}
- Packaging rules: {rules.get('packaging_rules', 'Standard packaging')}
- Labeling rules: {rules.get('labeling_rules', 'English label')}

Instructions:
1. Explain the score using the SHAP numbers. Cite them exactly. Never invent or override scores.
2. Ground your compliance summary strictly in the provided documents and rules.
3. Keep the output professional, encouraging, and under 150 words.
4. Output the response in {lang} language. If {lang} is 'HI', translate the explanation to Hindi. If 'TE', translate to Telugu. Otherwise, default to English.
"""

    # Call LLM
    explanation = call_gemini_api(prompt)
    
    # Heuristic Fallback if API key is not configured or fails
    if not explanation:
        if lang == 'HI':
            explanation = f"एआई विश्लेषण के अनुसार, {country} के लिए आपका उत्पाद '{product}' रैंकिंग स्कोर {score}/100 प्राप्त करता है। यह मूल्यांकन " \
                          f"मांग सूचकांक प्रभाव ({shap.get('demand_index', 0.0)}) और संभावित लाभ ({shap.get('estimated_profit', 0.0)}) " \
                          f"पर आधारित है। अनुपालन के लिए {rules.get('required_documents', 'चालान, पैकिंग सूची')} आवश्यक दस्तावेज़ हैं।"
        elif lang == 'TE':
            explanation = f"AI విశ్లేషణ ప్రకారం, {country} కి మీ ఉత్పత్తి '{product}' ర్యాంకింగ్ స్కోరు {score}/100 గా లెక్కించబడింది. ఇది " \
                          f"డిమాండ్ ఇండెక్స్ ప్రభావం ({shap.get('demand_index', 0.0)}) మరియు అంచనా వేసిన లాభం ({shap.get('estimated_profit', 0.0)}) " \
                          f"ఆధారంగా లెక్కించబడింది. సమ్మతి కోసం {rules.get('required_documents', 'ఇన్వాయిస్, ప్యాకింగ్ లిస్ట్')} అవసరమైన పత్రాలు."
        else:
            explanation = f"Based on the XGBoost ranking, {country} has an evaluation score of {score}/100 for your product '{product}'. " \
                          f"The primary positive contributions are driven by local market demand ({shap.get('demand_index', 0.0)} points) " \
                          f"and estimated profitability ({shap.get('estimated_profit', 0.0)} points). On compliance, the route is " \
                          f"governed by rules requiring {rules.get('required_documents', 'standard commercial invoices')} with complexity penalty of {shap.get('compliance_score', 0.0)} points."
                          
    return ExplainResponse(explanation=explanation)

# Document type → sample image path mapping (served from /public/document_samples/)
DOCUMENT_SAMPLE_IMAGES = {
    "commercial invoice": "/document_samples/commercial_invoice.png",
    "packing list": "/document_samples/packing_list.png",
    "certificate of origin": "/document_samples/certificate_of_origin.png",
    "export license": "/document_samples/export_license.png",
    "phytosanitary certificate": "/document_samples/phytosanitary_certificate.png",
    "bill of lading": "/document_samples/bill_of_lading.png",
    "eu organic certificate": "/document_samples/eu_organic_certificate.png",
    "iso 22000": "/document_samples/iso_22000.png",
    "halal certificate": "/document_samples/halal_certificate.png",
    "haccp certification": "/document_samples/haccp_certification.png",
    "fda food facility registration": "/document_samples/fda_food_facility_registration.png",
    "fssai export license": "/document_samples/fssai_export_license.png",
}

def detect_document_image_request(message: str) -> Optional[str]:
    """Returns an image URL if the user is asking to see a sample document."""
    lower = message.lower()
    if any(kw in lower for kw in ["look like", "show me", "sample", "example", "template", "what is a"]):
        for doc_name, img_url in DOCUMENT_SAMPLE_IMAGES.items():
            if doc_name in lower:
                return img_url
    return None

@router.post("/chat", response_model=ChatResponse)
def assistant_chat(req: ChatRequest):
    lang = req.language.upper()
    rules = req.compliance_rules or {}
    complexity = req.complexity_score

    # Build RAG context strings from DB compliance data
    required_docs  = ", ".join(rules.get("required_documents", [])) or "Standard commercial documents"
    required_certs = ", ".join(rules.get("required_certifications", [])) or "None specified"
    snippets       = ", ".join(rules.get("snippets", []))
    complexity_str = f"{complexity}/100" if complexity is not None else "unknown"

    # Check if user wants to see a sample document image
    image_url = detect_document_image_request(req.message)
    image_md  = f"\n\n![Sample Document]({image_url})" if image_url else ""

    prompt = f"""
You are an expert AI Export Consultant helping Indian SME exporters. Answer the user's specific question using ONLY the compliance data provided below.

User Question: {req.message}
Product: {req.context_product or 'Not specified'}
Target Country: {req.context_country or 'Not specified'}

Grounded Compliance Data (use ONLY these values — do NOT invent any):
- Required Documents: {required_docs}
- Required Certifications: {required_certs}
- Compliance Complexity Score: {complexity_str}
- Regulatory Note: {snippets or 'Standard trade requirements apply'}

Instructions:
1. Answer the question DIRECTLY using the Grounded Compliance Data above.
2. If the question is about required documents, list EXACTLY the documents in 'Required Documents'.
3. If the question is about certificates, list EXACTLY the certificates in 'Required Certifications' by name.
4. If the question is about complexity score, cite EXACTLY the Compliance Complexity Score value above.
5. Never invent new documents or certificates not in the data.
6. Keep the answer practical, specific, and under 150 words.
7. Respond in {lang} language (Hindi if 'HI', Telugu if 'TE', else English).
"""

    reply = call_gemini_api(prompt)

    # Structured fallback when no API key is configured
    if not reply:
        lower = req.message.lower()
        if lang == 'HI':
            if any(w in lower for w in ["certificate", "प्रमाण", "certification"]):
                reply = f"आपके निर्यात के लिए निम्न प्रमाण पत्र आवश्यक हैं: {required_certs}."
            elif any(w in lower for w in ["document", "दस्तावेज़"]):
                reply = f"आपको निम्न दस्तावेज़ चाहिए: {required_docs}."
            elif any(w in lower for w in ["complexity", "score", "जटिलता"]):
                reply = f"अनुपालन जटिलता स्कोर {complexity_str} है।"
            else:
                reply = f"'{req.context_product}' को '{req.context_country}' में निर्यात करने के लिए आवश्यक दस्तावेज़: {required_docs}. आवश्यक प्रमाण पत्र: {required_certs}."
        elif lang == 'TE':
            if any(w in lower for w in ["certificate", "certification", "ధృవీకరణ"]):
                reply = f"మీ ఎగుమతికి అవసరమైన సర్టిఫికేట్లు: {required_certs}."
            elif any(w in lower for w in ["document", "పత్రాలు"]):
                reply = f"మీకు అవసరమైన పత్రాలు: {required_docs}."
            elif any(w in lower for w in ["complexity", "score"]):
                reply = f"సమ్మతి సంక్లిష్టత స్కోరు {complexity_str}."
            else:
                reply = f"'{req.context_product}' ని '{req.context_country}' కి ఎగుమతి చేయడానికి పత్రాలు: {required_docs}. సర్టిఫికేట్లు: {required_certs}."
        else:
            lower = req.message.lower()
            if any(w in lower for w in ["certificate", "certification"]):
                reply = f"To export to {req.context_country or 'the target country'}, you need the following certifications: **{required_certs}**."
            elif any(w in lower for w in ["document", "documents", "paperwork"]):
                reply = f"The required documents for exporting **{req.context_product or 'your product'}** to {req.context_country or 'the target country'} are: {required_docs}."
            elif any(w in lower for w in ["complexity", "score", "how complex", "difficult"]):
                reply = f"The Compliance Complexity Score for exporting **{req.context_product or 'your product'}** to {req.context_country or 'the target country'} is **{complexity_str}**. This accounts for the number of required documents and missing certifications."
            else:
                reply = f"For exporting **{req.context_product or 'your product'}** to **{req.context_country or 'the target country'}**:\n- **Required Documents:** {required_docs}\n- **Required Certifications:** {required_certs}\n- **Compliance Score:** {complexity_str}"

    return ChatResponse(reply=reply + image_md)
