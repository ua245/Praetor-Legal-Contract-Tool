// Ensure this points to your Node server port
const API_BASE = 'http://localhost:3000/api';

// Global variable to store download filename
let downloadFilename = null;

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Icons
  lucide.createIcons();
  
  // 2. Setup File Upload
  setupFileUpload();

  // 2. Real-time Clock
  const timeEl = document.getElementById('system-time');
  if (timeEl) {
    setInterval(() => {
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
      timeEl.innerText = `${timeStr} UTC`;
    }, 1000);
  }

  // 3. Routing Logic
  const navLinks = document.querySelectorAll('.nav-btn[data-target], .side-btn[data-target], .icon-btn[data-target]');
  const screens = document.querySelectorAll('.screen-view');

  function setScreen(targetId) {
    screens.forEach(s => {
      s.classList.add('d-none');
      s.classList.remove('active-screen');
    });

    const targetScreen = document.getElementById(`screen-${targetId}`);
    if (targetScreen) {
      targetScreen.classList.remove('d-none');
      targetScreen.classList.add('active-screen');
      
      // Retrigger main screen animation
      targetScreen.classList.remove('fade-blur');
      void targetScreen.offsetWidth; 
      targetScreen.classList.add('fade-blur');

      // BUG FIX: Retrigger all child animations so they don't get stuck invisible
      const animatedChildren = targetScreen.querySelectorAll('.anim-slide-up, .anim-scale-up');
      animatedChildren.forEach(child => {
          child.style.animation = 'none';
          void child.offsetWidth; // Force browser to reflow
          child.style.animation = ''; // Restore and replay animation
      });
    }

    navLinks.forEach(link => {
      if(link.getAttribute('data-target') === targetId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Lazy load specific data when tabs open
    if(targetId === 'clause_library') loadClauseLibrary();
    if(targetId === 'results') loadRecentIngestions();
  }

  navLinks.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-target');
      if (target) setScreen(target);
    });
  });

  // 4. Character Counter for Analyse Textarea
  const textarea = document.getElementById('analyse-textarea');
  const charCount = document.getElementById('char-count');
  if (textarea && charCount) {
    textarea.addEventListener('input', (e) => {
      charCount.innerText = `${e.target.value.length.toLocaleString()} / 25,000 CHARS`;
    });
  }

  // Reset Button
  const resetBtn = document.getElementById('btn-reset-text');
  if(resetBtn) {
    resetBtn.addEventListener('click', () => {
        document.getElementById('analyse-textarea').value = '';
        charCount.innerText = `0 / 25,000 CHARS`;
        resetPipelineUI();
    });
  }

  // Settings Toggles Interaction
  const auditToggle = document.getElementById('audit-logging-toggle');
  if (auditToggle) {
      auditToggle.addEventListener('click', () => {
          auditToggle.classList.toggle('active');
      });
  }

  // Theme Engine (Dark/Light Mode)
  const themeToggle = document.getElementById('dark-command-toggle');
  if (themeToggle) {
      themeToggle.addEventListener('click', () => {
          // Visually flip the switch
          themeToggle.classList.toggle('active');
          const isDark = themeToggle.classList.contains('active');
          
          const icon = document.getElementById('theme-icon');
          const label = document.getElementById('theme-label');
          const desc = document.getElementById('theme-desc');

          if (isDark) {
              document.body.classList.remove('light-mode');
              label.innerText = 'Dark Command';
              desc.innerText = 'High-contrast tactical environment';
              icon.setAttribute('data-lucide', 'moon');
          } else {
              document.body.classList.add('light-mode');
              label.innerText = 'Light Command';
              desc.innerText = 'High-visibility daytime environment';
              icon.setAttribute('data-lucide', 'sun');
          }
          
          // Re-render the Lucide icon so it changes from moon to sun
          lucide.createIcons();
      });
  }

  // Settings: Revert Button
  const btnRevert = document.getElementById('btn-revert-settings');
  if (btnRevert) {
      btnRevert.addEventListener('click', () => {
          // 1. Revert Theme to Dark Command
          const themeToggle = document.getElementById('dark-command-toggle');
          if (!themeToggle.classList.contains('active')) {
              themeToggle.click(); // Trigger the existing logic to switch back
          }
          
          // 2. Revert Audit Logging to Active
          const auditToggle = document.getElementById('audit-logging-toggle');
          if (!auditToggle.classList.contains('active')) {
              auditToggle.classList.add('active');
          }
          
          // Visual Feedback
          const originalText = btnRevert.innerText;
          btnRevert.innerText = "REVERTED";
          btnRevert.classList.add('text-warning', 'border-warning');
          setTimeout(() => { 
              btnRevert.innerText = originalText; 
              btnRevert.classList.remove('text-warning', 'border-warning');
          }, 1500);
      });
  }

  // Settings: Apply Command Button
  const btnApply = document.getElementById('btn-apply-settings');
  if (btnApply) {
      btnApply.addEventListener('click', () => {
          // Visual Feedback
          const originalText = btnApply.innerText;
          btnApply.innerText = "COMMAND APPLIED";
          btnApply.classList.add('bg-success', 'border-success', 'text-white');
          
          setTimeout(() => { 
              btnApply.innerText = originalText; 
              btnApply.classList.remove('bg-success', 'border-success', 'text-white');
          }, 2000);
      });
  }

  // 5. Connect to Backend API
  checkApiHealth();
  loadDashboardStats();

  // Attach Analysis Button
  const analyzeBtn = document.getElementById('btn-analyze');
  if (analyzeBtn) {
      analyzeBtn.addEventListener('click', handleAnalyze);
  }
});

