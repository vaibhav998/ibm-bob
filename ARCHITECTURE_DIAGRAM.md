# System Architecture Diagram

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND LAYER                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Manager    │  │     Rep      │  │ Opportunities│         │
│  │   Overview   │  │   Coaching   │  │   Activity   │         │
│  │              │  │              │  │   Reports    │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│         │                  │                  │                 │
│         └──────────────────┴──────────────────┘                │
│                            │                                    │
│                    HTTP/REST API                                │
└────────────────────────────┼────────────────────────────────────┘
                             │
┌────────────────────────────┼────────────────────────────────────┐
│                    BACKEND LAYER (FastAPI)                      │
│                            │                                    │
│  ┌─────────────────────────┴──────────────────────────┐        │
│  │              API Gateway / Router                   │        │
│  │         (CORS, Auth, Rate Limiting)                │        │
│  └─────────────────────────┬──────────────────────────┘        │
│                            │                                    │
│  ┌─────────────────────────┴──────────────────────────┐        │
│  │                  API Endpoints                      │        │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐         │        │
│  │  │Opportuni-│  │Activities│  │ Reports  │         │        │
│  │  │  ties    │  │          │  │          │         │        │
│  │  └────┬─────┘  └────┬─────┘  └────┬─────┘         │        │
│  └───────┼─────────────┼─────────────┼────────────────┘        │
│          │             │             │                          │
│  ┌───────┴─────────────┴─────────────┴────────────────┐        │
│  │              Business Logic Layer                   │        │
│  │  ┌──────────────────────────────────────────────┐  │        │
│  │  │  Opportunity Service                         │  │        │
│  │  │  - CRUD operations                           │  │        │
│  │  │  - Pipeline analytics                        │  │        │
│  │  │  - Upsell identification                     │  │        │
│  │  └──────────────────────────────────────────────┘  │        │
│  │  ┌──────────────────────────────────────────────┐  │        │
│  │  │  Activity Service                            │  │        │
│  │  │  - Activity tracking                         │  │        │
│  │  │  - Conversion metrics                        │  │        │
│  │  │  - Engagement scoring                        │  │        │
│  │  └──────────────────────────────────────────────┘  │        │
│  │  ┌──────────────────────────────────────────────┐  │        │
│  │  │  Report Service                              │  │        │
│  │  │  - Report generation                         │  │        │
│  │  │  - Export (PDF/Excel/CSV)                    │  │        │
│  │  │  - Async processing                          │  │        │
│  │  └──────────────────────────────────────────────┘  │        │
│  │  ┌──────────────────────────────────────────────┐  │        │
│  │  │  Analytics Service                           │  │        │
│  │  │  - Product recommendations                   │  │        │
│  │  │  - Forecasting                               │  │        │
│  │  │  - Sentiment analysis                        │  │        │
│  │  └──────────────────────────────────────────────┘  │        │
│  └───────────────────────┬──────────────────────────┘          │
│                          │                                      │
│  ┌───────────────────────┴──────────────────────────┐          │
│  │              Data Access Layer (ORM)              │          │
│  │              SQLAlchemy Models                    │          │
│  └───────────────────────┬──────────────────────────┘          │
└────────────────────────────┼────────────────────────────────────┘
                             │
┌────────────────────────────┼────────────────────────────────────┐
│                    DATABASE LAYER (PostgreSQL)                  │
│                            │                                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │     reps     │  │ opportunities│  │  activities  │         │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘         │
│         │                 │                  │                  │
│  ┌──────┴───────┐  ┌──────┴───────┐  ┌──────┴───────┐         │
│  │ibm_products  │  │opportunity_  │  │activity_     │         │
│  │              │  │  products    │  │  metrics     │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐                           │
│  │   reports    │  │account_      │                           │
│  │              │  │  products    │                           │
│  └──────────────┘  └──────────────┘                           │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow: Opportunities Tab

