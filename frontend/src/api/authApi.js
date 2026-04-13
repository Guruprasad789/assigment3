import API from './axios';

export const authAPI = {
    register: (userData) => API.post('/auth/register', userData),
    login: (credentials) => API.post('/auth/login', credentials),
    forgotPassword: (email) => API.post('/auth/forgot-password', { email }),
    resetPassword: (data) => API.post('/auth/reset-password', data),
    getMe: () => API.get('/auth/me')
};
