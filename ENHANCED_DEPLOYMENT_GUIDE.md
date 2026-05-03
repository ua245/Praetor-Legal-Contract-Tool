# 🚀 Enhanced Step-by-Step Deployment Guide

> Complete deployment guide with detailed instructions for every step, including Word version requirements and troubleshooting

---

## ✅ Prerequisites Check

### Required Software Versions

| Software | Minimum Version | Recommended | Download Link |
|----------|----------------|-------------|---------------|
| **Windows** | Windows 10 | Windows 10/11 | Pre-installed |
| **Microsoft Word** | Word 2016 | Word 2019/365 | office.com |
| **Node.js** | v16.0.0 | v20.x.x LTS | nodejs.org |
| **Git** | v2.30.0 | Latest | git-scm.com |

### Supported Word Versions

✅ **Word 2016** (Build 16.0.4266.1001 or later)  
✅ **Word 2019** (All builds)  
✅ **Word 2021** (All builds)  
✅ **Microsoft 365 Word** (Subscription - Recommended)  
✅ **Word Online** (Web version)

❌ **Word 2013 or earlier** - NOT supported

---

## 📋 PART 1: Check Your Word Version

### Step 1.1: Open Microsoft Word

1. Click **Start Menu**
2. Type "Word"
3. Click **Microsoft Word**

### Step 1.2: Check Version

1. In Word, click **File** (top left)
2. Click **Account** (left sidebar)
3. Look for **About Word** button (right side)
4. Click **About Word**

You'll see something like:
```
Microsoft Word for Microsoft 365
Version 2310 (Build 16924.20150)
```

### Step 1.3: Verify Compatibility

**If you see:**
- "Microsoft 365" or "Office 365" → ✅ **Perfect!**
- "Word 2021" → ✅ **Good!**
- "Word 2019" → ✅ **Good!**
- "Word 2016" → ✅ **Should work** (check build number)
- "Word 2013" or earlier → ❌ **Not supported - upgrade required**

**Minimum Build Numbers:**
- Word 2016: Build 16.0.4266.1001 or later
- Word 2019: Any build
- Word 2021: Any build
- Microsoft 365: Any build

---

## 📋 PART 2: Install Required Software

### Step 2.1: Install Node.js

1. **Open browser** in your Windows VM
2. **Go to:** https://nodejs.org
3. **Download** the "LTS" version (left button - e.g., "20.11.0 LTS")
4. **Run the installer** (double-click downloaded file)
5. **Installation wizard:**
   - Click "Next"
   - Accept license → "Next"
   - Keep default location → "Next"
   - **IMPORTANT:** Check "Automatically install necessary tools" → "Next"
   - Click "Install"
   - Wait 2-3 minutes
   - Click "Finish"
6. **Restart your computer** (important!)

**Verify Installation:**
```powershell
# Open PowerShell (Start → type "PowerShell")
node --version
# Should show: v20.11.0 (or similar)

npm --version
# Should show: 10.2.4 (or similar)
```

### Step 2.2: Install Git

1. **Go to:** https://git-scm.com/download/win
2. **Download** "64-bit Git for Windows Setup"
3. **Run installer**
4. **Installation wizard:**
   - Click "Next" through all screens (use defaults)
   - Click "Install"
   - Click "Finish"

**Verify Installation:**
```powershell
git --version
# Should show: git version 2.43.0 (or similar)
```

---

## 📋 PART 3: Download Praetor Project

### Step 3.1: Create Project Folder

```powershell
# Open PowerShell
# Navigate to Documents folder
cd $HOME\Documents

# Create Praetor folder
mkdir Praetor
cd Praetor
```

### Step 3.2: Clone Repository

```powershell
# Clone the project
git clone https://github.com/ua245/Praetor-Legal-Contract-Tool.git

# Navigate into project
cd Praetor-Legal-Contract-Tool

# Switch to UI/UX-ish branch (has Word add-in)
git checkout UI/UX-ish

# Verify files downloaded
dir
```

You should see folders:
- `backend/`
- `word-addin/`
- `index.html`, `script.js`, `style.css`

