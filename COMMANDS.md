# PipelineIQ - Command Reference Guide

## Quick Commands

### Start Everything (Docker)
```bash
docker-compose up
# Starts PostgreSQL, backend, frontend, all connected
```

### Start Everything (Manual)
```bash
# Terminal 1 - Backend
cd backend
source venv/bin/activate
python init_db.py
uvicorn main:app --reload

# Terminal 2 - Frontend
cd frontend
npm run dev

# Terminal 3 - PostgreSQL (if local)
# Make sure PostgreSQL is running
```

## Backend Commands

### Initial Setup
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate (Linux/Mac)
source venv/bin/activate

# Activate (Windows)
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env
```

### Database
```bash
# Initialize and seed database
python init_db.py

# Reset database (delete and recreate)
python -c "from app.db.database import engine, Base; Base.metadata.drop_all(engine); Base.metadata.create_all(engine)"

# Connect to PostgreSQL directly
psql -U pipelineiq -d pipelineiq -h localhost
```

### Running Backend
```bash
# Development (with auto-reload)
uvicorn main:app --reload

# Production
gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app

# Specify port
uvicorn main:app --reload --port 8001
```

### Testing API
```bash
# Check if backend is running
curl http://localhost:8000/health

# View API documentation
open http://localhost:8000/docs

# Seed database via API
curl -X POST http://localhost:8000/api/seed/

# Create a campaign
curl -X POST http://localhost:8000/api/campaigns/ \
  -H "Content-Type: application/json" \
  -d '{"company_id": 1, "name": "Test", "platform": "Google", "budget": 5000, "impressions": 10000, "clicks": 500, "cost": 2500}'
```

## Frontend Commands

### Initial Setup
```bash
cd frontend

# Install dependencies
npm install
# or
yarn install

# Copy environment file
cp .env.example .env.local
```

### Running Frontend
```bash
# Development
npm run dev
# Runs at http://localhost:3000

# Production build
npm run build

# Production serve
npm run start

# Build only
npm run build

# Linting
npm run lint
```

### Environment Variables
```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## PostgreSQL Commands

### Using psql
```bash
# Connect to database
psql -U pipelineiq -d pipelineiq -h localhost

# Inside psql:
\dt                    # List tables
\d companies           # Describe companies table
SELECT COUNT(*) FROM leads;  # Count leads
SELECT * FROM users;  # View users
\q                     # Quit
```

### Using Docker
```bash
# Connect to PostgreSQL in container
docker exec -it <container_id> psql -U pipelineiq -d pipelineiq

# View PostgreSQL logs
docker logs <container_id> -f
```

## Docker Commands

### Build Images
```bash
# Build backend image
cd backend
docker build -t pipelineiq-backend .

# Build frontend image
cd frontend
docker build -t pipelineiq-frontend .
```

### Run Containers
```bash
# Run PostgreSQL
docker run -d \
  -e POSTGRES_USER=pipelineiq \
  -e POSTGRES_PASSWORD=pipelineiq_password \
  -e POSTGRES_DB=pipelineiq \
  -p 5432:5432 \
  --name pipelineiq-db \
  postgres:15-alpine

# Run backend
docker run -p 8000:8000 \
  --env-file backend/.env \
  --name pipelineiq-api \
  pipelineiq-backend

# Run frontend
docker run -p 3000:3000 \
  --name pipelineiq-web \
  pipelineiq-frontend
```

### Docker Compose
```bash
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Remove volumes (WARNING: deletes database)
docker-compose down -v

# Rebuild images
docker-compose up --build
```

### Docker Cleanup
```bash
# Stop all containers
docker stop $(docker ps -q)

# Remove all containers
docker rm $(docker ps -aq)

# Remove dangling images
docker image prune

# Remove unused volumes
docker volume prune
```

## Testing & Debugging

### Backend Testing
```bash
# Check if backend is running
curl http://localhost:8000/health

# Get API docs
curl http://localhost:8000/docs

# Test login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'

# Get overview (with token)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/analytics/overview/1
```

### Frontend Testing
```bash
# Check if frontend is running
curl http://localhost:3000

# Build for production
npm run build

# Check build size
npm run build -- --analyze
```

### Database Testing
```bash
# Check connections
docker exec pipelineiq-db psql -U pipelineiq -c "SELECT version();"

# Count records
docker exec pipelineiq-db psql -U pipelineiq -d pipelineiq -c "SELECT COUNT(*) FROM leads;"

# View tables
docker exec pipelineiq-db psql -U pipelineiq -d pipelineiq -c "\dt"
```

