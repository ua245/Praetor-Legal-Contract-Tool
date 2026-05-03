# 🖥️ Windows VM Deployment Guide - Complete Setup

> Step-by-step guide to deploy Praetor Legal Assistant on a Windows Virtual Machine

---

## 📋 Overview

This guide will help you deploy the complete Praetor system on a Windows VM:
1. **Backend API** (Node.js + IBM Watson + Cloudant)
2. **Web Frontend** (HTML/CSS/JS)
3. **Word Add-in** (Office.js)

**Estimated Time:** 30-45 minutes

---

## 🎯 Prerequisites

### Windows VM Requirements:
- **OS**: Windows Server 2019/2022 or Windows 10/11
- **RAM**: Minimum 4GB (8GB recommended)
- **Storage**: 20GB free space
- **Network**: Internet access for downloading packages
- **Ports**: 3000 (backend), 8080 (web frontend), 3000 (Word add-in)

### Software to Install:
- Node.js v16 or later
- Git
- Microsoft Word (for testing add-in)
- Text editor (VS Code recommended)

---

## 📥 STEP 1: Initial Windows VM Setup

### 1.1 Connect to Your Windows VM

**Using RDP (Remote Desktop):**
```
1. Open Remote Desktop Connection
2. Enter VM IP address
3. Enter username and password
4. Click "Connect"
```

**Using Azure Portal:**
```
1. Go to Azure Portal
2. Navigate to your VM
3. Click "Connect" → "RDP"
4. Download and open RDP file
```

### 1.2 Update Windows (Optional but Recommended)

```powershell
# Open PowerShell as Administrator
# Check for updates
Start-Process ms-settings:windowsupdate
```

---

## 📦 STEP 2: Install Required Software

### 2.1 Install Node.js

**Method 1: Using Installer (Recommended)**

1. Open browser in VM
2. Go to: https://nodejs.org
3. Download "LTS" version (e.g., v20.x.x)
4. Run installer
5. Click "Next" through all prompts
6. **Important**: Check "Automatically install necessary tools"
7. Click "Install"
8. Restart VM if prompted

**Verify Installation:**
```powershell
# Open PowerShell
node --version
# Should show: v20.x.x

npm --version
# Should show: 10.x.x
```

### 2.2 Install Git

1. Go to: https://git-scm.com/download/win
2. Download "64-bit Git for Windows Setup"
3. Run installer
4. Use default settings (click "Next" through all)
5. Click "Install"

**Verify Installation:**
```powershell
git --version
# Should show: git version 2.x.x
```

### 2.3 Install Visual Studio Code (Optional)

1. Go to: https://code.visualstudio.com
2. Download Windows installer
3. Run installer
4. Check "Add to PATH"
5. Click "Install"

---

## 📂 STEP 3: Clone the Repository

### 3.1 Create Project Directory

```powershell
# Open PowerShell
# Navigate to desired location (e.g., Documents)
cd $HOME\Documents

# Create projects folder
mkdir Praetor
cd Praetor
```

### 3.2 Clone from GitHub

```powershell
# Clone the repository
git clone https://github.com/ua245/Praetor-Legal-Contract-Tool.git

# Navigate into project
cd Praetor-Legal-Contract-Tool

# Checkout UI/UX-ish branch (has Word add-in)
git checkout UI/UX-ish

# Verify files
dir
```

You should see:
- `backend/` folder
- `word-addin/` folder
- `index.html`, `script.js`, `style.css` (web frontend)
- Documentation files

---

## 🔧 STEP 4: Setup Backend API

### 4.1 Navigate to Backend

```powershell
cd backend
```

### 4.2 Install Dependencies

```powershell
npm install
```

This will take 2-3 minutes. You'll see progress bars.

### 4.3 Configure Environment Variables

**Create `.env` file:**

```powershell
# Create .env file
notepad .env
```

**Paste this content** (replace with your actual credentials):

```env
# IBM Watson NLU Credentials
WATSON_NLU_APIKEY=your_watson_api_key_here
WATSON_NLU_URL=https://api.us-south.natural-language-understanding.watson.cloud.ibm.com/instances/your-instance-id

# IBM Cloudant Credentials
CLOUDANT_URL=https://your-instance.cloudantnosqldb.appdomain.cloud
CLOUDANT_APIKEY=your_cloudant_api_key_here

# Server Configuration
PORT=3000
NODE_ENV=production
```

**Save and close** (Ctrl+S, then close Notepad)

### 4.4 Verify Credentials

```powershell
node verify-credentials.js
```

Expected output:
```
✓ Watson NLU connection successful
✓ Cloudant connection successful
All credentials verified!
```

If errors occur, double-check your `.env` file.

### 4.5 Start Backend Server

```powershell
npm start
```

Expected output:
```
Server running on port 3000
Watson NLU initialized
Cloudant initialized
```

**Keep this PowerShell window open!** The backend must stay running.

### 4.6 Test Backend API

**Open new PowerShell window:**

```powershell
# Test health endpoint
curl http://localhost:3000/api/health

# Should return: {"status":"ok","timestamp":"..."}
```

Or open browser and go to: `http://localhost:3000/api/health`

