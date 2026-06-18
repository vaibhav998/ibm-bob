# Northstar Backend Architecture
## IBM Sales Pipeline & Coaching Intelligence Platform

**Document Version:** 1.0  
**Date:** June 18, 2026  
**Classification:** IBM Internal  
**Target Scale:** 50,000+ sales users

---

## Executive Summary

Northstar is an enterprise-grade AI-powered Sales Pipeline & Coaching Intelligence platform designed to proactively identify quota risk, diagnose root causes, and prioritize coaching actions before revenue is lost.

### Core Business Questions
1. **Will this rep hit quota?** → Risk Scoring Engine
2. **Why are they at risk?** → Diagnostic Engines
3. **What should the manager do next?** → Coaching Recommendation Engine

---

## 1. System Architecture Overview

### 1.1 Architecture Layers

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Existing)                       │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│              API Gateway (IBM API Connect)                   │
│  • Authentication (IBM Security Verify)                      │
│  • Rate Limiting • Routing • Versioning                      │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                  Microservices Layer                         │
│  User • Opportunity • Activity • Territory • Risk            │
│  Forecast • Coaching • Propensity • Copilot • Brief         │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│         Event Streaming (IBM Event Streams/Kafka)            │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                      Data Layer                              │
│  watsonx.data • Db2 Warehouse • PostgreSQL • Redis           │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                      AI/ML Layer                             │
│  watsonx.ai • watsonx Orchestrate                            │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│              Data Integration (IBM DataStage)                │
│  ORUM • SalesLoft • ISC/CRM • IBM Sales Data                 │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 Technology Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| API Gateway | IBM API Connect | API management |
| Auth | IBM Security Verify | SSO, OAuth 2.0 |
| Containers | Red Hat OpenShift | Kubernetes platform |
| Messaging | IBM Event Streams | Kafka-based streaming |
| Data Lake | watsonx.data | Raw data storage |
| Data Warehouse | Db2 Warehouse | Analytics |
| OLTP | PostgreSQL | Transactions |
| Cache | Redis | Performance |
| AI/ML | watsonx.ai | Foundation models |
| Agents | watsonx Orchestrate | Copilot framework |
| ETL | IBM DataStage | Data integration |
| Governance | IBM Knowledge Catalog | Data lineage |
| Matching | IBM Match 360 | Entity resolution |
| APM | Instana | Observability |
| Cost | Apptio | Cost intelligence |

---

## 2. Database Schema (PostgreSQL + Db2)

### Core Tables

**users** - User accounts and authentication
**managers** - Manager-specific data
**sales_reps** - Sales rep profiles and quotas
**territories** - Territory definitions
**accounts** - Customer accounts
**opportunities** - Sales opportunities
**activities** - Calls, emails, meetings
**meetings** - Meeting details
**sequences** - SalesLoft sequences
**products** - IBM product catalog
**installed_products** - Customer installations

### Intelligence Tables

**risk_assessments** - Quota risk scores
**forecast_snapshots** - Forecast projections
**opportunity_diagnostics** - Opp health analysis
**territory_coverage** - Territory metrics
**coaching_recommendations** - AI recommendations
**coaching_notes** - Manager coaching notes
**product_propensity_scores** - Product recommendations
**copilot_sessions** - Copilot interactions
**copilot_queries** - Query history
**executive_briefs** - Weekly summaries
**whatif_simulations** - Scenario planning

### Key Relationships

```
users (1) ──> (N) sales_reps
managers (1) ──> (N) sales_reps
sales_reps (1) ──> (N) opportunities
accounts (1) ──> (N) opportunities
sales_reps (1) ──> (N) activities
opportunities (1) ──> (N) activities
sales_reps (1) ──> (N) risk_assessments
sales_reps (1) ──> (N) forecast_snapshots
accounts (1) ──> (N) product_propensity_scores
```

---

## 3. Microservices Architecture

### 3.1 Service Catalog

