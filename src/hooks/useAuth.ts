import { useState } from 'react';

interface AuthData {
  name: string;
  email: string;
  password: string;
}

interface AuthErrors {
  name: string;
  email: string;
  password: string;
}

interface UseAuthReturn {
  formData: AuthData;
  errors: AuthErrors;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  validateForm: () => boolean;
  handleSubmit: (e: React.FormEvent, onSuccess?: () => void) => void;
}

export const useAuth = (): UseAuthReturn => {
  const [formData, setFormData] = useState<AuthData>({
    name: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<AuthErrors>({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };
    
    // Only validate name if it's a required field
    if (formData.name === '' && document.getElementById('name')) {
      newErrors.name = 'Name is required';
      valid = false;
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      valid = false;
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      valid = false;
    }
    
    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e: React.FormEvent, onSuccess?: () => void) => {
    e.preventDefault();
    
    if (validateForm()) {
      console.log('Form submitted:', formData);
      // In a real application, you would handle authentication here
      if (onSuccess) {
        onSuccess();
      }
    }
  };

  return {
    formData,
    errors,
    handleChange,
    validateForm,
    handleSubmit,
  };
};