## Common Issues & Fixes

### Backend Won't Start
```bash
# Check if port 8000 is in use
lsof -i :8000
# Kill process
kill -9 <PID>

# Check Python version
python --version  # Should be 3.11+

# Reinstall dependencies
pip install --force-reinstall -r requirements.txt
```

### Frontend Won't Start
```bash
# Check if port 3000 is in use
lsof -i :3000
# Kill process
kill -9 <PID>

# Clear Next.js cache
rm -rf .next

# Reinstall Node packages
rm -rf node_modules
npm install
```

### Database Connection Failed
```bash
# Check PostgreSQL is running
docker ps | grep postgres

# Check database credentials in .env
cat backend/.env

# Test connection
psql -U pipelineiq -d pipelineiq -h localhost

# Restart database
docker restart pipelineiq-db
```

### CORS Errors
```bash
# Check CORS settings in backend/app/core/config.py
# Add your frontend URL to ORIGINS list

# Add header when testing with curl
curl -H "Origin: http://localhost:3000" \
     -H "Access-Control-Request-Method: GET" \
     http://localhost:8000/api/analytics/overview/1
```

## Performance Monitoring

### Backend
```bash
# Monitor database connections
docker exec pipelineiq-db psql -U pipelineiq -d pipelineiq \
  -c "SELECT datname, count(*) FROM pg_stat_activity GROUP BY datname;"

# Check slow queries (if enabled)
tail -f postgresql.log | grep DURATION

# Monitor API response times (in logs)
```

### Frontend
```bash
# Build analysis
npm run build -- --analyze

# Run Lighthouse
npm install -g lighthouse
lighthouse http://localhost:3000

# Check bundle size
npm run build && npm run size
```

## Useful Development URLs

```
Frontend:           http://localhost:3000
Backend API:        http://localhost:8000
API Docs (Swagger): http://localhost:8000/docs
API Docs (ReDoc):   http://localhost:8000/redoc
PostgreSQL:         localhost:5432
Database Name:      pipelineiq
Database User:      pipelineiq
```

## File Structure Commands

### List Project Files
```bash
# Show directory structure
tree -L 2 -a

# Count lines of code
find . -name "*.py" -o -name "*.tsx" | xargs wc -l

# Find all Python files
find . -name "*.py" -type f

# Find all TypeScript files
find . -name "*.ts" -o -name "*.tsx" -type f
```

## Git Commands

### Version Control
```bash
# Initialize git (if needed)
git init

# Add all files
git add .

# Commit
git commit -m "Initial PipelineIQ MVP commit"

# View status
git status

# View diff
git diff
```

## Documentation Commands

### View Documentation
```bash
# View README
cat README.md

# View Quick Start
cat QUICKSTART.md

# View Architecture
cat ARCHITECTURE.md

# View Deliverable
cat DELIVERABLE.md
```

## Production Deployment Commands

### Prepare for Production
```bash
# Backend
cd backend
pip freeze > requirements.txt
# Update SECRET_KEY in .env
# Set DATABASE_URL to production database
gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app

# Frontend
cd frontend
npm run build
npm run start
```

### Using PM2 (Process Manager)
```bash
# Install PM2
npm install -g pm2

# Start backend
pm2 start "uvicorn main:app" --name pipelineiq-api

# Start frontend
pm2 start "npm start" --name pipelineiq-web --cwd frontend/

# Monitor
pm2 status
pm2 logs

# Restart
pm2 restart all
```

### Using Systemd
```bash
# Backend service file
sudo nano /etc/systemd/system/pipelineiq-api.service

# Frontend service file  
sudo nano /etc/systemd/system/pipelineiq-web.service

# Enable and start
sudo systemctl enable pipelineiq-api
sudo systemctl start pipelineiq-api
```

## Monitoring & Logging

### View Backend Logs
```bash
# With Docker
docker logs -f pipelineiq-api

# With Systemd
journalctl -u pipelineiq-api -f

# Python logging
python -c "import logging; logging.basicConfig(level=logging.DEBUG)"
```

### View Frontend Logs
```bash
# Browser console
# Press F12 → Console tab

# Terminal during development
npm run dev

# Docker
docker logs -f pipelineiq-web
```

### View Database Logs
```bash
# PostgreSQL logs in container
docker exec pipelineiq-db tail -f /var/log/postgresql/postgresql.log

# Or check pg_log directory
docker exec pipelineiq-db ls /var/lib/postgresql/data/pg_log/
```

---

**Use this reference for all common tasks during development and deployment!**
