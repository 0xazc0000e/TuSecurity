import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Bookmark, Heart, ExternalLink, Trash2, BookOpen, 
    Clock, Tag, Search, Filter, Grid, List, X,
    AlertCircle, CheckCircle, Star, MoreVertical,
    Folder, FileText, PlayCircle, ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { apiCall } from '../../context/AuthContext';

export const SavedItems = ({ likes: initialLikes, bookmarks: initialBookmarks, onUpdate }) => {
    const [savedItems, setSavedItems] = useState({
        bookmarks: [],
        likes: [],
        readingList: [],
        folders: []
    });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('bookmarks');
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('grid');
    const [selectedFolder, setSelectedFolder] = useState(null);
    const [showCreateFolder, setShowCreateFolder] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');
    const [itemToDelete, setItemToDelete] = useState(null);

    // Fetch saved items with full details
    const fetchSavedItems = useCallback(async () => {
        try {
            setLoading(true);
            
            // Fetch comprehensive saved items
            const response = await apiCall('/user/saved-items').catch(() => ({
                bookmarks: initialBookmarks || [],
                likes: initialLikes || [],
                readingList: [],
                folders: [
                    { id: 1, name: 'المفضلة', icon: '⭐', count: 0 },
                    { id: 2, name: 'للقراءة لاحقاً', icon: '📖', count: 0 },
                    { id: 3, name: 'مراجعات', icon: '📝', count: 0 }
                ]
            }));

            setSavedItems({
                bookmarks: response.bookmarks || initialBookmarks || [],
                likes: response.likes || initialLikes || [],
                readingList: response.readingList || [],
                folders: response.folders || [
                    { id: 'default', name: 'الكل', icon: '📁', count: (response.bookmarks || initialBookmarks || []).length },
                    { id: 'favorites', name: 'المفضلة', icon: '⭐', count: 0 },
                    { id: 'reading', name: 'للقراءة لاحقاً', icon: '📖', count: 0 }
                ]
            });
        } catch (error) {
            console.error('Error fetching saved items:', error);
        } finally {
            setLoading(false);
        }
    }, [initialBookmarks, initialLikes]);

    useEffect(() => {
        fetchSavedItems();
    }, [fetchSavedItems]);

    // Remove from bookmarks
    const removeBookmark = async (itemId, itemType) => {
        try {
            await apiCall('/user/bookmarks/remove', {
                method: 'POST',
                body: JSON.stringify({ itemId, itemType })
            });

            // Update local state
            setSavedItems(prev => ({
                ...prev,
                bookmarks: prev.bookmarks.filter(item => !(item.item_id === itemId && item.item_type === itemType))
            }));

            setItemToDelete(null);
            if (onUpdate) onUpdate();
        } catch (error) {
            console.error('Error removing bookmark:', error);
        }
    };

    // Remove from likes
    const removeLike = async (itemId, itemType) => {
        try {
            await apiCall('/user/likes/remove', {
                method: 'POST',
                body: JSON.stringify({ itemId, itemType })
            });

            setSavedItems(prev => ({
                ...prev,
                likes: prev.likes.filter(item => !(item.item_id === itemId && item.item_type === itemType))
            }));

            setItemToDelete(null);
            if (onUpdate) onUpdate();
        } catch (error) {
            console.error('Error removing like:', error);
        }
    };

    // Add to reading list
    const addToReadingList = async (item) => {
        try {
            await apiCall('/user/reading-list/add', {
                method: 'POST',
                body: JSON.stringify({ itemId: item.item_id, itemType: item.item_type })
            });

            setSavedItems(prev => ({
                ...prev,
                readingList: [...prev.readingList, { ...item, added_at: new Date().toISOString() }]
            }));
        } catch (error) {
            console.error('Error adding to reading list:', error);
        }
    };

    // Create new folder
    const createFolder = async () => {
        if (!newFolderName.trim()) return;

        try {
            const response = await apiCall('/user/folders/create', {
                method: 'POST',
                body: JSON.stringify({ name: newFolderName, icon: '📁' })
            });

            setSavedItems(prev => ({
                ...prev,
                folders: [...prev.folders, { ...response.folder, count: 0 }]
            }));

            setNewFolderName('');
            setShowCreateFolder(false);
        } catch (error) {
            console.error('Error creating folder:', error);
        }
    };

    // Move item to folder
    const moveToFolder = async (item, folderId) => {
        try {
            await apiCall('/user/bookmarks/move', {
                method: 'POST',
                body: JSON.stringify({ itemId: item.item_id, folderId })
            });

            fetchSavedItems();
        } catch (error) {
            console.error('Error moving to folder:', error);
        }
    };

    // Filter items based on search and folder
    const getFilteredItems = () => {
        let items = savedItems[activeTab] || [];
        
        // Filter by folder
        if (selectedFolder && selectedFolder !== 'default') {
            items = items.filter(item => item.folder_id === selectedFolder);
        }
        
        // Filter by search
        if (searchQuery) {
            items = items.filter(item => 
                item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.note?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.item_type?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        
        return items;
    };

    const filteredItems = getFilteredItems();

    const getItemIcon = (type) => {
        switch(type) {
            case 'article': return FileText;
            case 'lesson': return BookOpen;
            case 'video': return PlayCircle;
            case 'track': return Folder;
            default: return Bookmark;
        }
    };

    const getItemColor = (type) => {
        switch(type) {
            case 'article': return 'blue';
            case 'lesson': return 'green';
            case 'video': return 'red';
            case 'track': return 'purple';
            default: return 'gray';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full"
                />
            </div>
        );
    }

    const totalItems = savedItems.bookmarks.length + savedItems.likes.length + savedItems.readingList.length;

    if (totalItems === 0) {
        return (
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16 bg-gradient-to-b from-gray-900/50 to-gray-800/50 border border-white/10 rounded-2xl"
            >
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Bookmark className="w-10 h-10 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">المحفوظات فارغة</h3>
                <p className="text-gray-400 text-sm mb-8 max-w-md mx-auto">
                    ابدأ بحفظ المحتوى المفيد أثناء التعلم. يمكنك حفظ المقالات والدروس للوصول إليها لاحقاً.
                </p>
                <div className="flex items-center justify-center gap-4">
                    <Link 
                        to="/articles"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-500 hover:to-cyan-500 transition-all font-bold shadow-lg shadow-blue-500/25"
                    >
                        <BookOpen className="w-5 h-5" />
                        <span>تصفح المقالات</span>
                    </Link>
                    <Link 
                        to="/knowledge"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all font-bold"
                    >
                        <Folder className="w-5 h-5" />
                        <span>المسارات التعليمية</span>
                    </Link>
                </div>
            </motion.div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header with Stats */}
            <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1">المحفوظات</h2>
                    <p className="text-gray-400 text-sm">
                        {savedItems.bookmarks.length} محفوظ • {savedItems.likes.length} إعجاب • {savedItems.readingList.length} قائمة قراءة
                    </p>
                </div>
                
                <div className="flex items-center gap-3">
                    {/* View Mode Toggle */}
                    <div className="flex items-center bg-white/5 rounded-lg p-1">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-white'}`}
                        >
                            <Grid className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-white'}`}
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Search Bar */}
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative"
            >
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="البحث في المحفوظات..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pr-12 pl-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-all"
                />
                {searchQuery && (
                    <button 
                        onClick={() => setSearchQuery('')}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
            </motion.div>

            {/* Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {[
                    { id: 'bookmarks', label: 'المحفوظات', icon: Bookmark, count: savedItems.bookmarks.length },
                    { id: 'likes', label: 'الإعجابات', icon: Heart, count: savedItems.likes.length },
                    { id: 'reading', label: 'للقراءة', icon: Clock, count: savedItems.readingList.length }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap transition-all ${
                            activeTab === tab.id
                                ? 'bg-blue-500 text-white'
                                : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                        }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        <span>{tab.label}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                            activeTab === tab.id ? 'bg-white/20' : 'bg-white/10'
                        }`}>
                            {tab.count}
                        </span>
                    </button>
                ))}
            </div>

            {/* Folders */}
            {activeTab === 'bookmarks' && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-3 overflow-x-auto pb-2"
                >
                    {savedItems.folders.map(folder => (
                        <button
                            key={folder.id}
                            onClick={() => setSelectedFolder(folder.id === selectedFolder ? null : folder.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap transition-all ${
                                selectedFolder === folder.id
                                    ? 'bg-green-500 text-white'
                                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                            }`}
                        >
                            <span>{folder.icon}</span>
                            <span>{folder.name}</span>
                            <span className={`px-1.5 py-0.5 rounded text-xs ${
                                selectedFolder === folder.id ? 'bg-white/20' : 'bg-white/10'
                            }`}>
                                {folder.count}
                            </span>
                        </button>
                    ))}
                    
                    <button
                        onClick={() => setShowCreateFolder(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm text-gray-400 hover:text-white hover:bg-white/10 transition-all border border-dashed border-white/20"
                    >
                        <span>+</span>
                        <span>مجلد جديد</span>
                    </button>
                </motion.div>
            )}

            {/* Create Folder Modal */}
            {showCreateFolder && (
                <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 border border-white/10 rounded-xl p-4"
                >
                    <div className="flex items-center gap-3">
                        <input
                            type="text"
                            value={newFolderName}
                            onChange={(e) => setNewFolderName(e.target.value)}
                            placeholder="اسم المجلد..."
                            className="flex-1 bg-white/10 border border-white/20 rounded-lg py-2 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                            autoFocus
                        />
                        <button
                            onClick={createFolder}
                            disabled={!newFolderName.trim()}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            إنشاء
                        </button>
                        <button
                            onClick={() => { setShowCreateFolder(false); setNewFolderName(''); }}
                            className="px-4 py-2 bg-white/10 text-gray-400 rounded-lg font-bold hover:text-white hover:bg-white/20 transition-all"
                        >
                            إلغاء
                        </button>
                    </div>
                </motion.div>
            )}

            {/* Items Grid/List */}
            {filteredItems.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                    <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>لا توجد نتائج مطابقة للبحث</p>
                </div>
            ) : (
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-3'}>
                    <AnimatePresence>
                        {filteredItems.map((item, index) => {
                            const ItemIcon = getItemIcon(item.item_type);
                            const color = getItemColor(item.item_type);
                            
                            return (
                                <motion.div
                                    key={`${item.item_id}-${item.item_type}`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ delay: index * 0.05 }}
                                    whileHover={{ scale: 1.02 }}
                                    className={`group relative bg-gradient-to-r from-gray-900/80 to-gray-800/80 border border-white/10 rounded-xl overflow-hidden hover:border-blue-500/30 transition-all ${
                                        viewMode === 'list' ? 'flex items-center p-4' : 'p-5'
                                    }`}
                                >
                                    {/* Item Icon */}
                                    <div className={`${viewMode === 'list' ? 'ml-4' : 'mb-4'}`}>
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-${color}-500/20`}>
                                            <ItemIcon className={`w-6 h-6 text-${color}-400`} />
                                        </div>
                                    </div>
                                    
                                    {/* Item Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <span className={`text-[10px] uppercase tracking-wider text-${color}-400 font-bold`}>
                                                    {item.item_type}
                                                </span>
                                                <h4 className="text-white font-bold text-sm line-clamp-1 mt-1">
                                                    {item.title || item.note || 'عنصر محفوظ'}
                                                </h4>
                                            </div>
                                            
                                            {/* Actions */}
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => setItemToDelete(item)}
                                                    className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                                    title="حذف"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                                
                                                {activeTab === 'bookmarks' && (
                                                    <div className="relative group/folder">
                                                        <button className="p-2 text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all">
                                                            <Folder className="w-4 h-4" />
                                                        </button>
                                                        {/* Folder Dropdown */}
                                                        <div className="absolute top-full left-0 mt-1 w-48 bg-gray-900 border border-white/10 rounded-lg shadow-xl opacity-0 invisible group-hover/folder:opacity-100 group-hover/folder:visible transition-all z-10">
                                                            {savedItems.folders.map(folder => (
                                                                <button
                                                                    key={folder.id}
                                                                    onClick={() => moveToFolder(item, folder.id)}
                                                                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/10 transition-all first:rounded-t-lg last:rounded-b-lg"
                                                                >
                                                                    <span>{folder.icon}</span>
                                                                    <span>{folder.name}</span>
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        
                                        {/* Meta Info */}
                                        <div className="flex items-center gap-4 text-xs text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {new Date(item.saved_at || item.created_at).toLocaleDateString('ar-SA')}
                                            </span>
                                            {item.reading_time && (
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {item.reading_time} دقيقة
                                                </span>
                                            )}
                                            {item.tags && item.tags.length > 0 && (
                                                <span className="flex items-center gap-1">
                                                    <Tag className="w-3 h-3" />
                                                    {item.tags.slice(0, 2).join(', ')}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {/* Open Button */}
                                    <Link 
                                        to={`/${item.item_type}/${item.item_id}`}
                                        className={`${viewMode === 'list' ? 'mr-4' : 'mt-4'} flex items-center justify-center gap-2 px-4 py-2 bg-white/5 hover:bg-blue-500 text-gray-400 hover:text-white rounded-lg transition-all font-bold text-sm`}
                                    >
                                        <span>فتح</span>
                                        <ExternalLink className="w-4 h-4" />
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {itemToDelete && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
                    onClick={() => setItemToDelete(null)}
                >
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-gray-900 border border-white/10 rounded-2xl p-6 max-w-md w-full mx-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center gap-3 mb-4 text-red-400">
                            <AlertCircle className="w-6 h-6" />
                            <h3 className="text-lg font-bold">تأكيد الحذف</h3>
                        </div>
                        <p className="text-gray-400 mb-6">
                            هل أنت متأكد من حذف "{itemToDelete.title || 'هذا العنصر'}" من {activeTab === 'bookmarks' ? 'المحفوظات' : 'الإعجابات'}؟
                        </p>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => {
                                    if (activeTab === 'bookmarks') {
                                        removeBookmark(itemToDelete.item_id, itemToDelete.item_type);
                                    } else {
                                        removeLike(itemToDelete.item_id, itemToDelete.item_type);
                                    }
                                }}
                                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition-all"
                            >
                                حذف
                            </button>
                            <button
                                onClick={() => setItemToDelete(null)}
                                className="flex-1 px-4 py-2 bg-white/10 text-gray-400 rounded-lg font-bold hover:text-white hover:bg-white/20 transition-all"
                            >
                                إلغاء
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
};
