# 📘 Office.js Development & Local Testing Guide

> Complete guide to developing and testing Microsoft Office Add-ins locally without publishing to the catalog

---

## 🎯 Overview

Office.js allows you to create add-ins for Microsoft Word, Excel, PowerPoint, and Outlook. You can develop and test these add-ins **locally** without publishing to the Microsoft AppSource catalog.

---

## 🛠️ Prerequisites

### Required Software:
- **Node.js** (v16 or later) - https://nodejs.org
- **npm** (comes with Node.js)
- **Microsoft Office** (Desktop or Office 365)
  - Word 2016 or later (Windows/Mac)
  - OR Office Online (web version)
- **Code Editor** - VS Code recommended

### Optional but Recommended:
- **Yeoman Office Generator** - Scaffolding tool
- **Office Add-in Debugger** - VS Code extension

---

## 🚀 Quick Start: Create Your First Add-in

### Method 1: Using Yeoman Generator (Recommended)

```bash
# Install Yeoman and Office generator globally
npm install -g yo generator-office

# Create new Office Add-in project
yo office

# Follow prompts:
# ? Choose a project type: Office Add-in Task Pane project
# ? Choose a script type: JavaScript
# ? What do you want to name your add-in? Praetor Legal Assistant
# ? Which Office client application would you like to support? Word
```

This creates a complete project structure with:
- `manifest.xml` - Add-in configuration
- `src/taskpane/` - UI files (HTML, CSS, JS)
- `webpack.config.js` - Build configuration
- Local HTTPS server setup

---

## 📁 Project Structure

```
praetor-word-addin/
├── manifest.xml              # Add-in manifest (configuration)
├── package.json              # Dependencies
├── webpack.config.js         # Build config
├── src/
│   ├── taskpane/
│   │   ├── taskpane.html    # UI layout
│   │   ├── taskpane.css     # Styling
│   │   └── taskpane.js      # Office.js logic
│   └── commands/
│       └── commands.js       # Ribbon commands
└── assets/
    └── icon-*.png           # Add-in icons
```

---

## 🔧 Local Testing Methods

### Method 1: Sideloading (Desktop Office - Windows)

**Step 1: Start Local Dev Server**
```bash
npm start
# This starts HTTPS server on https://localhost:3000
# Opens Word automatically with add-in loaded
```

**Step 2: Manual Sideloading (if needed)**
1. Open Word Desktop
2. Go to **Insert** → **Get Add-ins** → **My Add-ins**
3. Click **Upload My Add-in**
4. Browse to your `manifest.xml` file
5. Click **Upload**

**Your add-in appears in the ribbon!**

---

### Method 2: Sideloading (Desktop Office - Mac)

**Step 1: Start Local Dev Server**
```bash
npm start
```

**Step 2: Sideload Manifest**
1. Create folder: `~/Library/Containers/com.microsoft.Word/Data/Documents/wef`
2. Copy your `manifest.xml` to this folder
3. Restart Word
4. Go to **Insert** → **Add-ins** → **My Add-ins**
5. Your add-in appears under **Developer Add-ins**

---

### Method 3: Office Online (Web)

**Step 1: Deploy to Public URL**
Your local server must be accessible via HTTPS with a valid certificate. Options:
- Use **ngrok** for tunneling
- Deploy to **GitHub Pages**
- Use **Azure Static Web Apps** (free tier)

**Step 2: Sideload in Office Online**
1. Open Word Online (office.com)
2. Create/open a document
3. Go to **Insert** → **Add-ins** → **Upload My Add-in**
4. Upload your `manifest.xml`

---

### Method 4: Using Office Add-in Debugger (VS Code)

**Step 1: Install Extension**
- Install "Office Add-in Debugger" in VS Code

**Step 2: Configure Launch**
Create `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Office Add-in (Edge Chromium)",
      "type": "office-addin",
      "request": "attach",
      "url": "https://localhost:3000/taskpane.html",
      "port": 9229,
      "timeout": 600000,
      "webRoot": "${workspaceFolder}",
      "preLaunchTask": "Debug: Word Desktop",
      "postDebugTask": "Stop Debug"
    }
  ]
}
```

**Step 3: Debug**
- Press F5 in VS Code
- Word opens with add-in loaded
- Set breakpoints in your JavaScript code

---

