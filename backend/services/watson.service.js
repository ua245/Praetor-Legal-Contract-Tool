const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

/**
 * Watson NLU Service
 * Provides text analysis capabilities using IBM Watson Natural Language Understanding
 */

// Initialize Watson NLU client
let nluClient = null;

/**
 * Initialize Watson NLU service with credentials from environment variables
 * @throws {Error} If credentials are missing
 */
function initializeWatson() {
  if (!process.env.WATSON_NLU_APIKEY || !process.env.WATSON_NLU_URL) {
    throw new Error('Watson NLU credentials not configured. Please set WATSON_NLU_APIKEY and WATSON_NLU_URL in .env file');
  }

  nluClient = new NaturalLanguageUnderstandingV1({
    version: '2022-04-07',
    authenticator: new IamAuthenticator({
      apikey: process.env.WATSON_NLU_APIKEY,
    }),
    serviceUrl: process.env.WATSON_NLU_URL,
  });

  console.log('Watson NLU service initialized successfully');
}

/**
 * Calculate risk score based on analysis results
 * @param {Object} analysis - Watson NLU analysis results
 * @returns {Object} Risk assessment with score and factors
 */
function calculateRiskScore(analysis) {
  let riskScore = 0;
  const riskFactors = [];

  // Risk keywords that indicate potential issues
  const riskKeywords = [
    'terminate', 'termination', 'liability', 'indemnify', 'indemnification',
    'breach', 'damages', 'penalty', 'forfeit', 'waive', 'waiver',
    'dispute', 'arbitration', 'litigation', 'sue', 'lawsuit'
  ];

  // 1. Sentiment Analysis (30 points max)
  if (analysis.sentiment && analysis.sentiment.document) {
    const sentimentScore = analysis.sentiment.document.score;
    
    if (sentimentScore < -0.5) {
      riskScore += 30;
      riskFactors.push('Very negative sentiment detected');
    } else if (sentimentScore < -0.2) {
      riskScore += 20;
      riskFactors.push('Negative sentiment detected');
    } else if (sentimentScore < 0) {
      riskScore += 10;
      riskFactors.push('Slightly negative sentiment');
    }
  }

  // 2. Risk Keywords Analysis (40 points max)
  if (analysis.keywords && analysis.keywords.length > 0) {
    const foundRiskKeywords = analysis.keywords.filter(kw => 
      riskKeywords.some(risk => kw.text.toLowerCase().includes(risk))
    );

    const riskKeywordCount = foundRiskKeywords.length;
    if (riskKeywordCount >= 5) {
      riskScore += 40;
      riskFactors.push(`High number of risk keywords found (${riskKeywordCount})`);
    } else if (riskKeywordCount >= 3) {
      riskScore += 25;
      riskFactors.push(`Multiple risk keywords found (${riskKeywordCount})`);
    } else if (riskKeywordCount >= 1) {
      riskScore += 15;
      riskFactors.push(`Risk keywords present (${riskKeywordCount})`);
    }
  }

  // 3. Entity Analysis (30 points max)
  // Missing key entities could indicate incomplete or vague clauses
  if (analysis.entities) {
    const entityCount = analysis.entities.length;
    
    if (entityCount === 0) {
      riskScore += 30;
      riskFactors.push('No entities identified - clause may be too vague');
    } else if (entityCount < 2) {
      riskScore += 15;
      riskFactors.push('Few entities identified - clause lacks specificity');
    }
  }

  // Normalize risk score to 0-100
  riskScore = Math.min(100, riskScore);

  // Determine risk level
  let riskLevel = 'low';
  if (riskScore >= 70) {
    riskLevel = 'high';
  } else if (riskScore >= 40) {
    riskLevel = 'medium';
  }

  return {
    score: riskScore,
    level: riskLevel,
    factors: riskFactors
  };
}

/**
 * Analyze text using Watson NLU
 * @param {string} text - Text to analyze
 * @param {string} clauseId - Optional clause ID for reference
 * @returns {Promise<Object>} Analysis results with risk assessment
 */
async function analyzeText(text, clauseId = null) {
  if (!nluClient) {
    throw new Error('Watson NLU service not initialized. Call initializeWatson() first.');
  }

  if (!text || text.trim().length === 0) {
    throw new Error('Text cannot be empty');
  }

  try {
    // Configure analysis features
    const analyzeParams = {
      text: text,
      features: {
        entities: {
          sentiment: true,
          limit: 10
        },
        keywords: {
          sentiment: true,
          emotion: true,
          limit: 10
        },
        sentiment: {
          document: true
        },
        concepts: {
          limit: 5
        }
      }
    };

    // Call Watson NLU API
    const response = await nluClient.analyze(analyzeParams);
    const analysis = response.result;

    // Calculate risk score
    const riskAssessment = calculateRiskScore(analysis);

    // Return structured analysis object
    return {
      clauseId: clauseId,
      timestamp: new Date().toISOString(),
      text: text,
      analysis: {
        sentiment: analysis.sentiment,
        entities: analysis.entities || [],
        keywords: analysis.keywords || [],
        concepts: analysis.concepts || []
      },
      risk: riskAssessment,
      language: analysis.language
    };

  } catch (error) {
    console.error('Watson NLU analysis error:', error);
    throw new Error(`Failed to analyze text: ${error.message}`);
  }
}

/**
 * Analyze multiple clauses in batch
 * @param {Array} clauses - Array of clause objects with id and text
 * @returns {Promise<Array>} Array of analysis results
 */
async function analyzeBatch(clauses) {
  if (!Array.isArray(clauses) || clauses.length === 0) {
    throw new Error('Clauses must be a non-empty array');
  }

  const results = [];
  const errors = [];

  // Process each clause sequentially to avoid rate limiting
  for (const clause of clauses) {
    try {
      const result = await analyzeText(clause.text, clause.id);
      results.push(result);
    } catch (error) {
      errors.push({
        clauseId: clause.id,
        error: error.message
      });
    }
  }

  return {
    results,
    errors,
    summary: {
      total: clauses.length,
      successful: results.length,
      failed: errors.length
    }
  };
}

module.exports = {
  initializeWatson,
  analyzeText,
  analyzeBatch
};

// Made with Bob
