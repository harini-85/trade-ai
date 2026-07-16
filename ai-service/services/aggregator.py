import os
import json
import sys
from typing import Dict, Any

# Ensure the root of the project is in path to resolve absolute imports
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if PROJECT_ROOT not in sys.path:
    sys.path.append(PROJECT_ROOT)

from fetchers.fetch_world_bank import fetch_world_bank_data
from fetchers.fetch_un_comtrade import fetch_un_comtrade_demand
from fetchers.fetch_uk_tariff import fetch_uk_tariff
from fetchers.fetch_fda import fetch_fda_warnings

# Path to static curated rules
CURATED_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "fetchers", "curated_compliance_data.json")

def infer_category(hs_code: str) -> str:
    clean_hs = hs_code.replace(".", "").strip()
    if clean_hs.startswith("09"):
        return "Spices"
    elif clean_hs.startswith("52"):
        return "Textiles"
    return "Spices" # Default

def merge_compliance_data(hs_code: str, country: str, manufacturing_cost: float = 350.0) -> Dict[str, Any]:
    category = infer_category(hs_code)
    country_clean = country.strip()

    # 1. Load Curated static base rules
    curated_rules = {}
    if os.path.exists(CURATED_PATH):
        try:
            with open(CURATED_PATH, "r") as f:
                curated_rules = json.load(f)
        except Exception as e:
            print(f"Error loading curated data: {e}")

    # Get baseline matching entry
    country_data = curated_rules.get(country_clean, {}).get(category, {})
    if not country_data:
        # standard fallback structure if country/category missing
        country_data = {
            "required_documents": ["Commercial Invoice", "Packing List", "Certificate of Origin"],
            "required_certifications": [],
            "packaging_rules": "Standard commercial packaging.",
            "labeling_rules": "Standard English labeling specifying origin.",
            "tariff_percent": 3.0,
            "tax_percent": 10.0,
            "source_url": "https://www.wto.org"
        }

    # 2. Call World Bank Live API for risk and logistics scores
    wb_res = fetch_world_bank_data(country_clean)
    
    # 3. Call UN Comtrade API for demand index
    comtrade_res = fetch_un_comtrade_demand(hs_code, country_clean)

    # 4. Handle live Tariff overrides for specific countries
    tariff_percent = country_data.get("tariff_percent", 2.0)
    source_citation = country_data.get("source_url", "")
    
    if country_clean.lower() in ["united kingdom", "uk"]:
        uk_tariff_res = fetch_uk_tariff(hs_code)
        tariff_percent = uk_tariff_res.get("tariff_percent", tariff_percent)
        source_citation = uk_tariff_res.get("source_url", source_citation)
    
    # 5. Call FDA Warning checks if USA
    fda_citations = []
    if country_clean.lower() == "usa":
        fda_res = fetch_fda_warnings(category)
        fda_citations.append(fda_res.get("warning"))
        source_citation = fda_res.get("source_url", source_citation)

    # Add FDA warnings into snippets or rules if needed
    rule_docs = list(country_data.get("required_documents", []))
    if fda_citations:
        rule_docs.append("FDA Warning Declaration Certificate")

    # 6. Calculate Landed cost estimates
    ship_cost = 45.00 if "germany" in country_clean.lower() else 30.00 if "uae" in country_clean.lower() else 35.00
    ins_cost = 12.00 if "germany" in country_clean.lower() else 10.00 if "uae" in country_clean.lower() else 8.00
    
    tariff_val = (manufacturing_cost + ship_cost) * (tariff_percent / 100.0)
    tax_percent = country_data.get("tax_percent", 5.0)
    tax_val = (manufacturing_cost + ship_cost + ins_cost + tariff_val) * (tax_percent / 100.0)
    
    total_cost = manufacturing_cost + ship_cost + ins_cost + tariff_val + tax_val
    selling_price = manufacturing_cost * 1.6
    profit = selling_price - total_cost

    # Map region
    regions = {
        "UAE": "Middle East", "USA": "North America", "Germany": "Europe",
        "United Kingdom": "Europe", "Singapore": "Asia-Pacific", "Australia": "Asia-Pacific",
        "Saudi Arabia": "Middle East", "Japan": "Asia-Pacific", "Canada": "North America",
        "South Africa": "Africa"
    }

    return {
        "country": {
            "name": country_clean,
            "region": regions.get(country_clean, "Global"),
            "demand_index": comtrade_res.get("demand_index", 50.0),
            "logistics_score": wb_res.get("logistics_score", 80.0),
            "risk_score": wb_res.get("risk_score", 80.0)
        },
        "compliance_rule": {
            "product_category": category,
            "required_documents": rule_docs,
            "required_certifications": country_data.get("required_certifications", []),
            "packaging_rules": country_data.get("packaging_rules", ""),
            "labeling_rules": country_data.get("labeling_rules", ""),
            "source_url": source_citation
        },
        "cost_estimate": {
            "manufacturing_cost": manufacturing_cost,
            "shipping_cost": ship_cost,
            "insurance_cost": ins_cost,
            "tariff": round(tariff_val, 2),
            "tax": round(tax_val, 2),
            "total_cost": round(total_cost, 2),
            "selling_price": round(selling_price, 2),
            "estimated_profit": round(profit, 2)
        }
    }

if __name__ == "__main__":
    import pprint
    pprint.pprint(merge_compliance_data("0910.30", "Germany"))
    pprint.pprint(merge_compliance_data("0910.30", "United Kingdom"))