## 📝 Manifest.xml Configuration

The manifest is the **core configuration file** for your add-in:

```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<OfficeApp xmlns="http://schemas.microsoft.com/office/appforoffice/1.1"
           xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
           xmlns:bt="http://schemas.microsoft.com/office/officeappbasictypes/1.0"
           xsi:type="TaskPaneApp">
  
  <!-- Basic Info -->
  <Id>12345678-1234-1234-1234-123456789012</Id>
  <Version>1.0.0.0</Version>
  <ProviderName>Your Company</ProviderName>
  <DefaultLocale>en-US</DefaultLocale>
  <DisplayName DefaultValue="Praetor Legal Assistant"/>
  <Description DefaultValue="AI-powered legal document review"/>
  
  <!-- Icons -->
  <IconUrl DefaultValue="https://localhost:3000/assets/icon-32.png"/>
  <HighResolutionIconUrl DefaultValue="https://localhost:3000/assets/icon-64.png"/>
  
  <!-- Supported Hosts -->
  <Hosts>
    <Host Name="Document"/> <!-- Word -->
  </Hosts>
  
  <!-- Permissions -->
  <Permissions>ReadWriteDocument</Permissions>
  
  <!-- Default Settings -->
  <DefaultSettings>
    <SourceLocation DefaultValue="https://localhost:3000/taskpane.html"/>
  </DefaultSettings>
  
  <!-- Ribbon Buttons -->
  <VersionOverrides xmlns="http://schemas.microsoft.com/office/taskpaneappversionoverrides">
    <Hosts>
      <Host xsi:type="Document">
        <DesktopFormFactor>
          <GetStarted>
            <Title resid="GetStarted.Title"/>
            <Description resid="GetStarted.Description"/>
            <LearnMoreUrl resid="GetStarted.LearnMoreUrl"/>
          </GetStarted>
          
          <!-- Ribbon Tab -->
          <ExtensionPoint xsi:type="PrimaryCommandSurface">
            <OfficeTab id="TabHome">
              <Group id="CommandsGroup">
                <Label resid="CommandsGroup.Label"/>
                <Icon>
                  <bt:Image size="16" resid="Icon.16x16"/>
                  <bt:Image size="32" resid="Icon.32x32"/>
                  <bt:Image size="80" resid="Icon.80x80"/>
                </Icon>
                
                <!-- Task Pane Button -->
                <Control xsi:type="Button" id="TaskpaneButton">
                  <Label resid="TaskpaneButton.Label"/>
                  <Supertip>
                    <Title resid="TaskpaneButton.Label"/>
                    <Description resid="TaskpaneButton.Tooltip"/>
                  </Supertip>
                  <Icon>
                    <bt:Image size="16" resid="Icon.16x16"/>
                    <bt:Image size="32" resid="Icon.32x32"/>
                    <bt:Image size="80" resid="Icon.80x80"/>
                  </Icon>
                  <Action xsi:type="ShowTaskpane">
                    <TaskpaneId>ButtonId1</TaskpaneId>
                    <SourceLocation resid="Taskpane.Url"/>
                  </Action>
                </Control>
              </Group>
            </OfficeTab>
          </ExtensionPoint>
        </DesktopFormFactor>
      </Host>
    </Hosts>
    
    <!-- Resources -->
    <Resources>
      <bt:Images>
        <bt:Image id="Icon.16x16" DefaultValue="https://localhost:3000/assets/icon-16.png"/>
        <bt:Image id="Icon.32x32" DefaultValue="https://localhost:3000/assets/icon-32.png"/>
        <bt:Image id="Icon.80x80" DefaultValue="https://localhost:3000/assets/icon-80.png"/>
      </bt:Images>
      <bt:Urls>
        <bt:Url id="GetStarted.LearnMoreUrl" DefaultValue="https://go.microsoft.com/fwlink/?LinkId=276812"/>
        <bt:Url id="Taskpane.Url" DefaultValue="https://localhost:3000/taskpane.html"/>
      </bt:Urls>
      <bt:ShortStrings>
        <bt:String id="GetStarted.Title" DefaultValue="Get started with Praetor!"/>
        <bt:String id="CommandsGroup.Label" DefaultValue="Praetor"/>
        <bt:String id="TaskpaneButton.Label" DefaultValue="Analyze Document"/>
      </bt:ShortStrings>
      <bt:LongStrings>
        <bt:String id="GetStarted.Description" DefaultValue="Your add-in loaded successfully. Go to the HOME tab and click the 'Analyze Document' button to get started."/>
        <bt:String id="TaskpaneButton.Tooltip" DefaultValue="Click to analyze legal document"/>
      </bt:LongStrings>
    </Resources>
  </VersionOverrides>
</OfficeApp>
```