---

## 🌐 STEP 5: Setup Web Frontend

### 5.1 Open New PowerShell Window

```powershell
# Navigate to project root
cd $HOME\Documents\Praetor\Praetor-Legal-Contract-Tool
```

### 5.2 Start Simple HTTP Server

**Option 1: Using Python (if installed)**
```powershell
python -m http.server 8080
```

**Option 2: Using Node.js http-server**
```powershell
# Install http-server globally
npm install -g http-server

# Start server
http-server -p 8080
```

**Option 3: Using VS Code Live Server**
1. Open project in VS Code
2. Install "Live Server" extension
3. Right-click `index.html`
4. Select "Open with Live Server"

### 5.3 Access Web Frontend

Open browser and go to: `http://localhost:8080`

You should see the Praetor web interface!

**Keep this PowerShell window open!**

---

## 📝 STEP 6: Setup Word Add-in

### 6.1 Open New PowerShell Window

```powershell
# Navigate to word-addin folder
cd $HOME\Documents\Praetor\Praetor-Legal-Contract-Tool\word-addin
```

### 6.2 Install Dependencies

```powershell
npm install
```

### 6.3 Install SSL Certificates

```powershell
# Install and trust self-signed certificates
npm run install-certs
```

**Important**: You may see security warnings. Click "Yes" to trust the certificate.

### 6.4 Start Word Add-in Dev Server

```powershell
npm start
```

Expected output:
```
webpack compiled successfully
Server running at https://localhost:3000
```

**Keep this PowerShell window open!**

### 6.5 Sideload Add-in in Word

**Method 1: Automatic (if Word opens)**
- Word should open automatically with add-in loaded
- Look for "Praetor" button in Home ribbon

**Method 2: Manual Upload**

1. **Open Microsoft Word**
2. Go to **Insert** tab
3. Click **Get Add-ins**
4. Click **My Add-ins** (left sidebar)
5. Click **Upload My Add-in** (top right)
6. Click **Browse**
7. Navigate to: `C:\Users\YourUsername\Documents\Praetor\Praetor-Legal-Contract-Tool\word-addin\manifest.xml`
8. Click **Upload**
9. Click **OK**

**The "Praetor" button should now appear in the Home ribbon!**

---

## ✅ STEP 7: Verify Everything Works

### 7.1 Check All Services Running

You should have **3 PowerShell windows open**:

1. **Backend API** - Port 3000
   ```
   Server running on port 3000
   ```

2. **Web Frontend** - Port 8080
   ```
   Serving at http://localhost:8080
   ```

3. **Word Add-in** - Port 3000 (HTTPS)
   ```
   webpack compiled successfully
   ```

### 7.2 Test Web Frontend

1. Open browser: `http://localhost:8080`
2. Check API status indicator (should be green "CONNECTED")
3. Click "ANALYSE" tab
4. Paste sample text
5. Click "Analyse Document"
6. Results should appear in 2-3 seconds

### 7.3 Test Word Add-in

1. Open Microsoft Word
2. Click "Praetor" button in Home ribbon
3. Task pane opens on right side
4. Click "Get Started"
5. Type some legal text in document
6. Click "Analyze Entire Document"
7. Results appear in task pane

---

## 🔒 STEP 8: Configure Windows Firewall

### 8.1 Allow Inbound Connections

**If you want to access from other machines:**

```powershell
# Open PowerShell as Administrator

# Allow port 3000 (Backend API)
New-NetFirewallRule -DisplayName "Praetor Backend API" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow

# Allow port 8080 (Web Frontend)
New-NetFirewallRule -DisplayName "Praetor Web Frontend" -Direction Inbound -LocalPort 8080 -Protocol TCP -Action Allow
```

### 8.2 Get VM IP Address

```powershell
# Get IP address
ipconfig

# Look for "IPv4 Address"
```

Now you can access from other machines:
- Backend API: `http://VM_IP:3000/api/health`
- Web Frontend: `http://VM_IP:8080`

---

## 🚀 STEP 9: Run as Windows Service (Production)

### 9.1 Install PM2 (Process Manager)

```powershell
npm install -g pm2
npm install -g pm2-windows-service
```

### 9.2 Setup PM2 as Windows Service

```powershell
# Install PM2 as Windows service
pm2-service-install

# Answer prompts:
# PM2_HOME: C:\ProgramData\pm2\home
# PM2_SERVICE_NAME: PM2
```

### 9.3 Start Backend with PM2

```powershell
cd $HOME\Documents\Praetor\Praetor-Legal-Contract-Tool\backend

# Start backend
pm2 start server.js --name praetor-backend

# Save PM2 configuration
pm2 save

# Start PM2 service
pm2-service-start
```

### 9.4 Verify PM2 Service

```powershell
# Check status
pm2 status

# View logs
pm2 logs praetor-backend
```

Now backend will auto-start on VM reboot!

---

## 📊 STEP 10: Monitoring and Logs

### 10.1 View Backend Logs

```powershell
cd $HOME\Documents\Praetor\Praetor-Legal-Contract-Tool\backend

# If using npm start
# Logs appear in PowerShell window

# If using PM2
pm2 logs praetor-backend
```

