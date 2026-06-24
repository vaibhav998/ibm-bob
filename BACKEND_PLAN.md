# Backend Architecture Plan: IBM Sales Coaching Dashboard

## 🎯 Overview

Backend system for Opportunities, Activity Intelligence, and Reports tabs using **FastAPI + PostgreSQL**, featuring comprehensive IBM Data & AI product catalog with usage tracking and upsell opportunities.

---

## 📊 Database Schema Design

### Core Entities

#### 1. **reps** (Sales Representatives)
```sql
- id: UUID (PK)
- name: VARCHAR(100)
- initials: VARCHAR(5)
- role: VARCHAR(50)
- region: VARCHAR(50)
- email: VARCHAR(100)
- pipeline: DECIMAL(12,2)
- goal: DECIMAL(12,2)
- coverage: DECIMAL(4,2)
- risk_score: INTEGER
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

#### 2. **ibm_products** (IBM Data & AI Product Catalog)
```sql
- id: UUID (PK)
- product_name: VARCHAR(100)
- product_family: VARCHAR(50) -- watsonx, Data Management, DataOps, etc.
- category: VARCHAR(50) -- AI/ML, Database, ETL, Governance, Analytics
- description: TEXT
- typical_deal_size: DECIMAL(12,2)
- license_type: VARCHAR(50) -- Subscription, Perpetual, Usage-based
- is_active: BOOLEAN
- created_at: TIMESTAMP
```

**IBM Products to Include:**
- **watsonx Family**: watsonx.ai, watsonx.data, watsonx.governance
- **Data Management**: Db2, Db2 Warehouse, Informix, Cloudant
- **DataOps**: DataStage, Data Replication, InfoSphere
- **AI/ML**: Watson Studio, Watson Machine Learning, SPSS Modeler
- **Governance**: Watson Knowledge Catalog, Data Privacy Passports
- **Analytics**: Cognos Analytics, Planning Analytics, SPSS Statistics

#### 3. **opportunities** (Sales Opportunities)
```sql
- id: UUID (PK)
- rep_id: UUID (FK -> reps)
- account_name: VARCHAR(200)
- opportunity_name: VARCHAR(200)
- stage: VARCHAR(50) -- Discovery, Qualification, Proposal, Negotiation, Closed Won/Lost
- amount: DECIMAL(12,2)
- probability: INTEGER (0-100)
- expected_close_date: DATE
- created_date: DATE
- last_activity_date: DATE
- source: VARCHAR(50) -- Inbound, Outbound, Referral, Partner
- is_upsell: BOOLEAN
- parent_opportunity_id: UUID (FK -> opportunities, nullable)
- notes: TEXT
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

#### 4. **opportunity_products** (Products in Each Opportunity)
```sql
- id: UUID (PK)
- opportunity_id: UUID (FK -> opportunities)
- product_id: UUID (FK -> ibm_products)
- quantity: INTEGER
- unit_price: DECIMAL(12,2)
- total_amount: DECIMAL(12,2)
- is_current_product: BOOLEAN -- Currently using
- is_upsell_target: BOOLEAN -- Potential upsell
- usage_status: VARCHAR(50) -- Active, Trial, Expired, Not Using
- created_at: TIMESTAMP
```

#### 5. **activities** (Activity Intelligence)
```sql
- id: UUID (PK)
- rep_id: UUID (FK -> reps)
- opportunity_id: UUID (FK -> opportunities, nullable)
- activity_type: VARCHAR(50) -- Meeting, Call, Email, Demo, Proposal
- subject: VARCHAR(200)
- description: TEXT
- activity_date: TIMESTAMP
- duration_minutes: INTEGER
- outcome: VARCHAR(50) -- Scheduled, Completed, No Show, Rescheduled
- sentiment: VARCHAR(20) -- Positive, Neutral, Negative
- next_steps: TEXT
- attendees: JSONB -- Array of attendee objects
- products_discussed: JSONB -- Array of product IDs
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

#### 6. **activity_metrics** (Aggregated Activity Intelligence)
```sql
- id: UUID (PK)
- rep_id: UUID (FK -> reps)
- period_start: DATE
- period_end: DATE
- total_meetings: INTEGER
- total_calls: INTEGER
- total_emails: INTEGER
- total_demos: INTEGER
- meeting_to_opp_conversion: DECIMAL(5,2)
- avg_response_time_hours: DECIMAL(6,2)
- engagement_score: INTEGER (0-100)
- created_at: TIMESTAMP
```

#### 7. **reports** (Generated Reports)
```sql
- id: UUID (PK)
- report_name: VARCHAR(200)
- report_type: VARCHAR(50) -- Pipeline, Activity, Product, Forecast
- generated_by: UUID (FK -> reps)
- parameters: JSONB -- Filter criteria used
- file_path: VARCHAR(500)
- file_format: VARCHAR(20) -- PDF, Excel, CSV
- status: VARCHAR(20) -- Pending, Completed, Failed
- created_at: TIMESTAMP
- expires_at: TIMESTAMP
```

#### 8. **account_products** (Current Product Usage by Account)
```sql
- id: UUID (PK)
- account_name: VARCHAR(200)
- product_id: UUID (FK -> ibm_products)
- contract_start_date: DATE
- contract_end_date: DATE
- annual_value: DECIMAL(12,2)
- usage_level: VARCHAR(50) -- Low, Medium, High
- satisfaction_score: INTEGER (1-10)
- renewal_risk: VARCHAR(20) -- Low, Medium, High
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

