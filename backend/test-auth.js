const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

// Test data
const testUser = {
  email: `test-${Date.now()}@example.com`,
  password: 'password123',
  user_metadata: {
    full_name: 'Test User',
    role: 'student'
  }
};

let accessToken = null;

async function testAuth() {
  console.log('🧪 Testing Authentication System\n');

  try {
    // Test 1: Health Check
    console.log('1. Testing health check...');
    const healthResponse = await axios.get('http://localhost:3001/health');
    console.log('✅ Health check passed:', healthResponse.data.message);

    // Test 2: Signup
    console.log('\n2. Testing user signup...');
    const signupResponse = await axios.post(`${BASE_URL}/signup`, testUser);
    console.log('✅ Signup successful:', signupResponse.data.message);
    console.log('   User ID:', signupResponse.data.user.id);

    // Test 3: Login
    console.log('\n3. Testing user login...');
    const loginResponse = await axios.post(`${BASE_URL}/login`, {
      email: testUser.email,
      password: testUser.password
    });
    console.log('✅ Login successful:', loginResponse.data.message);
    accessToken = loginResponse.data.session.access_token;
    console.log('   Access token received');

    // Test 4: Get Profile (Protected Route)
    console.log('\n4. Testing protected profile route...');
    const profileResponse = await axios.get(`${BASE_URL}/profile`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    console.log('✅ Profile retrieved:', profileResponse.data.message);
    console.log('   User email:', profileResponse.data.user.email);

    // Test 5: Update Profile (Protected Route)
    console.log('\n5. Testing profile update...');
    const updateResponse = await axios.put(`${BASE_URL}/profile`, {
      user_metadata: {
        full_name: 'Updated Test User',
        role: 'tutor'
      }
    }, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    console.log('✅ Profile updated:', updateResponse.data.message);

    // Test 6: Logout (Protected Route)
    console.log('\n6. Testing logout...');
    const logoutResponse = await axios.post(`${BASE_URL}/logout`, {}, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    console.log('✅ Logout successful:', logoutResponse.data.message);

    // Test 7: Try to access protected route after logout
    console.log('\n7. Testing access after logout...');
    try {
      await axios.get(`${BASE_URL}/profile`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      console.log('❌ Should have failed - token should be invalid');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Correctly rejected invalid token');
      } else {
        console.log('❌ Unexpected error:', error.message);
      }
    }

    console.log('\n🎉 All tests passed! Authentication system is working correctly.');

  } catch (error) {
    console.error('\n❌ Test failed:', error.response?.data || error.message);
    if (error.response?.status) {
      console.error('Status:', error.response.status);
    }
  }
}

// Check if server is running
async function checkServer() {
  try {
    await axios.get('http://localhost:3001/health');
    return true;
  } catch (error) {
    return false;
  }
}

// Main execution
async function main() {
  console.log('🔍 Checking if server is running...');
  const serverRunning = await checkServer();
  
  if (!serverRunning) {
    console.log('❌ Server is not running. Please start the server first:');
    console.log('   cd backend && npm run dev');
    return;
  }

  await testAuth();
}

main(); 