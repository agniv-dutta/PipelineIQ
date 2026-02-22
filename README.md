# PipelineIQ - AI Revenue Attribution MVP

**AI-powered revenue attribution and GTM intelligence platform for mid-size B2B SaaS companies.**

## 🎯 Product Overview

PipelineIQ is a production-ready MVP that demonstrates:

- **Multi-touch Attribution** - Linear, First-Touch, Last-Touch, Time-Decay models
- **Revenue Mapping** - Track revenue attribution across all marketing channels
- **Campaign Intelligence** - Real-time campaign performance metrics and ROAS
- **AI Deal Probability Scoring** - ML-powered lead close probability predictions
- **Budget Optimization Recommendations** - Data-driven budget allocation suggestions
- **Enterprise Dashboard** - Dark mode, Recharts visualizations, real-time KPIs

## 🏗️ Tech Stack

### Backend
- **Python 3.11+**
- **FastAPI** - Modern async REST API
- **PostgreSQL** - Production database
- **SQLAlchemy ORM** - Database ORM
- **Scikit-learn** - ML for deal probability
- **Pydantic** - Data validation
- **JWT Authentication** - Secure API access

### Frontend
- **Next.js 14** (App Router)
- **React 18** + TypeScript
- **TailwindCSS** - Styling
- **Recharts** - Data visualization
- **Zustand** - State management

## 📦 Project Structure

```
deltax b2b/
├── backend/
│   ├── app/
│   │   ├── api/routes/        # API endpoints
│   │   ├── core/              # Config & security
│   │   ├── db/                # Database setup
│   │   ├── ml/                # ML services
│   │   ├── models/            # SQLAlchemy models
│   │   ├── schemas/           # Pydantic schemas
│   │   └── services/          # Business logic
│   ├── main.py                # FastAPI app
│   ├── init_db.py             # Database seeding
│   ├── requirements.txt        # Dependencies
│   └── .env.example           # Environment template
│
└── frontend/
    ├── app/
    │   ├── auth/              # Auth pages
    │   ├── dashboard/         # Main dashboard
    │   ├── analytics/         # Analytics pages
    │   └── campaigns/         # Campaign management
    ├── components/            # React components
    ├── lib/                   # Utils & APIs
    ├── styles/                # CSS
    ├── package.json
    └── .env.example
```

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL 13+
- pip, npm/yarn

### Backend Setup

1. **Navigate to backend:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Setup environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your PostgreSQL credentials
   ```

5. **Initialize database:**
   ```bash
   python init_db.py
   ```

6. **Run backend:**
   ```bash
   uvicorn main:app --reload
   ```
   Backend runs at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or yarn install
   ```

3. **Setup environment:**
   ```bash
   cp .env.example .env.local
   # NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

4. **Run frontend:**
   ```bash
   npm run dev
   ```
   Frontend runs at `http://localhost:3000`

## 🧪 Testing the MVP

### Demo Mode
1. Go to `http://localhost:3000`
2. Click **"Try Demo"** button
3. Database automatically seeds with:
   - 1 demo company (TechFlow SaaS)
   - 12 realistic campaigns
   - 300 leads with touchpoints
   - Real B2B SaaS metrics

### Manual Login
Create an account via Sign Up page and log in.

## 📊 Core Features

### 1. Authentication
- JWT-based authentication
- Sign up / Login pages
- Protected routes
- Access token management

### 2. Multi-Touch Attribution
Four attribution models available:
- **Linear**: Equal weight across all touchpoints
- **First-Touch**: 100% credit to first interaction
- **Last-Touch**: 100% credit to last interaction
- **Time-Decay**: Exponential weight increase towards conversion

Toggle models in Analytics → Attribution Models tab.

### 3. Dashboard Overview
KPIs displayed:
- Total Ad Spend (₹)
- Pipeline Value (₹)
- Revenue Attributed (₹)
- ROAS (Return on Ad Spend)
- CAC (Customer Acquisition Cost)
- Conversion Rate (%)

### 4. Sales Funnel Visualization
Displays leads by stage:
- MQL → SQL → Opportunity → Won/Lost
- Real funnel metrics from database

### 5. Revenue by Channel
Bar chart showing attributed revenue:
- Google / LinkedIn / Meta
- Real campaign data
- ROAS per channel

### 6. Top Campaigns Table
- Campaign name & platform
- Spend and attributed revenue
- ROAS ranking
- Real-time calculations

### 7. AI Insights Tab
- **Deal Probability**: ML-scored leads with close probability
- **Budget Optimizer**: 
  - Increase budget for high-ROAS campaigns
  - Reduce spend on low-performing campaigns
  - Confidence scores for recommendations
  - Priority levels (High/Medium/Low)

### 8. Campaign Management
- View all campaigns
- Platform, budget, impressions, clicks
- Real impression/click data
- Campaign details page

## 🤖 ML Features

