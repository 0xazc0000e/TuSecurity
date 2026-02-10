import { useAuth } from '../context/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Generic API call helper
async function apiCall(endpoint, options = {}, token = null) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
        ...options
    };

    // Use provided token or get from localStorage
    const authToken = token || localStorage.getItem('token');
    if (authToken) {
        config.headers.Authorization = `Bearer ${authToken}`;
    }

    try {
        const response = await fetch(url, config);
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'API request failed');
        }

        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Auth API
export const authAPI = {
    login: (email, password) => apiCall('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
    }),
    
    register: (username, email, password) => apiCall('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ username, email, password })
    }),
    
    getProfile: () => apiCall('/auth/profile'),
    
    updateProfile: (data) => apiCall('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(data)
    }),
    
    logout: () => {
        localStorage.removeItem('token');
    }
};

// Content/News API
export const contentAPI = {
    getAll: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return apiCall(`/content?${queryString}`);
    },
    
    getById: (id) => apiCall(`/content/${id}`),
    
    like: (id) => apiCall(`/content/${id}/like`, { method: 'POST' })
};

// Simulators API
export const simulatorsAPI = {
    getAll: () => apiCall('/simulators'),
    
    getById: (id) => apiCall(`/simulators/${id}`),
    
    getUserProgress: () => apiCall('/simulators/progress'),
    
    saveBashProgress: (data) => apiCall('/simulators/progress/bash', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    
    saveAttackProgress: (data) => apiCall('/simulators/progress/attack', {
        method: 'POST',
        body: JSON.stringify(data)
    })
};

// Admin API
export const adminAPI = {
    getStats: () => apiCall('/admin/stats'),
    
    getUsers: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return apiCall(`/admin/users?${queryString}`);
    },
    
    updateUser: (id, data) => apiCall(`/admin/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    }),
    
    deleteUser: (id) => apiCall(`/admin/users/${id}`, {
        method: 'DELETE'
    }),
    
    banUser: (id, reason) => apiCall(`/admin/users/${id}/ban`, {
        method: 'PUT',
        body: JSON.stringify({ reason })
    }),

    resetPassword: (userId, newPassword) => apiCall('/admin/reset-password', {
        method: 'POST',
        body: JSON.stringify({ userId, newPassword })
    }),

    getLogs: (limit = 100) => apiCall(`/admin/logs?limit=${limit}`),

    // Role Management (admin only)
    updateUserRole: (id, role) => apiCall(`/admin/users/${id}/role`, {
        method: 'PUT',
        body: JSON.stringify({ role })
    }),

    // Content Management (admin and editor)
    getContent: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return apiCall(`/admin/content?${queryString}`);
    },

    createContent: (data) => apiCall('/admin/content', {
        method: 'POST',
        body: JSON.stringify(data)
    }),

    updateContent: (id, data) => apiCall(`/admin/content/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    }),

    deleteContent: (id) => apiCall(`/admin/content/${id}`, {
        method: 'DELETE'
    }),

    // Simulators Management (admin and editor)
    getSimulators: () => apiCall('/admin/simulators'),

    createSimulator: (data) => apiCall('/admin/simulators', {
        method: 'POST',
        body: JSON.stringify(data)
    }),

    updateSimulator: (id, data) => apiCall(`/admin/simulators/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    }),

    deleteSimulator: (id) => apiCall(`/admin/simulators/${id}`, {
        method: 'DELETE'
    })
};

// Default export
export default {
    auth: authAPI,
    content: contentAPI,
    simulators: simulatorsAPI,
    admin: adminAPI,
    apiCall
};
