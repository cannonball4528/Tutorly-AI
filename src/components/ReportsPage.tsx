import React from 'react';
import { ArrowLeft, Download, TrendingUp, Users, BookOpen, Award, AlertTriangle, Clock } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { OnboardingData } from './OnboardingPage';
import { Student } from '../App';

interface ReportsPageProps {
  onBack: () => void;
  userData?: OnboardingData | null;
  onTabSelect?: (tab: string) => void;
  students: Student[];
  onStudentSelect: (student: Student) => void;
}

export const ReportsPage: React.FC<ReportsPageProps> = ({ 
  onBack, 
  userData, 
  onTabSelect, 
  students,
  onStudentSelect
}) => {
  // Mock report data
  const classOverview = {
    totalStudents: students.length,
    averageGrade: 78.5,
    assignmentsCompleted: 156,
    improvementRate: 12.3
  };

  const subjectPerformance = [
    { subject: 'Math', average: 76.2, students: 15, trend: 'up', change: 5.2 },
    { subject: 'Science', average: 82.1, students: 12, trend: 'up', change: 3.8 },
    { subject: 'English', average: 79.8, students: 18, trend: 'down', change: -2.1 },
    { subject: 'History', average: 74.5, students: 8, trend: 'up', change: 7.3 }
  ];

  const topPerformers = [
    { name: 'Aisha Lim', grade: 'P5', average: 92.3, improvement: 8.5 },
    { name: 'Sarah Chen', grade: 'Sec 1', average: 89.7, improvement: 6.2 },
    { name: 'David Wong', grade: 'P5', average: 87.4, improvement: 4.8 }
  ];

  const needsAttention = [
    { name: 'John Tan', grade: 'P5', average: 65.2, decline: -5.3, weakTopics: ['Fractions', 'Algebra'] },
    { name: 'Marcus Wong', grade: 'Sec 1', average: 68.9, decline: -3.1, weakTopics: ['Quadratic Equations'] }
  ];

  const weeklyProgress = [
    { week: 'Week 1', completed: 12, total: 15 },
    { week: 'Week 2', completed: 14, total: 15 },
    { week: 'Week 3', completed: 13, total: 15 },
    { week: 'Week 4', completed: 15, total: 15 }
  ];

  const handleTabSelect = (tab: string) => {
    if (tab === 'grades') {
      onTabSelect?.(tab);
    } else if (tab === 'assignments') {
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

  const handleExportReport = () => {
    console.log('Exporting class report...');
    alert('Class report exported successfully!');
  };

  return (
    <div className="flex h-screen bg-black">
      {/* Sidebar */}
      <Sidebar 
        selectedTab="reports" 
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
            <h1 className="text-xl font-semibold text-white">Class Reports</h1>
          </div>
          
          <button
            onClick={handleExportReport}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors duration-200"
          >
            <Download size={16} />
            <span>Export Report</span>
          </button>
        </div>

        {/* Reports Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-6">
            {/* Class Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-3 bg-blue-500/10 rounded-lg">
                    <Users size={24} className="text-blue-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{classOverview.totalStudents}</div>
                    <div className="text-gray-400 text-sm">Total Students</div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-3 bg-green-500/10 rounded-lg">
                    <Award size={24} className="text-green-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{classOverview.averageGrade}%</div>
                    <div className="text-gray-400 text-sm">Class Average</div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-3 bg-purple-500/10 rounded-lg">
                    <BookOpen size={24} className="text-purple-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{classOverview.assignmentsCompleted}</div>
                    <div className="text-gray-400 text-sm">Assignments Completed</div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-3 bg-orange-500/10 rounded-lg">
                    <TrendingUp size={24} className="text-orange-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">+{classOverview.improvementRate}%</div>
                    <div className="text-gray-400 text-sm">Improvement Rate</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Subject Performance */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h3 className="text-white font-semibold text-lg mb-6">Subject Performance</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {subjectPerformance.map((subject) => (
                  <div key={subject.subject} className="bg-gray-800/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-white font-medium">{subject.subject}</h4>
                      <div className={`flex items-center space-x-1 ${
                        subject.trend === 'up' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        <TrendingUp size={16} className={subject.trend === 'up' ? '' : 'rotate-180'} />
                        <span className="text-sm">{subject.change > 0 ? '+' : ''}{subject.change}%</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400 text-sm">{subject.students} students</span>
                      <span className="text-white font-semibold">{subject.average}%</span>
                    </div>
                    
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          subject.average >= 80 ? 'bg-green-500' :
                          subject.average >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${subject.average}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Performers */}
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                <h3 className="text-white font-semibold text-lg mb-6">Top Performers</h3>
                
                <div className="space-y-4">
                  {topPerformers.map((student, index) => (
                    <div key={student.name} className="flex items-center space-x-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      
                      <div className="flex-1">
                        <div className="text-white font-medium">{student.name}</div>
                        <div className="text-green-400 text-sm">{student.grade}</div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-white font-semibold">{student.average}%</div>
                        <div className="text-green-400 text-sm">+{student.improvement}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Needs Attention */}
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                <h3 className="text-white font-semibold text-lg mb-6">Needs Attention</h3>
                
                <div className="space-y-4">
                  {needsAttention.map((student) => (
                    <div key={student.name} className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="text-white font-medium">{student.name}</div>
                          <div className="text-red-400 text-sm">{student.grade}</div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-white font-semibold">{student.average}%</div>
                          <div className="text-red-400 text-sm">{student.decline}%</div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-gray-400 text-xs mb-2">Weak Topics:</div>
                        <div className="flex flex-wrap gap-1">
                          {student.weakTopics.map(topic => (
                            <span key={topic} className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded">
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Weekly Progress */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h3 className="text-white font-semibold text-lg mb-6">Weekly Assignment Completion</h3>
              
              <div className="grid grid-cols-4 gap-4">
                {weeklyProgress.map((week) => (
                  <div key={week.week} className="text-center">
                    <div className="text-gray-400 text-sm mb-2">{week.week}</div>
                    <div className="relative w-16 h-16 mx-auto mb-2">
                      <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#374151"
                          strokeWidth="2"
                        />
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#3B82F6"
                          strokeWidth="2"
                          strokeDasharray={`${(week.completed / week.total) * 100}, 100`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-white text-xs font-semibold">
                          {Math.round((week.completed / week.total) * 100)}%
                        </span>
                      </div>
                    </div>
                    <div className="text-gray-300 text-sm">
                      {week.completed}/{week.total}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};