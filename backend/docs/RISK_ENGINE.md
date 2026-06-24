# Quota Risk Scoring Engine
## Northstar AI-Powered Risk Assessment System

**Version:** 1.0  
**Last Updated:** 2026-06-18  
**Owner:** Data Science & Engineering Team

---

## 1. EXECUTIVE SUMMARY

The Quota Risk Engine is the core intelligence component of Northstar. It proactively identifies sales reps at risk of missing quota before performance deteriorates, enabling managers to intervene early with targeted coaching.

**Key Objectives:**
- Predict quota attainment risk with 85%+ accuracy
- Update risk scores daily
- Provide actionable component-level diagnostics
- Support 50,000+ sales users with sub-second response times

---

## 2. RISK SCORING METHODOLOGY

### 2.1 Risk Score Formula

The Quota Risk Score is a weighted composite of five key performance indicators:

```
Quota Risk Score = (
    Pipeline Coverage Score      × 0.30 +
    Opportunity Creation Score   × 0.25 +
    Meeting Activity Score       × 0.20 +
    Account Coverage Score       × 0.15 +
    Conversion Rate Score        × 0.10
) × 100
```

**Output Range:** 0-100 (inverted scale where higher = more risk)

**Risk Categories:**
- **0-30:** Healthy (Green)
- **31-60:** Watch (Yellow)
- **61-100:** High Risk (Red)

### 2.2 Component Score Calculations

#### Pipeline Coverage Score (Weight: 30%)

**Definition:** Measures pipeline adequacy relative to quota.

**Formula:**
```python
target_coverage = 3.0  # 3x quota coverage target
actual_coverage = total_pipeline / remaining_quota

if actual_coverage >= target_coverage:
    score = 0  # No risk
elif actual_coverage >= 2.0:
    score = 30  # Low risk
elif actual_coverage >= 1.5:
    score = 60  # Medium risk
else:
    score = 100  # High risk
```

**Rationale:** Pipeline coverage is the strongest predictor of quota attainment. Reps with <2x coverage have <40% probability of hitting quota.

**Data Sources:**
- Opportunities table (open opportunities)
- Sales_reps table (quota_amount)
- Forecast_snapshots table (closed_won_amount)

---

#### Opportunity Creation Score (Weight: 25%)

**Definition:** Measures opportunity generation pace vs. target.

**Formula:**
```python
days_in_period = days_since_period_start
days_remaining = days_until_period_end
total_period_days = days_in_period + days_remaining

# Calculate required creation rate
required_opps_total = quota / average_deal_size / win_rate
required_opps_remaining = required_opps_total - opps_created_to_date
required_creation_rate = required_opps_remaining / days_remaining

# Calculate actual creation rate
actual_creation_rate = opps_created_to_date / days_in_period

# Score based on pace
pace_ratio = actual_creation_rate / required_creation_rate

if pace_ratio >= 1.2:
    score = 0  # Ahead of pace
elif pace_ratio >= 1.0:
    score = 20  # On pace
elif pace_ratio >= 0.8:
    score = 50  # Slightly behind
elif pace_ratio >= 0.6:
    score = 75  # Behind pace
else:
    score = 100  # Significantly behind
```

**Rationale:** Opportunity creation is a leading indicator. Reps who fall behind early rarely catch up.

**Data Sources:**
- Opportunities table (created_date)
- Sales_reps table (quota_amount, segment)
- Historical win rates and deal sizes by segment

---

#### Meeting Activity Score (Weight: 20%)

**Definition:** Measures meeting generation and execution vs. target.

**Formula:**
```python
# Calculate target meetings per week by segment
target_meetings_per_week = {
    'enterprise': 5,
    'mid_market': 8,
    'smb': 12
}

weeks_in_period = days_in_period / 7
target_meetings = target_meetings_per_week[segment] * weeks_in_period
actual_meetings = count(meetings where was_held = true)

meeting_ratio = actual_meetings / target_meetings

if meeting_ratio >= 1.0:
    score = 0  # Meeting target
elif meeting_ratio >= 0.8:
    score = 30  # Slightly below
elif meeting_ratio >= 0.6:
    score = 60  # Below target
else:
    score = 100  # Significantly below
```

**Rationale:** Meetings are the primary vehicle for advancing opportunities. Low meeting activity correlates with pipeline stagnation.

**Data Sources:**
- Meetings table (scheduled_date, was_held)
- Sales_reps table (segment)

---

#### Account Coverage Score (Weight: 15%)

**Definition:** Measures territory engagement breadth.

