import React from 'react';
import { Bookmark, Heart, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export const SavedItems = ({ likes, bookmarks }) => {
    if ((!likes || likes.length === 0) && (!bookmarks || bookmarks.length === 0)) {
        return (
            <div className="text-center py-16 bg-[#0f0f16] border border-white/5 rounded-xl">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-500">
                    <Bookmark size={32} />
                </div>
                <h3 className="text-white font-bold mb-2">المحفوظات فارغة</h3>
                <p className="text-gray-400 text-sm">قم بالإعجاب أو حفظ المحتوى للوصول إليه هنا.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Bookmarks */}
            <div className="space-y-4">
                <h3 className="text-white font-bold flex items-center gap-2 mb-2">
                    <Bookmark size={16} className="text-blue-400" /> العلامات المرجعية (Bookmarks)
                </h3>
                {bookmarks.map((item, i) => (
                    <div key={i} className="bg-[#0f0f16] border border-white/5 rounded-lg p-3 flex justify-between items-center group hover:border-blue-500/30 transition-colors">
                        <div>
                            <span className="text-[10px] text-gray-500 block mb-1 uppercase tracking-wider">{item.item_type}</span>
                            <div className="text-white font-bold text-sm line-clamp-1">{item.title || item.note || 'عنصر محفوظ'}</div>
                        </div>
                        <Link to={`/${item.item_type}/${item.item_id}`} className="p-2 bg-white/5 hover:bg-blue-500 text-gray-400 hover:text-white rounded-lg transition-colors">
                            <ExternalLink size={14} />
                        </Link>
                    </div>
                ))}
            </div>

            {/* Likes */}
            <div className="space-y-4">
                <h3 className="text-white font-bold flex items-center gap-2 mb-2">
                    <Heart size={16} className="text-rose-400" /> الإعجابات (Likes)
                </h3>
                {likes.map((item, i) => (
                    <div key={i} className="bg-[#0f0f16] border border-white/5 rounded-lg p-3 flex justify-between items-center group hover:border-rose-500/30 transition-colors">
                        <div>
                            <span className="text-[10px] text-gray-500 block mb-1 uppercase tracking-wider">{item.item_type}</span>
                            <div className="text-white font-bold text-sm line-clamp-1">{item.title || 'عنصر أعجبني'}</div>
                        </div>
                        <Link to={`/${item.item_type}/${item.item_id}`} className="p-2 bg-white/5 hover:bg-rose-500 text-gray-400 hover:text-white rounded-lg transition-colors">
                            <ExternalLink size={14} />
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};
