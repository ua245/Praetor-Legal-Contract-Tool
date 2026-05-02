# 🎨 Frontend Development Plan - Simple & Easy

> A straightforward plan to build a user-friendly web interface for the Legal Document Review API

---

## 🎯 Goal

Create a clean, simple web interface where users can:
1. Paste legal text
2. Click "Analyze"
3. See results with risk scores and insights

---

## 🚀 Quick Overview

**Technology:** React.js (simple and popular)  
**Time Estimate:** 6-8 hours for MVP  
**Complexity:** Beginner-friendly  
**Backend:** Already built and running ✅

---

## 📋 What You'll Build

### Main Screen
```
┌─────────────────────────────────────────────┐
│  Praetor Legal Document Review              │
├─────────────────────────────────────────────┤
│                                             │
│  [Paste your legal text here...]           │
│                                             │
│                                             │
│                                             │
│  [Select Clause Type ▼]  [Analyze Button]  │
│                                             │
├─────────────────────────────────────────────┤
│  Results:                                   │
│  ● Risk Score: 3/10 (Low) 🟢               │
│  ● Entities: Receiving Party, Third Party  │
│  ● Keywords: Confidential, Disclosure      │
│  ● Sentiment: Neutral                      │
└─────────────────────────────────────────────┘
```

---

## 🛠️ Step-by-Step Plan

### Phase 1: Setup (30 minutes)

**1. Create React App**
```bash
npx create-react-app frontend
cd frontend
npm install axios
```

**2. Project Structure**
```
frontend/
├── src/
│   ├── App.js              # Main component
│   ├── components/
│   │   ├── TextInput.js    # Text area for legal text
│   │   ├── AnalyzeButton.js # Analyze button
│   │   └── Results.js      # Display results
│   ├── services/
│   │   └── api.js          # API calls to backend
│   └── App.css             # Simple styling
└── package.json
```

---

### Phase 2: Build Components (2-3 hours)

#### Component 1: Text Input Area
**File:** `src/components/TextInput.js`

**What it does:**
- Large text box for pasting legal text
- Character counter
- Clear button

**Simple code structure:**
```javascript
function TextInput({ text, onChange }) {
  return (
    <div>
      <textarea 
        value={text}
        onChange={onChange}
        placeholder="Paste your legal clause here..."
      />
      <p>{text.length} characters</p>
    </div>
  );
}
```

---

#### Component 2: Analyze Button
**File:** `src/components/AnalyzeButton.js`

**What it does:**
- Big, obvious "Analyze" button
- Shows loading spinner when analyzing
- Disabled when no text

**Simple code structure:**
```javascript
function AnalyzeButton({ onClick, loading, disabled }) {
  return (
    <button 
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? 'Analyzing...' : 'Analyze Document'}
    </button>
  );
}
```

---

#### Component 3: Results Display
**File:** `src/components/Results.js`

**What it does:**
- Shows risk score with color (green/yellow/red)
- Lists entities found
- Shows keywords
- Displays sentiment

**Simple code structure:**
```javascript
function Results({ analysis }) {
  return (
    <div>
      <h2>Analysis Results</h2>
      
      {/* Risk Score */}
      <div className="risk-score">
        Risk: {analysis.risk.score}/10
        {analysis.risk.level === 'low' && '🟢'}
        {analysis.risk.level === 'medium' && '🟡'}
        {analysis.risk.level === 'high' && '🔴'}
      </div>
      
      {/* Entities */}
      <div className="entities">
        <h3>Entities Found:</h3>
        {analysis.entities.map(entity => (
          <span key={entity.text}>{entity.text}</span>
        ))}
      </div>
      
      {/* Keywords */}
      <div className="keywords">
        <h3>Key Terms:</h3>
        {analysis.keywords.map(keyword => (
          <span key={keyword.text}>{keyword.text}</span>
        ))}
      </div>
    </div>
  );
}
```

---

### Phase 3: Connect to Backend (1 hour)

#### API Service
**File:** `src/services/api.js`

**What it does:**
- Connects to your backend API
- Sends text for analysis
- Returns results

**Simple code:**
```javascript
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const analyzeText = async (text, clauseType) => {
  const response = await axios.post(`${API_URL}/analyze/custom`, {
    text: text,
    clauseType: clauseType
  });
  return response.data;
};

export const getClauses = async () => {
  const response = await axios.get(`${API_URL}/clauses`);
  return response.data;
};
```

---

### Phase 4: Main App Component (1 hour)

#### App.js - Putting it all together
**File:** `src/App.js`

**What it does:**
- Combines all components
- Manages state (text, results, loading)
- Handles analyze button click

**Simple flow:**
```javascript
function App() {
  const [text, setText] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const analysis = await analyzeText(text, 'custom');
      setResults(analysis);
    } catch (error) {
      alert('Error analyzing text');
    }
    setLoading(false);
  };

  return (
    <div className="App">
      <h1>Praetor Legal Document Review</h1>
      
      <TextInput 
        text={text}
        onChange={(e) => setText(e.target.value)}
      />
      
      <AnalyzeButton 
        onClick={handleAnalyze}
        loading={loading}
        disabled={!text}
      />
      
      {results && <Results analysis={results} />}
    </div>
  );
}
```

---

