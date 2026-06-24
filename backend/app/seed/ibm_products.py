"""
IBM Data & AI Products catalog
Complete list of IBM products for the sales coaching dashboard
"""

IBM_PRODUCTS = [
    # watsonx Family
    {
        "product_name": "watsonx.ai",
        "product_family": "watsonx",
        "category": "AI/ML",
        "description": "Enterprise-ready AI development platform for building, training, and deploying foundation models and machine learning models at scale.",
        "typical_deal_size": 150000,
        "license_type": "Subscription"
    },
    {
        "product_name": "watsonx.data",
        "product_family": "watsonx",
        "category": "Data Management",
        "description": "Open, hybrid, and governed data lakehouse that enables you to scale analytics and AI workloads with all your data.",
        "typical_deal_size": 200000,
        "license_type": "Subscription"
    },
    {
        "product_name": "watsonx.governance",
        "product_family": "watsonx",
        "category": "Governance",
        "description": "AI governance toolkit to direct, manage and monitor AI activities across the organization.",
        "typical_deal_size": 100000,
        "license_type": "Subscription"
    },
    
    # Data Management
    {
        "product_name": "Db2 Database",
        "product_family": "Data Management",
        "category": "Database",
        "description": "Enterprise-grade relational database optimized for transactional workloads and operational analytics.",
        "typical_deal_size": 120000,
        "license_type": "Perpetual"
    },
    {
        "product_name": "Db2 Warehouse",
        "product_family": "Data Management",
        "category": "Database",
        "description": "Cloud-native data warehouse built for high-performance analytics and AI workloads.",
        "typical_deal_size": 180000,
        "license_type": "Subscription"
    },
    {
        "product_name": "Informix",
        "product_family": "Data Management",
        "category": "Database",
        "description": "Embeddable, low-footprint database for IoT, edge computing, and operational applications.",
        "typical_deal_size": 80000,
        "license_type": "Perpetual"
    },
    {
        "product_name": "Cloudant",
        "product_family": "Data Management",
        "category": "Database",
        "description": "Fully managed, distributed NoSQL database optimized for heavy workloads and fast-growing web and mobile apps.",
        "typical_deal_size": 60000,
        "license_type": "Usage-based"
    },
    
    # DataOps & Integration
    {
        "product_name": "DataStage",
        "product_family": "DataOps",
        "category": "ETL",
        "description": "Enterprise ETL platform for designing, developing, and running data integration jobs at scale.",
        "typical_deal_size": 150000,
        "license_type": "Subscription"
    },
    {
        "product_name": "Data Replication",
        "product_family": "DataOps",
        "category": "ETL",
        "description": "Real-time data replication and synchronization across heterogeneous databases and data warehouses.",
        "typical_deal_size": 90000,
        "license_type": "Subscription"
    },
    {
        "product_name": "InfoSphere Information Server",
        "product_family": "DataOps",
        "category": "ETL",
        "description": "Comprehensive data integration platform for understanding, cleansing, monitoring, and transforming data.",
        "typical_deal_size": 200000,
        "license_type": "Perpetual"
    },
    {
        "product_name": "Cloud Pak for Data",
        "product_family": "DataOps",
        "category": "Platform",
        "description": "Unified data and AI platform that runs on any cloud, enabling you to collect, organize and analyze data.",
        "typical_deal_size": 300000,
        "license_type": "Subscription"
    },
    
    # AI & Machine Learning
    {
        "product_name": "Watson Studio",
        "product_family": "AI & Machine Learning",
        "category": "AI/ML",
        "description": "Collaborative environment for data scientists, developers and domain experts to build and train AI models.",
        "typical_deal_size": 130000,
        "license_type": "Subscription"
    },
    {
        "product_name": "Watson Machine Learning",
        "product_family": "AI & Machine Learning",
        "category": "AI/ML",
        "description": "Deploy and manage machine learning models in production with automated model lifecycle management.",
        "typical_deal_size": 110000,
        "license_type": "Subscription"
    },
    {
        "product_name": "SPSS Modeler",
        "product_family": "AI & Machine Learning",
        "category": "Analytics",
        "description": "Visual data science and machine learning solution for building accurate predictive models quickly.",
        "typical_deal_size": 70000,
        "license_type": "Subscription"
    },
    {
        "product_name": "Watson OpenScale",
        "product_family": "AI & Machine Learning",
        "category": "AI/ML",
        "description": "AI governance and monitoring platform to track and measure AI outcomes across its lifecycle.",
        "typical_deal_size": 85000,
        "license_type": "Subscription"
    },
    {
        "product_name": "Watson Discovery",
        "product_family": "AI & Machine Learning",
        "category": "AI/ML",
        "description": "AI-powered search and text analytics engine for extracting insights from unstructured data.",
        "typical_deal_size": 95000,
        "license_type": "Subscription"
    },
    {
        "product_name": "Watson Assistant",
        "product_family": "AI & Machine Learning",
        "category": "AI/ML",
        "description": "Conversational AI platform for building intelligent virtual assistants and chatbots.",
        "typical_deal_size": 75000,
        "license_type": "Subscription"
    },
    
    # Data Governance
    {
        "product_name": "Watson Knowledge Catalog",
        "product_family": "Data Governance",
        "category": "Governance",
        "description": "Intelligent data catalog with automated metadata management, data quality, and policy enforcement.",
        "typical_deal_size": 140000,
        "license_type": "Subscription"
    },
    {
        "product_name": "Data Privacy Passports",
        "product_family": "Data Governance",
        "category": "Governance",
        "description": "Privacy-enhancing technology for protecting sensitive data while enabling analytics and AI.",
        "typical_deal_size": 95000,
        "license_type": "Subscription"
    },
    {
        "product_name": "InfoSphere Master Data Management",
        "product_family": "Data Governance",
        "category": "Governance",
        "description": "Comprehensive MDM solution for creating a single, trusted view of critical business data.",
        "typical_deal_size": 180000,
        "license_type": "Perpetual"
    },
    {
        "product_name": "InfoSphere Data Privacy",
        "product_family": "Data Governance",
        "category": "Governance",
        "description": "Data masking and de-identification solution for protecting sensitive information.",
        "typical_deal_size": 85000,
        "license_type": "Subscription"
    },
    
    # Analytics & BI
    {
        "product_name": "Cognos Analytics",
        "product_family": "Analytics & BI",
        "category": "Analytics",
        "description": "AI-powered business intelligence platform for self-service analytics, reporting, and dashboards.",
        "typical_deal_size": 120000,
        "license_type": "Subscription"
    },
    {
        "product_name": "Planning Analytics",
        "product_family": "Analytics & BI",
        "category": "Analytics",
        "description": "Integrated planning solution powered by TM1 for financial planning, budgeting, and forecasting.",
        "typical_deal_size": 160000,
        "license_type": "Subscription"
    },
    {
        "product_name": "SPSS Statistics",
        "product_family": "Analytics & BI",
        "category": "Analytics",
        "description": "Statistical analysis software for data preparation, descriptive statistics, and predictive analytics.",
        "typical_deal_size": 50000,
        "license_type": "Subscription"
    },
    {
        "product_name": "Cognos Controller",
        "product_family": "Analytics & BI",
        "category": "Analytics",
        "description": "Financial consolidation and reporting solution for automating the close process.",
        "typical_deal_size": 140000,
        "license_type": "Subscription"
    },
    
    # Specialized Solutions
    {
        "product_name": "Netezza Performance Server",
        "product_family": "Data Management",
        "category": "Database",
        "description": "Purpose-built analytics appliance for complex queries on massive datasets.",
        "typical_deal_size": 250000,
        "license_type": "Subscription"
    },
    {
        "product_name": "Watson Query",
        "product_family": "DataOps",
        "category": "Platform",
        "description": "Data virtualization solution for querying data across multiple sources without moving it.",
        "typical_deal_size": 105000,
        "license_type": "Subscription"
    },
    {
        "product_name": "Match 360",
        "product_family": "Data Governance",
        "category": "Governance",
        "description": "Probabilistic matching engine for entity resolution and data quality.",
        "typical_deal_size": 115000,
        "license_type": "Subscription"
    },
    {
        "product_name": "InfoSphere Optim",
        "product_family": "DataOps",
        "category": "Platform",
        "description": "Test data management and data archiving solution for optimizing database performance.",
        "typical_deal_size": 95000,
        "license_type": "Perpetual"
    },
    {
        "product_name": "Watson Natural Language Understanding",
        "product_family": "AI & Machine Learning",
        "category": "AI/ML",
        "description": "NLP service for extracting metadata from text such as entities, keywords, sentiment, and emotion.",
        "typical_deal_size": 65000,
        "license_type": "Usage-based"
    },
    {
        "product_name": "Watson Speech to Text",
        "product_family": "AI & Machine Learning",
        "category": "AI/ML",
        "description": "Speech recognition service that converts audio and voice into written text.",
        "typical_deal_size": 55000,
        "license_type": "Usage-based"
    }
]


def get_products_by_family(family: str):
    """Get all products in a specific family"""
    return [p for p in IBM_PRODUCTS if p["product_family"] == family]


def get_products_by_category(category: str):
    """Get all products in a specific category"""
    return [p for p in IBM_PRODUCTS if p["category"] == category]


def get_product_families():
    """Get list of all product families"""
    return list(set(p["product_family"] for p in IBM_PRODUCTS))


def get_product_categories():
    """Get list of all product categories"""
    return list(set(p["category"] for p in IBM_PRODUCTS))

# Made with Bob
