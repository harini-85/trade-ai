-- 1. Insert Users (password hash corresponds to BCrypt of plain text "password")
INSERT INTO users (id, name, email, password_hash, role, language_preference) VALUES
(1, 'John Exporter', 'exporter@company.com', '$2a$10$dXJ3ADWyyTXp.6v/w/aGbuH2TzT3fP2.h0gQ9j108JzW9v6P8d8iO', 'EXPORTER', 'EN'),
(2, 'Al Noor Importer', 'importer@company.com', '$2a$10$dXJ3ADWyyTXp.6v/w/aGbuH2TzT3fP2.h0gQ9j108JzW9v6P8d8iO', 'IMPORTER', 'EN'),
(3, 'FastCargo Logistics', 'logistics@company.com', '$2a$10$dXJ3ADWyyTXp.6v/w/aGbuH2TzT3fP2.h0gQ9j108JzW9v6P8d8iO', 'LOGISTICS_PARTNER', 'EN'),
(4, 'Admin User', 'admin@company.com', '$2a$10$dXJ3ADWyyTXp.6v/w/aGbuH2TzT3fP2.h0gQ9j108JzW9v6P8d8iO', 'ADMIN', 'EN');

-- 2. Insert Importer profile details
INSERT INTO importers (id, user_id, license_number, industry_type, preferred_categories, preferred_countries) VALUES
(1, 2, 'LIC-9876543-A', 'Wholesale', '["Spices", "Textiles"]', '["India"]');

-- 3. Insert Logistics profile details
INSERT INTO logistics_partners (id, user_id, services_offered, regions_served) VALUES
(1, 3, '["Sea Freight", "Customs Clearance", "Air Freight"]', '["Europe", "Middle East", "Southeast Asia"]');

-- 4. Insert exactly 10 Countries as specified
INSERT INTO countries (id, name, region, demand_index, logistics_score, risk_score) VALUES
(1, 'UAE', 'Middle East', 78.0, 85.0, 88.0),
(2, 'USA', 'North America', 92.0, 94.0, 95.0),
(3, 'Germany', 'Europe', 85.0, 92.0, 95.0),
(4, 'United Kingdom', 'Europe', 80.0, 90.0, 92.0),
(5, 'Singapore', 'Asia-Pacific', 72.0, 96.0, 98.0),
(6, 'Australia', 'Asia-Pacific', 75.0, 88.0, 94.0),
(7, 'Saudi Arabia', 'Middle East', 88.0, 82.0, 80.0),
(8, 'Japan', 'Asia-Pacific', 70.0, 92.0, 96.0),
(9, 'Canada', 'North America', 74.0, 88.0, 93.0),
(10, 'South Africa', 'Africa', 68.0, 74.0, 72.0);

-- 5. Insert Products
INSERT INTO products (id, exporter_id, name, category, description, hs_code, manufacturing_cost) VALUES
(1, 1, 'Organic Turmeric Powder', 'Spices', 'Premium grade organic turmeric powder sourced from Nizamabad, India.', '0910.30', 350.00),
(2, 1, 'Cumin Seeds', 'Spices', 'Dried seeds of Cuminum cyminum, popular in various global cuisines.', '0909.31', 420.00),
(3, 1, 'Green Cardamom', 'Spices', 'High grade cardamom pods with intensive aroma.', '0908.31', 1200.00),
(4, 1, 'Cotton Textile Fabrics', 'Textiles', 'Woven cotton fabrics for garments and clothing manufactures.', '5208.11', 150.00);

-- 6. Insert Compliance Rules for all 10 countries (Category: Spices)
INSERT INTO compliance_rules (id, country_id, product_category, required_documents, required_certifications, packaging_rules, labeling_rules, source_url) VALUES
(1, 1, 'Spices', 
 '["Commercial Invoice", "Packing List", "Certificate of Origin", "Bill of Lading", "Phytosanitary Certificate"]',
 '["Halal Certificate"]',
 '["Moisture-resistant double-layered polyethylene bags", "Stored under clean dry conditions under 25C"]',
 '["Language: English and Arabic", "Production and Expiry Dates", "Country of Origin: India"]',
 'https://www.moiat.gov.ae'),
(2, 2, 'Spices', 
 '["Commercial Invoice", "Packing List", "Certificate of Origin", "Customs Bond", "FDA Import Entry (Form 3461)", "Phytosanitary Certificate"]',
 '["FDA Food Facility Registration", "FDA Prior Notice Confirmation"]',
 '["FDA-approved food contact materials", "Airtight containers preventing pest entry"]',
 '["FPLA standards: Net weight in metric & ounces", "Nutrition facts panel", "English text", "Ingredient list"]',
 'https://www.fda.gov/food/importing-food-products-united-states'),
