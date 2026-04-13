# assigment3# MERN Stack Authentication System with MySQL Database & Dashboard CRUD

A complete full-stack web application built with the MERN stack (MySQL, Express.js, React.js, Node.js) featuring user authentication and a dashboard with full CRUD operations.

## Features

### Authentication System
- User registration with password hashing
- User login with JWT token authentication
- Password reset functionality via email
- Protected routes and automatic token validation
- Secure logout functionality

### Dashboard & CRUD Operations
- Statistics dashboard showing item counts by status
- Create, read, update, and delete items
- Item status management (active, pending, completed)
- Responsive design for all screen sizes
- Real-time data updates

### Security Features
- Password hashing using bcryptjs
- JWT token-based authentication
- SQL injection prevention with parameterized queries
- CORS protection
- Input validation and sanitization
- Secure error handling

## Technology Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MySQL** - Relational database
- **mysql2** - MySQL client with Promise support
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **nodemailer** - Email functionality
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Frontend
- **React.js** - Component-based UI library
- **Vite** - Build tool and development server
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Tailwind CSS** - Utility-first CSS framework
- **React Context API** - Global state management

## Project Structure

```
mern-mysql-auth-crud/
├── backend/
│   ├── config/
│   │   └── db.js                 # MySQL connection configuration
│   ├── controllers/
│   │   ├── authController.js     # Authentication logic
│   │   └── itemController.js     # CRUD operations logic
│   ├── middleware/
│   │   ├── auth.js              # JWT verification middleware
│   │   └── errorHandler.js      # Error handling middleware
│   ├── routes/
│   │   ├── authRoutes.js        # Authentication endpoints
│   │   └── itemRoutes.js        # CRUD endpoints
│   ├── .env.example             # Environment variables template
│   ├── .gitignore
│   ├── package.json
│   └── server.js                # Entry point
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── axios.js         # Axios configuration
│   │   │   ├── authApi.js       # Authentication API calls
│   │   │   └── itemApi.js       # Item API calls
│   │   ├── components/
│   │   │   ├── Dashboard.jsx    # Main dashboard component
│   │   │   ├── Login.jsx        # Login page
│   │   │   ├── Register.jsx     # Registration page
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── ResetPassword.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── PublicRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # Authentication context
│   │   ├── App.jsx              # Main app component
│   │   ├── main.jsx             # Entry point
│   │   └── index.css            # Global styles
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── database.sql                 # Database schema
└── README.md
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    reset_token VARCHAR(255) DEFAULT NULL,
    reset_token_expiry DATETIME DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Items Table
```sql
CREATE TABLE items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status ENUM('active', 'pending', 'completed') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- XAMPP (with Apache and MySQL)
- npm or yarn package manager

### MySQL Database Setup

1. **Install XAMPP**
   - Download from: https://www.apachefriends.org/download.html
   - Install and open XAMPP Control Panel
   - Start **Apache** and **MySQL** services

2. **Create Database**
   - Open phpMyAdmin at http://localhost/phpmyadmin
   - Click **New** in the left panel
   - Create a database named `mern_auth_db`

3. **Run Database Schema**
   - Click on `mern_auth_db` in the left panel
   - Go to the **SQL** tab
   - Paste the contents of `database.sql` and click **Go**bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm run dev
   ```

   The backend server will run on http://localhost:5000

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

   The frontend will run on http://localhost:3000

## API Endpoints

### Authentication Routes
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Send password reset email
- `POST /api/auth/reset-password` - Reset password with token
- `GET /api/auth/me` - Get current user (Protected)

### Item Routes (All Protected)
- `GET /api/items` - Get all items for logged-in user
- `GET /api/items/:id` - Get single item by ID
- `POST /api/items` - Create new item
- `PUT /api/items/:id` - Update item
- `DELETE /api/items/:id` - Delete item
- `GET /api/stats` - Get dashboard statistics

## Usage

1. **Register a new account** at http://localhost:3000/register
2. **Login** with your credentials at http://localhost:3000/login
3. **Access the dashboard** to manage your items
4. **Create, edit, and delete items** using the dashboard interface
5. **View statistics** showing your item counts by status

## Security Features

- **Password Hashing**: All passwords are hashed using bcryptjs before storage
- **JWT Authentication**: Secure token-based authentication with expiry
- **SQL Injection Prevention**: All database queries use parameterized statements
- **Input Validation**: Both frontend and backend validation
- **CORS Protection**: Configured for secure cross-origin requests
- **Error Handling**: Secure error messages without sensitive information exposure

## Screenshots


### Register Page
![Register Page](screenshots/register.png)

### Login Page
![Login Page](screenshots/login.png)

### Dashboard
![Dashboard](screenshots/dashboard.png)

### CRUD Operations
![CRUD Operations](screenshots/crud-operations.png)

### MySQL Database - Users Table
![MySQL Users Table](screenshots/mysql-database-users.png)

### MySQL Database - Items Table
![MySQL Items Table](screenshots/mysql-database-items.png)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request


## Contact

For questions or support, please contact:
- **Name**: Guruprasad Iranna Deekshit
- **Email**: d5412919@gmail.com
