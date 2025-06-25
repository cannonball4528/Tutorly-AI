-- Drop existing RLS policies
DROP POLICY IF EXISTS "Teachers can view their own students" ON students;
DROP POLICY IF EXISTS "Teachers can insert their own students" ON students;
DROP POLICY IF EXISTS "Teachers can update their own students" ON students;
DROP POLICY IF EXISTS "Teachers can delete their own students" ON students;

-- Create new RLS policy for backend service role
CREATE POLICY "Allow backend operations" ON students
    FOR ALL USING (true); 