---

## 🏗️ Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI app initialization
│   ├── config.py               # Configuration settings
│   ├── database.py             # Database connection
│   │
│   ├── models/                 # SQLAlchemy models
│   │   ├── __init__.py
│   │   ├── rep.py
│   │   ├── opportunity.py
│   │   ├── activity.py
│   │   ├── product.py
│   │   ├── report.py
│   │   └── account.py
│   │
│   ├── schemas/                # Pydantic schemas
│   │   ├── __init__.py
│   │   ├── rep.py
│   │   ├── opportunity.py
│   │   ├── activity.py
│   │   ├── product.py
│   │   └── report.py
│   │
│   ├── api/                    # API routes
│   │   ├── __init__.py
│   │   ├── opportunities.py
│   │   ├── activities.py
│   │   ├── reports.py
│   │   ├── products.py
│   │   └── reps.py
│   │
│   ├── services/               # Business logic
│   │   ├── __init__.py
│   │   ├── opportunity_service.py
│   │   ├── activity_service.py
│   │   ├── report_service.py
│   │   └── analytics_service.py
│   │
│   ├── utils/                  # Utility functions
│   │   ├── __init__.py
│   │   ├── validators.py
│   │   └── formatters.py
│   │
│   └── seed/                   # Mock data generation
│       ├── __init__.py
│       ├── seed_data.py
│       ├── ibm_products.py
│       └── mock_generator.py
│
├── alembic/                    # Database migrations
│   ├── versions/
│   └── env.py
│
├── tests/                      # Test suite
│   ├── test_opportunities.py
│   ├── test_activities.py
│   └── test_reports.py
│
├── requirements.txt
├── .env.example
├── alembic.ini
└── README.md
```

---

## 🔌 API Endpoints Design

### **Opportunities Tab** (`/api/v1/opportunities`)

#### Core CRUD Operations
- `GET /api/v1/opportunities` - List all opportunities with filters
  - Query params: `rep_id`, `stage`, `min_amount`, `max_amount`, `date_from`, `date_to`, `is_upsell`
  - Response: Paginated list with total count

- `GET /api/v1/opportunities/{id}` - Get single opportunity with full details
  - Includes: products, activities, account info

- `POST /api/v1/opportunities` - Create new opportunity
  - Body: Opportunity details + products array

- `PUT /api/v1/opportunities/{id}` - Update opportunity
  - Supports partial updates

- `DELETE /api/v1/opportunities/{id}` - Soft delete opportunity

#### Analytics Endpoints
- `GET /api/v1/opportunities/pipeline-summary` - Pipeline metrics by stage
  - Response: Total value, count, avg deal size per stage

- `GET /api/v1/opportunities/by-product` - Opportunities grouped by IBM product
  - Shows which products are in active deals

- `GET /api/v1/opportunities/upsell-potential` - Identify upsell opportunities
  - Analyzes current product usage vs. available products
  - Returns accounts with expansion potential

- `GET /api/v1/opportunities/forecast` - Revenue forecast
  - Weighted pipeline by probability and close date

### **Activity Intelligence Tab** (`/api/v1/activities`)

#### Activity Tracking
- `GET /api/v1/activities` - List activities with filters
  - Query params: `rep_id`, `opportunity_id`, `activity_type`, `date_from`, `date_to`, `outcome`

- `GET /api/v1/activities/{id}` - Get single activity

- `POST /api/v1/activities` - Log new activity
  - Auto-links to opportunity if provided

- `PUT /api/v1/activities/{id}` - Update activity

- `DELETE /api/v1/activities/{id}` - Delete activity

#### Intelligence & Analytics
- `GET /api/v1/activities/metrics` - Activity metrics by rep
  - Query params: `rep_id`, `period` (week, month, quarter)
  - Response: Meeting counts, conversion rates, engagement scores

- `GET /api/v1/activities/timeline` - Activity timeline view
  - Chronological view of all activities for a rep or opportunity

- `GET /api/v1/activities/conversion-funnel` - Meeting-to-opportunity conversion
  - Shows conversion rates at each stage

- `GET /api/v1/activities/product-engagement` - Product discussion frequency
  - Which IBM products are being discussed most

- `GET /api/v1/activities/sentiment-analysis` - Sentiment trends
  - Positive/neutral/negative sentiment over time

### **Reports Tab** (`/api/v1/reports`)

#### Report Generation
- `GET /api/v1/reports` - List generated reports
  - Query params: `report_type`, `generated_by`, `date_from`

- `GET /api/v1/reports/{id}` - Get report metadata

- `GET /api/v1/reports/{id}/download` - Download report file

- `POST /api/v1/reports/generate` - Generate new report
  - Body: Report type, filters, format (PDF/Excel/CSV)
  - Async processing with status updates

- `DELETE /api/v1/reports/{id}` - Delete report

#### Pre-built Report Types
- `POST /api/v1/reports/pipeline-snapshot` - Current pipeline state
  - All opportunities by stage, rep, product

- `POST /api/v1/reports/activity-summary` - Activity intelligence report
  - Meeting counts, conversion rates, engagement metrics

- `POST /api/v1/reports/product-adoption` - IBM product usage report
  - Current products by account, upsell opportunities

- `POST /api/v1/reports/forecast` - Revenue forecast report
  - Weighted pipeline, probability analysis

- `POST /api/v1/reports/rep-performance` - Individual rep performance
  - KPIs, activities, opportunities for specific rep

### **Supporting Endpoints**

#### Products (`/api/v1/products`)
- `GET /api/v1/products` - List IBM products
  - Query params: `category`, `product_family`, `is_active`

- `GET /api/v1/products/{id}` - Get product details

- `GET /api/v1/products/recommendations` - Product recommendations
  - Based on account's current products, suggest upsells

#### Reps (`/api/v1/reps`)
- `GET /api/v1/reps` - List all reps
- `GET /api/v1/reps/{id}` - Get rep details with metrics
- `GET /api/v1/reps/{id}/dashboard` - Rep dashboard data
  - Combines opportunities, activities, metrics

---

## 📦 Mock Data Strategy

### IBM Data & AI Products (30+ products)

#### **watsonx Family**
1. watsonx.ai - AI development platform ($150K avg deal)
2. watsonx.data - Data lakehouse ($200K avg deal)
3. watsonx.governance - AI governance ($100K avg deal)

#### **Data Management**
4. Db2 Database - Enterprise database ($120K avg deal)
5. Db2 Warehouse - Data warehouse ($180K avg deal)
6. Informix - Embedded database ($80K avg deal)
7. Cloudant - NoSQL database ($60K avg deal)

#### **DataOps & Integration**
8. DataStage - ETL platform ($150K avg deal)
9. Data Replication - Real-time replication ($90K avg deal)
10. InfoSphere Information Server ($200K avg deal)
11. Cloud Pak for Data ($300K avg deal)

#### **AI & Machine Learning**
12. Watson Studio - ML development ($130K avg deal)
13. Watson Machine Learning ($110K avg deal)
14. SPSS Modeler - Predictive analytics ($70K avg deal)
15. Watson OpenScale - AI monitoring ($85K avg deal)

#### **Data Governance**
16. Watson Knowledge Catalog ($140K avg deal)
17. Data Privacy Passports ($95K avg deal)
18. InfoSphere Master Data Management ($180K avg deal)

#### **Analytics & BI**
19. Cognos Analytics - BI platform ($120K avg deal)
20. Planning Analytics - Financial planning ($160K avg deal)
21. SPSS Statistics - Statistical analysis ($50K avg deal)

### Mock Opportunity Scenarios

#### **Scenario 1: Existing Customer Expansion**
- Account: "Acme Financial Services"
- Current products: Db2 Database, Cognos Analytics
- Opportunity: Upsell watsonx.ai for fraud detection
- Amount: $180K
- Stage: Proposal
- Products discussed: watsonx.ai, Watson OpenScale

#### **Scenario 2: New Logo - Data Modernization**
- Account: "TechCorp Manufacturing"
- Current products: None (competitive database)
- Opportunity: Replace legacy system with Cloud Pak for Data
- Amount: $350K
- Stage: Discovery
- Products discussed: Cloud Pak for Data, DataStage, Db2 Warehouse

#### **Scenario 3: AI/ML Adoption**
- Account: "RetailMax Inc"
- Current products: Db2 Warehouse, DataStage
- Opportunity: Add AI capabilities for customer insights
- Amount: $220K
- Stage: Qualification
- Products discussed: watsonx.ai, Watson Studio, Watson Knowledge Catalog

#### **Scenario 4: Governance & Compliance**
- Account: "HealthFirst Systems"
- Current products: Db2 Database, InfoSphere
- Opportunity: Add governance for regulatory compliance
- Amount: $165K
- Stage: Negotiation
- Products discussed: watsonx.governance, Data Privacy Passports

### Activity Intelligence Mock Data

#### Activity Types Distribution
- **Meetings**: 40% (Discovery calls, demos, executive briefings)
- **Calls**: 30% (Follow-ups, check-ins, quick questions)
- **Emails**: 20% (Proposals, documentation, follow-ups)
- **Demos**: 8% (Product demonstrations)
- **Proposals**: 2% (Formal proposals)

#### Sample Activities
1. **Product Demo - watsonx.ai**
   - Duration: 60 minutes
   - Attendees: 4 (CTO, Data Science Lead, 2 Engineers)
   - Outcome: Positive
   - Next steps: POC discussion
   - Products discussed: watsonx.ai, Watson Studio

2. **Discovery Call - Data Modernization**
   - Duration: 45 minutes
   - Attendees: 2 (VP IT, Database Admin)
   - Outcome: Scheduled follow-up
   - Next steps: Architecture review
   - Products discussed: Cloud Pak for Data, Db2 Warehouse

3. **Executive Briefing - AI Strategy**
   - Duration: 90 minutes
   - Attendees: 5 (CEO, CTO, CFO, 2 VPs)
   - Outcome: Very positive
   - Next steps: Budget approval process
   - Products discussed: watsonx.ai, watsonx.governance

---

## 🔧 Technical Implementation Details

### FastAPI Configuration

```python
# main.py structure
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="IBM Sales Coaching API",
    description="Backend API for Sales Intelligence Dashboard",
    version="1.0.0"
)

