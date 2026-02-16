import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// API Configuration - point to real backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function for API calls with error handling
export async function apiCall(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;

    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
        ...options
    };

    // If body is FormData, remove Content-Type to let browser set boundary
    if (options.body instanceof FormData) {
        delete config.headers['Content-Type'];
    }

    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    try {
        const response = await fetch(url, config);

        // Parse response body
        let data;
        try {
            data = await response.json();
        } catch {
            data = { error: 'Server returned invalid response' };
        }

        if (!response.ok) {
            throw new Error(data.error || `Request failed with status ${response.status}`);
        }

        return data;
    } catch (error) {
        // Network error (server not running)
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            throw new Error('لا يمكن الاتصال بالخادم. تأكد من تشغيل السيرفر.');
        }
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

    // User needs onboarding if authenticated but missing major
    const needsOnboarding = isAuthenticated && user && !user.major;

    // Check for stored token on mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchProfile();
        } else {
            setLoading(false);
        }
    }, []);

    // Fetch user profile from real API
    const fetchProfile = useCallback(async () => {
        try {
            const data = await apiCall('/auth/profile');
            setUser(data);
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Failed to fetch profile:', error);
            // Token is invalid or expired - clean up
            localStorage.removeItem('token');
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    }, []);

    // Login function - POST to real backend
    const login = async (email, password) => {
        try {
            const data = await apiCall('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });

            // Store JWT token
            localStorage.setItem('token', data.token);
            setUser(data.user);
            setIsAuthenticated(true);
            return { success: true, user: data.user };
        } catch (error) {
            return { success: false, error: error.message || 'فشل تسجيل الدخول' };
        }
    };

    // Register function - POST to real backend
    const register = async ({ username, email, password, universityId }) => {
        try {
            const data = await apiCall('/auth/register', {
                method: 'POST',
                body: JSON.stringify({ username, email, password, university_id: universityId, role: 'student' })
            });

            // Store JWT token
            localStorage.setItem('token', data.token);
            setUser(data.user);
            setIsAuthenticated(true);
            return { success: true, user: data.user };
        } catch (error) {
            return { success: false, error: error.message || 'فشل إنشاء الحساب' };
        }
    };

    // Logout function - clear token and state
    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
    };

    // Update profile - PUT to real backend
    const updateProfile = async (profileData) => {
        try {
            const isFormData = profileData instanceof FormData;
            const data = await apiCall('/auth/profile', {
                method: 'PUT',
                body: isFormData ? profileData : JSON.stringify(profileData)
            });
            // Use the returned user object directly if available
            if (data.user) {
                setUser(data.user);
            } else {
                await fetchProfile();
            }
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message || 'فشل تحديث الملف الشخصي' };
        }
    };

    const value = {
        user,
        isAuthenticated,
        loading,
        needsOnboarding,
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
