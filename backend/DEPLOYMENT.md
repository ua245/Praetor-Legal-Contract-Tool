# IBM Cloud Deployment Plan for Legal Document Review API

## Executive Summary

This deployment plan provides comprehensive guidance for deploying the Legal Document Review Backend API to IBM Cloud. The application is a Node.js/Express API that uses Watson Natural Language Understanding for legal clause analysis and Cloudant for persistent storage.

**Recommended Deployment Option:** IBM Code Engine (serverless containers)
**Estimated Monthly Cost:** $0 (within free tier limits for development/testing)
**Deployment Time:** 30-45 minutes

---

## 1. IBM Cloud Service Setup Guide

### 1.1 Create IBM Cloud Account

1. Navigate to [IBM Cloud](https://cloud.ibm.com)
2. Click **Create an account** (or log in if you have one)
3. Complete registration with email verification
4. No credit card required for Lite tier services

### 1.2 Watson Natural Language Understanding Setup

**Step-by-step Instructions:**

1. **Access the Catalog**
   - Log into IBM Cloud Console
   - Click **Catalog** in the top navigation
   - Navigate to **AI / Machine Learning** category

2. **Create NLU Service**
   - Search for "Natural Language Understanding"
   - Click on the service tile
   - Select region: **Dallas (us-south)** (recommended for free tier)
   - Choose pricing plan: **Lite** (Free)
     - 30,000 NLU items per month
     - 1 custom model
     - No credit card required

3. **Configure Service**
   - Service name: `legal-review-nlu` (or your preference)
   - Resource group: **Default**
   - Click **Create**

4. **Obtain Credentials**
   - After creation, click **Service credentials** in left sidebar
   - Click **New credential** button
   - Name: `legal-review-credentials`
   - Role: **Manager**
   - Click **Add**
   - Click **View credentials** (eye icon)
   - Copy the following values:
     ```json
     {
       "apikey": "your-api-key-here",
       "url": "https://api.us-south.natural-language-understanding.watson.cloud.ibm.com/instances/xxxxx"
     }
     ```

**Pricing Tier Details:**
- **Lite (Free):** 30,000 NLU items/month, perfect for development
- **Standard:** $0.003 per NLU item after free tier
- **NLU Item:** One text unit, entity, keyword, or other feature

### 1.3 Cloudant Database Setup

**Step-by-step Instructions:**

1. **Access the Catalog**
   - In IBM Cloud Console, click **Catalog**
   - Navigate to **Databases** category

2. **Create Cloudant Service**
   - Search for "Cloudant"
   - Click on the service tile
   - Select region: **Dallas (us-south)** (recommended)
   - Choose pricing plan: **Lite** (Free)
     - 1 GB data storage
     - 20 lookups/sec
     - 10 writes/sec
     - 5 queries/sec

3. **Configure Service**
   - Service name: `legal-review-cloudant` (or your preference)
   - Authentication method: **IAM and legacy credentials**
   - Resource group: **Default**
   - Click **Create**

4. **Obtain Credentials**
   - After creation, click **Service credentials** in left sidebar
   - Click **New credential** button
   - Name: `legal-review-db-credentials`
   - Role: **Manager**
   - Click **Add**
   - Click **View credentials**
   - Copy the `url` value (includes authentication):
     ```json
     {
       "url": "https://apikey-v2-xxxxx:yyyyy@xxxxx.cloudantnosqldb.appdomain.cloud"
     }
     ```

**Pricing Tier Details:**
- **Lite (Free):** 1GB storage, 20 reads/sec, 10 writes/sec
- **Standard:** Pay-as-you-go starting at $0.25/GB/month
- Database is automatically created by the application on first run

### 1.4 Credentials Summary

After setup, you should have:
```env
WATSON_NLU_APIKEY=your_watson_api_key
WATSON_NLU_URL=https://api.us-south.natural-language-understanding.watson.cloud.ibm.com/instances/xxxxx
CLOUDANT_URL=https://apikey-v2-xxxxx:yyyyy@xxxxx.cloudantnosqldb.appdomain.cloud
```

---

## 2. Deployment Options Analysis

### 2.1 IBM Cloud Foundry (Traditional PaaS)

**Overview:** Platform-as-a-Service that automatically manages infrastructure, scaling, and runtime.

**Pros:**
- ✅ Simple deployment with `ibmcloud cf push`
- ✅ Automatic buildpack detection (Node.js)
- ✅ Built-in health monitoring and auto-restart
- ✅ Easy environment variable management
- ✅ Mature, stable platform
- ✅ Good for traditional web applications

**Cons:**
- ❌ Less cost-effective than serverless options
- ❌ Always-on instances (even with no traffic)
- ❌ Limited to 256MB memory on free tier
- ❌ Being phased out in favor of Code Engine
- ❌ Less flexible scaling options

**Cost Implications:**
- **Free Tier:** 256MB memory, limited to 10 days/month runtime
- **Paid:** ~$0.05/GB-hour (~$36/month for 1GB instance)
- Not ideal for intermittent usage patterns

**Complexity Level:** ⭐⭐ (Low-Medium)

**Best Use Case:** 
- Legacy applications already on Cloud Foundry
- Teams familiar with Heroku-style deployments
- Applications requiring 24/7 availability

**Recommendation:** ❌ Not recommended (being deprecated, less cost-effective)

---

### 2.2 IBM Code Engine (Serverless Containers) ⭐ RECOMMENDED

**Overview:** Fully managed serverless platform that runs containerized applications and scales to zero.

**Pros:**
- ✅ **Scales to zero** - no cost when idle
- ✅ Automatic scaling based on traffic (0-1000 instances)
- ✅ Built-in HTTPS with custom domains
- ✅ Generous free tier (100,000 vCPU-seconds/month)
- ✅ No infrastructure management
- ✅ Fast cold starts (~2 seconds)
- ✅ Integrated with IBM Cloud services
- ✅ Built-in CI/CD from source code
- ✅ Pay only for actual usage

**Cons:**
- ❌ Cold start latency (2-3 seconds after idle)
- ❌ Requires containerization knowledge (minimal)
- ❌ Limited to 10-minute request timeout
- ❌ Newer platform (less community resources)

**Cost Implications:**
- **Free Tier (per month):**
  - 100,000 vCPU-seconds
  - 200,000 GB-seconds memory
  - 100,000 HTTP requests
  - Sufficient for development and low-traffic production
- **Paid:** $0.00002400/vCPU-second, $0.00000300/GB-second
- **Example:** 10,000 requests/month with 0.5 vCPU, 1GB RAM, 2s duration = **$0.00** (within free tier)

**Complexity Level:** ⭐⭐ (Low-Medium)

**Best Use Case:**
- ✅ **APIs with variable traffic patterns**
- ✅ **Development and testing environments**
- ✅ **Cost-sensitive deployments**
- ✅ **Microservices architectures**
- ✅ **This legal document review API** (perfect fit!)

**Recommendation:** ✅ **HIGHLY RECOMMENDED** - Best balance of cost, simplicity, and features

---

### 2.3 IBM Kubernetes Service (Full Container Orchestration)

**Overview:** Managed Kubernetes cluster for complex, production-grade containerized applications.

**Pros:**
- ✅ Full control over infrastructure
- ✅ Advanced networking and security
- ✅ Multi-container orchestration
- ✅ Industry-standard Kubernetes
- ✅ Suitable for complex microservices
- ✅ Advanced monitoring and logging

**Cons:**
- ❌ **High complexity** - requires Kubernetes expertise
- ❌ **Expensive** - minimum $0.11/hour (~$80/month) for smallest cluster
- ❌ Always-on infrastructure costs
- ❌ Significant operational overhead
- ❌ Overkill for single API application
- ❌ Longer setup time (hours vs minutes)

**Cost Implications:**
- **No free tier** for worker nodes
- **Minimum:** 2 vCPU, 4GB RAM = ~$80-120/month
- **Production:** 3+ nodes = $240+/month
- Additional costs for load balancers, storage

**Complexity Level:** ⭐⭐⭐⭐⭐ (Very High)

**Best Use Case:**
- Large-scale microservices architectures
- Applications requiring advanced orchestration
- Teams with Kubernetes expertise
- Enterprise production workloads

**Recommendation:** ❌ Not recommended (excessive complexity and cost for this use case)

---

### 2.4 Deployment Recommendation Summary

| Criteria | Cloud Foundry | Code Engine ⭐ | Kubernetes |
|----------|---------------|----------------|------------|
| **Cost (Free Tier)** | Limited | Excellent | None |
| **Complexity** | Low | Low-Medium | Very High |
| **Scalability** | Manual | Automatic | Advanced |
| **Cold Starts** | None | 2-3 seconds | None |
| **Setup Time** | 15 min | 20 min | 2+ hours |
| **Maintenance** | Low | Very Low | High |
| **Best For** | Legacy apps | Modern APIs | Enterprise |

**Final Recommendation: IBM Code Engine**

Reasons:
1. **Cost-effective:** Free tier covers development and low-traffic production
2. **Scales to zero:** No charges when not in use
3. **Simple deployment:** One command from source code
4. **Perfect fit:** Ideal for REST APIs with variable traffic
5. **Future-proof:** IBM's strategic serverless platform

---

## 3. Step-by-Step Deployment Instructions (Code Engine)

### 3.1 Prerequisites

**Required Tools:**

1. **IBM Cloud CLI**
   ```bash
   # Linux/macOS
   curl -fsSL https://clis.cloud.ibm.com/install/linux | sh
   
   # Verify installation
   ibmcloud --version
   ```

2. **Code Engine Plugin**
   ```bash
   ibmcloud plugin install code-engine
   ```

3. **Docker** (optional, for local testing)
   ```bash
   # Ubuntu/Debian
   sudo apt-get update
   sudo apt-get install docker.io
   
   # Verify
   docker --version
   ```

**Verify Prerequisites:**
```bash
ibmcloud --version          # Should show version 2.x or higher
ibmcloud plugin list        # Should show code-engine plugin
node --version              # Should show v14.x or higher
```

### 3.2 Prepare Application for Deployment

**1. Create Dockerfile**

Create `backend/Dockerfile`:

```dockerfile
# Use official Node.js LTS image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy application code
COPY . .

# Expose port (Code Engine will override this)
EXPOSE 3000

# Set production environment
ENV NODE_ENV=production

# Start application
CMD ["node", "server.js"]
```

**2. Create .dockerignore**

Create `backend/.dockerignore`:

```
node_modules
npm-debug.log
.env
.env.example
.git
.gitignore
README.md
*.md
.vscode
```

**3. Test Dockerfile Locally (Optional)**

```bash
cd backend

# Build image
docker build -t legal-review-api:test .

# Run container
docker run -p 3000:3000 \
  -e WATSON_NLU_APIKEY=your_key \
  -e WATSON_NLU_URL=your_url \
  -e CLOUDANT_URL=your_url \
  legal-review-api:test

# Test
curl http://localhost:3000/api/health
```

### 3.3 Deploy to IBM Code Engine

**Step 1: Login to IBM Cloud**

```bash
# Login
ibmcloud login

# Select your account if prompted
# Enter your IBM Cloud credentials
```

**Step 2: Target Resource Group**

```bash
# List resource groups
ibmcloud resource groups

# Target default resource group
ibmcloud target -g Default
```

**Step 3: Create Code Engine Project**

```bash
# Create project (one-time setup)
ibmcloud ce project create --name legal-review-project

# Select the project
ibmcloud ce project select --name legal-review-project

# Verify
ibmcloud ce project current
```

**Step 4: Deploy Application from Source**

```bash
# Navigate to backend directory
cd backend

# Deploy application (Code Engine builds and deploys automatically)
ibmcloud ce application create \
  --name legal-review-api \
  --build-source . \
  --build-context-dir . \
  --strategy dockerfile \
  --port 3000 \
  --min-scale 0 \
  --max-scale 5 \
  --cpu 0.5 \
  --memory 1G \
  --env WATSON_NLU_APIKEY=your_watson_api_key \
  --env WATSON_NLU_URL=your_watson_url \
  --env CLOUDANT_URL=your_cloudant_url \
  --env NODE_ENV=production
```

**Command Explanation:**
- `--name`: Application name
- `--build-source .`: Build from current directory
- `--strategy dockerfile`: Use Dockerfile for build
- `--port 3000`: Application listens on port 3000
- `--min-scale 0`: Scale to zero when idle (cost savings)
- `--max-scale 5`: Maximum 5 instances under load
- `--cpu 0.5`: 0.5 vCPU per instance
- `--memory 1G`: 1GB RAM per instance
- `--env`: Environment variables (credentials)

**Step 5: Monitor Deployment**

```bash
# Watch build progress
ibmcloud ce buildrun list

# Check application status
ibmcloud ce application get --name legal-review-api

# View logs
ibmcloud ce application logs --name legal-review-api
```

**Step 6: Get Application URL**

```bash
# Get the public URL
ibmcloud ce application get --name legal-review-api --output url

# Example output:
# https://legal-review-api.abcdefgh.us-south.codeengine.appdomain.cloud
```

---

## 4. Post-Deployment Checklist

### 4.1 Verify Services are Running

```bash
# Get application URL
APP_URL=$(ibmcloud ce application get --name legal-review-api --output url)

# Test health check
curl $APP_URL/api/health

# Test clause listing
curl $APP_URL/api/clauses

# Test analysis
curl -X POST $APP_URL/api/clauses/conf-001/analyze
```

### 4.2 Check Logs

```bash
# Real-time logs
ibmcloud ce application logs --name legal-review-api --follow

# Recent logs
ibmcloud ce application logs --name legal-review-api --tail 100
```

### 4.3 Monitor API Health

```bash
# Check application status
ibmcloud ce application get --name legal-review-api

# View application events
ibmcloud ce application events --name legal-review-api
```

---

## 5. Cost Optimization Tips

### 5.1 Stay Within Free Tier Limits

- **Watson NLU:** 30,000 items/month
- **Code Engine:** 100,000 vCPU-seconds/month
- **Cloudant:** 1GB storage, 20 reads/sec

### 5.2 Token Usage Monitoring

Implement usage tracking in your application to monitor Watson NLU token consumption.

### 5.3 Cloudant Request Optimization

- Use bulk operations instead of individual saves
- Implement caching for frequently accessed data
- Create indexes for common queries

---

## 6. Security Best Practices

### 6.1 API Key Management

```bash
# Use Code Engine secrets for sensitive data
ibmcloud ce secret create --name watson-credentials \
  --from-literal WATSON_NLU_APIKEY=your_key \
  --from-literal WATSON_NLU_URL=your_url

# Reference in application
ibmcloud ce application update --name legal-review-api \
  --env-from-secret watson-credentials
```

### 6.2 CORS Configuration

Update server.js with production CORS settings:

```javascript
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  methods: ['GET', 'POST'],
  credentials: true
};
```

### 6.3 Rate Limiting

Install and configure express-rate-limit to protect your API from abuse.

---

## 7. Quick Reference Commands

```bash
# View application status
ibmcloud ce application get --name legal-review-api

# View logs
ibmcloud ce application logs --name legal-review-api --tail 100

# Update environment variable
ibmcloud ce application update --name legal-review-api \
  --env VARIABLE_NAME=new_value

# Restart application
ibmcloud ce application update --name legal-review-api --force

# Scale application
ibmcloud ce application update --name legal-review-api \
  --min-scale 1 --max-scale 10
```

---

## 8. Support and Resources

- **Code Engine Docs:** https://cloud.ibm.com/docs/codeengine
- **Watson NLU Docs:** https://cloud.ibm.com/docs/natural-language-understanding
- **Cloudant Docs:** https://cloud.ibm.com/docs/Cloudant
- **IBM Cloud Community:** https://community.ibm.com/community/user/cloud/home

---

**Document Version:** 1.0  
**Last Updated:** 2026-05-02  
**Deployment Target:** IBM Code Engine  
**Application:** Legal Document Review Backend API