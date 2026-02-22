# PipelineIQ MVP - Architecture & Implementation Guide

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend Layer                        │
│  Next.js 14 + React 18 + TypeScript + TailwindCSS + Recharts│
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Pages:                                                      │
│  ├── / (Landing)                                            │
│  ├── /auth/login                                            │
│  ├── /auth/signup                                           │
│  ├── /dashboard (KPIs, Funnel, Revenue Chart)              │
│  ├── /analytics (Attribution, AI Insights)                 │
│  └── /campaigns (Campaign Management)                       │
│                                                              │
│  Components:                                                │
│  ├── Layout (Navbar, Sidebar)                              │
│  ├── Dashboard (Overview, Charts)                           │
│  └── Analytics (Attribution, Insights)                     │
│                                                              │
│  Utilities:                                                 │
│  ├── API Client (axios)                                    │
│  ├── State Management (Zustand)                            │
│  └── Helpers (currency, numbers)                           │
│                                                              │
└────────────────────┬──────────────┬───────────────────────────┘
                     │              │
                 REST API       WebSocket
                  (HTTP)         (Optional)
                     │              │
┌────────────────────├──────────────┴───────────────────────────┐
│                      API Gateway v1                            │
│  FastAPI + Pydantic + CORS + Rate Limiting                     │
├──────────────────────────────────────────────────────────────┤
│                                                                │
│  Routes:                                                       │
│  ├── /api/auth/{signup,login,me}                             │
│  ├── /api/companies/                                         │
│  ├── /api/campaigns/                                         │
│  ├── /api/leads/                                             │
│  ├── /api/attribution/                                       │
│  └── /api/analytics/                                         │
│                                                                │
│  Middleware:                                                  │
│  ├── CORS (Cross-Origin)                                     │
│  ├── JWT Authentication                                      │
│  └── Error Handling                                           │
│                                                                │
└────────────────────┬───────────────────────────────────────────┘
                     │
                     │ SQL Queries
                     │
┌────────────────────┴───────────────────────────────────────────┐
│                    Service Layer                               │
├──────────────────────────────────────────────────────────────┤
│                                                                │
│  Services:                                                     │
│  ├── AuthService                                             │
│  │   ├── create_user()                                       │
│  │   ├── authenticate_user()                                 │
│  │   └── get_user()                                          │
│  │                                                             │
│  ├── AttributionService                                      │
│  │   ├── calculate_linear_attribution()                      │
│  │   ├── calculate_first_touch_attribution()                 │
│  │   ├── calculate_last_touch_attribution()                  │
│  │   ├── calculate_time_decay_attribution()                  │
│  │   └── save_attribution_results()                          │
│  │                                                             │
│  ├── DealProbabilityService                                  │
│  │   ├── train_model()                                       │
│  │   ├── predict_probability()                               │
│  │   └── get_high_probability_leads()                        │
│  │                                                             │
│  └── BudgetOptimizationService                               │
│      ├── get_campaign_metrics()                              │
│      └── get_optimization_recommendations()                  │
│                                                                │
└────────────────────┬───────────────────────────────────────────┘
                     │
                     │ ORM Mapping
                     │
┌────────────────────┴───────────────────────────────────────────┐
│                    Data Access Layer                           │
│              SQLAlchemy + Pydantic Schemas                     │
├──────────────────────────────────────────────────────────────┤
│                                                                │
│  Models:                                                       │
│  ├── User ──────────┐                                        │
│  ├── Company        │                                        │
│  │   ├── campaigns  │                                        │
│  │   └── leads      │                                        │
│  ├── Campaign ──────┤                                        │
│  │   ├── company    │                                        │
│  │   ├── leads      │                                        │
│  │   └── attributions                                        │
│  ├── Lead ─────────┤                                        │
│  │   ├── company   │                                        │
│  │   ├── source_campaign                                     │
│  │   └── attributions                                        │
│  └── AttributionResult                                       │
│      ├── lead                                                │
│      └── campaign                                            │
│                                                                │
│  Relationships:                                               │
│  • One-to-Many: Company → Campaigns, Company → Leads        │
│  • One-to-Many: Campaign → Leads, Campaign → Attributions   │
│  • One-to-Many: Lead → Attributions                          │
│                                                                │
└────────────────────┬───────────────────────────────────────────┘
                     │
                     │ SQL Transactions
                     │
┌────────────────────┴───────────────────────────────────────────┐
│                     Database Layer                             │
│                  PostgreSQL 13+                                │
├──────────────────────────────────────────────────────────────┤
│                                                                │
│  Tables:                                                       │
│  ├── users (id PK, email UK, password, role, company_id FK) │
│  ├── companies (id PK, name UK, industry, annual_ad_spend)  │
│  ├── campaigns (id PK, company_id FK, name, platform, ...)  │
│  ├── leads (id PK, company_id FK, source_campaign_id FK, ...) │
│  └── attribution_results (id PK, lead_id FK, campaign_id FK) │
│                                                                │
│  Indexes:                                                      │
│  • email (users)                                             │
│  • company_id (campaigns, leads)                             │
│  • lead_id (attribution_results)                             │
│  • stage (leads)                                             │
│                                                                │
└──────────────────────────────────────────────────────────────┘
```

## Request/Response Flow

### 1. Dashboard Overview Request
```
User clicks Dashboard
         ↓
