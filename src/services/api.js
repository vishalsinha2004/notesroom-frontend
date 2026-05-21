// src/services/api.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Create a custom axios instance
const api = axios.create({
    baseURL: API_URL,
});

// Interceptor: Automatically attach the token if we have one
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Authentication endpoints
export const authAPI = {
    login: (username, password) => api.post('/token/', { username, password }),
    register: (userData) => api.post('/register/', userData),
    verify: (email, code) => api.post('/verify-otp/', { email, otp: code }),
    resendOtp: (email) => api.post('/resend-otp/', { email }),
    getProfile: () => api.get('/profile/'),
};

// Document endpoints
export const documentAPI = {
    // 1. Fetch the nested Semesters > Subjects > Documents structure
    getAllSemesters: () => api.get('/semesters/'),
    
    // 2. AI Chat Endpoint
    chat: (id, message) => api.post(`/documents/${id}/chat/`, { message }),

    generalChat: (message) => api.post('/chat/', { message }),
};