// ==========================================
// API INTEGRATION FUNCTIONS
// ==========================================

async function checkApiHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`);
    if(res.ok) {
       document.getElementById('api-status-dot').className = 'status-dot bg-success animate-pulse shadow-success';
       document.getElementById('api-status-text').className = 'font-mono text-xxs text-success';
       document.getElementById('api-status-text').innerText = 'API CONNECTED';
       
       document.getElementById('dash-api-log').innerText = '> Connecting to Backend API... [SUCCESS]';
       document.getElementById('stat-api').innerHTML = `<div class="status-dot bg-success shadow-success"></div> ONLINE`;
    }
  } catch(e) {
       document.getElementById('api-status-dot').className = 'status-dot bg-danger shadow-danger';
       document.getElementById('api-status-text').className = 'font-mono text-xxs text-danger';
       document.getElementById('api-status-text').innerText = 'API DISCONNECTED';
       
       document.getElementById('dash-api-log').innerText = '> Connecting to Backend API... [FAILED]';
       document.getElementById('dash-api-log').classList.add('text-danger');
       document.getElementById('stat-api').innerHTML = `<div class="status-dot bg-danger shadow-danger"></div> OFFLINE`;
  }
}

async function loadDashboardStats() {
    try {
        const [resResults, resClauses] = await Promise.all([
            fetch(`${API_BASE}/results`),
            fetch(`${API_BASE}/clauses`)
        ]);
        
        if (resResults.ok) {
            const data = await resResults.json();
            document.getElementById('stat-total').innerText = data.count || 0;
        }
        
        if (resClauses.ok) {
            const data = await resClauses.json();
            document.getElementById('stat-clauses').innerText = data.count || 0;
        }
    } catch(e) {
        console.error("Dashboard load error", e);
    }
}

async function loadClauseLibrary() {
  try {
    const res = await fetch(`${API_BASE}/clauses`);
    const data = await res.json();
    
    document.getElementById('library-count').innerText = data.count;
    const grid = document.getElementById('clause-grid');
    grid.innerHTML = '';

    data.clauses.forEach((clause, i) => {
      // Map generic type to colors
      let colorClass = 'primary';
      if(clause.type === 'liability' || clause.type === 'termination') colorClass = 'danger';
      else if(clause.type === 'indemnification' || clause.type === 'dispute resolution') colorClass = 'warning';

      const cardHtml = `
        <div class="col-12 col-md-6 col-lg-4 anim-scale-up" style="animation-delay: ${i * 0.05}s">
          <div class="card clause-card border-top-${colorClass} bg-surface-lowest h-100 group">
            <div class="text-xs fw-bold text-white text-uppercase tracking-wider mb-2 text-truncate pe-2">ID: ${clause.id}</div>
            <div class="text-xxs text-outline opacity-80 mb-3 lh-sm line-clamp-2" style="height: 32px;">${clause.text.substring(0, 80)}...</div>
            <div class="row g-2 pb-3 mb-3 border-bottom border-outline-variant">
              <div class="col-12">
                <div class="text-xxs fw-black text-outline-variant text-uppercase" style="font-size: 8px;">Type</div>
                <div class="text-xxs font-mono text-${colorClass} text-uppercase">${clause.type}</div>
              </div>
            </div>
            <button onclick="loadClauseToAnalyse('${clause.id}', \`${clause.text.replace(/"/g, '&quot;')}\`, '${clause.type}')" class="btn btn-link text-outline hover-primary text-xxs fw-black text-uppercase text-decoration-none w-100 d-flex justify-content-center align-items-center p-0 mt-auto border border-outline-variant py-1">
              Load Payload <i data-lucide="chevron-right" class="icon-xs ms-1"></i>
            </button>
          </div>
        </div>
      `;
      grid.innerHTML += cardHtml;
    });
    lucide.createIcons();
  } catch (e) {
    console.error("Failed to load clauses", e);
  }
}