---

## 📋 PART 4: Setup Backend API

### Step 4.1: Navigate to Backend

```powershell
cd backend
```

### Step 4.2: Install Dependencies

```powershell
npm install
```

**This will take 2-3 minutes.** You'll see:
```
added 178 packages in 2m
```

### Step 4.3: Configure Credentials

**Create `.env` file:**

```powershell
# Open Notepad to create .env file
notepad .env
```

**In Notepad, paste this** (replace with YOUR credentials):

```env
# IBM Watson NLU Credentials
WATSON_NLU_APIKEY=YOUR_WATSON_API_KEY_HERE
WATSON_NLU_URL=https://api.us-south.natural-language-understanding.watson.cloud.ibm.com/instances/YOUR_INSTANCE_ID

# IBM Cloudant Credentials  
CLOUDANT_URL=https://YOUR_INSTANCE.cloudantnosqldb.appdomain.cloud
CLOUDANT_APIKEY=YOUR_CLOUDANT_API_KEY_HERE

# Server Configuration
PORT=3000
NODE_ENV=production
```

**Save:** Press `Ctrl+S`, then close Notepad

### Step 4.4: Verify Credentials

```powershell
node verify-credentials.js
```

**Expected output:**
```
✓ Watson NLU connection successful
✓ Cloudant connection successful
All credentials verified!
```

**If you see errors:**
- Double-check your API keys in `.env`
- Ensure no extra spaces
- Verify keys are correct in IBM Cloud dashboard

### Step 4.5: Start Backend Server

```powershell
npm start
```

**Expected output:**
```
Server running on port 3000
Watson NLU initialized
Cloudant initialized
```

**✅ SUCCESS!** Backend is running.

**⚠️ IMPORTANT:** Keep this PowerShell window open! Don't close it.

---

## 📋 PART 5: Setup Word Add-in

### Step 5.1: Open NEW PowerShell Window

1. Press `Windows Key`
2. Type "PowerShell"
3. Click "Windows PowerShell" (open NEW window)

### Step 5.2: Navigate to Word Add-in Folder

```powershell
cd $HOME\Documents\Praetor\Praetor-Legal-Contract-Tool\word-addin
```

### Step 5.3: Install Dependencies

```powershell
npm install
```

**This will take 3-4 minutes.** Wait for completion.

### Step 5.4: Install SSL Certificates

```powershell
npm run install-certs
```

**You'll see security warnings:**
- Click "Yes" to trust the certificate
- Click "Yes" again if prompted
- This is normal and safe for development

### Step 5.5: Start Word Add-in Server

```powershell
npm start
```

**Expected output:**
```
webpack compiled successfully
Server running at https://localhost:3000
```

**✅ SUCCESS!** Add-in server is running.

**⚠️ IMPORTANT:** Keep this PowerShell window open too!

---

## 📋 PART 6: Install Add-in in Word

### Method A: For Microsoft 365 / Word 2019/2021

#### Step 6A.1: Open Microsoft Word

1. Open **Microsoft Word**
2. Create a **new blank document**

#### Step 6A.2: Access Add-ins Menu

**Option 1 (Recommended):**
1. Click **Insert** tab (top ribbon)
2. Look for **Add-ins** button (right side of ribbon)
3. Click **Add-ins**
4. Click **More Add-ins** (or **Get Add-ins**)

