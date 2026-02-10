import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MatrixBackground } from '../components/ui/MatrixBackground';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { OverviewDashboard } from '../components/admin/OverviewDashboard';
import { UserManagement } from '../components/admin/UserManagement';
import { ContentManager } from '../components/admin/ContentManager';
import { SimulatorControl } from '../components/admin/SimulatorControl';
import { LearningAnalytics } from '../components/admin/LearningAnalytics';
import { SystemLogs } from '../components/admin/SystemLogs';

export default function Admin() {
    const [activeTab, setActiveTab] = useState('overview');

    const renderContent = () => {
        switch (activeTab) {
            case 'overview': return <OverviewDashboard />;
            case 'users': return <UserManagement />;
            case 'content': return <ContentManager />;
            case 'simulators': return <SimulatorControl />;
            case 'analytics': return <LearningAnalytics />;
            case 'logs': return <SystemLogs />;
            default: return <OverviewDashboard />;
        }
    };

    return (
        <div className="min-h-screen bg-[#02010a] text-white pt-24 pl-6 pr-6 lg:pr-0 font-cairo flex" dir="rtl">
            <MatrixBackground />

            {/* Sidebar (Desktop) */}
            <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Main Content */}
            <main className="flex-1 pb-10 pl-6">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {renderContent()}
                </motion.div>
            </main>
        </div>
    );
}
