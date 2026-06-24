"""
Seed data generator for the IBM Sales Coaching Dashboard
Creates realistic mock data for all entities
"""
from datetime import datetime, timedelta, date
from decimal import Decimal
import random
from faker import Faker
from sqlalchemy.orm import Session

from app.models import (
    Rep, IBMProduct, Opportunity, OpportunityProduct,
    Activity, ActivityMetric, Report, AccountProduct
)
from app.seed.ibm_products import IBM_PRODUCTS

fake = Faker()


# Sales rep data from the existing frontend
REPS_DATA = [
    {
        "name": "Priya Shah",
        "initials": "PS",
        "role": "Enterprise AE",
        "region": "East",
        "email": "priya.shah@ibm.com",
        "pipeline": 318000,
        "goal": 300000,
        "coverage": 4.2,
        "risk_score": 18
    },
    {
        "name": "Maya Chen",
        "initials": "MC",
        "role": "Enterprise AE",
        "region": "West",
        "email": "maya.chen@ibm.com",
        "pipeline": 286000,
        "goal": 260000,
        "coverage": 4.0,
        "risk_score": 38
    },
    {
        "name": "Sam Rivera",
        "initials": "SR",
        "role": "Commercial AE",
        "region": "South",
        "email": "sam.rivera@ibm.com",
        "pipeline": 224000,
        "goal": 240000,
        "coverage": 3.1,
        "risk_score": 45
    },
    {
        "name": "Jordan Lee",
        "initials": "JL",
        "role": "Enterprise AE",
        "region": "Central",
        "email": "jordan.lee@ibm.com",
        "pipeline": 182000,
        "goal": 240000,
        "coverage": 2.6,
        "risk_score": 72
    },
    {
        "name": "Noah Williams",
        "initials": "NW",
        "role": "Commercial AE",
        "region": "East",
        "email": "noah.williams@ibm.com",
        "pipeline": 164000,
        "goal": 220000,
        "coverage": 2.3,
        "risk_score": 81
    },
    {
        "name": "Elena Garcia",
        "initials": "EG",
        "role": "Commercial AE",
        "region": "West",
        "email": "elena.garcia@ibm.com",
        "pipeline": 198000,
        "goal": 220000,
        "coverage": 2.9,
        "risk_score": 57
    }
]


# Account names for opportunities
ACCOUNT_NAMES = [
    "Acme Financial Services",
    "TechCorp Manufacturing",
    "RetailMax Inc",
    "HealthFirst Systems",
    "Global Logistics Partners",
    "DataDriven Analytics",
    "SecureBank Corporation",
    "MediCare Solutions",
    "AutoTech Industries",
    "EnergyFlow Systems",
    "CloudFirst Technologies",
    "FinanceHub Group",
    "SmartRetail Chain",
    "BioTech Innovations",
    "TransportLogix",
    "InsureTech Solutions",
    "MediaStream Networks",
    "AgriTech Farms",
    "CyberSecure Inc",
    "EduTech Platform"
]


# Opportunity stages
STAGES = ["Discovery", "Qualification", "Proposal", "Negotiation", "Closed Won", "Closed Lost"]


# Activity types
ACTIVITY_TYPES = ["Meeting", "Call", "Email", "Demo", "Proposal"]


# Sentiments
SENTIMENTS = ["Positive", "Neutral", "Negative"]


# Outcomes
OUTCOMES = ["Scheduled", "Completed", "No Show", "Rescheduled"]


def seed_reps(db: Session):
    """Seed sales representatives"""
    print("Seeding reps...")
    reps = []
    for rep_data in REPS_DATA:
        rep = Rep(**rep_data)
        db.add(rep)
        reps.append(rep)
    db.commit()
    print(f"✓ Created {len(reps)} reps")
    return reps


def seed_products(db: Session):
    """Seed IBM products"""
    print("Seeding IBM products...")
    products = []
    for product_data in IBM_PRODUCTS:
        product = IBMProduct(
            product_name=product_data["product_name"],
            product_family=product_data["product_family"],
            category=product_data["category"],
            description=product_data["description"],
            typical_deal_size=Decimal(str(product_data["typical_deal_size"])),
            license_type=product_data["license_type"],
            is_active=True
        )
        db.add(product)
        products.append(product)
    db.commit()
    print(f"✓ Created {len(products)} IBM products")
    return products


