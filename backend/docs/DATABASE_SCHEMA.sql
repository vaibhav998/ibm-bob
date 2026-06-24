-- ============================================================================
-- Northstar Database Schema
-- IBM AI-Powered Sales Pipeline & Coaching Intelligence Platform
-- Database: Db2 Warehouse on Cloud
-- Version: 1.0
-- Last Updated: 2026-06-18
-- ============================================================================

-- ============================================================================
-- EXTENSIONS & SETTINGS
-- ============================================================================

-- Enable UUID generation
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Set timezone
-- SET timezone = 'UTC';

-- ============================================================================
-- CORE ENTITIES
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Users Table
-- Stores all system users (sales reps, managers, directors, VPs, admins)
-- ----------------------------------------------------------------------------
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT GENERATE_UNIQUE(),
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('sales_rep', 'manager', 'director', 'vp', 'admin')),
    ibm_serial_number VARCHAR(50) UNIQUE,
    manager_id UUID REFERENCES users(user_id) ON DELETE SET NULL,
    territory_id UUID REFERENCES territories(territory_id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP,
    metadata CLOB,  -- JSON metadata
    CONSTRAINT chk_email_format CHECK (email LIKE '%@%')
);

CREATE INDEX idx_users_manager ON users(manager_id);
CREATE INDEX idx_users_territory ON users(territory_id);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_active ON users(is_active);
CREATE INDEX idx_users_last_login ON users(last_login_at);

COMMENT ON TABLE users IS 'All system users including sales reps, managers, and admins';
COMMENT ON COLUMN users.ibm_serial_number IS 'IBM employee serial number for SSO integration';
COMMENT ON COLUMN users.metadata IS 'JSON field for extensible user attributes';

