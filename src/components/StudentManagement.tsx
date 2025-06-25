import React, { useState } from 'react';
import { Plus, Search, Users, BookOpen, AlertTriangle, Clock, User, ChevronDown, ChevronRight, X, RefreshCw } from 'lucide-react';
import { Student } from '../App';
import { OnboardingData } from './OnboardingPage';
import { CreateStudentData } from '../services/studentService';

interface StudentManagementProps {
  students: Student[];
  studentsLoading?: boolean;
  studentsError?: string | null;
  onStudentSelect: (student: Student) => void;
  onAddStudent: (student: CreateStudentData) => Promise<Student>;
  userData: OnboardingData | null;
  showAddStudentModal: boolean;
  onCloseAddStudentModal: () => void;
  onAddStudentComplete: (student: CreateStudentData) => Promise<void>;
  onOpenAddStudentModal: () => void;
  onRefreshStudents?: () => Promise<void>;
}

export const StudentManagement: React.FC<StudentManagementProps> = ({
  students,
  studentsLoading = false,
  studentsError = null,
  onStudentSelect,
  onAddStudent,
  userData,
  showAddStudentModal,
  onCloseAddStudentModal,
  onAddStudentComplete,
  onOpenAddStudentModal,
  onRefreshStudents
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedGrades, setExpandedGrades] = useState<string[]>(['P5', 'Sec 1']);
  const [newStudent, setNewStudent] = useState({
    name: '',
    grade: '',
    subjects: [] as string[],
    weakTopics: [] as string[]
  });

  const grades = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'Sec 1', 'Sec 2', 'Sec 3', 'Sec 4'];
  const subjects = ['Math', 'Science', 'English', 'Chinese', 'History', 'Geography', 'Physics', 'Chemistry', 'Biology'];

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.grade.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.subjects.some(subject => subject.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const studentsByGrade = filteredStudents.reduce((acc, student) => {
    if (!acc[student.grade]) {
      acc[student.grade] = [];
    }
    acc[student.grade].push(student);
    return acc;
  }, {} as Record<string, Student[]>);

  const toggleGrade = (grade: string) => {
    setExpandedGrades(prev =>
      prev.includes(grade)
        ? prev.filter(g => g !== grade)
        : [...prev, grade]
    );
  };

  const handleAddStudent = async () => {
    if (newStudent.name && newStudent.grade && newStudent.subjects.length > 0) {
      try {
        await onAddStudentComplete(newStudent);
        setNewStudent({
          name: '',
          grade: '',
          subjects: [],
          weakTopics: []
        });
      } catch (error) {
        console.error('Failed to add student:', error);
        // You might want to show an error message to the user here
      }
    }
  };

  const toggleSubject = (subject: string) => {
    setNewStudent(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject]
    }));
  };

  const getStudentStats = () => {
    const totalStudents = students.length;
    const gradesCount = Object.keys(studentsByGrade).length;
    const studentsWithWeakTopics = students.filter(s => s.weakTopics.length > 0).length;
    
    return { totalStudents, gradesCount, studentsWithWeakTopics };
  };

  const stats = getStudentStats();

  // Loading state
  if (studentsLoading) {
    return (
      <div className="flex-1 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading students...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (studentsError) {
    return (
      <div className="flex-1 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4 mx-auto">
              <AlertTriangle size={24} className="text-red-400" />
            </div>
            <h3 className="text-white font-medium mb-2">Failed to load students</h3>
            <p className="text-gray-400 text-center mb-4">
              {studentsError}
            </p>
            {onRefreshStudents && (
              <button
                onClick={onRefreshStudents}
                className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors duration-200 mx-auto"
              >
                <RefreshCw size={16} />
                <span>Try Again</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Student Management</h1>
          <p className="text-gray-400">Upload worksheets, track progress, and generate AI questions for your students</p>
        </div>
        <div className="flex items-center space-x-3">
          {onRefreshStudents && (
            <button
              onClick={onRefreshStudents}
              className="flex items-center space-x-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors duration-200"
            >
              <RefreshCw size={16} />
              <span>Refresh</span>
            </button>
          )}
          <button
            onClick={onOpenAddStudentModal}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-200 shadow-lg"
          >
            <Plus size={18} />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <Users size={24} className="text-blue-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{stats.totalStudents}</div>
              <div className="text-gray-400 text-sm">Total Students</div>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-500/10 rounded-lg">
              <BookOpen size={24} className="text-green-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{stats.gradesCount}</div>
              <div className="text-gray-400 text-sm">Active Grades</div>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-orange-500/10 rounded-lg">
              <AlertTriangle size={24} className="text-orange-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{stats.studentsWithWeakTopics}</div>
              <div className="text-gray-400 text-sm">Need Attention</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-500" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search students by name, grade, or subject..."
          className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Students by Grade */}
      <div className="space-y-4">
        {Object.entries(studentsByGrade).map(([grade, gradeStudents]) => (
          <div key={grade} className="bg-gray-900 border border-gray-800 rounded-lg">
            <button
              onClick={() => toggleGrade(grade)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-800/50 transition-colors duration-200"
            >
              <div className="flex items-center space-x-3">
                {expandedGrades.includes(grade) ? (
                  <ChevronDown size={20} className="text-gray-400" />
                ) : (
                  <ChevronRight size={20} className="text-gray-400" />
                )}
                <h3 className="text-lg font-semibold text-white">{grade}</h3>
                <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-sm rounded-full">
                  {gradeStudents.length} students
                </span>
              </div>
            </button>

            {expandedGrades.includes(grade) && (
              <div className="border-t border-gray-800">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                  {gradeStudents.map((student) => (
                    <div
                      key={student.id}
                      onClick={() => onStudentSelect(student)}
                      className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 hover:bg-gray-700/50 cursor-pointer transition-all duration-200 hover:border-blue-500/30"
                    >
                      <div className="flex items-start space-x-3">
                        {student.avatar ? (
                          <img
                            src={student.avatar}
                            alt={student.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                            <User size={20} className="text-gray-400" />
                          </div>
                        )}
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-medium truncate">{student.name}</h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <Clock size={12} className="text-gray-500" />
                            <span className="text-gray-500 text-xs">{student.lastActivity}</span>
                          </div>
                          
                          <div className="mt-2">
                            <div className="flex flex-wrap gap-1">
                              {student.subjects.slice(0, 2).map((subject) => (
                                <span
                                  key={subject}
                                  className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded"
                                >
                                  {subject}
                                </span>
                              ))}
                              {student.subjects.length > 2 && (
                                <span className="px-2 py-1 bg-gray-700 text-gray-400 text-xs rounded">
                                  +{student.subjects.length - 2}
                                </span>
                              )}
                            </div>
                          </div>

                          {student.weakTopics.length > 0 && (
                            <div className="mt-2 flex items-center space-x-1">
                              <AlertTriangle size={12} className="text-orange-400" />
                              <span className="text-orange-400 text-xs">
                                {student.weakTopics.length} weak topic{student.weakTopics.length !== 1 ? 's' : ''}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Student Modal */}
      {showAddStudentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Add New Student</h3>
              <button
                onClick={onCloseAddStudentModal}
                className="p-1 hover:bg-gray-700 rounded transition-colors duration-200"
              >
                <X size={16} className="text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  value={newStudent.name}
                  onChange={(e) => setNewStudent(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Student name"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Grade</label>
                <select
                  value={newStudent.grade}
                  onChange={(e) => setNewStudent(prev => ({ ...prev, grade: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select grade</option>
                  {grades.map(grade => (
                    <option key={grade} value={grade}>{grade}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Subjects</label>
                <div className="grid grid-cols-2 gap-2">
                  {subjects.map(subject => (
                    <button
                      key={subject}
                      onClick={() => toggleSubject(subject)}
                      className={`px-3 py-2 text-sm rounded-lg border transition-colors duration-200 ${
                        newStudent.subjects.includes(subject)
                          ? 'bg-blue-500/20 border-blue-500 text-blue-400'
                          : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                      }`}
                    >
                      {subject}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={onCloseAddStudentModal}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleAddStudent}
                disabled={!newStudent.name || !newStudent.grade || newStudent.subjects.length === 0}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200"
              >
                Add Student
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {students.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <Users size={24} className="text-gray-500" />
          </div>
          <h3 className="text-white font-medium mb-2">No students yet</h3>
          <p className="text-gray-400 text-center mb-4">
            Add your first student to start tutoring and worksheet analysis.
          </p>
          <button
            onClick={onOpenAddStudentModal}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
          >
            <Plus size={16} />
            <span>Add Student</span>
          </button>
        </div>
      )}
    </div>
  );
};