(3, 3, 'Spices', 
 '["Commercial Invoice", "Packing List", "Certificate of Origin", "Single Administrative Document (SAD)", "Phytosanitary Certificate", "Certificate of Analysis for aflatoxins"]',
 '["EU Organic Standard", "ISO 22000"]',
 '["EU Regulation 1935/2004 food contact safety", "Double-walled kraft paper sacks under 25kg"]',
 '["Language: German", "Net weight in metric", "Importer name and address in EU", "Allergen warning if cross-contaminated"]',
 'https://trade.ec.europa.eu/access-to-markets/en/content/spices-import-rules-germany'),
(4, 4, 'Spices', 
 '["Commercial Invoice", "Packing List", "Certificate of Origin", "UK Customs Declaration", "Phytosanitary Certificate"]',
 '["BRCGS Food Safety Standard", "UK Organic Certificate"]',
 '["UK food contact safety standards", "Sealed composite containers"]',
 '["English labeling", "UK importer address", "Net weight in metric", "Batch number"]',
 'https://www.gov.uk/import-goods-into-uk'),
(5, 5, 'Spices', 
 '["Commercial Invoice", "Packing List", "Certificate of Origin", "SFA Import Permit"]',
 '["HACCP Certification", "ISO 22000"]',
 '["Airtight commercial packaging preventing contamination"]',
 '["English labeling", "Net content weight", "SFA importer license ID", "Date of manufacture"]',
 'https://www.sfa.gov.sg/food-import-export'),
(6, 6, 'Spices', 
 '["Commercial Invoice", "Packing List", "Certificate of Origin", "Biosecurity Import Declaration", "Phytosanitary Certificate", "Aflatoxin Analysis Report"]',
 '["DAFF import clearance"]',
 '["Hermetically sealed bags preventing moisture", "Treated wooden pallets complying with ISPM 15"]',
 '["English labeling", "Country of origin label", "Net weight", "Nutrition information panel"]',
 'https://www.agriculture.gov.au/biosecurity-trade/import'),
(7, 7, 'Spices', 
 '["Commercial Invoice", "Packing List", "Certificate of Origin", "SASO Certificate of Conformity", "Phytosanitary Certificate", "FSSAI Export License"]',
 '["SFDA Food Facility Registration", "Halal Certificate"]',
 '["Food-grade sealed bags", "Treated pallets"]',
 '["Bilingual: Arabic and English", "Halal logo", "Importer details in KSA", "Production and expiry dates"]',
 'https://www.sfda.gov.sa'),
(8, 8, 'Spices', 
 '["Commercial Invoice", "Packing List", "Certificate of Origin", "Japan Customs Declaration", "Phytosanitary Certificate", "Inspection Certificate under Food Sanitation Act"]',
 '["JAS Organic Certificate", "MHLW facility clearance"]',
 '["Double-layered moisture-proof bags", "Insect-proof packaging"]',
 '["Japanese language label", "Net weight in metric", "Allergen statements", "Importer info in Japan"]',
 'https://www.mhlw.go.jp/english/topics/importedfoods'),
(9, 9, 'Spices', 
 '["Commercial Invoice", "Packing List", "Certificate of Origin", "Canada Customs Invoice (CCI)", "Phytosanitary Certificate"]',
 '["CFIA Safe Food for Canadians License", "COR Organic Standard"]',
 '["CFIA food contact material standards", "Airtight paperboard boxes"]',
 '["Bilingual: English and French", "Net content in metric", "Nutrition facts table", "Country of origin"]',
 'https://inspection.canada.ca/food-licensing'),
(10, 10, 'Spices', 
 '["Commercial Invoice", "Packing List", "Certificate of Origin", "Bill of Lading", "Phytosanitary Certificate"]',
 '["Department of Health food clearance", "SABS packaging approval"]',
 '["Standard woven polypropylene bags", "Sealed to protect from moisture"]',
 '["English labeling", "Net mass in metric", "Ingredients list", "Country of origin: India"]',
 'https://www.gov.za');