Frontend GET /api/analytics/overview/1
         ↓
Backend receives request
         ↓
analyticsAPI.getOverview(company_id)
         ↓
Queries:
  - Sum(campaigns.cost) for total_spend
  - Sum(leads.deal_value) for pipeline_value
  - Sum(attribution_results.attributed_revenue) for revenue
         ↓
Returns JSON:
{
  "company_id": 1,
  "total_ad_spend": 226000,
  "pipeline_value": 2345000,
  "revenue_attributed": 892300,
  "roas": 3.95,
  "cac": 752.67,
  ...
}
         ↓
Frontend renders KPI cards with values
```

### 2. Attribution Calculation Flow
```
User selects attribution model
         ↓
Frontend POST /api/attribution/calculate/5?model=linear
         ↓
Backend AttributionService.calculate_attribution_for_lead()
         ↓
Fetch Lead.touchpoints = [1, 3, 2]
         ↓
Calculate weights:
  - Linear: 1/3 = 0.333 per touchpoint
  - First: [1.0, 0, 0]
  - Last: [0, 0, 1.0]
  - TimeDecay: [0.25, 0.36, 0.64] (normalized)
         ↓
Assign revenue: 
  - revenue = lead.deal_value * weight
         ↓
Save attributions to database
         ↓
Return results to frontend
```

### 3. Budget Recommendation Flow
```
User views AI Insights
         ↓
Frontend GET /api/analytics/budget-optimization/1
         ↓
BudgetOptimizationService.get_optimization_recommendations()
         ↓
For each campaign:
  1. Calculate ROAS = attributed_revenue / cost
  2. Compare to average ROAS
  3. Calculate CAC
  4. Analyze CTR and conversions
  5. Generate recommendation based on thresholds
         ↓
Recommendations ranked by:
  - Priority (High/Medium/Low)
  - Confidence score (0-1)
         ↓
Return top 10 to frontend
         ↓
Frontend displays cards with action items
```

## Data Model Relationships

```
┌─────────────┐         ┌──────────────┐
│    User     │         │   Company    │
├─────────────┤         ├──────────────┤
│ id (PK)     │◄────────│ id (PK)      │
│ email       │ 1:many  │ name         │
│ password    │         │ industry     │
│ role        │         │ annual_spend │
└─────────────┘         └──────┬───────┘
                                │
                    ┌───────────┴───────────┐
                    │                       │
              1:many│                       │1:many
              ┌────▼──────────┐      ┌──────▼────────┐
              │   Campaign    │      │     Lead      │
              ├───────────────┤      ├───────────────┤
              │ id (PK)       │      │ id (PK)       │
              │ company_id FK │      │ company_id FK │
              │ name          │      │ source_campaign_id FK
              │ platform      │      │ email         │
              │ budget        │      │ touchpoints[] │
              │ cost          │      │ stage         │
              │ impressions   │      │ deal_value    │
              │ clicks        │      └──────┬────────┘
              └────┬──────────┘             │
                   │            1:many     │
                   │            ◄──────────┘
                   │
              1:many│
              ┌─────▼────────────────┐
              │  AttributionResult   │
              ├──────────────────────┤
              │ id (PK)              │
              │ lead_id FK           │
              │ campaign_id FK       │
              │ model                │
              │ weighted_attribution │
              │ attributed_revenue   │
              └──────────────────────┘
```

## Attribution Model Calculations

### Linear Attribution
```
Touchpoints: [Campaign1, Campaign2, Campaign3]
Lead Deal Value: ₹30,000

Calculation:
  weight = 1 / 3 = 0.333
  revenue_per_touch = ₹30,000 * 0.333 = ₹10,000
  
Result:
  Campaign1: ₹10,000 (0.333)
  Campaign2: ₹10,000 (0.333)
  Campaign3: ₹10,000 (0.333)
```

### First-Touch Attribution
```
Touchpoints: [Campaign1, Campaign2, Campaign3]
Lead Deal Value: ₹30,000

Calculation:
  weight_first = 1.0
  weight_rest = 0.0
  
Result:
  Campaign1: ₹30,000 (1.0)
  Campaign2: ₹0 (0.0)
  Campaign3: ₹0 (0.0)
```

### Last-Touch Attribution
```
Touchpoints: [Campaign1, Campaign2, Campaign3]
Lead Deal Value: ₹30,000

Calculation:
  weight_last = 1.0
  weight_rest = 0.0
  
Result:
  Campaign1: ₹0 (0.0)
  Campaign2: ₹0 (0.0)
  Campaign3: ₹30,000 (1.0)
```

### Time-Decay Attribution
```
Touchpoints: [Campaign1, Campaign2, Campaign3]
Lead Deal Value: ₹30,000
Decay Rate: 0.5

