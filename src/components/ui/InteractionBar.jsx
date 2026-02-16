import React, { useState, useEffect } from 'react';
import { Heart, Bookmark } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function InteractionBar({ type, itemId, showView = false, onView, initialLikes = 0 }) {
    const { apiCall, user } = useAuth();
    const [liked, setLiked] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);
    const [loading, setLoading] = useState(false);

    // Load initial state
    useEffect(() => {
        if (!user) return;
        const checkStatus = async () => {
            try {
                const data = await apiCall('/interactions/me');
                if (data.likes[type]?.includes(itemId)) setLiked(true);
                if (data.bookmarks[type]?.includes(itemId)) setBookmarked(true);
            } catch (err) {
                console.error("Failed to fetch interactions", err);
            }
        };
        checkStatus();
    }, [user, type, itemId]);

    // Handle View (XP Award)
    useEffect(() => {
        if (showView && user && onView) {
            const markView = async () => {
                try {
                    const res = await apiCall('/interactions/view', {
                        method: 'POST',
                        body: JSON.stringify({ type, itemId })
                    });
                    if (res.xpAwarded > 0) {
                        onView(res.xpAwarded);
                    }
                } catch (e) {
                    console.error("Failed to record view", e);
                }
            };
            // Small delay to ensure user actually saw it
            const timer = setTimeout(markView, 2000);
            return () => clearTimeout(timer);
        }
    }, [showView, user, type, itemId]);

    const handleLike = async (e) => {
        e.stopPropagation();
        if (!user) return alert('يجب تسجيل الدخول للإعجاب');
        setLiked(!liked); // Optimistic UI
        try {
            await apiCall('/interactions/like', {
                method: 'POST',
                body: JSON.stringify({ type, itemId })
            });
        } catch (e) {
            setLiked(!liked); // Revert
            console.error(e);
        }
    };

    const handleBookmark = async (e) => {
        e.stopPropagation();
        if (!user) return alert('يجب تسجيل الدخول للحفظ');
        setBookmarked(!bookmarked); // Optimistic UI
        try {
            await apiCall('/interactions/bookmark', {
                method: 'POST',
                body: JSON.stringify({ type, itemId })
            });
        } catch (e) {
            setBookmarked(!bookmarked); // Revert
            console.error(e);
        }
    };

    return (
        <div className="flex items-center gap-3">
            <button
                onClick={handleLike}
                disabled={loading}
                className={`p-2 rounded-full transition-all ${liked ? 'bg-red-500/20 text-red-500' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'}`}
                title="أعجبني"
            >
                <Heart size={18} fill={liked ? "currentColor" : "none"} />
            </button>
            <button
                onClick={handleBookmark}
                disabled={loading}
                className={`p-2 rounded-full transition-all ${bookmarked ? 'bg-purple-500/20 text-purple-400' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'}`}
                title="حفظ"
            >
                <Bookmark size={18} fill={bookmarked ? "currentColor" : "none"} />
            </button>
        </div>
    );
}