| Service | Port | Tech | Database |
|---------|------|------|----------|
| User Service | 8001 | Node.js | PostgreSQL |
| Opportunity Intelligence | 8002 | Python | Db2 |
| Activity Intelligence | 8003 | Python | Db2 |
| Territory Intelligence | 8004 | Python | Db2 |
| Quota Risk Engine | 8005 | Python | Db2 |
| Forecast Engine | 8006 | Python | Db2 |
| Coaching Recommendation | 8007 | Python | PostgreSQL |
| Product Propensity | 8008 | Python | Db2 |
| Manager Copilot | 8009 | Python | PostgreSQL |
| Executive Brief | 8010 | Node.js | Db2 |
| What-If Simulator | 8011 | Python | PostgreSQL |
| Data Ingestion | 8012 | Python | All |

### 3.2 Opportunity Intelligence Service

**Purpose:** Analyze opportunity health, detect stagnation, calculate win probability

**Core Algorithm - Win Probability:**
```python
win_probability = (
    stage_score * 0.30 +
    velocity_score * 0.25 +
    activity_score * 0.20 +
    engagement_score * 0.15 +
    competitive_score * 0.10
)
```

**Stagnation Detection:**
- Opportunity in stage > 1.5x expected duration = STALLED
- No activity in 14+ days = AT RISK
- Close date slipped 2+ times = SLIPPING

**Outputs:**
- Win probability (0-100)
- Health score (0-100)
- Risk flags (stalled, slipping, aging)
- Recommended actions

### 3.3 Activity Intelligence Service

**Purpose:** Analyze rep activity patterns, identify skill vs effort issues

**Key Metrics:**
- Calls per day
- Connect rate
- Meetings created
- Meeting-to-opportunity conversion
- Email reply rate
- Sequence performance

**Diagnostic Logic:**
```python
if calls_per_day < team_avg * 0.7:
    issue = "ACTIVITY_VOLUME"
elif connect_rate < team_avg * 0.7:
    issue = "CONNECT_SKILL"
elif meeting_conversion < team_avg * 0.7:
    issue = "CONVERSION_SKILL"
else:
    issue = "NONE"
```

**Example Output:**
"Jordan generates sufficient call volume (18/day) but meeting conversion (28%) is below team average (35%). Focus coaching on discovery questions and value proposition."

### 3.4 Territory Intelligence Service

**Purpose:** Analyze territory coverage, identify whitespace

**Metrics:**
- accounts_assigned
- accounts_touched
- accounts_untouched
- coverage_percentage = touched / assigned
- whitespace_revenue_potential

**Diagnostic Thresholds:**
- coverage < 40% = POOR
- coverage 40-60% = FAIR
- coverage 60-80% = GOOD
- coverage > 80% = EXCELLENT

**Whitespace Analysis:**
- Identify untouched accounts with high propensity scores
- Calculate potential revenue in whitespace
- Recommend top 10 accounts to engage

### 3.5 Quota Risk Engine

**Purpose:** Calculate comprehensive quota risk score

**Formula:**
```python
risk_score = (
    pipeline_coverage_score * 0.30 +
    opportunity_creation_score * 0.25 +
    meeting_activity_score * 0.20 +
    account_coverage_score * 0.15 +
    conversion_rate_score * 0.10
)
```

**Component Calculations:**

**Pipeline Coverage Score:**
```python
coverage_ratio = current_pipeline / quota
if coverage_ratio >= 3.5:
    score = 100
elif coverage_ratio >= 3.0:
    score = 80
elif coverage_ratio >= 2.5:
    score = 60
else:
    score = max(0, coverage_ratio / 3.5 * 100)
```

**Risk Categories:**
- 0-30: HEALTHY (green)
- 31-60: WATCH (yellow)
- 61-100: HIGH_RISK (red)

**Output:**
```json
{
  "rep_id": "uuid",
  "risk_score": 72,
  "risk_category": "HIGH_RISK",
  "pipeline_coverage_score": 45,
  "opportunity_creation_score": 30,
  "meeting_activity_score": 55,
  "account_coverage_score": 40,
  "conversion_rate_score": 70,
  "primary_risk_factor": "OPPORTUNITY_CREATION",
  "secondary_risk_factor": "ACCOUNT_COVERAGE"
}
```