window.loadClauseToAnalyse = function(id, text, type) {
    const select = document.getElementById('clause-type-select');
    const optionExists = Array.from(select.options).some(opt => opt.value === type);
    if(optionExists) select.value = type;
    else select.value = 'custom';

    document.getElementById('analyse-textarea').value = text;
    document.getElementById('char-count').innerText = `${text.length.toLocaleString()} / 25,000 CHARS`;
    
    document.querySelector('.nav-btn[data-target="analyse"]').click();
}

async function handleAnalyze() {
    const text = document.getElementById('analyse-textarea').value;
    const clauseType = document.getElementById('clause-type-select').value;
    
    if (!text || text.trim() === '') {
        alert("Please paste some legal text to analyze.");
        return;
    }

    const btn = document.getElementById('btn-analyze');
    const btnText = document.getElementById('analyze-btn-text');
    
    btn.disabled = true;
    btnText.innerText = "PROCESSING...";
    
    document.getElementById('step-2').className = 'step-circle active text-primary animate-pulse';
    document.getElementById('step-2').innerHTML = '02';

    try {
        const res = await fetch(`${API_BASE}/analyze/custom`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, clauseType })
        });
        
        const data = await res.json();
        
        if (!data.success) throw new Error(data.message || "Analysis failed");

        document.getElementById('step-2').className = 'step-circle complete';
        document.getElementById('step-2').innerHTML = '<i data-lucide="check" class="icon-xs"></i>';
        document.getElementById('step-3').className = 'step-circle complete';
        document.getElementById('step-3').innerHTML = '<i data-lucide="check" class="icon-xs"></i>';
        lucide.createIcons();

        populateResults(data.analysis);
        
        setTimeout(() => {
            document.querySelector('.nav-btn[data-target="results"]').click();
            btn.disabled = false;
            btnText.innerText = "Analyse Document";
            resetPipelineUI();
        }, 800);

    } catch (e) {
        alert("Error during analysis: " + e.message);
        btn.disabled = false;
        btnText.innerText = "Analyse Document";
        resetPipelineUI();
    }
}

function resetPipelineUI() {
    document.getElementById('step-2').className = 'step-circle text-outline';
    document.getElementById('step-2').innerHTML = '02';
    document.getElementById('step-3').className = 'step-circle text-outline';
    document.getElementById('step-3').innerHTML = '03';
}

