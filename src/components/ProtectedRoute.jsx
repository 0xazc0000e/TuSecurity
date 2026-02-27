import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, requiredRole = 'student' }) {
    const { user, isAuthenticated, loading, needsOnboarding } = useAuth();
    const location = useLocation();

    // Role hierarchy (New strict system)
    const ROLE_HIERARCHY = {
        'STUDENT': 1,
        'EDITOR': 2,
        'MANAGER': 3,
        'ADMIN': 4,
        'SUPER_ADMIN': 5
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#050214]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        // Redirect to login but save the attempted location
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // If user needs onboarding and is NOT already on the onboarding page
    if (needsOnboarding && location.pathname !== '/onboarding') {
        return <Navigate to="/onboarding" replace />;
    }

    // Check role permissions if a specific role is required
    if (requiredRole) {
        const userRole = user?.role?.toUpperCase() || 'STUDENT';
        const userEmail = user?.email?.toLowerCase() || '';
        const requiredRoleUpper = requiredRole.toUpperCase();

        const userRoleLevel = ROLE_HIERARCHY[userRole] || 0;
        const requiredRoleLevel = ROLE_HIERARCHY[requiredRoleUpper] || 0;

        // Ultimate authority bypass for SUPER_ADMIN email
        const isSuperAdminEmail = userEmail === 'az.jo.fm@gmail.com';

        if (userRoleLevel < requiredRoleLevel && !isSuperAdminEmail) {
            // User is authenticated but doesn't have permission
            return <Navigate to="/" replace />;
        }
    }

    return children;
}