### 3.6 Forecast Engine

**Purpose:** Predict quota attainment using ML models

**Inputs:**
- Current pipeline
- Historical conversion rates
- Stage velocity
- Activity trends
- Territory coverage
- Seasonality factors

**Model Architecture:**
```python
# Ensemble model combining:
# 1. Linear regression (baseline)
# 2. Random forest (non-linear patterns)
# 3. Time series (seasonality)
# 4. watsonx.ai (advanced patterns)

projected_attainment = (
    linear_model.predict() * 0.25 +
    rf_model.predict() * 0.25 +
    ts_model.predict() * 0.20 +
    watsonx_model.predict() * 0.30
)
```

**Confidence Calculation:**
```python
confidence = min(100, (
    data_quality_score * 0.30 +
    historical_accuracy * 0.30 +
    pipeline_stability * 0.20 +
    activity_consistency * 0.20
))
```

**Output:**
```json
{
  "rep_id": "uuid",
  "forecast_date": "2026-06-18",
  "forecast_period": "quarter_end",
  "projected_attainment": 182000,
  "projected_attainment_percentage": 75.8,
  "confidence_score": 78,
  "trend_direction": "declining",
  "forecast_range": {
    "low": 165000,
    "high": 198000
  }
}
```

### 3.7 Coaching Recommendation Engine

**Purpose:** Generate prioritized coaching recommendations

**Business Rules Engine:**

**Rule 1: Low Coverage**
```python
if coverage_percentage < 40:
    return Recommendation(
        priority=1,
        category="TERRITORY",
        title="Increase account coverage",
        reason=f"Only {coverage_percentage}% of territory engaged",
        action=f"Touch {recommended_accounts} additional accounts this week",
        estimated_impact="HIGH"
    )
```

**Rule 2: Low Opportunity Creation**
```python
if opportunities_created < team_average:
    gap = team_average - opportunities_created
    meetings_needed = gap / conversion_rate
    return Recommendation(
        priority=1,
        category="ACTIVITY",
        title="Increase opportunity creation",
        reason=f"Created {opportunities_created} vs team avg {team_average}",
        action=f"Generate {meetings_needed} additional meetings",
        estimated_impact="CRITICAL"
    )
```

**Rule 3: Stalled Opportunities**
```python
stalled_opps = get_stalled_opportunities(rep_id)
if len(stalled_opps) > 2:
    return Recommendation(
        priority=2,
        category="PIPELINE",
        title="Advance stalled opportunities",
        reason=f"{len(stalled_opps)} opportunities stalled 21+ days",
        action="Review and advance top 3 stalled deals",
        estimated_impact="MEDIUM"
    )
```

**Prioritization Logic:**
```python
priority_score = (
    revenue_impact * 0.40 +
    urgency * 0.30 +
    feasibility * 0.20 +
    manager_preference * 0.10
)
```

### 3.8 Product Propensity Engine

**Purpose:** Recommend IBM products for each account

**IBM Product Catalog:**
- watsonx.ai
- watsonx.data
- watsonx Orchestrate
- DataStage
- Db2
- Guardium
- Instana
- Turbonomic
- Apptio
- Concert

**Propensity Model:**
```python
propensity_score = (
    installed_product_affinity * 0.25 +
    industry_fit * 0.20 +
    company_size_fit * 0.15 +
    historical_pattern * 0.20 +
    competitive_intel * 0.10 +
    technology_stack_fit * 0.10
)
```

**Cross-Sell Logic:**
```python
# Example: Db2 customer → watsonx.data
if has_product("Db2") and not has_product("watsonx.data"):
    propensity_score += 25  # Strong affinity
    talking_points = [
        "Extend Db2 with lakehouse capabilities",
        "Reduce data warehouse costs by 40%",
        "Enable AI/ML on historical data"
    ]
```