def seed_account_products(db: Session, products: list):
    """Seed current product usage by accounts"""
    print("Seeding account products...")
    account_products = []
    
    # Create realistic product usage scenarios
    usage_scenarios = [
        {
            "account": "Acme Financial Services",
            "products": ["Db2 Database", "Cognos Analytics"],
            "usage_level": "High",
            "satisfaction": 8,
            "renewal_risk": "Low"
        },
        {
            "account": "TechCorp Manufacturing",
            "products": ["DataStage", "InfoSphere Information Server"],
            "usage_level": "Medium",
            "satisfaction": 7,
            "renewal_risk": "Medium"
        },
        {
            "account": "RetailMax Inc",
            "products": ["Db2 Warehouse", "DataStage", "Cognos Analytics"],
            "usage_level": "High",
            "satisfaction": 9,
            "renewal_risk": "Low"
        },
        {
            "account": "HealthFirst Systems",
            "products": ["Db2 Database", "InfoSphere Information Server"],
            "usage_level": "Medium",
            "satisfaction": 6,
            "renewal_risk": "Medium"
        },
        {
            "account": "Global Logistics Partners",
            "products": ["Informix", "SPSS Statistics"],
            "usage_level": "Low",
            "satisfaction": 5,
            "renewal_risk": "High"
        },
        {
            "account": "DataDriven Analytics",
            "products": ["Watson Studio", "Watson Machine Learning", "Db2 Warehouse"],
            "usage_level": "High",
            "satisfaction": 9,
            "renewal_risk": "Low"
        },
        {
            "account": "SecureBank Corporation",
            "products": ["Db2 Database", "InfoSphere Master Data Management"],
            "usage_level": "High",
            "satisfaction": 8,
            "renewal_risk": "Low"
        },
        {
            "account": "CloudFirst Technologies",
            "products": ["Cloudant", "Watson Assistant"],
            "usage_level": "Medium",
            "satisfaction": 7,
            "renewal_risk": "Medium"
        }
    ]
    
    for scenario in usage_scenarios:
        for product_name in scenario["products"]:
            product = next((p for p in products if p.product_name == product_name), None)
            if product:
                start_date = date.today() - timedelta(days=random.randint(180, 730))
                account_product = AccountProduct(
                    account_name=scenario["account"],
                    product_id=product.id,
                    contract_start_date=start_date,
                    contract_end_date=start_date + timedelta(days=365),
                    annual_value=Decimal(str(float(product.typical_deal_size) * random.uniform(0.7, 1.3))),
                    usage_level=scenario["usage_level"],
                    satisfaction_score=scenario["satisfaction"],
                    renewal_risk=scenario["renewal_risk"]
                )
                db.add(account_product)
                account_products.append(account_product)
    
    db.commit()
    print(f"✓ Created {len(account_products)} account product relationships")
    return account_products