**Formula:**
```python
assigned_accounts = count(accounts where owner_id = rep_id)
engaged_accounts = count(accounts where owner_id = rep_id 
                         AND last_activity_date >= 90_days_ago)

coverage_percentage = (engaged_accounts / assigned_accounts) * 100

# Benchmark by segment
target_coverage = {
    'enterprise': 60,  # 60% of accounts engaged
    'mid_market': 70,
    'smb': 80
}

coverage_gap = target_coverage[segment] - coverage_percentage

if coverage_gap <= 0:
    score = 0  # Meeting or exceeding target
elif coverage_gap <= 10:
    score = 30  # Slightly below
elif coverage_gap <= 20:
    score = 60  # Below target
else:
    score = 100  # Significantly below
```

**Rationale:** Territory coverage drives pipeline generation. Low coverage indicates untapped potential and limits opportunity creation.

**Data Sources:**
- Accounts table (owner_id, last_activity_date)
- Territory_coverage table (coverage_percentage)
- Sales_reps table (segment)

---

#### Conversion Rate Score (Weight: 10%)

**Definition:** Measures win rate vs. segment benchmark.

**Formula:**
```python
closed_opps = count(opportunities where is_closed = true)
won_opps = count(opportunities where is_won = true)

if closed_opps >= 5:  # Minimum sample size
    actual_win_rate = (won_opps / closed_opps) * 100
else:
    actual_win_rate = segment_avg_win_rate  # Use segment average

# Benchmark by segment
target_win_rate = {
    'enterprise': 35,
    'mid_market': 40,
    'smb': 45
}

win_rate_gap = target_win_rate[segment] - actual_win_rate

if win_rate_gap <= 0:
    score = 0  # Meeting or exceeding target
elif win_rate_gap <= 5:
    score = 30  # Slightly below
elif win_rate_gap <= 10:
    score = 60  # Below target
else:
    score = 100  # Significantly below
```

**Rationale:** Win rate indicates sales effectiveness. Low win rates suggest skill gaps or poor qualification.

**Data Sources:**
- Opportunities table (is_closed, is_won)
- Historical win rates by segment

---

## 3. RISK TREND ANALYSIS

Risk trend indicates whether risk is improving, stable, or declining.

**Calculation:**
```python
current_score = risk_score_today
previous_score = risk_score_7_days_ago

score_delta = current_score - previous_score

if score_delta <= -5:
    trend = 'improving'
elif score_delta >= 5:
    trend = 'declining'
else:
    trend = 'stable'
```

**Trend Indicators:**
- **Improving:** Risk score decreased by 5+ points in past 7 days
- **Stable:** Risk score changed by <5 points
- **Declining:** Risk score increased by 5+ points

---

## 4. RISK FACTOR IDENTIFICATION

The engine identifies primary and secondary risk factors to guide coaching.

**Algorithm:**
```python
# Rank component scores (higher score = higher risk)
component_scores = {
    'pipeline_coverage': pipeline_coverage_score,
    'opportunity_creation': opportunity_creation_score,
    'meeting_activity': meeting_activity_score,
    'account_coverage': account_coverage_score,
    'conversion_rate': conversion_rate_score
}

# Sort by score descending
ranked_factors = sorted(component_scores.items(), 
                       key=lambda x: x[1], 
                       reverse=True)

primary_risk_factor = ranked_factors[0][0]
secondary_risk_factor = ranked_factors[1][0]

# Map to human-readable descriptions
risk_factor_descriptions = {
    'pipeline_coverage': 'Insufficient pipeline coverage',
    'opportunity_creation': 'Opportunity creation below target',
    'meeting_activity': 'Meeting activity below target',
    'account_coverage': 'Territory coverage below team average',
    'conversion_rate': 'Win rate below segment benchmark'
}
```

---

## 5. IMPLEMENTATION ARCHITECTURE

### 5.1 Service Design

**Technology Stack:**
- **Language:** Python 3.11
- **Framework:** FastAPI
- **ML Framework:** scikit-learn, XGBoost
- **Caching:** Redis
- **Database:** Db2 Warehouse
- **Scheduling:** Apache Airflow

### 5.2 Daily Calculation Pipeline

