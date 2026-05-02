# Quick Start Guide

## Prerequisites

- Node.js 14+ installed
- IBM Cloud account with Watson NLU and Cloudant services created
- Service credentials obtained from IBM Cloud

## Step 1: Install Dependencies

```bash
cd backend
npm install
```

## Step 2: Configure Environment Variables

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Edit `.env` and add your IBM Cloud credentials:
```env
WATSON_NLU_APIKEY=your_actual_watson_api_key
WATSON_NLU_URL=https://api.us-south.natural-language-understanding.watson.cloud.ibm.com/instances/xxxxx
CLOUDANT_URL=https://apikey-v2-xxxxx:yyyyy@xxxxx.cloudantnosqldb.appdomain.cloud
PORT=3000
```

**Where to find these credentials:**
- Watson NLU: IBM Cloud Console → Watson NLU service → Service credentials
- Cloudant: IBM Cloud Console → Cloudant service → Service credentials

## Step 3: Verify Credentials

Before running the application, verify your credentials are correct:

```bash
node verify-credentials.js
```

**Expected output:**
```
✓ Watson NLU connection successful!
✓ Cloudant connection successful!
✅ All credentials verified successfully!
```

**If verification fails:**
- Check that you copied the credentials correctly
- Ensure no extra spaces or quotes in the .env file
- Verify services are provisioned in IBM Cloud
- See DEPLOYMENT.md for detailed troubleshooting

## Step 4: Start the Application

### Option A: Production Mode
```bash
npm start
```

### Option B: Development Mode (with auto-restart)
```bash
npm run dev
```

**Expected output:**
```
Watson NLU service initialized
Cloudant database 'legal-analysis-results' connected
Legal Document Review API is running on port 3000
```

## Step 5: Test the API

Open a new terminal and test the endpoints:

### Health Check
```bash
curl http://localhost:3000/api/health
```

### List All Clauses
```bash
curl http://localhost:3000/api/clauses
```

### Analyze a Clause
```bash
curl -X POST http://localhost:3000/api/clauses/conf-001/analyze
```

### Get Analysis Results
```bash
curl http://localhost:3000/api/results
```

## Troubleshooting

### "Cannot find module" errors
```bash
npm install
```

### ".env file not found"
```bash
cp .env.example .env
# Then edit .env with your credentials
```

### "Watson NLU connection failed"
- Verify WATSON_NLU_APIKEY is correct
- Verify WATSON_NLU_URL is correct
- Check Watson NLU service is active in IBM Cloud

### "Cloudant connection failed"
- Verify CLOUDANT_URL format: `https://apikey-v2-xxx:yyy@xxx.cloudantnosqldb.appdomain.cloud`
- Check Cloudant service is active in IBM Cloud
- Ensure URL includes authentication credentials

### Port already in use
```bash
# Change PORT in .env file
PORT=3001
```

## Next Steps

- See [README.md](README.md) for complete API documentation
- See [DEPLOYMENT.md](DEPLOYMENT.md) for deploying to IBM Cloud
- Test all endpoints using the examples in README.md

## Quick Reference

| Command | Description |
|---------|-------------|
| `npm install` | Install dependencies |
| `node verify-credentials.js` | Verify IBM Cloud credentials |
| `npm start` | Start application (production) |
| `npm run dev` | Start with auto-restart (development) |
| `npm test` | Run tests (if available) |

## Support

If you encounter issues:
1. Run `node verify-credentials.js` to diagnose credential problems
2. Check the console output for error messages
3. Review DEPLOYMENT.md for detailed setup instructions
4. Ensure all IBM Cloud services are provisioned and active