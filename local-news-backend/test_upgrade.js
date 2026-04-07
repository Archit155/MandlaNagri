const axios = require('axios');
const fs = require('fs');

async function runTests() {
  // Use a cookie jar or manual cookie tracking since axios doesn't store cookies natively in node easily
  const api = axios.create({ baseURL: 'http://localhost:5000/api', withCredentials: true });
  const results = [];
  let cookies = '';

  api.interceptors.response.use(res => {
    if (res.headers['set-cookie']) {
      cookies = res.headers['set-cookie'][0].split(';')[0];
    }
    return res;
  });

  api.interceptors.request.use(req => {
    if (cookies) {
      req.headers['Cookie'] = cookies;
    }
    return req;
  });

  let adminToken = '';
  let employeeToken = '';
  let generatedInviteCode = '';

  try {
    // 1. Cleanup: skip cleanup, just use unique emails
    
    // 2. We can't easily sign up as Admin without DB manipulation, but we can test User / Employee
    // Wait, let's create a User
    results.push('--- PBAC & REFRESH FLOW TEST ---');
    
    // Create simple user
    let userRes;
    try {
       userRes = await api.post('/auth/signup', {
         name: 'Refresh User',
         email: `refresh${Date.now()}@test.com`,
         password: 'password123',
         role: 'user'
       });
       results.push('Test 1: PASS: Created User without invite');
    } catch(err) {
       results.push('Test 1: FAIL: User creation failed ' + err.message);
    }
    
    // Test 2: Refresh token flow
    try {
      // Clear token manually from memory
      const REFRESH_RES = await api.post('/auth/refresh-token');
      if (REFRESH_RES.data.data.token) {
        results.push('Test 2: PASS: Successfully retrieved new access token via Refresh cookie');
      } else {
        results.push('Test 2: FAIL: Refresh token request failed');
      }
    } catch (err) {
       results.push('Test 2: FAIL: ' + (err.response?.data?.message || err.message));
    }

    // Write to results
    fs.writeFileSync('upgrade_results.json', JSON.stringify(results, null, 2));

  } catch (globalErr) {
    console.error('Global Error:', globalErr);
  }
}

runTests();