---

## 💻 Basic Office.js Code Examples

### Initialize Office.js
```javascript
// taskpane.js
Office.onReady((info) => {
  if (info.host === Office.HostType.Word) {
    console.log("Word add-in loaded!");
    
    // Setup UI event listeners
    document.getElementById("analyze-btn").onclick = analyzeDocument;
  }
});
```

### Read Document Text
```javascript
async function getDocumentText() {
  return Word.run(async (context) => {
    // Get the document body
    const body = context.document.body;
    
    // Load the text property
    body.load("text");
    
    // Execute the queued commands
    await context.sync();
    
    // Return the text
    return body.text;
  });
}
```

### Analyze Selected Text
```javascript
async function analyzeSelection() {
  return Word.run(async (context) => {
    // Get selected text
    const range = context.document.getSelection();
    range.load("text");
    
    await context.sync();
    
    // Send to your backend API
    const response = await fetch('http://localhost:3000/api/analyze/custom', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        text: range.text,
        clauseType: 'custom'
      })
    });
    
    const result = await response.json();
    return result;
  });
}
```

### Insert Content
```javascript
async function insertRiskScore(score, level) {
  return Word.run(async (context) => {
    const range = context.document.getSelection();
    
    // Insert at end of selection
    const riskText = `\n[Risk Score: ${score}/10 - ${level.toUpperCase()}]`;
    range.insertText(riskText, Word.InsertLocation.end);
    
    // Format the inserted text
    const insertedRange = range.getRange(Word.RangeLocation.end);
    insertedRange.font.color = level === 'high' ? 'red' : 
                                level === 'medium' ? 'orange' : 'green';
    insertedRange.font.bold = true;
    
    await context.sync();
  });
}
```

### Highlight Text
```javascript
async function highlightRiskyPhrases(phrases) {
  return Word.run(async (context) => {
    const body = context.document.body;
    
    phrases.forEach(phrase => {
      // Search for phrase
      const searchResults = body.search(phrase, { matchCase: false });
      searchResults.load("items");
      
      context.sync().then(() => {
        searchResults.items.forEach(item => {
          item.font.highlightColor = "yellow";
        });
      });
    });
    
    await context.sync();
  });
}
```

---

## 🔒 HTTPS Certificate for Local Development

Office Add-ins **require HTTPS**. The Yeoman generator sets this up automatically, but here's how it works:

### Automatic (Yeoman Generator)
```bash
npm start
# Automatically creates self-signed certificate
# Trusts it in your system
```

### Manual Setup
```bash
# Install office-addin-dev-certs
npm install -g office-addin-dev-certs

# Generate and trust certificate
npx office-addin-dev-certs install

# Verify
npx office-addin-dev-certs verify
```

---

## 🧪 Testing Workflow

### Development Cycle:
1. **Start dev server**: `npm start`
2. **Make code changes** in `src/taskpane/`
3. **Webpack auto-reloads** (hot reload enabled)
4. **Test in Word** - changes appear immediately
5. **Debug** using browser DevTools (F12 in task pane)

### Testing Checklist:
- ✅ Add-in loads without errors
- ✅ Ribbon button appears in Home tab
- ✅ Task pane opens when button clicked
- ✅ Can read document text
- ✅ Can insert/modify content
- ✅ API calls to backend work
- ✅ Error handling works
- ✅ UI is responsive

---

## 🐛 Debugging Tips

### Browser DevTools in Task Pane
1. Right-click in task pane
2. Select "Inspect" or press F12
3. Use Console, Network, Sources tabs

### Clear Office Cache (Windows)
```powershell
# Close all Office apps first
Remove-Item -Recurse "$env:LOCALAPPDATA\Microsoft\Office\16.0\Wef\*"
```

### Clear Office Cache (Mac)
```bash
# Close all Office apps first
rm -rf ~/Library/Containers/com.microsoft.Word/Data/Library/Caches/*
```

