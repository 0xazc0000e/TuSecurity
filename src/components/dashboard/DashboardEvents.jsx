import React from 'react';
import { Calendar, MapPin, Clock, ExternalLink } from 'lucide-react';

export const DashboardEvents = ({ events }) => {
    if (!events || events.length === 0) {
        return (
            <div className="text-center py-16 bg-[#0f0f16] border border-white/5 rounded-xl">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-500">
                    <Calendar size={32} />
                </div>
                <h3 className="text-white font-bold mb-2">لا توجد فعاليات مسجلة</h3>
                <p className="text-gray-400 text-sm">سجل في الفعاليات القادمة لتعزيز مهاراتك.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {events.map((event, i) => (
                <div key={i} className="bg-[#0f0f16] border border-white/5 rounded-xl p-5 flex flex-col md:flex-row gap-5 items-start md:items-center hover:bg-white/[0.02] transition-colors">
                    {/* Date Box */}
                    <div className="w-16 h-16 bg-purple-500/10 rounded-xl flex flex-col items-center justify-center border border-purple-500/20 flex-shrink-0">
                        <span className="text-xs text-purple-400 font-bold uppercase">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                        <span className="text-2xl text-white font-bold">{new Date(event.date).getDate()}</span>
                    </div>

                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase font-bold">
                                {event.type}
                            </span>
                            {new Date(event.date) < new Date() && (
                                <span className="text-[10px] text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full">منتهية</span>
                            )}
                        </div>
                        <h3 className="text-white font-bold text-lg mb-2">{event.title}</h3>
                        <div className="flex flex-wrap gap-4 text-xs text-gray-400">
                            <span className="flex items-center gap-1"><Clock size={12} /> {event.time}</span>
                            <span className="flex items-center gap-1"><MapPin size={12} /> {event.location}</span>
                        </div>
                    </div>

                    {/* Action */}
                    <div className="w-full md:w-auto">
                        {event.link && (
                            <a href={event.link} target="_blank" rel="noopener noreferrer"
                                className="block text-center w-full px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-xs font-bold transition-colors">
                                <ExternalLink size={14} className="inline mb-0.5 ml-1" /> تفاصيل
                            </a>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};
