# Quick Start Guide for PipelineIQ

## Installation & Setup (5 minutes)

### Step 1: Start PostgreSQL
```bash
# Using Docker (recommended)
docker run -d \
  -e POSTGRES_USER=pipelineiq \
  -e POSTGRES_PASSWORD=pipelineiq_password \
  -e POSTGRES_DB=pipelineiq \
  -p 5432:5432 \
  --name pipelineiq-db \
  postgres:15-alpine
```

Or use your local PostgreSQL installation.

### Step 2: Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy env file
cp .env.example .env

# Initialize database and seed demo data
python init_db.py

# Run server
uvicorn main:app --reload
```

✓ Backend ready at `http://localhost:8000`

### Step 3: Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Copy env file
cp .env.example .env.local

# Run dev server
npm run dev
```

✓ Frontend ready at `http://localhost:3000`

## 🎬 Demo Walkthrough

1. **Open** `http://localhost:3000`
2. **Click** "Try Demo"
3. **Auto-seeding** creates:
   - Demo company: TechFlow SaaS
   - 12 campaigns (Google, LinkedIn, Meta)
   - 300 leads with realistic data
   - Attribution calculations

4. **Explore Dashboard:**
   - KPI cards showing spend, pipeline, revenue
   - Sales funnel visualization
   - Revenue by channel
   - Top campaigns by ROAS

5. **View Analytics:**
   - Toggle attribution models
   - See deal probability scores
   - Review budget optimization recommendations

6. **Check Campaigns:**
   - View all 12 campaigns
   - See platform, budget, impressions, clicks

## 🔑 Key Features to Try

### Attribution Models (Analytics Tab)
- **Linear**: Equal weight across touchpoints
- **First-Touch**: 100% to first interaction
- **Last-Touch**: 100% to last interaction
- **Time-Decay**: Exponential weight increase

### Budget Optimizer (AI Insights)
- Recommendations to increase high-ROAS campaigns
- Alerts for underperforming campaigns
- CAC efficiency insights
- Creative improvement suggestions

### Dashboard KPIs
- Total Ad Spend: ₹226,000
- Pipeline Value: ₹2,345,000 estimated
- Revenue Attributed: Varies by model
- ROAS: 2–5x range
- CAC: ₹500–₹1,000

## 🛑 Troubleshooting

### Database Connection Error
```bash
# Check PostgreSQL is running
psql -U pipelineiq -d pipelineiq -h localhost

# If connection fails:
# - Update DATABASE_URL in .env
# - Restart PostgreSQL
# - Run: python init_db.py again
```

### Frontend API Errors
```bash
# Check backend is running at port 8000
curl http://localhost:8000/health

# Update NEXT_PUBLIC_API_URL in .env.local if needed
```

### Module Not Found (Backend)
```bash
# Reinstall dependencies
pip install --force-reinstall -r requirements.txt
```

### Port Already in Use
```bash
# Default ports:
# Backend: 8000
# Frontend: 3000
# PostgreSQL: 5432

# Run on different port:
uvicorn main:app --port 8001
npm run dev -- -p 3001
```

## 📊 API Endpoints

All endpoints require demo or login authentication.

### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Get JWT token
- `GET /api/auth/me` - Get current user

### Analytics (Most important)
- `GET /api/analytics/overview/{company_id}` - KPI dashboard
- `GET /api/analytics/funnel/{company_id}` - Sales funnel
- `GET /api/analytics/revenue-by-channel/{company_id}` - Channel revenue
- `GET /api/analytics/top-campaigns/{company_id}` - Best campaigns
- `GET /api/analytics/deal-probability/{company_id}` - AI scoring
- `GET /api/analytics/budget-optimization/{company_id}` - Recommendations

### Data Management
- `GET /api/companies/` - List companies
- `GET /api/campaigns/company/{company_id}` - List campaigns
- `GET /api/leads/company/{company_id}` - List leads

### Attribution
- `POST /api/attribution/calculate/{lead_id}?model=linear` - Calculate attribution
- `GET /api/attribution/revenue/{company_id}?model=linear` - Revenue by model
- `GET /api/attribution/summary/{company_id}` - Attribution summary

## 🔗 Interactive Docs

**Swagger UI**: `http://localhost:8000/docs`
**ReDoc**: `http://localhost:8000/redoc`

Test all APIs directly in your browser!

## 📈 Production Checklist

Before deploying:
- [ ] Update `SECRET_KEY` in backend .env
- [ ] Enable HTTPS/SSL
- [ ] Configure `ORIGINS` in CORS settings
- [ ] Use managed PostgreSQL
- [ ] Set up environment variables
- [ ] Configure database backups
- [ ] Enable rate limiting
- [ ] Add monitoring and logging
- [ ] Set up CI/CD pipeline

## 🎯 Next Steps

1. **Customize Demo Data**: Edit `backend/app/api/routes/seed.py`
2. **Add New Campaigns**: Use `/api/campaigns/` endpoint
3. **Create Leads Manually**: Use `/api/leads/` endpoint
4. **Test Attribution Models**: Switch in Analytics tab
5. **Review Recommendations**: Check budget optimizer

## 💬 Common Questions

**Q: How do I seed different data?**
A: Edit `backend/app/api/routes/seed.py` and run `python init_db.py` again.

**Q: Can I use SQLite instead of PostgreSQL?**
A: Yes, change `DATABASE_URL` in `.env` to `sqlite:///pipelineiq.db`

**Q: How do I clear the database?**
A: Delete the database and run `python init_db.py` to reseed.

**Q: Is authentication required?**
A: Yes, all endpoints except `/api/seed/` require JWT token.

---

**You're all set! Happy analyzing!** 🚀
