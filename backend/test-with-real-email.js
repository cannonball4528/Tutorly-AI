const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

// Test with a more realistic email
const testUser = {
  email: 'test.user.2024@gmail.com', // Using a more realistic email format
  password: 'password123456',
  user_metadata: {
    full_name: 'Test User',
    role: 'student'
  }
};

let accessToken = null;

async function testWithRealEmail() {
  console.log('🧪 Testing with Realistic Email Format\n');

  try {
    // Test 1: Health Check
    console.log('1. Testing health check...');
    const healthResponse = await axios.get('http://localhost:3001/health');
    console.log('✅ Health check passed:', healthResponse.data.message);

    // Test 2: Signup with realistic email
    console.log('\n2. Testing user signup with realistic email...');
    console.log('   Using email:', testUser.email);
    
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

    console.log('\n🎉 All tests passed! Authentication system is working correctly.');
    console.log('\n📧 Note: You may receive a confirmation email at:', testUser.email);
    console.log('   Check your email and confirm the account if needed.');

  } catch (error) {
    console.error('\n❌ Test failed:', error.response?.data || error.message);
    if (error.response?.status) {
      console.error('Status:', error.response.status);
    }
    
    // Provide helpful suggestions
    if (error.response?.data?.message?.includes('invalid')) {
      console.log('\n💡 Suggestions:');
      console.log('   1. Try using a real email address you own');
      console.log('   2. Check your Supabase project settings');
      console.log('   3. Make sure email confirmations are properly configured');
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

  await testWithRealEmail();
}

main(); 