# CORS configuration for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:8000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(opportunities.router, prefix="/api/v1/opportunities", tags=["opportunities"])
app.include_router(activities.router, prefix="/api/v1/activities", tags=["activities"])
app.include_router(reports.router, prefix="/api/v1/reports", tags=["reports"])
```

### Database Configuration

```python
# database.py
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = "postgresql://user:password@localhost/sales_coaching"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

### Response Models

```python
# Standard API response format
{
    "success": true,
    "data": {...},
    "message": "Operation successful",
    "meta": {
        "total": 100,
        "page": 1,
        "per_page": 20
    }
}
```

---

## 📈 Key Features

### 1. **Opportunities Tab Features**
- ✅ Full CRUD operations
- ✅ Pipeline visualization data
- ✅ Stage-based filtering
- ✅ Product association tracking
- ✅ Upsell opportunity identification
- ✅ Current vs. potential product usage
- ✅ Revenue forecasting
- ✅ Win/loss analysis

### 2. **Activity Intelligence Features**
- ✅ Activity logging and tracking
- ✅ Meeting-to-opportunity conversion metrics
- ✅ Engagement scoring
- ✅ Product discussion tracking
- ✅ Sentiment analysis
- ✅ Response time metrics
- ✅ Activity timeline visualization
- ✅ Rep performance analytics

