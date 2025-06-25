import { Student } from '../App';

const API_BASE_URL = 'http://localhost:3001/api';

export interface CreateStudentData {
  name: string;
  grade: string;
  subjects: string[];
  weakTopics?: string[];
  avatar?: string;
}

export interface UpdateStudentData extends CreateStudentData {
  id: number;
}

class StudentService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('access_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  async getAllStudents(): Promise<Student[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/students`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Transform the data to match frontend expectations
      return data.students.map((student: any) => ({
        id: student.id,
        name: student.name,
        grade: student.grade,
        subjects: student.subjects,
        weakTopics: student.weak_topics || [],
        lastActivity: this.formatLastActivity(student.last_activity),
        avatar: student.avatar
      }));
    } catch (error) {
      console.error('Error fetching students:', error);
      throw error;
    }
  }

  async createStudent(studentData: CreateStudentData): Promise<Student> {
    try {
      const response = await fetch(`${API_BASE_URL}/students`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(studentData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create student');
      }

      const data = await response.json();
      return data.student;
    } catch (error) {
      console.error('Error creating student:', error);
      throw error;
    }
  }

  async getStudent(id: number): Promise<Student> {
    try {
      const response = await fetch(`${API_BASE_URL}/students/${id}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Transform the data to match frontend expectations
      return {
        id: data.student.id,
        name: data.student.name,
        grade: data.student.grade,
        subjects: data.student.subjects,
        weakTopics: data.student.weak_topics || [],
        lastActivity: this.formatLastActivity(data.student.last_activity),
        avatar: data.student.avatar
      };
    } catch (error) {
      console.error('Error fetching student:', error);
      throw error;
    }
  }

  async updateStudent(studentData: UpdateStudentData): Promise<Student> {
    try {
      const response = await fetch(`${API_BASE_URL}/students/${studentData.id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(studentData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update student');
      }

      const data = await response.json();
      return data.student;
    } catch (error) {
      console.error('Error updating student:', error);
      throw error;
    }
  }

  async deleteStudent(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/students/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete student');
      }
    } catch (error) {
      console.error('Error deleting student:', error);
      throw error;
    }
  }

  private formatLastActivity(lastActivity: string): string {
    if (!lastActivity) return 'Just added';
    
    const now = new Date();
    const activityDate = new Date(lastActivity);
    const diffInMinutes = Math.floor((now.getTime() - activityDate.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    
    return activityDate.toLocaleDateString();
  }
}

export const studentService = new StudentService(); 