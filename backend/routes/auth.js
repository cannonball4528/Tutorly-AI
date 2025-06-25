const express = require('express');
const supabase = require('../config/supabase');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

/**
 * POST /api/signup
 * Register a new user with email and password
 */
router.post('/signup', async (req, res) => {
  try {
    const { email, password, user_metadata = {} } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Email and password are required'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: 'Password too short',
        message: 'Password must be at least 6 characters long'
      });
    }

    // Create user with Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: user_metadata
      }
    });

    if (error) {
      return res.status(400).json({
        error: 'Signup failed',
        message: error.message
      });
    }

    // Return user data (without sensitive information)
    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: data.user.id,
        email: data.user.email,
        created_at: data.user.created_at
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred during signup'
    });
  }
});

/**
 * POST /api/login
 * Log in an existing user with email and password
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Email and password are required'
      });
    }

    // Sign in with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return res.status(401).json({
        error: 'Login failed',
        message: error.message
      });
    }

    // Return user data and session
    res.json({
      message: 'Login successful',
      user: {
        id: data.user.id,
        email: data.user.email,
        created_at: data.user.created_at
      },
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: data.session.expires_at
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred during login'
    });
  }
});

/**
 * POST /api/logout
 * Log out the current user
 */
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return res.status(500).json({
        error: 'Logout failed',
        message: error.message
      });
    }

    res.json({
      message: 'Logout successful'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred during logout'
    });
  }
});

/**
 * GET /api/profile
 * Get the current user's profile (protected route)
 */
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    // User is already authenticated and available in req.user
    res.json({
      message: 'Profile retrieved successfully',
      user: {
        id: req.user.id,
        email: req.user.email,
        created_at: req.user.created_at,
        user_metadata: req.user.user_metadata
      }
    });

  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred while retrieving profile'
    });
  }
});

/**
 * PUT /api/profile
 * Update the current user's profile (protected route)
 */
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { user_metadata } = req.body;

    // Update user metadata
    const { data, error } = await supabase.auth.updateUser({
      data: user_metadata
    });

    if (error) {
      console.error('Supabase updateUser error:', error);
      return res.status(400).json({
        error: 'Profile update failed',
        message: error.message
      });
    }

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: data.user.id,
        email: data.user.email,
        user_metadata: data.user.user_metadata
      }
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred while updating profile'
    });
  }
});

module.exports = router; 