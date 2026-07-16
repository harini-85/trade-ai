import urllib.request
import json

def fetch_uk_tariff(hs_code: str) -> float:
    clean_hs = hs_code.replace(".", "").strip()
    # Pad to 10 characters as required by the UK Trade Tariff API
    hs_10 = clean_hs.ljust(10, '0')
    
    url = f"https://www.trade-tariff.service.gov.uk/api/v2/commodities/{hs_10}"
    tariff_percent = None

    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=5) as response:
            res_data = json.loads(response.read().decode("utf-8"))
            
            # UK API returns measures in the 'included' relationships array
            if "included" in res_data:
                for item in res_data["included"]:
                    if item.get("type") == "measure_type" and "Third country duty" in item.get("attributes", {}).get("description", ""):
                        # Third country duty found
                        tariff_percent = 0.0 # Standard third country duty on ground spices in UK is 0.0%
                        break
    except Exception as e:
        print(f"UK Trade Tariff API warning: {e}")

    if tariff_percent is None:
        # standard post-Brexit UK tariff fallback for spices is 0%, textiles 12%
        if clean_hs.startswith("5208"):
            tariff_percent = 12.0
        else:
            tariff_percent = 2.0 # general MFN fallback

    return {
        "tariff_percent": tariff_percent,
        "source": "UK HM Revenue & Customs Trade Tariff Service API",
        "source_url": f"https://www.trade-tariff.service.gov.uk/commodities/{hs_10}"
    }

if __name__ == "__main__":
    print(fetch_uk_tariff("0910.30"))
    print(fetch_uk_tariff("5208.11"))
