# Praetor - Legal Document Review Platform

A legal contract and document review application that provides AI-powered analysis using IBM Watson NLU and Cloudant database, with a modern web interface for drag-and-drop document upload.

## Features

- **Drag & Drop Document Upload**: Upload Word (.docx) documents for instant analysis
- **AI-Powered Analysis**: IBM Watson Natural Language Understanding for entity extraction, sentiment analysis, and risk assessment
- **Annotated Documents**: Download Word documents with embedded analysis results and risk assessments
- **Risk Scoring**: Automated risk calculation (0-100 scale) based on sentiment, entities, and keywords
- **Clause Library**: Pre-loaded legal clauses for testing and analysis
- **Modern UI**: Cyberpunk-themed interface with dark/light mode support
- **Cloud Storage**: IBM Cloudant database for persistent analysis history

## Architecture

### Backend (Node.js/Express)
- **Watson NLU Service**: Text analysis and entity extraction
- **Cloudant Database**: NoSQL storage for analysis results
- **Document Processing**: 
  - Upload: Multer middleware for file handling
  - Extraction: Mammoth for .docx text extraction
  - Generation: docx library for creating annotated documents
- **REST API**: 10 endpoints for document upload, analysis, and retrieval

### Frontend (HTML/CSS/JavaScript)
- **Drag & Drop Interface**: File upload with visual feedback
- **Real-time Updates**: Progress indicators and status messages
- **Results Dashboard**: Visual display of risk scores, entities, and factors
- **Responsive Design**: Works on desktop and mobile devices

## Installation

### Prerequisites
- Node.js 14+ and npm
- IBM Cloud account with:
  - Watson Natural Language Understanding service
  - Cloudant database service

### Setup

1. **Clone the repository**
```bash
git clone <repository-url>
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

5. **Open the frontend**

Open `index.html` in a web browser or serve it with a local server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js http-server
npx http-server -p 8000
```

Access the application at `http://localhost:8000`

## Usage

### Document Upload & Analysis

1. Navigate to the **DOCUMENTS** tab
2. Drag and drop a Word (.docx) file onto the upload zone, or click to browse
3. Wait for the analysis to complete (progress bar shows status)
4. Click **Download** to get your annotated document with analysis results
5. View detailed results in the **RISK ENGINE** tab

### Text Analysis (Alternative)

1. Navigate to the **DOCUMENTS** tab
2. Scroll to the "Text Analysis" section
3. Paste legal text into the textarea
4. Select clause type (optional)
5. Click **Analyse Text**
6. View results in the **RISK ENGINE** tab

### Clause Library

1. Navigate to the **CLAUSE LIBRARY** tab
2. Browse 15 pre-loaded legal clauses
3. Click **Load Payload** on any clause to analyze it

## API Endpoints

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

## Risk Scoring Algorithm

The system calculates risk scores (0-100) based on:

1. **Sentiment Analysis** (40% weight)
   - Negative sentiment increases risk
   - Neutral sentiment = moderate risk
   - Positive sentiment decreases risk

2. **Entity Detection** (30% weight)
   - Legal entities (Person, Organization, Location)
   - Financial terms (Money, Quantity)
   - Temporal references (Date)

3. **Keyword Analysis** (30% weight)
   - High-risk keywords: liability, termination, breach, penalty
   - Medium-risk keywords: confidential, indemnify, dispute
   - Presence increases risk score

**Risk Levels:**
- **Low**: 0-33 (Green)
- **Medium**: 34-66 (Yellow)
- **High**: 67-100 (Red)

## Project Structure

```
Praetor/
├── backend/
│   ├── routes/
│   │   ├── analysis.routes.js    # Text analysis endpoints
│   │   └── document.routes.js    # Document upload/download
│   ├── services/
│   │   ├── watson.service.js     # Watson NLU integration
│   │   └── cloudant.service.js   # Cloudant database
│   ├── data/
│   │   └── clauses.json          # Pre-loaded legal clauses
│   ├── uploads/                  # Temporary file storage
│   ├── server.js                 # Express application
│   ├── package.json
│   └── .env
├── index.html                    # Frontend UI
├── script.js                     # Frontend logic
├── style.css                     # Styling
├── DOCUMENTATION.md              # Detailed API docs
└── README.md                     # This file
```

## Technologies Used

### Backend
- **Express.js** - Web framework
- **IBM Watson NLU** - Natural language processing
- **IBM Cloudant** - NoSQL database
- **Multer** - File upload handling
- **Mammoth** - Word document text extraction
- **docx** - Word document generation

### Frontend
- **HTML5/CSS3** - Structure and styling
- **JavaScript (ES6+)** - Client-side logic
- **Bootstrap 5** - UI components
- **Lucide Icons** - Icon library

## Security Features

- File type validation (.docx only)
- File size limits (10MB max)
- Automatic file cleanup after download
- IAM authentication for IBM Cloud services
- Environment variable configuration
- CORS enabled for cross-origin requests

## Development

### Running in Development Mode

```bash
# Backend with auto-reload
cd backend
npm run dev

# Frontend with live server
npx http-server -p 8000
```

### Testing

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

## Deployment

### IBM Cloud Deployment

1. Create IBM Cloud services (Watson NLU, Cloudant)
2. Configure environment variables
3. Deploy backend to IBM Cloud Foundry or Kubernetes
4. Host frontend on IBM Cloud Object Storage or CDN

See `DOCUMENTATION.md` for detailed deployment instructions.

## Troubleshooting

### Common Issues

**Backend won't start:**
- Check `.env` file exists and has correct credentials
- Verify Node.js version (14+)
- Run `npm install` to ensure dependencies are installed

**File upload fails:**
- Ensure file is .docx format
- Check file size is under 10MB
- Verify `backend/uploads/` directory exists

**Analysis returns errors:**
- Verify Watson NLU credentials are correct
- Check Watson NLU service is active in IBM Cloud
- Ensure text is not empty

**Download doesn't work:**
- Check browser console for errors
- Verify backend is running
- Ensure file was successfully analyzed

## License

MIT License - See LICENSE file for details

## Support

For issues and questions:
- Check `DOCUMENTATION.md` for detailed API documentation
- Review error messages in browser console
- Check backend logs for server-side errors

## Credits

Built with IBM Watson and Cloudant services.
