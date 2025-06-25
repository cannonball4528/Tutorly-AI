const express = require('express');
const router = express.Router();
const multer = require('multer');
const { createClient } = require('@supabase/supabase-js');
const { analyzeWorksheetWithAI, generateQuestionsForWeakTopics } = require('../services/aiService');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Multer configuration for file uploads
const upload = multer({ dest: 'uploads/' });

// Middleware to verify authentication
const authenticateUser = async (req, res, next) => {
  try {
    console.log('Authenticating request for:', req.method, req.path);
    console.log('Headers:', req.headers);
    
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('No valid authorization header found');
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);
    console.log('Token extracted, length:', token.length);
    
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      console.log('Authentication failed:', error);
      return res.status(401).json({ error: 'Invalid token' });
    }

    console.log('Authentication successful for user:', user.id);
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

// GET /api/assignments - Get all assignments
router.get('/', authenticateUser, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('assignments')
      .select(`
        *,
        answer_keys (
          id,
          file_name,
          file_url
        ),
        assignment_students (
          student_id,
          students (
            id,
            name,
            grade
          )
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching assignments:', error);
      return res.status(500).json({ error: 'Failed to fetch assignments' });
    }

    // Transform the data to a more frontend-friendly format
    const transformedAssignments = data.map(assignment => ({
      ...assignment,
      students: assignment.assignment_students?.map(as => as.students) || [],
      answerKey: assignment.answer_keys || (assignment.answer_key_url ? { file_url: assignment.answer_key_url } : null)
    }));

    res.json({ assignments: transformedAssignments });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/assignments/:id - Get assignment by ID
router.get('/:id', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('assignments')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Assignment not found' });
      }
      console.error('Error fetching assignment:', error);
      return res.status(500).json({ error: 'Failed to fetch assignment' });
    }

    res.json(data);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/assignments - Create new assignment
router.post('/', authenticateUser, upload.any(), async (req, res) => {
  try {
    console.log('Received assignment creation request:', req.body);
    console.log('Files:', req.files);
    console.log('User ID:', req.user.id);
    
    const { title, subject, grade, dueDate, studentIds } = req.body;
    let answerKeyUrl = null;
    let answerKeyId = null;

    console.log('Extracted fields:', { title, subject, grade, dueDate, studentIds });

    if (!title) {
      console.log('Validation failed: title is missing');
      return res.status(400).json({ error: 'Title is required' });
    }

    // Handle answer key file upload (optional)
    if (req.files && req.files.length > 0) {
      const answerKeyFile = req.files.find(file => file.fieldname === 'answerKey');
      if (answerKeyFile) {
        const fileName = `answer-keys/${Date.now()}-${answerKeyFile.originalname}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('assignments')
          .upload(fileName, require('fs').createReadStream(answerKeyFile.path), {
            contentType: answerKeyFile.mimetype
          });
        if (!uploadError) {
          const { data: urlData } = supabase.storage.from('assignments').getPublicUrl(fileName);
          answerKeyUrl = urlData.publicUrl;
          // Create answer key record
          const { data: answerKeyData } = await supabase
            .from('answer_keys')
            .insert([{
              file_url: answerKeyUrl,
              file_name: answerKeyFile.originalname,
              subject,
              grade,
              uploader_id: req.user.id
            }])
            .select()
            .single();
          answerKeyId = answerKeyData.id;
        }
      }
    }

    const assignmentData = {
      title,
      subject,
      grade,
      due_date: dueDate,
      answer_key_id: answerKeyId,
      answer_key_url: answerKeyUrl,
      created_by: req.user.id
    };

    console.log('Attempting to insert assignment data:', assignmentData);

    const { data, error } = await supabase
      .from('assignments')
      .insert([assignmentData])
      .select()
      .single();

    if (error) {
      console.error('Supabase error creating assignment:', error);
      return res.status(500).json({ error: 'Failed to create assignment', details: error.message });
    }

    console.log('Assignment created successfully:', data);

    // Assign students to the assignment if studentIds provided
    if (studentIds && Array.isArray(JSON.parse(studentIds))) {
      const studentIdsArray = JSON.parse(studentIds);
      if (studentIdsArray.length > 0) {
        const assignmentStudents = studentIdsArray.map(studentId => ({
          assignment_id: data.id,
          student_id: parseInt(studentId)
        }));

        const { error: assignError } = await supabase
          .from('assignment_students')
          .insert(assignmentStudents);

        if (assignError) {
          console.error('Error assigning students to assignment:', assignError);
          // Don't fail the whole request, just log the error
        } else {
          console.log('Students assigned to assignment successfully');
        }
      }
    }

    res.status(201).json(data);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/assignments/:id - Update assignment
