const axios = require('axios');

async function runTests() {
  const api = axios.create({ baseURL: 'http://localhost:5000/api' });
  const log = (msg) => console.log('==>', msg);

  try {
    // 1. Auth Test: Wrong Invite Code
    log('Test 1: Signup with wrong invite code');
    try {
      await api.post('/auth/signup', {
        name: 'Bad Employee',
        email: `bad${Date.now()}@test.com`,
        password: 'password123',
        role: 'employee',
        inviteCode: 'WRONG'
      });
      console.error('FAIL: Expected 401 on wrong invite code');
    } catch (e) {
      if (e.response && e.response.status === 401) {
        log('PASS: Correctly rejected wrong invite code');
      } else {
        console.error('FAIL: Unexpected error on wrong invite code', e.message);
      }
    }

    // 2. Security Test: User trying to post
    log('Test 2: Normal user trying to post an article');
    let userToken = '';
    try {
      const userRes = await api.post('/auth/signup', {
        name: 'Normal User',
        email: `user${Date.now()}@test.com`,
        password: 'password123',
        role: 'user'
      });
      userToken = userRes.data.data.token;
      log('User created');
    } catch (e) {
      console.error('Error creating user:', e.response?.data || e.message);
      return;
    }

    try {
      await api.post('/articles', {
        title: 'Hacked Article',
        content: 'This should not be allowed.',
        category: 'Tech'
      }, {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      console.error('FAIL: User was able to post an article!');
    } catch (e) {
      if (e.response && e.response.status === 403) {
        log('PASS: User blocked from posting article (403 Forbidden)');
      } else {
        console.error('FAIL: Expected 403 but got:', e.response?.status || e.message);
      }
    }

    // 3. Employee Success Test
    log('Test 3: Employee created successfully and can post an article');
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
      log('Employee created');
    } catch (e) {
      console.error('Error creating employee:', e.response?.data || e.message);
      return;
    }

    try {
      const artRes = await api.post('/articles', {
        title: 'Valid Story',
        content: 'This is a valid story from an employee with sufficient length so it passes validation (50 chars min). Yes this is more than 50 chars!',
        category: 'Politics'
      }, {
        headers: { Authorization: `Bearer ${employeeToken}` }
      });
      if (artRes.status === 201) {
        log('PASS: Employee successfully posted an article');
      }
    } catch (e) {
      console.error('FAIL: Employee could not post:', e.response?.data || e.message);
    }

  } catch (err) {
    console.error('Global Error:', err);
  }
}

runTests();