**Option 2 (If you don't see Add-ins button):**
1. Click **Insert** tab
2. Click **Get Add-ins** (might be in "Add-ins" group)

**Option 3 (Alternative):**
1. Click **File** → **Options**
2. Click **Add-ins** (left sidebar)
3. At bottom, select **COM Add-ins** from dropdown
4. Click **Go...**

#### Step 6A.3: Upload Manifest

1. In the Add-ins window, look for **MY ADD-INS** tab (top)
2. Click **MY ADD-INS**
3. Look for **Upload My Add-in** link (usually top-right corner)
4. Click **Upload My Add-in**

**If you DON'T see "Upload My Add-in":**
- You might need to enable Developer Mode (see Troubleshooting below)
- Or use Method B (Manual Installation)

5. Click **Browse** button
6. Navigate to: `C:\Users\YourUsername\Documents\Praetor\Praetor-Legal-Contract-Tool\word-addin\manifest.xml`
7. Select `manifest.xml`
8. Click **Upload**
9. Click **OK**

**✅ SUCCESS!** You should now see a **"Praetor"** button in the **Home** ribbon!

---

### Method B: Manual Installation (If Upload doesn't work)

#### Step 6B.1: Copy Manifest to Word Folder

```powershell
# Open PowerShell as Administrator
# Right-click PowerShell → "Run as Administrator"

# Create Word add-ins folder
$wordAddinsPath = "$env:USERPROFILE\AppData\Roaming\Microsoft\AddIns"
if (!(Test-Path $wordAddinsPath)) {
    New-Item -ItemType Directory -Path $wordAddinsPath
}

# Copy manifest
Copy-Item "$HOME\Documents\Praetor\Praetor-Legal-Contract-Tool\word-addin\manifest.xml" "$wordAddinsPath\praetor-manifest.xml"
```

#### Step 6B.2: Register Add-in via Registry

```powershell
# Create registry entry
$regPath = "HKCU:\Software\Microsoft\Office\Word\Addins\PraetorLegalAssistant"
New-Item -Path $regPath -Force

# Set manifest location
Set-ItemProperty -Path $regPath -Name "Manifest" -Value "$wordAddinsPath\praetor-manifest.xml"
Set-ItemProperty -Path $regPath -Name "FriendlyName" -Value "Praetor Legal Assistant"
```

#### Step 6B.3: Restart Word

1. **Close Microsoft Word** completely
2. **Open Word** again
3. Look for **"Praetor"** button in **Home** ribbon

---

### Method C: For Word 2016 (Older Method)

#### Step 6C.1: Create Network Share

```powershell
# Create shared folder
$sharePath = "$HOME\Documents\Praetor\Praetor-Legal-Contract-Tool\word-addin"
New-SmbShare -Name "PraetorAddIn" -Path $sharePath -FullAccess Everyone
```

#### Step 6C.2: Add to Trusted Catalog

1. Open **Word**
2. Click **File** → **Options**
3. Click **Trust Center** (left sidebar)
4. Click **Trust Center Settings** button
5. Click **Trusted Add-in Catalogs** (left sidebar)
6. In **Catalog Url** box, type: `\\localhost\PraetorAddIn`
7. Click **Add catalog**
8. Check **Show in Menu** checkbox
9. Click **OK**
10. Click **OK** again
11. **Restart Word**

---

## 📋 PART 7: Test the Add-in

### Step 7.1: Verify Add-in Loaded

1. **Open Microsoft Word**
2. Look at the **Home** ribbon (top)
3. You should see a **"Praetor"** button

**If you DON'T see it:**
- Check both PowerShell windows are still running
- Try Method B or C above
- See Troubleshooting section below

### Step 7.2: Open Add-in

1. Click the **"Praetor"** button in Home ribbon
2. A **task pane** should open on the right side
3. You should see the **"Welcome to Praetor"** screen

### Step 7.3: Test Analysis

1. In the task pane, click **"Get Started"**
2. In your Word document, type some sample legal text:
   ```
   The Receiving Party agrees to maintain confidentiality of all 
   Confidential Information disclosed by the Disclosing Party.
   ```
3. In the task pane, click **"Analyze Entire Document"**
4. Wait 2-3 seconds
5. You should see **results** with:
   - Risk score (0-10)
   - Entities found
   - Keywords
   - Risk factors

**✅ SUCCESS!** Your add-in is working!

---

## 🐛 Troubleshooting

### Issue 1: "Upload My Add-in" option not visible

**Cause:** Developer mode not enabled or wrong Word version

**Solution A: Enable Developer Mode**
```powershell
# Run PowerShell as Administrator
# Enable developer mode
Set-ItemProperty -Path "HKCU:\Software\Microsoft\Office\16.0\WEF\Developer" -Name "UseDirectEntryForManifestRegistration" -Value 1 -Type DWord
```

**Solution B: Use Method B (Manual Installation)** - See above

**Solution C: Check Word Version**
- Ensure you have Word 2016 (Build 16.0.4266.1001+) or later
- Update Office if needed

### Issue 2: "Praetor" button doesn't appear

**Solution:**
1. **Clear Office cache:**
   ```powershell
   # Close Word first!
   Remove-Item -Recurse "$env:LOCALAPPDATA\Microsoft\Office\16.0\Wef\*" -Force
   ```
2. **Restart Word**
3. **Re-upload manifest** (Method A) or **re-run Method B**

### Issue 3: Task pane is blank

**Solution:**
1. **Check both servers are running:**
   - Backend: `http://localhost:3000/api/health` should work
   - Add-in: `https://localhost:3000` should show certificate warning (normal)
2. **Right-click in task pane** → **Inspect** → Check Console for errors
3. **Restart add-in server:**
   ```powershell
   # In word-addin PowerShell window
   # Press Ctrl+C to stop
   npm start
   ```

### Issue 4: SSL Certificate Error

**Solution:**
```powershell
cd $HOME\Documents\Praetor\Praetor-Legal-Contract-Tool\word-addin
npm run install-certs
# Click "Yes" to all prompts
```

### Issue 5: "Cannot connect to backend API"

**Solution:**
1. **Verify backend is running:**
   ```powershell
   # Open browser
   # Go to: http://localhost:3000/api/health
   # Should show: {"status":"ok"}
   ```
2. **Check .env file** has correct credentials
3. **Restart backend:**
   ```powershell
   # In backend PowerShell window
   # Press Ctrl+C
   npm start
   ```

### Issue 6: npm install fails

**Solution:**
```powershell
# Clear npm cache
npm cache clean --force

# Delete node_modules
Remove-Item -Recurse node_modules -Force

# Try again
npm install
```

---

## 📊 Quick Reference

### Required PowerShell Windows

You need **2 PowerShell windows** running:

| Window | Location | Command | Status |
|--------|----------|---------|--------|
| 1 | `backend/` | `npm start` | ✅ Running |
| 2 | `word-addin/` | `npm start` | ✅ Running |

### Important URLs

- **Backend API:** http://localhost:3000/api/health
- **Add-in Server:** https://localhost:3000
- **Web Frontend:** http://localhost:8080 (optional)

### File Locations

- **Project:** `C:\Users\YourUsername\Documents\Praetor\Praetor-Legal-Contract-Tool`
- **Manifest:** `...\word-addin\manifest.xml`
- **Backend Config:** `...\backend\.env`

---

## ✅ Success Checklist

- [ ] Node.js installed and verified
- [ ] Git installed and verified
- [ ] Word version checked (2016+ required)
- [ ] Repository cloned successfully
- [ ] Backend dependencies installed
- [ ] `.env` file configured
- [ ] Backend server running (port 3000)
- [ ] Word add-in dependencies installed
- [ ] SSL certificates installed
- [ ] Add-in server running (https://localhost:3000)
- [ ] Manifest uploaded/installed in Word
- [ ] "Praetor" button visible in Word ribbon
- [ ] Task pane opens successfully
- [ ] Can analyze documents

---

## 🎯 Next Steps

Once everything is working:

1. **Test with real documents**
2. **Configure firewall** (if accessing from other machines)
3. **Setup PM2** for auto-restart (see WINDOWS_VM_DEPLOYMENT.md)
4. **Create backups** of your configuration

---

## 📞 Still Having Issues?

### Check These First:
1. ✅ Both PowerShell windows still running?
2. ✅ Word version is 2016 or later?
3. ✅ Tried clearing Office cache?
4. ✅ SSL certificates installed?
5. ✅ Backend API responding at http://localhost:3000/api/health?

### Get More Help:
- Review: `word-addin/README.md`
- Review: `WINDOWS_VM_DEPLOYMENT.md`
- Check: Browser console in task pane (F12)
- Check: PowerShell windows for error messages

---

**You're all set! Enjoy using Praetor Legal Assistant! 🎉**