def seed_opportunities(db: Session, reps: list, products: list):
    """Seed opportunities with realistic scenarios"""
    print("Seeding opportunities...")
    opportunities = []
    
    # Opportunity scenarios with IBM products
    scenarios = [
        {
            "rep": "Priya Shah",
            "account": "Acme Financial Services",
            "name": "AI Fraud Detection Platform",
            "stage": "Proposal",
            "amount": 180000,
            "probability": 70,
            "products": ["watsonx.ai", "Watson OpenScale"],
            "is_upsell": True,
            "current_products": ["Db2 Database", "Cognos Analytics"]
        },
        {
            "rep": "Priya Shah",
            "account": "SecureBank Corporation",
            "name": "Data Governance Expansion",
            "stage": "Negotiation",
            "amount": 140000,
            "probability": 80,
            "products": ["Watson Knowledge Catalog"],
            "is_upsell": True,
            "current_products": ["Db2 Database"]
        },
        {
            "rep": "Maya Chen",
            "account": "TechCorp Manufacturing",
            "name": "Data Modernization Initiative",
            "stage": "Discovery",
            "amount": 350000,
            "probability": 40,
            "products": ["Cloud Pak for Data", "DataStage", "Db2 Warehouse"],
            "is_upsell": False,
            "current_products": []
        },
        {
            "rep": "Maya Chen",
            "account": "AutoTech Industries",
            "name": "IoT Data Platform",
            "stage": "Qualification",
            "amount": 220000,
            "probability": 50,
            "products": ["watsonx.data", "Informix"],
            "is_upsell": False,
            "current_products": []
        },
        {
            "rep": "Sam Rivera",
            "account": "RetailMax Inc",
            "name": "Customer Analytics AI",
            "stage": "Proposal",
            "amount": 165000,
            "probability": 65,
            "products": ["watsonx.ai", "Watson Studio"],
            "is_upsell": True,
            "current_products": ["Db2 Warehouse", "Cognos Analytics"]
        },
        {
            "rep": "Sam Rivera",
            "account": "SmartRetail Chain",
            "name": "Planning Analytics Implementation",
            "stage": "Discovery",
            "amount": 160000,
            "probability": 35,
            "products": ["Planning Analytics"],
            "is_upsell": False,
            "current_products": []
        },
        {
            "rep": "Jordan Lee",
            "account": "HealthFirst Systems",
            "name": "Healthcare Compliance Suite",
            "stage": "Qualification",
            "amount": 195000,
            "probability": 55,
            "products": ["watsonx.governance", "Data Privacy Passports"],
            "is_upsell": True,
            "current_products": ["Db2 Database"]
        },
        {
            "rep": "Jordan Lee",
            "account": "MediCare Solutions",
            "name": "Patient Data Analytics",
            "stage": "Discovery",
            "amount": 145000,
            "probability": 30,
            "products": ["Watson Studio", "Db2 Warehouse"],
            "is_upsell": False,
            "current_products": []
        },
        {
            "rep": "Noah Williams",
            "account": "Global Logistics Partners",
            "name": "Supply Chain Optimization",
            "stage": "Discovery",
            "amount": 125000,
            "probability": 25,
            "products": ["SPSS Modeler", "Cognos Analytics"],
            "is_upsell": True,
            "current_products": ["Informix"]
        },
        {
            "rep": "Noah Williams",
            "account": "TransportLogix",
            "name": "Route Optimization AI",
            "stage": "Qualification",
            "amount": 95000,
            "probability": 40,
            "products": ["Watson Machine Learning"],
            "is_upsell": False,
            "current_products": []
        },
        {
            "rep": "Elena Garcia",
            "account": "DataDriven Analytics",
            "name": "ML Platform Expansion",
            "stage": "Negotiation",
            "amount": 185000,
            "probability": 75,
            "products": ["watsonx.ai", "Watson OpenScale"],
            "is_upsell": True,
            "current_products": ["Watson Studio", "Watson Machine Learning"]
        },
        {
            "rep": "Elena Garcia",
            "account": "CloudFirst Technologies",
            "name": "Conversational AI Enhancement",
            "stage": "Proposal",
            "amount": 110000,
            "probability": 60,
            "products": ["Watson Assistant", "Watson Discovery"],
            "is_upsell": True,
            "current_products": ["Cloudant"]
        }
    ]
    
    for scenario in scenarios:
        rep = next((r for r in reps if r.name == scenario["rep"]), None)
        if not rep:
            continue
            
        close_date = date.today() + timedelta(days=random.randint(30, 120))
        created_date = date.today() - timedelta(days=random.randint(10, 60))
        
        opportunity = Opportunity(
            rep_id=rep.id,
            account_name=scenario["account"],
            opportunity_name=scenario["name"],
            stage=scenario["stage"],
            amount=Decimal(str(scenario["amount"])),
            probability=scenario["probability"],
            expected_close_date=close_date,
            created_date=created_date,
            last_activity_date=date.today() - timedelta(days=random.randint(1, 7)),
            source=random.choice(["Inbound", "Outbound", "Referral", "Partner"]),
            is_upsell=scenario["is_upsell"],
            notes=f"Current products: {', '.join(scenario['current_products']) if scenario['current_products'] else 'None'}"
        )
        db.add(opportunity)
        db.flush()  # Get the opportunity ID
        
        # Add products to opportunity
        for product_name in scenario["products"]:
            product = next((p for p in products if p.product_name == product_name), None)
            if product:
                quantity = 1
                unit_price = product.typical_deal_size * Decimal(str(random.uniform(0.8, 1.2)))
                
                opp_product = OpportunityProduct(
                    opportunity_id=opportunity.id,
                    product_id=product.id,
                    quantity=quantity,
                    unit_price=unit_price,
                    total_amount=unit_price * quantity,
                    is_current_product=product_name in scenario.get("current_products", []),
                    is_upsell_target=scenario["is_upsell"],
                    usage_status="Active" if product_name in scenario.get("current_products", []) else "Not Using"
                )
                db.add(opp_product)
        
        opportunities.append(opportunity)
    
    db.commit()
    print(f"✓ Created {len(opportunities)} opportunities with products")
    return opportunities