**Output:**
```json
{
  "account_id": "uuid",
  "account_name": "Acme Corp",
  "recommendations": [
    {
      "product": "watsonx.data",
      "propensity_score": 83,
      "cross_sell_score": 90,
      "reasoning": "Existing Db2 customer, high data volume",
      "talking_points": [
        "Extend Db2 with lakehouse",
        "40% cost reduction",
        "Enable AI/ML workloads"
      ],
      "competitive_intel": "Currently using Azure Synapse"
    }
  ]
}
```

### 3.9 Manager Copilot Service

**Purpose:** AI-powered assistant for sales managers

**Architecture: RAG (Retrieval-Augmented Generation)**

```
User Query
    ↓
Intent Classification (watsonx.ai)
    ↓
Context Retrieval (Vector DB)
    ├─ Pipeline data
    ├─ Activity data
    ├─ Risk assessments
    ├─ Recommendations
    └─ Historical patterns
    ↓
Prompt Construction
    ↓
LLM Generation (watsonx.ai)
    ↓
Response + Citations
```

**Example Queries:**

**Query 1:** "Why is Jordan behind quota?"
```python
# Retrieval
context = {
    "risk_assessment": get_risk_assessment("jordan"),
    "pipeline": get_pipeline_data("jordan"),
    "activities": get_activity_metrics("jordan"),
    "territory": get_territory_coverage("jordan"),
    "opportunities": get_opportunity_diagnostics("jordan")
}

# Prompt
prompt = f"""
Based on the following data, explain why Jordan is behind quota:
{context}

Provide:
1. Primary root cause
2. Supporting evidence
3. Recommended coaching actions
"""

# Response
"Jordan is behind quota primarily due to low account coverage (26% vs team avg 65%). 
This has resulted in only 4 opportunities created vs team average of 7. 
Secondary issue is meeting-to-opportunity conversion at 28% vs team average 35%.

Recommended actions:
1. Touch 15 additional accounts this week
2. Coach on discovery questions to improve conversion
3. Review account prioritization strategy"
```

**Query 2:** "Which accounts should I target for watsonx.ai?"
```python
# Retrieval
propensity_scores = get_product_propensity("watsonx.ai", min_score=70)
accounts = get_account_details(propensity_scores.account_ids)

# Response with structured data
{
  "recommendations": [
    {
      "account": "Acme Corp",
      "propensity_score": 85,
      "reasoning": "Azure OpenAI customer, high AI spend",
      "owner": "Priya Shah",
      "next_action": "Schedule AI strategy discussion"
    }
  ]
}
```

**watsonx Orchestrate Integration:**
```python
# Multi-step reasoning
orchestrate.add_tool("get_risk_assessment")
orchestrate.add_tool("get_pipeline_data")
orchestrate.add_tool("get_recommendations")
orchestrate.add_tool("create_coaching_note")

# Agent can chain multiple tools
response = orchestrate.run(
    query="Analyze Jordan's risk and create a coaching plan",
    tools=["get_risk_assessment", "get_recommendations", "create_coaching_note"]
)
```

### 3.10 Executive Brief Service

**Purpose:** Generate weekly manager summaries

**Data Aggregation:**
```python
def generate_executive_brief(manager_id, week):
    team = get_team_members(manager_id)
    
    # Aggregate metrics
    metrics = {
        "team_quota": sum(rep.quota for rep in team),
        "team_pipeline": sum(rep.pipeline for rep in team),
        "team_attainment": calculate_attainment(team),
        "reps_at_risk": count_at_risk(team),
        "quota_risk": sum_quota_risk(team),
        "opportunities_created": sum_opportunities(team, week),
        "win_rate": calculate_win_rate(team, week)
    }
    
    # Generate insights
    insights = generate_insights(metrics, team)
    
    # Prioritize coaching
    coaching_priorities = prioritize_coaching(team)
    
    return ExecutiveBrief(
        metrics=metrics,
        insights=insights,
        coaching_priorities=coaching_priorities,
        narrative=generate_narrative(metrics, insights)
    )
```

