const express = require('express');
const router = express.Router();
const watsonService = require('../services/watson.service');
const cloudantService = require('../services/cloudant.service');
const fs = require('fs');
const path = require('path');

/**
 * Analysis Routes
 * Handles all API endpoints for legal clause analysis
 */

// Load clauses from JSON file
let clausesData = null;

function loadClauses() {
  if (!clausesData) {
    const clausesPath = path.join(__dirname, '../data/clauses.json');
    const rawData = fs.readFileSync(clausesPath, 'utf8');
    clausesData = JSON.parse(rawData);
  }
  return clausesData;
}

/**
 * GET /api/health
 * Health check endpoint
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Legal Document Review API',
    version: '1.0.0'
  });
});

/**
 * GET /api/clauses
 * List all pre-loaded legal clauses
 */
router.get('/clauses', (req, res) => {
  try {
    const data = loadClauses();
    
    res.json({
      success: true,
      count: data.clauses.length,
      clauses: data.clauses
    });
  } catch (error) {
    console.error('Error loading clauses:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to load clauses',
      message: error.message
    });
  }
});

/**
 * GET /api/clauses/:id
 * Get a specific clause by ID
 */
router.get('/clauses/:id', (req, res) => {
  try {
    const data = loadClauses();
    const clause = data.clauses.find(c => c.id === req.params.id);
    
    if (!clause) {
      return res.status(404).json({
        success: false,
        error: 'Clause not found',
        message: `No clause found with ID: ${req.params.id}`
      });
    }
    
    res.json({
      success: true,
      clause: clause
    });
  } catch (error) {
    console.error('Error retrieving clause:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve clause',
      message: error.message
    });
  }
});

/**
 * POST /api/clauses/:id/analyze
 * Analyze a specific clause with Watson NLU and save results to Cloudant
 */
router.post('/clauses/:id/analyze', async (req, res) => {
  try {
    const data = loadClauses();
    const clause = data.clauses.find(c => c.id === req.params.id);
    
    if (!clause) {
      return res.status(404).json({
        success: false,
        error: 'Clause not found',
        message: `No clause found with ID: ${req.params.id}`
      });
    }
    
    // Analyze with Watson NLU
    console.log(`Analyzing clause ${clause.id}...`);
    const analysis = await watsonService.analyzeText(clause.text, clause.id);
    
    // Add clause metadata to analysis
    analysis.clauseType = clause.type;
    
    // Save to Cloudant
    console.log(`Saving analysis results to Cloudant...`);
    const savedDoc = await cloudantService.saveAnalysis(analysis);
    
    res.json({
      success: true,
      message: 'Clause analyzed successfully',
      analysis: savedDoc
    });
    
  } catch (error) {
    console.error('Error analyzing clause:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze clause',
      message: error.message
    });
  }
});

/**
 * POST /api/analyze/batch
 * Analyze all clauses in batch
 */
router.post('/analyze/batch', async (req, res) => {
  try {
    const data = loadClauses();
    
    console.log(`Starting batch analysis of ${data.clauses.length} clauses...`);
    
    // Analyze all clauses
    const batchResult = await watsonService.analyzeBatch(data.clauses);
    
    // Add clause types to results
    batchResult.results = batchResult.results.map(result => {
      const clause = data.clauses.find(c => c.id === result.clauseId);
      return {
        ...result,
        clauseType: clause ? clause.type : 'unknown'
      };
    });
    
    // Save all results to Cloudant
    if (batchResult.results.length > 0) {
      console.log(`Saving ${batchResult.results.length} analysis results to Cloudant...`);
      const saveResult = await cloudantService.saveBatchAnalysis(batchResult.results);
      
      res.json({
        success: true,
        message: 'Batch analysis completed',
        analysis: batchResult,
        storage: saveResult
      });
    } else {
      res.json({
        success: false,
        message: 'No clauses were successfully analyzed',
        analysis: batchResult
      });
    }
    
  } catch (error) {
    console.error('Error in batch analysis:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to complete batch analysis',
      message: error.message
    });
  }
});

/**
 * GET /api/results/:id
 * Get analysis results from Cloudant by document ID
 */
router.get('/results/:id', async (req, res) => {
  try {
    const result = await cloudantService.getAnalysisById(req.params.id);
    
    res.json({
      success: true,
      result: result
    });
    
  } catch (error) {
    console.error('Error retrieving results:', error);
    
    if (error.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        error: 'Results not found',
        message: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve results',
      message: error.message
    });
  }
});

/**
 * GET /api/results
 * List all analysis results with optional filtering
 * Query parameters:
 *   - limit: Maximum number of results (default: 100)
 *   - clauseId: Filter by clause ID
 *   - riskLevel: Filter by risk level (low, medium, high)
 */
router.get('/results', async (req, res) => {
  try {
    const options = {
      limit: parseInt(req.query.limit) || 100,
      clauseId: req.query.clauseId,
      riskLevel: req.query.riskLevel
    };
    
    const results = await cloudantService.listAnalyses(options);
    
    res.json({
      success: true,
      count: results.length,
      results: results
    });
    
  } catch (error) {
    console.error('Error listing results:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to list results',
      message: error.message
    });
  }
});

/**
 * POST /api/analyze/custom
 * Analyze custom text (not from pre-loaded clauses)
 */
router.post('/analyze/custom', async (req, res) => {
  try {
    const { text, clauseType } = req.body;
    
    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid input',
        message: 'Text is required'
      });
    }
    
    // Analyze with Watson NLU
    console.log('Analyzing custom text...');
    const analysis = await watsonService.analyzeText(text);
    
    // Add clause type if provided
    if (clauseType) {
      analysis.clauseType = clauseType;
    }
    
    // Save to Cloudant
    console.log('Saving analysis results to Cloudant...');
    const savedDoc = await cloudantService.saveAnalysis(analysis);
    
    res.json({
      success: true,
      message: 'Custom text analyzed successfully',
      analysis: savedDoc
    });
    
  } catch (error) {
    console.error('Error analyzing custom text:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze custom text',
      message: error.message
    });
  }
});

module.exports = router;

// Made with Bob
