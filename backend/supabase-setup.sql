-- Create students table
CREATE TABLE IF NOT EXISTS students (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    grade VARCHAR(50) NOT NULL,
    subjects TEXT[] NOT NULL DEFAULT '{}',
    weak_topics TEXT[] DEFAULT '{}',
    avatar TEXT,
    teacher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_students_teacher_id ON students(teacher_id);
CREATE INDEX IF NOT EXISTS idx_students_grade ON students(grade);
CREATE INDEX IF NOT EXISTS idx_students_created_at ON students(created_at);

-- Enable Row Level Security
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

-- Drop existing RLS policies
DROP POLICY IF EXISTS "Teachers can view their own students" ON students;
DROP POLICY IF EXISTS "Teachers can insert their own students" ON students;
DROP POLICY IF EXISTS "Teachers can update their own students" ON students;
DROP POLICY IF EXISTS "Teachers can delete their own students" ON students;

-- Create new RLS policy for backend service role
CREATE POLICY "Allow backend operations" ON students
    FOR ALL USING (true);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_students_updated_at 
    BEFORE UPDATE ON students 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data (optional - for testing)
-- INSERT INTO students (name, grade, subjects, weak_topics, teacher_id) VALUES
--     ('John Tan', 'P5', ARRAY['Math', 'Science'], ARRAY['Algebra', 'Fractions'], 'your-teacher-uuid-here'),
--     ('Aisha Lim', 'P5', ARRAY['Math', 'English'], ARRAY['Geometry', 'Essay Writing'], 'your-teacher-uuid-here'),
--     ('Marcus Wong', 'Sec 1', ARRAY['Math', 'Science', 'History'], ARRAY['Quadratic Equations', 'Cell Biology'], 'your-teacher-uuid-here');

-- Create answer_keys table
CREATE TABLE IF NOT EXISTS answer_keys (
    id BIGSERIAL PRIMARY KEY,
    file_url TEXT NOT NULL,
    file_name TEXT NOT NULL,
    upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    subject VARCHAR(100),
    grade VARCHAR(50),
    uploader_id UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create worksheets table
CREATE TABLE IF NOT EXISTS worksheets (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT REFERENCES students(id) ON DELETE CASCADE,
    file_url TEXT NOT NULL,
    file_name TEXT NOT NULL,
    upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'analyzing',
    score INTEGER,
    weak_topics TEXT[],
    ai_suggestions TEXT[],
    answer_key_url TEXT,
    answer_key_id BIGINT REFERENCES answer_keys(id) ON DELETE SET NULL,
    assignment_id BIGINT REFERENCES assignments(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_worksheets_student_id ON worksheets(student_id);
CREATE INDEX IF NOT EXISTS idx_answer_keys_subject_grade ON answer_keys(subject, grade);
CREATE INDEX IF NOT EXISTS idx_worksheets_assignment_id ON worksheets(assignment_id);

-- Create assignments table
CREATE TABLE IF NOT EXISTS assignments (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subject VARCHAR(100),
    grade VARCHAR(50),
    answer_key_id BIGINT REFERENCES answer_keys(id) ON DELETE SET NULL,
    answer_key_url TEXT,
    due_date TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create assignment_students table
CREATE TABLE IF NOT EXISTS assignment_students (
    assignment_id BIGINT REFERENCES assignments(id) ON DELETE CASCADE,
    student_id BIGINT REFERENCES students(id) ON DELETE CASCADE,
    PRIMARY KEY (assignment_id, student_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_assignments_grade ON assignments(grade);
CREATE INDEX IF NOT EXISTS idx_assignment_students_assignment_id ON assignment_students(assignment_id);
CREATE INDEX IF NOT EXISTS idx_assignment_students_student_id ON assignment_students(student_id); 