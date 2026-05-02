const { CloudantV1 } = require('@ibm-cloud/cloudant');
const { IamAuthenticator } = require('@ibm-cloud/cloudant/auth');

/**
 * Cloudant Database Service
 * Provides database operations for storing and retrieving analysis results
 */

let cloudantClient = null;
const DATABASE_NAME = 'legal-analysis-results';

/**
 * Initialize Cloudant service with credentials from environment variables
 * @throws {Error} If credentials are missing
 */
async function initializeCloudant() {
  if (!process.env.CLOUDANT_URL || !process.env.CLOUDANT_APIKEY) {
    throw new Error('Cloudant credentials not configured. Please set CLOUDANT_URL and CLOUDANT_APIKEY in .env file');
  }

  try {
    // Initialize Cloudant client with IAM authentication
    cloudantClient = CloudantV1.newInstance({
      authenticator: new IamAuthenticator({
        apikey: process.env.CLOUDANT_APIKEY,
      }),
      serviceUrl: process.env.CLOUDANT_URL,
    });

    // Check if database exists, create if not
    try {
      await cloudantClient.getDatabaseInformation({ db: DATABASE_NAME });
      console.log(`Cloudant database '${DATABASE_NAME}' connected successfully`);
    } catch (error) {
      if (error.status === 404) {
        // Database doesn't exist, create it
        await cloudantClient.putDatabase({ db: DATABASE_NAME });
        console.log(`Cloudant database '${DATABASE_NAME}' created successfully`);
      } else {
        throw error;
      }
    }

  } catch (error) {
    console.error('Cloudant initialization error:', error);
    throw new Error(`Failed to initialize Cloudant: ${error.message}`);
  }
}

/**
 * Save analysis results to Cloudant
 * @param {Object} analysisResult - Analysis result object from Watson service
 * @returns {Promise<Object>} Saved document with _id and _rev
 */
async function saveAnalysis(analysisResult) {
  if (!cloudantClient) {
    throw new Error('Cloudant service not initialized. Call initializeCloudant() first.');
  }

  if (!analysisResult) {
    throw new Error('Analysis result cannot be empty');
  }

  try {
    // Add metadata
    const document = {
      ...analysisResult,
      type: 'analysis',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Save to Cloudant
    const response = await cloudantClient.postDocument({
      db: DATABASE_NAME,
      document: document
    });

    console.log(`Analysis saved with ID: ${response.result.id}`);

    return {
      id: response.result.id,
      rev: response.result.rev,
      ...document
    };

  } catch (error) {
    console.error('Error saving analysis to Cloudant:', error);
    throw new Error(`Failed to save analysis: ${error.message}`);
  }
}

/**
 * Retrieve analysis result by ID
 * @param {string} id - Document ID
 * @returns {Promise<Object>} Analysis result document
 */
async function getAnalysisById(id) {
  if (!cloudantClient) {
    throw new Error('Cloudant service not initialized. Call initializeCloudant() first.');
  }

  if (!id) {
    throw new Error('Document ID is required');
  }

  try {
    const response = await cloudantClient.getDocument({
      db: DATABASE_NAME,
      docId: id
    });

    return response.result;

  } catch (error) {
    if (error.status === 404) {
      throw new Error(`Analysis with ID '${id}' not found`);
    }
    console.error('Error retrieving analysis from Cloudant:', error);
    throw new Error(`Failed to retrieve analysis: ${error.message}`);
  }
}

/**
 * List all analysis results with optional filtering
 * @param {Object} options - Query options
 * @param {number} options.limit - Maximum number of results (default: 100)
 * @param {string} options.clauseId - Filter by clause ID
 * @param {string} options.riskLevel - Filter by risk level (low, medium, high)
 * @returns {Promise<Array>} Array of analysis results
 */
async function listAnalyses(options = {}) {
  if (!cloudantClient) {
    throw new Error('Cloudant service not initialized. Call initializeCloudant() first.');
  }

  try {
    const limit = options.limit || 100;
    
    // Build selector for filtering
    const selector = {
      type: 'analysis'
    };

    if (options.clauseId) {
      selector.clauseId = options.clauseId;
    }

    if (options.riskLevel) {
      selector['risk.level'] = options.riskLevel;
    }

    // Query documents
    const response = await cloudantClient.postFind({
      db: DATABASE_NAME,
      selector: selector,
      limit: limit,
      sort: [{ createdAt: 'desc' }]
    });

    return response.result.docs;

  } catch (error) {
    console.error('Error listing analyses from Cloudant:', error);
    throw new Error(`Failed to list analyses: ${error.message}`);
  }
}

/**
 * Save batch analysis results
 * @param {Array} results - Array of analysis results
 * @returns {Promise<Object>} Summary of saved documents
 */
async function saveBatchAnalysis(results) {
  if (!cloudantClient) {
    throw new Error('Cloudant service not initialized. Call initializeCloudant() first.');
  }

  if (!Array.isArray(results) || results.length === 0) {
    throw new Error('Results must be a non-empty array');
  }

  try {
    // Prepare documents with metadata
    const documents = results.map(result => ({
      ...result,
      type: 'analysis',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));

    // Bulk insert
    const response = await cloudantClient.postBulkDocs({
      db: DATABASE_NAME,
      bulkDocs: { docs: documents }
    });

    const savedDocs = response.result;
    const successful = savedDocs.filter(doc => doc.ok).length;
    const failed = savedDocs.filter(doc => !doc.ok).length;

    console.log(`Batch save complete: ${successful} successful, ${failed} failed`);

    return {
      total: documents.length,
      successful: successful,
      failed: failed,
      results: savedDocs
    };

  } catch (error) {
    console.error('Error saving batch analysis to Cloudant:', error);
    throw new Error(`Failed to save batch analysis: ${error.message}`);
  }
}

/**
 * Delete analysis result by ID
 * @param {string} id - Document ID
 * @param {string} rev - Document revision
 * @returns {Promise<Object>} Deletion result
 */
async function deleteAnalysis(id, rev) {
  if (!cloudantClient) {
    throw new Error('Cloudant service not initialized. Call initializeCloudant() first.');
  }

  if (!id || !rev) {
    throw new Error('Document ID and revision are required');
  }

  try {
    const response = await cloudantClient.deleteDocument({
      db: DATABASE_NAME,
      docId: id,
      rev: rev
    });

    console.log(`Analysis ${id} deleted successfully`);
    return response.result;

  } catch (error) {
    console.error('Error deleting analysis from Cloudant:', error);
    throw new Error(`Failed to delete analysis: ${error.message}`);
  }
}

module.exports = {
  initializeCloudant,
  saveAnalysis,
  getAnalysisById,
  listAnalyses,
  saveBatchAnalysis,
  deleteAnalysis
};

// Made with Bob