### Phase 5: Simple Styling (1-2 hours)

#### Basic CSS
**File:** `src/App.css`

**Keep it simple:**
- Clean white background
- Large, readable fonts
- Color-coded risk levels
- Responsive design (works on mobile)

**Simple style guide:**
```css
/* Main container */
.App {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

/* Text input */
textarea {
  width: 100%;
  min-height: 200px;
  font-size: 16px;
  padding: 10px;
}

/* Analyze button */
button {
  background: #007bff;
  color: white;
  padding: 15px 30px;
  font-size: 18px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

/* Risk score colors */
.risk-low { color: green; }
.risk-medium { color: orange; }
.risk-high { color: red; }
```

---

### Phase 6: Testing (30 minutes)

**Test these scenarios:**
1. ✅ Paste sample legal text
2. ✅ Click analyze
3. ✅ See results appear
4. ✅ Try different clause types
5. ✅ Test with empty text (should be disabled)
6. ✅ Test error handling

---

## 🎨 Optional Enhancements (If you have extra time)

### Easy Additions:
1. **Pre-loaded Examples** - Dropdown with sample clauses
2. **History** - Show last 5 analyses
3. **Export** - Download results as PDF
4. **Dark Mode** - Toggle for dark theme

### Medium Additions:
1. **Clause Library** - Browse all 15 pre-loaded clauses
2. **Comparison** - Compare two clauses side-by-side
3. **Batch Upload** - Upload multiple documents

---

## 📦 Complete File Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── App.js                 # Main app component
│   ├── App.css                # Styling
│   ├── index.js               # Entry point
│   │
│   ├── components/
│   │   ├── TextInput.js       # Text area component
│   │   ├── AnalyzeButton.js   # Analyze button
│   │   ├── Results.js         # Results display
│   │   └── ClauseSelector.js  # Clause type dropdown
│   │
│   └── services/
│       └── api.js             # Backend API calls
│
├── package.json
└── README.md
```

---

## 🚀 Quick Start Commands

```bash
# 1. Create React app
npx create-react-app frontend
cd frontend

# 2. Install dependencies
npm install axios

# 3. Start development server
npm start

# 4. Open browser
# http://localhost:3000
```

---

## 🔗 Connecting Frontend to Backend

### Development Setup:
1. **Backend runs on:** `http://localhost:3000`
2. **Frontend runs on:** `http://localhost:3001` (React default)
3. **Enable CORS:** Already configured in backend ✅

### API Endpoints to Use:
```javascript
// Analyze custom text
POST http://localhost:3000/api/analyze/custom
Body: { "text": "...", "clauseType": "..." }

// Get all clauses
GET http://localhost:3000/api/clauses

// Analyze specific clause
POST http://localhost:3000/api/clauses/:id/analyze

// Get results
GET http://localhost:3000/api/results
```

---

## ✅ Success Criteria

Your frontend is done when:
- ✅ User can paste text
- ✅ User can click "Analyze"
- ✅ Results appear clearly
- ✅ Risk score is color-coded
- ✅ Works on desktop and mobile
- ✅ No errors in console

---

## 🎯 MVP Timeline (6-8 hours)

| Phase | Time | Task |
|-------|------|------|
| 1 | 30 min | Setup React app |
| 2 | 2-3 hrs | Build components |
| 3 | 1 hr | Connect to backend |
| 4 | 1 hr | Main app logic |
| 5 | 1-2 hrs | Styling |
| 6 | 30 min | Testing |

**Total:** 6-8 hours for working MVP

---

## 💡 Tips for Success

### Keep It Simple:
- ✅ Start with basic functionality
- ✅ Add features one at a time
- ✅ Test after each feature
- ✅ Don't worry about perfect design initially

### Use What You Have:
- ✅ Backend API is ready
- ✅ 15 sample clauses available
- ✅ All endpoints documented
- ✅ CORS already configured

### Get Help:
- React docs: https://react.dev
- Axios docs: https://axios-http.com
- CSS basics: https://developer.mozilla.org/en-US/docs/Web/CSS

---

## 🎨 Design Inspiration

### Simple Color Scheme:
- **Primary:** #007bff (Blue)
- **Success:** #28a745 (Green) - Low risk
- **Warning:** #ffc107 (Yellow) - Medium risk
- **Danger:** #dc3545 (Red) - High risk
- **Background:** #f8f9fa (Light gray)

### Font Recommendations:
- **Headings:** System fonts (fast, clean)
- **Body:** 16px minimum (readable)
- **Code/Results:** Monospace font

---

## 📚 Next Steps After MVP

1. **Deploy Frontend:**
   - Vercel (easiest, free)
   - Netlify (also easy, free)
   - GitHub Pages

2. **Connect to Production Backend:**
   - Update API_URL to IBM Cloud URL
   - Test end-to-end

3. **Add Features:**
   - User authentication
   - Save favorite clauses
   - Share results

---

## 🎉 You're Ready!

This plan gives you everything you need to build a simple, functional frontend in 6-8 hours.

**Remember:**
- Start simple
- Test often
- Add features gradually
- Your backend is already working ✅

**Questions?** Refer to:
- Backend API docs: `backend/README.md`
- Backend running: `http://localhost:3000`
- Test endpoints: Use curl or Postman first

---

**Good luck building! 🚀**