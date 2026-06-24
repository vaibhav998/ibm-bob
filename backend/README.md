# IBM Sales Coaching Dashboard - Backend API

FastAPI backend for the IBM Sales Coaching Dashboard with comprehensive IBM Data & AI product catalog, opportunities tracking, activity intelligence, and reporting capabilities.

## 🎯 Features

- **30+ IBM Data & AI Products** - Complete catalog including watsonx, Db2, DataStage, Watson Studio, Cognos, and more
- **Opportunities Management** - Full CRUD operations with product associations and upsell tracking
- **Activity Intelligence** - Track meetings, calls, emails, demos with sentiment analysis
- **Reports Generation** - Generate pipeline, activity, and product reports in multiple formats
- **Mock Data** - Realistic seed data with 6 sales reps, 12+ opportunities, 50+ activities

## 📋 Prerequisites

- Python 3.11 or higher
- PostgreSQL 14 or higher
- pip (Python package manager)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Set Up Database

Create a PostgreSQL database:

```sql
CREATE DATABASE sales_coaching_db;
CREATE USER sales_user WITH PASSWORD 'sales_password';
GRANT ALL PRIVILEGES ON DATABASE sales_coaching_db TO sales_user;
```

### 3. Configure Environment

Copy the example environment file and update with your settings:

```bash
cp .env.example .env
```

Edit `.env` with your database credentials:

```env
DATABASE_URL=postgresql://sales_user:sales_password@localhost:5432/sales_coaching_db
```

### 4. Initialize Database

Run the database initialization script:

```bash
python -c "from app.database import init_db; init_db()"
```

### 5. Seed Mock Data

Populate the database with realistic mock data:

```bash
python -c "from app.database import SessionLocal; from app.seed.seed_data import seed_all; db = SessionLocal(); seed_all(db); db.close()"
```

### 6. Start the Server