router.put('/:id', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, subject, grade, due_date, answer_key_id } = req.body;

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (subject !== undefined) updateData.subject = subject;
    if (grade !== undefined) updateData.grade = grade;
    if (due_date !== undefined) updateData.due_date = due_date;
    if (answer_key_id !== undefined) updateData.answer_key_id = answer_key_id;

    const { data, error } = await supabase
      .from('assignments')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Assignment not found' });
      }
      console.error('Error updating assignment:', error);
      return res.status(500).json({ error: 'Failed to update assignment' });
    }

    res.json(data);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/assignments/:id - Delete assignment
router.delete('/:id', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('assignments')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting assignment:', error);
      return res.status(500).json({ error: 'Failed to delete assignment' });
    }

    res.json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/assignments/student/:studentId - Get assignments for a specific student
router.get('/student/:studentId', authenticateUser, async (req, res) => {
  try {
    const { studentId } = req.params;
    const { data, error } = await supabase
      .from('assignment_students')
      .select(`
        assignment_id,
        assignments (
          *,
          answer_keys (
            id,
            file_name,
            file_url
          )
        )
      `)
      .eq('student_id', studentId)
      .order('assignments.created_at', { ascending: false });

    if (error) {
      console.error('Error fetching student assignments:', error);
      return res.status(500).json({ error: 'Failed to fetch student assignments' });
    }

    // Extract assignments and map answerKey
    const assignments = data.map(item => {
      const assignment = item.assignments;
      return {
        ...assignment,
        answerKey: assignment.answer_keys || (assignment.answer_key_url ? { file_url: assignment.answer_key_url } : null)
      };
    });
    res.json(assignments);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/assignments/:id/assign - Assign students to an assignment
router.post('/:id/assign', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const { student_ids } = req.body;

    if (!student_ids || !Array.isArray(student_ids)) {
      return res.status(400).json({ error: 'student_ids array is required' });
    }

    // Create assignment_students records
    const assignmentStudents = student_ids.map(studentId => ({
      assignment_id: id,
      student_id: studentId
    }));

    const { error } = await supabase
      .from('assignment_students')
      .insert(assignmentStudents);

    if (error) {
      console.error('Error assigning students to assignment:', error);
      return res.status(500).json({ error: 'Failed to assign students to assignment' });
    }

    res.json({ message: 'Students assigned to assignment successfully' });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/assignments/:id/answer-key - Upload or replace answer key for an assignment
router.post('/:id/answer-key', authenticateUser, upload.single('answerKey'), async (req, res) => {
  try {
    const assignmentId = req.params.id;
    const file = req.file;
    const { subject, grade } = req.body;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    // Upload file to Supabase storage
    const fileName = `answer-keys/${Date.now()}-${file.originalname}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('assignments')
      .upload(fileName, require('fs').createReadStream(file.path), {
        contentType: file.mimetype
      });
    if (uploadError) {
      console.error('Error uploading answer key:', uploadError);
      return res.status(500).json({ error: 'Failed to upload answer key file' });
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('assignments')
      .getPublicUrl(fileName);

    // Create answer key record
    const { data: answerKeyData, error: answerKeyError } = await supabase
      .from('answer_keys')
      .insert([{
        file_url: urlData.publicUrl,
        file_name: file.originalname,
        subject: subject,
        grade: grade,
        uploader_id: req.user.id
      }])
      .select()
      .single();
    if (answerKeyError) {
      console.error('Error creating answer key record:', answerKeyError);
      return res.status(500).json({ error: 'Failed to create answer key record' });
    }

    // Update assignment with new answer_key_id
    const { error: updateError } = await supabase
      .from('assignments')
      .update({ answer_key_id: answerKeyData.id })
      .eq('id', assignmentId);
    if (updateError) {
      console.error('Error updating assignment with answer key:', updateError);
      return res.status(500).json({ error: 'Failed to update assignment with answer key' });
    }

    res.status(201).json({ message: 'Answer key uploaded and assignment updated', answerKey: answerKeyData });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/assignments/:assignmentId/students/:studentId/worksheet
router.post('/:assignmentId/students/:studentId/worksheet', authenticateUser, upload.single('file'), async (req, res) => {
  try {
    const { assignmentId, studentId } = req.params;
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    // Upload file to Supabase storage
    const fileName = `worksheets/${studentId}/${Date.now()}-${file.originalname}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('worksheets')
      .upload(fileName, require('fs').createReadStream(file.path), {
        contentType: file.mimetype
      });
    if (uploadError) {
      return res.status(500).json({ error: 'Failed to upload worksheet file' });
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('worksheets')
      .getPublicUrl(fileName);

    // Get answer key URL for this assignment
    const { data: assignment } = await supabase
      .from('assignments')
      .select('answer_key_url')
      .eq('id', assignmentId)
      .single();

    // Call OpenAI for analysis
    let aiResult = null;
    if (assignment && assignment.answer_key_url) {
      aiResult = await analyzeWorksheetWithAI({
        worksheetUrl: urlData.publicUrl,
        answerKeyUrl: assignment.answer_key_url
      });
    }

    // Store worksheet record with AI results
    const { data: worksheetData, error: worksheetError } = await supabase
      .from('worksheets')
      .insert([{
        student_id: studentId,
        assignment_id: assignmentId,
        file_url: urlData.publicUrl,
        file_name: file.originalname,
        status: 'completed',
        score: aiResult?.score,
        weak_topics: aiResult?.weakTopics,
        ai_suggestions: aiResult?.suggestions
      }])
      .select()
      .single();

    res.status(201).json({ message: 'Worksheet uploaded and analyzed', worksheet: worksheetData });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/assignments/:assignmentId/students/:studentId/generate-questions
router.post('/:assignmentId/students/:studentId/generate-questions', authenticateUser, async (req, res) => {
  try {
    const { assignmentId, studentId } = req.params;
    // Fetch worksheet to get weak topics
    const { data: worksheet } = await supabase
      .from('worksheets')
      .select('weak_topics')
      .eq('assignment_id', assignmentId)
      .eq('student_id', studentId)
      .single();

    if (!worksheet || !worksheet.weak_topics) {
      return res.status(400).json({ error: 'No weak topics found' });
    }

    // Generate questions
    const questions = await generateQuestionsForWeakTopics(worksheet.weak_topics);

    // Store in Supabase
    await supabase
      .from('generated_questions')
      .insert([{
        assignment_id: assignmentId,
        student_id: studentId,
        questions
      }]);

    res.json({ questions });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/assignments/:assignmentId/students/:studentId/generated-questions
router.get('/:assignmentId/students/:studentId/generated-questions', authenticateUser, async (req, res) => {
  try {
    const { assignmentId, studentId } = req.params;
    const { data, error } = await supabase
      .from('generated_questions')
      .select('questions')
      .eq('assignment_id', assignmentId)
      .eq('student_id', studentId)
      .single();
    if (error && error.code !== 'PGRST116') {
      return res.status(500).json({ error: 'Failed to fetch generated questions' });
    }
    res.json({ questions: data?.questions || [] });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 