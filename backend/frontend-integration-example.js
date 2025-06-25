// Frontend Integration Example for React
// This shows how to connect your React frontend to the backend authentication system

// Example React component for authentication
const AuthExample = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE_URL = 'http://localhost:3001/api';

  // Signup function
  const handleSignup = async (email, password, userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          user_metadata: userData
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      console.log('Signup successful:', data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const handleLogin = async (email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store tokens in localStorage or secure storage
      localStorage.setItem('access_token', data.session.access_token);
      localStorage.setItem('refresh_token', data.session.refresh_token);
      
      setUser(data.user);
      console.log('Login successful:', data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const handleLogout = async () => {
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      setUser(null);
      return;
    }

    try {
      await fetch(`${API_BASE_URL}/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Clear tokens and user state
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setUser(null);
    }
  };

  // Get user profile (protected route)
  const fetchProfile = async () => {
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      throw new Error('No access token');
    }

    const response = await fetch(`${API_BASE_URL}/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch profile');
    }

    return data;
  };

  // Update user profile (protected route)
  const updateProfile = async (userMetadata) => {
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      throw new Error('No access token');
    }

    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ user_metadata: userMetadata }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update profile');
    }

    return data;
  };

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('access_token');
      
      if (token) {
        try {
          const profileData = await fetchProfile();
          setUser(profileData.user);
        } catch (err) {
          console.error('Auth check failed:', err);
          // Clear invalid tokens
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        }
      }
    };

    checkAuth();
  }, []);

  return {
    user,
    loading,
    error,
    handleSignup,
    handleLogin,
    handleLogout,
    fetchProfile,
    updateProfile,
  };
};

// Example usage in a React component:
/*
import React, { useState } from 'react';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { handleLogin, loading, error } = AuthExample();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleLogin(email, password);
      // Redirect or update UI
    } catch (err) {
      // Error is already handled in the hook
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
};
*/

// Example of a protected component
const ProtectedComponent = () => {
  const { user, handleLogout } = AuthExample();

  if (!user) {
    return <div>Please log in to access this content.</div>;
  }

  return (
    <div>
      <h1>Welcome, {user.email}!</h1>
      <p>This is protected content.</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

module.exports = { AuthExample, ProtectedComponent }; 