import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import Dashboard from './components/Dashboard';

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="App">
                    <Routes>
                        {/* Public Routes */}
                        <Route 
                            path="/login" 
                            element={
                                <PublicRoute>
                                    <Login />
                                </PublicRoute>
                            } 
                        />
                        <Route 
                            path="/register" 
                            element={
                                <PublicRoute>
                                    <Register />
                                </PublicRoute>
                            } 
                        />
                        <Route 
                            path="/forgot-password" 
                            element={
                                <PublicRoute>
                                    <ForgotPassword />
                                </PublicRoute>
                            } 
                        />
                        <Route 
                            path="/reset-password/:token" 
                            element={
                                <PublicRoute>
                                    <ResetPassword />
                                </PublicRoute>
                            } 
                        />

                        {/* Protected Routes */}
                        <Route 
                            path="/dashboard" 
                            element={
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            } 
                        />

                        {/* Default Route */}
                        <Route path="/" element={<Navigate to="/dashboard" />} />
                        
                        {/* 404 Route */}
                        <Route path="*" element={<Navigate to="/dashboard" />} />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;