### 10.2 Check System Resources

```powershell
# Open Task Manager
taskmgr

# Or use PowerShell
Get-Process node
```

### 10.3 Monitor API Health

```powershell
# Continuous health check
while ($true) {
    curl http://localhost:3000/api/health
    Start-Sleep -Seconds 5
}
```

---

## 🐛 STEP 11: Troubleshooting

### Issue: "Port 3000 already in use"

**Solution:**
```powershell
# Find process using port 3000
netstat -ano | findstr :3000

# Kill process (replace PID with actual number)
taskkill /PID <PID> /F
```

### Issue: "Cannot connect to backend API"

**Solution:**
1. Check backend is running: `curl http://localhost:3000/api/health`
2. Check firewall rules
3. Verify `.env` file exists and has correct credentials
4. Check backend logs for errors

### Issue: "Word add-in doesn't appear"

**Solution:**
1. Clear Office cache:
   ```powershell
   Remove-Item -Recurse "$env:LOCALAPPDATA\Microsoft\Office\16.0\Wef\*"
   ```
2. Restart Word
3. Re-upload manifest.xml

### Issue: "SSL certificate error"

**Solution:**
```powershell
cd word-addin
npm run install-certs
```
Click "Yes" when prompted to trust certificate.

### Issue: "npm install fails"

**Solution:**
```powershell
# Clear npm cache
npm cache clean --force

# Try again
npm install
```

---

## 🔄 STEP 12: Updating the Application

### 12.1 Pull Latest Changes

```powershell
cd $HOME\Documents\Praetor\Praetor-Legal-Contract-Tool

# Stop all services first
# Ctrl+C in each PowerShell window

# Pull updates
git pull origin UI/UX-ish
```

### 12.2 Update Backend

```powershell
cd backend
npm install
npm start
```

### 12.3 Update Word Add-in

```powershell
cd word-addin
npm install
npm start
```

---

## 📝 STEP 13: Daily Operations

### Starting Everything

**Create a startup script** (`start-praetor.ps1`):

```powershell
# Save this as start-praetor.ps1

# Start Backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd $HOME\Documents\Praetor\Praetor-Legal-Contract-Tool\backend; npm start"

# Wait 5 seconds
Start-Sleep -Seconds 5

# Start Web Frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd $HOME\Documents\Praetor\Praetor-Legal-Contract-Tool; python -m http.server 8080"

# Start Word Add-in
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd $HOME\Documents\Praetor\Praetor-Legal-Contract-Tool\word-addin; npm start"
```

**Run the script:**
```powershell
.\start-praetor.ps1
```

### Stopping Everything

```powershell
# Press Ctrl+C in each PowerShell window
# Or close the windows
```

---

## 🎯 Quick Reference

### URLs
- **Backend API**: http://localhost:3000/api/health
- **Web Frontend**: http://localhost:8080
- **Word Add-in**: https://localhost:3000

### Important Paths
- **Project Root**: `C:\Users\YourUsername\Documents\Praetor\Praetor-Legal-Contract-Tool`
- **Backend**: `...\backend`
- **Word Add-in**: `...\word-addin`
- **Manifest**: `...\word-addin\manifest.xml`

### Common Commands
```powershell
# Check Node version
node --version

# Check running processes
Get-Process node

# Test backend
curl http://localhost:3000/api/health

# View PM2 status
pm2 status

# Restart backend
pm2 restart praetor-backend
```

---

## ✅ Success Checklist

- [ ] Windows VM accessible via RDP
- [ ] Node.js installed and verified
- [ ] Git installed and verified
- [ ] Repository cloned successfully
- [ ] Backend dependencies installed
- [ ] `.env` file configured with credentials
- [ ] Backend running on port 3000
- [ ] Web frontend accessible on port 8080
- [ ] Word add-in dev server running
- [ ] Word add-in sideloaded successfully
- [ ] "Praetor" button visible in Word ribbon
- [ ] Can analyze documents successfully
- [ ] Firewall rules configured (if needed)
- [ ] PM2 service installed (for production)

---

## 📞 Support

### If you encounter issues:

1. **Check logs** in PowerShell windows
2. **Verify all services running** (3 PowerShell windows)
3. **Test each component** individually
4. **Check firewall** settings
5. **Verify credentials** in `.env` file
6. **Review troubleshooting** section above

### Useful Resources:
- Backend README: `backend/README.md`
- Word Add-in README: `word-addin/README.md`
- Office.js Guide: `OFFICEJS_DEVELOPMENT_GUIDE.md`

---

## 🎉 You're Done!

Your Praetor Legal Assistant is now fully deployed on Windows VM!

**What you can do now:**
- ✅ Analyze legal documents via web interface
- ✅ Use Word add-in for in-document analysis
- ✅ Access from other machines (if firewall configured)
- ✅ Run as Windows service for production

**Next Steps:**
- Configure automatic backups
- Set up monitoring/alerting
- Deploy to production domain
- Add user authentication (if needed)

---

**Deployed with ❤️ on Windows**

*Praetor - AI-Powered Legal Intelligence*