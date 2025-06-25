import React, { useState } from 'react';
import { ArrowLeft, Search, Filter, Download, TrendingUp, TrendingDown, Award, AlertTriangle } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { OnboardingData } from './OnboardingPage';
import { Student } from '../App';

interface GradesPageProps {
  onBack: () => void;
  userData?: OnboardingData | null;
  onTabSelect?: (tab: string) => void;
  students: Student[];
  onStudentSelect: (student: Student) => void;
}

export const GradesPage: React.FC<GradesPageProps> = ({ 
  onBack, 
  userData, 
  onTabSelect, 
  students,
  onStudentSelect
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');

  // Mock grade data
  const gradeData = [
    {
      studentId: 1,
      studentName: 'John Tan',
      grade: 'P5',
      subject: 'Math',
      assignments: [
        { name: 'Fractions Quiz', score: 75, maxScore: 100, date: '2024-01-15' },
        { name: 'Algebra Test', score: 68, maxScore: 100, date: '2024-01-10' },
        { name: 'Homework Set 3', score: 85, maxScore: 100, date: '2024-01-08' }
      ],
      average: 76,
      trend: 'up'
    },
    {
      studentId: 2,
      studentName: 'Aisha Lim',
      grade: 'P5',
      subject: 'Math',
      assignments: [
        { name: 'Fractions Quiz', score: 92, maxScore: 100, date: '2024-01-15' },
        { name: 'Algebra Test', score: 88, maxScore: 100, date: '2024-01-10' },
        { name: 'Homework Set 3', score: 95, maxScore: 100, date: '2024-01-08' }
      ],
      average: 92,
      trend: 'up'
    },
    {
      studentId: 3,
      studentName: 'Marcus Wong',
      grade: 'Sec 1',
      subject: 'Math',
      assignments: [
        { name: 'Quadratic Equations', score: 65, maxScore: 100, date: '2024-01-15' },
        { name: 'Linear Functions', score: 72, maxScore: 100, date: '2024-01-10' },
        { name: 'Homework Set 5', score: 78, maxScore: 100, date: '2024-01-08' }
      ],
      average: 72,
      trend: 'down'
    }
  ];

  const filteredGrades = gradeData.filter(item => {
    const matchesSearch = item.studentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = selectedGrade === 'all' || item.grade === selectedGrade;
    const matchesSubject = selectedSubject === 'all' || item.subject === selectedSubject;
    return matchesSearch && matchesGrade && matchesSubject;
  });

  const getGradeColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400';
    if (score >= 80) return 'text-blue-400';
    if (score >= 70) return 'text-amber-400';
    return 'text-red-400';
  };

  const getGradeBg = (score: number) => {
    if (score >= 90) return 'bg-emerald-500/10';
    if (score >= 80) return 'bg-blue-500/10';
    if (score >= 70) return 'bg-amber-500/10';
    return 'bg-red-500/10';
  };

  const handleTabSelect = (tab: string) => {
    if (tab === 'assignments') {
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

  return (
    <div className="flex h-screen bg-black">
      {/* Sidebar */}
      <Sidebar 
        selectedTab="grades" 
        onTabSelect={handleTabSelect}
        userData={userData}
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
            <h1 className="text-xl font-semibold text-white">Grades</h1>
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm rounded-lg transition-colors duration-200">
              <Download size={16} />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-500" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search students..."
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Grade Filter */}
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All Grades</option>
              <option value="P5">P5</option>
              <option value="Sec 1">Sec 1</option>
            </select>

            {/* Subject Filter */}
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All Subjects</option>
              <option value="Math">Math</option>
              <option value="Science">Science</option>
              <option value="English">English</option>
            </select>
          </div>
        </div>

        {/* Grades Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-6">
            {filteredGrades.map((studentGrade) => {
              const student = students.find(s => s.id === studentGrade.studentId);
              
              return (
                <div key={`${studentGrade.studentId}-${studentGrade.subject}`} className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                  {/* Student Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      {student?.avatar ? (
                        <img
                          src={student.avatar}
                          alt={studentGrade.studentName}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                          <span className="text-gray-400 font-medium">
                            {studentGrade.studentName.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      )}
                      
                      <div>
                        <h3 className="text-white font-semibold text-lg">{studentGrade.studentName}</h3>
                        <div className="flex items-center space-x-3">
                          <span className="text-gray-400">{studentGrade.grade} • {studentGrade.subject}</span>
                          <div className="flex items-center space-x-1">
                            {studentGrade.trend === 'up' ? (
                              <TrendingUp size={16} className="text-emerald-400" />
                            ) : (
                              <TrendingDown size={16} className="text-red-400" />
                            )}
                            <span className={`text-sm ${studentGrade.trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
                              {studentGrade.trend === 'up' ? 'Improving' : 'Needs attention'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${getGradeColor(studentGrade.average)}`}>
                        {studentGrade.average}%
                      </div>
                      <div className="text-gray-400 text-sm">Average</div>
                    </div>
                  </div>

                  {/* Assignments */}
                  <div>
                    <h4 className="text-gray-300 font-medium mb-3">Recent Assignments</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {studentGrade.assignments.map((assignment, index) => (
                        <div key={index} className={`p-4 rounded-lg border ${getGradeBg(assignment.score)} border-gray-700`}>
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="text-white font-medium text-sm">{assignment.name}</h5>
                            {assignment.score >= 90 && (
                              <Award size={16} className="text-amber-400" />
                            )}
                            {assignment.score < 70 && (
                              <AlertTriangle size={16} className="text-red-400" />
                            )}
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className={`text-lg font-bold ${getGradeColor(assignment.score)}`}>
                              {assignment.score}/{assignment.maxScore}
                            </span>
                            <span className="text-gray-500 text-xs">{assignment.date}</span>
                          </div>
                          
                          <div className="mt-2 w-full bg-gray-700 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                assignment.score >= 90 ? 'bg-emerald-500' :
                                assignment.score >= 80 ? 'bg-blue-500' :
                                assignment.score >= 70 ? 'bg-amber-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${(assignment.score / assignment.maxScore) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty State */}
          {filteredGrades.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <Award size={24} className="text-gray-500" />
              </div>
              <h3 className="text-white font-medium mb-2">No grades found</h3>
              <p className="text-gray-400 text-center">
                No grades match your current filters. Try adjusting your search criteria.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};