const axios = require('axios');
const fs = require('fs');

async function runTests() {
  const api = axios.create({ baseURL: 'http://localhost:5000/api' });
  const results = [];

  try {
    // 1. Auth Test: Wrong Invite Code
    try {
      await api.post('/auth/signup', {
        name: 'Bad Employee',
        email: `bad${Date.now()}@test.com`,
        password: 'password123',
        role: 'employee',
        inviteCode: 'WRONG'
      });
      results.push('Test 1: FAIL: Expected 401 on wrong invite code');
    } catch (e) {
      if (e.response && e.response.status === 401) {
        results.push('Test 1: PASS: Correctly rejected wrong invite code');
      } else {
        results.push('Test 1: FAIL: Unexpected error on wrong invite code ' + e.message);
      }
    }

    // 2. Security Test: User trying to post
    let userToken = '';
    try {
      const userRes = await api.post('/auth/signup', {
        name: 'Normal User',
        email: `user${Date.now()}@test.com`,
        password: 'password123',
        role: 'user'
      });
      userToken = userRes.data.data.token;
    } catch (e) {
      results.push('Test 2: ERROR creating user ' + (e.response?.data?.message || e.message));
    }

    if (userToken) {
      try {
        await api.post('/articles', {
          title: 'Hacked Article',
          content: 'This should not be allowed.',
          category: 'Tech'
        }, {
          headers: { Authorization: `Bearer ${userToken}` }
        });
        results.push('Test 2: FAIL: User was able to post an article!');
      } catch (e) {
        if (e.response && e.response.status === 403) {
          results.push('Test 2: PASS: User blocked from posting article (403)');
        } else {
          results.push('Test 2: FAIL: Expected 403 but got: ' + (e.response?.status || e.message));
        }
      }
    }

    // 3. Employee Success Test
    let employeeToken = '';
    try {
      const empRes = await api.post('/auth/signup', {
        name: 'Good Employee',
        email: `emp${Date.now()}@test.com`,
        password: 'password123',
        role: 'employee',
        inviteCode: process.env.EMPLOYEE_INVITE_CODE || 'LOCALNEWZ-2026'
      });
      employeeToken = empRes.data.data.token;
    } catch (e) {
      results.push('Test 3: ERROR creating employee ' + (e.response?.data?.message || e.message));
    }

    if (employeeToken) {
      try {
        const artRes = await api.post('/articles', {
          title: 'Valid Story',
          content: 'This is a valid story from an employee with sufficient length so it passes validation (50 chars min). Yes this is more than 50 chars!',
          category: 'Politics'
        }, {
          headers: { Authorization: `Bearer ${employeeToken}` }
        });
        if (artRes.status === 201) {
          results.push('Test 3: PASS: Employee successfully posted an article');
        }
      } catch (e) {
        results.push('Test 3: FAIL: Employee could not post: ' + (e.response?.data?.message || e.message));
      }
    }

  } catch (err) {
    results.push('Global Error: ' + err.message);
  }

  fs.writeFileSync('test_results.json', JSON.stringify(results, null, 2));
}

runTests();