```bash
# Development mode with auto-reload
python app/main.py

# Or using uvicorn directly
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:
- **API**: http://localhost:8000
- **Interactive Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 📊 Database Schema

### Core Tables

- **reps** - Sales representatives
- **ibm_products** - IBM Data & AI product catalog (30+ products)
- **opportunities** - Sales opportunities
- **opportunity_products** - Products in each opportunity
- **activities** - Activity intelligence (meetings, calls, emails, demos)
- **activity_metrics** - Aggregated activity metrics
- **reports** - Generated reports
- **account_products** - Current product usage by accounts

## 🔌 API Endpoints

### Opportunities (`/api/v1/opportunities`)

- `GET /api/v1/opportunities` - List all opportunities
  - Query params: `rep_id`, `stage`, `min_amount`, `max_amount`, `is_upsell`
- `GET /api/v1/opportunities/{id}` - Get single opportunity
- `POST /api/v1/opportunities` - Create opportunity
- `PUT /api/v1/opportunities/{id}` - Update opportunity
- `DELETE /api/v1/opportunities/{id}` - Delete opportunity
- `GET /api/v1/opportunities/pipeline-summary` - Pipeline metrics
- `GET /api/v1/opportunities/by-product` - Opportunities by product
- `GET /api/v1/opportunities/upsell-potential` - Upsell opportunities

### Activity Intelligence (`/api/v1/activities`)

- `GET /api/v1/activities` - List activities
  - Query params: `rep_id`, `opportunity_id`, `activity_type`, `date_from`, `date_to`
- `GET /api/v1/activities/{id}` - Get single activity
- `POST /api/v1/activities` - Log new activity
- `PUT /api/v1/activities/{id}` - Update activity
- `DELETE /api/v1/activities/{id}` - Delete activity
- `GET /api/v1/activities/metrics` - Activity metrics by rep
- `GET /api/v1/activities/timeline` - Activity timeline
- `GET /api/v1/activities/conversion-funnel` - Conversion rates
- `GET /api/v1/activities/product-engagement` - Product discussion frequency

### Reports (`/api/v1/reports`)

- `GET /api/v1/reports` - List generated reports
- `GET /api/v1/reports/{id}` - Get report metadata
- `GET /api/v1/reports/{id}/download` - Download report file
- `POST /api/v1/reports/generate` - Generate new report
- `POST /api/v1/reports/pipeline-snapshot` - Pipeline report
- `POST /api/v1/reports/activity-summary` - Activity report
- `POST /api/v1/reports/product-adoption` - Product usage report

### Products (`/api/v1/products`)

- `GET /api/v1/products` - List IBM products
  - Query params: `category`, `product_family`, `is_active`
- `GET /api/v1/products/{id}` - Get product details
- `GET /api/v1/products/recommendations` - Product recommendations

### Reps (`/api/v1/reps`)

- `GET /api/v1/reps` - List all reps
- `GET /api/v1/reps/{id}` - Get rep details
- `GET /api/v1/reps/{id}/dashboard` - Rep dashboard data

## 📦 IBM Products Catalog

### watsonx Family (3 products)
- watsonx.ai - AI development platform
- watsonx.data - Data lakehouse
- watsonx.governance - AI governance

### Data Management (4 products)
- Db2 Database, Db2 Warehouse, Informix, Cloudant

### DataOps & Integration (4 products)
- DataStage, Data Replication, InfoSphere Information Server, Cloud Pak for Data

### AI & Machine Learning (7 products)
- Watson Studio, Watson Machine Learning, SPSS Modeler, Watson OpenScale, Watson Discovery, Watson Assistant, Watson NLU

### Data Governance (4 products)
- Watson Knowledge Catalog, Data Privacy Passports, InfoSphere MDM, InfoSphere Data Privacy

### Analytics & BI (4 products)
- Cognos Analytics, Planning Analytics, SPSS Statistics, Cognos Controller

### Specialized Solutions (4 products)
- Netezza Performance Server, Watson Query, Match 360, InfoSphere Optim

## 🧪 Testing

Run tests:

```bash
pytest
```

Run with coverage:

```bash
pytest --cov=app tests/
```

## 📝 Mock Data Details

### Sales Reps (6)
- Priya Shah (East, Enterprise AE) - High performer
- Maya Chen (West, Enterprise AE) - Strong pipeline, low creation
- Sam Rivera (South, Commercial AE) - Small deal sizes
- Jordan Lee (Central, Enterprise AE) - Below quota
- Noah Williams (East, Commercial AE) - Critical risk
- Elena Garcia (West, Commercial AE) - Concentration risk

### Opportunities (12+)
- Mix of new logos and upsells
- Various stages (Discovery to Negotiation)
- Linked to IBM products with current usage tracking
- Realistic scenarios (AI fraud detection, data modernization, etc.)

### Activities (50+)
- Meetings, calls, emails, demos, proposals
- Linked to opportunities and products
- Sentiment analysis (Positive, Neutral, Negative)
- Attendee information and next steps

## 🔧 Development

### Project Structure

```
backend/
├── app/
│   ├── models/          # SQLAlchemy models
│   ├── schemas/         # Pydantic schemas
│   ├── api/             # API routes
│   ├── services/        # Business logic
│   ├── utils/           # Utility functions
│   ├── seed/            # Mock data generators
│   ├── config.py        # Configuration
│   ├── database.py      # Database connection
│   └── main.py          # FastAPI app
├── tests/               # Test suite
├── requirements.txt     # Dependencies
└── README.md           # This file
```

### Adding New Endpoints

1. Create Pydantic schemas in `app/schemas/`
2. Add business logic in `app/services/`
3. Create API routes in `app/api/`
4. Register router in `app/main.py`

### Database Migrations

Using Alembic for database migrations:

```bash
# Create a new migration
alembic revision --autogenerate -m "Description"

# Apply migrations
alembic upgrade head

# Rollback
alembic downgrade -1
```

## 🐛 Troubleshooting

### Database Connection Issues

```bash
# Check PostgreSQL is running
pg_isready

# Test connection
psql -U sales_user -d sales_coaching_db
```

### Import Errors

```bash
# Ensure you're in the backend directory
cd backend

# Reinstall dependencies
pip install -r requirements.txt
```

### Port Already in Use

```bash
# Find process using port 8000
lsof -i :8000

# Kill the process
kill -9 <PID>
```

## 📚 API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🔐 Security Notes

- This is a development setup with mock data
- In production, use proper authentication (JWT tokens)
- Enable HTTPS
- Use environment variables for sensitive data
- Implement rate limiting
- Add input validation and sanitization

## 🚀 Deployment

### Docker (Coming Soon)

```bash
docker-compose up -d
```

### Production Checklist

- [ ] Set `RELOAD=False` in production
- [ ] Use production-grade WSGI server (Gunicorn)
- [ ] Configure proper CORS origins
- [ ] Set up database backups
- [ ] Enable logging and monitoring
- [ ] Use secrets management
- [ ] Configure SSL/TLS

## 📄 License

Internal use only - IBM Sales Coaching Dashboard

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Add tests
4. Submit a pull request

---

**Built with ❤️ using FastAPI, PostgreSQL, and IBM Data & AI Products**