```
┌─────────────┐
│   Browser   │
│  (Frontend) │
└──────┬──────┘
       │ 1. GET /api/v1/opportunities?rep_id=xyz
       ▼
┌──────────────────────────────────────────┐
│  FastAPI Router                          │
│  /api/v1/opportunities                   │
└──────┬───────────────────────────────────┘
       │ 2. Route to handler
       ▼
┌──────────────────────────────────────────┐
│  Opportunity Service                     │
│  - Validate parameters                   │
│  - Apply filters                         │
│  - Calculate metrics                     │
└──────┬───────────────────────────────────┘
       │ 3. Query database
       ▼
┌──────────────────────────────────────────┐
│  SQLAlchemy ORM                          │
│  - Build SQL query                       │
│  - Join related tables                   │
│  - Execute query                         │
└──────┬───────────────────────────────────┘
       │ 4. SQL Query
       ▼
┌──────────────────────────────────────────┐
│  PostgreSQL Database                     │
│  SELECT o.*, p.product_name, r.name      │
│  FROM opportunities o                    │
│  JOIN opportunity_products op ON ...     │
│  JOIN ibm_products p ON ...              │
│  JOIN reps r ON ...                      │
│  WHERE r.id = 'xyz'                      │
└──────┬───────────────────────────────────┘
       │ 5. Return rows
       ▼
┌──────────────────────────────────────────┐
│  Pydantic Schema                         │
│  - Serialize data                        │
│  - Format response                       │
│  - Add metadata                          │
└──────┬───────────────────────────────────┘
       │ 6. JSON Response
       ▼
┌──────────────────────────────────────────┐
│  Browser receives:                       │
│  {                                       │
│    "success": true,                      │
│    "data": [...opportunities...],       │
│    "meta": {                             │
│      "total": 43,                        │
│      "total_value": 2450000              │
│    }                                     │
│  }                                       │
└──────────────────────────────────────────┘
```

## Database Entity Relationships

```
┌─────────────┐
│    reps     │
│─────────────│
│ id (PK)     │◄─────────┐
│ name        │          │
│ region      │          │
│ pipeline    │          │
└─────────────┘          │
                         │
                         │ rep_id (FK)
                         │
┌─────────────────────┐  │
│   opportunities     │  │
│─────────────────────│  │
│ id (PK)             │◄─┘
│ rep_id (FK)         │
│ account_name        │
│ stage               │
│ amount              │
│ probability         │
└──────┬──────────────┘
       │
       │ opportunity_id (FK)
       │
       ├──────────────────────────────┐
       │                              │
       ▼                              ▼
┌─────────────────────┐    ┌─────────────────────┐
│ opportunity_products│    │     activities      │
│─────────────────────│    │─────────────────────│
│ id (PK)             │    │ id (PK)             │
│ opportunity_id (FK) │    │ opportunity_id (FK) │
│ product_id (FK)     │    │ rep_id (FK)         │
│ is_current_product  │    │ activity_type       │
│ is_upsell_target    │    │ activity_date       │
└──────┬──────────────┘    │ outcome             │
       │                   │ sentiment           │
       │                   └─────────────────────┘
       │ product_id (FK)
       │
       ▼
┌─────────────────────┐
│   ibm_products      │
│─────────────────────│
│ id (PK)             │
│ product_name        │
│ product_family      │
│ category            │
│ typical_deal_size   │
└─────────────────────┘
       ▲
       │ product_id (FK)
       │
┌──────┴──────────────┐
│  account_products   │
│─────────────────────│
│ id (PK)             │
│ account_name        │
│ product_id (FK)     │
│ contract_start_date │
│ annual_value        │
│ renewal_risk        │
└─────────────────────┘
```

## IBM Product Catalog Structure

```
IBM Data & AI Products
│
├── watsonx Family
│   ├── watsonx.ai ($150K avg)
│   ├── watsonx.data ($200K avg)
│   └── watsonx.governance ($100K avg)
│
├── Data Management
│   ├── Db2 Database ($120K avg)
│   ├── Db2 Warehouse ($180K avg)
│   ├── Informix ($80K avg)
│   └── Cloudant ($60K avg)
│
├── DataOps & Integration
│   ├── DataStage ($150K avg)
│   ├── Data Replication ($90K avg)
│   ├── InfoSphere Information Server ($200K avg)
│   └── Cloud Pak for Data ($300K avg)
│
├── AI & Machine Learning
│   ├── Watson Studio ($130K avg)
│   ├── Watson Machine Learning ($110K avg)
│   ├── SPSS Modeler ($70K avg)
│   └── Watson OpenScale ($85K avg)
│
├── Data Governance
│   ├── Watson Knowledge Catalog ($140K avg)
│   ├── Data Privacy Passports ($95K avg)
│   └── InfoSphere Master Data Management ($180K avg)
│
└── Analytics & BI
    ├── Cognos Analytics ($120K avg)
    ├── Planning Analytics ($160K avg)
    └── SPSS Statistics ($50K avg)
```