### 3. **Reports Features**
- ✅ Multiple report types (Pipeline, Activity, Product, Forecast)
- ✅ Multiple export formats (PDF, Excel, CSV)
- ✅ Async report generation
- ✅ Scheduled reports (future enhancement)
- ✅ Custom filtering and parameters
- ✅ Report history and versioning
- ✅ Shareable report links

---

## 🔐 Security & Validation

- **Input Validation**: Pydantic schemas for all requests
- **Error Handling**: Consistent error responses with proper HTTP codes
- **Data Sanitization**: SQL injection prevention via SQLAlchemy ORM
- **CORS**: Configured for frontend domain
- **Rate Limiting**: Future enhancement with Redis
- **Authentication**: JWT tokens (future enhancement)

---

## 🧪 Testing Strategy

- **Unit Tests**: Test individual service functions
- **Integration Tests**: Test API endpoints
- **Mock Data Tests**: Verify seed data generation
- **Performance Tests**: Load testing for analytics endpoints

---

## 📚 Dependencies

```txt
fastapi==0.104.1
uvicorn[standard]==0.24.0
sqlalchemy==2.0.23
psycopg2-binary==2.9.9
pydantic==2.5.0
python-dotenv==1.0.0
alembic==1.12.1
faker==20.1.0
pandas==2.1.3
openpyxl==3.1.2
reportlab==4.0.7
python-multipart==0.0.6
```

