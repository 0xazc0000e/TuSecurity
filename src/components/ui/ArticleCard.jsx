import React from 'react';
import { FileText, Calendar, ArrowLeft } from 'lucide-react';
import { SpotlightCard } from './SpotlightCard';

export const ArticleCard = ({ title, date, category }) => (
    <SpotlightCard className="h-full text-right" isInteractive>
        <div className="h-32 bg-gradient-to-bl from-[#240993]/50 to-transparent p-4 flex flex-col justify-end relative overflow-hidden">
            <div className="absolute top-0 left-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity"><FileText size={48} /></div>
            <span className="text-xs text-[#7112AF] font-bold bg-black/50 px-2 py-1 rounded w-fit mb-2">{category}</span>
            <h3 className="text-white font-bold leading-tight group-hover:text-[#d4b3ff] transition-colors">{title}</h3>
        </div>
        <div className="p-4">
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-3"><Calendar size={12} /> {date}</div>
            <p className="text-sm text-slate-400 line-clamp-2">ملخص قصير عن المقال يوضح أهم النقاط التي سيتم تناولها في هذا البحث الأمني...</p>
            <div className="mt-4 flex items-center gap-2 text-xs font-bold text-[#7112AF] group-hover:underline">اقرأ المزيد <ArrowLeft size={12} /></div>
        </div>
    </SpotlightCard>
);
