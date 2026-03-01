// API Service Layer

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://tusecurity.onrender.com';

// Generic API call helper
export async function apiCall(endpoint, options = {}, token = null) {
    // Ensure endpoint starts with /api for consistency
    const normalizedEndpoint = endpoint.startsWith('/api') ? endpoint : `/api${endpoint}`;
    const url = `${API_BASE_URL}${normalizedEndpoint}`;

    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
        credentials: 'true', // Temporarily using string to see if it causes issues, but it should be standard 'include'
        ...options
    };

    // Ensure credentials: 'include' is set for cookies to be sent
    config.credentials = 'include';

    // If body is FormData, remove Content-Type to let browser set boundary
    if (options.body instanceof FormData) {
        delete config.headers['Content-Type'];
    }

    // Keep token in headers for backward compatibility during transition
    const authToken = token || localStorage.getItem('token');
    if (authToken) {
        config.headers.Authorization = `Bearer ${authToken}`;
    }

    try {
        const response = await fetch(url, config);

        // Parse response body safely
        let data;
        try {
            data = await response.json();
        } catch {
            data = { error: 'Server returned invalid response' };
        }

        if (!response.ok) {
            const error = new Error(data.error || `Request failed with status ${response.status}`);
            error.data = data;
            throw error;
        }

        return data;
    } catch (error) {
        // Network error handling (translated for user)
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            throw new Error('لا يمكن الاتصال بالخادم. تأكد من تشغيل السيرفر.');
        }
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
    }),

    validateMission: (data) => apiCall('/simulators/validate', {
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
        body: data instanceof FormData ? data : JSON.stringify(data)
    }),

    updateContent: (id, data) => apiCall(`/admin/content/${id}`, {
        method: 'PUT',
        body: data instanceof FormData ? data : JSON.stringify(data)
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
    }),

    // Scenario Management
    getScenarios: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return apiCall(`/admin/scenarios?${queryString}`);
    },

    createScenario: (data) => apiCall('/admin/scenarios', {
        method: 'POST',
        body: JSON.stringify(data)
    }),

    updateScenario: (id, data) => apiCall(`/admin/scenarios/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    }),

    deleteScenario: (id) => apiCall(`/admin/scenarios/${id}`, {
        method: 'DELETE'
    })
};

export const lmsAPI = {
    // Tracks
    getTracks: () => apiCall('/lms/tracks'),
    createTrack: (data) => apiCall('/lms/tracks', { method: 'POST', body: JSON.stringify(data) }),
    deleteTrack: (id) => apiCall(`/lms/tracks/${id}`, { method: 'DELETE' }),

    // Courses
    getCourses: (trackId) => apiCall(`/lms/tracks/${trackId}/courses`),
    createCourse: (data) => apiCall('/lms/courses', { method: 'POST', body: JSON.stringify(data) }),
    deleteCourse: (id) => apiCall(`/lms/courses/${id}`, { method: 'DELETE' }),

    // Units
    getUnits: (courseId) => apiCall(`/lms/courses/${courseId}/units`),
    createUnit: (data) => apiCall('/lms/units', { method: 'POST', body: JSON.stringify(data) }),
    deleteUnit: (id) => apiCall(`/lms/units/${id}`, { method: 'DELETE' }),

    // Lessons
    getLessons: (unitId) => apiCall(`/lms/units/${unitId}/lessons`),
    createLesson: (data) => apiCall('/lms/lessons', { method: 'POST', body: JSON.stringify(data) }),
    updateLesson: (id, data) => apiCall(`/lms/lessons/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteLesson: (id) => apiCall(`/lms/lessons/${id}`, { method: 'DELETE' }),
    bulkUploadLessons: (data) => apiCall('/lms/lessons/bulk', { method: 'POST', body: JSON.stringify(data) }),

    // Full Tree
    getSyllabus: () => apiCall('/lms/syllabus'),

    // Recorded Courses
    getRecordedCourses: () => apiCall('/lms/recorded-courses'),
    createRecordedCourse: (data) => apiCall('/lms/recorded-courses', { method: 'POST', body: JSON.stringify(data) }),
    updateRecordedCourse: (id, data) => apiCall(`/lms/recorded-courses/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteRecordedCourse: (id) => apiCall(`/lms/recorded-courses/${id}`, { method: 'DELETE' }),

    // Articles
    getArticles: () => apiCall('/lms/articles'),
    createArticle: (data) => apiCall('/lms/articles', {
        method: 'POST',
        body: data instanceof FormData ? data : JSON.stringify(data)
    }),
    updateArticle: (id, data) => apiCall(`/lms/articles/${id}`, {
        method: 'PUT',
        body: data instanceof FormData ? data : JSON.stringify(data)
    }),
    deleteArticle: (id) => apiCall(`/lms/articles/${id}`, { method: 'DELETE' }),

    // Tags
    getTags: () => apiCall('/lms/tags'),
    createTag: (data) => apiCall('/lms/tags', { method: 'POST', body: JSON.stringify(data) }),
    deleteTag: (id) => apiCall(`/lms/tags/${id}`, { method: 'DELETE' }),

    // Enrollment
    enroll: (data) => apiCall('/lms/enroll', { method: 'POST', body: JSON.stringify(data) }),

    // Lesson Completion
    getCompletedLessons: async () => {
        const res = await apiCall('/lms/lessons/completed');
        return res.completedLessons || [];
    },
    markLessonComplete: (id) => apiCall(`/lms/lessons/${id}/complete`, { method: 'POST' }),

    // Quiz / Flag Submission
    submitQuiz: (data) => apiCall('/lms/quiz/submit', { method: 'POST', body: JSON.stringify(data) }),
    submitFlag: (data) => apiCall('/lms/flag/submit', { method: 'POST', body: JSON.stringify(data) })
};

// News API
export const newsAPI = {
    getAll: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return apiCall(`/news?${queryString}`);
    },
    getById: (id) => apiCall(`/news/${id}`),

    // Admin ops
    create: (data) => apiCall('/news', { method: 'POST', body: data }),
    update: (id, data) => apiCall(`/news/${id}`, { method: 'PUT', body: data }),
    delete: (id) => apiCall(`/news/${id}`, { method: 'DELETE' })
};

// Events API (Club Activities)
export const eventsAPI = {
    // Events
    getEvents: () => apiCall('/events'),
    createEvent: (data) => apiCall('/events', { method: 'POST', body: JSON.stringify(data) }),
    updateEvent: (id, data) => apiCall(`/events/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteEvent: (id) => apiCall(`/events/${id}`, { method: 'DELETE' }),
    // Surveys
    getSurveys: () => apiCall('/events/surveys'),
    createSurvey: (data) => apiCall('/events/surveys', { method: 'POST', body: JSON.stringify(data) }),
    updateSurvey: (id, data) => apiCall(`/events/surveys/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteSurvey: (id) => apiCall(`/events/surveys/${id}`, { method: 'DELETE' }),
    // Announcements
    getAnnouncements: () => apiCall('/events/announcements'),
    createAnnouncement: (data) => apiCall('/events/announcements', { method: 'POST', body: JSON.stringify(data) }),
    updateAnnouncement: (id, data) => apiCall(`/events/announcements/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteAnnouncement: (id) => apiCall(`/events/announcements/${id}`, { method: 'DELETE' }),
    // Registrations
    registerForEvent: (eventId, data) => apiCall(`/events/${eventId}/register`, { method: 'POST', body: JSON.stringify(data) }),
    getEventRegistrations: (eventId) => apiCall(`/events/${eventId}/registrations`),
    getRegistrationsSummary: () => apiCall('/events/admin/registrations-summary')
};

// Distinguished Members API
export const distinguishedAPI = {
    getMembers: (month) => {
        const query = month ? `?month=${month}` : '';
        return apiCall(`/distinguished${query}`);
    },
    getMonths: () => apiCall('/distinguished/months'),
    addMember: (data) => apiCall('/distinguished', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    deleteMember: (id) => apiCall(`/distinguished/${id}`, {
        method: 'DELETE'
    }),
    getMessages: (id) => apiCall(`/distinguished/${id}/messages`),
    sendMessage: (id, message) => apiCall(`/distinguished/${id}/messages`, {
        method: 'POST',
        body: JSON.stringify({ message })
    })
};

// Reports API
export const reportsAPI = {
    submitReport: (data) => apiCall('/reports', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    getReports: () => apiCall('/reports'),
    updateReportStatus: (id, status) => apiCall(`/reports/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status })
    })
};

// Default export
export default {
    auth: authAPI,
    content: contentAPI,
    simulators: simulatorsAPI,
    admin: adminAPI,
    lms: lmsAPI,
    news: newsAPI,
    events: eventsAPI,
    distinguished: distinguishedAPI,
    reports: reportsAPI,
    apiCall
};
