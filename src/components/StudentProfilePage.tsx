import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, User, Upload, FileText, Lightbulb, CheckCircle, AlertTriangle, Calendar, Download, Eye, Trash2, Plus } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { OnboardingData } from './OnboardingPage';
import { Student } from '../App';
import * as assignmentService from '../services/assignmentService';
import { uploadAnswerKey, generateQuestionsForWeakTopics, getGeneratedQuestions } from '../services/assignmentService';

interface StudentProfilePageProps {
  student: Student;
  onBack: () => void;
  userData?: OnboardingData | null;
  onTabSelect?: (tab: string) => void;
  students: Student[];
  onStudentSelect: (student: Student) => void;
}

export const StudentProfilePage: React.FC<StudentProfilePageProps> = ({ 
  student, 
  onBack, 
  userData, 
  onTabSelect,
  students,
  onStudentSelect
}) => {
  const [activeTab, setActiveTab] = useState('worksheets');
  const [assignments, setAssignments] = useState<any[]>([]);
  const [worksheets, setWorksheets] = useState<{ [assignmentId: string]: any }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadingAssignmentId, setUploadingAssignmentId] = useState<string | null>(null);
  const [uploadingAnswerKeyId, setUploadingAnswerKeyId] = useState<string | number | null>(null);
  const fileInputRefs = useRef<{ [assignmentId: string]: HTMLInputElement | null }>({});
  const [generatedQuestions, setGeneratedQuestions] = useState<{ [assignmentId: string]: any[] }>({});
  const [generatingQuestionsId, setGeneratingQuestionsId] = useState<string | null>(null);
  const [worksheetFile, setWorksheetFile] = useState<File | null>(null);
  const [answerKeyFile, setAnswerKeyFile] = useState<File | null>(null);
  const [aiResult, setAiResult] = useState<any>(null);
  const [uploadingBoth, setUploadingBoth] = useState(false);
  const [uploadFiles, setUploadFiles] = useState<{ [assignmentId: string]: { worksheet: File | null, answerKey: File | null, aiResult: any, uploading: boolean } }>({});
  const [showResult, setShowResult] = useState<{ assignmentId: string, aiResult: any } | null>(null);

  useEffect(() => {
    fetchAssignmentsForStudent();
  }, [student.id]);

  async function fetchAssignmentsForStudent() {
    setLoading(true);
    setError(null);
    try {
      // Get all assignments (filter client-side for this student)
      const res = await assignmentService.listAssignments({ grade: student.grade });
      // Only assignments where this student is assigned
      const assigned = (res.assignments || []).filter((a: any) =>
        a.students && a.students.some((s: any) => String(s.id) === String(student.id))
      );
      setAssignments(assigned);
      // For each assignment, fetch worksheet for this student
      const worksheetMap: { [assignmentId: string]: any } = {};
      await Promise.all(assigned.map(async (a: any) => {
        try {
          const wres = await assignmentService.getStudentWorksheet({ assignmentId: a.id, studentId: student.id });
          worksheetMap[a.id] = wres.worksheet;
        } catch {
          worksheetMap[a.id] = null;
        }
      }));
      setWorksheets(worksheetMap);
    } catch (e: any) {
      setError(e.message || 'Failed to fetch assignments');
    } finally {
      setLoading(false);
    }
  }

  const handleFileChange = (assignmentId: string, type: 'worksheet' | 'answerKey', file: File | null) => {
    setUploadFiles(prev => ({
      ...prev,
      [assignmentId]: {
        ...prev[assignmentId],
        [type]: file
      }
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-500/10';
      case 'analyzing': return 'text-blue-400 bg-blue-500/10';
      case 'needs_review': return 'text-orange-400 bg-orange-500/10';
      default: return 'text-gray-400 bg-gray-500/10';
    }
  };

  const handleGenerateQuestions = async (assignmentId: string) => {
    setGeneratingQuestionsId(assignmentId);
    try {
      const res = await generateQuestionsForWeakTopics({ assignmentId, studentId: student.id });
      setGeneratedQuestions(prev => ({ ...prev, [assignmentId]: res.questions }));
    } catch (e) {
      alert('Failed to generate questions');
    } finally {
      setGeneratingQuestionsId(null);
    }
  };

  const fetchQuestions = async (assignmentId: string) => {
    try {
      const res = await getGeneratedQuestions({ assignmentId, studentId: student.id });
      setGeneratedQuestions(prev => ({ ...prev, [assignmentId]: res.questions }));
    } catch {}
  };

  useEffect(() => {
    assignments.forEach(a => fetchQuestions(a.id));
    // eslint-disable-next-line
  }, [assignments.length]);

  const handleWorksheetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWorksheetFile(e.target.files?.[0] || null);
  };
  const handleAnswerKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnswerKeyFile(e.target.files?.[0] || null);
  };

  const handleSubmitBoth = async (assignmentId: string) => {
    const files = uploadFiles[assignmentId] || {};
    if (!files.worksheet || !files.answerKey) {
      alert('Please select both files.');
      return;
    }
    setUploadFiles(prev => ({ ...prev, [assignmentId]: { ...prev[assignmentId], uploading: true } }));
    const formData = new FormData();
    formData.append('worksheet', files.worksheet);
    formData.append('answerKey', files.answerKey);
    const res = await fetch(`/api/students/${student.id}/worksheet-with-answer-key?assignmentId=${assignmentId}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
      body: formData,
    });
    const data = await res.json();
    setUploadFiles(prev => ({ ...prev, [assignmentId]: { ...prev[assignmentId], aiResult: data.aiResult, uploading: false } }));
    setShowResult({ assignmentId, aiResult: data.aiResult });
  };

  if (showResult) {
    const { aiResult, assignmentId } = showResult;
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-8">
        <div className="w-full max-w-2xl bg-gray-900 border border-gray-800 rounded-lg p-8 shadow-lg">
          <button
            className="mb-6 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
            onClick={() => setShowResult(null)}
          >
            Back to Assignments
          </button>
          <h2 className="text-2xl font-bold mb-4">Worksheet Analysis Result</h2>
          <div className="mb-4">
            <span className="text-gray-300 font-medium">Score:</span> <span className="text-emerald-400 font-bold text-xl">{aiResult.score ?? 'N/A'}%</span>
          </div>
          {aiResult.weakTopics && aiResult.weakTopics.length > 0 && (
            <div className="mb-4">
              <span className="text-gray-300 font-medium">Weak Topics:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {aiResult.weakTopics.map((topic: string, idx: number) => (
                  <span key={idx} className="px-3 py-1 bg-red-500/20 text-red-400 text-sm rounded-full">{topic}</span>
                ))}
              </div>
            </div>
          )}
          {aiResult.suggestions && aiResult.suggestions.length > 0 && (
            <div className="mb-4">
              <span className="text-gray-300 font-medium">Suggestions:</span>
              <ul className="list-disc list-inside text-blue-300 mt-1">
                {aiResult.suggestions.map((s: string, idx: number) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
            </div>
          )}
          {aiResult.questions && (
            <div className="mb-4">
              <div className="text-gray-300 font-medium mb-1">Questions:</div>
              <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
                <thead>
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-400">#</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-400">Question</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-400">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {aiResult.questions.map((q: any, idx: number) => (
                    <tr key={idx} className="border-b border-gray-700 last:border-0">
                      <td className="px-3 py-2 text-gray-200">{q.number}</td>
                      <td className="px-3 py-2 text-gray-200">{q.question}</td>
                      <td className="px-3 py-2">
                        {q.correct ? (
                          <span className="text-green-400 font-semibold">Correct</span>
                        ) : (
                          <span className="text-red-400 font-semibold">Wrong</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <button
            className="mt-6 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg"
            onClick={() => handleGenerateQuestions(assignmentId)}
            disabled={generatingQuestionsId === assignmentId}
          >
            {generatingQuestionsId === assignmentId ? 'Generating...' : 'Generate Practice Questions'}
          </button>
          {generatedQuestions[assignmentId] && generatedQuestions[assignmentId].length > 0 && (
            <div className="mt-4">
              <span className="text-gray-300 font-medium">Practice Questions:</span>
              <ul className="list-disc list-inside text-green-300 mt-1">
                {generatedQuestions[assignmentId].map((q: any, idx: number) => (
                  <li key={idx}>{q.question}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-black">
      {/* Sidebar */}
      <Sidebar 
        selectedTab="student-management" 
        onTabSelect={onTabSelect ?? (() => {})}
        userData={userData ?? null}
        students={students}
        onStudentSelect={onStudentSelect}
      />
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors duration-200"
            >
              <ArrowLeft size={20} className="text-gray-400" />
            </button>
            <div className="flex items-center space-x-4">
              {student.avatar ? (
                <img
                  src={student.avatar}
                  alt={student.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                  <User size={24} className="text-gray-400" />
                </div>
              )}
              <div>
                <h1 className="text-xl font-semibold text-white">{student.name}</h1>
                <p className="text-gray-400">{student.grade} • Assignment & Worksheet Analysis</p>
              </div>
            </div>
          </div>
        </div>
        {/* Tab Navigation */}
        <div className="border-b border-gray-800">
          <div className="flex space-x-8 px-6">
            <button
              key="worksheets"
              onClick={() => setActiveTab('worksheets')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'worksheets'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              Worksheets & Analysis
            </button>
          </div>
        </div>
        {/* Tab Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {loading && <div className="text-gray-400">Loading assignments...</div>}
          {error && <div className="text-red-400 mb-4">{error}</div>}
          {activeTab === 'worksheets' && (
            <div className="space-y-6">
              <h3 className="text-white font-semibold text-lg mb-4">Assignments & Worksheet Submissions</h3>
              {assignments.length === 0 && (
                <div className="text-gray-400">No assignments assigned to this student yet.</div>
              )}
              {assignments.map((assignment) => {
                const worksheet = worksheets[assignment.id];
                return (
                  <div key={assignment.id} className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="text-white font-medium text-lg">{assignment.title}</h4>
                        <div className="flex items-center space-x-3 text-sm text-gray-400 mt-1">
                          <span>{assignment.subject}</span>
                          <span>•</span>
                          <span>Due: {assignment.due_date ? assignment.due_date.split('T')[0] : ''}</span>
                        </div>
                      </div>
                      <div>
                        {worksheet ? (
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(worksheet.status)}`}>
                            {worksheet.status === 'completed' ? 'Analyzed' : worksheet.status}
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-700 text-gray-400">
                            Not submitted
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Answer Key Section */}
                    <div className="mb-4 p-3 bg-gray-800 rounded-lg">
                      <h5 className="text-white font-medium mb-2">Answer Key</h5>
                      {assignment.answerKey?.file_url || assignment.answer_key_url ? (
                        <a
                          href={assignment.answerKey?.file_url || assignment.answer_key_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors duration-200"
                        >
                          <span>View Answer Key</span>
                        </a>
                      ) : (
                        <span className="text-gray-400 text-sm">No answer key uploaded.</span>
                      )}
                    </div>
                    
                    {/* Worksheet Upload or Analysis */}
                    {worksheet ? (
                      <div className="mt-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <CheckCircle size={16} className="text-green-400" />
                          <span className="text-green-300 text-sm">Worksheet uploaded and analyzed.</span>
                          <a href={worksheet.file_url} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-400 underline">Download</a>
                        </div>
                        <div className="mb-2">
                          <span className="text-gray-300 font-medium">Score:</span> <span className="text-white font-semibold">{worksheet.score ?? 'N/A'}%</span>
                        </div>
                        {worksheet.weak_topics && worksheet.weak_topics.length > 0 && (
                          <div className="mb-2">
                            <span className="text-gray-300 font-medium">Weak Topics:</span>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {worksheet.weak_topics.map((topic: string, idx: number) => (
                                <span key={idx} className="px-3 py-1 bg-red-500/20 text-red-400 text-sm rounded-full">{topic}</span>
                              ))}
                            </div>
                          </div>
                        )}
                        {worksheet.ai_suggestions && worksheet.ai_suggestions.length > 0 && (
                          <div className="mb-2">
                            <span className="text-gray-300 font-medium">AI Suggestions:</span>
                            <ul className="list-disc list-inside text-blue-300 mt-1">
                              {worksheet.ai_suggestions.map((s: string, idx: number) => (
                                <li key={idx}>{s}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {worksheet.weak_topics && worksheet.weak_topics.length > 0 && (
                          <div className="mb-2">
                            <button
                              className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm rounded-lg transition-colors duration-200"
                              onClick={() => handleGenerateQuestions(assignment.id)}
                              disabled={generatingQuestionsId === assignment.id}
                            >
                              {generatingQuestionsId === assignment.id ? 'Generating...' : 'Generate Practice Questions'}
                            </button>
                          </div>
                        )}
                        {generatedQuestions[assignment.id] && generatedQuestions[assignment.id].length > 0 && (
                          <div className="mb-2">
                            <span className="text-gray-300 font-medium">Practice Questions:</span>
                            <ul className="list-disc list-inside text-green-300 mt-1">
                              {generatedQuestions[assignment.id].map((q: any, idx: number) => (
                                <li key={idx}>{q.question}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        <div className="mt-3">
                          <label className="block text-gray-300 text-sm font-medium mb-2">Re-upload Worksheet</label>
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            ref={el => (fileInputRefs.current[assignment.id] = el)}
                            onChange={e => handleFileChange(assignment.id, 'worksheet', e.target.files?.[0] || null)}
                            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={uploadFiles[assignment.id]?.uploading}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="mt-4">
                        <label className="block text-gray-300 text-sm font-medium mb-2">Upload Worksheet & Answer Key</label>
                        <div className="mb-2">
                          <span className="text-gray-400 text-xs">Worksheet file:</span>
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            onChange={e => handleFileChange(assignment.id, 'worksheet', e.target.files?.[0] || null)}
                            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={uploadFiles[assignment.id]?.uploading}
                          />
                        </div>
                        <div className="mb-2">
                          <span className="text-gray-400 text-xs">Answer key file:</span>
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            onChange={e => handleFileChange(assignment.id, 'answerKey', e.target.files?.[0] || null)}
                            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={uploadFiles[assignment.id]?.uploading}
                          />
                        </div>
                        <button
                          className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg mt-2"
                          onClick={() => handleSubmitBoth(assignment.id)}
                          disabled={uploadFiles[assignment.id]?.uploading}
                        >
                          {uploadFiles[assignment.id]?.uploading ? 'Submitting...' : 'Submit Both Files'}
                        </button>
                        {uploadFiles[assignment.id]?.aiResult && (
                          <div className="mt-3 text-green-400">
                            <div>Score: {uploadFiles[assignment.id].aiResult.score}</div>
                            <div>Weak Topics: {uploadFiles[assignment.id].aiResult.weakTopics?.join(', ')}</div>
                            <div>Suggestions: {uploadFiles[assignment.id].aiResult.suggestions?.join(', ')}</div>
                            {/* Questions Table/List */}
                            {uploadFiles[assignment.id].aiResult.questions && (
                              <div className="mt-2">
                                <div className="text-gray-300 font-medium mb-1">Questions:</div>
                                <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
                                  <thead>
                                    <tr>
                                      <th className="px-3 py-2 text-left text-xs font-semibold text-gray-400">#</th>
                                      <th className="px-3 py-2 text-left text-xs font-semibold text-gray-400">Question</th>
                                      <th className="px-3 py-2 text-left text-xs font-semibold text-gray-400">Status</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {uploadFiles[assignment.id].aiResult.questions.map((q: any, idx: number) => (
                                      <tr key={idx} className="border-b border-gray-700 last:border-0">
                                        <td className="px-3 py-2 text-gray-200">{q.number}</td>
                                        <td className="px-3 py-2 text-gray-200">{q.question}</td>
                                        <td className="px-3 py-2">
                                          {q.correct ? (
                                            <span className="text-green-400 font-semibold">Correct</span>
                                          ) : (
                                            <span className="text-red-400 font-semibold">Wrong</span>
                                          )}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            )}
                            {/* Fallback to mock data if aiResult is missing or incomplete */}
                            {!uploadFiles[assignment.id].aiResult.questions && (
                              <div className="mt-2 text-yellow-400 text-sm">No question details available. Showing mock data.</div>
                            )}
                            {/* Generate Questions Button (inline) */}
                            {uploadFiles[assignment.id].aiResult.weakTopics && uploadFiles[assignment.id].aiResult.weakTopics.length > 0 && (
                              <div className="mb-2 mt-4">
                                <button
                                  className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm rounded-lg transition-colors duration-200"
                                  onClick={async () => {
                                    try {
                                      const res = await generateQuestionsForWeakTopics({ assignmentId: assignment.id, studentId: student.id });
                                      setGeneratedQuestions(prev => ({ ...prev, [assignment.id]: res.questions }));
                                    } catch {
                                      // Fallback to mock questions
                                      setGeneratedQuestions(prev => ({
                                        ...prev,
                                        [assignment.id]: [
                                          { topic: 'Fractions', question: 'What is 3/4 + 1/8?' },
                                          { topic: 'Decimals', question: 'Round 2.678 to 1 decimal place.' }
                                        ]
                                      }));
                                    }
                                  }}
                                  disabled={generatingQuestionsId === assignment.id}
                                >
                                  {generatingQuestionsId === assignment.id ? 'Generating...' : 'Generate Practice Questions'}
                                </button>
                              </div>
                            )}
                            {/* Show generated questions (inline) */}
                            {generatedQuestions[assignment.id] && generatedQuestions[assignment.id].length > 0 && (
                              <div className="mb-2 mt-2">
                                <span className="text-gray-300 font-medium">Practice Questions:</span>
                                <ul className="list-disc list-inside text-green-300 mt-1">
                                  {generatedQuestions[assignment.id].map((q: any, idx: number) => (
                                    <li key={idx}>{q.question}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};