**Example Output:**
```
EXECUTIVE BRIEF - Week of June 18, 2026
Manager: Alex Morgan

TEAM PERFORMANCE
• Team pacing at 82% of quota ($1.37M / $1.67M)
• Pipeline coverage: 3.2× (target 3.5×)
• 3 reps at risk representing $278K quota gap

KEY INSIGHTS
1. Opportunity creation declined 14% MoM
   - Team created 43 opportunities vs 50 last month
   - Primary driver: reduced meeting activity
   
2. Jordan Lee accounts for 40% of team risk
   - Only 26% territory coverage
   - 4 opportunities vs team avg 7
   
3. Maya Chen has strong pipeline but creation down 38%
   - Future quarters at risk without intervention

COACHING PRIORITIES
1. Jordan Lee - Territory coverage (URGENT)
2. Noah Williams - Activity volume (URGENT)
3. Maya Chen - Opportunity creation (HIGH)

RECOMMENDED ACTIONS
• Hold territory review with Jordan this week
• Implement daily activity tracking for Noah
• Review Maya's account prioritization
```

### 3.11 What-If Simulator Service

**Purpose:** Scenario planning for managers

**Simulation Engine:**
```python
def simulate_scenario(rep_id, inputs):
    """
    Simulate impact of changes
    """
    baseline = get_current_state(rep_id)
    
    # Apply changes
    projected_state = {
        "pipeline": baseline.pipeline,
        "opportunities": baseline.opportunities + inputs.additional_opportunities,
        "meetings": baseline.meetings + inputs.additional_meetings,
        "accounts_touched": baseline.accounts_touched + inputs.additional_accounts
    }
    
    # Recalculate metrics
    projected_pipeline = calculate_projected_pipeline(
        projected_state.opportunities,
        baseline.avg_deal_size
    )
    
    projected_risk = calculate_risk_score(projected_state)
    projected_forecast = calculate_forecast(projected_state)
    
    # Calculate deltas
    return {
        "baseline": baseline,
        "projected": projected_state,
        "deltas": {
            "pipeline_delta": projected_pipeline - baseline.pipeline,
            "risk_delta": projected_risk - baseline.risk_score,
            "forecast_delta": projected_forecast - baseline.forecast
        },
        "attainment_improvement": calculate_attainment_improvement(
            baseline, projected_state
        )
    }
```

**Example Simulation:**
```json
{
  "inputs": {
    "additional_opportunities": 3,
    "additional_meetings": 10,
    "additional_accounts_touched": 15
  },
  "outputs": {
    "baseline_pipeline": 182000,
    "projected_pipeline": 218000,
    "pipeline_delta": 36000,
    "baseline_risk_score": 72,
    "projected_risk_score": 48,
    "risk_delta": -24,
    "baseline_attainment": 75.8,
    "projected_attainment": 90.8,
    "attainment_improvement": 15.0
  }
}
```

---

## 4. API Design

### 4.1 REST API Specification

**Base URL:** `https://api.northstar.ibm.com/v1`

**Authentication:** OAuth 2.0 Bearer Token

### 4.2 Core Endpoints

#### Dashboard
```
GET /dashboard
Response: {
  "team_metrics": {...},
  "kpis": [...],
  "at_risk_reps": [...],
  "insights": [...]
}
```

#### Sales Reps
```
GET /reps
GET /reps/{repId}
GET /reps/{repId}/risk
GET /reps/{repId}/forecast
GET /reps/{repId}/recommendations
GET /reps/{repId}/opportunities
GET /reps/{repId}/activities
GET /reps/{repId}/territory-coverage
```

#### Opportunities
```
GET /opportunities
GET /opportunities/{oppId}
GET /opportunities/{oppId}/health
GET /opportunities/{oppId}/diagnostics
GET /reps/{repId}/opportunities/stalled
GET /reps/{repId}/opportunities/at-risk
```

#### Activities
```
GET /reps/{repId}/activities
GET /reps/{repId}/activity-metrics
GET /reps/{repId}/meetings
GET /reps/{repId}/sequences
```