```
┌─────────────────────────────────────────────────────────────┐
│                    DAILY RISK CALCULATION                   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  Step 1: Data Collection (Airflow DAG)                     │
│  - Fetch all active sales reps                             │
│  - Fetch opportunities, activities, accounts               │
│  - Fetch historical risk scores                            │
│  Time: 2:00 AM UTC daily                                   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  Step 2: Component Score Calculation                       │
│  - Calculate pipeline coverage score                       │
│  - Calculate opportunity creation score                    │
│  - Calculate meeting activity score                        │
│  - Calculate account coverage score                        │
│  - Calculate conversion rate score                         │
│  Parallelized: 1000 reps/minute                           │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  Step 3: Composite Risk Score Calculation                  │
│  - Apply weighted formula                                  │
│  - Determine risk category                                 │
│  - Calculate risk trend                                    │
│  - Identify primary/secondary risk factors                 │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  Step 4: Persistence                                       │
│  - Insert into risk_assessments table                      │
│  - Update Redis cache                                      │
│  - Trigger event: risk.score_updated                       │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  Step 5: Alerting                                          │
│  - Identify reps entering high_risk category               │
│  - Notify managers via email/Slack                         │
│  - Trigger coaching recommendation generation              │
└─────────────────────────────────────────────────────────────┘
```

### 5.3 Real-Time API

**Endpoint:** `GET /api/v1/reps/{rep_id}/risk`

**Flow:**
1. Check Redis cache for risk score (TTL: 1 hour)
2. If cache miss, query risk_assessments table
3. If no recent assessment, trigger on-demand calculation
4. Return risk score with component breakdown

**Performance Target:** <200ms p95 response time

---

## 6. MACHINE LEARNING ENHANCEMENT

### 6.1 ML Model (Phase 2)

While the initial implementation uses rule-based scoring, a machine learning model will enhance accuracy.

**Model Type:** Gradient Boosting (XGBoost)

**Features:**
- Pipeline coverage ratio
- Opportunity creation rate
- Meeting activity rate
- Account coverage percentage
- Win rate
- Days in period
- Tenure months
- Segment
- Historical attainment
- Activity trends (7-day, 30-day)

**Target Variable:** Binary classification (will_hit_quota: yes/no)

**Training Data:**
- Historical data from past 8 quarters
- 50,000+ rep-quarter observations
- Balanced dataset (50/50 hit/miss quota)

**Model Performance Targets:**
- Accuracy: >85%
- Precision: >80% (minimize false positives)
- Recall: >85% (minimize false negatives)
- AUC-ROC: >0.90

**Retraining:** Weekly with latest data

**Deployment:** watsonx.ai model serving

---

## 7. VALIDATION & TESTING

### 7.1 Unit Tests

```python
def test_pipeline_coverage_score():
    """Test pipeline coverage score calculation"""
    assert calculate_pipeline_coverage_score(
        pipeline=1500000, 
        remaining_quota=500000
    ) == 0  # 3x coverage = no risk
    
    assert calculate_pipeline_coverage_score(
        pipeline=750000, 
        remaining_quota=500000
    ) == 60  # 1.5x coverage = medium risk

def test_risk_category():
    """Test risk category assignment"""
    assert get_risk_category(25) == 'healthy'
    assert get_risk_category(45) == 'watch'
    assert get_risk_category(75) == 'high_risk'
```

### 7.2 Integration Tests

```python
def test_end_to_end_risk_calculation():
    """Test complete risk calculation pipeline"""
    rep_id = create_test_rep()
    create_test_opportunities(rep_id, count=5)
    create_test_activities(rep_id, count=50)
    
    risk_score = calculate_risk_score(rep_id)
    
    assert risk_score >= 0 and risk_score <= 100
    assert risk_score.risk_category in ['healthy', 'watch', 'high_risk']
```

### 7.3 Backtesting

Validate model accuracy against historical data:

```python
# Test against Q1 2026 data
predictions = []
actuals = []

for rep in reps_q1_2026:
    predicted_risk = calculate_risk_score(rep, as_of_date='2026-03-01')
    actual_attainment = get_actual_attainment(rep, period='Q1 2026')
    
    predictions.append(predicted_risk)
    actuals.append(1 if actual_attainment >= 100 else 0)

accuracy = calculate_accuracy(predictions, actuals)
assert accuracy >= 0.85  # 85% accuracy target
```

---

## 8. MONITORING & OBSERVABILITY

### 8.1 Key Metrics

**Calculation Performance:**
- Risk calculation time per rep (target: <100ms)
- Daily calculation completion time (target: <30 minutes)
- Cache hit rate (target: >90%)

**Model Performance:**
- Prediction accuracy (weekly)
- False positive rate
- False negative rate
- Score distribution

**Business Metrics:**
- % of reps in each risk category
- Average risk score by segment
- Risk score trend (improving/declining)

