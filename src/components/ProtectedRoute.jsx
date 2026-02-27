import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, requiredRole = null }) {
    const { user, isAuthenticated, loading, needsOnboarding } = useAuth();
    const location = useLocation();

    // Diagnostic Log (Requested by user)
    console.log("Auth State:", { user, loading, role: user?.role });

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
        console.warn(`[ProtectedRoute] Redirection to login from ${location.pathname}: No session found.`);
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // If user needs onboarding and is NOT already on the onboarding page
    if (needsOnboarding && location.pathname !== '/onboarding' && location.pathname !== '/complete-profile') {
        // SUPER_ADMIN Bypass onboarding
        const isSuperAdmin = user?.role?.toUpperCase() === 'SUPER_ADMIN' || user?.email?.toLowerCase() === 'az.jo.fm@gmail.com';
        if (!isSuperAdmin) {
            return <Navigate to="/onboarding" replace />;
        }
    }

    // Check role permissions if a specific role is required
    if (requiredRole) {
        const userRole = (user?.role || 'STUDENT').toUpperCase();
        const userEmail = user?.email?.toLowerCase() || '';
        const requiredRoleUpper = requiredRole.toUpperCase();

        const userRoleLevel = ROLE_HIERARCHY[userRole] || 1;
        const requiredRoleLevel = ROLE_HIERARCHY[requiredRoleUpper] || 1;

        // Bypasses for SUPER_ADMIN (both role and email)
        const isSuperAdmin = userRole === 'SUPER_ADMIN' || userEmail === 'az.jo.fm@gmail.com';

        if (userRoleLevel < requiredRoleLevel && !isSuperAdmin) {
            console.error(`[ProtectedRoute] ACCESS DENIED: User Role [${userRole}] (Level ${userRoleLevel}) < Required [${requiredRoleUpper}] (Level ${requiredRoleLevel}). Redirecting...`);
            return <Navigate to="/" replace />;
        }
    }

    return children;
}