Calculation:
  weights_raw:
    Campaign1: 0.5^2 = 0.25
    Campaign2: 0.5^1 = 0.50
    Campaign3: 0.5^0 = 1.00
  
  total = 0.25 + 0.50 + 1.00 = 1.75
  
  normalized:
    Campaign1: 0.25/1.75 = 0.143
    Campaign2: 0.50/1.75 = 0.286
    Campaign3: 1.00/1.75 = 0.571
  
Result:
  Campaign1: ₹4,290 (0.143)
  Campaign2: ₹8,580 (0.286)
  Campaign3: ₹17,130 (0.571)
```

## ML Model: Deal Probability Scoring

### Training Data
```python
Features:
  [num_touchpoints, campaign_spend, industry, stage, deal_value]

Examples:
  [2, 5000, 1, 3, 25000]  → Won (1)
  [1, 1000, 2, 1, 5000]   → Lost (0)
  [4, 15000, 1, 2, 40000] → Won (1)
  ...300+ samples
```

### Prediction Pipeline
```
Input features
    ↓
StandardScaler.transform()
    ↓
LogisticRegression.predict_proba()
    ↓
probability_won = predict_proba()[1]
    ↓
result = probability * 100  (0-100%)
```

### Feature Engineering
```
num_touchpoints:    int (1-4)
campaign_spend:     float (sum of all campaigns touched)
industry:           int (0-4, mapped from string)
stage:              int (MQL=1, SQL=2, Opportunity=3, Won=4, Lost=0)
deal_value:         float (normalized: value/1000)
```

## Budget Optimization Logic

### ROAS Analysis
```
ROAS = attributed_revenue / cost
Average ROAS = sum(all_roas) / num_campaigns

if campaign_roas > avg_roas * 1.5:
  → Recommendation: INCREASE budget (high confidence)
elif campaign_roas < avg_roas * 0.7:
  → Recommendation: REDUCE budget (medium confidence)
```

### CAC Efficiency
```
CAC = cost / num_leads
Average CAC = sum(all_cac) / num_campaigns

if campaign_cac < avg_cac * 0.5:
  → Insight: Efficient acquisition channel
```

### CTR Analysis
```
CTR = clicks / impressions * 100

if ctr < 0.5% and impressions > 1000:
  → Recommendation: Improve creative (test new ads)
```

## API Response Format

### Success Response
```json
{
  "company_id": 1,
  "company_name": "TechFlow SaaS",
  "data": {...}
}
```

### Error Response
```json
{
  "detail": "Company not found"
}
```

### Pagination (Dashboard)
```json
{
  "company_id": 1,
  "campaigns": [
    {
      "campaign_id": 1,
      "campaign_name": "Google Search - Growth",
      "platform": "Google",
      "roas": 2.50,
      ...
    }
  ]
}
```

## Authentication Flow

### Login Flow
```
User enters email & password
    ↓
Frontend POST /api/auth/login
    ↓
Backend finds user by email
    ↓
verify_password(input, stored_hash)
    ↓
If valid:
  create_access_token(user_id, expires_delta=30min)
    ↓
Return JWT token
    ↓
Frontend stores token (Zustand)
    ↓
Add to all requests: Authorization: Bearer {token}
```

### Protected Route
```
Frontend requests /api/analytics/overview/1
    ↓
FastAPI checks Authorization header
    ↓
jwt.decode(token, SECRET_KEY)
    ↓
If valid:
  Proceed with request
    ↓
If expired/invalid:
  Return 401 Unauthorized
```

## Performance Considerations

### Database Queries
- Indexed columns: email, company_id, lead_id, campaign_id, stage
- Eager loading relationships to prevent N+1
- Aggregation functions (SUM, COUNT) for KPIs

### Frontend Optimization
- Client-side state with Zustand
- Memoized components with React.memo
- Image optimization with Next.js Image
- Code splitting via dynamic imports

### Caching Opportunities
- Cache KPI calculations (5-minute TTL)
- Cache attribution results per model
- Cache campaign metrics

## Monitoring & Logging

### Backend Logging
```python
import logging

logger = logging.getLogger(__name__)
logger.info(f"User {user_id} logged in")
logger.error(f"Database error: {str(e)}")
```

### Frontend Error Tracking
```typescript
try {
  await analyticsAPI.getOverview(companyId)
} catch (error) {
  console.error('Failed to fetch overview:', error)
  // Send to error tracking service
}
```

## Production Checklist

- [ ] Update SECRET_KEY in production
- [ ] Enable HTTPS/TLS
- [ ] Configure PostgreSQL backups
- [ ] Set up monitoring (Sentry, DataDog)
- [ ] Enable rate limiting (SlowAPI)
- [ ] Configure CDN for static assets
- [ ] Set up CI/CD pipeline
- [ ] Database query optimization
- [ ] Load testing with k6
- [ ] Security audit
- [ ] Update API documentation

---

**This architecture ensures scalability, maintainability, and production-readiness.**
