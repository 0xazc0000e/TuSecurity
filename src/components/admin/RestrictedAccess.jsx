import React from 'react';
import { useAuth } from '../../context/AuthContext';

// Role hierarchy (higher number = more permissions)
const ROLE_HIERARCHY = {
    'student': 1,
    'editor': 2,
    'admin': 3
};

/**
 * RestrictedAccess - A guard component that conditionally renders children based on user role
 * @param {string} requiredRole - Minimum role required to view content
 * @param {ReactNode} children - Content to render if user has permission
 * @param {ReactNode} fallback - Optional fallback content if user doesn't have permission
 */
export default function RestrictedAccess({ requiredRole = 'admin', children, fallback = null }) {
    const { user } = useAuth();
    
    if (!user) return fallback;
    
    const userLevel = ROLE_HIERARCHY[user.role] || 0;
    const requiredLevel = ROLE_HIERARCHY[requiredRole] || 0;
    
    if (userLevel < requiredLevel) {
        return fallback;
    }
    
    return children;
}

/**
 * Check if user has required role (helper function)
 */
export const hasPermission = (userRole, requiredRole) => {
    const userLevel = ROLE_HIERARCHY[userRole] || 0;
    const requiredLevel = ROLE_HIERARCHY[requiredRole] || 0;
    return userLevel >= requiredLevel;
};
