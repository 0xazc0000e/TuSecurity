import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Layout from './layouts/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Simulators from './pages/Simulators';
import BashSimulator from './pages/BashSimulator';
import Attacks from './pages/Attacks';
import Articles from './pages/Articles';
import News from './pages/News';
import Admin from './pages/Admin';
import Profile from './pages/Profile';

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
            <ScrollToTop />
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="simulators" element={<Simulators />} />
                    <Route path="attacks" element={<Attacks />} />
                    <Route path="articles" element={<Articles />} />
                    <Route path="news" element={<News />} />
                    <Route path="admin" element={<Admin />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                    <Route path="simulators/bash" element={<BashSimulator />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