-- 7. Insert Compliance Scores (product_id = 1, Spices)
-- Baseline assumes Exporter does NOT hold specialized certifications (e.g. Halal, JAS, Organic), resulting in complexity penalties
INSERT INTO compliance_scores (id, product_id, country_id, complexity_score, difficulty_label, breakdown) VALUES
(1, 1, 1, 30.0, 'LOW', '{"snippets": ["Standard UAE custom documentation"], "required_documents": ["Commercial Invoice", "Packing List", "Certificate of Origin", "Bill of Lading", "Phytosanitary Certificate"], "required_certifications": ["Halal Certificate"]}'),
(2, 1, 2, 65.0, 'HIGH', '{"snippets": ["Strict FDA Prior Notice audit"], "required_documents": ["Commercial Invoice", "Packing List", "Certificate of Origin", "Customs Bond", "FDA Import Entry (Form 3461)", "Phytosanitary Certificate"], "required_certifications": ["FDA Food Facility Registration", "FDA Prior Notice Confirmation"]}'),
(3, 1, 3, 70.0, 'HIGH', '{"snippets": ["EU organic and chemical analysis enforcement"], "required_documents": ["Commercial Invoice", "Packing List", "Certificate of Origin", "Single Administrative Document (SAD)", "Phytosanitary Certificate", "Certificate of Analysis for aflatoxins"], "required_certifications": ["EU Organic Standard", "ISO 22000"]}'),
(4, 1, 4, 45.0, 'MODERATE', '{"snippets": ["UK import and certification declaration"], "required_documents": ["Commercial Invoice", "Packing List", "Certificate of Origin", "UK Customs Declaration", "Phytosanitary Certificate"], "required_certifications": ["BRCGS Food Safety Standard", "UK Organic Certificate"]}'),
(5, 1, 5, 25.0, 'LOW', '{"snippets": ["Singapore SFA regulatory compliance"], "required_documents": ["Commercial Invoice", "Packing List", "Certificate of Origin", "SFA Import Permit"], "required_certifications": ["HACCP Certification", "ISO 22000"]}'),
(6, 1, 6, 60.0, 'MODERATE', '{"snippets": ["Australia strict biosecurity control"], "required_documents": ["Commercial Invoice", "Packing List", "Certificate of Origin", "Biosecurity Import Declaration", "Phytosanitary Certificate", "Aflatoxin Analysis Report"], "required_certifications": ["DAFF import clearance"]}'),
(7, 1, 7, 50.0, 'MODERATE', '{"snippets": ["SFDA Food imports regulations"], "required_documents": ["Commercial Invoice", "Packing List", "Certificate of Origin", "SASO Certificate of Conformity", "Phytosanitary Certificate", "FSSAI Export License"], "required_certifications": ["SFDA Food Facility Registration", "Halal Certificate"]}'),
(8, 1, 8, 65.0, 'HIGH', '{"snippets": ["MHLW Food sanitation clearances"], "required_documents": ["Commercial Invoice", "Packing List", "Certificate of Origin", "Japan Customs Declaration", "Phytosanitary Certificate", "Inspection Certificate under Food Sanitation Act"], "required_certifications": ["JAS Organic Certificate", "MHLW facility clearance"]}'),
(9, 1, 9, 45.0, 'MODERATE', '{"snippets": ["CFIA importing license verification"], "required_documents": ["Commercial Invoice", "Packing List", "Certificate of Origin", "Canada Customs Invoice (CCI)", "Phytosanitary Certificate"], "required_certifications": ["CFIA Safe Food for Canadians License", "COR Organic Standard"]}'),
(10, 1, 10, 40.0, 'MODERATE', '{"snippets": ["Standard South Africa port declarations"], "required_documents": ["Commercial Invoice", "Packing List", "Certificate of Origin", "Bill of Lading", "Phytosanitary Certificate"], "required_certifications": ["Department of Health food clearance", "SABS packaging approval"]}');