### 8.2 Alerts

**Critical Alerts:**
- Risk calculation failure
- Calculation time >1 hour
- Model accuracy <80%

**Warning Alerts:**
- Cache hit rate <80%
- Calculation time >45 minutes
- >30% of reps in high_risk category

---

## 9. EXAMPLE CALCULATIONS

### Example 1: High Risk Rep

**Rep Profile:**
- Quota: $500,000
- Attainment: $350,000 (70%)
- Remaining Quota: $150,000
- Days Remaining: 15

**Component Scores:**
- Pipeline Coverage: 85 (pipeline: $200K, coverage: 1.3x)
- Opportunity Creation: 75 (created 6 vs target 12)
- Meeting Activity: 45 (16 meetings vs target 20)
- Account Coverage: 90 (25% coverage vs target 65%)
- Conversion Rate: 40 (35% win rate vs target 40%)

**Composite Risk Score:**
```
(85 × 0.30) + (75 × 0.25) + (45 × 0.20) + (90 × 0.15) + (40 × 0.10)
= 25.5 + 18.75 + 9.0 + 13.5 + 4.0
= 70.75
```

**Risk Category:** High Risk

**Primary Risk Factor:** Account Coverage (score: 90)
**Secondary Risk Factor:** Pipeline Coverage (score: 85)

---

### Example 2: Healthy Rep

**Rep Profile:**
- Quota: $500,000
- Attainment: $420,000 (84%)
- Remaining Quota: $80,000
- Days Remaining: 15

**Component Scores:**
- Pipeline Coverage: 10 (pipeline: $280K, coverage: 3.5x)
- Opportunity Creation: 15 (created 14 vs target 12)
- Meeting Activity: 5 (22 meetings vs target 20)
- Account Coverage: 20 (68% coverage vs target 65%)
- Conversion Rate: 10 (42% win rate vs target 40%)

**Composite Risk Score:**
```
(10 × 0.30) + (15 × 0.25) + (5 × 0.20) + (20 × 0.15) + (10 × 0.10)
= 3.0 + 3.75 + 1.0 + 3.0 + 1.0
= 11.75
```

**Risk Category:** Healthy

**Primary Risk Factor:** Account Coverage (score: 20)
**Secondary Risk Factor:** Opportunity Creation (score: 15)

---

## 10. API RESPONSE FORMAT

```json
{
  "rep_id": "uuid",
  "assessment_date": "2026-06-18",
  "quota_risk_score": 71,
  "risk_category": "high_risk",
  "risk_trend": "declining",
  "component_scores": {
    "pipeline_coverage": {
      "score": 85,
      "weight": 0.30,
      "contribution": 25.5,
      "status": "critical",
      "actual": 1.3,
      "target": 3.0,
      "gap": -1.7
    },
    "opportunity_creation": {
      "score": 75,
      "weight": 0.25,
      "contribution": 18.75,
      "status": "below_target",
      "actual": 6,
      "target": 12,
      "gap": -6
    },
    "meeting_activity": {
      "score": 45,
      "weight": 0.20,
      "contribution": 9.0,
      "status": "below_target",
      "actual": 16,
      "target": 20,
      "gap": -4
    },
    "account_coverage": {
      "score": 90,
      "weight": 0.15,
      "contribution": 13.5,
      "status": "critical",
      "actual": 25,
      "target": 65,
      "gap": -40
    },
    "conversion_rate": {
      "score": 40,
      "weight": 0.10,
      "contribution": 4.0,
      "status": "on_target",
      "actual": 35,
      "target": 40,
      "gap": -5
    }
  },
  "primary_risk_factor": "Territory coverage below team average",
  "secondary_risk_factor": "Insufficient pipeline coverage"
}
```

---

## 11. FUTURE ENHANCEMENTS

### Phase 2 (Q3 2026)
- ML model deployment for enhanced accuracy
- Predictive risk scoring (30-day, 60-day forecasts)
- Anomaly detection for sudden risk changes

### Phase 3 (Q4 2026)
- Personalized risk thresholds by rep tenure
- Seasonal adjustment factors
- Multi-period risk trending

### Phase 4 (2027)
- Real-time risk updates (hourly)
- Prescriptive recommendations (auto-generated action plans)
- Integration with sales enablement tools

---

## 12. REFERENCES

- Sales Performance Research: "Leading Indicators of Quota Attainment" (Gartner, 2025)
- IBM Sales Methodology: Territory Coverage Best Practices
- Historical Northstar Data Analysis (Q1 2024 - Q1 2026)