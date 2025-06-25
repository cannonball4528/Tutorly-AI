# Backend API with Supabase Authentication

This backend provides a complete authentication system using Supabase, with Express.js and proper middleware for security and validation.

## 🚀 Quick Start

### 1. Environment Setup

1. Copy the environment template:
   ```bash
   cp env.example .env
   ```

2. Fill in your Supabase credentials in `.env`:
   ```env
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   PORT=3001
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   ```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Server
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3001`

## 🔐 Supabase Setup

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - Name: `tutorly-ai` (or your preferred name)
   - Database Password: Create a strong password
   - Region: Choose closest to your users

### 2. Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** → `SUPABASE_URL`
   - **anon public** key → `SUPABASE_ANON_KEY`

### 3. Configure Authentication

1. Go to **Authentication** → **Settings**
2. Configure your site URL: `http://localhost:5173`
3. Add redirect URLs if needed for your frontend

## 📡 API Endpoints

### Authentication Endpoints

#### POST `/api/signup`
Register a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "user_metadata": {
    "full_name": "John Doe",
    "role": "student"
  }
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

#### POST `/api/login`
Log in an existing user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "created_at": "2024-01-01T00:00:00Z"
  },
  "session": {
    "access_token": "jwt_token",
    "refresh_token": "refresh_token",
    "expires_at": 1234567890
  }
}
```

#### GET `/api/profile` (Protected)
Get current user's profile.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "message": "Profile retrieved successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "created_at": "2024-01-01T00:00:00Z",
    "user_metadata": {
      "full_name": "John Doe",
      "role": "student"
    }
  }
}
```

#### PUT `/api/profile` (Protected)
Update current user's profile.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "user_metadata": {
    "full_name": "Jane Doe",
    "role": "tutor"
  }
}
```

#### POST `/api/logout` (Protected)
Log out the current user.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "message": "Logout successful"
}
```

### Utility Endpoints

#### GET `/health`
Health check endpoint.

**Response:**
```json
{
  "status": "OK",
  "message": "Server is running",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## 🧪 Testing with Postman

### 1. Import Collection
Create a new Postman collection and add these requests:

#### Signup Request
```
POST http://localhost:3001/api/signup
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123",
  "user_metadata": {
    "full_name": "Test User"
  }
}
```

#### Login Request
```
POST http://localhost:3001/api/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

#### Profile Request (Protected)
```
GET http://localhost:3001/api/profile
Authorization: Bearer {{access_token}}
```

### 2. Test Flow
1. Run the signup request
2. Run the login request and copy the `access_token`
3. Set the `access_token` as a collection variable
4. Run the profile request

## 🔒 Security Features

- **CORS**: Configured to allow requests from your frontend
- **Helmet**: Security headers for protection
- **JWT Validation**: Proper token verification with Supabase
- **Input Validation**: Request body validation
- **Error Handling**: Comprehensive error responses

## 🏗️ Project Structure

```
backend/
├── config/
│   └── supabase.js          # Supabase client configuration
├── middleware/
│   └── auth.js              # Authentication middleware
├── routes/
│   └── auth.js              # Authentication routes
├── server.js                # Main server file
├── package.json             # Dependencies and scripts
├── env.example              # Environment variables template
└── README.md                # This file
```

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `SUPABASE_URL` | Your Supabase project URL | Required |
| `SUPABASE_ANON_KEY` | Your Supabase anon key | Required |
| `PORT` | Server port | 3001 |
| `NODE_ENV` | Environment mode | development |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:5173 |

## 🚨 Troubleshooting

### Common Issues

1. **"Missing Supabase environment variables"**
   - Check your `.env` file exists and has correct values
   - Verify Supabase URL and anon key are correct

2. **CORS errors from frontend**
   - Ensure `FRONTEND_URL` in `.env` matches your frontend URL
   - Check that CORS is properly configured

3. **Authentication errors**
   - Verify Supabase project is active
   - Check that email/password authentication is enabled in Supabase

### Debug Mode
Run with debug logging:
```bash
DEBUG=* npm run dev
```

## 📚 Next Steps

1. **Frontend Integration**: Connect your React frontend to these endpoints
2. **Database Tables**: Create additional tables in Supabase for your app data
3. **Row Level Security**: Configure RLS policies in Supabase
4. **Email Templates**: Customize Supabase email templates
5. **Social Auth**: Add Google, GitHub, etc. authentication providers 