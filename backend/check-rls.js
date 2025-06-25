const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function checkAndFixRLS() {
  console.log('Checking RLS policies for answer_keys table...');
  
  try {
    // Check current policies
    const { data: policies, error: policiesError } = await supabase
      .rpc('get_policies', { table_name: 'answer_keys' });
    
    console.log('Current policies:', policies);
    console.log('Policies error:', policiesError);
    
    // Try to insert a test record
    const { data: insertData, error: insertError } = await supabase
      .from('answer_keys')
      .insert([{
        file_url: 'test-url',
        file_name: 'test-file',
        subject: 'test',
        grade: 'test',
        uploader_id: 'd27ae581-7524-4536-be40-7870ed85b244'
      }])
      .select();
    
    console.log('Insert test result:', insertData);
    console.log('Insert error:', insertError);
    
    if (insertError) {
      console.log('\n=== RLS POLICY ISSUE DETECTED ===');
      console.log('The answer_keys table has restrictive RLS policies.');
      console.log('You need to add a policy that allows authenticated users to insert records.');
      console.log('\nRun this SQL in your Supabase dashboard:');
      console.log(`
-- Enable RLS
ALTER TABLE answer_keys ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert answer keys
CREATE POLICY "Allow authenticated users to insert answer keys" ON answer_keys
FOR INSERT WITH CHECK (auth.uid() = uploader_id);

-- Allow authenticated users to view answer keys they uploaded
CREATE POLICY "Allow authenticated users to view their answer keys" ON answer_keys
FOR SELECT USING (auth.uid() = uploader_id);

-- Allow authenticated users to update their answer keys
CREATE POLICY "Allow authenticated users to update their answer keys" ON answer_keys
FOR UPDATE USING (auth.uid() = uploader_id);

-- Allow authenticated users to delete their answer keys
CREATE POLICY "Allow authenticated users to delete their answer keys" ON answer_keys
FOR DELETE USING (auth.uid() = uploader_id);
      `);
    } else {
      console.log('RLS policies are working correctly!');
    }
    
  } catch (error) {
    console.error('Error checking RLS:', error);
  }
}

checkAndFixRLS(); 