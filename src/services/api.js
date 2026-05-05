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
    
    // NEW ENDPOINTS
    register: (userData) => api.post('/register/', userData),
    verify: (email, code) => api.post('/verify-email/', { email, code }),
};

// Document endpoints
export const documentAPI = {
    getAll: () => api.get('/documents/'),
    
    upload: (formData) => api.post('/documents/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }),
    delete: (id) => api.delete(`/documents/${id}/`),
};