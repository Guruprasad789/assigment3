import { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI } from '../api/authApi';

const AuthContext = createContext();

const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN_SUCCESS':
            localStorage.setItem('token', action.payload.token);
            localStorage.setItem('user', JSON.stringify(action.payload.user));
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload.user,
                token: action.payload.token,
                loading: false
            };
        case 'REGISTER_SUCCESS':
            return {
                ...state,
                isAuthenticated: false,
                loading: false
            };
        case 'LOGOUT':
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            return {
                ...state,
                isAuthenticated: false,
                user: null,
                token: null,
                loading: false
            };
        case 'SET_LOADING':
            return {
                ...state,
                loading: action.payload
            };
        case 'AUTH_ERROR':
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            return {
                ...state,
                isAuthenticated: false,
                user: null,
                token: null,
                loading: false
            };
        default:
            return state;
    }
};

const initialState = {
    isAuthenticated: false,
    user: null,
    token: localStorage.getItem('token'),
    loading: true
};

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Check if user is logged in on app load
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            const user = localStorage.getItem('user');
            
            if (token && user) {
                try {
                    // Try to verify token with backend
                    const response = await authAPI.getMe();
                    dispatch({
                        type: 'LOGIN_SUCCESS',
                        payload: {
                            token,
                            user: response.data.user
                        }
                    });
                } catch (error) {
                    console.error('Auth check failed:', error);
                    // If token verification fails, clear auth data
                    dispatch({ type: 'AUTH_ERROR' });
                }
            } else {
                dispatch({ type: 'SET_LOADING', payload: false });
            }
        };

        checkAuth();
    }, []);

    const login = async (credentials) => {
        try {
            const response = await authAPI.login(credentials);

            if (response.data && response.data.token && response.data.user) {
                dispatch({
                    type: 'LOGIN_SUCCESS',
                    payload: response.data
                });
                return { success: true };
            } else {
                return { success: false, message: 'Invalid response format' };
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Login failed';
            return {
                success: false,
                message: errorMessage
            };
        }
    };

    const register = async (userData) => {
        try {
            const response = await authAPI.register(userData);
            if (response.data && response.data.token && response.data.user) {
                dispatch({ type: 'REGISTER_SUCCESS', payload: response.data });
                return { success: true };
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error) {
            console.error('Register error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Registration failed'
            };
        }
    };

    const logout = () => {
        dispatch({ type: 'LOGOUT' });
    };

    const value = {
        ...state,
        login,
        register,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
