# 📚 Praetor - Legal Document Review API Documentation

> Complete documentation index for the Legal Document Review application powered by IBM Watson

---

## 🚀 Quick Navigation

### Getting Started
- **[Quick Start Guide](backend/QUICKSTART.md)** - Get up and running in 5 minutes
- **[Credential Setup](backend/get-cloudant-credentials.md)** - How to get your IBM Cloud credentials

### Development
- **[API Documentation](backend/README.md)** - Complete API reference and usage examples
- **[Frontend Plan](FRONTEND_PLAN.md)** - Simple 6-8 hour plan to build React frontend
- **[Deployment Guide](backend/DEPLOYMENT.md)** - Deploy to IBM Cloud step-by-step

---

## 📖 Documentation Structure

### 1️⃣ [Quick Start Guide](backend/QUICKSTART.md)
**Start here if you're new to the project**

- Prerequisites checklist
- Installation steps
- Environment configuration
- Credential verification
- Running the application
- Testing the API
- Troubleshooting common issues

**Time to complete:** 10-15 minutes

---

### 2️⃣ [Get Cloudant Credentials](backend/get-cloudant-credentials.md)
**Use this when setting up IBM Cloudant**

- Understanding Cloudant authentication
- Step-by-step credential retrieval
- Common mistakes to avoid
- Alternative authentication methods
- Troubleshooting credential issues

**Time to complete:** 5 minutes

---

### 3️⃣ [API Documentation](backend/README.md)
**Complete reference for all API endpoints**

- Project overview
- Architecture diagram
- API endpoint reference
- Request/response examples
- Error handling
- Watson NLU integration details
- Cloudant database schema
- Testing examples

**Use this for:** Development, integration, API reference

---

### 4️⃣ [Frontend Plan](FRONTEND_PLAN.md)
**Simple plan to build a React web interface**

- React.js setup guide
- Component structure (TextInput, AnalyzeButton, Results)
- API integration with backend
- Simple styling guide
- 6-8 hour MVP timeline
- Optional enhancements
- Deployment options (Vercel, Netlify)

**Time to complete:** 6-8 hours for MVP

---

### 5️⃣ [Deployment Guide](backend/DEPLOYMENT.md)
**Deploy your application to IBM Cloud**

- IBM Cloud service setup
- Deployment options comparison
- Step-by-step deployment instructions
- Post-deployment checklist
- Cost optimization tips
- Security best practices
- Monitoring and maintenance

**Time to complete:** 30-45 minutes

---

## 🎯 Common Tasks

### First Time Setup
1. Read [Quick Start Guide](backend/QUICKSTART.md)
2. Follow [Get Cloudant Credentials](backend/get-cloudant-credentials.md)
3. Run `node verify-credentials.js` to test
4. Start developing!

### Frontend Development
1. Backend must be running first
2. Follow [Frontend Plan](FRONTEND_PLAN.md)
3. Build React components step-by-step
4. Test with local backend
5. Deploy to Vercel or Netlify

### API Integration
1. Review [API Documentation](backend/README.md)
2. Test endpoints with provided curl examples
3. Integrate with your application

### Production Deployment
1. Complete local setup first
2. Follow [Deployment Guide](backend/DEPLOYMENT.md)
3. Use IBM Code Engine (recommended)
4. Monitor and optimize

---

## 🔧 Quick Commands

```bash
# Verify credentials
cd backend && node verify-credentials.js

# Start development server
cd backend && npm run dev

# Start production server
cd backend && npm start

# Test API health
curl http://localhost:3000/api/health

# Analyze a legal clause
curl -X POST http://localhost:3000/api/clauses/conf-001/analyze
```

---

## 📁 Project Structure

```
Praetor/
├── backend/
│   ├── server.js                    # Main application server
│   ├── package.json                 # Dependencies
│   ├── .env.example                 # Environment template
│   ├── verify-credentials.js        # Credential testing script
│   │
│   ├── services/
│   │   ├── watson.service.js        # Watson NLU integration
│   │   └── cloudant.service.js      # Cloudant database operations
│   │
│   ├── routes/
│   │   └── analysis.routes.js       # API endpoints
│   │
│   ├── data/
│   │   └── clauses.json             # Pre-loaded legal clauses
│   │
│   └── Documentation/
│       ├── README.md                # API documentation
│       ├── QUICKSTART.md            # Quick start guide
│       ├── DEPLOYMENT.md            # Deployment guide
│       └── get-cloudant-credentials.md  # Credential help
│
└── DOCUMENTATION.md                 # This file (navigation index)
```

