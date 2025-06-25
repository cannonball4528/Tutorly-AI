import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { MainContent } from './MainContent';
import { TeacherInterface } from './TeacherInterface';
import { OnboardingData } from './OnboardingPage';
import { Student } from '../App';
import { CreateStudentData } from '../services/studentService';

interface DashboardProps {
  userData: OnboardingData | null;
  students: Student[];
  studentsLoading?: boolean;
  studentsError?: string | null;
  onStudentSelect: (student: Student) => void;
  onAddStudent: (student: CreateStudentData) => Promise<Student>;
  onNavigateToGrades?: () => void;
  onNavigateToAssignments?: () => void;
  onNavigateToReports?: () => void;
  onRefreshStudents?: () => Promise<void>;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  userData, 
  students,
  studentsLoading = false,
  studentsError = null,
  onStudentSelect,
  onAddStudent,
  onNavigateToGrades, 
  onNavigateToAssignments,
  onNavigateToReports,
  onRefreshStudents
}) => {
  const [selectedTab, setSelectedTab] = useState('student-management');
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);

  const handleTabSelect = (tab: string) => {
    if (tab === 'grades') {
      onNavigateToGrades?.();
    } else if (tab === 'assignments') {
      onNavigateToAssignments?.();
    } else if (tab === 'reports') {
      onNavigateToReports?.();
    } else {
      setSelectedTab(tab);
    }
  };

  const handleAddStudentClick = () => {
    setShowAddStudentModal(true);
  };

  const handleAddStudentComplete = async (studentData: CreateStudentData) => {
    try {
      await onAddStudent(studentData);
      setShowAddStudentModal(false);
    } catch (error) {
      console.error('Failed to add student:', error);
      // You might want to show an error message to the user here
    }
  };

  const handleCloseAddStudentModal = () => {
    setShowAddStudentModal(false);
  };

  return (
    <div className="flex h-screen bg-black relative">
      <Sidebar 
        selectedTab={selectedTab} 
        onTabSelect={handleTabSelect}
        userData={userData}
        students={students}
        onStudentSelect={onStudentSelect}
        onAddStudent={handleAddStudentClick}
      />
      <MainContent 
        selectedTab={selectedTab} 
        userData={userData} 
        students={students}
        studentsLoading={studentsLoading}
        studentsError={studentsError}
        onStudentSelect={onStudentSelect}
        onAddStudent={onAddStudent}
        showAddStudentModal={showAddStudentModal}
        onCloseAddStudentModal={handleCloseAddStudentModal}
        onAddStudentComplete={handleAddStudentComplete}
        onOpenAddStudentModal={handleAddStudentClick}
        onRefreshStudents={onRefreshStudents}
      />
      <TeacherInterface 
        userData={userData} 
        students={students}
        onStudentSelect={onStudentSelect}
      />
    </div>
  );
};