## Upsell Opportunity Logic Flow

```
┌─────────────────────────────────────────┐
│  Account: "Acme Financial Services"     │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Current Products (account_products)    │
│  ✓ Db2 Database                         │
│  ✓ Cognos Analytics                     │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Analyze Product Relationships          │
│  - Same product family?                 │
│  - Complementary products?              │
│  - Common upgrade paths?                │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Upsell Recommendations                 │
│  1. watsonx.ai (AI on existing data)    │
│     Reason: Has Db2 + Analytics         │
│     Confidence: High                    │
│                                         │
│  2. Watson Knowledge Catalog            │
│     Reason: Data governance for Db2     │
│     Confidence: Medium                  │
│                                         │
│  3. DataStage (ETL)                     │
│     Reason: Data integration needs      │
│     Confidence: Medium                  │
└─────────────────────────────────────────┘
```

## API Request/Response Flow Example

### Creating an Opportunity with Products

```
REQUEST:
POST /api/v1/opportunities
Content-Type: application/json

{
  "rep_id": "uuid-priya-shah",
  "account_name": "Acme Financial Services",
  "opportunity_name": "AI Fraud Detection Platform",
  "stage": "Discovery",
  "amount": 180000,
  "probability": 40,
  "expected_close_date": "2026-08-15",
  "products": [
    {
      "product_id": "uuid-watsonx-ai",
      "quantity": 1,
      "unit_price": 150000,
      "is_upsell_target": true
    },
    {
      "product_id": "uuid-watson-openscale",
      "quantity": 1,
      "unit_price": 30000,
      "is_upsell_target": true
    }
  ]
}

RESPONSE:
{
  "success": true,
  "data": {
    "id": "uuid-new-opportunity",
    "rep_id": "uuid-priya-shah",
    "account_name": "Acme Financial Services",
    "opportunity_name": "AI Fraud Detection Platform",
    "stage": "Discovery",
    "amount": 180000,
    "probability": 40,
    "expected_close_date": "2026-08-15",
    "created_at": "2026-06-18T15:00:00Z",
    "products": [
      {
        "product_name": "watsonx.ai",
        "product_family": "watsonx",
        "amount": 150000,
        "is_upsell_target": true
      },
      {
        "product_name": "Watson OpenScale",
        "product_family": "AI & Machine Learning",
        "amount": 30000,
        "is_upsell_target": true
      }
    ],
    "account_current_products": [
      "Db2 Database",
      "Cognos Analytics"
    ]
  },
  "message": "Opportunity created successfully"
}
```

## Activity Intelligence Analytics Pipeline

```
┌─────────────────────────────────────────┐
│  Raw Activity Data                      │
│  - Meetings, Calls, Emails, Demos       │
│  - Timestamps, Attendees, Outcomes      │
│  - Products Discussed                   │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Aggregation Engine                     │
│  - Group by rep, time period            │
│  - Count activities by type             │
│  - Calculate conversion rates           │
│  - Analyze sentiment trends             │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Metrics Calculation                    │
│  - Meeting-to-opp conversion: 28%       │
│  - Avg response time: 4.2 hours         │
│  - Engagement score: 72/100             │
│  - Product discussion frequency         │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Store in activity_metrics table        │
│  - Cached for performance               │
│  - Updated on new activity              │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  API Response                           │
│  - Real-time metrics                    │
│  - Trend analysis                       │
│  - Actionable insights                  │
└─────────────────────────────────────────┘
```

## Technology Stack Summary

```
┌─────────────────────────────────────────┐
│           FRONTEND                      │
│  - HTML5, CSS3, JavaScript              │
│  - Northstar Design System              │
│  - Fetch API for HTTP requests          │
└─────────────────────────────────────────┘
                    ↕
┌─────────────────────────────────────────┐
│           BACKEND                       │
│  - Python 3.11+                         │
│  - FastAPI (async web framework)        │
│  - Pydantic (data validation)           │
│  - SQLAlchemy (ORM)                     │
│  - Alembic (migrations)                 │
└─────────────────────────────────────────┘
                    ↕
┌─────────────────────────────────────────┐
│           DATABASE                      │
│  - PostgreSQL 14+                       │
│  - JSONB for flexible data              │
│  - Indexes for performance              │
└─────────────────────────────────────────┘
```
