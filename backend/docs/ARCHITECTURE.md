# Northstar Backend Architecture
## IBM AI-Powered Sales Pipeline & Coaching Intelligence Platform

**Version:** 1.0  
**Last Updated:** 2026-06-18  
**Target Scale:** 50,000+ sales users  
**Architecture Type:** Event-Driven Microservices with IBM Data & AI Stack

---

## 1. EXECUTIVE SUMMARY

Northstar is an enterprise-grade AI-powered platform that proactively identifies quota risk, diagnoses root causes, and prioritizes coaching actions for IBM sales managers. The backend architecture leverages IBM's Data & AI portfolio to deliver real-time intelligence across 50,000+ sales users.

### Core Business Questions Answered:
1. **Will this rep hit quota?** → Quota Risk Engine
2. **Why are they at risk?** → Diagnostic Services (Activity, Opportunity, Territory)
3. **What should the manager do next?** → Coaching Recommendation Engine

---

## 2. SYSTEM ARCHITECTURE OVERVIEW

### 2.1 Architecture Principles

- **Event-Driven:** Asynchronous processing for scalability
- **Microservices:** Independent, deployable services
- **API-First:** RESTful APIs with OpenAPI 3.0 specification
- **IBM Native:** Built on IBM Data & AI stack
- **Real-Time:** Sub-second response times for critical paths
- **Scalable:** Horizontal scaling to 50K+ users
- **Observable:** Full instrumentation with Instana
- **Secure:** IBM IAM integration, encryption at rest/transit

### 2.2 High-Level Architecture Layers