#### Coaching
```
GET /reps/{repId}/coaching-recommendations
POST /coaching-notes
GET /coaching-notes/{repId}
PUT /coaching-recommendations/{recId}/status
```

#### Copilot
```
POST /copilot/query
Request: {
  "query": "Why is Jordan behind quota?",
  "context": {...}
}
Response: {
  "answer": "...",
  "sources": [...],
  "confidence": 0.85
}
```

#### Simulation
```
POST /simulate
Request: {
  "rep_id": "uuid",
  "additional_opportunities": 3,
  "additional_meetings": 10,
  "additional_accounts_touched": 15
}
Response: {
  "baseline": {...},
  "projected": {...},
  "deltas": {...}
}
```

#### Executive Brief
```
GET /executive-brief/{managerId}
GET /executive-brief/{managerId}/weekly
```

---

## 5. IBM Data & AI Integration

### 5.1 Data Integration (IBM DataStage)

**ETL Pipelines:**

**ORUM Integration:**
```
Source: ORUM API
Frequency: Real-time (webhook) + Hourly batch
Data: Calls, conversations, connect rates, meeting creation
Target: watsonx.data → Db2 Warehouse
Transformations:
  - Deduplicate calls
  - Calculate connect rates
  - Aggregate by rep/day
  - Match to accounts
```

**SalesLoft Integration:**
```
Source: SalesLoft API
Frequency: Hourly
Data: Emails, sequences, replies, meetings
Target: watsonx.data → Db2 Warehouse
Transformations:
  - Parse email metadata
  - Calculate engagement metrics
  - Track sequence performance
  - Match to opportunities
```

**ISC/CRM Integration:**
```
Source: ISC/Salesforce API
Frequency: Every 15 minutes
Data: Opportunities, accounts, pipeline, stages
Target: PostgreSQL (OLTP) + Db2 (OLAP)
Transformations:
  - Normalize stage names
  - Calculate stage duration
  - Detect stage changes
  - Update forecast categories
```

**IBM Sales Data Integration:**
```
Source: IBM internal systems
Frequency: Daily
Data: Products, territories, quotas, historical wins
Target: PostgreSQL + Db2
Transformations:
  - Match products to opportunities
  - Calculate territory metrics
  - Update quota assignments
```

### 5.2 Data Governance (IBM Knowledge Catalog)

**Data Lineage:**
- Track data flow from source to dashboard
- Document transformations
- Maintain data quality metrics

**Data Quality Rules:**
- Completeness checks
- Accuracy validation
- Timeliness monitoring
- Consistency verification

### 5.3 Entity Resolution (IBM Match 360)

**Account Matching:**
- Match accounts across ORUM, SalesLoft, CRM
- Resolve company name variations
- Link subsidiaries to parent companies
- Maintain golden record

**Contact Matching:**
- Match contacts across systems
- Resolve email variations
- Link to accounts
- Track job changes

### 5.4 AI/ML (watsonx.ai)

**Foundation Models:**
- granite-13b-chat-v2 (Copilot responses)
- granite-13b-instruct-v2 (Classification)
- llama-2-70b-chat (Complex reasoning)

**Fine-tuned Models:**
- Risk prediction model
- Forecast model
- Propensity scoring model
- Recommendation ranking model

**Model Training Pipeline:**
```
Historical Data (watsonx.data)
    ↓
Feature Engineering (DataStage)
    ↓
Model Training (watsonx.ai)
    ↓
Model Evaluation
    ↓
Model Deployment (OpenShift)
    ↓
Model Monitoring (Instana)
```

### 5.5 Agent Framework (watsonx Orchestrate)

**Copilot Agent Configuration:**
```yaml
agent:
  name: "Northstar Manager Copilot"
  model: "granite-13b-chat-v2"
  tools:
    - get_risk_assessment
    - get_pipeline_data
    - get_activity_metrics
    - get_territory_coverage
    - get_recommendations
    - get_forecast
    - get_propensity_scores
    - create_coaching_note
  retrieval:
    vector_db: "watsonx.data"
    embedding_model: "all-MiniLM-L6-v2"
    top_k: 5
```