---

## 🚀 Deployment Considerations

1. **Database Setup**: PostgreSQL 14+ recommended
2. **Environment Variables**: Use `.env` for configuration
3. **Migrations**: Alembic for schema management
4. **API Documentation**: Auto-generated Swagger UI at `/docs`
5. **Monitoring**: Add logging and error tracking
6. **Scalability**: Async endpoints for heavy operations

---

## 📊 Sample API Responses

### Opportunities List Response
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-here",
      "account_name": "Acme Financial Services",
      "opportunity_name": "AI Fraud Detection Platform",
      "stage": "Proposal",
      "amount": 180000,
      "probability": 70,
      "expected_close_date": "2026-08-15",
      "rep": {
        "id": "uuid",
        "name": "Priya Shah",
        "region": "East"
      },
      "products": [
        {
          "product_name": "watsonx.ai",
          "is_current_product": false,
          "is_upsell_target": true,
          "amount": 150000
        },
        {
          "product_name": "Watson OpenScale",
          "is_current_product": false,
          "is_upsell_target": true,
          "amount": 30000
        }
      ],
      "current_products": ["Db2 Database", "Cognos Analytics"],
      "last_activity": "2026-06-15T14:30:00Z"
    }
  ],
  "meta": {
    "total": 43,
    "page": 1,
    "per_page": 20,
    "total_value": 2450000
  }
}
```

### Activity Metrics Response
```json
{
  "success": true,
  "data": {
    "rep_id": "uuid",
    "rep_name": "Jordan Lee",
    "period": "2026-06",
    "metrics": {
      "total_activities": 42,
      "meetings": 16,
      "calls": 18,
      "emails": 8,
      "demos": 4,
      "meeting_to_opp_conversion": 28.5,
      "avg_response_time_hours": 4.2,
      "engagement_score": 72
    },
    "product_discussions": [
      {"product": "watsonx.ai", "count": 8},
      {"product": "Cloud Pak for Data", "count": 6},
      {"product": "Db2 Warehouse", "count": 5}
    ],
    "sentiment_breakdown": {
      "positive": 65,
      "neutral": 30,
      "negative": 5
    }
  }
}
```

---

## 🎯 Success Metrics

- ✅ All CRUD operations functional
- ✅ 30+ IBM products in catalog
- ✅ 50+ mock opportunities with realistic data
- ✅ 200+ activity records
- ✅ Product usage tracking for upsell identification
- ✅ API response time < 200ms for list endpoints
- ✅ API response time < 500ms for analytics endpoints
- ✅ 100% API documentation coverage
- ✅ Comprehensive error handling

---

## 🔄 Integration with Frontend

The backend will provide data for:
1. **Opportunities Tab**: Replace static data with dynamic API calls
2. **Activity Intelligence Tab**: Real-time activity tracking and metrics
3. **Reports Tab**: Generate and download custom reports
4. **Existing Dashboard**: Enhanced with product usage insights

Frontend integration points:
- Update [`app.js`](app.js:1) to fetch from API endpoints
- Add new tabs to [`index.html`](index.html:1)
- Extend [`styles.css`](styles.css:1) for new components

---

## 📝 Next Steps

After plan approval:
1. Set up FastAPI project structure
2. Configure PostgreSQL database
3. Create SQLAlchemy models
4. Generate IBM product catalog
5. Build mock data generators
6. Implement API endpoints
7. Test and document APIs
8. Provide integration guide for frontend
