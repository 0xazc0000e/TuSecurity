import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpen, ChevronLeft, ChevronRight, ChevronDown, FileText,
    Monitor, Folder, Disc, PlayCircle, CheckCircle, Clock, Award,
    Search, Menu, X, Shield, Lock, Unlock, Users, BarChart3,
    Target, Zap, ArrowRight, ArrowLeft, Home, List, Grid, Filter,
    Star, TrendingUp, Calendar, User, Settings, LogOut
} from 'lucide-react';
import { lmsAPI } from '../services/api';
import LessonViewer from '../components/LessonViewer';

export default function Articles() {
    // Data State
    const [syllabus, setSyllabus] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('tree'); // tree, grid, list
    const [filterCategory, setFilterCategory] = useState('all');

    // Navigation State
    const [expandedItems, setExpandedItems] = useState({});
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [currentPath, setCurrentPath] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Progress State
    const [userProgress, setUserProgress] = useState({});
    const [completedLessons, setCompletedLessons] = useState(new Set());

    // Initial Load
    useEffect(() => {
        setIsLoading(true);
        lmsAPI.getSyllabus()
            .then(response => {
                const data = response.data || response;
                setSyllabus(data || []);
                console.log("Articles - Syllabus loaded:", data);
            })
            .catch(err => {
                console.error("Error loading syllabus:", err);
                setSyllabus([]);
            })
            .finally(() => setIsLoading(false));
    }, []);

    // Navigation Functions
    const toggleExpand = (id) => {
        setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleSelectLesson = (lesson, path = []) => {
        console.log("Selected lesson:", lesson);
        setSelectedLesson(lesson);
        setCurrentPath(path);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (window.innerWidth < 768) setSidebarOpen(false);
    };

    const navigateToAdjacentLesson = (direction) => {
        if (!selectedLesson || !currentPath.length) return;

        // Find current lesson in structure and get next/previous
        const { track, course, unit } = currentPath[currentPath.length - 1];
        // Implementation for navigation logic would go here
        console.log(`Navigate ${direction} from lesson:`, selectedLesson.id);
    };

    // Progress Functions
    const markLessonComplete = (lessonId) => {
        setCompletedLessons(prev => new Set([...prev, lessonId]));
        // Update user progress in backend
        console.log("Lesson completed:", lessonId);
    };

    // Filter Logic
    const filterSyllabus = (items) => {
        if (!searchQuery && filterCategory === 'all') return items;
        
        return items.map(item => {
            const matchesSearch = !searchQuery || 
                item.title.toLowerCase().includes(searchQuery.toLowerCase());
            
            const matchesCategory = filterCategory === 'all' || 
                item.category === filterCategory;
            
            const courses = item.courses ? filterSyllabus(item.courses) : [];
            const units = item.units ? filterSyllabus(item.units) : [];
            const lessons = item.lessons ? filterSyllabus(item.lessons) : [];

            if ((matchesSearch && matchesCategory) || courses.length > 0 || units.length > 0 || lessons.length > 0) {
                return { ...item, courses, units, lessons };
            }
            return null;
        }).filter(Boolean);
    };

    const filteredSyllabus = filterSyllabus(syllabus);

    // Calculate Progress
    const calculateProgress = (items) => {
        let totalLessons = 0;
        let completedCount = 0;

        const countLessons = (item) => {
            if (item.lessons) {
                item.lessons.forEach(lesson => {
                    totalLessons++;
                    if (completedLessons.has(lesson.id)) completedCount++;
                });
            }
            if (item.courses) item.courses.forEach(countLessons);
            if (item.units) item.units.forEach(countLessons);
        };

        items.forEach(countLessons);
        return totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0;
    };

    const overallProgress = calculateProgress(syllabus);

    // Tree Renderer
    const renderTree = (items, level = 0, parentPath = []) => {
        if (!items || items.length === 0) return null;

        return items.map(item => {
            const hasChildren = (item.courses && item.courses.length > 0) ||
                (item.units && item.units.length > 0) ||
                (item.lessons && item.lessons.length > 0);

            const isLesson = level === 3;
            const isExpanded = expandedItems[item.id] || searchQuery;
            const itemPath = [...parentPath, item];
            const paddingRight = `${(level * 16) + 16}px`;

            // Calculate item progress
            const itemProgress = calculateProgress([item]);
            const isCompleted = completedLessons.has(item.id);

            if (isLesson) {
                return (
                    <button
                        key={item.id}
                        onClick={() => handleSelectLesson(item, itemPath)}
                        className={`w-full flex items-center py-2.5 pl-2 text-right text-sm transition-all border-r-2 group
                            ${selectedLesson?.id === item.id
                                ? 'bg-green-500/20 text-green-400 border-green-500 font-bold'
                                : 'border-transparent text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                            }`}
                        style={{ paddingRight }}
                    >
                        <div className="flex items-center flex-1">
                            {isCompleted && (
                                <CheckCircle className="w-4 h-4 ml-2 text-green-500 flex-shrink-0" />
                            )}
                            <FileText className="w-4 h-4 ml-2 opacity-70 flex-shrink-0" />
                            <span className="truncate">{item.title}</span>
                        </div>
                        {item.xp_reward && (
                            <span className="text-xs text-yellow-400 ml-2">+{item.xp_reward}XP</span>
                        )}
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
                        <div className="flex items-center">
                            {level === 0 && itemProgress > 0 && (
                                <div className="text-xs text-green-400 ml-2">
                                    {Math.round(itemProgress)}%
                                </div>
                            )}
                            {hasChildren && (
                                <ChevronLeft className={`w-4 h-4 transition-transform flex-shrink-0 text-gray-500 ${isExpanded ? '-rotate-90' : ''}`} />
                            )}
                        </div>
                    </button>

                    <AnimatePresence>
                        {isExpanded && hasChildren && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden bg-gray-900/30"
                            >
                                {renderTree(item.courses || item.units || item.lessons, level + 1, itemPath)}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            );
        });
    };

    // Grid View Renderer
    const renderGridView = (items) => {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map(item => (
                    <motion.div
                        key={item.id}
                        whileHover={{ y: -4 }}
                        className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:border-green-500/50 transition-all cursor-pointer"
                        onClick={() => item.lessons && handleSelectLesson(item.lessons[0])}
                    >
                        <div className="flex items-center mb-4">
                            <Folder className="w-8 h-8 text-green-500 ml-3" />
                            <h3 className="text-lg font-bold text-white">{item.title}</h3>
                        </div>
                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                            {item.description || 'تعلم المهارات الأساسية في هذا المسار'}
                        </p>
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500">
                                {item.courses?.length || 0} مواد
                            </span>
                            {calculateProgress([item]) > 0 && (
                                <span className="text-green-400">
                                    {Math.round(calculateProgress([item]))}% مكتمل
                                </span>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
        );
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

            {/* Sidebar - Navigation Map */}
            <div
                className={`
                    w-[320px] bg-gray-900 border-l border-gray-800 flex flex-col
                    fixed inset-y-0 right-0 z-40 md:static transition-transform duration-300 shadow-2xl pt-20 md:pt-0
                    ${sidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
                `}
            >
                {/* Header */}
                <div className="p-4 border-b border-gray-800 bg-gray-900/95 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-white flex items-center">
                            <BookOpen className="w-6 h-6 ml-3 text-green-500" />
                            المقالات والدروس
                        </h2>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setViewMode('tree')}
                                className={`p-2 rounded ${viewMode === 'tree' ? 'bg-green-500/20 text-green-400' : 'text-gray-500 hover:text-gray-300'}`}
                            >
                                <List size={16} />
                            </button>
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-green-500/20 text-green-400' : 'text-gray-500 hover:text-gray-300'}`}
                            >
                                <Grid size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="relative group mb-4">
                        <Search className="absolute right-3 top-2.5 text-gray-500 w-4 h-4 group-focus-within:text-green-500 transition-colors" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="بحث في الدروس..."
                            className="w-full bg-gray-950 border border-gray-700 rounded-lg py-2 pr-10 pl-4 text-sm text-gray-200 focus:border-green-500 focus:outline-none transition-all placeholder:text-gray-600"
                        />
                    </div>

                    {/* Progress Overview */}
                    <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                        <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-gray-400">إجمالي التقدم</span>
                            <span className="text-green-400 font-bold">{Math.round(overallProgress)}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                            <div 
                                className="bg-gradient-to-l from-green-500 to-green-400 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${overallProgress}%` }}
                            />
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                            <span>{completedLessons.size} درس مكتمل</span>
                            <span>{overallProgress > 0 ? 'ممتاز!' : 'ابدأ التعلم'}</span>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-500 animate-pulse">
                            <BookOpen className="w-10 h-10 mb-4 opacity-50 animate-pulse" />
                            <span className="text-xs font-mono">جاري تحميل المحتوى...</span>
                        </div>
                    ) : filteredSyllabus.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-500 px-4 text-center">
                            <div className="bg-gray-800 p-4 rounded-full mb-4">
                                <Search className="w-8 h-8 opacity-50" />
                            </div>
                            <p className="text-sm">لا توجد نتائج مطابقة لبحثك</p>
                        </div>
                    ) : viewMode === 'tree' ? (
                        <div className="pb-10">
                            {renderTree(filteredSyllabus)}
                        </div>
                    ) : (
                        <div className="p-4">
                            {renderGridView(filteredSyllabus)}
                        </div>
                    )}
                </div>

                {/* Current Path Indicator */}
                {currentPath.length > 0 && (
                    <div className="p-4 border-t border-gray-800 bg-gray-900/50">
                        <div className="text-xs text-gray-500 mb-1">موقعك الحالي:</div>
                        <div className="text-sm text-gray-300 truncate">
                            {currentPath.map((item, index) => (
                                <span key={item.id}>
                                    {item.title}
                                    {index < currentPath.length - 1 && ' / '}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-full relative overflow-y-auto bg-gray-950 scrollbar-thin scrollbar-thumb-green-900 scrollbar-track-transparent">
                
                {/* Empty State */}
                <AnimatePresence mode="wait">
                    {!selectedLesson && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center justify-center h-full p-8"
                        >
                            <div className="text-center max-w-3xl">
                                <div className="mb-8 relative group">
                                    <div className="absolute inset-0 bg-green-500 blur-[100px] opacity-5 animate-pulse"></div>
                                    <div className="relative bg-gray-800/50 border border-gray-700 rounded-2xl p-16 backdrop-blur-sm">
                                        <BookOpen className="w-32 h-32 text-gray-600 mx-auto mb-8 group-hover:text-green-500/30 transition-colors duration-500" />
                                        <h2 className="text-4xl font-bold text-white mb-6 tracking-tight">
                                            مكتبة المقالات والدروس
                                        </h2>
                                        <p className="text-gray-400 text-xl leading-relaxed mb-8">
                                            اختر درساً من القائمة الجانبية لبدء رحلة التعلم. 
                                            كل درس مصمم لتزويدك بالمهارات العملية في الأمن السيبراني.
                                        </p>
                                        
                                        {/* Features Grid */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                            <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700">
                                                <Target className="w-12 h-12 text-green-500 mx-auto mb-4" />
                                                <h3 className="text-lg font-bold text-white mb-2">منهج منظم</h3>
                                                <p className="text-gray-400 text-sm">4 مستويات من التعلم: مسارات → مواد → وحدات → دروس</p>
                                            </div>
                                            <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700">
                                                <Zap className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                                                <h3 className="text-lg font-bold text-white mb-2">محتوى تفاعلي</h3>
                                                <p className="text-gray-400 text-sm">فيديوهات، أكواد برمجية، ومحاكيات عملية</p>
                                            </div>
                                            <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700">
                                                <Award className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                                                <h3 className="text-lg font-bold text-white mb-2">تتبع التقدم</h3>
                                                <p className="text-gray-400 text-sm">نقاط خبرة XP وشهادات إنجاز</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
                                            <div className="flex items-center">
                                                <BookOpen className="w-5 h-5 ml-2" />
                                                <span>{syllabus.length} مسار تعليمي</span>
                                            </div>
                                            <div className="flex items-center">
                                                <Users className="w-5 h-5 ml-2" />
                                                <span>500+ طالب نشط</span>
                                            </div>
                                            <div className="flex items-center">
                                                <TrendingUp className="w-5 h-5 ml-2" />
                                                <span>معدل إنجاز 85%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Lesson View with Navigation */}
                <AnimatePresence mode="wait">
                    {selectedLesson && (
                        <motion.div
                            key={selectedLesson.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                            className="flex-1 flex flex-col"
                        >
                            {/* Navigation Bar */}
                            <div className="bg-gray-900/50 border-b border-gray-800 p-4 flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <button
                                        onClick={() => setSelectedLesson(null)}
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        <ArrowRight size={20} />
                                    </button>
                                    <div className="text-sm text-gray-400">
                                        {currentPath.map((item, index) => (
                                            <span key={item.id}>
                                                {item.title}
                                                {index < currentPath.length - 1 && ' / '}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => navigateToAdjacentLesson('previous')}
                                        className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                                        disabled
                                    >
                                        <ArrowLeft size={16} />
                                    </button>
                                    <button
                                        onClick={() => markLessonComplete(selectedLesson.id)}
                                        className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg font-bold transition-all flex items-center"
                                    >
                                        <CheckCircle className="w-4 h-4 ml-2" />
                                        إكمال الدرس
                                    </button>
                                    <button
                                        onClick={() => navigateToAdjacentLesson('next')}
                                        className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                                        disabled
                                    >
                                        <ArrowRight size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* Lesson Content */}
                            <div className="flex-1 p-6">
                                <LessonViewer lesson={selectedLesson} />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="md:hidden fixed inset-0 z-30 bg-black/80 backdrop-blur-sm"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
}
