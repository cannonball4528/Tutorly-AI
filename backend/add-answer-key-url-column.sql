-- Add answer_key_url column to assignments table if it doesn't exist
ALTER TABLE assignments ADD COLUMN IF NOT EXISTS answer_key_url TEXT; 