-- ----------------------------------------------------------------------------
-- Territories Table
-- Geographic or account-based sales territories
-- ----------------------------------------------------------------------------
CREATE TABLE territories (
    territory_id UUID PRIMARY KEY DEFAULT GENERATE_UNIQUE(),
    territory_name VARCHAR(255) NOT NULL,
    territory_code VARCHAR(50) UNIQUE NOT NULL,
    region VARCHAR(100),
    country VARCHAR(100),
    segment VARCHAR(50) CHECK (segment IN ('enterprise', 'mid_market', 'smb')),
    total_accounts INTEGER DEFAULT 0,
    total_arr DECIMAL(15,2) DEFAULT 0,
    manager_id UUID REFERENCES users(user_id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_territories_manager ON territories(manager_id);
CREATE INDEX idx_territories_region ON territories(region);
CREATE INDEX idx_territories_country ON territories(country);
CREATE INDEX idx_territories_segment ON territories(segment);

COMMENT ON TABLE territories IS 'Sales territories with geographic and segment information';

-- ----------------------------------------------------------------------------
-- Sales Reps Table
-- Extended profile for sales representatives
-- ----------------------------------------------------------------------------
CREATE TABLE sales_reps (
    rep_id UUID PRIMARY KEY DEFAULT GENERATE_UNIQUE(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    quota_amount DECIMAL(15,2) NOT NULL,
    quota_period VARCHAR(20) NOT NULL CHECK (quota_period IN ('monthly', 'quarterly', 'annual')),
    start_date DATE NOT NULL,
    hire_date DATE,
    tenure_months INTEGER,
    segment VARCHAR(50) CHECK (segment IN ('enterprise', 'mid_market', 'smb')),
    specialization VARCHAR(100),
    performance_tier VARCHAR(20) CHECK (performance_tier IN ('top', 'core', 'developing', 'pip')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_quota_positive CHECK (quota_amount > 0)
);

CREATE INDEX idx_reps_user ON sales_reps(user_id);
CREATE INDEX idx_reps_performance ON sales_reps(performance_tier);
CREATE INDEX idx_reps_segment ON sales_reps(segment);
CREATE INDEX idx_reps_specialization ON sales_reps(specialization);

COMMENT ON TABLE sales_reps IS 'Extended profile information for sales representatives';
COMMENT ON COLUMN sales_reps.performance_tier IS 'Performance classification: top (>120%), core (80-120%), developing (60-80%), pip (<60%)';

-- ----------------------------------------------------------------------------
-- Accounts Table
-- Customer accounts
-- ----------------------------------------------------------------------------
CREATE TABLE accounts (
    account_id UUID PRIMARY KEY DEFAULT GENERATE_UNIQUE(),
    account_name VARCHAR(255) NOT NULL,
    crm_account_id VARCHAR(100) UNIQUE,
    industry VARCHAR(100),
    company_size VARCHAR(50) CHECK (company_size IN ('enterprise', 'mid_market', 'smb')),
    employee_count INTEGER,
    annual_revenue DECIMAL(15,2),
    country VARCHAR(100),
    state_province VARCHAR(100),
    city VARCHAR(100),
    territory_id UUID REFERENCES territories(territory_id) ON DELETE SET NULL,
    owner_id UUID REFERENCES users(user_id) ON DELETE SET NULL,
    health_score INTEGER CHECK (health_score BETWEEN 0 AND 100),
    engagement_level VARCHAR(50) CHECK (engagement_level IN ('high', 'medium', 'low', 'none')),
    last_activity_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_accounts_territory ON accounts(territory_id);
CREATE INDEX idx_accounts_owner ON accounts(owner_id);
CREATE INDEX idx_accounts_industry ON accounts(industry);
CREATE INDEX idx_accounts_health ON accounts(health_score);
CREATE INDEX idx_accounts_engagement ON accounts(engagement_level);
CREATE INDEX idx_accounts_crm ON accounts(crm_account_id);
CREATE INDEX idx_accounts_name ON accounts(account_name);

COMMENT ON TABLE accounts IS 'Customer accounts with firmographic and engagement data';

-- ----------------------------------------------------------------------------
-- Opportunities Table
-- Sales opportunities/deals
-- ----------------------------------------------------------------------------
CREATE TABLE opportunities (
    opportunity_id UUID PRIMARY KEY DEFAULT GENERATE_UNIQUE(),
    opportunity_name VARCHAR(255) NOT NULL,
    crm_opportunity_id VARCHAR(100) UNIQUE,
    account_id UUID NOT NULL REFERENCES accounts(account_id) ON DELETE CASCADE,
    owner_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    amount DECIMAL(15,2) NOT NULL,
    stage VARCHAR(100) NOT NULL,
    stage_number INTEGER,
    forecast_category VARCHAR(50) CHECK (forecast_category IN ('pipeline', 'best_case', 'commit', 'closed')),
    probability INTEGER CHECK (probability BETWEEN 0 AND 100),
    close_date DATE NOT NULL,
    created_date DATE NOT NULL,
    age_days INTEGER,
    days_in_stage INTEGER,
    is_closed BOOLEAN DEFAULT FALSE,
    is_won BOOLEAN DEFAULT FALSE,
    product_family VARCHAR(100),
    deal_type VARCHAR(50) CHECK (deal_type IN ('new_business', 'renewal', 'expansion', 'cross_sell')),
    next_step TEXT,
    last_activity_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_amount_positive CHECK (amount > 0),
    CONSTRAINT chk_close_date_future CHECK (close_date >= created_date)
);

CREATE INDEX idx_opps_account ON opportunities(account_id);
CREATE INDEX idx_opps_owner ON opportunities(owner_id);
CREATE INDEX idx_opps_stage ON opportunities(stage);
CREATE INDEX idx_opps_close_date ON opportunities(close_date);
CREATE INDEX idx_opps_forecast ON opportunities(forecast_category);
CREATE INDEX idx_opps_amount ON opportunities(amount);
CREATE INDEX idx_opps_is_closed ON opportunities(is_closed);
CREATE INDEX idx_opps_product_family ON opportunities(product_family);
CREATE INDEX idx_opps_deal_type ON opportunities(deal_type);
CREATE INDEX idx_opps_crm ON opportunities(crm_opportunity_id);

COMMENT ON TABLE opportunities IS 'Sales opportunities with stage, forecast, and health tracking';

-- ----------------------------------------------------------------------------
-- Activities Table
-- All sales activities (calls, emails, meetings, demos)
-- ----------------------------------------------------------------------------
CREATE TABLE activities (
    activity_id UUID PRIMARY KEY DEFAULT GENERATE_UNIQUE(),
    activity_type VARCHAR(50) NOT NULL CHECK (activity_type IN ('call', 'email', 'meeting', 'demo', 'proposal', 'other')),
    activity_source VARCHAR(50) CHECK (activity_source IN ('orum', 'salesloft', 'crm', 'manual')),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    account_id UUID REFERENCES accounts(account_id) ON DELETE SET NULL,
    opportunity_id UUID REFERENCES opportunities(opportunity_id) ON DELETE SET NULL,
    contact_name VARCHAR(255),
    contact_email VARCHAR(255),
    subject VARCHAR(500),
    duration_minutes INTEGER,
    outcome VARCHAR(100),
    is_successful BOOLEAN,
    activity_date TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata CLOB  -- JSON metadata
);

CREATE INDEX idx_activities_user ON activities(user_id);
CREATE INDEX idx_activities_account ON activities(account_id);
CREATE INDEX idx_activities_opp ON activities(opportunity_id);
CREATE INDEX idx_activities_date ON activities(activity_date);
CREATE INDEX idx_activities_type ON activities(activity_type);
CREATE INDEX idx_activities_source ON activities(activity_source);
CREATE INDEX idx_activities_successful ON activities(is_successful);

COMMENT ON TABLE activities IS 'All sales activities from ORUM, SalesLoft, and CRM';

-- ----------------------------------------------------------------------------
-- Meetings Table
-- Scheduled and completed meetings
-- ----------------------------------------------------------------------------
CREATE TABLE meetings (
    meeting_id UUID PRIMARY KEY DEFAULT GENERATE_UNIQUE(),
    activity_id UUID REFERENCES activities(activity_id) ON DELETE SET NULL,
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    account_id UUID REFERENCES accounts(account_id) ON DELETE SET NULL,
    opportunity_id UUID REFERENCES opportunities(opportunity_id) ON DELETE SET NULL,
    meeting_type VARCHAR(50) CHECK (meeting_type IN ('discovery', 'demo', 'proposal', 'negotiation', 'close', 'other')),
    scheduled_date TIMESTAMP NOT NULL,
    duration_minutes INTEGER,
    attendee_count INTEGER,
    was_held BOOLEAN DEFAULT FALSE,
    outcome VARCHAR(100),
    next_steps TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_meetings_user ON meetings(user_id);
CREATE INDEX idx_meetings_account ON meetings(account_id);
CREATE INDEX idx_meetings_opp ON meetings(opportunity_id);
CREATE INDEX idx_meetings_date ON meetings(scheduled_date);
CREATE INDEX idx_meetings_type ON meetings(meeting_type);
CREATE INDEX idx_meetings_held ON meetings(was_held);

COMMENT ON TABLE meetings IS 'Scheduled and completed sales meetings';

-- ============================================================================
-- PRODUCT & PROPENSITY
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Products Table
-- IBM product catalog
-- ----------------------------------------------------------------------------
CREATE TABLE products (
    product_id UUID PRIMARY KEY DEFAULT GENERATE_UNIQUE(),
    product_name VARCHAR(255) NOT NULL,
    product_code VARCHAR(100) UNIQUE NOT NULL,
    product_family VARCHAR(100),
    category VARCHAR(100),
    list_price DECIMAL(15,2),
    is_active BOOLEAN DEFAULT TRUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_products_family ON products(product_family);
CREATE INDEX idx_products_code ON products(product_code);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_active ON products(is_active);

COMMENT ON TABLE products IS 'IBM product catalog including watsonx, Db2, Instana, etc.';

-- ----------------------------------------------------------------------------
-- Installed Products Table
-- Products currently installed at customer accounts
-- ----------------------------------------------------------------------------
CREATE TABLE installed_products (
    installed_product_id UUID PRIMARY KEY DEFAULT GENERATE_UNIQUE(),
    account_id UUID NOT NULL REFERENCES accounts(account_id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
    install_date DATE NOT NULL,
    contract_value DECIMAL(15,2),
    renewal_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    usage_level VARCHAR(50) CHECK (usage_level IN ('high', 'medium', 'low', 'unknown')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_account_product UNIQUE(account_id, product_id)
);

CREATE INDEX idx_installed_account ON installed_products(account_id);
CREATE INDEX idx_installed_product ON installed_products(product_id);
CREATE INDEX idx_installed_renewal ON installed_products(renewal_date);
CREATE INDEX idx_installed_active ON installed_products(is_active);

COMMENT ON TABLE installed_products IS 'Products installed at customer accounts for cross-sell/upsell analysis';

-- ----------------------------------------------------------------------------
-- Product Propensity Scores Table
-- AI-generated product recommendations for accounts
-- ----------------------------------------------------------------------------
CREATE TABLE product_propensity_scores (
    propensity_id UUID PRIMARY KEY DEFAULT GENERATE_UNIQUE(),
    account_id UUID NOT NULL REFERENCES accounts(account_id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
    score_date DATE NOT NULL,
    propensity_score INTEGER NOT NULL CHECK (propensity_score BETWEEN 0 AND 100),
    cross_sell_score INTEGER CHECK (cross_sell_score BETWEEN 0 AND 100),
    expansion_score INTEGER CHECK (expansion_score BETWEEN 0 AND 100),
    recommendation_rank INTEGER,
    confidence_level VARCHAR(50) CHECK (confidence_level IN ('high', 'medium', 'low')),
    reasoning TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_account_product_date UNIQUE(account_id, product_id, score_date)
);

CREATE INDEX idx_propensity_account ON product_propensity_scores(account_id);
CREATE INDEX idx_propensity_product ON product_propensity_scores(product_id);
CREATE INDEX idx_propensity_score ON product_propensity_scores(propensity_score DESC);
CREATE INDEX idx_propensity_date ON product_propensity_scores(score_date);
CREATE INDEX idx_propensity_rank ON product_propensity_scores(recommendation_rank);

COMMENT ON TABLE product_propensity_scores IS 'AI-generated product propensity scores for cross-sell and upsell';

-- ============================================================================
-- INTELLIGENCE & ANALYTICS
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Risk Assessments Table
-- Quota risk scores and component analysis
-- ----------------------------------------------------------------------------
CREATE TABLE risk_assessments (
    risk_id UUID PRIMARY KEY DEFAULT GENERATE_UNIQUE(),
    rep_id UUID NOT NULL REFERENCES sales_reps(rep_id) ON DELETE CASCADE,
    assessment_date DATE NOT NULL,
    quota_risk_score INTEGER NOT NULL CHECK (quota_risk_score BETWEEN 0 AND 100),
    risk_category VARCHAR(20) NOT NULL CHECK (risk_category IN ('healthy', 'watch', 'high_risk')),
    pipeline_coverage_score INTEGER CHECK (pipeline_coverage_score BETWEEN 0 AND 100),
    opportunity_creation_score INTEGER CHECK (opportunity_creation_score BETWEEN 0 AND 100),
    meeting_activity_score INTEGER CHECK (meeting_activity_score BETWEEN 0 AND 100),
    account_coverage_score INTEGER CHECK (account_coverage_score BETWEEN 0 AND 100),
    conversion_rate_score INTEGER CHECK (conversion_rate_score BETWEEN 0 AND 100),
    primary_risk_factor VARCHAR(100),
    secondary_risk_factor VARCHAR(100),
    risk_trend VARCHAR(20) CHECK (risk_trend IN ('improving', 'stable', 'declining')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata CLOB  -- JSON metadata
);

CREATE INDEX idx_risk_rep ON risk_assessments(rep_id);
CREATE INDEX idx_risk_date ON risk_assessments(assessment_date);
CREATE INDEX idx_risk_category ON risk_assessments(risk_category);
CREATE INDEX idx_risk_score ON risk_assessments(quota_risk_score);
CREATE INDEX idx_risk_trend ON risk_assessments(risk_trend);

COMMENT ON TABLE risk_assessments IS 'Daily quota risk assessments with component scores';

-- ----------------------------------------------------------------------------
-- Forecast Snapshots Table
-- Projected attainment forecasts
-- ----------------------------------------------------------------------------
CREATE TABLE forecast_snapshots (
    forecast_id UUID PRIMARY KEY DEFAULT GENERATE_UNIQUE(),
    rep_id UUID NOT NULL REFERENCES sales_reps(rep_id) ON DELETE CASCADE,
    forecast_date DATE NOT NULL,
    forecast_period VARCHAR(50) NOT NULL,
    forecast_type VARCHAR(50) CHECK (forecast_type IN ('30_day', 'quarter_end', 'year_end')),
    projected_attainment DECIMAL(15,2) NOT NULL,
    projected_attainment_percent DECIMAL(5,2),
    projected_pipeline DECIMAL(15,2),
    confidence_score INTEGER CHECK (confidence_score BETWEEN 0 AND 100),
    commit_amount DECIMAL(15,2),
    best_case_amount DECIMAL(15,2),
    pipeline_amount DECIMAL(15,2),
    closed_won_amount DECIMAL(15,2),
    gap_to_quota DECIMAL(15,2),
    opportunities_needed INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata CLOB  -- JSON metadata
);

CREATE INDEX idx_forecast_rep ON forecast_snapshots(rep_id);
CREATE INDEX idx_forecast_date ON forecast_snapshots(forecast_date);
CREATE INDEX idx_forecast_period ON forecast_snapshots(forecast_period);
CREATE INDEX idx_forecast_type ON forecast_snapshots(forecast_type);

COMMENT ON TABLE forecast_snapshots IS 'AI-generated forecast projections for quota attainment';

-- ----------------------------------------------------------------------------
-- Opportunity Diagnostics Table
-- Health and risk analysis for individual opportunities
-- ----------------------------------------------------------------------------
CREATE TABLE opportunity_diagnostics (
    diagnostic_id UUID PRIMARY KEY DEFAULT GENERATE_UNIQUE(),
    opportunity_id UUID NOT NULL REFERENCES opportunities(opportunity_id) ON DELETE CASCADE,
    diagnostic_date DATE NOT NULL,
    win_probability INTEGER CHECK (win_probability BETWEEN 0 AND 100),
    risk_score INTEGER CHECK (risk_score BETWEEN 0 AND 100),
    health_status VARCHAR(50) CHECK (health_status IN ('healthy', 'at_risk', 'stalled', 'slipping')),
    stage_velocity_days DECIMAL(5,2),
    is_stagnant BOOLEAN DEFAULT FALSE,
    days_stagnant INTEGER,
    is_aging BOOLEAN DEFAULT FALSE,
    activity_score INTEGER CHECK (activity_score BETWEEN 0 AND 100),
    engagement_score INTEGER CHECK (engagement_score BETWEEN 0 AND 100),
    forecast_contribution DECIMAL(15,2),
    primary_issue VARCHAR(255),
    recommended_action VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_diag_opp ON opportunity_diagnostics(opportunity_id);
CREATE INDEX idx_diag_date ON opportunity_diagnostics(diagnostic_date);
CREATE INDEX idx_diag_health ON opportunity_diagnostics(health_status);
CREATE INDEX idx_diag_stagnant ON opportunity_diagnostics(is_stagnant);
CREATE INDEX idx_diag_aging ON opportunity_diagnostics(is_aging);

COMMENT ON TABLE opportunity_diagnostics IS 'Daily health diagnostics for opportunities';

-- ----------------------------------------------------------------------------
-- Territory Coverage Table
-- Territory engagement and whitespace analysis
-- ----------------------------------------------------------------------------
CREATE TABLE territory_coverage (
    coverage_id UUID PRIMARY KEY DEFAULT GENERATE_UNIQUE(),
    rep_id UUID NOT NULL REFERENCES sales_reps(rep_id) ON DELETE CASCADE,
    territory_id UUID NOT NULL REFERENCES territories(territory_id) ON DELETE CASCADE,
    coverage_date DATE NOT NULL,
    assigned_accounts INTEGER NOT NULL,
    engaged_accounts INTEGER NOT NULL,
    untouched_accounts INTEGER NOT NULL,
    coverage_percentage DECIMAL(5,2),
    whitespace_opportunity DECIMAL(15,2),
    high_value_untouched INTEGER,
    engagement_trend VARCHAR(20) CHECK (engagement_trend IN ('improving', 'stable', 'declining')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_coverage_rep ON territory_coverage(rep_id);
CREATE INDEX idx_coverage_territory ON territory_coverage(territory_id);
CREATE INDEX idx_coverage_date ON territory_coverage(coverage_date);
CREATE INDEX idx_coverage_percentage ON territory_coverage(coverage_percentage);

COMMENT ON TABLE territory_coverage IS 'Daily territory coverage and whitespace analysis';

-- ============================================================================
-- COACHING & RECOMMENDATIONS
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Coaching Recommendations Table
-- AI-generated coaching actions for managers
-- ----------------------------------------------------------------------------
CREATE TABLE coaching_recommendations (
    recommendation_id UUID PRIMARY KEY DEFAULT GENERATE_UNIQUE(),
    rep_id UUID NOT NULL REFERENCES sales_reps(rep_id) ON DELETE CASCADE,
    manager_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    recommendation_date DATE NOT NULL,
    priority INTEGER NOT NULL CHECK (priority BETWEEN 1 AND 5),
    category VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    reason TEXT,
    suggested_action TEXT NOT NULL,
    impact_score INTEGER CHECK (impact_score BETWEEN 0 AND 100),
    effort_level VARCHAR(50) CHECK (effort_level IN ('low', 'medium', 'high')),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'dismissed')),
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_rec_rep ON coaching_recommendations(rep_id);
CREATE INDEX idx_rec_manager ON coaching_recommendations(manager_id);
CREATE INDEX idx_rec_date ON coaching_recommendations(recommendation_date);
CREATE INDEX idx_rec_priority ON coaching_recommendations(priority);
CREATE INDEX idx_rec_status ON coaching_recommendations(status);
CREATE INDEX idx_rec_category ON coaching_recommendations(category);

COMMENT ON TABLE coaching_recommendations IS 'AI-generated coaching recommendations prioritized by impact';

-- ----------------------------------------------------------------------------
-- Coaching Notes Table
-- Manager coaching session notes and feedback
-- ----------------------------------------------------------------------------
CREATE TABLE coaching_notes (
    note_id UUID PRIMARY KEY DEFAULT GENERATE_UNIQUE(),
    rep_id UUID NOT NULL REFERENCES sales_reps(rep_id) ON DELETE CASCADE,
    manager_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    recommendation_id UUID REFERENCES coaching_recommendations(recommendation_id) ON DELETE SET NULL,
    note_type VARCHAR(50) CHECK (note_type IN ('coaching_session', 'feedback', 'action_plan', 'follow_up')),
    subject VARCHAR(255),
    content TEXT NOT NULL,
    is_private BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notes_rep ON coaching_notes(rep_id);
CREATE INDEX idx_notes_manager ON coaching_notes(manager_id);
CREATE INDEX idx_notes_rec ON coaching_notes(recommendation_id);
CREATE INDEX idx_notes_type ON coaching_notes(note_type);
CREATE INDEX idx_notes_created ON coaching_notes(created_at);

COMMENT ON TABLE coaching_notes IS 'Manager coaching notes and feedback for sales reps';

-- ============================================================================
-- MANAGER COPILOT
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Copilot Sessions Table
-- Manager copilot conversation sessions
-- ----------------------------------------------------------------------------
CREATE TABLE copilot_sessions (
    session_id UUID PRIMARY KEY DEFAULT GENERATE_UNIQUE(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    session_start TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    session_end TIMESTAMP,
    query_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_copilot_user ON copilot_sessions(user_id);
CREATE INDEX idx_copilot_start ON copilot_sessions(session_start);

COMMENT ON TABLE copilot_sessions IS 'Manager copilot conversation sessions';

-- ----------------------------------------------------------------------------
-- Copilot Queries Table
-- Individual queries and responses from manager copilot
-- ----------------------------------------------------------------------------
CREATE TABLE copilot_queries (
    query_id UUID PRIMARY KEY DEFAULT GENERATE_UNIQUE(),
    session_id UUID NOT NULL REFERENCES copilot_sessions(session_id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    query_text TEXT NOT NULL,
    response_text TEXT,
    context_retrieved CLOB,  -- JSON context
    response_time_ms INTEGER,
    was_helpful BOOLEAN,
    feedback TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_queries_session ON copilot_queries(session_id);
CREATE INDEX idx_queries_user ON copilot_queries(user_id);
CREATE INDEX idx_queries_created ON copilot_queries(created_at);

COMMENT ON TABLE copilot_queries IS 'Manager copilot queries and AI-generated responses';

-- ============================================================================
-- EXECUTIVE REPORTING
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Executive Briefs Table
-- Weekly executive summaries for managers
-- ----------------------------------------------------------------------------
CREATE TABLE executive_briefs (
    brief_id UUID PRIMARY KEY DEFAULT GENERATE_UNIQUE(),
    manager_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    brief_date DATE NOT NULL,
    brief_period VARCHAR(50) NOT NULL,
    team_quota DECIMAL(15,2),
    team_attainment DECIMAL(15,2),
    team_attainment_percent DECIMAL(5,2),
    total_pipeline DECIMAL(15,2),
    pipeline_coverage DECIMAL(5,2),
    opportunities_created INTEGER,
    opportunities_closed INTEGER,
    win_rate DECIMAL(5,2),
    at_risk_reps INTEGER,
    total_quota_risk DECIMAL(15,2),
    top_coaching_priority VARCHAR(255),
    key_insights TEXT,
    summary TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_briefs_manager ON executive_briefs(manager_id);
CREATE INDEX idx_briefs_date ON executive_briefs(brief_date);
CREATE INDEX idx_briefs_period ON executive_briefs(brief_period);

COMMENT ON TABLE executive_briefs IS 'Weekly executive summaries for sales managers';

-- ============================================================================
-- SIMULATION & WHAT-IF ANALYSIS
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Simulation Results Table
-- What-if scenario simulation results
-- ----------------------------------------------------------------------------
CREATE TABLE simulation_results (
    simulation_id UUID PRIMARY KEY DEFAULT GENERATE_UNIQUE(),
    rep_id UUID NOT NULL REFERENCES sales_reps(rep_id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    simulation_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    baseline_risk_score INTEGER,
    baseline_forecast DECIMAL(15,2),
    baseline_attainment_percent DECIMAL(5,2),
    additional_opportunities INTEGER,
    additional_meetings INTEGER,
    additional_accounts_touched INTEGER,
    simulated_risk_score INTEGER,
    simulated_forecast DECIMAL(15,2),
    simulated_attainment_percent DECIMAL(5,2),
    forecast_delta DECIMAL(15,2),
    risk_delta INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sim_rep ON simulation_results(rep_id);
CREATE INDEX idx_sim_user ON simulation_results(user_id);
CREATE INDEX idx_sim_date ON simulation_results(simulation_date);

COMMENT ON TABLE simulation_results IS 'What-if scenario simulation results for managers';

-- ============================================================================
-- AUDIT & LOGGING
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Audit Log Table
-- System audit trail for compliance
-- ----------------------------------------------------------------------------
CREATE TABLE audit_log (
    audit_id UUID PRIMARY KEY DEFAULT GENERATE_UNIQUE(),
    user_id UUID REFERENCES users(user_id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100),
    entity_id UUID,
    old_values CLOB,  -- JSON
    new_values CLOB,  -- JSON
    ip_address VARCHAR(45),
    user_agent VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_user ON audit_log(user_id);
CREATE INDEX idx_audit_action ON audit_log(action);
CREATE INDEX idx_audit_entity ON audit_log(entity_type, entity_id);
CREATE INDEX idx_audit_created ON audit_log(created_at);

COMMENT ON TABLE audit_log IS 'System audit trail for compliance and security';

-- ============================================================================
-- MATERIALIZED VIEWS FOR PERFORMANCE
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Rep Performance Summary View
-- Pre-aggregated rep performance metrics
-- ----------------------------------------------------------------------------
CREATE VIEW vw_rep_performance_summary AS
SELECT 
    sr.rep_id,
    sr.user_id,
    u.first_name || ' ' || u.last_name AS rep_name,
    u.email,
    sr.quota_amount,
    sr.performance_tier,
    ra.quota_risk_score,
    ra.risk_category,
    fs.projected_attainment,
    fs.projected_attainment_percent,
    tc.coverage_percentage,
    COUNT(DISTINCT o.opportunity_id) AS total_opportunities,
    SUM(CASE WHEN o.is_closed = FALSE THEN o.amount ELSE 0 END) AS pipeline_value,
    SUM(CASE WHEN o.is_won = TRUE THEN o.amount ELSE 0 END) AS closed_won_value
FROM sales_reps sr
JOIN users u ON sr.user_id = u.user_id
LEFT JOIN risk_assessments ra ON sr.rep_id = ra.rep_id 
    AND ra.assessment_date = (SELECT MAX(assessment_date) FROM risk_assessments WHERE rep_id = sr.rep_id)
LEFT JOIN forecast_snapshots fs ON sr.rep_id = fs.rep_id 
    AND fs.forecast_date = (SELECT MAX(forecast_date) FROM forecast_snapshots WHERE rep_id = sr.rep_id)
LEFT JOIN territory_coverage tc ON sr.rep_id = tc.rep_id 
    AND tc.coverage_date = (SELECT MAX(coverage_date) FROM territory_coverage WHERE rep_id = sr.rep_id)
LEFT JOIN opportunities o ON sr.user_id = o.owner_id
GROUP BY sr.rep_id, sr.user_id, u.first_name, u.last_name, u.email, sr.quota_amount, 
         sr.performance_tier, ra.quota_risk_score, ra.risk_category, 
         fs.projected_attainment, fs.projected_attainment_percent, tc.coverage_percentage;

COMMENT ON VIEW vw_rep_performance_summary IS 'Pre-aggregated rep performance metrics for dashboard';

-- ============================================================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- ============================================================================

-- Note: Db2 trigger syntax - adjust as needed for specific Db2 version

-- Update updated_at timestamp on row modification
-- (Repeat for each table with updated_at column)

-- ============================================================================
-- INITIAL DATA SEEDING
-- ============================================================================

-- IBM Product Catalog
INSERT INTO products (product_name, product_code, product_family, category, is_active) VALUES
('watsonx.ai', 'WX-AI-001', 'watsonx', 'AI/ML', TRUE),
('watsonx.data', 'WX-DATA-001', 'watsonx', 'Data Management', TRUE),
('watsonx Orchestrate', 'WX-ORCH-001', 'watsonx', 'Automation', TRUE),
('IBM DataStage', 'DS-001', 'Data Integration', 'ETL', TRUE),
('IBM Db2 Warehouse', 'DB2-WH-001', 'Database', 'Data Warehouse', TRUE),
('IBM Db2 on Cloud', 'DB2-CLOUD-001', 'Database', 'Cloud Database', TRUE),
('IBM Guardium', 'GUARD-001', 'Security', 'Data Security', TRUE),
('IBM Instana', 'INST-001', 'Observability', 'APM', TRUE),
('IBM Turbonomic', 'TURBO-001', 'Automation', 'Resource Optimization', TRUE),
('IBM Apptio', 'APPT-001', 'FinOps', 'Cost Management', TRUE),
('IBM Concert', 'CONC-001', 'AI Operations', 'AIOps', TRUE);

-- ============================================================================
-- PERFORMANCE OPTIMIZATION NOTES
-- ============================================================================

-- 1. Partitioning Strategy:
--    - Partition large tables (activities, opportunities, risk_assessments) by date
--    - Monthly partitions for activities (high volume)
--    - Quarterly partitions for assessments and forecasts

-- 2. Index Strategy:
--    - All foreign keys indexed
--    - Frequently filtered columns indexed
--    - Composite indexes for common query patterns

-- 3. Archival Strategy:
--    - Archive activities older than 2 years to watsonx.data
--    - Archive risk_assessments older than 1 year
--    - Keep current quarter + 4 quarters in Db2

-- 4. Statistics:
--    - Update statistics weekly on large tables
--    - Real-time statistics on frequently updated tables

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================

-- Made with Bob