### Deal Probability Scoring
Uses **Logistic Regression** with features:
- Number of touchpoints
- Campaign spend
- Industry classification
- Lead stage
- Deal value
- Outputs: 0-100% close probability

### Budget Optimization Engine
Recommendations based on:
- ROAS vs. average
- CAC efficiency
- Conversion rates
- Lead quality
- CTR and CPC metrics

Recommendations are prioritized and confidence-scored.

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/signup       - Create account
POST   /api/auth/login        - Get JWT token
GET    /api/auth/me           - Current user
```

### Companies
```
GET    /api/companies/
GET    /api/companies/{id}
POST   /api/companies/
PUT    /api/companies/{id}
DELETE /api/companies/{id}
```

### Campaigns
```
GET    /api/campaigns/company/{company_id}
GET    /api/campaigns/{id}
POST   /api/campaigns/
PUT    /api/campaigns/{id}
DELETE /api/campaigns/{id}
```

### Leads
```
GET    /api/leads/company/{company_id}
GET    /api/leads/{id}
POST   /api/leads/
PUT    /api/leads/{id}
DELETE /api/leads/{id}
```

### Attribution
```
POST   /api/attribution/calculate/{lead_id}?model={model}
GET    /api/attribution/revenue/{company_id}?model={model}
GET    /api/attribution/summary/{company_id}
```

### Analytics
```
GET    /api/analytics/overview/{company_id}
GET    /api/analytics/funnel/{company_id}
GET    /api/analytics/revenue-by-channel/{company_id}
GET    /api/analytics/top-campaigns/{company_id}?limit=5
GET    /api/analytics/deal-probability/{company_id}
GET    /api/analytics/budget-optimization/{company_id}
```

### Seed Data
```
POST   /api/seed/             - Populate demo data
```

## 🎨 Design System

### Color Scheme
- **Primary**: Indigo (#4f46e5)
- **Secondary**: Indigo (#6366f1)
- **Accent**: Cyan (#06b6d4)
- **Background**: Slate-950 (#030712)
- **Borders**: Slate-800 (#1e293b)

### Dark Mode
- Default dark mode enabled
- Tailwind dark mode utilities
- High contrast ratios for accessibility

### Components
- **KPI Cards**: Overview metrics with icons
- **Chart Cards**: Data visualizations with borders
- **Tables**: Clean, hoverable rows
- **Buttons**: Primary, secondary, ghost variants
- **Forms**: Styled inputs with validation

## 🐳 Docker Support

### Build and Run with Docker

1. **Backend Docker:**
   ```bash
   cd backend
   docker build -t pipelineiq-backend .
   docker run -p 8000:8000 --env-file .env pipelineiq-backend
   ```

2. **Frontend Docker:**
   ```bash
   cd frontend
   docker build -t pipelineiq-frontend .
   docker run -p 3000:3000 pipelineiq-frontend
   ```

3. **Docker Compose (Full Stack):**
   ```bash
   docker-compose up
   ```

## 🔐 Security

- **JWT Authentication**: All API endpoints protected
- **Password Hashing**: Bcrypt with salting
- **CORS Configuration**: Restricted origins
- **Input Validation**: Pydantic schema validation
- **Environment Variables**: Sensitive data in .env
- **SQL Injection Protection**: SQLAlchemy ORM

## 📈 Seed Data

Demo company includes:
- **Company**: TechFlow SaaS
- **Industry**: SaaS
- **Annual Ad Spend**: ₹240,000
- **Campaigns**: 12 across Google, LinkedIn, Meta
- **Leads**: 300 with realistic stage distribution
- **Goal**: Demonstrate complete attribution flow

## 🚀 Production Deployment

### Backend (Uvicorn + Gunicorn)
```bash
gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app
```

### Frontend (Next.js Production Build)
```bash
npm run build && npm run start
```

### Database
- Use managed PostgreSQL (AWS RDS, DigitalOcean, etc.)
- Enable backups and monitoring
- Configure connection pooling

## 📝 Future Enhancements

- [ ] PDF export of attribution reports
- [ ] CSV download of campaign data
- [ ] 90-day revenue forecasting
- [ ] Custom attribution model builder
- [ ] Real-time dashboards with WebSocket
- [ ] Integration with Salesforce, HubSpot
- [ ] Advanced ML: propensity modeling, churn prediction
- [ ] Multi-currency support
- [ ] Team collaboration features

## 🤝 Contributing

This is a demo MVP. For production use, consider:
- Enhanced error handling
- Rate limiting
- Caching (Redis)
- Background jobs (Celery)
- Advanced testing
- CI/CD pipeline
- Kubernetes deployment

## 📄 License

MIT License - Created for demonstration purposes.

## 📞 Support

For issues and questions, refer to the API documentation at `/docs` (Swagger UI) when running the backend.

---

**Built with ❤️ for revenue teams that demand clarity.**
