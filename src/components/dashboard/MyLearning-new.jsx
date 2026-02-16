import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    BookOpen, CheckCircle, Clock, PlayCircle, TrendingUp,
    Award, Target, Zap, ChevronRight, PauseCircle, 
    RotateCcw, Lock, Unlock, Star, Flame, Calendar
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { apiCall } from '../../context/AuthContext';

export const MyLearning = ({ enrollments, onProgressUpdate }) => {
    const [learningData, setLearningData] = useState({
        enrolledTracks: [],
        inProgressLessons: [],
        completedLessons: [],
        overallProgress: 0,
        totalLearningTime: 0,
        streakDays: 0,
        lastActivity: null
    });
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('all'); // all, in-progress, completed

    useEffect(() => {
        fetchLearningData();
    }, [enrollments]);

    const fetchLearningData = async () => {
        try {
            setLoading(true);
            
            // Fetch comprehensive learning progress
            const response = await apiCall('/user/learning-progress').catch(() => ({
                enrolledTracks: enrollments || [],
                inProgressLessons: [],
                completedLessons: [],
                overallProgress: 0,
                totalLearningTime: 0,
                streakDays: 0,
                lastActivity: null
            }));

            // Calculate overall progress
            const totalItems = (response.completedLessons?.length || 0) + (response.inProgressLessons?.length || 0);
            const overallProgress = totalItems > 0 
                ? Math.round((response.completedLessons?.length || 0) / totalItems * 100)
                : 0;

            setLearningData({
                enrolledTracks: response.enrolledTracks || enrollments || [],
                inProgressLessons: response.inProgressLessons || [],
                completedLessons: response.completedLessons || [],
                overallProgress,
                totalLearningTime: response.totalLearningTime || 0,
                streakDays: response.streakDays || 0,
                lastActivity: response.lastActivity
            });
        } catch (error) {
            console.error('Error fetching learning data:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateTrackProgress = (track) => {
        if (!track.courses) return 0;
        
        let totalLessons = 0;
        let completedLessons = 0;
        
        track.courses.forEach(course => {
            course.units?.forEach(unit => {
                unit.lessons?.forEach(lesson => {
                    totalLessons++;
                    if (lesson.is_completed) completedLessons++;
                });
            });
        });
        
        return totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
    };

    const continueLesson = async (lessonId) => {
        try {
            // Record lesson access for progress tracking
            await apiCall('/user/lesson-access', {
                method: 'POST',
                body: JSON.stringify({ lessonId, action: 'continue' })
            });
            
            if (onProgressUpdate) onProgressUpdate();
        } catch (error) {
            console.error('Error recording lesson access:', error);
        }
    };

    const markLessonComplete = async (lessonId) => {
        try {
            await apiCall('/user/complete-lesson', {
                method: 'POST',
                body: JSON.stringify({ lessonId })
            });
            
            // Refresh data
            fetchLearningData();
            if (onProgressUpdate) onProgressUpdate();
        } catch (error) {
            console.error('Error completing lesson:', error);
        }
    };

    const getFilteredEnrollments = () => {
        if (activeFilter === 'all') return learningData.enrolledTracks;
        if (activeFilter === 'completed') {
            return learningData.enrolledTracks.filter(track => calculateTrackProgress(track) === 100);
        }
        if (activeFilter === 'in-progress') {
            return learningData.enrolledTracks.filter(track => {
                const progress = calculateTrackProgress(track);
                return progress > 0 && progress < 100;
            });
        }
        return learningData.enrolledTracks;
    };

    const filteredEnrollments = getFilteredEnrollments();

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-10 h-10 border-4 border-green-500/20 border-t-green-500 rounded-full"
                />
            </div>
        );
    }

    if (!learningData.enrolledTracks || learningData.enrolledTracks.length === 0) {
        return (
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16 bg-gradient-to-b from-gray-900/50 to-gray-800/50 border border-white/10 rounded-2xl"
            >
                <div className="w-20 h-20 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <BookOpen className="w-10 h-10 text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">لم تسجل في أي مسار تعليمي بعد</h3>
                <p className="text-gray-400 text-sm mb-8 max-w-md mx-auto">
                    ابدأ رحلتك التعليمية الآن واستكشف المسارات المتاحة لتعلم الأمن السيبراني
                </p>
                <Link 
                    to="/articles"
                    className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-500 hover:to-emerald-500 transition-all font-bold shadow-lg shadow-green-500/25"
                >
                    <BookOpen className="w-5 h-5" />
                    <span>تصفح المسارات التعليمية</span>
                </Link>
            </motion.div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Progress Summary */}
            <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-gray-900/80 to-gray-800/80 border border-white/10 rounded-2xl p-6"
            >
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-500/20 rounded-xl">
                            <TrendingUp className="w-6 h-6 text-green-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">التقدم الكلي</h3>
                            <p className="text-gray-400 text-sm"> across all enrolled tracks</p>
                        </div>
                    </div>
                    <div className="text-left">
                        <span className="text-3xl font-bold text-white">{learningData.overallProgress}%</span>
                    </div>
                </div>
                
                <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${learningData.overallProgress}%` }}
                        transition={{ duration: 1 }}
                        className="h-full bg-gradient-to-l from-green-500 to-emerald-400 rounded-full"
                    />
                </div>
                
                <div className="flex items-center justify-between mt-4 text-sm">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-gray-400">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span>{learningData.completedLessons.length} درس مكتمل</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                            <PlayCircle className="w-4 h-4 text-blue-400" />
                            <span>{learningData.inProgressLessons.length} درس قيد التقدم</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                            <Clock className="w-4 h-4 text-yellow-400" />
                            <span>{Math.round(learningData.totalLearningTime / 60)} ساعة تعلم</span>
                        </div>
                    </div>
                    
                    {learningData.streakDays > 0 && (
                        <div className="flex items-center gap-2 text-orange-400">
                            <Flame className="w-4 h-4" />
                            <span>{learningData.streakDays} يوم تتالي 🔥</span>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {[
                    { id: 'all', label: 'الكل', count: learningData.enrolledTracks.length },
                    { id: 'in-progress', label: 'قيد التقدم', count: learningData.enrolledTracks.filter(t => {
                        const p = calculateTrackProgress(t);
                        return p > 0 && p < 100;
                    }).length },
                    { id: 'completed', label: 'مكتمل', count: learningData.enrolledTracks.filter(t => calculateTrackProgress(t) === 100).length }
                ].map(filter => (
                    <button
                        key={filter.id}
                        onClick={() => setActiveFilter(filter.id)}
                        className={`px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap transition-all ${
                            activeFilter === filter.id
                                ? 'bg-green-500 text-white'
                                : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                        }`}
                    >
                        {filter.label}
                        <span className={`mr-2 px-2 py-0.5 rounded-full text-xs ${
                            activeFilter === filter.id ? 'bg-white/20' : 'bg-white/10'
                        }`}>
                            {filter.count}
                        </span>
                    </button>
                ))}
            </div>

            {/* Enrolled Tracks Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AnimatePresence>
                    {filteredEnrollments.map((track, index) => {
                        const progress = calculateTrackProgress(track);
                        const isCompleted = progress === 100;
                        const isInProgress = progress > 0 && progress < 100;
                        
                        return (
                            <motion.div
                                key={track.id || index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ scale: 1.02, y: -2 }}
                                className={`relative overflow-hidden rounded-xl p-5 border transition-all cursor-pointer group ${
                                    isCompleted 
                                        ? 'bg-gradient-to-br from-green-900/30 to-emerald-900/30 border-green-500/30' 
                                        : 'bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-white/10 hover:border-green-500/30'
                                }`}
                            >
                                {/* Progress Ring Background */}
                                <div className="absolute -top-10 -right-10 w-40 h-40 opacity-10">
                                    <svg viewBox="0 0 100 100" className="transform -rotate-90">
                                        <circle
                                            cx="50" cy="50" r="45"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="8"
                                            className={isCompleted ? 'text-green-500' : 'text-gray-600'}
                                            strokeDasharray={`${progress * 2.83} 283`}
                                        />
                                    </svg>
                                </div>
                                
                                <div className="relative z-10">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                                                isCompleted 
                                                    ? 'bg-green-500/20 text-green-400' 
                                                    : 'bg-white/10 text-gray-400'
                                            }`}>
                                                {track.icon || <BookOpen className="w-6 h-6" />}
                                            </div>
                                            <div>
                                                <h3 className="text-white font-bold line-clamp-1">{track.title}</h3>
                                                <span className="text-xs text-gray-500">
                                                    {track.courses?.length || 0} كورس • {track.total_lessons || 0} درس
                                                </span>
                                            </div>
                                        </div>
                                        
                                        {isCompleted && (
                                            <div className="p-2 bg-green-500/20 rounded-lg">
                                                <Award className="w-5 h-5 text-green-400" />
                                            </div>
                                        )}
                                        {isInProgress && (
                                            <div className="p-2 bg-blue-500/20 rounded-lg">
                                                <PlayCircle className="w-5 h-5 text-blue-400" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="space-y-2 mb-4">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">التقدم</span>
                                            <span className={`font-bold ${isCompleted ? 'text-green-400' : 'text-white'}`}>
                                                {progress}%
                                            </span>
                                        </div>
                                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${progress}%` }}
                                                transition={{ duration: 0.8, delay: 0.2 }}
                                                className={`h-full rounded-full ${
                                                    isCompleted 
                                                        ? 'bg-gradient-to-l from-green-500 to-emerald-400' 
                                                        : 'bg-gradient-to-l from-blue-500 to-cyan-400'
                                                }`}
                                            />
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <Link 
                                        to={isCompleted ? `/articles/track/${track.id}/review` : `/articles/track/${track.id}`}
                                        onClick={() => !isCompleted && continueLesson(track.current_lesson_id)}
                                        className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-lg font-bold text-sm transition-all ${
                                            isCompleted
                                                ? 'bg-green-500/20 text-green-400 hover:bg-green-500 hover:text-white'
                                                : 'bg-white/10 text-white hover:bg-green-500'
                                        }`}
                                    >
                                        {isCompleted ? (
                                            <><RotateCcw className="w-4 h-4" /> مراجعة المسار</>
                                        ) : (
                                            <><PlayCircle className="w-4 h-4" /> {progress === 0 ? 'ابدأ المسار' : 'متابعة التعلم'}</>
                                        )}
                                    </Link>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* Continue Learning Section */}
            {learningData.inProgressLessons.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                            <Clock className="w-5 h-5 text-blue-400" />
                        </div>
                        <h3 className="text-lg font-bold text-white">واصل من حيث توقفت</h3>
                    </div>

                    <div className="space-y-3">
                        {learningData.inProgressLessons.slice(0, 3).map((lesson, index) => (
                            <motion.div
                                key={lesson.id || index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-900/80 to-gray-800/80 border border-white/10 rounded-xl hover:border-blue-500/30 transition-all cursor-pointer group"
                            >
                                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                    <PauseCircle className="w-6 h-6 text-blue-400" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-white font-bold text-sm">{lesson.title}</h4>
                                    <p className="text-gray-500 text-xs">{lesson.track_title} / {lesson.course_title}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="text-xs text-gray-400">
                                        تقدم: {lesson.progress}%
                                    </div>
                                    <button 
                                        onClick={() => continueLesson(lesson.id)}
                                        className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500 hover:text-white transition-all"
                                    >
                                        <PlayCircle className="w-5 h-5" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Achievements Section */}
            {learningData.completedLessons.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-yellow-500/20 rounded-lg">
                            <Star className="w-5 h-5 text-yellow-400" />
                        </div>
                        <h3 className="text-lg font-bold text-white">إنجازاتك</h3>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { 
                                icon: BookOpen, 
                                label: 'أول درس', 
                                achieved: learningData.completedLessons.length >= 1,
                                color: 'green'
                            },
                            { 
                                icon: Target, 
                                label: '10 دروس', 
                                achieved: learningData.completedLessons.length >= 10,
                                color: 'blue'
                            },
                            { 
                                icon: Zap, 
                                label: '1000 XP', 
                                achieved: false, // Would come from user data
                                color: 'yellow'
                            },
                            { 
                                icon: Flame, 
                                label: '7 أيام تتالي', 
                                achieved: learningData.streakDays >= 7,
                                color: 'orange'
                            }
                        ].map((achievement, index) => (
                            <div
                                key={index}
                                className={`p-4 rounded-xl border text-center transition-all ${
                                    achievement.achieved
                                        ? `bg-${achievement.color}-500/20 border-${achievement.color}-500/30`
                                        : 'bg-white/5 border-white/10 opacity-50'
                                }`}
                            >
                                <achievement.icon className={`w-8 h-8 mx-auto mb-2 ${
                                    achievement.achieved ? `text-${achievement.color}-400` : 'text-gray-500'
                                }`} />
                                <p className={`text-sm font-bold ${achievement.achieved ? 'text-white' : 'text-gray-500'}`}>
                                    {achievement.label}
                                </p>
                                {achievement.achieved && (
                                    <div className="mt-2">
                                        <CheckCircle className="w-4 h-4 text-green-400 mx-auto" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    );
};
