import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpen, ChevronLeft, ChevronDown, FileText,
    Monitor, Folder, Disc, Circle, CheckCircle, Search, Menu, X, Shield, Lock, Unlock,
    PlayCircle, Layout, Loader2
} from 'lucide-react';
import { lmsAPI } from '../services/api';
import LessonViewer from '../components/LessonViewer';

export default function KnowledgeBase() {
    // Data State
    const [syllabus, setSyllabus] = useState([]); // Full tree
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Expansion State
    const [expandedItems, setExpandedItems] = useState({});

    // View State
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile toggle

    // Initial Load - Fetch Full Syllabus
    useEffect(() => {
        setIsLoading(true);
        lmsAPI.getSyllabus()
            .then(response => {
                console.log("Full Syllabus Loaded:", response);
                // Handle both response formats: direct array or wrapped in data
                const data = response.data || response;
                setSyllabus(data || []);
            })
            .catch(err => {
                console.error("Error loading syllabus:", err);
                // Set empty array to prevent infinite loading
                setSyllabus([]);
            })
            .finally(() => setIsLoading(false));
    }, []);

    // Handlers
    const toggleExpand = (id) => {
        setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleSelectLesson = (lesson) => {
        console.log("Selected Lesson:", lesson);
        setSelectedLesson(lesson);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        // On mobile, close sidebar after selection
        if (window.innerWidth < 768) setSidebarOpen(false);
    };

    // Filter Logic
    const filterSyllabus = (items) => {
        if (!searchQuery) return items;
        return items.map(item => {
            const matches = item.title.toLowerCase().includes(searchQuery.toLowerCase());
            const courses = item.courses ? filterSyllabus(item.courses) : [];
            const units = item.units ? filterSyllabus(item.units) : [];
            const lessons = item.lessons ? filterSyllabus(item.lessons) : [];

            if (matches || courses.length > 0 || units.length > 0 || lessons.length > 0) {
                return { ...item, courses, units, lessons };
            }
            return null;
        }).filter(Boolean);
    };

    const filteredSyllabus = filterSyllabus(syllabus);

    // Recursive Tree Renderer (RTL Optimized)
    const renderTree = (items, level = 0) => {
        if (!items || items.length === 0) return null;

        return items.map(item => {
            const hasChildren = (item.courses && item.courses.length > 0) ||
                (item.units && item.units.length > 0) ||
                (item.lessons && item.lessons.length > 0);

            const isLesson = level === 3; // Track=0, Course=1, Unit=2, Lesson=3
            const isExpanded = expandedItems[item.id] || searchQuery; // Auto-expand on search

            // RTL Indentation (paddingRight)
            const paddingRight = `${(level * 16) + 16}px`;

            if (isLesson) {
                return (
                    <button
                        key={item.id}
                        onClick={() => handleSelectLesson(item)}
                        className={`w-full flex items-center py-2.5 pl-2 text-right text-sm transition-all border-r-2
                            ${selectedLesson?.id === item.id
                                ? 'bg-green-500/20 text-green-400 border-green-500 font-bold'
                                : 'border-transparent text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                            }`}
                        style={{ paddingRight }}
                    >
                        <FileText className="w-4 h-4 ml-2 opacity-70 flex-shrink-0" />
                        <span className="truncate">{item.title}</span>
                    </button>
                );
            }

            return (
                <div key={item.id}>
                    <button
                        onClick={() => toggleExpand(item.id)}
                        className={`w-full flex items-center justify-between py-3 pl-2 text-right transition-colors group
                            ${level === 0 ? 'bg-gray-800/50 border-y border-gray-700/50 text-white font-bold hover:bg-gray-800' : ''}
                            ${level === 1 ? 'text-cyan-400 hover:text-cyan-300 font-medium' : ''}
                            ${level === 2 ? 'text-purple-400 hover:text-purple-300' : ''}
                        `}
                        style={{ paddingRight: level === 0 ? '16px' : paddingRight }}
                    >
                        <div className="flex items-center overflow-hidden">
                            {level === 0 && <Folder className="w-5 h-5 ml-2 text-green-500 flex-shrink-0" />}
                            {level === 1 && <BookOpen className="w-4 h-4 ml-2 opacity-70 flex-shrink-0" />}
                            {level === 2 && <Disc className="w-4 h-4 ml-2 opacity-70 flex-shrink-0" />}
                            <span className={`truncate ${level === 0 ? 'text-base' : 'text-sm'}`}>{item.title}</span>
                        </div>
                        {hasChildren && (
                            <ChevronLeft className={`w-4 h-4 transition-transform flex-shrink-0 text-gray-500 ${isExpanded ? '-rotate-90' : ''}`} />
                        )}
                    </button>

                    <AnimatePresence>
                        {isExpanded && hasChildren && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden bg-gray-900/30"
                            >
                                {renderTree(item.courses || item.units || item.lessons, level + 1)}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            );
        });
    };

    return (
        <div className="flex flex-row-reverse h-[calc(100vh-80px)] w-full bg-gray-950 text-white overflow-hidden font-sans" dir="rtl">

            {/* Sidebar Toggle (Mobile) */}
            <button
                className="md:hidden fixed top-24 right-4 z-50 p-2 bg-gray-800 rounded-md border border-green-500/30 text-green-500 shadow-lg"
                onClick={() => setSidebarOpen(!sidebarOpen)}
            >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar - Recursive Tree (Right Side - 300px) */}
            <div
                className={`
                    w-[300px] bg-gray-900 border-l border-gray-800 flex flex-col
                    fixed inset-y-0 right-0 z-40 md:static transition-transform duration-300 shadow-2xl pt-20 md:pt-0
                    ${sidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
                `}
            >
                {/* Search Bar at Top */}
                <div className="p-4 border-b border-gray-800 bg-gray-900/95 backdrop-blur-sm">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                        <Shield className="w-6 h-6 ml-3 text-green-500" />
                        قاعدة المعرفة
                    </h2>
                    <div className="relative group">
                        <Search className="absolute right-3 top-2.5 text-gray-500 w-4 h-4 group-focus-within:text-green-500 transition-colors" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="بحث في الوحدات..."
                            className="w-full bg-gray-950 border border-gray-700 rounded-lg py-2 pr-10 pl-4 text-sm text-gray-200 focus:border-green-500 focus:outline-none transition-all placeholder:text-gray-600"
                        />
                    </div>
                </div>

                {/* Tree View */}
                <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-500 animate-pulse">
                            <Loader2 className="w-10 h-10 mb-4 opacity-50 animate-spin" />
                            <span className="text-xs font-mono">جاري تحميل المحتوى...</span>
                        </div>
                    ) : filteredSyllabus.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-500 px-4 text-center">
                            <div className="bg-gray-800 p-4 rounded-full mb-4">
                                <Search className="w-8 h-8 opacity-50" />
                            </div>
                            <p className="text-sm">لا توجد نتائج مطابقة لبحثك</p>
                        </div>
                    ) : (
                        <div className="pb-10">
                            {renderTree(filteredSyllabus)}
                        </div>
                    )}
                </div>

                {/* User Stats / Footer */}
                <div className="p-4 border-t border-gray-800 bg-gray-900/50">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-2 font-mono" dir="ltr">
                        <div className="flex items-center space-x-1">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            <span className="text-green-500 ml-2">SYSTEM ONLINE</span>
                        </div>
                        <span>V2.1.0</span>
                    </div>
                </div>
            </div>

            {/* Main Content Area (Left Side - Flex Grow) */}
            <div className="flex-1 flex flex-col h-full relative overflow-y-auto bg-gray-950 scrollbar-thin scrollbar-thumb-green-900 scrollbar-track-transparent">
                
                {/* Empty State - Modern Card Design */}
                <AnimatePresence mode="wait">
                    {!selectedLesson && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center justify-center h-full p-8"
                        >
                            <div className="text-center max-w-2xl">
                                <div className="mb-8 relative group">
                                    <div className="absolute inset-0 bg-green-500 blur-[100px] opacity-5 animate-pulse"></div>
                                    <div className="relative bg-gray-800/50 border border-gray-700 rounded-2xl p-12 backdrop-blur-sm">
                                        <Layout className="w-24 h-24 text-gray-600 mx-auto mb-6 group-hover:text-green-500/50 transition-colors duration-500" />
                                        <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">
                                            اختر درساً للبدء
                                        </h2>
                                        <p className="text-gray-400 text-lg leading-relaxed mb-6">
                                            اختر وحدة من القائمة الجانبية لبدء رحلة التعلم. 
                                            كل درس مصمم لتزويدك بالمهارات العملية في الأمن السيبراني.
                                        </p>
                                        <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
                                            <div className="flex items-center">
                                                <BookOpen className="w-4 h-4 ml-2" />
                                                <span>دروس تفاعلية</span>
                                            </div>
                                            <div className="flex items-center">
                                                <Shield className="w-4 h-4 ml-2" />
                                                <span>محتوى متخصص</span>
                                            </div>
                                            <div className="flex items-center">
                                                <PlayCircle className="w-4 h-4 ml-2" />
                                                <span>تطبيق عملي</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Lesson View */}
                <AnimatePresence mode="wait">
                    {selectedLesson && (
                        <motion.div
                            key={selectedLesson.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                            className="flex-1"
                        >
                            <LessonViewer lesson={selectedLesson} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Overlay for mobile when sidebar is open */}
            {sidebarOpen && (
                <div
                    className="md:hidden fixed inset-0 z-30 bg-black/80 backdrop-blur-sm"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
}
