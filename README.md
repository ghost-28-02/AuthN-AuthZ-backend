# AuthN-AuthZ-backend

A comprehensive Node.js/Express backend application implementing Authentication (AuthN) and Authorization (AuthZ) with role-based access control (RBAC).

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Authentication & Authorization](#authentication--authorization)
- [Security Features](#security-features)
- [Usage Examples](#usage-examples)
- [Contributing](#contributing)
- [License](#license)

## 🔍 Overview

This project provides a robust backend API for handling user authentication and role-based authorization.  It implements secure user registration, login functionality, JWT-based authentication, and middleware for protecting routes based on user roles.

## ✨ Features

- **User Authentication**
  - User registration (signup) with password hashing
  - User login with JWT token generation
  - Token-based session management
  - Cookie-based token storage

- **Role-Based Authorization (RBAC)**
  - Three user roles: Admin, Student, Visitor
  - Protected routes based on user roles
  - Middleware for role verification

- **Security**
  - Password hashing using bcrypt (10 salt rounds)
  - JWT token authentication
  - HTTP-only cookies for token storage
  - CORS configuration for cross-origin requests
  - Token expiration (2 hours)

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js (v5.2.1)
- **Database**: MongoDB with Mongoose ODM (v9.0.2)
- **Authentication**: JSON Web Tokens (JWT v9.0.3)
- **Password Hashing**: bcrypt (v6.0.0)
- **Environment Variables**: dotenv (v17.2.3)
- **Additional Middleware**:
  - cors (v2.8.5)
  - cookie-parser (v1.4.7)
- **Development**:  nodemon (v3.1.11)

## 📁 Project Structure

```
AuthN-AuthZ-backend/
├── backend/
│   ├── config/
│   │   └── database.js          # MongoDB connection configuration
│   ├── controller/
│   │   └── auth.js              # Authentication logic (login, signup)
│   ├── middlewares/
│   │   └── auth.js              # Auth middleware (auth, isStudent, isAdmin)
│   ├── models/
│   │   └── user.js              # User schema/model
│   ├── routes/
│   │   └── user.js              # API route definitions
│   ├── . gitignore
│   ├── package.json
│   ├── package-lock.json
│   └── server.js                # Main server file
└── README.md
```

## 🚀 Getting Started

### Prerequisites

Before running this application, make sure you have the following installed: 

- [Node.js](https://nodejs.org/) (v14 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (local installation or MongoDB Atlas account)
- npm (comes with Node.js)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ghost-28-02/AuthN-AuthZ-backend.git
   cd AuthN-AuthZ-backend
   ```

2. **Navigate to the backend directory**
   ```bash
   cd backend
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

### Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
# Server Configuration
PORT=5000

# Database Configuration
DATABASE_URL=mongodb://localhost:27017/your-database-name
# OR for MongoDB Atlas:
# DATABASE_URL=mongodb+srv://<username>:<password>@cluster. mongodb.net/your-database-name

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

> **Note**: Make sure to use a strong, random string for `JWT_SECRET` in production.

### Running the Application

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:5000` (or the PORT specified in your .env file).

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api/v1
```

### Endpoints

#### 1. User Registration (Signup)
- **URL**: `/api/v1/signup`
- **Method**: `POST`
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example. com",
    "password": "securePassword123",
    "role": "Student"  // Options: "Admin", "Student", "Visitor"
  }
  ```
- **Success Response** (200):
  ```json
  {
    "success": true,
    "message": "user created successfully"
  }
  ```

#### 2. User Login
- **URL**: `/api/v1/login`
- **Method**: `POST`
- **Auth Required**: No
- **Request Body**: 
  ```json
  {
    "email": "john@example. com",
    "password": "securePassword123"
  }
  ```
- **Success Response** (200):
  ```json
  {
    "success":  true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "userObject": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "Student",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    },
    "message": "User logged in successfully"
  }
  ```

#### 3. Test Protected Route
- **URL**: `/api/v1/test`
- **Method**: `GET`
- **Auth Required**: Yes (any authenticated user)
- **Headers**: 
  ```
  Authorization: Bearer <token>
  ```
- **Success Response** (200):
  ```json
  {
    "success": true,
    "message": "this is test code"
  }
  ```

#### 4. Student Dashboard
- **URL**: `/api/v1/student`
- **Method**: `GET`
- **Auth Required**: Yes (Student role only)
- **Headers**: 
  ```
  Authorization: Bearer <token>
  ```
- **Success Response** (200):
  ```json
  {
    "success": true,
    "message": "Welcome to Student Dashboard"
  }
  ```

#### 5. Admin Dashboard
- **URL**: `/api/v1/admin`
- **Method**: `GET`
- **Auth Required**: Yes (Admin role only)
- **Headers**: 
  ```
  Authorization: Bearer <token>
  ```
- **Success Response** (200):
  ```json
  {
    "success": true,
    "message": "Welcome to Admin Dashboard"
  }
  ```

## 🔐 Authentication & Authorization

### How Authentication Works

1. **Registration**: User signs up with credentials, password is hashed using bcrypt with 10 salt rounds
2. **Login**: User provides credentials, receives JWT token valid for 2 hours
3. **Token Storage**: Token is stored in HTTP-only cookie and also returned in response
4. **Token Verification**: Middleware verifies token on protected routes

### Authorization Roles

- **Admin**: Full access to admin routes
- **Student**: Access to student routes
- **Visitor**: Default role with basic access

### Middleware Chain

Protected routes use middleware in this order:
1. `auth`: Verifies JWT token
2. `isStudent` or `isAdmin`: Verifies user role

## 🔒 Security Features

- **Password Hashing**: Bcrypt with 10 salt rounds
- **JWT Tokens**: Signed with secret key, expire after 2 hours
- **HTTP-Only Cookies**: Prevents XSS attacks
- **CORS Configuration**: Restricts cross-origin requests
- **Token Validation**: Multiple token sources (body, cookie, Authorization header)

## 💡 Usage Examples

### Using cURL

**Register a new user:**
```bash
curl -X POST http://localhost:5000/api/v1/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email":  "jane@example.com",
    "password": "password123",
    "role": "Student"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/v1/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@example.com",
    "password": "password123"
  }'
```

**Access protected route:**
```bash
curl -X GET http://localhost:5000/api/v1/student \
  -H "Authorization:  Bearer YOUR_JWT_TOKEN"
```

### Using JavaScript/Fetch

```javascript
// Login
const login = async () => {
  const response = await fetch('http://localhost:5000/api/v1/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Important for cookies
    body: JSON.stringify({
      email: 'jane@example.com',
      password: 'password123'
    })
  });
  
  const data = await response.json();
  localStorage.setItem('token', data. token);
  return data;
};

// Access protected route
const getStudentDashboard = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:5000/api/v1/student', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    credentials: 'include'
  });
  
  return await response.json();
};
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature-name`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some feature'`)
5. Push to the branch (`git push origin feature/your-feature-name`)
6. Open a Pull Request

## 📄 License

This project is available for use under your preferred license.  Please add license information as needed.

## 👤 Author

**ghost-28-02**

- GitHub: [@ghost-28-02](https://github.com/ghost-28-02)
- Project Link: [https://github.com/ghost-28-02/AuthN-AuthZ-backend](https://github.com/ghost-28-02/AuthN-AuthZ-backend)

## 📞 Support

If you have any questions or need help, please open an issue in the GitHub repository. 

---

**Note**:  This is a learning/demonstration project. For production use, consider implementing additional security measures such as: 
- Rate limiting
- Input validation and sanitization
- HTTPS enforcement
- More comprehensive error handling
- Logging and monitoring
- Password strength requirements
- Email verification
- Password reset functionality
- Refresh tokens