-- 8. Insert Cost Estimates (product_id = 1, Spices)
INSERT INTO cost_estimates (id, product_id, country_id, manufacturing_cost, shipping_cost, insurance_cost, tariff, tax, total_cost, selling_price, estimated_profit) VALUES
(1, 1, 1, 350.00, 30.00, 10.00, 0.00, 19.50, 409.50, 620.00, 210.50), -- UAE (CEPA 0% tariff, 5% VAT)
(2, 1, 2, 350.00, 60.00, 15.00, 18.00, 10.00, 453.00, 680.00, 227.00), -- USA
(3, 1, 3, 350.00, 55.00, 12.00, 14.50, 9.00, 440.50, 650.00, 209.50), -- Germany
(4, 1, 4, 350.00, 50.00, 11.00, 12.00, 8.00, 431.00, 640.00, 209.00), -- UK
(5, 1, 5, 350.00, 32.00, 8.00, 0.00, 27.30, 417.30, 590.00, 172.70),  -- Singapore (0% tariff, 7% GST)
(6, 1, 6, 350.00, 48.00, 13.00, 0.00, 41.10, 452.10, 640.00, 187.90),  -- Australia (ECTA 0% tariff)
(7, 1, 7, 350.00, 35.00, 11.00, 25.00, 63.15, 484.15, 660.00, 175.85), -- Saudi Arabia (5% tariff, 15% VAT)
(8, 1, 8, 350.00, 40.00, 12.00, 15.00, 41.70, 458.70, 630.00, 171.30),  -- Japan
(9, 1, 9, 350.00, 55.00, 14.00, 8.00, 21.35, 448.35, 620.00, 171.65),  -- Canada
(10, 1, 10, 350.00, 42.00, 10.00, 18.00, 63.00, 483.00, 600.00, 117.00); -- South Africa

-- 9. Insert Country Rankings (product_id = 1, Spices)
-- Demonstrates Saudi Arabia / Germany rank differences.
-- Germany has very high demand index (85.0), but is penalized heavily by lack of Organic Standard certification (SHAP compliance score contribution: -15.0).
-- If user obtains EU Organic Standard & ISO 22000, complexity drops and Germany climbs to Rank #1.
INSERT INTO country_rankings (id, product_id, country_id, xgb_predicted_score, `rank`, shap_breakdown, model_version) VALUES
(1, 1, 2, 86.4, 1, '{"demand_index": 28.5, "logistics_score": 14.2, "risk_score": 19.5, "compliance_score": -8.0, "total_cost": -12.4, "estimated_profit": 24.6}', '1.0.0'), -- USA
(2, 1, 1, 83.2, 2, '{"demand_index": 22.0, "logistics_score": 10.5, "risk_score": 18.2, "compliance_score": 5.0, "total_cost": -8.0, "estimated_profit": 25.5}', '1.0.0'),  -- UAE
(3, 1, 3, 79.5, 3, '{"demand_index": 25.5, "logistics_score": 12.8, "risk_score": 20.0, "compliance_score": -15.0, "total_cost": -10.2, "estimated_profit": 26.4}', '1.0.0'), -- Germany
(4, 1, 5, 78.4, 4, '{"demand_index": 18.2, "logistics_score": 16.0, "risk_score": 14.8, "compliance_score": 8.0, "total_cost": -9.0, "estimated_profit": 15.4}', '1.0.0'),  -- Singapore
(5, 1, 4, 76.5, 5, '{"demand_index": 20.4, "logistics_score": 12.2, "risk_score": 18.9, "compliance_score": -4.0, "total_cost": -11.0, "estimated_profit": 20.0}', '1.0.0'),  -- UK
(6, 1, 6, 75.1, 6, '{"demand_index": 19.5, "logistics_score": 11.0, "risk_score": 16.5, "compliance_score": -2.0, "total_cost": -9.5, "estimated_profit": 19.6}', '1.0.0'),   -- Australia
(7, 1, 7, 72.8, 7, '{"demand_index": 22.4, "logistics_score": 8.0, "risk_score": 15.0, "compliance_score": -10.0, "total_cost": -12.6, "estimated_profit": 20.0}', '1.0.0'),  -- Saudi Arabia
(8, 1, 8, 71.0, 8, '{"demand_index": 16.5, "logistics_score": 11.2, "risk_score": 17.5, "compliance_score": -12.0, "total_cost": -10.0, "estimated_profit": 17.8}', '1.0.0'),  -- Japan
(9, 1, 9, 69.8, 9, '{"demand_index": 18.0, "logistics_score": 10.0, "risk_score": 16.0, "compliance_score": -6.0, "total_cost": -10.5, "estimated_profit": 12.3}', '1.0.0'),   -- Canada
(10, 1, 10, 62.5, 10, '{"demand_index": 12.5, "logistics_score": 6.8, "risk_score": 10.2, "compliance_score": -3.0, "total_cost": -14.0, "estimated_profit": 10.0}', '1.0.0'); -- South Africa

-- 10. Insert Purchase Requests (Importer #2 asks for Exporter #1's Organic Turmeric #1)
INSERT INTO purchase_requests (id, importer_id, product_id, status) VALUES
(1, 2, 1, 'PENDING');
