# 🎨 Praetor Frontend - Legal Intelligence Platform

> A sophisticated, production-ready web interface for legal document analysis powered by IBM Watson

---

## 🌟 Overview

This is a **complete, fully-functional frontend** that connects to the Praetor backend API. It features a modern, cyberpunk-inspired design with dark/light mode support and real-time analysis capabilities.

### ✨ Key Features

- **📊 Dashboard** - Live statistics, API status monitoring, and system health
- **📝 Document Analysis** - Paste legal text and get instant AI-powered insights
- **🎯 Risk Scoring** - Visual risk assessment with color-coded levels (Low/Medium/High)
- **📚 Clause Library** - Browse and analyze 15 pre-loaded legal clauses
- **📜 Analysis History** - View recent analyses with quick access
- **⚙️ Settings** - Theme toggle, compliance info, security parameters
- **🎨 Dual Themes** - Dark Command (default) and Light Command modes

---

## 🚀 Quick Start

### Prerequisites
- Backend API running on `http://localhost:3000` ✅
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Running the Frontend

**Option 1: Simple HTTP Server (Python)**
```bash
# In the project root directory
python3 -m http.server 8080
```
Then open: http://localhost:8080

**Option 2: Node.js HTTP Server**
```bash
npm install -g http-server
http-server -p 8080
```
Then open: http://localhost:8080

**Option 3: VS Code Live Server**
1. Install "Live Server" extension in VS Code
2. Right-click `index.html`
3. Select "Open with Live Server"

---

## 📁 File Structure

```
frontend/
├── index.html          # Main HTML structure (448 lines)
├── script.js           # JavaScript logic & API integration (436 lines)
└── style.css           # Styling & theme system (257 lines)
```

### Technology Stack
- **HTML5** - Semantic markup
- **CSS3** - Custom properties, animations, responsive design
- **Vanilla JavaScript** - No frameworks, pure ES6+
- **Bootstrap 5.3.2** - Grid system and utilities
- **Lucide Icons** - Modern icon library
- **Google Fonts** - Inter & Space Grotesk

---

## 🎯 Features Breakdown

### 1. Dashboard (Overview Screen)
**What it shows:**
- Real-time API connection status
- Total analyses count
- Clause library count
- Live analysis stream (simulated)
- Security guard panel
- System initialization logs

**API Endpoints Used:**
- `GET /api/health` - Check backend status
- `GET /api/results` - Get total analyses
- `GET /api/clauses` - Get clause count

---

### 2. Document Analysis (Analyse Screen)
**What you can do:**
- Paste legal text (up to 25,000 characters)
- Select clause type (Custom, Confidentiality, Termination, Liability)
- Click "Analyse Document" to process
- View pipeline status (3 steps)

**Pipeline Steps:**
1. ✅ API Connection (auto-verified)
2. ⏳ Watson NLU Analysis (during processing)
3. ⏳ Cloudant Database Save (during processing)

**API Endpoint Used:**
- `POST /api/analyze/custom` - Analyze custom text

---

### 3. Results Screen
**What it displays:**
- **Risk Score** - 0-10 scale with color coding
  - 🟢 Low (0-3): Green
  - 🟡 Medium (4-6): Yellow
  - 🔴 High (7-10): Red
- **Extracted Entities** - People, organizations, locations
- **Critical Vectors** - Risk factors identified
- **Recent Ingestions** - Last 10 analyses with quick access

**API Endpoints Used:**
- `GET /api/results?limit=10` - Recent analyses
- `GET /api/results/:id` - Specific analysis details

---

### 4. Clause Library Screen
**What it shows:**
- All 15 pre-loaded legal clauses
- Clause type badges (color-coded)
- "Load Payload" button to analyze each clause

**Features:**
- Click any clause to load it into the analysis screen
- Automatic clause type selection
- Animated card grid

**API Endpoint Used:**
- `GET /api/clauses` - List all clauses

---

### 5. Settings Screen
**What's included:**
- **Regulation & Compliance Matrix**
  - SOC2 Certified ✅
  - GDPR Compliant ✅
  - HIPAA Verified ✅
  - ISO 27001 Active ✅
- **Interface Configuration**
  - Dark/Light mode toggle
  - Encryption level display (AES-256-GCM)
  - AI Privacy Model (Dedicated Instance)
  - Audit Logging toggle
- **Apply Command** and **Revert** buttons

---

## 🎨 Theme System

### Dark Command (Default)
- Background: `#0a0a0f` (Deep space black)
- Primary: `#00d4ff` (Cyan blue)
- Surface: `#1e1e32` (Dark slate)
- High contrast for tactical environments

### Light Command
- Background: `#f8fafc` (Soft white)
- Primary: `#0284c7` (Sky blue)
- Surface: `#ffffff` (Pure white)
- High visibility for daytime use

**Toggle:** Click the theme switch in Settings screen

---

## 🔌 API Integration

### Base URL Configuration
```javascript
// In script.js line 2
const API_BASE = 'http://localhost:3000/api';
```

