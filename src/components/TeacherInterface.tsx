import React, { useState, useRef } from 'react';
import { Send, Upload, User, Lightbulb, CheckCircle, FileText, Camera, GraduationCap, Brain } from 'lucide-react';
import { OnboardingData } from './OnboardingPage';
import { Student } from '../App';

interface TeacherInterfaceProps {
  userData: OnboardingData | null;
  students: Student[];
  onStudentSelect: (student: Student) => void;
}

export const TeacherInterface: React.FC<TeacherInterfaceProps> = ({ 
  userData, 
  students,
  onStudentSelect
}) => {
  const [message, setMessage] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() && !uploadedFile) return;
    
    console.log('Teacher message:', message);
    console.log('To student:', selectedStudent?.name);
    console.log('Uploaded file:', uploadedFile?.name);
    
    // Reset form
    setMessage('');
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const quickActions = [
    {
      id: 'upload-worksheet',
      label: 'Upload Worksheet',
      icon: Upload,
      color: 'from-emerald-600 to-teal-600',
      description: 'Upload student worksheet for AI analysis',
      action: handleFileUpload
    },
    {
      id: 'generate-question',
      label: 'AI Questions',
      icon: Lightbulb,
      color: 'from-amber-600 to-orange-600',
      description: 'Generate questions based on weak topics',
      action: () => {
        if (selectedStudent) {
          const topics = selectedStudent.weakTopics.join(', ');
          setMessage(`Generate practice questions for: ${topics}`);
        }
      }
    },
    {
      id: 'analyze-work',
      label: 'Analyze Work',
      icon: FileText,
      color: 'from-blue-600 to-indigo-600',
      description: 'AI analysis of student work',
      action: () => setMessage('Please analyze this student\'s work and identify areas for improvement.')
    },
    {
      id: 'mark-complete',
      label: 'Mark Complete',
      icon: CheckCircle,
      color: 'from-purple-600 to-violet-600',
      description: 'Mark worksheet as completed',
      action: () => console.log('Mark complete')
    }
  ];

  const recentStudents = students.slice(0, 3);

  return null;
};