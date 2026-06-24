# Northstar API Specification
## REST API v1.0

**Base URL:** `https://api.northstar.ibm.com/api/v1`  
**Protocol:** HTTPS only  
**Authentication:** JWT Bearer Token (IBM IAM)  
**Content-Type:** `application/json`  
**API Version:** 1.0  
**Last Updated:** 2026-06-18

---

## Authentication

All API requests require JWT Bearer tokens from IBM IAM.

```http
Authorization: Bearer {jwt_token}
```

**Token Expiration:** Access Token: 8 hours | Refresh Token: 30 days

---

## Common Patterns

### Pagination
```json
{
  "data": [...],
  "pagination": {
    "next_cursor": "eyJpZCI6MTIzfQ==",
    "has_more": true,
    "total": 150
  }
}
```

### Error Response (RFC 7807)
```json
{
  "type": "https://api.northstar.ibm.com/errors/validation-error",
  "title": "Validation Error",
  "status": 400,
  "detail": "Invalid date format",
  "instance": "/api/v1/reps"
}
```

### Rate Limiting
- 1000 requests/minute per user
- 10,000 requests/hour per user

---

## API Endpoints Summary

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/dashboard` | GET | Manager dashboard overview |
| `/reps` | GET | List sales reps |
| `/reps/{id}` | GET | Get rep details |
| `/reps/{id}/risk` | GET | Get risk assessment |
| `/reps/{id}/forecast` | GET | Get forecast |
| `/reps/{id}/recommendations` | GET | Get coaching recommendations |
| `/opportunities` | GET | List opportunities |
| `/opportunities/{id}` | GET | Get opportunity details |
| `/opportunities/{id}/diagnostics` | GET | Get opportunity health |
| `/activity` | GET | Get activity metrics |
| `/territories/{id}/coverage` | GET | Get territory coverage |
| `/forecast` | GET | Get team forecast |
| `/risk/team` | GET | Get team risk summary |
| `/coaching/recommendations` | GET | List recommendations |
| `/coaching/notes` | POST | Create coaching note |
| `/product-propensity` | GET | Get product recommendations |
| `/copilot/query` | POST | Ask copilot question |
| `/copilot/sessions` | GET | List copilot sessions |
| `/executive-brief` | GET | Get executive summary |
| `/simulate` | POST | Run what-if scenario |

---

## Dashboard API

### GET /dashboard

Manager dashboard with team performance summary.

**Query Parameters:**
- `manager_id` (required): Manager UUID
- `period` (optional): `current_week`, `current_month`, `current_quarter`

**Response:**
```json
{
  "manager_id": "uuid",
  "period": "Q2 2026",
  "team_summary": {
    "total_reps": 12,
    "quota_attainment_percent": 82.0,
    "total_pipeline": 12500000,
    "at_risk_reps": 3
  },
  "risk_distribution": {
    "healthy": 6,
    "watch": 3,
    "high_risk": 3
  },
  "top_priorities": [
    {
      "rep_name": "Jordan Lee",
      "risk_score": 78,
      "primary_issue": "Territory coverage below 30%"
    }
  ]
}
```

---

## Sales Reps API

### GET /reps

List sales reps with filtering.

**Query Parameters:**
- `manager_id` (required)
- `risk_category` (optional): `healthy`, `watch`, `high_risk`
- `sort` (optional): `risk_score_desc`, `name_asc`

**Response:**
```json
{
  "data": [
    {
      "rep_id": "uuid",
      "name": "Jordan Lee",
      "quota": 500000,
      "attainment_percent": 77.0,
      "risk_score": 78,
      "risk_category": "high_risk",
      "pipeline": 1200000
    }
  ]
}
```

### GET /reps/{rep_id}

Get detailed rep profile.

**Response:**
```json
{
  "rep_id": "uuid",
  "name": "Jordan Lee",
  "quota": 500000,
  "attainment_percent": 77.0,
  "territory": {
    "territory_name": "Northeast Enterprise",
    "coverage_percent": 28.2
  },
  "current_period": {
    "opportunities_created": 8,
    "total_calls": 142,
    "total_meetings": 18
  }
}
```

### GET /reps/{rep_id}/risk

Get risk assessment details.

**Response:**
```json
{
  "rep_id": "uuid",
  "quota_risk_score": 78,
  "risk_category": "high_risk",
  "component_scores": {
    "pipeline_coverage": 45,
    "opportunity_creation": 38,
    "meeting_activity": 62,
    "account_coverage": 28,
    "conversion_rate": 55
  },
  "primary_risk_factor": "Territory coverage below team average"
}
```

### GET /reps/{rep_id}/forecast

Get forecast projection.

**Response:**
```json
{
  "rep_id": "uuid",
  "forecasts": {
    "30_day": {
      "projected_attainment": 425000,
      "confidence_score": 72,
      "gap_to_quota": 75000
    },
    "quarter_end": {
      "projected_attainment": 465000,
      "confidence_score": 68
    }
  }
}
```

### GET /reps/{rep_id}/recommendations

Get coaching recommendations.

**Response:**
```json
{
  "recommendations": [
    {
      "recommendation_id": "uuid",
      "priority": 1,
      "category": "Territory Coverage",
      "title": "Increase account engagement",
      "suggested_action": "Engage 15 additional accounts",
      "impact_score": 85,
      "status": "pending"
    }
  ]
}
```

---

## Opportunities API

### GET /opportunities

List opportunities with filtering.

**Query Parameters:**
- `rep_id` (optional)
- `health_status` (optional): `healthy`, `at_risk`, `stalled`
- `sort` (optional): `risk_score_desc`, `amount_desc`

**Response:**
```json
{
  "data": [
    {
      "opportunity_id": "uuid",
      "opportunity_name": "Acme Corp - watsonx.ai",
      "amount": 250000,
      "stage": "Proposal",
      "health_status": "stalled",
      "risk_score": 68,
      "days_in_stage": 21
    }
  ]
}
```

### GET /opportunities/{opportunity_id}/diagnostics

Get opportunity health diagnostics.

**Response:**
```json
{
  "opportunity_id": "uuid",
  "win_probability": 42,
  "risk_score": 68,
  "health_status": "stalled",
  "is_stagnant": true,
  "days_stagnant": 21,
  "primary_issue": "No stakeholder engagement in 21 days",
  "recommended_action": "Schedule executive briefing"
}
```

---

## Activities API

### GET /activity

Get activity metrics for a rep.

**Query Parameters:**
- `rep_id` (required)
- `period` (optional): `last_7_days`, `last_30_days`

**Response:**
```json
{
  "rep_id": "uuid",
  "period": "last_30_days",
  "metrics": {
    "calls": {
      "total_calls": 142,
      "calls_per_day": 6.8,
      "connect_rate": 33.8,
      "meeting_conversion_rate": 12.7
    },
    "emails": {
      "emails_sent": 285,
      "reply_rate": 21.8
    }
  },
  "benchmarks": {
    "team_avg_calls_per_day": 8.2,
    "team_avg_connect_rate": 35.5
  },
  "diagnosis": {
    "issue_type": "skill_issue",
    "description": "Meeting conversion below team average"
  }
}
```

---

## Territories API

### GET /territories/{territory_id}/coverage

Get territory coverage analysis.

**Response:**
```json
{
  "territory_id": "uuid",
  "territory_name": "Northeast Enterprise",
  "assigned_accounts": 85,
  "engaged_accounts": 24,
  "coverage_percentage": 28.2,
  "whitespace_opportunity": 3500000,
  "top_whitespace_accounts": [
    {
      "account_name": "TechCorp Industries",
      "estimated_opportunity": 450000,
      "recommended_product": "watsonx.data",
      "propensity_score": 83
    }
  ]
}
```

---

## Forecast API

### GET /forecast

Get team forecast summary.

**Query Parameters:**
- `manager_id` (required)
- `period` (optional): `current_quarter`, `next_quarter`

**Response:**
```json
{
  "manager_id": "uuid",
  "team_quota": 6000000,
  "team_forecast": {
    "projected_attainment": 4920000,
    "projected_attainment_percent": 82.0,
    "confidence_score": 74,
    "gap_to_quota": 1080000
  },
  "rep_forecasts": [
    {
      "rep_name": "Jordan Lee",
      "projected_attainment": 465000,
      "confidence_score": 68
    }
  ]
}
```

---

## Risk API

### GET /risk/team

Get team risk summary.

**Query Parameters:**
- `manager_id` (required)

**Response:**
```json
{
  "manager_id": "uuid",
  "team_risk_summary": {
    "total_reps": 12,
    "at_risk_count": 3,
    "total_quota_risk": 278000,
    "average_risk_score": 58
  },
  "high_risk_reps": [
    {
      "rep_name": "Jordan Lee",
      "risk_score": 78,
      "quota_gap": 115000
    }
  ]
}
```

---

## Coaching API

### GET /coaching/recommendations

List all coaching recommendations.

**Query Parameters:**
- `manager_id` (required)
- `status` (optional): `pending`, `in_progress`, `completed`
- `priority` (optional): 1-5

**Response:**
```json
{
  "recommendations": [
    {
      "recommendation_id": "uuid",
      "rep_name": "Jordan Lee",
      "priority": 1,
      "category": "Territory Coverage",
      "title": "Increase account engagement",
      "impact_score": 85,
      "status": "pending"
    }
  ]
}
```

### POST /coaching/notes

Create a coaching note.

**Request:**
```json
{
  "rep_id": "uuid",
  "recommendation_id": "uuid",
  "note_type": "coaching_session",
  "subject": "Q2 Performance Review",
  "content": "Discussed territory coverage strategy..."
}
```

**Response: 201 Created**
```json
{
  "note_id": "uuid",
  "created_at": "2026-06-18T10:00:00Z"
}
```

---

## Product Propensity API

### GET /product-propensity

Get product recommendations for accounts.

**Query Parameters:**
- `account_id` (optional): Specific account
- `rep_id` (optional): All accounts for a rep
- `min_score` (optional): Minimum propensity score (0-100)

**Response:**
```json
{
  "recommendations": [
    {
      "account_id": "uuid",
      "account_name": "Acme Corp",
      "product_name": "watsonx.data",
      "propensity_score": 83,
      "cross_sell_score": 78,
      "reasoning": "Existing Db2 customer with data warehouse needs",
      "installed_products": ["Db2", "Guardium"]
    }
  ]
}
```

---

## Manager Copilot API

### POST /copilot/query

Ask the AI copilot a question.

**Request:**
```json
{
  "session_id": "uuid",
  "query": "Why is Jordan behind quota?"
}
```

**Response: 200 OK**
```json
{
  "query_id": "uuid",
  "session_id": "uuid",
  "query": "Why is Jordan behind quota?",
  "response": "Jordan is currently at 77% of quota with a risk score of 78. The primary factors are:\n\n1. **Territory Coverage (28%)**: Significantly below team average of 65%. Only 24 of 85 assigned accounts are engaged.\n\n2. **Opportunity Creation**: Created 8 opportunities vs team average of 14.\n\n3. **Meeting Conversion**: 12.7% conversion rate vs team average of 15.2%.\n\n**Recommended Actions:**\n- Priority 1: Engage 15 additional high-value accounts\n- Priority 2: Create 5 additional qualified opportunities\n- Priority 3: Improve discovery call effectiveness",
  "context_retrieved": {
    "risk_assessment": {...},
    "activity_metrics": {...},
    "territory_coverage": {...}
  },
  "response_time_ms": 1250
}
```

### GET /copilot/sessions

List copilot conversation sessions.

**Query Parameters:**
- `user_id` (required)
- `limit` (optional)

**Response:**
```json
{
  "sessions": [
    {
      "session_id": "uuid",
      "session_start": "2026-06-18T09:00:00Z",
      "query_count": 5,
      "last_query": "What should I focus on this week?"
    }
  ]
}
```

---

## Executive Brief API

### GET /executive-brief

Get executive summary for a manager.

**Query Parameters:**
- `manager_id` (required)
- `period` (optional): `current_week`, `current_month`

**Response:**
```json
{
  "brief_id": "uuid",
  "manager_id": "uuid",
  "brief_date": "2026-06-18",
  "brief_period": "Week of June 14, 2026",
  "summary": "Team pacing at 82% of quota. Opportunity creation declined 14%. Three reps account for $278K of quota risk.",
  "key_metrics": {
    "team_attainment_percent": 82.0,
    "total_pipeline": 12500000,
    "opportunities_created": 42,
    "win_rate": 42.9
  },
  "risk_summary": {
    "at_risk_reps": 3,
    "total_quota_risk": 278000
  },
  "top_coaching_priority": "Jordan Lee - Territory coverage",
  "key_insights": [
    "Opportunity creation declined 14% week-over-week",
    "31% of pipeline stagnant for 21+ days"
  ]
}
```

---

## Simulation API

### POST /simulate

Run a what-if scenario simulation.

**Request:**
```json
{
  "rep_id": "uuid",
  "additional_opportunities": 5,
  "additional_meetings": 10,
  "additional_accounts_touched": 15
}
```

**Response: 200 OK**
```json
{
  "simulation_id": "uuid",
  "rep_id": "uuid",
  "baseline": {
    "risk_score": 78,
    "forecast": 465000,
    "attainment_percent": 93.0
  },
  "simulated": {
    "risk_score": 62,
    "forecast": 510000,
    "attainment_percent": 102.0
  },
  "deltas": {
    "risk_delta": -16,
    "forecast_delta": 45000,
    "attainment_delta": 9.0
  },
  "insights": [
    "Adding 15 accounts would improve coverage to 45%",
    "5 additional opportunities would close quota gap",
    "Risk score would improve from high_risk to watch"
  ]
}
```

---

## Webhook Events

Northstar can send webhook notifications for key events.

### Event Types

| Event | Description |
|-------|-------------|
| `risk.score_updated` | Risk score changed significantly |
| `forecast.generated` | New forecast available |
| `opportunity.stalled` | Opportunity became stalled |
| `recommendation.created` | New coaching recommendation |
| `quota.at_risk` | Rep entered high risk category |

### Webhook Payload

```json
{
  "event_id": "uuid",
  "event_type": "risk.score_updated",
  "timestamp": "2026-06-18T10:00:00Z",
  "data": {
    "rep_id": "uuid",
    "rep_name": "Jordan Lee",
    "old_risk_score": 72,
    "new_risk_score": 78,
    "risk_category": "high_risk"
  }
}
```

---

## API Versioning

- Current version: `v1`
- Version specified in URL: `/api/v1/`
- Breaking changes will increment major version
- Backward-compatible changes will not change version
- Deprecated endpoints will be supported for 12 months

---

## OpenAPI Specification

Full OpenAPI 3.0 specification available at:
`https://api.northstar.ibm.com/openapi.json`

Interactive API documentation:
`https://api.northstar.ibm.com/docs`

---

## SDK Support

Official SDKs available for:
- Python: `pip install northstar-sdk`
- Node.js: `npm install @ibm/northstar-sdk`
- Java: Maven/Gradle support

Example (Python):
```python
from northstar import NorthstarClient

client = NorthstarClient(api_key="your_api_key")
dashboard = client.dashboard.get(manager_id="uuid")
print(dashboard.team_summary.quota_attainment_percent)
```

---

## Support

- API Status: `https://status.northstar.ibm.com`
- Documentation: `https://docs.northstar.ibm.com`
- Support: `northstar-support@ibm.com`