### API Endpoints Used

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/health` | GET | Check API status |
| `/clauses` | GET | List all clauses |
| `/clauses/:id` | GET | Get specific clause |
| `/analyze/custom` | POST | Analyze custom text |
| `/results` | GET | List analyses |
| `/results/:id` | GET | Get specific result |

### Request Example
```javascript
// Analyze custom text
const response = await fetch(`${API_BASE}/analyze/custom`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
        text: "Your legal text here...",
        clauseType: "confidentiality"
    })
});
```

---

## 🎭 UI Components

### Navigation
- **Top Nav** - Main navigation with active indicators
- **Side Nav** - Icon-based navigation with labels
- **Footer** - System information bar

### Interactive Elements
- **Buttons** - Hover effects, glow animations
- **Cards** - Clause cards with hover states
- **Badges** - Risk level indicators
- **Toggles** - Custom switch components
- **Progress Bars** - Risk threshold visualization

### Animations
- **Fade Blur** - Screen transitions
- **Slide Up** - Card entrance animations
- **Scale Up** - Element pop-in effects
- **Pulse** - Status indicators
- **Stagger** - Sequential animations (0.1s delays)

---

## 🐛 Troubleshooting

### Issue: API Status shows "DISCONNECTED"
**Solution:**
1. Ensure backend is running: `cd backend && npm start`
2. Check backend is on port 3000
3. Verify no CORS errors in browser console

### Issue: Analysis button does nothing
**Solution:**
1. Check browser console for errors
2. Ensure text is pasted in textarea
3. Verify backend API is responding

### Issue: Clause library is empty
**Solution:**
1. Backend must be running
2. Check `/api/clauses` endpoint manually
3. Refresh the page

### Issue: Theme toggle not working
**Solution:**
1. Clear browser cache
2. Check console for JavaScript errors
3. Ensure Lucide icons are loading

---

## 🎯 User Workflow

### Typical Analysis Flow:
1. **Start** → Dashboard shows system status
2. **Navigate** → Click "DOCUMENTS" or "ANALYSE" tab
3. **Input** → Paste legal text or load from library
4. **Analyze** → Click "Analyse Document" button
5. **Wait** → Watch pipeline steps complete (2-3 seconds)
6. **Review** → Auto-redirected to Results screen
7. **Explore** → View risk score, entities, vectors
8. **History** → Access from "Recent Ingestions" panel

---

## 📊 Performance

- **Load Time:** < 1 second (with CDN resources)
- **Analysis Time:** 2-3 seconds (Watson NLU processing)
- **Bundle Size:** ~1,200 lines total (HTML + JS + CSS)
- **Dependencies:** Bootstrap, Lucide, Google Fonts (all CDN)

---

## 🔒 Security Features

### Display Only (No Actual Implementation)
- AES-256-GCM Encryption indicator
- SOC2/GDPR/HIPAA compliance badges
- Audit logging toggle (visual only)
- Dedicated AI instance indicator

**Note:** These are UI elements for demonstration. Actual security is handled by the backend API and IBM Cloud services.

---

## 🎨 Customization

### Change Primary Color
```css
/* In style.css line 7 */
--color-primary: #00d4ff; /* Change to your color */
```

### Change API URL
```javascript
// In script.js line 2
const API_BASE = 'https://your-api-url.com/api';
```

### Modify Character Limit
```javascript
// In script.js line 71
charCount.innerText = `${e.target.value.length.toLocaleString()} / 50,000 CHARS`;
```

---

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Option 2: Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

### Option 3: GitHub Pages
1. Push to GitHub repository
2. Go to Settings → Pages
3. Select branch and root directory
4. Save and wait for deployment

### Option 4: AWS S3 + CloudFront
1. Create S3 bucket
2. Enable static website hosting
3. Upload `index.html`, `script.js`, `style.css`
4. Configure CloudFront distribution

---

## 📝 Code Quality

### HTML (index.html)
- ✅ Semantic markup
- ✅ Accessible ARIA labels
- ✅ Responsive meta tags
- ✅ Clean structure

### JavaScript (script.js)
- ✅ ES6+ syntax
- ✅ Async/await for API calls
- ✅ Error handling
- ✅ No global pollution
- ✅ Event delegation

### CSS (style.css)
- ✅ CSS custom properties
- ✅ Mobile-first approach
- ✅ Smooth animations
- ✅ Theme system
- ✅ Utility classes

---

## 🎓 Learning Resources

### Technologies Used:
- **Fetch API**: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
- **CSS Custom Properties**: https://developer.mozilla.org/en-US/docs/Web/CSS/--*
- **Bootstrap 5**: https://getbootstrap.com/docs/5.3
- **Lucide Icons**: https://lucide.dev

---

## 🐞 Known Issues

1. **Character counter** - Doesn't prevent typing beyond 25,000 chars (cosmetic only)
2. **Live stream** - Dashboard activity log is simulated, not real-time
3. **Theme persistence** - Theme resets on page reload (no localStorage yet)
4. **Mobile nav** - Side nav doesn't collapse on mobile (fixed width)

---

## 🔮 Future Enhancements

### Planned Features:
- [ ] LocalStorage for theme persistence
- [ ] Real-time WebSocket updates
- [ ] PDF upload support
- [ ] Export results as PDF
- [ ] Comparison mode (side-by-side)
- [ ] User authentication
- [ ] Saved favorites
- [ ] Advanced filters
- [ ] Mobile-responsive side nav
- [ ] Keyboard shortcuts

---

## 📞 Support

### Getting Help:
1. Check backend is running: `http://localhost:3000/api/health`
2. Open browser DevTools (F12) and check Console tab
3. Review backend logs in terminal
4. Refer to backend documentation: `backend/README.md`

---

## 🎉 Success Checklist

Your frontend is working correctly when:
- ✅ Dashboard shows "API CONNECTED" in green
- ✅ Stats show clause count (should be 15)
- ✅ Clause library displays all 15 clauses
- ✅ Analysis completes in 2-3 seconds
- ✅ Results show risk score and entities
- ✅ Recent history populates after analysis
- ✅ Theme toggle switches between dark/light
- ✅ No errors in browser console

---

## 📄 License

Same as main project - see LICENSE file

---

**Built with ❤️ for legal professionals**

*Praetor - Where AI meets Legal Intelligence*