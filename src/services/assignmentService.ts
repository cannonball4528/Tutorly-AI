const API_BASE_URL = 'http://localhost:3001/api/assignments';

function getAuthHeaders() {
  const token = localStorage.getItem('access_token');
  return {
    'Authorization': `Bearer ${token}`
  };
}

export interface CreateAssignmentParams {
  title: string;
  subject: string;
  grade: string;
  dueDate: string;
  studentIds: string[];
  answerKeyFile: File | null;
}

export async function createAssignment({ title, subject, grade, dueDate, studentIds, answerKeyFile }: CreateAssignmentParams) {
  const formData = new FormData();
  formData.append('title', title);
  formData.append('subject', subject);
  formData.append('grade', grade);
  formData.append('dueDate', dueDate);
  formData.append('studentIds', JSON.stringify(studentIds));
  if (answerKeyFile) {
    formData.append('answerKey', answerKeyFile);
  }

  const response = await fetch(`${API_BASE_URL}`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: formData
  });
  if (!response.ok) throw new Error((await response.json()).message || 'Failed to create assignment');
  return response.json();
}

export interface ListAssignmentsParams {
  grade?: string;
  subject?: string;
}

export async function listAssignments({ grade, subject }: ListAssignmentsParams = {}) {
  const params = new URLSearchParams();
  if (grade) params.append('grade', grade);
  if (subject) params.append('subject', subject);
  const response = await fetch(`${API_BASE_URL}?${params.toString()}`, {
    headers: getAuthHeaders()
  });
  if (!response.ok) throw new Error((await response.json()).message || 'Failed to fetch assignments');
  const data = await response.json();
  return data;
}

export async function getAssignmentDetails(assignmentId: string | number) {
  const response = await fetch(`${API_BASE_URL}/${assignmentId}`, {
    headers: getAuthHeaders()
  });
  if (!response.ok) throw new Error((await response.json()).message || 'Failed to fetch assignment details');
  return response.json();
}

export interface UploadStudentWorksheetParams {
  assignmentId: string | number;
  studentId: string | number;
  file: File;
}

export async function uploadStudentWorksheet({ assignmentId, studentId, file }: UploadStudentWorksheetParams) {
  const formData = new FormData();
  formData.append('file', file);
  const response = await fetch(`${API_BASE_URL}/${assignmentId}/students/${studentId}/worksheet`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: formData
  });
  if (!response.ok) throw new Error((await response.json()).message || 'Failed to upload worksheet');
  return response.json();
}

export interface GetStudentWorksheetParams {
  assignmentId: string | number;
  studentId: string | number;
}

export async function getStudentWorksheet({ assignmentId, studentId }: GetStudentWorksheetParams) {
  const response = await fetch(`${API_BASE_URL}/${assignmentId}/students/${studentId}/worksheet`, {
    headers: getAuthHeaders()
  });
  if (!response.ok) throw new Error((await response.json()).message || 'Failed to fetch worksheet');
  return response.json();
}

export async function deleteAssignment(assignmentId: string | number) {
  const response = await fetch(`${API_BASE_URL}/${assignmentId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error((await response.json()).message || 'Failed to delete assignment');
  return response.json();
}

export async function uploadAnswerKey({ assignmentId, file, subject, grade }: { assignmentId: string | number, file: File, subject?: string, grade?: string }) {
  const formData = new FormData();
  formData.append('answerKey', file);
  if (subject) formData.append('subject', subject);
  if (grade) formData.append('grade', grade);
  const response = await fetch(`${API_BASE_URL}/${assignmentId}/answer-key`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: formData
  });
  if (!response.ok) throw new Error((await response.json()).message || 'Failed to upload answer key');
  return response.json();
}

export async function getGeneratedQuestions({ assignmentId, studentId }: { assignmentId: string | number, studentId: string | number }) {
  const response = await fetch(`${API_BASE_URL}/${assignmentId}/students/${studentId}/generated-questions`, {
    headers: getAuthHeaders()
  });
  if (!response.ok) throw new Error((await response.json()).message || 'Failed to fetch generated questions');
  return response.json();
}

export async function generateQuestionsForWeakTopics({ assignmentId, studentId }: { assignmentId: string | number, studentId: string | number }) {
  const response = await fetch(`${API_BASE_URL}/${assignmentId}/students/${studentId}/generate-questions`, {
    method: 'POST',
    headers: getAuthHeaders()
  });
  if (!response.ok) throw new Error((await response.json()).message || 'Failed to generate questions');
  return response.json();
} 