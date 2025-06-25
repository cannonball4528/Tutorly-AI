const supabase = require('./config/supabase');

async function debugSupabase() {
  console.log('🔍 Debugging Supabase Connection...\n');

  try {
    // Test 1: Check if Supabase client is initialized
    console.log('1. Checking Supabase client...');
    console.log('   Supabase URL:', supabase.supabaseUrl);
    console.log('   Supabase Key length:', supabase.supabaseKey?.length || 'undefined');
    
    if (!supabase.supabaseUrl || !supabase.supabaseKey) {
      console.log('❌ Supabase credentials are missing or invalid');
      return;
    }
    console.log('✅ Supabase client initialized');

    // Test 2: Try a simple signup with a valid email
    console.log('\n2. Testing signup with valid email...');
    const testEmail = 'testuser123@example.com';
    const testPassword = 'password123456';
    
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          full_name: 'Test User'
        }
      }
    });

    if (error) {
      console.log('❌ Signup error:', error.message);
      console.log('   Error details:', error);
      
      // Check if it's an email validation issue
      if (error.message.includes('invalid')) {
        console.log('\n💡 This might be a Supabase email validation issue.');
        console.log('   Try checking your Supabase project settings:');
        console.log('   1. Go to Authentication > Settings');
        console.log('   2. Check "Enable email confirmations"');
        console.log('   3. Check "Enable email change confirmations"');
        console.log('   4. Try with a real email address');
      }
    } else {
      console.log('✅ Signup successful!');
      console.log('   User ID:', data.user?.id);
      console.log('   Email:', data.user?.email);
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

debugSupabase(); 