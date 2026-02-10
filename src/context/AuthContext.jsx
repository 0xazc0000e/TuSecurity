import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Helper function for API calls
async function apiCall(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
        ...options
    };

    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
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

// Create Auth Context
const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Check for stored token on mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchProfile();
        } else {
            setLoading(false);
        }
    }, []);

    // Fetch user profile
    const fetchProfile = useCallback(async () => {
        try {
            const data = await apiCall('/auth/profile');
            setUser(data);
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Failed to fetch profile:', error);
            logout();
        } finally {
            setLoading(false);
        }
    }, []);

    // Login function
    const login = async (email, password) => {
        try {
            const data = await apiCall('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });

            localStorage.setItem('token', data.token);
            setUser(data.user);
            setIsAuthenticated(true);
            return { success: true, user: data.user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    // Register function
    const register = async (username, email, password) => {
        try {
            const data = await apiCall('/auth/register', {
                method: 'POST',
                body: JSON.stringify({ username, email, password, role: 'student' })
            });

            localStorage.setItem('token', data.token);
            setUser(data.user);
            setIsAuthenticated(true);
            return { success: true, user: data.user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
    };

    // Update profile
    const updateProfile = async (profileData) => {
        try {
            const data = await apiCall('/auth/profile', {
                method: 'PUT',
                body: JSON.stringify(profileData)
            });
            await fetchProfile();
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const value = {
        user,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        updateProfile,
        fetchProfile,
        apiCall
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