### 5.6 Observability (Instana)

**Monitoring:**
- Service health
- API latency
- Error rates
- Database performance
- Model inference time

**Distributed Tracing:**
- Request flow across services
- Bottleneck identification
- Dependency mapping

**Alerts:**
- Service downtime
- High error rates
- Slow queries
- Model drift

### 5.7 Cost Intelligence (Apptio)

**Cost Tracking:**
- Compute costs by service
- Storage costs by data source
- AI/ML inference costs
- Data transfer costs

**Optimization:**
- Right-size containers
- Optimize queries
- Cache frequently accessed data
- Batch processing where possible

---

## 6. Data Pipeline Architecture

### 6.1 Real-time Pipeline

```
ORUM/SalesLoft Webhooks
    ↓
IBM Event Streams (Kafka)
    ↓
Stream Processors
    ├─ Activity Intelligence Service
    ├─ Opportunity Intelligence Service
    └─ Territory Intelligence Service
    ↓
PostgreSQL (OLTP)
    ↓
Redis Cache
    ↓
API Gateway
    ↓
Frontend
```

### 6.2 Batch Pipeline

```
Source Systems (ISC, IBM Sales Data)
    ↓
IBM DataStage (ETL)
    ↓
watsonx.data (Data Lake)
    ↓
Db2 Warehouse (OLAP)
    ├─ Aggregations
    ├─ Historical analysis
    └─ ML feature store
    ↓
Intelligence Services
    ├─ Risk Engine
    ├─ Forecast Engine
    ├─ Propensity Engine
    └─ Recommendation Engine
    ↓
PostgreSQL (Results)
    ↓
API Gateway
```

### 6.3 ML Pipeline

```
Historical Data (watsonx.data)
    ↓
Feature Engineering (Spark on OpenShift)
    ↓
Model Training (watsonx.ai)
    ↓
Model Registry
    ↓
Model Deployment (OpenShift)
    ↓
Inference Service
    ↓
Prediction Storage (PostgreSQL)
    ↓
API Gateway
```

---

## 7. Security & Compliance

### 7.1 Authentication & Authorization

**IBM Security Verify:**
- SSO with IBM w3id
- OAuth 2.0 / OpenID Connect
- MFA enforcement
- Session management

**RBAC Roles:**
- Sales Rep: View own data
- Manager: View team data
- Director: View org data
- VP: View all data
- Admin: System administration

### 7.2 Data Security

**Encryption:**
- At rest: AES-256
- In transit: TLS 1.3
- Database: Transparent Data Encryption

**Data Masking:**
- PII masking in non-prod
- Sensitive field encryption
- Audit logging

### 7.3 Compliance

**GDPR:**
- Data retention policies
- Right to deletion
- Data portability
- Consent management

**SOC 2:**
- Access controls
- Audit trails
- Incident response
- Change management

---

## 8. Scalability & Performance

### 8.1 Horizontal Scaling

**Microservices:**
- Auto-scaling based on CPU/memory
- Min 2 replicas per service
- Max 20 replicas per service
- Load balancing via OpenShift

**Databases:**
- PostgreSQL: Read replicas
- Db2: Partitioning by date
- Redis: Cluster mode

### 8.2 Performance Targets

| Metric | Target |
|--------|--------|
| API Response Time (p95) | < 500ms |
| Dashboard Load Time | < 2s |
| Copilot Response Time | < 3s |
| Risk Score Calculation | < 1s |
| Forecast Generation | < 5s |
| Concurrent Users | 50,000+ |
| Requests per Second | 10,000+ |

### 8.3 Caching Strategy

**Redis Cache:**
- User sessions (TTL: 24h)
- Dashboard data (TTL: 5min)
- Risk scores (TTL: 1h)
- Forecasts (TTL: 1h)
- Propensity scores (TTL: 24h)

**CDN:**
- Static assets
- API responses (where appropriate)

---

## 9. Implementation Plan

### Phase 1: Foundation (Months 1-3)

