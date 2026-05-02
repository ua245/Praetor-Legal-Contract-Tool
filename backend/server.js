require('dotenv').config();
const express = require('express');
const cors = require('cors');
const watsonService = require('./services/watson.service');
const cloudantService = require('./services/cloudant.service');
const analysisRoutes = require('./routes/analysis.routes');

/**
 * Legal Document Review API Server
 * Express server with Watson NLU and Cloudant integration
 */

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Mount API routes
app.use('/api', analysisRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Legal Document Review API',
    version: '1.0.0',
    endpoints: {
      health: 'GET /api/health',
      clauses: 'GET /api/clauses',
      clause: 'GET /api/clauses/:id',
      analyzeClause: 'POST /api/clauses/:id/analyze',
      analyzeBatch: 'POST /api/analyze/batch',
      analyzeCustom: 'POST /api/analyze/custom',
      results: 'GET /api/results',
      result: 'GET /api/results/:id'
    },
    documentation: 'See README.md for detailed API documentation'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.path}`,
    availableEndpoints: [
      'GET /api/health',
      'GET /api/clauses',
      'GET /api/clauses/:id',
      'POST /api/clauses/:id/analyze',
      'POST /api/analyze/batch',
      'POST /api/analyze/custom',
      'GET /api/results',
      'GET /api/results/:id'
    ]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  
  res.status(err.status || 500).json({
    success: false,
    error: err.name || 'Internal Server Error',
    message: err.message || 'An unexpected error occurred',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

/**
 * Initialize services and start server
 */
async function startServer() {
  try {
    console.log('Starting Legal Document Review API...');
    console.log('Environment:', process.env.NODE_ENV || 'development');
    
    // Initialize Watson NLU service
    try {
      watsonService.initializeWatson();
      console.log('✓ Watson NLU service initialized');
    } catch (error) {
      console.warn('⚠ Watson NLU initialization failed:', error.message);
      console.warn('  API will run but analysis endpoints will not work until credentials are configured');
    }
    
    // Initialize Cloudant service
    try {
      await cloudantService.initializeCloudant();
      console.log('✓ Cloudant database service initialized');
    } catch (error) {
      console.warn('⚠ Cloudant initialization failed:', error.message);
      console.warn('  API will run but storage endpoints will not work until credentials are configured');
    }
    
    // Start Express server
    app.listen(PORT, () => {
      console.log('');
      console.log('═══════════════════════════════════════════════════════');
      console.log(`  Legal Document Review API is running`);
      console.log(`  Port: ${PORT}`);
      console.log(`  URL: http://localhost:${PORT}`);
      console.log('═══════════════════════════════════════════════════════');
      console.log('');
      console.log('Available endpoints:');
      console.log('  GET  /api/health              - Health check');
      console.log('  GET  /api/clauses             - List all clauses');
      console.log('  GET  /api/clauses/:id         - Get specific clause');
      console.log('  POST /api/clauses/:id/analyze - Analyze clause');
      console.log('  POST /api/analyze/batch       - Analyze all clauses');
      console.log('  POST /api/analyze/custom      - Analyze custom text');
      console.log('  GET  /api/results             - List all results');
      console.log('  GET  /api/results/:id         - Get specific result');
      console.log('');
      
      if (!process.env.WATSON_NLU_APIKEY || !process.env.CLOUDANT_URL) {
        console.log('⚠ CONFIGURATION REQUIRED:');
        console.log('  Copy .env.example to .env and configure:');
        console.log('  - WATSON_NLU_APIKEY');
        console.log('  - WATSON_NLU_URL');
        console.log('  - CLOUDANT_URL');
        console.log('');
      }
    });
    
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  process.exit(0);
});

// Start the server
startServer();

module.exports = app;

// Made with Bob