### Common Issues:

**Issue: Add-in doesn't appear**
- Solution: Clear Office cache, restart Word

**Issue: HTTPS certificate error**
- Solution: Run `npx office-addin-dev-certs install --machine`

**Issue: Changes not reflecting**
- Solution: Hard refresh task pane (Ctrl+Shift+R)

**Issue: "Add-in Error" message**
- Solution: Check browser console for JavaScript errors

---

## 📦 Connecting to Your Backend

### CORS Configuration
Your backend must allow requests from `https://localhost:3000`:

```javascript
// In your Express backend
const cors = require('cors');

app.use(cors({
  origin: [
    'https://localhost:3000',  // Office Add-in dev server
    'https://localhost:8080'   // Your web frontend
  ],
  credentials: true
}));
```

### API Call from Add-in
```javascript
// taskpane.js
async function analyzeWithBackend(text) {
  try {
    const response = await fetch('http://localhost:3000/api/analyze/custom', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: text,
        clauseType: 'custom'
      })
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.analysis;
    
  } catch (error) {
    console.error('Backend API error:', error);
    throw error;
  }
}
```

---

## 🎨 UI Design for Task Pane

### Recommended Dimensions:
- **Width**: 320px (default task pane width)
- **Height**: Variable (scrollable)

### Fabric UI (Microsoft's Design System)
```html
<!-- Add to taskpane.html -->
<link rel="stylesheet" href="https://static2.sharepointonline.com/files/fabric/office-ui-fabric-core/11.0.0/css/fabric.min.css">

<!-- Use Fabric components -->
<button class="ms-Button ms-Button--primary">
  <span class="ms-Button-label">Analyze</span>
</button>
```

---

## 📚 Resources

### Official Documentation:
- **Office Add-ins Docs**: https://learn.microsoft.com/en-us/office/dev/add-ins/
- **Word JavaScript API**: https://learn.microsoft.com/en-us/javascript/api/word
- **Yeoman Generator**: https://github.com/OfficeDev/generator-office

### Sample Projects:
- **Office Add-in Samples**: https://github.com/OfficeDev/Office-Add-in-samples
- **Word Add-in Tutorial**: https://learn.microsoft.com/en-us/office/dev/add-ins/tutorials/word-tutorial

### Tools:
- **Script Lab**: Test Office.js snippets directly in Word
- **Office Add-in Validator**: Validate your manifest

---

## 🚀 Next Steps for Praetor

### Recommended Approach:
1. **Create new add-in project**: `yo office`
2. **Integrate with existing backend**: Use your API endpoints
3. **Build task pane UI**: Similar to your web frontend
4. **Add Word-specific features**:
   - Highlight risky clauses in document
   - Insert risk scores as comments
   - Create sidebar with analysis results
   - Add ribbon buttons for quick actions

### Example Integration:
```javascript
// Analyze entire document
async function analyzeDocument() {
  try {
    // 1. Get document text
    const text = await getDocumentText();
    
    // 2. Send to your backend
    const analysis = await analyzeWithBackend(text);
    
    // 3. Display results in task pane
    displayResults(analysis);
    
    // 4. Highlight risky sections
    if (analysis.risk.level === 'high') {
      await highlightRiskyPhrases(analysis.keywords);
    }
    
  } catch (error) {
    showError(error.message);
  }
}
```

---

## ✅ Testing Checklist

Before considering your add-in ready:
- [ ] Manifest validates (use Office Add-in Validator)
- [ ] Add-in loads in Word Desktop (Windows/Mac)
- [ ] Add-in loads in Word Online
- [ ] All API calls work correctly
- [ ] Error handling is robust
- [ ] UI is responsive and accessible
- [ ] Icons display correctly
- [ ] Ribbon commands work
- [ ] Task pane opens/closes properly
- [ ] No console errors

---

## 🎓 Learning Path

1. **Week 1**: Complete official Word Add-in tutorial
2. **Week 2**: Build simple add-in with basic text reading
3. **Week 3**: Integrate with your backend API
4. **Week 4**: Add advanced features (highlighting, comments)
5. **Week 5**: Polish UI and test thoroughly

---

**You can develop and test Office Add-ins entirely locally without ever publishing to the Microsoft catalog!** 🎉