# Legal Document Review API

A Node.js/Express backend API for analyzing legal document clauses using IBM Watson Natural Language Understanding (NLU) and storing results in IBM Cloudant database.

## Overview

This application provides automated analysis of legal clauses, extracting entities, keywords, sentiment, and calculating risk scores. It's designed to help legal professionals quickly assess contract clauses for potential issues.

## Features

- **Pre-loaded Legal Clauses**: 15 sample clauses across 7 categories
- **Watson NLU Analysis**: Automated extraction of entities, keywords, sentiment, and concepts
- **Risk Assessment**: Intelligent risk scoring based on sentiment and content analysis
- **Cloudant Storage**: Persistent storage of analysis results
- **Batch Processing**: Analyze multiple clauses in a single request
- **RESTful API**: Clean, well-documented endpoints

## Project Structure

```
backend/
├── server.js                 # Express server and initialization
├── package.json              # Dependencies and scripts
├── .env.example              # Environment variables template
├── services/
│   ├── watson.service.js     # Watson NLU integration
│   └── cloudant.service.js   # Cloudant database operations
├── routes/
│   └── analysis.routes.js    # API route handlers
├── data/
│   └── clauses.json          # Pre-loaded legal clauses
└── README.md                 # This file
```

## Prerequisites

- Node.js 14.x or higher
- npm or yarn
- IBM Cloud account
- Watson Natural Language Understanding service instance
- Cloudant database service instance

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure IBM Cloud Services

#### Create Watson NLU Service