**Week 1-4: Infrastructure**
- Set up OpenShift cluster
- Configure IBM API Connect
- Set up PostgreSQL, Db2, Redis
- Configure IBM Security Verify

**Week 5-8: Core Services**
- User Service
- Data Ingestion Service
- Basic API Gateway

**Week 9-12: Data Integration**
- ORUM integration
- SalesLoft integration
- ISC/CRM integration
- IBM Sales Data integration

### Phase 2: Intelligence (Months 4-6)

**Week 13-16: Diagnostic Services**
- Opportunity Intelligence Service
- Activity Intelligence Service
- Territory Intelligence Service

**Week 17-20: Scoring Engines**
- Quota Risk Engine
- Forecast Engine

**Week 21-24: Recommendations**
- Coaching Recommendation Engine
- Product Propensity Engine

### Phase 3: AI/ML (Months 7-9)

**Week 25-28: watsonx.ai Integration**
- Model training pipeline
- Risk prediction model
- Forecast model
- Propensity model

**Week 29-32: Copilot**
- Manager Copilot Service
- RAG implementation
- watsonx Orchestrate integration

**Week 33-36: Advanced Features**
- Executive Brief Service
- What-If Simulator
- Advanced analytics

### Phase 4: Production (Months 10-12)

**Week 37-40: Testing**
- Load testing
- Security testing
- UAT with pilot users

**Week 41-44: Rollout**
- Pilot (100 users)
- Phased rollout (1000 → 10000 → 50000)
- Monitoring and optimization

**Week 45-48: Optimization**
- Performance tuning
- Cost optimization
- Feature enhancements

---

## 10. Success Metrics

### Business Metrics
- Quota attainment improvement: +10%
- Early risk detection: 30 days advance warning
- Coaching effectiveness: +15% rep performance
- Manager time savings: 5 hours/week

### Technical Metrics
- System uptime: 99.9%
- API response time: < 500ms (p95)
- Data freshness: < 15 minutes
- Model accuracy: > 85%

### Adoption Metrics
- Daily active users: > 80%
- Copilot queries per user: > 5/week
- Recommendation acceptance rate: > 60%
- User satisfaction: > 4.5/5

---

## Appendix A: API Examples

### Get Rep Risk Assessment
```bash
GET /api/v1/reps/jordan-lee-uuid/risk

Response:
{
  "rep_id": "jordan-lee-uuid",
  "rep_name": "Jordan Lee",
  "assessment_date": "2026-06-18",
  "risk_score": 72,
  "risk_category": "HIGH_RISK",
  "components": {
    "pipeline_coverage": 45,
    "opportunity_creation": 30,
    "meeting_activity": 55,
    "account_coverage": 40,
    "conversion_rate": 70
  },
  "metrics": {
    "current_pipeline": 182000,
    "quota": 240000,
    "pipeline_gap": -58000,
    "coverage_ratio": 2.6,
    "opportunities_created": 4,
    "team_average_opportunities": 7
  },
  "primary_risk_factor": "OPPORTUNITY_CREATION",
  "secondary_risk_factor": "ACCOUNT_COVERAGE"
}
```

### Copilot Query
```bash
POST /api/v1/copilot/query

Request:
{
  "query": "Why is Jordan behind quota?",
  "user_id": "manager-uuid"
}

Response:
{
  "answer": "Jordan is behind quota primarily due to low account coverage (26% vs team avg 65%). This has resulted in only 4 opportunities created vs team average of 7. Secondary issue is meeting-to-opportunity conversion at 28% vs team average 35%.",
  "recommendations": [
    {
      "priority": 1,
      "action": "Touch 15 additional accounts this week"
    },
    {
      "priority": 2,
      "action": "Coach on discovery questions to improve conversion"
    }
  ],
  "sources": [
    {
      "type": "risk_assessment",
      "date": "2026-06-18"
    },
    {
      "type": "territory_coverage",
      "date": "2026-06-18"
    }
  ],
  "confidence": 0.92
}
```

---

**Document End**

For questions or clarifications, contact the Northstar Architecture Team.
