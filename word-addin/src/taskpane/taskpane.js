/* ===================================
   PRAETOR WORD ADD-IN - MAIN LOGIC
   =================================== */

// Configuration
const API_BASE = 'http://localhost:3000/api';

// Global state
let currentAnalysis = null;
let availableClauses = [];

// ===================================
// OFFICE.JS INITIALIZATION
// ===================================

Office.onReady((info) => {
    if (info.host === Office.HostType.Word) {
        console.log('Praetor Word Add-in loaded successfully');
        
        // Initialize UI
        initializeUI();
        
        // Check API connection
        checkApiConnection();
        
        // Load clause library
        loadClauseLibrary();
    }
});

// ===================================
// UI INITIALIZATION
// ===================================

function initializeUI() {
    // Get Started button
    document.getElementById('get-started-btn').onclick = () => {
        showSection('analysis-section');
    };
    
    // Analysis buttons
    document.getElementById('analyze-document-btn').onclick = analyzeDocument;
    document.getElementById('analyze-selection-btn').onclick = analyzeSelection;
    
    // Clause library
    document.getElementById('clause-select').onchange = (e) => {
        document.getElementById('load-clause-btn').disabled = !e.target.value;
    };
    document.getElementById('load-clause-btn').onclick = loadSelectedClause;
    
    // Results buttons
    document.getElementById('back-btn').onclick = () => {
        showSection('analysis-section');
    };
    document.getElementById('insert-summary-btn').onclick = insertSummary;
    document.getElementById('new-analysis-btn').onclick = () => {
        showSection('analysis-section');
    };
}

// ===================================
// API CONNECTION
// ===================================

async function checkApiConnection() {
    const statusIndicator = document.getElementById('api-status');
    const statusText = statusIndicator.querySelector('.status-text');
    
    try {
        const response = await fetch(`${API_BASE}/health`);
        
        if (response.ok) {
            statusIndicator.classList.add('connected');
            statusText.textContent = 'Connected';
        } else {
            throw new Error('API not responding');
        }
    } catch (error) {
        console.error('API connection error:', error);
        statusIndicator.classList.add('error');
        statusText.textContent = 'Disconnected';
        showNotification('Cannot connect to backend API. Please ensure the server is running.', 'error');
    }
}

// ===================================
// CLAUSE LIBRARY
// ===================================

async function loadClauseLibrary() {
    try {
        const response = await fetch(`${API_BASE}/clauses`);
        const data = await response.json();
        
        if (data.success) {
            availableClauses = data.clauses;
            populateClauseSelect(data.clauses);
        }
    } catch (error) {
        console.error('Error loading clause library:', error);
    }
}

function populateClauseSelect(clauses) {
    const select = document.getElementById('clause-select');
    
    clauses.forEach(clause => {
        const option = document.createElement('option');
        option.value = clause.id;
        option.textContent = `${clause.type.toUpperCase()} - ${clause.text.substring(0, 50)}...`;
        select.appendChild(option);
    });
}

async function loadSelectedClause() {
    const clauseId = document.getElementById('clause-select').value;
    const clause = availableClauses.find(c => c.id === clauseId);
    
    if (!clause) return;
    
    try {
        await Word.run(async (context) => {
            // Insert clause text at cursor position
            const range = context.document.getSelection();
            range.insertText(clause.text, Word.InsertLocation.replace);
            
            await context.sync();
            
            showNotification('Clause loaded successfully', 'success');
        });
    } catch (error) {
        console.error('Error loading clause:', error);
        showNotification('Error loading clause', 'error');
    }
}

// ===================================
// DOCUMENT ANALYSIS
// ===================================

async function analyzeDocument() {
    showLoading(true);
    
    try {
        // Get entire document text
        const text = await Word.run(async (context) => {
            const body = context.document.body;
            body.load('text');
            await context.sync();
            return body.text;
        });
        
        if (!text || text.trim().length === 0) {
            showNotification('Document is empty. Please add some text first.', 'warning');
            showLoading(false);
            return;
        }
        
        // Analyze with backend
        await performAnalysis(text);
        
    } catch (error) {
        console.error('Error analyzing document:', error);
        showNotification('Error analyzing document: ' + error.message, 'error');
        showLoading(false);
    }
}

async function analyzeSelection() {
    showLoading(true);
    
    try {
        // Get selected text
        const text = await Word.run(async (context) => {
            const range = context.document.getSelection();
            range.load('text');
            await context.sync();
            return range.text;
        });
        
        if (!text || text.trim().length === 0) {
            showNotification('Please select some text first.', 'warning');
            showLoading(false);
            return;
        }
        
        // Analyze with backend
        await performAnalysis(text);
        
    } catch (error) {
        console.error('Error analyzing selection:', error);
        showNotification('Error analyzing selection: ' + error.message, 'error');
        showLoading(false);
    }
}

async function performAnalysis(text) {
    const clauseType = document.getElementById('clause-type-select').value;
    const highlightRisks = document.getElementById('highlight-risks-checkbox').checked;
    
    try {
        const response = await fetch(`${API_BASE}/analyze/custom`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: text,
                clauseType: clauseType
            })
        });
        
        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.message || 'Analysis failed');
        }
        
        currentAnalysis = data.analysis;
        
        // Highlight risky phrases if enabled
        if (highlightRisks && currentAnalysis.keywords) {
            await highlightRiskyPhrases(currentAnalysis.keywords);
        }
        
        // Display results
        displayResults(currentAnalysis);
        showSection('results-section');
        showLoading(false);
        
    } catch (error) {
        console.error('Analysis error:', error);
        showNotification('Analysis failed: ' + error.message, 'error');
        showLoading(false);
    }
}

