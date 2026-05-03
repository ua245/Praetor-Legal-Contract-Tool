# Praetor - Legal Document Review Platform

> AI-powered legal contract and document review application with drag-and-drop interface

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-14+-green.svg)](https://nodejs.org/)
[![IBM Watson](https://img.shields.io/badge/IBM-Watson%20NLU-blue.svg)](https://www.ibm.com/watson)

## 📋 Overview

Praetor is a legal document review platform that leverages IBM Watson Natural Language Understanding to analyze contracts and legal documents. Simply drag and drop Word documents to receive instant AI-powered analysis with risk assessments, entity extraction, and annotated output documents.

## ✨ Key Features

- **🎯 Drag & Drop Interface**: Upload Word (.docx) documents with a simple drag-and-drop
- **🤖 AI-Powered Analysis**: IBM Watson NLU for entity extraction, sentiment analysis, and risk assessment
- **📊 Risk Scoring**: Automated risk calculation (0-100 scale) based on sentiment, entities, and keywords
- **📄 Annotated Documents**: Download Word documents with embedded analysis results
- **📚 Clause Library**: 15 pre-loaded legal clauses for testing and analysis   
- **💾 Cloud Storage**: IBM Cloudant database for persistent analysis history
- **🎨 Modern UI**: Cyberpunk-themed interface with dark/light mode support
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices

## 🏗️ Architecture

### Backend (Node.js/Express)
- **Watson NLU Service**: Advanced text analysis and entity extraction
- **Cloudant Database**: NoSQL storage for analysis results with IAM authentication
- **Document Processing**: 
  - Upload handling with Multer (10MB limit, .docx only)
  - Text extraction using Mammoth
  - Document generation with docx library
- **REST API**: 10 endpoints for document operations and analysis

### Frontend (HTML/CSS/JavaScript)
- **Drag & Drop Interface**: Intuitive file upload with visual feedback
- **Real-time Updates**: Progress indicators and status messages
- **Results Dashboard**: Visual display of risk scores, entities, and factors
- **Responsive Design**: Bootstrap 5 with custom cyberpunk styling

## 🚀 Quick Start

### Prerequisites
- Node.js 14+ and npm
- Python 3 (for frontend server)
- IBM Cloud account with:
  - Watson Natural Language Understanding service
  - Cloudant database service

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/ua245/Praetor-Legal-Contract-Tool.git
cd Praetor
```

2. **Install backend dependencies**
```bash
cd backend
npm install
```

3. **Configure environment variables**

Create `backend/.env` file:
```env
# Watson NLU Credentials
WATSON_NLU_APIKEY=your_watson_api_key
WATSON_NLU_URL=your_watson_url

# Cloudant Credentials
CLOUDANT_URL=your_cloudant_url

# Server Configuration
PORT=3000
NODE_ENV=development
```

4. **Start the backend server**
```bash
cd backend
npm start
```

5. **Start the frontend server**
```bash
# From project root
python3 -m http.server 8000
```

6. **Access the application**

Open your browser and navigate to: **http://localhost:8000**

## 📖 Usage Guide

### Document Upload & Analysis

1. **Navigate to DOCUMENTS tab** in the application
2. **Drag and drop** a Word (.docx) file onto the upload zone, or click to browse
3. **Wait for analysis** - progress bar shows upload and processing status
4. **Download results** - click the Download button to get your annotated document
5. **View detailed analysis** - switch to RISK ENGINE tab for comprehensive results

### Text Analysis (Alternative Method)

1. Navigate to **DOCUMENTS** tab
2. Scroll to the **Text Analysis** section
3. Paste legal text into the textarea
4. Select clause type (optional)
5. Click **Analyse Text**
6. View results in the **RISK ENGINE** tab

### Clause Library

1. Navigate to **CLAUSE LIBRARY** tab
2. Browse 15 pre-loaded legal clauses
3. Click **Load Payload** on any clause to analyze it instantly

## 🔌 API Endpoints

### Document Operations
- `POST /api/document/upload` - Upload and analyze Word document
- `GET /api/document/download/:filename` - Download processed document

### Text Analysis
- `POST /api/analyze/custom` - Analyze custom text
- `POST /api/analyze/batch` - Analyze all clauses
- `POST /api/clauses/:id/analyze` - Analyze specific clause

### Data Retrieval
- `GET /api/health` - Health check
- `GET /api/clauses` - List all clauses
- `GET /api/clauses/:id` - Get specific clause
- `GET /api/results` - List analysis results
- `GET /api/results/:id` - Get specific result

## 📊 Risk Scoring Algorithm

The system calculates risk scores (0-100) based on three weighted factors:

### 1. Sentiment Analysis (40% weight)
- **Negative sentiment** → Increases risk
- **Neutral sentiment** → Moderate risk
- **Positive sentiment** → Decreases risk

### 2. Entity Detection (30% weight)
- Legal entities (Person, Organization, Location)
- Financial terms (Money, Quantity)
- Temporal references (Date)

### 3. Keyword Analysis (30% weight)
- **High-risk keywords**: liability, termination, breach, penalty
- **Medium-risk keywords**: confidential, indemnify, dispute
- Presence increases overall risk score

**Risk Levels:**
- 🟢 **Low**: 0-33 (Green indicator)
- 🟡 **Medium**: 34-66 (Yellow indicator)
- 🔴 **High**: 67-100 (Red indicator)

## 📁 Project Structure

```
Praetor/
├── backend/
│   ├── routes/
│   │   ├── analysis.routes.js      # Text analysis endpoints
│   │   └── document.routes.js      # Document upload/download
│   ├── services/
│   │   ├── watson.service.js       # Watson NLU integration
│   │   └── cloudant.service.js     # Cloudant database
│   ├── data/
│   │   └── clauses.json            # Pre-loaded legal clauses
│   ├── uploads/                    # Temporary file storage
│   ├── server.js                   # Express application
│   ├── package.json
│   └── .env                        # Environment variables
├── index.html                      # Frontend UI
├── script.js                       # Frontend logic
├── style.css                       # Styling
├── DOCUMENTATION.md                # Detailed API docs
└── README.md                       # This file
```

## 🛠️ Technologies Used

### Backend
- **Express.js** - Web framework
- **IBM Watson NLU** - Natural language processing
- **IBM Cloudant** - NoSQL database
- **Multer** - File upload handling
- **Mammoth** - Word document text extraction
- **docx** - Word document generation
- **dotenv** - Environment configuration

### Frontend
- **HTML5/CSS3** - Structure and styling
- **JavaScript (ES6+)** - Client-side logic
- **Bootstrap 5** - UI components and grid system
- **Lucide Icons** - Modern icon library
- **Google Fonts** - Inter & Space Grotesk typography

## 🔒 Security Features

- ✅ File type validation (.docx only)
- ✅ File size limits (10MB maximum)
- ✅ Automatic file cleanup after download
- ✅ IAM authentication for IBM Cloud services
- ✅ Environment variable configuration
- ✅ CORS enabled for cross-origin requests
- ✅ Input sanitization and validation

## 🧪 Testing

Test the API with curl:

```bash
# Health check
curl http://localhost:3000/api/health

# Upload document
curl -X POST -F "document=@test.docx" http://localhost:3000/api/document/upload

# Analyze text
curl -X POST http://localhost:3000/api/analyze/custom \
  -H "Content-Type: application/json" \
  -d '{"text":"This agreement shall terminate immediately upon breach."}'
```

## 🚢 Deployment

### IBM Cloud Deployment

1. **Create IBM Cloud services**
   - Watson Natural Language Understanding
   - Cloudant database

2. **Configure environment variables** in IBM Cloud

3. **Deploy backend**
   - IBM Cloud Foundry
   - IBM Kubernetes Service
   - IBM Code Engine

4. **Host frontend**
   - IBM Cloud Object Storage
   - IBM Cloud CDN
   - Static web hosting

See `DOCUMENTATION.md` for detailed deployment instructions.

## 🐛 Troubleshooting

### Common Issues

**Backend won't start:**
- ✓ Check `.env` file exists with correct credentials
- ✓ Verify Node.js version (14+)
- ✓ Run `npm install` to ensure dependencies are installed
- ✓ Check if port 3000 is already in use

**File upload fails:**
- ✓ Ensure file is .docx format
- ✓ Check file size is under 10MB
- ✓ Verify `backend/uploads/` directory exists
- ✓ Check browser console for errors

**Analysis returns errors:**
- ✓ Verify Watson NLU credentials are correct
- ✓ Check Watson NLU service is active in IBM Cloud
- ✓ Ensure text is not empty
- ✓ Review backend logs for detailed error messages

**Download doesn't work:**
- ✓ Check browser console for errors
- ✓ Verify backend is running
- ✓ Ensure file was successfully analyzed
- ✓ Check network tab for failed requests

## 👥 Team

**Development Team:**
- **Umer Ahmed** - Lead Developer
- **Emad Moeez Syed** - Developer

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [IBM Watson](https://www.ibm.com/watson) Natural Language Understanding
- Powered by [IBM Cloudant](https://www.ibm.com/cloud/cloudant) database
- UI inspired by cyberpunk aesthetics
- Icons by [Lucide](https://lucide.dev/)

## 📞 Support

For issues, questions, or contributions:
- 📖 Check `DOCUMENTATION.md` for detailed API documentation
- 🐛 Open an issue on GitHub
- 💬 Review error messages in browser console
- 📋 Check backend logs for server-side errors

## 🗺️ Roadmap

- [ ] Support for PDF document upload
- [ ] Multi-language support
- [ ] Advanced clause comparison
- [ ] Export to multiple formats
- [ ] Collaborative review features
- [ ] Custom risk scoring rules
- [ ] Integration with legal databases

---

**Made with ❤️ by the Praetor Team**

*Empowering legal professionals with AI-driven document analysis*