```
┌─────────────────────────────────────────────────────────────────┐
│                     PRESENTATION LAYER                          │
│                    (Existing Frontend)                          │
└─────────────────────────────────────────────────────────────────┘
                              ↓ HTTPS/REST
┌─────────────────────────────────────────────────────────────────┐
│                      API GATEWAY LAYER                          │
│              IBM API Connect / Kong Gateway                     │
│         (Rate Limiting, Auth, Routing, Caching)                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                   MICROSERVICES LAYER                           │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐           │
│  │ User Service │ │ Opportunity  │ │  Activity    │           │
│  │              │ │ Intelligence │ │ Intelligence │           │
│  └──────────────┘ └──────────────┘ └──────────────┘           │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐           │
│  │  Territory   │ │ Quota Risk   │ │  Forecast    │           │
│  │ Intelligence │ │    Engine    │ │   Engine     │           │
│  └──────────────┘ └──────────────┘ └──────────────┘           │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐           │
│  │   Coaching   │ │   Product    │ │   Manager    │           │
│  │Recommendation│ │  Propensity  │ │   Copilot    │           │
│  └──────────────┘ └──────────────┘ └──────────────┘           │
│  ┌──────────────┐ ┌──────────────┐                             │
│  │  Executive   │ │   What-If    │                             │
│  │    Brief     │ │  Simulator   │                             │
│  └──────────────┘ └──────────────┘                             │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    EVENT BUS / MESSAGE QUEUE                    │
│              IBM MQ / Apache Kafka on OpenShift                 │
│         (Async Communication, Event Sourcing, CQRS)             │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      DATA LAYER                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              watsonx.data (Lakehouse)                    │  │
│  │         (Raw Data, Historical Analytics)                 │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Db2 Warehouse on Cloud                      │  │
│  │    (Transactional Data, Operational Analytics)           │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Redis Enterprise (Cache)                    │  │
│  │         (Session, Real-time Scores, Leaderboards)        │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                   IBM DATA & AI INTEGRATION                     │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐           │
│  │   DataStage  │ │   Knowledge  │ │  Match 360   │           │
│  │ (ETL/ELT)    │ │   Catalog    │ │ (MDM/Entity  │           │
│  │              │ │ (Governance) │ │  Resolution) │           │
│  └──────────────┘ └──────────────┘ └──────────────┘           │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐           │
│  │  watsonx.ai  │ │  watsonx     │ │   Instana    │           │
│  │ (LLM/ML)     │ │ Orchestrate  │ │(Observability│           │
│  │              │ │  (Agents)    │ │              │           │
│  └──────────────┘ └──────────────┘ └──────────────┘           │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    EXTERNAL DATA SOURCES                        │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐           │
│  │     ORUM     │ │  SalesLoft   │ │   ISC/CRM    │           │
│  │  (Call Data) │ │(Email/Seq)   │ │ (Pipeline)   │           │
│  └──────────────┘ └──────────────┘ └──────────────┘           │
│  ┌──────────────┐                                               │
│  │ IBM Sales    │                                               │
│  │     Data     │                                               │
│  └──────────────┘                                               │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. MICROSERVICES ARCHITECTURE

### 3.1 Service Catalog

| Service | Port | Technology | Purpose | SLA |
|---------|------|------------|---------|-----|
| User Service | 8001 | Python/FastAPI | User/Manager/Permission Management | 99.9% |
| Opportunity Intelligence | 8002 | Python/FastAPI | Pipeline Health, Deal Scoring | 99.95% |
| Activity Intelligence | 8003 | Python/FastAPI | Call/Email/Meeting Analytics | 99.9% |
| Territory Intelligence | 8004 | Python/FastAPI | Coverage, Whitespace Analysis | 99.9% |
| Quota Risk Engine | 8005 | Python/FastAPI | Risk Scoring, Alerting | 99.99% |
| Forecast Engine | 8006 | Python/FastAPI | Attainment Prediction | 99.95% |
| Coaching Recommendation | 8007 | Python/FastAPI | Action Prioritization | 99.9% |
| Product Propensity | 8008 | Python/FastAPI | Cross-sell/Upsell Scoring | 99.9% |
| Manager Copilot | 8009 | Python/FastAPI | AI Assistant (RAG) | 99.95% |
| Executive Brief | 8010 | Python/FastAPI | Summary Generation | 99.5% |
| What-If Simulator | 8011 | Python/FastAPI | Scenario Planning | 99.5% |
| Data Ingestion | 8012 | Python/FastAPI | ETL Orchestration | 99.9% |

### 3.2 Service Communication Patterns

**Synchronous (REST):**
- User Service ← All Services (Auth/User Lookup)
- API Gateway → All Services (Client Requests)

**Asynchronous (Event-Driven):**
- Data Ingestion → Event Bus → All Intelligence Services
- Opportunity Intelligence → Event Bus → Risk Engine
- Activity Intelligence → Event Bus → Risk Engine
- Territory Intelligence → Event Bus → Risk Engine
- Risk Engine → Event Bus → Coaching Recommendation

**Event Types:**
```
opportunity.created
opportunity.updated
opportunity.stage_changed
activity.call_logged
activity.email_sent
activity.meeting_created
territory.account_engaged
risk.score_updated
forecast.generated
recommendation.created
```

---

## 4. DATA ARCHITECTURE

### 4.1 Storage Strategy

**Db2 Warehouse (Primary Operational Store)**
- User data, sales reps, managers
- Opportunities, accounts, territories
- Activities, meetings
- Risk assessments, forecasts
- Coaching recommendations
- Real-time operational queries

**watsonx.data (Lakehouse)**
- Historical data (3+ years)
- Raw data from external sources
- ML training datasets
- Analytics workloads
- Data science exploration

**Redis Enterprise (Cache)**
- Session management
- Real-time risk scores
- Leaderboards
- API response caching
- Rate limiting counters

### 4.2 Data Flow

```
External Sources → DataStage → watsonx.data (Raw) → DataStage → Db2 (Curated)
                                      ↓
                              ML Training Data → watsonx.ai
                                      ↓
                              Microservices → Redis (Cache)