def seed_activities(db: Session, reps: list, opportunities: list, products: list):
    """Seed activities with realistic data"""
    print("Seeding activities...")
    activities = []
    
    # Activity templates
    activity_templates = {
        "Meeting": [
            "Discovery Call - {product}",
            "Product Demo - {product}",
            "Executive Briefing",
            "Technical Deep Dive - {product}",
            "Stakeholder Alignment Meeting"
        ],
        "Call": [
            "Follow-up on {product} Discussion",
            "Quick Check-in",
            "Pricing Discussion",
            "Contract Review Call",
            "Implementation Planning"
        ],
        "Email": [
            "Proposal Sent - {product}",
            "Documentation Shared",
            "Meeting Follow-up",
            "ROI Analysis Provided",
            "Reference Customer Introduction"
        ],
        "Demo": [
            "{product} Live Demonstration",
            "POC Walkthrough - {product}",
            "Technical Capabilities Review",
            "Integration Demo - {product}"
        ],
        "Proposal": [
            "Formal Proposal Submission",
            "SOW Review",
            "Contract Negotiation",
            "Final Pricing Proposal"
        ]
    }
    
    # Create 5-10 activities per opportunity
    for opp in opportunities:
        num_activities = random.randint(5, 10)
        opp_products = db.query(OpportunityProduct).filter(
            OpportunityProduct.opportunity_id == opp.id
        ).all()
        
        for i in range(num_activities):
            activity_type = random.choice(ACTIVITY_TYPES)
            templates = activity_templates[activity_type]
            
            # Select a product from the opportunity
            if opp_products and "{product}" in random.choice(templates):
                opp_product = random.choice(opp_products)
                product = db.query(IBMProduct).filter(IBMProduct.id == opp_product.product_id).first()
                subject = random.choice(templates).format(product=product.product_name)
                products_discussed = [str(product.id)]
            else:
                subject = random.choice([t for t in templates if "{product}" not in t])
                products_discussed = []
            
            activity_date = datetime.now() - timedelta(days=random.randint(1, 60))
            
            activity = Activity(
                rep_id=opp.rep_id,
                opportunity_id=opp.id,
                activity_type=activity_type,
                subject=subject,
                description=fake.paragraph(nb_sentences=3),
                activity_date=activity_date,
                duration_minutes=random.choice([30, 45, 60, 90]) if activity_type in ["Meeting", "Demo"] else None,
                outcome=random.choice(OUTCOMES),
                sentiment=random.choices(SENTIMENTS, weights=[60, 30, 10])[0],
                next_steps=fake.sentence() if random.random() > 0.5 else None,
                attendees=[
                    {"name": fake.name(), "title": fake.job(), "email": fake.email()}
                    for _ in range(random.randint(1, 4))
                ],
                products_discussed=products_discussed
            )
            db.add(activity)
            activities.append(activity)
    
    db.commit()
    print(f"✓ Created {len(activities)} activities")
    return activities


def seed_activity_metrics(db: Session, reps: list):
    """Seed activity metrics for each rep"""
    print("Seeding activity metrics...")
    metrics = []
    
    # Create metrics for current month
    period_start = date.today().replace(day=1)
    period_end = date.today()
    
    for rep in reps:
        # Count actual activities
        activities = db.query(Activity).filter(
            Activity.rep_id == rep.id,
            Activity.activity_date >= period_start
        ).all()
        
        meetings = len([a for a in activities if a.activity_type == "Meeting"])
        calls = len([a for a in activities if a.activity_type == "Call"])
        emails = len([a for a in activities if a.activity_type == "Email"])
        demos = len([a for a in activities if a.activity_type == "Demo"])
        
        metric = ActivityMetric(
            rep_id=rep.id,
            period_start=period_start,
            period_end=period_end,
            total_meetings=meetings,
            total_calls=calls,
            total_emails=emails,
            total_demos=demos,
            meeting_to_opp_conversion=random.randint(20, 40),
            avg_response_time_hours=random.randint(2, 8),
            engagement_score=random.randint(60, 95)
        )
        db.add(metric)
        metrics.append(metric)
    
    db.commit()
    print(f"✓ Created {len(metrics)} activity metrics")
    return metrics


def seed_all(db: Session):
    """Seed all data"""
    print("\n" + "="*50)
    print("Starting database seeding...")
    print("="*50 + "\n")
    
    # Seed in order due to foreign key dependencies
    reps = seed_reps(db)
    products = seed_products(db)
    account_products = seed_account_products(db, products)
    opportunities = seed_opportunities(db, reps, products)
    activities = seed_activities(db, reps, opportunities, products)
    metrics = seed_activity_metrics(db, reps)
    
    print("\n" + "="*50)
    print("Database seeding completed successfully!")
    print("="*50)
    print(f"\nSummary:")
    print(f"  - {len(reps)} Sales Reps")
    print(f"  - {len(products)} IBM Products")
    print(f"  - {len(account_products)} Account-Product Relationships")
    print(f"  - {len(opportunities)} Opportunities")
    print(f"  - {len(activities)} Activities")
    print(f"  - {len(metrics)} Activity Metrics")
    print("\n")

# Made with Bob
