-- Drop tables in reverse order of creation to prevent foreign key errors
DROP TABLE IF EXISTS chat_messages;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS logistics_quotes;
DROP TABLE IF EXISTS purchase_requests;
DROP TABLE IF EXISTS policy_alerts;
DROP TABLE IF EXISTS what_if_simulations;
DROP TABLE IF EXISTS country_rankings;
DROP TABLE IF EXISTS cost_estimates;
DROP TABLE IF EXISTS compliance_scores;
DROP TABLE IF EXISTS compliance_rules;
DROP TABLE IF EXISTS countries;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS logistics_partners;
DROP TABLE IF EXISTS importers;
DROP TABLE IF EXISTS users;

-- 1. Users table
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL, -- EXPORTER, IMPORTER, LOGISTICS_PARTNER, ADMIN
    language_preference VARCHAR(10) DEFAULT 'EN',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_users_email ON users(email);

-- 2. Importers profile table
CREATE TABLE importers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    license_number VARCHAR(100),
    industry_type VARCHAR(100),
    preferred_categories JSON, -- array of strings
    preferred_countries JSON, -- array of strings
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Logistics Partners profile table
CREATE TABLE logistics_partners (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    services_offered JSON, -- array of strings
    regions_served JSON, -- array of strings
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Products table
CREATE TABLE products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    exporter_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    hs_code VARCHAR(20) NOT NULL,
    manufacturing_cost DECIMAL(15, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (exporter_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX idx_products_exporter ON products(exporter_id);
CREATE INDEX idx_products_hs_code ON products(hs_code);

-- 5. Countries table
CREATE TABLE countries (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    region VARCHAR(100),
    demand_index DOUBLE DEFAULT 0.0, -- score 0-100
    logistics_score DOUBLE DEFAULT 0.0, -- score 0-100
    risk_score DOUBLE DEFAULT 0.0 -- score 0-100 (higher = safer/better)
);

-- 6. Compliance Rules table
CREATE TABLE compliance_rules (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    country_id BIGINT NOT NULL,
    product_category VARCHAR(100) NOT NULL,
    required_documents JSON, -- documents list
    required_certifications JSON, -- certificates list
    packaging_rules JSON, -- packing rules
    labeling_rules JSON, -- label rules
    source_url VARCHAR(512),
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (country_id) REFERENCES countries(id) ON DELETE CASCADE
);
CREATE INDEX idx_compliance_rules_country_cat ON compliance_rules(country_id, product_category);

-- 7. Compliance Scores table
CREATE TABLE compliance_scores (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT NOT NULL,
    country_id BIGINT NOT NULL,
    complexity_score DOUBLE DEFAULT 0.0, -- 0-100 (high = harder)
    difficulty_label VARCHAR(50), -- LOW, MODERATE, HIGH
    breakdown JSON, -- details
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (country_id) REFERENCES countries(id) ON DELETE CASCADE
);
CREATE INDEX idx_comp_scores_prod_country ON compliance_scores(product_id, country_id);

-- 8. Cost Estimates table
CREATE TABLE cost_estimates (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT NOT NULL,
    country_id BIGINT NOT NULL,
    manufacturing_cost DECIMAL(15, 2) NOT NULL,
    shipping_cost DECIMAL(15, 2) DEFAULT 0.00,
    insurance_cost DECIMAL(15, 2) DEFAULT 0.00,
    tariff DECIMAL(15, 2) DEFAULT 0.00,
    tax DECIMAL(15, 2) DEFAULT 0.00,
    total_cost DECIMAL(15, 2) NOT NULL,
    selling_price DECIMAL(15, 2) NOT NULL,
    estimated_profit DECIMAL(15, 2) NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (country_id) REFERENCES countries(id) ON DELETE CASCADE
);
CREATE INDEX idx_costs_prod_country ON cost_estimates(product_id, country_id);

-- 9. Country Rankings table
CREATE TABLE country_rankings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT NOT NULL,
    country_id BIGINT NOT NULL,
    xgb_predicted_score DOUBLE NOT NULL,
    `rank` INT NOT NULL,
    shap_breakdown JSON, -- weights / feature contributions
    model_version VARCHAR(50) DEFAULT '1.0.0',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (country_id) REFERENCES countries(id) ON DELETE CASCADE
);
CREATE INDEX idx_rankings_prod_country ON country_rankings(product_id, country_id);

-- 10. What-If Simulations table
CREATE TABLE what_if_simulations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    base_ranking_id BIGINT,
    changed_inputs JSON,
    new_ranking JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
CREATE INDEX idx_whatif_user_prod ON what_if_simulations(user_id, product_id);

-- 11. Policy Alerts table
CREATE TABLE policy_alerts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    country_id BIGINT NOT NULL,
    rule_id BIGINT,
    change_summary TEXT NOT NULL,
    detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notified BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (country_id) REFERENCES countries(id) ON DELETE CASCADE
);
CREATE INDEX idx_policy_alerts_country ON policy_alerts(country_id);

-- 12. Purchase Requests table
CREATE TABLE purchase_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    importer_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING', -- PENDING, QUOTED, ACCEPTED, REJECTED
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (importer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
CREATE INDEX idx_purchase_reqs_importer ON purchase_requests(importer_id);
CREATE INDEX idx_purchase_reqs_product ON purchase_requests(product_id);

-- 13. Logistics Quotes table
CREATE TABLE logistics_quotes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    purchase_request_id BIGINT NOT NULL,
    logistics_partner_id BIGINT NOT NULL,
    price DECIMAL(15, 2) NOT NULL,
    delivery_days INT NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING', -- PENDING, ACCEPTED, REJECTED
    FOREIGN KEY (purchase_request_id) REFERENCES purchase_requests(id) ON DELETE CASCADE,
    FOREIGN KEY (logistics_partner_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX idx_quotes_request ON logistics_quotes(purchase_request_id);

-- 14. Orders table
CREATE TABLE orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    purchase_request_id BIGINT NOT NULL,
    quote_id BIGINT,
    status VARCHAR(50) DEFAULT 'ACCEPTED', -- ACCEPTED, SHIPPED, DELIVERED, CANCELLED
    tracking_status VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (purchase_request_id) REFERENCES purchase_requests(id) ON DELETE CASCADE,
    FOREIGN KEY (quote_id) REFERENCES logistics_quotes(id) ON DELETE SET NULL
);
CREATE INDEX idx_orders_request ON orders(purchase_request_id);

-- 15. Chat Messages table
CREATE TABLE chat_messages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    sender_id BIGINT NOT NULL,
    receiver_id BIGINT NOT NULL,
    content TEXT NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `read` BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX idx_chat_users ON chat_messages(sender_id, receiver_id);
