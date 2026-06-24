# Frontend Integration Guide

## 🎯 Overview

This guide explains how to integrate the Northstar Dashboard frontend with the FastAPI backend.

## ✅ What's Been Done

### Backend Setup
- ✅ FastAPI server running on `http://localhost:8000`
- ✅ SQLite database with complete mock data
- ✅ CORS configured for frontend access
- ✅ `/api/v1/reps/` endpoint created and tested

### Frontend Files Created
- ✅ `app-api.js` - New JavaScript file that fetches data from API
- ✅ `test-api.html` - Standalone test page to verify API connection
- ✅ `index.html` - Updated to use `app-api.js`

## 🚀 Quick Start

### 1. Start the Backend (Terminal 1)
```bash
cd backend
python3 -m app.main
```

The server will start on `http://localhost:8000`

### 2. Open the Test Page
Open `test-api.html` in your browser to verify the API connection:
```bash
open test-api.html
# or
python3 -m http.server 8080
# then visit http://localhost:8080/test-api.html
```

You should see:
- ✅ Success message with rep count
- 6 rep cards with live data from the database
- Raw JSON response at the bottom

### 3. Run the Main Dashboard
```bash
# Serve the frontend
python3 -m http.server 8080
```

Then open `http://localhost:8080` in your browser.

## 📊 Current API Endpoints

### GET /api/v1/reps/
Returns all sales reps with their metrics.

**Response:**
```json
[
  {
    "id": "374cb7f2-70da-448a-bca1-600b98e3e3cb",
    "name": "Priya Shah",
    "initials": "PS",
    "role": "Enterprise AE",
    "region": "East",
    "email": "priya.shah@ibm.com",
    "pipeline": 318000.0,
    "goal": 300000.0,
    "coverage": 4.2,
    "risk": 18,
    "opportunities": 2,
    "meetings": 3,
    "created_at": "2026-06-18T15:35:47",
    "updated_at": "2026-06-18T15:35:47"
  }
]
```

### GET /api/v1/reps/{rep_id}
Returns a specific rep by ID.

## 🔧 How It Works

### Data Flow
```
Frontend (app-api.js)
    ↓ HTTP Request
Backend API (/api/v1/reps/)
    ↓ Query
SQLite Database (sales_coaching.db)
    ↓ Results
Backend API (JSON Response)
    ↓ HTTP Response
Frontend (Renders UI)
```

### Key Changes in app-api.js

1. **API Configuration**
```javascript
const API_BASE_URL = 'http://localhost:8000/api/v1';
```

2. **Fetch Function**
```javascript
async function fetchReps() {
  const response = await fetch(`${API_BASE_URL}/reps/`);
  const data = await response.json();
  return data;
}
```

3. **Initialization**
```javascript
async function initDashboard() {
  await fetchReps();  // Fetch from API instead of using static data
  renderRepCards();
  renderRepDetail();
}
```

## 📝 Database Contents

The database currently contains:
- **6 Sales Reps** (Priya Shah, Maya Chen, Sam Rivera, Jordan Lee, Noah Williams, Elena Garcia)
- **31 IBM Products** (watsonx.ai, Db2, Watson Studio, Cognos Analytics, etc.)
- **18 Account-Product Relationships** (current customer usage)
- **12 Opportunities** ($2.4M+ pipeline)
- **86 Activities** (meetings, calls, emails, demos)
- **6 Activity Metrics** (per rep)

## 🎨 Frontend Features

### Currently Working
- ✅ Fetches real rep data from API
- ✅ Displays rep cards with live metrics
- ✅ Shows pipeline, coverage, and risk scores
- ✅ Error handling with user-friendly messages
- ✅ Loading states

### Still Using Static Data (To Be Implemented)
- ⏳ Zoom Out metrics (quantity, deal size, mix, balance)
- ⏳ AI summaries and recommendations
- ⏳ Account touch metrics
- ⏳ Conversion rates

## 🔮 Next Steps

### 1. Create Additional API Endpoints

**Opportunities Endpoint**
```python
# backend/app/api/opportunities.py
@router.get("/")
async def get_opportunities(rep_id: str = None):
    # Return opportunities, optionally filtered by rep
```

**Activities Endpoint**
```python
# backend/app/api/activities.py
@router.get("/")
async def get_activities(rep_id: str = None):
    # Return activities with sentiment analysis
```

**Products Endpoint**
```python
# backend/app/api/products.py
@router.get("/")
async def get_products():
    # Return IBM product catalog
```

### 2. Enhance Rep Endpoint

Add computed metrics:
- Account touch statistics
- Conversion rates
- Zoom Out scores
- AI-generated summaries

### 3. Update Frontend

Integrate new endpoints into `app-api.js`:
```javascript
async function fetchOpportunities(repId) {
  const response = await fetch(`${API_BASE_URL}/opportunities/?rep_id=${repId}`);
  return await response.json();
}
```

## 🐛 Troubleshooting

### CORS Errors
If you see CORS errors in the browser console:
1. Check that backend CORS is configured (it is)
2. Make sure you're accessing via `http://localhost` not `file://`
3. Verify the backend is running

### API Not Responding
1. Check backend is running: `curl http://localhost:8000/health`
2. Verify port 8000 is not blocked
3. Check backend logs for errors

### No Data Showing
1. Verify database has data: `ls -lh backend/sales_coaching.db`
2. Check browser console for JavaScript errors
3. Open `test-api.html` to isolate the issue

## 📚 API Documentation

Interactive API docs available at:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🎯 Testing Checklist

- [ ] Backend starts without errors
- [ ] `test-api.html` shows 6 reps
- [ ] Main dashboard loads
- [ ] Rep cards display correct data
- [ ] No CORS errors in console
- [ ] API responses are fast (<100ms)

## 💡 Tips

1. **Use the test page first** - `test-api.html` is great for debugging API issues
2. **Check the browser console** - All API errors are logged there
3. **Use the API docs** - Visit `/docs` to test endpoints interactively
4. **Monitor the backend** - Watch the terminal for API request logs

## 🚀 Production Considerations

Before deploying to production:
1. Replace SQLite with PostgreSQL
2. Add authentication/authorization
3. Implement rate limiting
4. Add request validation
5. Set up proper error logging
6. Configure production CORS origins
7. Add API versioning strategy
8. Implement caching for frequently accessed data

---

**Status**: ✅ Basic integration complete and working
**Next**: Create additional API endpoints for opportunities, activities, and products