function populateResults(doc) {
    const scoreVal = doc.risk.score; 
    const scoreFormatted = (scoreVal / 10).toFixed(1); 
    const level = doc.risk.level; 
    
    document.getElementById('result-id').innerText = `ID: ${doc._id || 'CUSTOM-TXT'}`;
    document.getElementById('result-score').innerText = `${scoreFormatted}`;
    document.getElementById('result-score').innerHTML += `<span class="fs-4 text-outline-variant fw-medium">/10</span>`;
    
    const bar = document.getElementById('result-threshold-bar');
    bar.style.width = `${scoreVal}%`;
    document.getElementById('result-threshold-text').innerText = `${scoreVal}%`;

    let color = 'primary';
    if(level === 'high') color = 'danger';
    if(level === 'medium') color = 'warning';

    document.getElementById('result-score').className = `fw-black text-${color} tracking-tighter ${level === 'high' ? 'text-glow-error' : ''}`;
    bar.className = `progress-bar bg-${color} shadow-${color}`;
    document.getElementById('result-threshold-text').className = `text-${color}`;
    document.getElementById('result-color-bar').className = `position-absolute top-0 start-0 w-100 bg-${color}`;

    const badge = document.getElementById('result-badge');
    badge.classList.remove('d-none', 'border-danger', 'text-danger', 'bg-danger-10', 'border-warning', 'text-warning', 'bg-warning-10', 'border-primary', 'text-primary', 'bg-primary-10');
    badge.classList.add(`border-${color}`, `text-${color}`, `bg-${color}-10`);
    document.getElementById('result-badge-text').innerText = `${level.toUpperCase()} RISK EXPOSURE`;

    const entitiesBox = document.getElementById('result-entities');
    entitiesBox.innerHTML = '';
    const entities = doc.analysis.entities || [];
    if(entities.length === 0) {
        entitiesBox.innerHTML = '<span class="text-xs text-outline">No specific entities extracted.</span>';
    } else {
        entities.forEach(ent => {
            entitiesBox.innerHTML += `<span class="badge-custom border-primary text-primary bg-primary-5">${ent.type}: ${ent.text}</span>`;
        });
    }

    const vectorsBox = document.getElementById('result-vectors');
    vectorsBox.innerHTML = '';
    const factors = doc.risk.factors || [];
    if(factors.length === 0) {
        vectorsBox.innerHTML = '<span class="text-xs text-outline">No critical risk vectors identified.</span>';
    } else {
        factors.forEach(factor => {
            vectorsBox.innerHTML += `<div class="badge-mono border-${color} text-${color} bg-${color}-5 py-1 px-2 mb-1">${factor.toUpperCase()}</div>`;
        });
    }
}

async function loadRecentIngestions() {
    const listBox = document.getElementById('recent-ingestions');
    listBox.innerHTML = '<div class="text-xs text-outline text-center mt-4">Loading history...</div>';
    
    try {
        const res = await fetch(`${API_BASE}/results?limit=10`);
        const data = await res.json();
        
        listBox.innerHTML = '';

        // Added this safety check for empty databases
        if(!data.success || !data.results || data.results.length === 0) {
             listBox.innerHTML = '<div class="text-xs text-outline text-center mt-4">No recent history. Hit Analyse!</div>';
             return;
        }

        data.results.forEach(doc => {
            let color = 'primary';
            if(doc.risk.level === 'high') color = 'danger';
            if(doc.risk.level === 'medium') color = 'warning';
            
            const diffMs = new Date() - new Date(doc.createdAt);
            const diffMins = Math.floor(diffMs / 60000);
            let timeStr = diffMins < 60 ? `${diffMins}m ago` : `${Math.floor(diffMins/60)}h ago`;

            const itemHtml = `
              <div onclick='fetchAndShowResult("${doc._id}")' class="border border-outline-variant p-2 hover-bg-surface cursor-pointer transition-all border-start-${color}">
                <div class="d-flex justify-content-between align-items-start mb-1">
                  <span class="text-xs fw-bold text-white text-truncate pe-2">${doc.clauseType ? doc.clauseType.toUpperCase() : 'CUSTOM'}</span>
                  <span class="text-xxs fw-bold border border-${color} text-${color} px-1">${doc.risk.level.toUpperCase()}</span>
                </div>
                <div class="d-flex justify-content-between">
                    <div class="text-xxs text-outline-variant font-mono text-truncate pe-2">ID: ${doc._id.substring(0,8)}...</div>
                    <div class="text-xxs text-outline-variant font-mono text-uppercase">${timeStr}</div>
                </div>
              </div>
            `;
            listBox.innerHTML += itemHtml;
        });
    } catch(e) {
        listBox.innerHTML = '<div class="text-xs text-outline text-center mt-4">No recent history yet.</div>';
    }
}

