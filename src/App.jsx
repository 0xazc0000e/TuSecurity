import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Layout from './layouts/Layout';
import HomeNew from './pages/HomeNew';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

import SimulatorsHub from './pages/SimulatorsHub';
import KnowledgeBase from './pages/KnowledgeBase';
import About from './pages/About';
import AdminAdvanced from './pages/AdminAdvanced';
import Profile from './pages/Profile';
import ClubActivities from './pages/ClubActivities';
import CompleteProfile from './pages/CompleteProfile';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { AnalyticsProvider } from './context/AnalyticsContext';
import { DatabaseProvider } from './context/DatabaseContext';

function ScrollToTop() {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
}

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <DatabaseProvider>
                    <AnalyticsProvider>
                        <AppContent />
                    </AnalyticsProvider>
                </DatabaseProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}

function AppContent() {
    return (
        <>
            <ScrollToTop />
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<HomeNew />} />
                    <Route path="knowledge/*" element={<KnowledgeBase />} />
                    <Route path="about" element={<About />} />
                    <Route
                        path="admin"
                        element={
                            <ProtectedRoute requiredRole="EDITOR">
                                <AdminAdvanced />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="profile"
                        element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        }
                    />

                    <Route path="activities" element={<ClubActivities />} />
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Signup />} />
                    <Route path="forgot-password" element={<ForgotPassword />} />
                    <Route path="reset-password" element={<ResetPassword />} />
                    <Route path="onboarding" element={<CompleteProfile />} />
                    <Route path="complete-profile" element={<CompleteProfile />} />
                    <Route path="simulators/*" element={<SimulatorsHub />} />
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </>
    );
}

