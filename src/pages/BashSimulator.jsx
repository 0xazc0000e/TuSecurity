import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, Terminal, CheckCircle } from 'lucide-react';
import { MatrixBackground } from '../components/ui/MatrixBackground';
import { TheoryTab } from '../components/simulators/bash/TheoryTab';
import { SimulationTab } from '../components/simulators/bash/SimulationTab';
import { ReviewTab } from '../components/simulators/bash/ReviewTab';

export default function BashSimulator() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('theory'); // theory, simulation, review
    const [completedSteps, setCompletedSteps] = useState([]);

    const handleSimulationComplete = () => {
        setCompletedSteps([...completedSteps, 'simulation']);
        setActiveTab('review');
    };

    return (
        <div className="min-h-screen pt-20 px-4 relative overflow-hidden font-cairo bg-[#0c0c0c]">
            <MatrixBackground />

            <div className="max-w-7xl mx-auto h-[90vh] flex flex-col relative z-10">
                {/* Header Navigation */}
                <div className="flex items-center justify-between mb-6 bg-[#1a1a1a]/80 backdrop-blur-xl p-4 rounded-xl border border-white/5">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/simulators')}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                        >
                            <ArrowRight size={20} />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold text-white">أساسيات أوامر النظام (Bash)</h1>
                            <p className="text-sm text-slate-400">المستوى 1: مقدمة في سطر الأوامر</p>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <TabButton
                            id="theory"
                            label="الشرح النظري"
                            icon={BookOpen}
                            activeTab={activeTab}
                            onClick={() => setActiveTab('theory')}
                        />
                        <TabButton
                            id="simulation"
                            label="المحاكي"
                            icon={Terminal}
                            activeTab={activeTab}
                            onClick={() => setActiveTab('simulation')}
                        />
                        <TabButton
                            id="review"
                            label="التقييم"
                            icon={CheckCircle}
                            activeTab={activeTab}
                            onClick={() => setActiveTab('review')}
                            disabled={!completedSteps.includes('simulation')}
                        />
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 bg-[#121212] rounded-2xl border border-white/5 relative overflow-hidden flex flex-col">
                    {activeTab === 'theory' && <TheoryTab onNext={() => setActiveTab('simulation')} />}
                    {activeTab === 'simulation' && <SimulationTab onComplete={handleSimulationComplete} />}
                    {activeTab === 'review' && <ReviewTab />}
                </div>
            </div>
        </div>
    );
}

const TabButton = ({ id, label, icon: Icon, activeTab, onClick, disabled }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`
            flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all
            ${activeTab === id
                ? 'bg-[#7112AF] text-white shadow-[0_0_15px_rgba(113,18,175,0.4)]'
                : 'bg-transparent text-slate-500 hover:text-slate-300'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed hidden md:flex' : ''}
        `}
    >
        <Icon size={16} />
        <span className="hidden md:inline">{label}</span>
    </button>
);
