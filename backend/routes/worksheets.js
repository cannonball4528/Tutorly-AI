const express = require('express');
const multer = require('multer');
const { authenticateToken } = require('../middleware/auth');
const supabase = require('../config/supabase');
const { createClient: createStorageClient } = require('@supabase/storage-js');
const fetch = require('node-fetch');

const router = express.Router();

// Multer setup for file uploads (memory storage)
const upload = multer({ storage: multer.memoryStorage() });

// Supabase Storage bucket name
const BUCKET = 'worksheets';

// Helper: Upload file buffer to Supabase Storage
async function uploadToSupabaseStorage(file, path) {
  const { data, error } = await supabase.storage.from(BUCKET).upload(path, file.buffer, {
    contentType: file.mimetype,
    upsert: true,
  });
  if (error) throw error;
  // Get public URL
  const { data: publicUrlData } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return publicUrlData.publicUrl;
}

// Helper: Call OpenAI API for worksheet analysis (mocked for now)
async function analyzeWorksheetAI(worksheetUrl, answerKeyUrl) {
  // TODO: Replace with real OpenAI API call
  // Simulate AI response
  return {
    score: Math.floor(Math.random() * 30) + 70,
    weak_topics: ['Algebra', 'Fractions'],
    ai_suggestions: [
      'Review algebraic manipulation techniques.',
      'Practice fraction addition and subtraction.',
      'Use visual aids for better understanding.'
    ]
  };
}

// POST /api/answer-keys - Upload answer key
router.post('/answer-keys', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    const { subject, grade } = req.body;
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });
    const filePath = `answer-keys/${Date.now()}_${file.originalname}`;
    const fileUrl = await uploadToSupabaseStorage(file, filePath);
    // Insert into DB
    const { data, error } = await supabase.from('answer_keys').insert({
      file_url: fileUrl,
      file_name: file.originalname,
      subject,
      grade,
      uploader_id: req.user.id
    }).select().single();
    if (error) throw error;
    res.status(201).json({ message: 'Answer key uploaded', answerKey: data });
  } catch (error) {
    console.error('Upload answer key error:', error);
    res.status(500).json({ error: 'Failed to upload answer key', message: error.message });
  }
});

// GET /api/answer-keys - List answer keys (optionally filter by subject/grade)
router.get('/answer-keys', authenticateToken, async (req, res) => {
  try {
    const { subject, grade } = req.query;
    let query = supabase.from('answer_keys').select('*');
    if (subject) query = query.eq('subject', subject);
    if (grade) query = query.eq('grade', grade);
    const { data, error } = await query.order('upload_date', { ascending: false });
    if (error) throw error;
    res.json({ answerKeys: data });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch answer keys', message: error.message });
  }
});

// POST /api/students/:id/worksheets - Upload worksheet for a student
router.post('/students/:id/worksheets', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    const studentId = req.params.id;
    const { answerKeyId } = req.body;
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });
    // Get answer key info if provided
    let answerKeyUrl = null;
    if (answerKeyId) {
      const { data: answerKey } = await supabase.from('answer_keys').select('file_url').eq('id', answerKeyId).single();
      answerKeyUrl = answerKey?.file_url || null;
    }
    const filePath = `worksheets/${studentId}/${Date.now()}_${file.originalname}`;
    const fileUrl = await uploadToSupabaseStorage(file, filePath);
    // Insert worksheet record (status: analyzing)
    const { data: worksheet, error } = await supabase.from('worksheets').insert({
      student_id: studentId,
      file_url: fileUrl,
      file_name: file.originalname,
      status: 'analyzing',
      answer_key_url: answerKeyUrl,
      answer_key_id: answerKeyId || null
    }).select().single();
    if (error) throw error;
    // Trigger AI analysis (async, but for demo, do it now)
    const aiResult = await analyzeWorksheetAI(fileUrl, answerKeyUrl);
    // Update worksheet with AI results
    await supabase.from('worksheets').update({
      status: 'completed',
      score: aiResult.score,
      weak_topics: aiResult.weak_topics,
      ai_suggestions: aiResult.ai_suggestions
    }).eq('id', worksheet.id);
    // Return updated worksheet
    const { data: updatedWorksheet } = await supabase.from('worksheets').select('*').eq('id', worksheet.id).single();
    res.status(201).json({ message: 'Worksheet uploaded and analyzed', worksheet: updatedWorksheet });
  } catch (error) {
    console.error('Upload worksheet error:', error);
    res.status(500).json({ error: 'Failed to upload worksheet', message: error.message });
  }
});

// GET /api/students/:id/worksheets - List worksheets for a student
router.get('/students/:id/worksheets', authenticateToken, async (req, res) => {
  try {
    const studentId = req.params.id;
    const { data, error } = await supabase.from('worksheets').select('*').eq('student_id', studentId).order('upload_date', { ascending: false });
    if (error) throw error;
    res.json({ worksheets: data });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch worksheets', message: error.message });
  }
});

// DELETE /api/worksheets/:id - Delete a worksheet
router.delete('/worksheets/:id', authenticateToken, async (req, res) => {
  try {
    const worksheetId = req.params.id;
    // Get worksheet info
    const { data: worksheet, error: fetchError } = await supabase.from('worksheets').select('*').eq('id', worksheetId).single();
    if (fetchError || !worksheet) return res.status(404).json({ error: 'Worksheet not found' });
    // Delete file from storage
    const filePath = worksheet.file_url.split(`/${BUCKET}/`)[1];
    if (filePath) {
      await supabase.storage.from(BUCKET).remove([filePath]);
    }
    // Delete worksheet record
    const { error } = await supabase.from('worksheets').delete().eq('id', worksheetId);
    if (error) throw error;
    res.json({ message: 'Worksheet deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete worksheet', message: error.message });
  }
});

module.exports = router; 