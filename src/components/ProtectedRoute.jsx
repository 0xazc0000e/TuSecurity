import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, requiredRole = null }) {
    const { user, isAuthenticated, loading, needsOnboarding } = useAuth();
    const location = useLocation();

    // 1. الفخ الذي تم إصلاحه: إجبار النظام على انتظار بيانات المستخدم!
    // إذا كان النظام يعرف أنك مسجل دخول، لكن بياناتك (مثل رتبتك) لم تصل من السيرفر بعد، أظهر دائرة التحميل ولا تطرد المستخدم.
    if (loading || (isAuthenticated && !user)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#050214]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    // 2. إذا لم يكن مسجلاً الدخول إطلاقاً، وجهه لصفحة تسجيل الدخول
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 3. تخطي صفحة الإعداد للمشرف الأول
    if (needsOnboarding && location.pathname !== '/onboarding' && location.pathname !== '/complete-profile') {
        const isSuperAdmin = user?.role?.toUpperCase() === 'SUPER_ADMIN' || user?.email?.toLowerCase() === 'az.jo.fm@gmail.com';
        if (!isSuperAdmin) {
            return <Navigate to="/onboarding" replace />;
        }
    }

    // 4. فحص الصلاحيات والرتب بهدوء بعد التأكد من وصول البيانات
    if (requiredRole) {
        const ROLE_HIERARCHY = {
            'STUDENT': 1,
            'EDITOR': 2,
            'MANAGER': 3,
            'ADMIN': 4,
            'SUPER_ADMIN': 5
        };

        const userRole = (user?.role || 'STUDENT').toUpperCase();
        const userEmail = user?.email?.toLowerCase() || '';
        const requiredRoleUpper = requiredRole.toUpperCase();

        const userRoleLevel = ROLE_HIERARCHY[userRole] || 1;
        const requiredRoleLevel = ROLE_HIERARCHY[requiredRoleUpper] || 1;

        // الحصانة الكاملة للمشرف الأول
        const isSuperAdmin = userRole === 'SUPER_ADMIN' || userEmail === 'az.jo.fm@gmail.com';

        // إذا كانت رتبته أقل من المطلوب وليس هو المشرف الأول، اطرده للرئيسية
        if (userRoleLevel < requiredRoleLevel && !isSuperAdmin) {
            return <Navigate to="/" replace />;
        }
    }

    // 5. إذا اجتاز كل الشروط بنجاح، افتح له الصفحة المطلوبة
    return children;
}