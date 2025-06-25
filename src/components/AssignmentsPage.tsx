import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Plus, Calendar, FileText, Upload, Eye, Edit3, Trash2 } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { OnboardingData } from './OnboardingPage';
import { Student } from '../App';
import * as assignmentService from '../services/assignmentService';
import { uploadStudentWorksheet, uploadAnswerKey } from '../services/assignmentService';

interface AssignmentsPageProps {
  onBack: () => void;
  userData?: OnboardingData | null;
  onTabSelect?: (tab: string) => void;
  students: Student[];
  onStudentSelect: (student: Student) => void;
}

export const AssignmentsPage: React.FC<AssignmentsPageProps> = ({ 
  onBack, 
  userData, 
  onTabSelect, 
  students,
  onStudentSelect
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    subject: '',
    grade: '',
    dueDate: '',
    points: 100,
    studentIds: [] as string[],
    answerKeyFile: null as File | null
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedAssignment, setSelectedAssignment] = useState<any | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [uploadingStudentId, setUploadingStudentId] = useState<string | null>(null);
  const [uploadingAnswerKeyId, setUploadingAnswerKeyId] = useState<string | number | null>(null);

  const subjects = ['Math', 'Science', 'English', 'Chinese', 'History', 'Geography'];
  const grades = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'Sec 1', 'Sec 2', 'Sec 3', 'Sec 4'];

  useEffect(() => {
    fetchAssignments();
  }, []);

  async function fetchAssignments() {
    setLoading(true);
    setError(null);
    try {
      const res = await assignmentService.listAssignments({});
      setAssignments(res.assignments || []);
    } catch (e: any) {
      setError(e.message || 'Failed to fetch assignments');
    } finally {
      setLoading(false);
    }
  }

  const handleCreateAssignment = async () => {
    if (!newAssignment.title || !newAssignment.subject || !newAssignment.grade || !newAssignment.dueDate || newAssignment.studentIds.length === 0) {
      setError('Please fill all required fields and select students.');
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await assignmentService.createAssignment({
        title: newAssignment.title,
        subject: newAssignment.subject,
        grade: newAssignment.grade,
        dueDate: newAssignment.dueDate,
        studentIds: newAssignment.studentIds,
        answerKeyFile: newAssignment.answerKeyFile
      });
      setShowCreateForm(false);
      setNewAssignment({
        title: '', description: '', subject: '', grade: '', dueDate: '', points: 100, studentIds: [], answerKeyFile: null
      });
      setSuccess('Assignment created successfully!');
      fetchAssignments();
      setTimeout(() => setSuccess(null), 3000);
    } catch (e: any) {
      setError(e.message || 'Failed to create assignment');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAssignment = async (assignmentId: string | number) => {
    if (!window.confirm('Are you sure you want to delete this assignment? This action cannot be undone.')) return;
    setLoading(true);
    setError(null);
    try {
      await assignmentService.deleteAssignment(assignmentId);
      setSuccess('Assignment deleted successfully!');
      fetchAssignments();
      setTimeout(() => setSuccess(null), 3000);
    } catch (e: any) {
      setError(e.message || 'Failed to delete assignment');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-emerald-400 bg-emerald-500/10';
      case 'overdue': return 'text-red-400 bg-red-500/10';
      case 'draft': return 'text-gray-400 bg-gray-500/10';
      default: return 'text-gray-400 bg-gray-500/10';
    }
  };

  const getSubmissionProgress = (submissions: number, total: number) => {
    return total > 0 ? (submissions / total) * 100 : 0;
  };

  const handleTabSelect = (tab: string) => {
    if (tab === 'grades') {
      onTabSelect?.(tab);
    } else if (tab === 'reports') {
      onTabSelect?.(tab);
    } else if (tab === 'student-management') {
      onTabSelect?.(tab);
    } else {
      onTabSelect?.(tab);
    }
  };

  const handleNewSession = () => {
    onBack();
  };

  const openAssignmentDetails = (assignment: any) => {
    setSelectedAssignment(assignment);
    setShowDetailsModal(true);
  };

  const closeAssignmentDetails = () => {
    setShowDetailsModal(false);
    setSelectedAssignment(null);
  };

  return (
    <div className="flex h-screen bg-black">
      {/* Sidebar */}
      <Sidebar 
        selectedTab="assignments"
        onTabSelect={handleTabSelect}
        userData={userData ?? null}
        onNewSession={handleNewSession}
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
            <h1 className="text-xl font-semibold text-white">Assignments</h1>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-sm rounded-lg transition-all duration-200 shadow-lg"
          >
            <Plus size={16} />
            <span>Create Assignment</span>
          </button>
        </div>

        {/* Assignments List */}
        <div className="flex-1 p-4 overflow-y-auto">
          {loading && <div className="text-gray-400">Loading assignments...</div>}
          {error && <div className="text-red-400 mb-4">{error}</div>}
          {success && <div className="text-emerald-400 mb-4 bg-emerald-500/10 p-3 rounded-lg">{success}</div>}
          <div className="space-y-4">
            {assignments.map((assignment) => (
              <div key={assignment.id} className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:bg-gray-800/50 transition-colors duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-white font-semibold text-lg">{assignment.title}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor('active')}`}>
                        active
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
                      <div className="flex items-center space-x-1">
                        <FileText size={14} />
                        <span>{assignment.subject}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span>{assignment.grade}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar size={14} />
                        <span>Due: {assignment.due_date ? assignment.due_date.split('T')[0] : ''}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    className="p-2 hover:bg-red-700/30 rounded-lg transition-colors duration-200"
                    title="Delete Assignment"
                    onClick={() => handleDeleteAssignment(assignment.id)}
                  >
                    <Trash2 size={18} className="text-red-400" />
                  </button>
                </div>
                <div className="text-gray-400 text-sm mb-2">Submissions</div>
                <div className="w-full h-2 bg-gray-800 rounded-full mb-4">
                  <div className="h-2 bg-emerald-600 rounded-full" style={{ width: '0%' }}></div>
                </div>
                <div className="flex items-center space-x-3 pt-4 border-t border-gray-800">
                  <button
                    className="flex items-center space-x-2 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm rounded-lg transition-colors duration-200"
                    onClick={() => openAssignmentDetails(assignment)}
                  >
                    <span>View Submissions</span>
                  </button>
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
              </div>
            ))}
          </div>
          {/* Empty State */}
          {!loading && assignments.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <FileText size={24} className="text-gray-500" />
              </div>
              <h3 className="text-white font-medium mb-2">No assignments yet</h3>
              <p className="text-gray-400 text-center mb-4">
                Create your first assignment to get started.
              </p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors duration-200"
              >
                <Plus size={16} />
                <span>Create Assignment</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Create Assignment Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-white mb-6">Create New Assignment</h3>
            {error && <div className="text-red-400 mb-2">{error}</div>}
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={newAssignment.title}
                  onChange={(e) => setNewAssignment(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Assignment title"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Description</label>
                <textarea
                  value={newAssignment.description}
                  onChange={(e) => setNewAssignment(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 h-24 resize-none"
                  placeholder="Assignment description and instructions"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Subject</label>
                  <select
                    value={newAssignment.subject}
                    onChange={(e) => setNewAssignment(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">Select subject</option>
                    {subjects.map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Grade</label>
                  <select
                    value={newAssignment.grade}
                    onChange={(e) => setNewAssignment(prev => ({ ...prev, grade: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">Select grade</option>
                    {grades.map(grade => (
                      <option key={grade} value={grade}>{grade}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Due Date</label>
                  <input
                    type="date"
                    value={newAssignment.dueDate}
                    onChange={(e) => setNewAssignment(prev => ({ ...prev, dueDate: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Points</label>
                  <input
                    type="number"
                    value={newAssignment.points}
                    onChange={(e) => setNewAssignment(prev => ({ ...prev, points: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    min="1"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Assign to Students</label>
                <select
                  multiple
                  value={newAssignment.studentIds}
                  onChange={e => {
                    const options = Array.from(e.target.selectedOptions).map(opt => opt.value);
                    setNewAssignment(prev => ({ ...prev, studentIds: options }));
                  }}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 h-32"
                >
                  {students.map(student => (
                    <option key={student.id} value={student.id}>{student.name} ({student.grade})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Upload Answer Key</label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  ref={fileInputRef}
                  onChange={e => {
                    const file = e.target.files?.[0] || null;
                    setNewAssignment(prev => ({ ...prev, answerKeyFile: file }));
                  }}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                {newAssignment.answerKeyFile && (
                  <div className="text-gray-400 text-sm mt-2">Selected: {newAssignment.answerKeyFile.name}</div>
                )}
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowCreateForm(false)}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateAssignment}
                className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors duration-200"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Assignment'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assignment Details Modal */}
      {showDetailsModal && selectedAssignment && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto relative">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
              onClick={closeAssignmentDetails}
            >
              &times;
            </button>
            <h3 className="text-lg font-semibold text-white mb-4">Assignment Details</h3>
            <div className="mb-4">
              <div className="text-white font-bold text-xl mb-1">{selectedAssignment.title}</div>
              <div className="text-gray-400 text-sm mb-1">Subject: {selectedAssignment.subject}</div>
              <div className="text-gray-400 text-sm mb-1">Grade: {selectedAssignment.grade}</div>
              <div className="text-gray-400 text-sm mb-1">Due: {selectedAssignment.due_date ? selectedAssignment.due_date.split('T')[0] : ''}</div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-2">Assigned Students</h4>
              {selectedAssignment.students && selectedAssignment.students.length > 0 ? (
                <ul className="divide-y divide-gray-800">
                  {selectedAssignment.students.map((student: any) => (
                    <li key={student.id} className="py-2 flex items-center justify-between">
                      <div>
                        <span className="text-gray-200 font-medium cursor-pointer hover:underline" onClick={() => onStudentSelect(student)}>{student.name}</span>
                        <span className="ml-2 text-gray-400 text-xs">({student.grade})</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {student.worksheet ? (
                          <>
                            <a
                              href={student.worksheet.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-400 underline text-xs"
                            >
                              Worksheet uploaded
                            </a>
                            <span className="text-gray-400 text-xs">({student.worksheet.status})</span>
                          </>
                        ) : (
                          <>
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                              style={{ display: 'none' }}
                              id={`upload-input-${student.id}`}
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                setUploadingStudentId(student.id);
                                try {
                                  await uploadStudentWorksheet({
                                    assignmentId: selectedAssignment.id,
                                    studentId: student.id,
                                    file
                                  });
                                  // Refresh assignments to update modal
                                  await fetchAssignments();
                                  // Reopen modal with updated assignment
                                  const updated = assignments.find(a => a.id === selectedAssignment.id);
                                  setSelectedAssignment(updated);
                                } catch (err) {
                                  alert('Failed to upload worksheet');
                                } finally {
                                  setUploadingStudentId(null);
                                }
                              }}
                            />
                            <label htmlFor={`upload-input-${student.id}`}
                              className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs rounded cursor-pointer transition-colors duration-200"
                              style={{ opacity: uploadingStudentId === student.id ? 0.6 : 1 }}
                            >
                              {uploadingStudentId === student.id ? 'Uploading...' : 'Upload Worksheet'}
                            </label>
                          </>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-gray-400">No students assigned.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};