---

## 🆘 Getting Help

### Troubleshooting Steps
1. Check [Quick Start Guide - Troubleshooting](backend/QUICKSTART.md#troubleshooting)
2. Run `node verify-credentials.js` to diagnose credential issues
3. Review [Deployment Guide - Common Issues](backend/DEPLOYMENT.md#troubleshooting-common-issues)
4. Check application logs for error messages

### Common Issues

| Issue | Solution | Documentation |
|-------|----------|---------------|
| Credentials not working | Run verification script | [Get Cloudant Credentials](backend/get-cloudant-credentials.md) |
| API not starting | Check dependencies installed | [Quick Start Guide](backend/QUICKSTART.md) |
| Watson NLU errors | Verify API key format | [Deployment Guide](backend/DEPLOYMENT.md#watson-nlu-setup) |
| Cloudant connection fails | Check authentication method | [Get Cloudant Credentials](backend/get-cloudant-credentials.md) |
| Deployment issues | Review prerequisites | [Deployment Guide](backend/DEPLOYMENT.md#prerequisites) |

---

## 🎓 Learning Path

### Beginner
1. ✅ Complete [Quick Start Guide](backend/QUICKSTART.md)
2. ✅ Test all API endpoints locally
3. ✅ Understand the response format

### Intermediate
1. ✅ Read [API Documentation](backend/README.md) thoroughly
2. ✅ Integrate API with your application
3. ✅ Customize analysis parameters

### Advanced
1. ✅ Follow [Deployment Guide](backend/DEPLOYMENT.md)
2. ✅ Deploy to IBM Cloud
3. ✅ Implement monitoring and optimization
4. ✅ Scale for production use

---

## 📊 Features Overview

### Core Functionality
- ✅ Legal clause analysis using Watson NLU
- ✅ Entity extraction (parties, dates, amounts)
- ✅ Keyword and concept identification
- ✅ Sentiment analysis
- ✅ Risk scoring algorithm
- ✅ Persistent storage in Cloudant
- ✅ Batch analysis support
- ✅ Custom text analysis

### IBM Cloud Services
- ✅ Watson Natural Language Understanding
- ✅ Cloudant NoSQL Database
- ✅ IBM Code Engine (deployment)

### Pre-loaded Content
- ✅ 15 legal clauses across 7 categories
- ✅ Confidentiality clauses
- ✅ Termination clauses
- ✅ Indemnification clauses
- ✅ Liability clauses
- ✅ Payment terms
- ✅ Intellectual property clauses
- ✅ Dispute resolution clauses

---

## 🔗 External Resources

### IBM Cloud Documentation
- [Watson NLU Documentation](https://cloud.ibm.com/docs/natural-language-understanding)
- [Cloudant Documentation](https://cloud.ibm.com/docs/Cloudant)
- [Code Engine Documentation](https://cloud.ibm.com/docs/codeengine)

### IBM Cloud Console
- [IBM Cloud Dashboard](https://cloud.ibm.com/resources)
- [Watson Services](https://cloud.ibm.com/catalog?category=ai)
- [Cloudant Services](https://cloud.ibm.com/catalog/services/cloudant)

---

## 📝 Document Versions

| Document | Last Updated | Version |
|----------|--------------|---------|
| DOCUMENTATION.md | 2026-05-02 | 1.0 |
| QUICKSTART.md | 2026-05-02 | 1.0 |
| README.md | 2026-05-02 | 1.0 |
| DEPLOYMENT.md | 2026-05-02 | 1.0 |
| get-cloudant-credentials.md | 2026-05-02 | 1.0 |

---

## 🎯 Next Steps

Choose your path:

- **New User?** → Start with [Quick Start Guide](backend/QUICKSTART.md)
- **Need Credentials?** → See [Get Cloudant Credentials](backend/get-cloudant-credentials.md)
- **Developing?** → Reference [API Documentation](backend/README.md)
- **Deploying?** → Follow [Deployment Guide](backend/DEPLOYMENT.md)

---

**Built with IBM Watson | Powered by IBM Cloud**