import React from 'react';
import { ToggleLeft, ToggleRight, Settings, Play, Archive, CheckCircle, AlertOctagon } from 'lucide-react';
import { useAuth, apiCall } from '../../context/AuthContext';

export const SimulatorControl = () => {
    const [simulators, setSimulators] = React.useState([]);

    React.useEffect(() => {
        apiCall('/content/simulators').then(setSimulators).catch(console.error);
    }, []);

    const toggleSimulator = async (id) => {
        // Mock toggle for now since backend doesn't support status toggle yet
        alert('Simulator status toggle not fully implemented in backend yet.');
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            <h2 className="text-2xl font-bold text-white mb-6">التحكم بالمحاكيات</h2>

            <div className="grid gap-4">
                {simulators.map(sim => (
                    <div key={sim.id} className="bg-[#050214]/60 border border-white/5 p-6 rounded-2xl flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className={`w-3 h-3 rounded-full ${sim.status === 'active' ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-yellow-500'}`} />
                            <div>
                                <h3 className="font-bold text-white text-lg">{sim.name}</h3>
                                <div className="flex items-center gap-4 text-xs text-slate-400 mt-1">
                                    <span>المستوى: {sim.difficulty}</span>
                                    <span>معدل النجاح: {sim.successRate}%</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button className="px-4 py-2 bg-white/5 text-slate-300 hover:text-white rounded-lg text-sm font-bold border border-white/5 hover:bg-white/10 transition-colors">
                                <Settings size={16} className="inline ml-2" /> إعدادات
                            </button>
                            <button
                                onClick={() => toggleSimulator(sim.id)}
                                className={`px-4 py-2 rounded-lg text-sm font-bold text-white transition-colors flex items-center gap-2 ${sim.status === 'active' ? 'bg-yellow-600 hover:bg-yellow-500' : 'bg-green-600 hover:bg-green-500'
                                    }`}
                            >
                                {sim.status === 'active' ? <><Archive size={14} /> إيقاف للصيانة</> : <><CheckCircle size={14} /> تفعيل</>}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Simulator Uploader / Builder */}
            <div className="bg-[#7112AF]/5 border border-[#7112AF]/20 p-6 rounded-2xl mt-8">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <AlertOctagon className="text-[#7112AF]" />
                    Plug-and-Play Simulator Builder
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button className="p-4 bg-[#0a0a12] border border-white/10 rounded-xl hover:border-[#7112AF] transition-all text-left group">
                        <div className="font-bold text-white group-hover:text-[#7112AF] mb-1">Upload Simulator Package</div>
                        <div className="text-xs text-slate-500">Supported types: .zip, .js bundle</div>
                    </button>
                </div>
            </div>
        </div>
    );
};
