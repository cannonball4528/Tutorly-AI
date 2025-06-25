import React, { useState } from 'react';
import { StudentManagement } from './StudentManagement';
import { OnboardingData } from './OnboardingPage';
import { Student } from '../App';
import { CreateStudentData } from '../services/studentService';

interface MainContentProps {
  selectedTab: string;
  userData: OnboardingData | null;
  students: Student[];
  studentsLoading?: boolean;
  studentsError?: string | null;
  onStudentSelect: (student: Student) => void;
  onAddStudent: (student: CreateStudentData) => Promise<Student>;
  showAddStudentModal: boolean;
  onCloseAddStudentModal: () => void;
  onAddStudentComplete: (student: CreateStudentData) => Promise<void>;
  onOpenAddStudentModal: () => void;
  onRefreshStudents?: () => Promise<void>;
}

export const MainContent: React.FC<MainContentProps> = ({ 
  selectedTab, 
  userData, 
  students,
  studentsLoading = false,
  studentsError = null,
  onStudentSelect,
  onAddStudent,
  showAddStudentModal,
  onCloseAddStudentModal,
  onAddStudentComplete,
  onOpenAddStudentModal,
  onRefreshStudents
}) => {
  return (
    <div className="flex-1 flex flex-col bg-black pb-16">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {selectedTab === 'student-management' && (
          <StudentManagement 
            students={students}
            studentsLoading={studentsLoading}
            studentsError={studentsError}
            onStudentSelect={onStudentSelect}
            onAddStudent={onAddStudent}
            userData={userData}
            showAddStudentModal={showAddStudentModal}
            onCloseAddStudentModal={onCloseAddStudentModal}
            onAddStudentComplete={onAddStudentComplete}
            onOpenAddStudentModal={onOpenAddStudentModal}
            onRefreshStudents={onRefreshStudents}
          />
        )}
      </div>
    </div>
  );
};