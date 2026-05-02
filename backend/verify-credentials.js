/**
 * Credential Verification Script
 * Run this before starting the application to verify IBM Cloud credentials
 * Usage: node verify-credentials.js
 */

require('dotenv').config();
const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
const { IamAuthenticator } = require('ibm-watson/auth');
const { CloudantV1 } = require('@ibm-cloud/cloudant');

console.log('='.repeat(60));
console.log('IBM Cloud Credentials Verification');
console.log('='.repeat(60));
console.log('');

// Check if .env file exists
const fs = require('fs');
if (!fs.existsSync('.env')) {
  console.error('❌ ERROR: .env file not found!');
  console.log('');
  console.log('Please create a .env file by copying .env.example:');
  console.log('  cp .env.example .env');
  console.log('');
  console.log('Then edit .env with your IBM Cloud credentials.');
  process.exit(1);
}

console.log('✓ .env file found');
console.log('');

// Verify environment variables are set
console.log('Checking environment variables...');
console.log('-'.repeat(60));

const requiredVars = {
  'WATSON_NLU_APIKEY': process.env.WATSON_NLU_APIKEY,
  'WATSON_NLU_URL': process.env.WATSON_NLU_URL,
  'CLOUDANT_URL': process.env.CLOUDANT_URL,
  'CLOUDANT_APIKEY': process.env.CLOUDANT_APIKEY
};

let allVarsSet = true;
for (const [key, value] of Object.entries(requiredVars)) {
  if (!value || value === 'your_api_key_here' || value === 'your_service_url_here' || value === 'your_cloudant_url_here') {
    console.log(`❌ ${key}: NOT SET or using placeholder value`);
    allVarsSet = false;
  } else {
    // Mask sensitive values for display
    const maskedValue = value.length > 20 
      ? value.substring(0, 10) + '...' + value.substring(value.length - 10)
      : '***';
    console.log(`✓ ${key}: ${maskedValue}`);
  }
}

console.log('');

if (!allVarsSet) {
  console.error('❌ ERROR: Some environment variables are missing or using placeholder values!');
  console.log('');
  console.log('Please update your .env file with actual IBM Cloud credentials.');
  console.log('See DEPLOYMENT.md for instructions on obtaining credentials.');
  process.exit(1);
}

console.log('All environment variables are set. Testing connections...');
console.log('');

// Test Watson NLU connection
async function testWatsonNLU() {
  console.log('Testing Watson Natural Language Understanding...');
  console.log('-'.repeat(60));
  
  try {
    const nlu = new NaturalLanguageUnderstandingV1({
      version: '2022-04-07',
      authenticator: new IamAuthenticator({
        apikey: process.env.WATSON_NLU_APIKEY,
      }),
      serviceUrl: process.env.WATSON_NLU_URL,
    });

    // Test with a simple analysis
    const analyzeParams = {
      text: 'This is a test sentence to verify Watson NLU connectivity.',
      features: {
        sentiment: {},
        keywords: {}
      }
    };

    const response = await nlu.analyze(analyzeParams);
    
    console.log('✓ Watson NLU connection successful!');
    console.log(`  - Service URL: ${process.env.WATSON_NLU_URL}`);
    console.log(`  - API Version: 2022-04-07`);
    console.log(`  - Test analysis completed successfully`);
    console.log('');
    return true;
  } catch (error) {
    console.error('❌ Watson NLU connection failed!');
    console.error(`  Error: ${error.message}`);
    console.log('');
    console.log('Common issues:');
    console.log('  1. Invalid API key - check WATSON_NLU_APIKEY in .env');
    console.log('  2. Incorrect service URL - check WATSON_NLU_URL in .env');
    console.log('  3. Service not provisioned - create Watson NLU service in IBM Cloud');
    console.log('');
    return false;
  }
}

// Test Cloudant connection
async function testCloudant() {
  console.log('Testing Cloudant Database...');
  console.log('-'.repeat(60));
  
  try {
    const { IamAuthenticator } = require('@ibm-cloud/cloudant/auth');
    
    const client = CloudantV1.newInstance({
      authenticator: new IamAuthenticator({
        apikey: process.env.CLOUDANT_APIKEY,
      }),
      serviceUrl: process.env.CLOUDANT_URL,
    });

    // Test connection by listing databases
    const response = await client.getAllDbs();
    
    console.log('✓ Cloudant connection successful!');
    console.log(`  - Service URL: ${process.env.CLOUDANT_URL}`);
    console.log(`  - Databases accessible: ${response.result.length}`);
    console.log('');
    return true;
  } catch (error) {
    console.error('❌ Cloudant connection failed!');
    console.error(`  Error: ${error.message}`);
    console.log('');
    console.log('Common issues:');
    console.log('  1. Invalid CLOUDANT_APIKEY - check CLOUDANT_APIKEY in .env');
    console.log('  2. Invalid CLOUDANT_URL - check CLOUDANT_URL in .env');
    console.log('  3. Service not provisioned - create Cloudant service in IBM Cloud');
    console.log('');
    return false;
  }
}

// Run all tests
async function runTests() {
  const watsonOk = await testWatsonNLU();
  const cloudantOk = await testCloudant();
  
  console.log('='.repeat(60));
  console.log('Verification Summary');
  console.log('='.repeat(60));
  console.log('');
  
  if (watsonOk && cloudantOk) {
    console.log('✅ All credentials verified successfully!');
    console.log('');
    console.log('You can now start the application:');
    console.log('  npm start');
    console.log('');
    console.log('Or run in development mode:');
    console.log('  npm run dev');
    console.log('');
    process.exit(0);
  } else {
    console.log('❌ Credential verification failed!');
    console.log('');
    console.log('Please fix the issues above and run this script again:');
    console.log('  node verify-credentials.js');
    console.log('');
    console.log('For help obtaining credentials, see DEPLOYMENT.md');
    console.log('');
    process.exit(1);
  }
}

// Run the tests
runTests().catch(error => {
  console.error('Unexpected error:', error);
  process.exit(1);
});

// Made with Bob