```

---

## 5. IBM DATA & AI INTEGRATION

### 5.1 IBM DataStage (ETL/ELT)

**Purpose:** Data integration and transformation

**Pipelines:**

1. **ORUM Ingestion Pipeline**
   - Source: ORUM API
   - Frequency: Every 15 minutes
   - Transformations: Call data normalization, connect rate calculation
   - Destination: watsonx.data → Db2 activities table

2. **SalesLoft Ingestion Pipeline**
   - Source: SalesLoft API
   - Frequency: Every 15 minutes
   - Transformations: Email/sequence data normalization
   - Destination: watsonx.data → Db2 activities table

3. **ISC/CRM Ingestion Pipeline**
   - Source: ISC/Salesforce API
   - Frequency: Every 30 minutes
   - Transformations: Opportunity stage mapping, forecast category
   - Destination: watsonx.data → Db2 opportunities table

4. **IBM Sales Data Pipeline**
   - Source: IBM Sales Database
   - Frequency: Daily
   - Transformations: Product mapping, territory assignment
   - Destination: watsonx.data → Db2 products/territories tables

### 5.2 IBM Knowledge Catalog (Governance)

**Purpose:** Data governance, lineage, quality

**Capabilities:**
- Data catalog for all Northstar datasets
- Business glossary for sales terminology
- Data lineage tracking from source to consumption
- Data quality rules and monitoring
- PII detection and masking
- Access control and audit logging

**Governed Assets:**
- User data (PII)
- Sales performance data
- Opportunity data
- Activity data
- Coaching notes

### 5.3 IBM Match 360 (MDM)

**Purpose:** Entity resolution and master data management

**Use Cases:**

1. **Account Matching**
   - Resolve duplicate accounts across CRM, ORUM, SalesLoft
   - Create golden record for each account
   - Match on: company name, domain, address

2. **Contact Matching**
   - Resolve duplicate contacts
   - Link contacts to accounts
   - Match on: email, phone, name

3. **Opportunity Deduplication**
   - Identify duplicate opportunities
   - Merge opportunity history

### 5.4 watsonx.ai (AI/ML Platform)

**Purpose:** Machine learning and generative AI

**Models Deployed:**

1. **Risk Scoring Model**
   - Type: Gradient Boosting (XGBoost)
   - Features: Pipeline coverage, activity metrics, territory coverage
   - Output: Risk score 0-100
   - Retraining: Weekly

2. **Forecast Model**
   - Type: Time Series (Prophet) + Ensemble
   - Features: Historical attainment, pipeline, activity trends
   - Output: Projected attainment, confidence
   - Retraining: Weekly

3. **Product Propensity Model**
   - Type: Collaborative Filtering + Content-Based
   - Features: Installed products, industry, company size, historical wins
   - Output: Product recommendations with propensity scores
   - Retraining: Bi-weekly

4. **Manager Copilot LLM**
   - Model: IBM Granite 13B (fine-tuned)
   - Architecture: RAG (Retrieval-Augmented Generation)
   - Context: Sales data, coaching best practices
   - Output: Natural language responses

### 5.5 watsonx Orchestrate (Agent Framework)

**Purpose:** AI agent orchestration and workflow automation

**Agents:**

1. **Coaching Agent**
   - Monitors risk scores
   - Generates recommendations
   - Triggers manager notifications
   - Schedules follow-ups

2. **Forecast Agent**
   - Runs daily forecast calculations
   - Detects forecast changes
   - Alerts on significant gaps
   - Generates executive briefs

3. **Territory Agent**
   - Monitors territory coverage
   - Identifies whitespace
   - Suggests account prioritization
   - Tracks engagement trends

### 5.6 Instana (Observability)

**Purpose:** Application performance monitoring

**Instrumentation:**
- All microservices instrumented with Instana agent
- Distributed tracing across service calls
- Real-time performance metrics
- Error tracking and alerting
- User experience monitoring

**Key Metrics:**
- API response times (p50, p95, p99)
- Service availability
- Error rates
- Database query performance
- Cache hit rates
- Event processing latency

### 5.7 Apptio (Cost Intelligence)

**Purpose:** Cloud cost management and optimization

**Tracking:**
- Db2 Warehouse costs
- watsonx.data storage costs
- watsonx.ai inference costs
- Redis Enterprise costs
- OpenShift compute costs
- Data transfer costs

**Optimization:**
- Cost allocation by service
- Usage trends and forecasting
- Rightsizing recommendations
- Reserved capacity planning

---

## 6. SECURITY ARCHITECTURE

### 6.1 Authentication & Authorization

**IBM IAM Integration**
- SSO with IBM w3id
- JWT token-based authentication
- Role-based access control (RBAC)
- Token expiration: 8 hours
- Refresh token: 30 days

**Roles:**
- `sales_rep`: View own data
- `manager`: View team data, create coaching notes
- `director`: View org data, analytics
- `vp`: View all data, executive briefs
- `admin`: System administration

### 6.2 Data Security

**Encryption at Rest:**
- Db2: Native encryption enabled
- watsonx.data: S3 encryption
- Redis: Encryption enabled

**Encryption in Transit:**
- TLS 1.3 for all API calls
- mTLS for service-to-service communication

**PII Protection:**
- Email addresses hashed in logs
- Phone numbers masked
- Coaching notes encrypted

### 6.3 Network Security

**Architecture:**
- All services in private VPC
- API Gateway in DMZ
- No direct internet access to services
- Egress through NAT gateway

**Firewall Rules:**
- API Gateway: Port 443 (HTTPS)
- Services: Internal only
- Db2: Port 50000 (internal)
- Redis: Port 6379 (internal)

---

## 7. SCALABILITY & PERFORMANCE

### 7.1 Horizontal Scaling

**Auto-scaling Configuration:**
- Min replicas: 2 per service
- Max replicas: 20 per service
- Scale trigger: CPU > 70% or Memory > 80%
- Scale-up time: 2 minutes
- Scale-down time: 10 minutes

**Load Balancing:**
- IBM Cloud Load Balancer
- Round-robin algorithm
- Health checks every 30 seconds
- Unhealthy threshold: 3 failures

### 7.2 Caching Strategy

**Redis Cache Layers:**

1. **API Response Cache**
   - TTL: 5 minutes
   - Keys: `api:v1:reps:{rep_id}:*`
   - Invalidation: On data update events

2. **Risk Score Cache**
   - TTL: 1 hour
   - Keys: `risk:{rep_id}:latest`
   - Invalidation: On risk calculation

3. **Forecast Cache**
   - TTL: 4 hours
   - Keys: `forecast:{rep_id}:{period}`
   - Invalidation: On forecast generation

### 7.3 Database Optimization

**Db2 Warehouse:**
- Partitioning: By date (monthly)
- Indexing: All foreign keys, frequently queried columns
- Materialized views: Dashboard aggregations
- Query optimization: Explain plans reviewed weekly

**Connection Pooling:**
- Min connections: 10 per service
- Max connections: 50 per service
- Connection timeout: 30 seconds
- Idle timeout: 10 minutes

---

## 8. DISASTER RECOVERY & HIGH AVAILABILITY

### 8.1 High Availability

**Service Level:**
- Multi-zone deployment (3 availability zones)
- Active-active configuration
- Automatic failover

**Database Level:**
- Db2 HADR (High Availability Disaster Recovery)
- Synchronous replication to standby
- Automatic failover < 30 seconds

**Cache Level:**
- Redis Enterprise with active-active replication
- Cross-zone replication
- Automatic failover

### 8.2 Backup Strategy

**Db2 Warehouse:**
- Full backup: Daily at 2 AM UTC
- Incremental backup: Every 6 hours
- Transaction log backup: Every 15 minutes
- Retention: 30 days

**watsonx.data:**
- Snapshot: Daily
- Retention: 90 days
- Cross-region replication

**Recovery Time Objective (RTO):** 1 hour  
**Recovery Point Objective (RPO):** 15 minutes

---

## 9. MONITORING & ALERTING

### 9.1 Health Checks

**Service Health:**
- Endpoint: `/health`
- Frequency: Every 30 seconds
- Checks: Database connectivity, cache connectivity, disk space

**Database Health:**
- Connection pool utilization
- Query performance
- Lock contention
- Tablespace usage

### 9.2 Alerts

**Critical Alerts (PagerDuty):**
- Service down > 2 minutes
- Database connection failure
- Error rate > 5%
- API response time p95 > 2 seconds

**Warning Alerts (Slack):**
- CPU > 80%
- Memory > 85%
- Disk > 80%
- Cache hit rate < 70%

---

## 10. DEPLOYMENT ARCHITECTURE

### 10.1 Container Platform

**OpenShift 4.x**
- Kubernetes orchestration
- Service mesh (Istio)
- CI/CD (Tekton pipelines)
- Image registry (Quay)

### 10.2 Environments

| Environment | Purpose | Data | Scaling |
|-------------|---------|------|---------|
| Development | Feature development | Synthetic | 1 replica |
| Test | Integration testing | Anonymized production | 2 replicas |
| Staging | Pre-production validation | Production snapshot | 3 replicas |
| Production | Live system | Production | Auto-scale 2-20 |

### 10.3 CI/CD Pipeline

**Stages:**
1. Code commit → GitHub
2. Automated tests (pytest, coverage > 80%)
3. Security scan (Snyk)
4. Build container image
5. Push to Quay registry
6. Deploy to dev (automatic)
7. Deploy to test (automatic)
8. Deploy to staging (manual approval)
9. Deploy to production (manual approval + change ticket)

**Deployment Strategy:**
- Blue-green deployment
- Canary releases (10% → 50% → 100%)
- Automatic rollback on error rate > 2%

---

## 11. COMPLIANCE & GOVERNANCE

### 11.1 Data Residency

- US data: US data centers only
- EU data: EU data centers only (GDPR compliance)
- Data sovereignty enforced at ingestion

### 11.2 Audit Logging

**Logged Events:**
- User authentication
- Data access (who, what, when)
- Configuration changes
- Coaching note creation/updates
- Risk score calculations
- Forecast generations

**Retention:** 7 years

### 11.3 Compliance Standards

- SOC 2 Type II
- ISO 27001
- GDPR (for EU users)
- IBM internal security standards

---

## 12. COST OPTIMIZATION

### 12.1 Resource Optimization

**Compute:**
- Right-sized containers based on actual usage
- Spot instances for non-critical workloads
- Auto-scaling to match demand

**Storage:**
- Lifecycle policies: Hot (30 days) → Warm (90 days) → Cold (1 year) → Archive
- Compression enabled on watsonx.data
- Db2 table compression

**Network:**
- CDN for static assets
- Data transfer optimization
- Regional data processing

### 12.2 Cost Allocation

**Tagging Strategy:**
- Service name
- Environment
- Cost center
- Business unit

**Monthly Cost Targets:**
- Compute: $50K
- Storage: $20K
- Data transfer: $10K
- AI/ML: $30K
- **Total: $110K/month** for 50K users = **$2.20 per user/month**

---

## NEXT STEPS

See additional documentation:
- [Database Schema](./DATABASE_SCHEMA.sql)
- [API Specification](./API_SPECIFICATION.md)
- [Service Architecture](./SERVICES_ARCHITECTURE.md)
- [IBM Integration Details](./IBM_INTEGRATION.md)
- [Risk Engine Design](./RISK_ENGINE.md)
- [Forecast Engine Design](./FORECAST_ENGINE.md)
- [Coaching Engine Design](./COACHING_ENGINE.md)
- [Implementation Plan](./IMPLEMENTATION_PLAN.md)