window.fetchAndShowResult = async function(id) {
    try {
        const res = await fetch(`${API_BASE}/results/${id}`);
        const data = await res.json();
        if(data.success) populateResults(data.result);
    } catch(e) {
        console.error("Could not fetch result", e);
    }
}

// ==========================================
// FILE UPLOAD FUNCTIONALITY
// ==========================================

function setupFileUpload() {
  const dropZone = document.getElementById('drop-zone');
  const fileInput = document.getElementById('file-input');
  const browseBtn = document.getElementById('btn-browse');
  const downloadBtn = document.getElementById('btn-download');
  
  // Browse button click
  if (browseBtn) {
    browseBtn.addEventListener('click', () => fileInput.click());
  }
  
  // File input change
  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        handleFileUpload(e.target.files[0]);
      }
    });
  }
  
  // Drag and drop events
  if (dropZone) {
    dropZone.addEventListener('click', () => fileInput.click());
    
    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.classList.add('border-primary', 'bg-primary-10');
    });
    
    dropZone.addEventListener('dragleave', (e) => {
      e.preventDefault();
      dropZone.classList.remove('border-primary', 'bg-primary-10');
    });
    
    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.classList.remove('border-primary', 'bg-primary-10');
      
      if (e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        if (file.name.endsWith('.docx')) {
          handleFileUpload(file);
        } else {
          alert('Please upload a .docx file');
        }
      }
    });
  }
  
  // Download button
  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      if (downloadFilename) {
        window.location.href = `${API_BASE}/document/download/${downloadFilename}`;
      }
    });
  }
}

async function handleFileUpload(file) {
  const uploadStatus = document.getElementById('upload-status');
  const downloadSection = document.getElementById('download-section');
  const filenameEl = document.getElementById('upload-filename');
  const filesizeEl = document.getElementById('upload-filesize');
  const progressBar = document.getElementById('upload-progress');
  const messageEl = document.getElementById('upload-message');
  
  // Show upload status
  uploadStatus.classList.remove('d-none');
  downloadSection.classList.add('d-none');
  
  // Display file info
  filenameEl.textContent = file.name;
  filesizeEl.textContent = `${(file.size / 1024).toFixed(2)} KB`;
  progressBar.style.width = '0%';
  messageEl.textContent = 'Uploading document...';
  messageEl.className = 'text-xxs text-primary mt-2';
  
  try {
    // Create form data
    const formData = new FormData();
    formData.append('document', file);
    
    // Simulate progress
    progressBar.style.width = '30%';
    
    // Upload file
    const response = await fetch(`${API_BASE}/document/upload`, {
      method: 'POST',
      body: formData
    });
    
    progressBar.style.width = '60%';
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Upload failed');
    }
    
    // Complete progress
    progressBar.style.width = '100%';
    messageEl.textContent = 'Analysis complete! Document ready for download.';
    messageEl.className = 'text-xxs text-success mt-2';
    
    // Store download filename
    downloadFilename = data.filename;
    
    // Show download section
    setTimeout(() => {
      uploadStatus.classList.add('d-none');
      downloadSection.classList.remove('d-none');
      lucide.createIcons();
    }, 1000);
    
    // Also populate results view
    if (data.analysis) {
      populateResults(data.analysis);
    }
    
  } catch (error) {
    console.error('Upload error:', error);
    progressBar.style.width = '100%';
    progressBar.className = 'progress-bar bg-danger rounded-pill';
    messageEl.textContent = `Error: ${error.message}`;
    messageEl.className = 'text-xxs text-danger mt-2';
    
    setTimeout(() => {
      uploadStatus.classList.add('d-none');
      progressBar.className = 'progress-bar bg-primary rounded-pill';
    }, 3000);
  }
}