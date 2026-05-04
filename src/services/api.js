// src/services/api.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const documentAPI = {
    // Get all documents
    getAll: () => axios.get(`${API_URL}/documents/`),
    
    // Upload a new document
    upload: (formData) => axios.post(`${API_URL}/documents/`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }),
};