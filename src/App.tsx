import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthPage } from './components/AuthPage';
import { SignUpPage } from './components/SignUpPage';
import { Dashboard } from './components/Dashboard';
import { StudentChatPage } from './components/StudentChatPage';
import { GradesPage } from './components/GradesPage';
import { AssignmentsPage } from './components/AssignmentsPage';
import { ReportsPage } from './components/ReportsPage';
import { StudentProfilePage } from './components/StudentProfilePage';
import { studentService, CreateStudentData } from './services/studentService';
import './index.css';

const API_BASE_URL = 'http://localhost:3001/api';

export interface Student {
  id: number;
  name: string;
  grade: string;
  subjects: string[];
  weakTopics: string[];
  lastActivity: string;
  avatar?: string;
}

export interface ChatMessage {
  id: number;
  studentId: number;
  message: string;
  isTeacher: boolean;
  timestamp: string;
  topic?: string;
  isMarked?: boolean;
  grade?: string;
  feedback?: string;
}

function AppContent() {
  const { user, loading, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState<'login' | 'signup' | 'dashboard' | 'student-chat' | 'grades' | 'assignments' | 'reports' | 'student-profile'>('login');
  const [signUpData, setSignUpData] = useState<{ email: string; password: string } | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [studentsError, setStudentsError] = useState<string | null>(null);

  // Load students when user is authenticated
  useEffect(() => {
    if (user) {
      loadStudents();
    }
  }, [user]);

  const loadStudents = async () => {
    setStudentsLoading(true);
    setStudentsError(null);
    try {
      const fetchedStudents = await studentService.getAllStudents();
      setStudents(fetchedStudents);
    } catch (error) {
      console.error('Failed to load students:', error);
      setStudentsError(error instanceof Error ? error.message : 'Failed to load students');
    } finally {
      setStudentsLoading(false);
    }
  };

  // Show loading screen while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is authenticated, show dashboard
  if (user) {
    if (currentPage === 'login' || currentPage === 'signup') {
      setCurrentPage('dashboard');
    }
  }

  const handleSignUpClick = () => {
    setCurrentPage('signup');
  };

  const handleSignUpComplete = (data: { email: string; password: string }) => {
    setSignUpData(data);
    setCurrentPage('dashboard');
  };

  const handleBackToLogin = () => {
    setCurrentPage('login');
  };

  const handleLogin = () => {
    setCurrentPage('dashboard');
  };

  const handleLogout = async () => {
    await logout();
    setCurrentPage('login');
    setSignUpData(null);
    setStudents([]);
  };

  // This function is for starting a chat session with a student (from sidebar)
  const handleStudentChatSelect = (student: Student) => {
    setSelectedStudent(student);
    setCurrentPage('student-chat');
  };

  // This function is for viewing a student's profile/worksheet analysis (from main dashboard)
  const handleStudentProfileSelect = (student: Student) => {
    setSelectedStudent(student);
    setCurrentPage('student-profile');
  };

  const handleBackToDashboard = () => {
    setCurrentPage('dashboard');
    setSelectedStudent(null);
  };

  const handleNavigateToGrades = () => {
    setCurrentPage('grades');
  };

  const handleNavigateToAssignments = () => {
    setCurrentPage('assignments');
  };

  const handleNavigateToReports = () => {
    setCurrentPage('reports');
  };

  const handleAddStudent = async (studentData: CreateStudentData) => {
    try {
      const newStudent = await studentService.createStudent(studentData);
      setStudents(prev => [newStudent, ...prev]);
      return newStudent;
    } catch (error) {
      console.error('Failed to add student:', error);
      throw error;
    }
  };

  // Universal tab navigation handler
  const handleTabNavigation = (tab: string) => {
    switch (tab) {
      case 'grades':
        setCurrentPage('grades');
        break;
      case 'assignments':
        setCurrentPage('assignments');
        break;
      case 'reports':
        setCurrentPage('reports');
        break;
      case 'dashboard':
      case 'student-management':
        setCurrentPage('dashboard');
        break;
      default:
        break;
    }
  };

  // If user is not authenticated, show auth pages
  if (!user) {
    if (currentPage === 'signup') {
      return <SignUpPage onComplete={handleSignUpComplete} onBack={handleBackToLogin} />;
    }
    return <AuthPage onSignUp={handleSignUpClick} onLogin={handleLogin} />;
  }

  // User is authenticated - show main app
  if (currentPage === 'student-chat' && selectedStudent) {
    return (
      <StudentChatPage
        student={selectedStudent}
        userData={null}
        onBack={handleBackToDashboard}
        students={students}
        onStudentSelect={handleStudentChatSelect}
      />
    );
  }

  if (currentPage === 'grades') {
    return (
      <GradesPage 
        onBack={handleBackToDashboard} 
        userData={null}
        onTabSelect={handleTabNavigation}
        students={students}
        onStudentSelect={handleStudentProfileSelect}
      />
    );
  }

  if (currentPage === 'assignments') {
    return (
      <AssignmentsPage 
        onBack={handleBackToDashboard}
        userData={null}
        onTabSelect={handleTabNavigation}
        students={students}
        onStudentSelect={handleStudentProfileSelect}
      />
    );
  }

  if (currentPage === 'reports') {
    return (
      <ReportsPage 
        onBack={handleBackToDashboard}
        userData={null}
        onTabSelect={handleTabNavigation}
        students={students}
        onStudentSelect={handleStudentProfileSelect}
      />
    );
  }

  if (currentPage === 'student-profile' && selectedStudent) {
    return (
      <StudentProfilePage 
        student={selectedStudent}
        onBack={handleBackToDashboard}
        userData={null}
        onTabSelect={handleTabNavigation}
        students={students}
        onStudentSelect={handleStudentProfileSelect}
      />
    );
  }

  if (currentPage === 'dashboard') {
    return (
      <Dashboard 
        userData={null} 
        students={students}
        studentsLoading={studentsLoading}
        studentsError={studentsError}
        onStudentSelect={handleStudentProfileSelect}
        onAddStudent={handleAddStudent}
        onNavigateToGrades={handleNavigateToGrades}
        onNavigateToAssignments={handleNavigateToAssignments}
        onNavigateToReports={handleNavigateToReports}
        onRefreshStudents={loadStudents}
      />
    );
  }

  // Default fallback
  return <AuthPage onSignUp={handleSignUpClick} onLogin={handleLogin} />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;