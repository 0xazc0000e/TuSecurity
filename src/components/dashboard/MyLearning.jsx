import React from 'react';
import { BookOpen, CheckCircle, Clock, PlayCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const MyLearning = ({ enrollments }) => {
    if (!enrollments || enrollments.length === 0) {
        return (
            <div className="text-center py-16 bg-[#0f0f16] border border-white/5 rounded-xl">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-500">
                    <BookOpen size={32} />
                </div>
                <h3 className="text-white font-bold mb-2">لم تسجل في أي مسار بعد</h3>
                <p className="text-gray-400 text-sm mb-6">ابدأ رحلتك التعليمية الآن واستكشف المسارات المتاحة.</p>
                <Link to="/knowledge" className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                    تصفح المسارات
                </Link>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {enrollments.map((item, i) => (
                <div key={i} className="bg-[#0f0f16] border border-white/5 rounded-xl p-5 hover:border-purple-500/30 transition-colors group">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-green-500/10 text-green-500 flex items-center justify-center font-bold text-lg">
                                {item.icon ? <span className="text-xl">{item.icon}</span> : <BookOpen size={20} />}
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-sm line-clamp-1">{item.title}</h3>
                                <span className="text-xs text-gray-500">{item.type === 'track' ? 'مسار تعليمي' : 'كورس'}</span>
                            </div>
                        </div>
                        {item.is_completed && <CheckCircle size={18} className="text-green-500" />}
                    </div>

                    <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-xs text-gray-400">
                            <span>التقدم</span>
                            <span>{item.progress}%</span>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500" style={{ width: `${item.progress}%` }} />
                        </div>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-white/5">
                        <span className="text-[10px] text-gray-500 flex items-center gap-1">
                            <Clock size={10} /> آخر نشاط: {new Date(item.last_accessed).toLocaleDateString()}
                        </span>
                        <Link to={item.type === 'track' ? `/knowledge/${item.item_id}` : `/knowledge/course/${item.item_id}`}
                            className="text-xs text-purple-400 hover:text-purple-300 font-bold flex items-center gap-1">
                            <PlayCircle size={12} /> متابعة
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    );
};
