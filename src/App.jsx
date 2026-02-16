import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Layout from './layouts/Layout';
import Home from './pages/Home';
import HomeNew from './pages/HomeNew';
import Login from './pages/Login';
import Register from './pages/Register';
import SimulatorsHub from './pages/SimulatorsHub';
import KnowledgeBase from './pages/KnowledgeBase';
import About from './pages/About';
import AdminAdvanced from './pages/AdminAdvanced';
import Profile from './pages/Profile';
import ClubActivities from './pages/ClubActivities';
import Onboarding from './pages/Onboarding';
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
                            <ProtectedRoute requiredRole="editor">
                                <AdminAdvanced />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="profile" element={<Profile />} />
                    <Route path="activities" element={<ClubActivities />} />
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                    <Route path="onboarding" element={<Onboarding />} />
                    <Route path="simulators/*" element={<SimulatorsHub />} />
                </Route>
            </Routes>
        </>
    );
}
