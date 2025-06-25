import React, { useState } from 'react';
import { ArrowLeft, Send, Tag, CheckCircle, AlertTriangle, User, Clock, BookOpen, Brain, GraduationCap } from 'lucide-react';
import { OnboardingData } from './OnboardingPage';
import { Student, ChatMessage } from '../App';

interface StudentChatPageProps {
  student: Student;
  userData: OnboardingData | null;
  onBack: () => void;
  students: Student[];
  onStudentSelect: (student: Student) => void;
}

export const StudentChatPage: React.FC<StudentChatPageProps> = ({ 
  student, 
  userData, 
  onBack,
  students,
  onStudentSelect
}) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      studentId: student.id,
      message: "I'm having trouble with fractions. Can you help me understand how to add them?",
      isTeacher: false,
      timestamp: '2 hours ago',
      topic: 'Fractions'
    },
    {
      id: 2,
      studentId: student.id,
      message: "Of course! Let's start with adding fractions that have the same denominator. Can you try adding 1/4 + 2/4?",
      isTeacher: true,
      timestamp: '2 hours ago'
    },
    {
      id: 3,
      studentId: student.id,
      message: "Is it 3/4?",
      isTeacher: false,
      timestamp: '1 hour ago',
      isMarked: true,
      grade: 'Correct',
      feedback: 'Great job! You understand same denominators.'
    }
  ]);
  const [showTagModal, setShowTagModal] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState<number | null>(null);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage: ChatMessage = {
      id: messages.length + 1,
      studentId: student.id,
      message: message,
      isTeacher: true,
      timestamp: 'Just now'
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage('');
  };

  const handleTagWeakTopic = (messageId: number, topic: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, topic }
        : msg
    ));
    setShowTagModal(false);
    setSelectedMessageId(null);
  };

  const handleMarkAnswer = (messageId: number, grade: string, feedback: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, isMarked: true, grade, feedback }
        : msg
    ));
  };

  const generateQuestion = () => {
    const questions = [
      "Can you solve this problem: 2/3 + 1/6 = ?",
      "What's the first step when adding fractions with different denominators?",
      "Try this: 3/8 + 1/4. Show me your work step by step."
    ];
    
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    setMessage(randomQuestion);
  };

  return (
    <div className="flex h-screen bg-black">
      {/* Sidebar */}
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
                Teaching Session
              </span>
            </div>
            <p className="text-gray-500 text-xs mt-1">
              Active • {student.name}
            </p>
          </div>

          {/* Current Student */}
          <div className="bg-emerald-600/10 border border-emerald-600/30 rounded-lg p-3">
            <div className="flex items-center space-x-3">
              {student.avatar ? (
                <img 
                  src={student.avatar} 
                  alt={student.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                  <User size={20} className="text-gray-400" />
                </div>
              )}
              <div className="flex-1">
                <div className="text-emerald-400 font-medium">{student.name}</div>
                <div className="text-emerald-300/70 text-xs">{student.grade}</div>
              </div>
            </div>
            
            <div className="mt-3">
              <div className="text-gray-400 text-xs mb-2">Subjects:</div>
              <div className="flex flex-wrap gap-1">
                {student.subjects.map(subject => (
                  <span key={subject} className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded">
                    {subject}
                  </span>
                ))}
              </div>
            </div>

            {student.weakTopics.length > 0 && (
              <div className="mt-3">
                <div className="text-gray-400 text-xs mb-2">Weak Topics:</div>
                <div className="flex flex-wrap gap-1">
                  {student.weakTopics.map(topic => (
                    <span key={topic} className="px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Other Students */}
        <div className="flex-1 p-4">
          <div className="text-gray-400 text-sm font-medium mb-3">Other Students</div>
          <div className="space-y-2">
            {students.filter(s => s.id !== student.id).slice(0, 5).map(otherStudent => (
              <button
                key={otherStudent.id}
                onClick={() => onStudentSelect(otherStudent)}
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-gray-300 hover:bg-gray-800/50 transition-all duration-200"
              >
                {otherStudent.avatar ? (
                  <img 
                    src={otherStudent.avatar} 
                    alt={otherStudent.name}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                ) : (
                  <User size={16} className="text-gray-600" />
                )}
                <div className="flex-1 text-left">
                  <div className="truncate">{otherStudent.name}</div>
                  <div className="text-xs text-gray-500">{otherStudent.grade}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

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
            <div>
              <h1 className="text-lg font-semibold text-white">{student.name}</h1>
              <p className="text-gray-400 text-sm">{student.grade} • {student.subjects.join(', ')}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={generateQuestion}
              className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-sm rounded-lg transition-all duration-200"
            >
              <BookOpen size={16} />
              <span>Generate Question</span>
            </button>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.isTeacher ? 'justify-end' : 'justify-start'}`}>
              <div className="max-w-2xl">
                <div className="flex items-start space-x-3">
                  {!msg.isTeacher && (
                    <div className="w-8 h-8 flex-shrink-0">
                      {student.avatar ? (
                        <img 
                          src={student.avatar} 
                          alt={student.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-700 rounded-full flex items-center justify-center">
                          <User size={16} className="text-gray-400" />
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <div className={`rounded-2xl px-4 py-3 ${
                      msg.isTeacher 
                        ? 'bg-emerald-600 text-white rounded-tr-md' 
                        : 'bg-gray-800 text-gray-200 rounded-tl-md'
                    }`}>
                      <p className="text-sm">{msg.message}</p>
                      
                      {msg.topic && (
                        <div className="mt-2 flex items-center space-x-1">
                          <Tag size={12} className="text-orange-400" />
                          <span className="text-orange-400 text-xs">Topic: {msg.topic}</span>
                        </div>
                      )}
                      
                      {msg.isMarked && (
                        <div className="mt-2 p-2 bg-emerald-500/20 rounded-lg">
                          <div className="flex items-center space-x-1 mb-1">
                            <CheckCircle size={12} className="text-emerald-400" />
                            <span className="text-emerald-400 text-xs font-medium">{msg.grade}</span>
                          </div>
                          {msg.feedback && (
                            <p className="text-emerald-300 text-xs">{msg.feedback}</p>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <Clock size={12} />
                        <span>{msg.timestamp}</span>
                      </div>
                      
                      {!msg.isTeacher && !msg.isMarked && (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              setSelectedMessageId(msg.id);
                              setShowTagModal(true);
                            }}
                            className="flex items-center space-x-1 px-2 py-1 bg-orange-600 hover:bg-orange-700 text-white text-xs rounded transition-colors duration-200"
                          >
                            <Tag size={10} />
                            <span>Tag Topic</span>
                          </button>
                          
                          <button
                            onClick={() => handleMarkAnswer(msg.id, 'Correct', 'Good work!')}
                            className="flex items-center space-x-1 px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs rounded transition-colors duration-200"
                          >
                            <CheckCircle size={10} />
                            <span>Mark</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {msg.isTeacher && (
                    <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-medium">T</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={`Send a message to ${student.name}...`}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 pr-20 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-600 focus:border-gray-600 transition-all duration-200"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              
              <button
                onClick={handleSendMessage}
                disabled={!message.trim()}
                className={`absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 flex items-center space-x-1 ${
                  message.trim()
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-sm'
                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Send size={14} />
                <span>Send</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tag Topic Modal */}
      {showTagModal && selectedMessageId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-white mb-4">Tag Weak Topic</h3>
            
            <div className="space-y-3">
              {['Fractions', 'Algebra', 'Geometry', 'Word Problems', 'Decimals'].map(topic => (
                <button
                  key={topic}
                  onClick={() => handleTagWeakTopic(selectedMessageId, topic)}
                  className="w-full text-left px-3 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-gray-200 transition-colors duration-200"
                >
                  {topic}
                </button>
              ))}
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowTagModal(false);
                  setSelectedMessageId(null);
                }}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};