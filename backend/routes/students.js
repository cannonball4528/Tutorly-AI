const express = require('express');
const supabase = require('../config/supabase');
const { authenticateToken } = require('../middleware/auth');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const { analyzeWorksheetWithAI } = require('../services/aiService');

const router = express.Router();

/**
 * GET /api/students
 * Get all students for the authenticated user
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('teacher_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase fetch students error:', error);
      return res.status(500).json({
        error: 'Failed to fetch students',
        message: error.message
      });
    }

    res.json({
      message: 'Students retrieved successfully',
      students: data
    });

  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred while fetching students'
    });
  }
});

/**
 * POST /api/students
 * Create a new student
 */
router.post('/', authenticateToken, async (req, res) => {
  try {
    console.log('POST /api/students - Request body:', JSON.stringify(req.body, null, 2));
    console.log('POST /api/students - User ID:', req.user.id);
    
    const { name, grade, subjects, weakTopics = [], avatar } = req.body;

    // Validate input
    if (!name || !grade || !subjects || !Array.isArray(subjects)) {
      console.log('Validation failed:', { name, grade, subjects, weakTopics, avatar });
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Name, grade, and subjects are required'
      });
    }

    if (subjects.length === 0) {
      console.log('Subjects array is empty');
      return res.status(400).json({
        error: 'Invalid subjects',
        message: 'At least one subject is required'
      });
    }

    const studentData = {
      name,
      grade,
      subjects,
      weak_topics: weakTopics,
      avatar,
      teacher_id: req.user.id,
      last_activity: new Date().toISOString()
    };

    console.log('Attempting to insert student data:', JSON.stringify(studentData, null, 2));

    // Create student in Supabase
    const { data, error } = await supabase
      .from('students')
      .insert(studentData)
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(400).json({
        error: 'Failed to create student',
        message: error.message
      });
    }

    console.log('Student created successfully:', data);

    // Format response to match frontend expectations
    const formattedStudent = {
      id: data.id,
      name: data.name,
      grade: data.grade,
      subjects: data.subjects,
      weakTopics: data.weak_topics || [],
      lastActivity: 'Just added',
      avatar: data.avatar
    };

    res.status(201).json({
      message: 'Student created successfully',
      student: formattedStudent
    });

  } catch (error) {
    console.error('Create student error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred while creating the student'
    });
  }
});

/**
 * GET /api/students/:id
 * Get a specific student by ID
 */
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('id', id)
      .eq('teacher_id', req.user.id)
      .single();

    if (error) {
      return res.status(404).json({
        error: 'Student not found',
        message: 'The requested student could not be found'
      });
    }

    // Format response to match frontend expectations
    const formattedStudent = {
      id: data.id,
      name: data.name,
      grade: data.grade,
      subjects: data.subjects,
      weakTopics: data.weak_topics || [],
      lastActivity: data.last_activity,
      avatar: data.avatar
    };

    res.json({
      message: 'Student retrieved successfully',
      student: formattedStudent
    });

  } catch (error) {
    console.error('Get student error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred while fetching the student'
    });
  }
});

/**
 * PUT /api/students/:id
 * Update a specific student
 */
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, grade, subjects, weakTopics, avatar } = req.body;

    // Validate input
    if (!name || !grade || !subjects || !Array.isArray(subjects)) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Name, grade, and subjects are required'
      });
    }

    // Update student in Supabase
    const { data, error } = await supabase
      .from('students')
      .update({
        name,
        grade,
        subjects,
        weak_topics: weakTopics || [],
        avatar,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('teacher_id', req.user.id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({
        error: 'Failed to update student',
        message: error.message
      });
    }

    // Format response to match frontend expectations
    const formattedStudent = {
      id: data.id,
      name: data.name,
      grade: data.grade,
      subjects: data.subjects,
      weakTopics: data.weak_topics || [],
      lastActivity: data.last_activity,
      avatar: data.avatar
    };

    res.json({
      message: 'Student updated successfully',
      student: formattedStudent
    });

  } catch (error) {
    console.error('Update student error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred while updating the student'
    });
  }
});

/**
 * DELETE /api/students/:id
 * Delete a specific student
 */
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', id)
      .eq('teacher_id', req.user.id);

    if (error) {
      return res.status(400).json({
        error: 'Failed to delete student',
        message: error.message
      });
    }

    res.json({
      message: 'Student deleted successfully'
    });

  } catch (error) {
    console.error('Delete student error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred while deleting the student'
    });
  }
});

router.post('/:studentId/worksheet-with-answer-key', authenticateToken, upload.fields([
  { name: 'worksheet', maxCount: 1 },
  { name: 'answerKey', maxCount: 1 }
]), async (req, res) => {
  try {
    const { studentId } = req.params;
    const { assignmentId } = req.query;
    const worksheetFile = req.files['worksheet']?.[0];
    const answerKeyFile = req.files['answerKey']?.[0];

    if (!worksheetFile || !answerKeyFile) {
      return res.status(400).json({ error: 'Both worksheet and answer key files are required.' });
    }

    const worksheetExt = worksheetFile.originalname.split('.').pop().toLowerCase();
    const answerKeyExt = answerKeyFile.originalname.split('.').pop().toLowerCase();

    const worksheetUrl = `file://${worksheetFile.path}`;
    const answerKeyUrl = `file://${answerKeyFile.path}`;

    // Run AI analysis (OCR included)
    const aiResult = await analyzeWorksheetWithAI({ worksheetUrl, answerKeyUrl, worksheetExt, answerKeyExt });

    // TODO: Save results to worksheets table, linked to studentId and assignmentId

    res.json({
      message: 'Worksheet and answer key analyzed successfully!',
      aiResult
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to analyze worksheet and answer key.' });
  }
});

module.exports = router; 