// ===================================
// RESULTS DISPLAY
// ===================================

function displayResults(analysis) {
    // Risk score
    const riskScore = analysis.risk.score / 10; // Convert to 0-10 scale
    const riskLevel = analysis.risk.level;
    
    document.getElementById('risk-score').textContent = riskScore.toFixed(1);
    document.getElementById('risk-label').textContent = `${riskLevel.toUpperCase()} RISK`;
    
    // Apply risk level styling
    const riskCard = document.getElementById('risk-card');
    riskCard.className = 'card risk-card risk-' + riskLevel;
    
    // Risk bar
    const riskBar = document.getElementById('risk-bar');
    riskBar.style.width = `${analysis.risk.score}%`;
    
    // Entities
    const entityList = document.getElementById('entity-list');
    entityList.innerHTML = '';
    
    if (analysis.analysis.entities && analysis.analysis.entities.length > 0) {
        analysis.analysis.entities.forEach(entity => {
            const tag = document.createElement('span');
            tag.className = 'entity-tag';
            tag.textContent = `${entity.type}: ${entity.text}`;
            entityList.appendChild(tag);
        });
    } else {
        entityList.innerHTML = '<p class="empty-state">No entities found</p>';
    }
    
    // Keywords
    const keywordList = document.getElementById('keyword-list');
    keywordList.innerHTML = '';
    
    if (analysis.keywords && analysis.keywords.length > 0) {
        analysis.keywords.forEach(keyword => {
            const tag = document.createElement('span');
            tag.className = 'keyword-tag';
            tag.textContent = keyword.text;
            keywordList.appendChild(tag);
        });
    } else {
        keywordList.innerHTML = '<p class="empty-state">No keywords found</p>';
    }
    
    // Risk factors
    const riskFactors = document.getElementById('risk-factors');
    riskFactors.innerHTML = '';
    
    if (analysis.risk.factors && analysis.risk.factors.length > 0) {
        analysis.risk.factors.forEach(factor => {
            const item = document.createElement('div');
            item.className = 'risk-factor-item';
            item.textContent = factor;
            riskFactors.appendChild(item);
        });
    } else {
        riskFactors.innerHTML = '<p class="empty-state">No risk factors identified</p>';
    }
}

// ===================================
// WORD DOCUMENT MANIPULATION
// ===================================

async function highlightRiskyPhrases(keywords) {
    try {
        await Word.run(async (context) => {
            const body = context.document.body;
            
            // Highlight top 5 keywords
            const topKeywords = keywords.slice(0, 5);
            
            for (const keyword of topKeywords) {
                const searchResults = body.search(keyword.text, {
                    matchCase: false,
                    matchWholeWord: false
                });
                
                searchResults.load('items');
                await context.sync();
                
                // Highlight each occurrence
                searchResults.items.forEach(item => {
                    item.font.highlightColor = '#FFFF00'; // Yellow
                });
            }
            
            await context.sync();
        });
    } catch (error) {
        console.error('Error highlighting phrases:', error);
        // Don't show error to user, highlighting is optional
    }
}

async function insertSummary() {
    if (!currentAnalysis) return;
    
    try {
        await Word.run(async (context) => {
            const range = context.document.getSelection();
            
            // Create summary text
            const riskScore = (currentAnalysis.risk.score / 10).toFixed(1);
            const riskLevel = currentAnalysis.risk.level.toUpperCase();
            
            let summary = `\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
            summary += `PRAETOR LEGAL ANALYSIS SUMMARY\n`;
            summary += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
            summary += `Risk Score: ${riskScore}/10 (${riskLevel} RISK)\n\n`;
            
            if (currentAnalysis.analysis.entities && currentAnalysis.analysis.entities.length > 0) {
                summary += `Key Entities:\n`;
                currentAnalysis.analysis.entities.forEach(entity => {
                    summary += `  • ${entity.type}: ${entity.text}\n`;
                });
                summary += `\n`;
            }
            
            if (currentAnalysis.risk.factors && currentAnalysis.risk.factors.length > 0) {
                summary += `Risk Factors:\n`;
                currentAnalysis.risk.factors.forEach(factor => {
                    summary += `  ⚠ ${factor}\n`;
                });
                summary += `\n`;
            }
            
            summary += `Analysis Date: ${new Date().toLocaleString()}\n`;
            summary += `Powered by IBM Watson NLU\n`;
            summary += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
            
            // Insert at end of selection
            range.insertText(summary, Word.InsertLocation.end);
            
            await context.sync();
            
            showNotification('Summary inserted successfully', 'success');
        });
    } catch (error) {
        console.error('Error inserting summary:', error);
        showNotification('Error inserting summary', 'error');
    }
}

// ===================================
// UI HELPERS
// ===================================

function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('hidden');
    });
    
    // Show target section
    document.getElementById(sectionId).classList.remove('hidden');
}

function showLoading(show) {
    const overlay = document.getElementById('loading-overlay');
    if (show) {
        overlay.classList.remove('hidden');
    } else {
        overlay.classList.add('hidden');
    }
}

function showNotification(message, type = 'info') {
    // Simple console notification for now
    // In production, you'd want a proper toast/notification system
    console.log(`[${type.toUpperCase()}] ${message}`);
    
    // You could also use Office.context.ui.displayDialogAsync for modal notifications
    if (type === 'error') {
        alert(message);
    }
}

// Made with Bob
