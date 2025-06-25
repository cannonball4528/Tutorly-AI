import React, { useState } from 'react';
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  FileText, 
  ClipboardList, 
  BarChart3, 
  UserPlus,
  ChevronRight,
  ChevronDown,
  User,
  Brain,
  LogOut
} from 'lucide-react';
import { OnboardingData } from './OnboardingPage';
import { Student } from '../App';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  selectedTab: string;
  onTabSelect: (tab: string) => void;
  userData: OnboardingData | null;
  students: Student[];
  onStudentSelect: (student: Student) => void;
  onAddStudent?: () => void;
  onNewSession?: () => void;
  onNewChat?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  selectedTab, 
  onTabSelect, 
  userData, 
  students = [], // Default to empty array to prevent undefined errors
  onStudentSelect,
  onAddStudent,
  onNewSession,
  onNewChat
}) => {
  const { logout } = useAuth();
  const [expandedSections, setExpandedSections] = useState<string[]>(['student-management', 'class-tools']);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Group students by grade - with safety check
  const studentsByGrade = students.reduce((acc, student) => {
    if (!acc[student.grade]) {
      acc[student.grade] = [];
    }
    acc[student.grade].push(student);
    return acc;
  }, {} as Record<string, Student[]>);

  const navigationSections = [
    {
      id: 'student-management',
      label: 'Student Management',
      icon: Users,
      children: [
        { id: 'student-management', label: 'All Students', icon: GraduationCap }
      ]
    },
    {
      id: 'class-tools',
      label: 'Tutoring Tools',
      icon: BookOpen,
      children: [
        { id: 'grades', label: 'Grades & Progress', icon: FileText },
        { id: 'assignments', label: 'Worksheets', icon: ClipboardList },
        { id: 'reports', label: 'Reports', icon: BarChart3 }
      ]
    }
  ];

  return (
    <div className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center space-x-3 mb-4">
          <div className="relative">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
              <GraduationCap size={16} className="text-white" />
            </div>
            <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <Brain size={6} className="text-white" />
            </div>
          </div>
          <span className="text-white font-semibold text-lg">Tutorly AI</span>
        </div>
        
        <div className="bg-gray-800/50 rounded-lg p-3 mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            <span className="text-gray-300 text-sm font-medium">
              {userData?.name || 'Tutor'}'s Dashboard
            </span>
          </div>
          <p className="text-gray-500 text-xs mt-1">
            {userData?.businessName || 'Tutoring Center'} • Active
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4 overflow-y-auto">
        <nav className="space-y-1">
          {navigationSections.map((section) => {
            const SectionIcon = section.icon;
            const isExpanded = expandedSections.includes(section.id);
            const hasSelectedChild = section.children?.some(child => selectedTab === child.id);
            
            return (
              <div key={section.id}>
                {/* Section Header */}
                <button
                  onClick={() => toggleSection(section.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                    hasSelectedChild
                      ? 'bg-emerald-600/10 text-emerald-400 border border-emerald-600/20'
                      : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/50'
                  }`}
                >
                  <SectionIcon size={18} className={hasSelectedChild ? 'text-emerald-400' : 'text-gray-500'} />
                  <span className="flex-1 text-left">{section.label}</span>
                  {isExpanded ? (
                    <ChevronDown size={16} className={hasSelectedChild ? 'text-emerald-400' : 'text-gray-500'} />
                  ) : (
                    <ChevronRight size={16} className={hasSelectedChild ? 'text-emerald-400' : 'text-gray-500'} />
                  )}
                </button>

                {/* Section Children */}
                {isExpanded && section.children && (
                  <div className="ml-6 mt-1 space-y-1">
                    {section.children.map((child) => {
                      const ChildIcon = child.icon;
                      const isSelected = selectedTab === child.id;
                      
                      return (
                        <button
                          key={child.id}
                          onClick={() => onTabSelect(child.id)}
                          className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            isSelected
                              ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-600/30'
                              : 'text-gray-500 hover:text-gray-400 hover:bg-gray-800/30'
                          }`}
                        >
                          <ChildIcon size={16} className={isSelected ? 'text-emerald-400' : 'text-gray-600'} />
                          <span className="flex-1 text-left">{child.label}</span>
                          {isSelected && (
                            <ChevronRight size={14} className="text-emerald-400" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {/* Students by Grade */}
          {Object.keys(studentsByGrade).length > 0 && (
            <div className="mt-6">
              <div className="text-gray-400 text-xs font-medium mb-3 px-3">RECENT STUDENTS</div>
              {Object.entries(studentsByGrade).map(([grade, gradeStudents]) => (
                <div key={grade} className="mb-2">
                  <div className="text-gray-500 text-xs font-medium mb-1 px-3">{grade}</div>
                  {gradeStudents.slice(0, 3).map((student) => (
                    <button
                      key={student.id}
                      onClick={() => onStudentSelect(student)}
                      className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-gray-300 hover:bg-gray-800/30 transition-all duration-200"
                    >
                      {student.avatar ? (
                        <img 
                          src={student.avatar} 
                          alt={student.name}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                      ) : (
                        <User size={16} className="text-gray-600" />
                      )}
                      <span className="flex-1 text-left truncate">{student.name}</span>
                    </button>
                  ))}
                  {gradeStudents.length > 3 && (
                    <div className="text-gray-500 text-xs px-3 py-1">
                      +{gradeStudents.length - 3} more
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-gray-800 space-y-2">
        {/* Add Student */}
        {onAddStudent && (
          <button 
            onClick={onAddStudent}
            className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-gray-300 hover:bg-gray-800/50 transition-all duration-200"
          >
            <UserPlus size={18} className="text-gray-500" />
            <span>Add Student</span>
          </button>
        )}

        {/* Logout */}
        <button 
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
        >
          <LogOut size={18} className="text-gray-500" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};