1. Log in to [IBM Cloud](https://cloud.ibm.com)
2. Navigate to **Catalog** > **AI / Machine Learning**
3. Select **Natural Language Understanding**
4. Choose a plan (Lite plan available for free)
5. Click **Create**
6. Go to **Service credentials** and create new credentials
7. Copy the `apikey` and `url`

#### Create Cloudant Database Service

1. In IBM Cloud, navigate to **Catalog** > **Databases**
2. Select **Cloudant**
3. Choose a plan (Lite plan available for free)
4. Click **Create**
5. Go to **Service credentials** and create new credentials
6. Copy the `url` (includes authentication)

### 3. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and add your IBM Cloud credentials:

```env
WATSON_NLU_APIKEY=your_watson_api_key_here
WATSON_NLU_URL=https://api.us-south.natural-language-understanding.watson.cloud.ibm.com/instances/xxxxx
CLOUDANT_URL=https://apikey:password@xxxxx.cloudantnosqldb.appdomain.cloud
PORT=3000
NODE_ENV=development
```

### 4. Start the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on `http://localhost:3000`

## API Documentation

### Base URL
```
http://localhost:3000/api
```

### Endpoints

#### 1. Health Check
```http
GET /api/health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "service": "Legal Document Review API",
  "version": "1.0.0"
}
```

#### 2. List All Clauses
```http
GET /api/clauses
```

**Response:**
```json
{
  "success": true,
  "count": 15,
  "clauses": [
    {
      "id": "conf-001",
      "type": "confidentiality",
      "text": "The Receiving Party agrees to hold all Confidential Information..."
    }
  ]
}
```

#### 3. Get Specific Clause
```http
GET /api/clauses/:id
```

**Example:**
```bash
curl http://localhost:3000/api/clauses/conf-001
```

**Response:**
```json
{
  "success": true,
  "clause": {
    "id": "conf-001",
    "type": "confidentiality",
    "text": "The Receiving Party agrees to hold all Confidential Information..."
  }
}
```

#### 4. Analyze Specific Clause
```http
POST /api/clauses/:id/analyze
```

**Example:**
```bash
curl -X POST http://localhost:3000/api/clauses/conf-001/analyze
```

**Response:**
```json
{
  "success": true,
  "message": "Clause analyzed successfully",
  "analysis": {
    "id": "cloudant-doc-id",
    "clauseId": "conf-001",
    "clauseType": "confidentiality",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "text": "The Receiving Party agrees...",
    "analysis": {
      "sentiment": {
        "document": {
          "score": 0.2,
          "label": "positive"
        }
      },
      "entities": [...],
      "keywords": [...],
      "concepts": [...]
    },
    "risk": {
      "score": 25,
      "level": "low",
      "factors": ["Risk keywords present (2)"]
    }
  }
}
```

#### 5. Batch Analyze All Clauses
```http
POST /api/analyze/batch
```

**Example:**
```bash
curl -X POST http://localhost:3000/api/analyze/batch
```

**Response:**
```json
{
  "success": true,
  "message": "Batch analysis completed",
  "analysis": {
    "results": [...],
    "errors": [],
    "summary": {
      "total": 15,
      "successful": 15,
      "failed": 0
    }
  },
  "storage": {
    "total": 15,
    "successful": 15,
    "failed": 0
  }
}
```

#### 6. Analyze Custom Text
```http
POST /api/analyze/custom
Content-Type: application/json
```

**Request Body:**
```json
{
  "text": "Your custom legal clause text here",
  "clauseType": "custom"
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/api/analyze/custom \
  -H "Content-Type: application/json" \
  -d '{"text":"The parties agree to binding arbitration","clauseType":"dispute resolution"}'
```

#### 7. List All Analysis Results
```http
GET /api/results?limit=100&clauseId=conf-001&riskLevel=high
```

**Query Parameters:**
- `limit` (optional): Maximum number of results (default: 100)
- `clauseId` (optional): Filter by clause ID
- `riskLevel` (optional): Filter by risk level (low, medium, high)

**Example:**
```bash
curl "http://localhost:3000/api/results?riskLevel=high&limit=10"
```

#### 8. Get Specific Analysis Result
```http
GET /api/results/:id
```

**Example:**
```bash
curl http://localhost:3000/api/results/cloudant-doc-id
```

## Risk Scoring Algorithm

The risk score (0-100) is calculated based on:

1. **Sentiment Analysis (30 points max)**
   - Very negative sentiment (< -0.5): 30 points
   - Negative sentiment (< -0.2): 20 points
   - Slightly negative (< 0): 10 points

2. **Risk Keywords (40 points max)**
   - Keywords: terminate, liability, indemnify, breach, damages, penalty, etc.
   - 5+ keywords: 40 points
   - 3-4 keywords: 25 points
   - 1-2 keywords: 15 points

3. **Entity Analysis (30 points max)**
   - No entities: 30 points (too vague)
   - Few entities (< 2): 15 points (lacks specificity)

**Risk Levels:**
- **Low**: 0-39 points
- **Medium**: 40-69 points
- **High**: 70-100 points

## Testing the API

### Quick Test Commands

1. **Check server health:**
```bash
curl http://localhost:3000/api/health
```

2. **List all clauses:**
```bash
curl http://localhost:3000/api/clauses
```

3. **Analyze a single clause:**
```bash
curl -X POST http://localhost:3000/api/clauses/term-001/analyze
```

4. **Analyze all clauses:**
```bash
curl -X POST http://localhost:3000/api/analyze/batch
```

5. **View results:**
```bash
curl http://localhost:3000/api/results
```

## IBM Cloud Deployment

### Option 1: Cloud Foundry

1. Install IBM Cloud CLI:
```bash
curl -fsSL https://clis.cloud.ibm.com/install/linux | sh
```

2. Login to IBM Cloud:
```bash
ibmcloud login
ibmcloud target --cf
```

3. Create `manifest.yml`:
```yaml
applications:
- name: legal-review-api
  memory: 256M
  instances: 1
  buildpack: nodejs_buildpack
  command: npm start
  env:
    NODE_ENV: production
```

4. Deploy:
```bash
ibmcloud cf push
```

### Option 2: Code Engine

1. Create Code Engine project:
```bash
ibmcloud ce project create --name legal-review
```

2. Build and deploy:
```bash
ibmcloud ce application create \
  --name legal-review-api \
  --build-source . \
  --port 3000 \
  --env WATSON_NLU_APIKEY=your_key \
  --env WATSON_NLU_URL=your_url \
  --env CLOUDANT_URL=your_url
```

### Environment Variables in IBM Cloud

Set environment variables through:
- IBM Cloud Console: App > Runtime > Environment Variables
- CLI: `ibmcloud cf set-env APP_NAME VAR_NAME VAR_VALUE`

## Troubleshooting

### Watson NLU Errors

**Error: "Watson NLU credentials not configured"**
- Ensure `WATSON_NLU_APIKEY` and `WATSON_NLU_URL` are set in `.env`
- Verify credentials are correct in IBM Cloud console

**Error: "Unauthorized"**
- Check API key is valid
- Ensure service instance is active

### Cloudant Errors

**Error: "Cloudant credentials not configured"**
- Ensure `CLOUDANT_URL` is set in `.env`
- URL should include authentication: `https://apikey:password@host`

**Error: "Database not found"**
- Database is created automatically on first run
- Check Cloudant service is active

### General Issues

**Port already in use:**
```bash
# Change port in .env
PORT=3001
```

**Module not found:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## Development

### Adding New Clauses

Edit `data/clauses.json`:
```json
{
  "clauses": [
    {
      "id": "new-001",
      "type": "new-type",
      "text": "Your clause text here"
    }
  ]
}
```

### Modifying Risk Calculation

Edit `services/watson.service.js` in the `calculateRiskScore()` function.

## License

MIT

## Support

For issues and questions:
- IBM Cloud Documentation: https://cloud.ibm.com/docs
- Watson NLU API Reference: https://cloud.ibm.com/apidocs/natural-language-understanding
- Cloudant API Reference: https://cloud.ibm.com/apidocs/cloudant

## Next Steps

1. Configure IBM Cloud credentials in `.env`
2. Test endpoints with provided curl commands
3. Deploy to IBM Cloud
4. Build frontend application to consume this API
5. Add authentication/authorization
6. Implement rate limiting
7. Add comprehensive logging
8. Set up monitoring and alerts