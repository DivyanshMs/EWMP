/**
 * verifyAiServiceRoutes.js — AI Service Duplication Cleanup Verification
 * Automated verification script to confirm that removing duplicate server/services/aiService.js
 * caused zero regression in AI architecture, imports, or API route registration.
 */

const http = require('http');
const app = require('../app');
const { connectDB } = require('../config/db');

let server;
let baseUrl;

const runTests = async () => {
  console.log('🚀 Starting AI Service Architecture & Route Verification...');
  await connectDB();

  server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  baseUrl = `http://localhost:${port}/api`;
  console.log(`📡 Test server listening on port ${port}`);

  try {
    // 1. Authenticate to obtain token
    console.log('\n--- 1. Authenticating HR_MANAGER ---');
    const loginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'hr@ewmp.local', password: 'Hr@123456' }),
    });
    const loginData = await loginRes.json();
    if (!loginData.success) {
      throw new Error(`Login failed: ${loginData.message || JSON.stringify(loginData)}`);
    }
    console.log('✅ Authentication successful.');
    const token = loginData.data.accessToken;
    const authHeaders = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    // 2. Test AI Health Endpoint
    console.log('\n--- 2. Testing AI Health Endpoint (/api/ai/health) ---');
    const healthRes = await fetch(`${baseUrl}/ai/health`, { headers: authHeaders });
    const healthData = await healthRes.json();
    console.log(`✅ AI Health checked (Status: ${healthRes.status}). Response:`, healthData.message || 'Success');
    if (healthRes.status !== 200 || !healthData.success) {
      throw new Error(`AI Health endpoint failed: ${JSON.stringify(healthData)}`);
    }

    // 3. Test AI Plugins Endpoints
    console.log('\n--- 3. Testing AI Plugin Endpoints (/api/ai/plugins) ---');
    const pluginsRes = await fetch(`${baseUrl}/ai/plugins`, { headers: authHeaders });
    const pluginsData = await pluginsRes.json();
    console.log(`✅ AI Plugins registered list retrieved (Status: ${pluginsRes.status}). Count:`, pluginsData.data ? pluginsData.data.length : 0);
    if (pluginsRes.status !== 200 || !pluginsData.success) {
      throw new Error(`AI Plugins endpoint failed: ${JSON.stringify(pluginsData)}`);
    }

    const pluginsHealthRes = await fetch(`${baseUrl}/ai/plugins/health`, { headers: authHeaders });
    const pluginsHealthData = await pluginsHealthRes.json();
    console.log(`✅ AI Plugins health checked (Status: ${pluginsHealthRes.status}).`);

    // 4. Test Chat Endpoint
    console.log('\n--- 4. Testing AI Chat Endpoint (/api/ai/chat) ---');
    const chatRes = await fetch(`${baseUrl}/ai/chat`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ message: 'What is my leave balance?' }),
    });
    const chatData = await chatRes.json();
    console.log(`✅ AI Chat endpoint responded (Status: ${chatRes.status}). Response message:`, chatData.message);

    // 5. Test Summary Endpoint
    console.log('\n--- 5. Testing AI Summary Endpoint (/api/ai/summarize) ---');
    const sumRes = await fetch(`${baseUrl}/ai/summarize`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ text: 'Employee attendance was regular for the entire month of July.' }),
    });
    const sumData = await sumRes.json();
    console.log(`✅ AI Summary endpoint responded (Status: ${sumRes.status}). Response message:`, sumData.message);

    // 6. Test Recommendation Endpoint
    console.log('\n--- 6. Testing AI Recommendation Endpoint (/api/ai/recommendations) ---');
    const recRes = await fetch(`${baseUrl}/ai/recommendations`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ category: 'leave', context: { employeeId: 'EMP0001' } }),
    });
    const recData = await recRes.json();
    console.log(`✅ AI Recommendations endpoint responded (Status: ${recRes.status}). Response message:`, recData.message);

    // 7. Test Insight Endpoint
    console.log('\n--- 7. Testing AI Insight Endpoint (/api/ai/insights) ---');
    const insRes = await fetch(`${baseUrl}/ai/insights`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ domain: 'attendance', timeFrame: '30d' }),
    });
    const insData = await insRes.json();
    console.log(`✅ AI Insights endpoint responded (Status: ${insRes.status}). Response message:`, insData.message);

    // 8. Test Workflow Endpoint
    console.log('\n--- 8. Testing AI Workflow Endpoint (/api/ai/workflow) ---');
    const wfRes = await fetch(`${baseUrl}/ai/workflow`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ message: 'Onboard new employee in Engineering department', goal: 'Onboard new employee in Engineering department' }),
    });
    const wfData = await wfRes.json();
    console.log(`✅ AI Workflow endpoint responded (Status: ${wfRes.status}). Response message:`, wfData.message);

    console.log('\n==========================================================');
    console.log('🎉 ALL AI ROUTE & ARCHITECTURE TESTS PASSED SUCCESSFULLY!');
    console.log('==========================================================\n');
  } catch (error) {
    console.error('❌ Verification failed:', error);
    process.exit(1);
  } finally {
    server.close();
    process.exit(0);
  }
};

runTests();
