# Trellysis Backend - Authentication & Student Management

## Overview
Backend API for Trellysis student management system with JWT-based authentication, role-based access control, and student CRUD operations.

## Features
- **User Authentication**: Register and login with JWT tokens
- **Role-Based Access Control**: Faculty and Student user types
- **Email Validation**: Kongu University email requirement (@kongu.edu)
- **Password Security**: Bcrypt hashing with 10 salt rounds
- **Token Management**: JWT tokens with 7-day expiration
- **Student Management**: CRUD operations with file uploads
- **Protected Routes**: Authentication required for all student endpoints

## Installation

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Install required packages if not already installed
npm install express cors multer sqlite3 jsonwebtoken bcryptjs
```

## Environment Setup

Create a `.env` file in the server root:

```env
JWT_SECRET=your-secret-key-here
NODE_ENV=development
PORT=5000
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  userType TEXT NOT NULL CHECK(userType IN ('student', 'faculty')),
  name TEXT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

## API Endpoints

### Authentication Routes (`/auth`)

#### Register
```
POST /auth/register
Content-Type: application/json

{
  "email": "user@kongu.edu",
  "password": "password123",
  "confirmPassword": "password123",
  "userType": "student", // or "faculty"
  "name": "John Doe"
}

Response (201):
{
  "message": "Registration successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "user@kongu.edu",
    "userType": "student",
    "name": "John Doe"
  }
}
```

#### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "user@kongu.edu",
  "password": "password123"
}

Response (200):
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "user@kongu.edu",
    "userType": "student",
    "name": "John Doe"
  }
}
```

#### Verify Token
```
GET /auth/verify
Authorization: Bearer <token>

Response (200):
{
  "valid": true,
  "user": {
    "id": 1,
    "email": "user@kongu.edu",
    "userType": "student"
  }
}
```

#### Refresh Token
```
POST /auth/refresh
Authorization: Bearer <token>

Response (200):
{
  "message": "Token refreshed",
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Student Routes (`/student`)

All student endpoints require authentication. Faculty-only operations are marked.

#### Get All Students
```
GET /student
Authorization: Bearer <token>

Response (200): [
  {
    "StudentId": 1,
    "StudentName": "John Doe",
    "RollNumber": "22CSR001",
    "Department": "CSE",
    "Gender": "Male",
    "MobileNumber": "9876543210",
    "DateOfBirth": "2000-01-15",
    "YearOfStudy": "3",
    "PhotoPath": "Uploads/Photos/...",
    "DocumentPath": "Uploads/Documents/...",
    "CreatedAt": "2024-01-01T10:00:00"
  },
  ...
]
```

#### Get Student by ID
```
GET /student/:id
Authorization: Bearer <token>

Response (200): { student object }
```

#### Create Student (Faculty Only)
```
POST /student
Authorization: Bearer <token>
Content-Type: multipart/form-data

Body:
- StudentName: "John Doe" (text)
- RollNumber: "22CSR001" (text)
- Department: "CSE" (text)
- Gender: "Male" (text)
- MobileNumber: "9876543210" (text)
- DateOfBirth: "2000-01-15" (text)
- YearOfStudy: "3" (text)
- photo: <file> (optional)
- document: <file> (optional)

Response (201): { created student object }
```

#### Update Student (Faculty Only)
```
PUT /student/:id
Authorization: Bearer <token>
Content-Type: multipart/form-data

Body: (same fields as create, all optional)

Response (200): { updated student object }
```

#### Delete Student (Faculty Only)
```
DELETE /student/:id
Authorization: Bearer <token>

Response (200): { message: "Student deleted successfully" }
```

## Authentication Flow

1. **Register/Login**: Get JWT token
2. **Store Token**: Save token in client localStorage or session
3. **API Requests**: Include token in Authorization header
   ```
   Authorization: Bearer <token>
   ```
4. **Token Expiration**: Token expires in 7 days
5. **Refresh**: Use `/auth/refresh` to get a new token before expiration

## Error Responses

### 400 Bad Request
```json
{ "error": "All fields are required" }
```

### 401 Unauthorized
```json
{ "error": "Invalid email or password" }
```

### 403 Forbidden
```json
{ "error": "Faculty access only" }
```

### 500 Server Error
```json
{ "error": "Internal server error" }
```

## Demo Credentials

After running the application, you can register with:
- **Student Email**: student@kongu.edu
- **Faculty Email**: faculty@kongu.edu
- **Password**: password123

## File Structure

```
server/
├── src/
│   ├── configs/
│   │   └── db.js (SQLite database setup)
│   ├── controllers/
│   │   ├── authController.js (Authentication logic)
│   │   └── studentController.js (Student CRUD logic)
│   ├── middleware/
│   │   └── auth.js (JWT verification & authorization)
│   ├── models/
│   │   ├── userModel.js (User database operations)
│   │   └── studentModel.js (Student database operations)
│   ├── routes/
│   │   ├── authRoutes.js (Auth endpoints)
│   │   └── studentRoutes.js (Student endpoints)
│   └── app.js (Express app setup)
├── index.js (Server entry point)
├── package.json
└── student.db (SQLite database)
```

## Running the Server

```bash
# Start the server
npm start

# Server runs on http://localhost:5000
```

## Integration with Frontend

Update your frontend API calls:

```javascript
// Login
const response = await fetch('http://localhost:5000/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});
const { token, user } = await response.json();
localStorage.setItem('token', token);

// API request with authentication
const response = await fetch('http://localhost:5000/student', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});
```

## Security Considerations

- ✅ Passwords hashed with bcrypt (10 salt rounds)
- ✅ JWT tokens with expiration (7 days)
- ✅ Email validation for @kongu.edu domain
- ✅ Role-based access control (RBAC)
- ✅ CORS enabled for frontend integration
- ⚠️ Change JWT_SECRET in production
- ⚠️ Use HTTPS in production
- ⚠️ Implement rate limiting for authentication endpoints

## Dependencies

```json
{
  "express": "^4.18.x",
  "cors": "^2.8.x",
  "sqlite3": "^5.x.x",
  "jsonwebtoken": "^9.x.x",
  "bcryptjs": "^2.4.x",
  "multer": "^1.4.x"
}
```

## Troubleshooting

**Issue**: "JWT_SECRET not defined"
- **Solution**: Set JWT_SECRET environment variable or update in authController.js

**Issue**: "Users table not found"
- **Solution**: Delete student.db and restart server to recreate tables

**Issue**: CORS errors
- **Solution**: Ensure CORS is enabled in app.js and frontend requests include proper headers

## Future Enhancements

- [ ] OAuth2 integration
- [ ] Email verification
- [ ] Password reset functionality
- [ ] Audit logging
- [ ] Rate limiting
- [ ] Two-factor authentication
- [ ] Session management
- [ ] API versioning
