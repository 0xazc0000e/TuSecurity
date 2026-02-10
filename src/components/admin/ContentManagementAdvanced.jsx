import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    Database, FileText, Image, Video, Music, Code, Archive,
    Upload, Download, Search, Filter, Plus, Edit, Trash2,
    Eye, EyeOff, Lock, Unlock, Share2, Copy, Move,
    Folder, FolderOpen, Clock, TrendingUp, HardDrive,
    Cloud, Server, Shield, Activity, Calendar, User
} from 'lucide-react';

export default function ContentManagementAdvanced() {
    const [files, setFiles] = useState([
        {
            id: 1,
            name: 'bash-curriculum-v2.json',
            type: 'json',
            size: '2.4 MB',
            category: 'curriculum',
            uploadDate: '2024-01-20',
            modifiedDate: '2024-01-20',
            downloads: 145,
            status: 'active',
            author: 'أحمد محمد',
            description: 'منهج Bash المحسن مع شرح نظري',
            tags: ['bash', 'curriculum', 'advanced']
        },
        {
            id: 2,
            name: 'simulator-screenshot.png',
            type: 'image',
            size: '1.8 MB',
            category: 'media',
            uploadDate: '2024-01-19',
            modifiedDate: '2024-01-19',
            downloads: 89,
            status: 'active',
            author: 'فاطمة علي',
            description: 'صورة شاشة للمحاكي الثلاثي الأبعاد',
            tags: ['screenshot', '3d', 'simulator']
        },
        {
            id: 3,
            name: 'security-scenarios.zip',
            type: 'archive',
            size: '15.2 MB',
            category: 'scenarios',
            uploadDate: '2024-01-18',
            modifiedDate: '2024-01-18',
            downloads: 234,
            status: 'active',
            author: 'محمد خالد',
            description: 'حزمة سيناريوهات الأمان المتقدمة',
            tags: ['security', 'scenarios', 'advanced']
        }
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [filterType, setFilterType] = useState('all');
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [viewMode, setViewMode] = useState('grid'); // grid or list
    const [sortBy, setSortBy] = useState('date'); // date, name, size, downloads

    const filteredFiles = files.filter(file => {
        const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           file.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           file.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesCategory = filterCategory === 'all' || file.category === filterCategory;
        const matchesType = filterType === 'all' || file.type === filterType;
        return matchesSearch && matchesCategory && matchesType;
    }).sort((a, b) => {
        switch (sortBy) {
            case 'name':
                return a.name.localeCompare(b.name);
            case 'size':
                return parseFloat(b.size) - parseFloat(a.size);
            case 'downloads':
                return b.downloads - a.downloads;
            case 'date':
            default:
                return new Date(b.uploadDate) - new Date(a.uploadDate);
        }
    });

    const getFileIcon = (type) => {
        const icons = {
            json: Code,
            js: Code,
            jsx: Code,
            html: Code,
            css: Code,
            image: Image,
            png: Image,
            jpg: Image,
            jpeg: Image,
            gif: Image,
            video: Video,
            mp4: Video,
            avi: Video,
            music: Music,
            mp3: Music,
            wav: Music,
            archive: Archive,
            zip: Archive,
            rar: Archive,
            pdf: FileText,
            doc: FileText,
            docx: FileText
        };
        return icons[type] || FileText;
    };

    const getTypeBadge = (type) => {
        const colors = {
            json: 'bg-blue-500/20 text-blue-400',
            js: 'bg-yellow-500/20 text-yellow-400',
            jsx: 'bg-purple-500/20 text-purple-400',
            image: 'bg-green-500/20 text-green-400',
            video: 'bg-red-500/20 text-red-400',
            music: 'bg-pink-500/20 text-pink-400',
            archive: 'bg-orange-500/20 text-orange-400',
            pdf: 'bg-indigo-500/20 text-indigo-400',
            doc: 'bg-cyan-500/20 text-cyan-400'
        };
        return colors[type] || 'bg-gray-500/20 text-gray-400';
    };

    const getCategoryBadge = (category) => {
        const styles = {
            curriculum: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
            media: 'bg-green-500/20 text-green-400 border-green-500/30',
            scenarios: 'bg-red-500/20 text-red-400 border-red-500/30',
            documents: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
            code: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
        };
        const labels = {
            curriculum: 'منهج',
            media: 'وسائط',
            scenarios: 'سيناريوهات',
            documents: 'مستندات',
            code: 'أكواد'
        };
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${styles[category] || 'bg-gray-500/20 text-gray-400'}`}>
                {labels[category] || category}
            </span>
        );
    };

    const formatFileSize = (size) => {
        const [value, unit] = size.split(' ');
        return `${value} ${unit === 'MB' ? 'ميجابايت' : unit === 'KB' ? 'كيلوبايت' : unit}`;
    };

    const handleFileUpload = (event) => {
        const uploadedFiles = Array.from(event.target.files);
        // Handle file upload logic here
        console.log('Uploading files:', uploadedFiles);
    };

    const handleFileAction = (fileId, action) => {
        setFiles(prev => prev.map(file => {
            if (file.id === fileId) {
                switch (action) {
                    case 'lock':
                        return { ...file, status: 'locked' };
                    case 'unlock':
                        return { ...file, status: 'active' };
                    case 'delete':
                        return { ...file, status: 'deleted' };
                    default:
                        return file;
                }
            }
            return file;
        }));
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">إدارة المحتوى</h2>
                    <p className="text-gray-400">إدارة الملفات والمحتوى التعليمي</p>
                </div>
                <div className="flex gap-3">
                    <label className="px-6 py-3 bg-gradient-to-r from-[#7112AF] to-[#ff006e] text-white font-bold rounded-xl hover:shadow-[0_0_30px_rgba(113,18,175,0.5)] transition-all duration-300 flex items-center gap-2 cursor-pointer">
                        <Upload size={20} />
                        رفع ملفات
                        <input
                            type="file"
                            multiple
                            onChange={handleFileUpload}
                            className="hidden"
                        />
                    </label>
                    <button className="px-6 py-3 bg-white/10 border border-white/20 text-white font-bold rounded-xl hover:bg-white/20 transition-colors flex items-center gap-2">
                        <Folder size={20} />
                        مجلد جديد
                    </button>
                </div>
            </div>

            {/* Storage Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-xl p-6"
                >
                    <div className="flex items-center justify-between mb-4">
                        <HardDrive className="text-blue-400" size={24} />
                        <span className="text-green-400 text-sm">75%</span>
                    </div>
                    <div className="text-3xl font-bold text-white mb-2">45.2 GB</div>
                    <div className="text-gray-400 text-sm">مساحة التخزين المستخدمة</div>
                    <div className="w-full bg-white/10 rounded-full h-2 mt-3">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" style={{ width: '75%' }} />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gradient-to-br from-green-500/10 to-blue-500/10 border border-green-500/30 rounded-xl p-6"
                >
                    <div className="flex items-center justify-between mb-4">
                        <Database className="text-green-400" size={24} />
                        <span className="text-green-400 text-sm">+12%</span>
                    </div>
                    <div className="text-3xl font-bold text-white mb-2">{files.length}</div>
                    <div className="text-gray-400 text-sm">إجمالي الملفات</div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-xl p-6"
                >
                    <div className="flex items-center justify-between mb-4">
                        <TrendingUp className="text-yellow-400" size={24} />
                        <span className="text-green-400 text-sm">+24%</span>
                    </div>
                    <div className="text-3xl font-bold text-white mb-2">
                        {files.reduce((acc, file) => acc + file.downloads, 0).toLocaleString()}
                    </div>
                    <div className="text-gray-400 text-sm">إجمالي التحميلات</div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gradient-to-br from-red-500/10 to-purple-500/10 border border-red-500/30 rounded-xl p-6"
                >
                    <div className="flex items-center justify-between mb-4">
                        <Cloud className="text-red-400" size={24} />
                        <span className="text-green-400 text-sm">نشط</span>
                    </div>
                    <div className="text-3xl font-bold text-white mb-2">99.9%</div>
                    <div className="text-gray-400 text-sm">مدة التشغيل</div>
                </motion.div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="relative">
                        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="البحث عن ملفات..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pr-12 pl-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#7112AF] transition-colors"
                        />
                    </div>

                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-[#7112AF] transition-colors"
                    >
                        <option value="all">جميع الفئات</option>
                        <option value="curriculum">منهج</option>
                        <option value="media">وسائط</option>
                        <option value="scenarios">سيناريوهات</option>
                        <option value="documents">مستندات</option>
                        <option value="code">أكواد</option>
                    </select>

                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-[#7112AF] transition-colors"
                    >
                        <option value="all">جميع الأنواع</option>
                        <option value="json">JSON</option>
                        <option value="image">صور</option>
                        <option value="video">فيديو</option>
                        <option value="archive">مضغوط</option>
                        <option value="pdf">PDF</option>
                    </select>

                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-[#7112AF] transition-colors"
                    >
                        <option value="date">التاريخ</option>
                        <option value="name">الاسم</option>
                        <option value="size">الحجم</option>
                        <option value="downloads">التحميلات</option>
                    </select>

                    <div className="flex gap-2">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`flex-1 px-4 py-3 rounded-lg transition-colors ${
                                viewMode === 'grid' 
                                    ? 'bg-[#7112AF]/20 text-[#7112AF]' 
                                    : 'bg-white/10 text-gray-400 hover:bg-white/20'
                            }`}
                        >
                            <Grid size={20} className="mx-auto" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`flex-1 px-4 py-3 rounded-lg transition-colors ${
                                viewMode === 'list' 
                                    ? 'bg-[#7112AF]/20 text-[#7112AF]' 
                                    : 'bg-white/10 text-gray-400 hover:bg-white/20'
                            }`}
                        >
                            <List size={20} className="mx-auto" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Files Display */}
            {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredFiles.map((file, index) => {
                        const Icon = getFileIcon(file.type);
                        return (
                            <motion.div
                                key={file.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-[#7112AF]/50 transition-all duration-300 group"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`p-3 ${getTypeBadge(file.type)} rounded-lg`}>
                                        <Icon size={24} />
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                                            <Eye size={16} className="text-gray-400" />
                                        </button>
                                        <button className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                                            <Download size={16} className="text-gray-400" />
                                        </button>
                                    </div>
                                </div>

                                <h3 className="font-bold text-white mb-2 truncate">{file.name}</h3>
                                <p className="text-sm text-gray-400 mb-3 line-clamp-2">{file.description}</p>

                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm text-gray-400">{formatFileSize(file.size)}</span>
                                    <span className="text-sm text-gray-400">{file.downloads} تحميل</span>
                                </div>

                                <div className="flex items-center justify-between">
                                    {getCategoryBadge(file.category)}
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                                        file.status === 'active' 
                                            ? 'bg-green-500/20 text-green-400'
                                            : file.status === 'locked'
                                            ? 'bg-yellow-500/20 text-yellow-400'
                                            : 'bg-red-500/20 text-red-400'
                                    }`}>
                                        {file.status === 'active' ? 'نشط' : file.status === 'locked' ? 'مقفل' : 'محذوف'}
                                    </span>
                                </div>

                                <div className="mt-3 pt-3 border-t border-white/10">
                                    <div className="flex items-center justify-between text-xs text-gray-400">
                                        <span>{file.author}</span>
                                        <span>{file.uploadDate}</span>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            ) : (
                <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="px-6 py-4 text-right">
                                        <input
                                            type="checkbox"
                                            checked={selectedFiles.length === filteredFiles.length}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedFiles(filteredFiles.map(f => f.id));
                                                } else {
                                                    setSelectedFiles([]);
                                                }
                                            }}
                                            className="rounded border-white/20 bg-white/10 text-[#7112AF] focus:ring-[#7112AF]"
                                        />
                                    </th>
                                    <th className="px-6 py-4 text-right text-gray-400 font-bold">الملف</th>
                                    <th className="px-6 py-4 text-right text-gray-400 font-bold">الفئة</th>
                                    <th className="px-6 py-4 text-right text-gray-400 font-bold">الحجم</th>
                                    <th className="px-6 py-4 text-right text-gray-400 font-bold">التحميلات</th>
                                    <th className="px-6 py-4 text-right text-gray-400 font-bold">المؤلف</th>
                                    <th className="px-6 py-4 text-right text-gray-400 font-bold">التاريخ</th>
                                    <th className="px-6 py-4 text-right text-gray-400 font-bold">الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredFiles.map((file, index) => {
                                    const Icon = getFileIcon(file.type);
                                    return (
                                        <motion.tr
                                            key={file.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="border-b border-white/5 hover:bg-white/5 transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedFiles.includes(file.id)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setSelectedFiles(prev => [...prev, file.id]);
                                                        } else {
                                                            setSelectedFiles(prev => prev.filter(id => id !== file.id));
                                                        }
                                                    }}
                                                    className="rounded border-white/20 bg-white/10 text-[#7112AF] focus:ring-[#7112AF]"
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`p-2 ${getTypeBadge(file.type)} rounded-lg`}>
                                                        <Icon size={16} />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-white">{file.name}</div>
                                                        <div className="text-sm text-gray-400">{file.description}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">{getCategoryBadge(file.category)}</td>
                                            <td className="px-6 py-4 text-white">{formatFileSize(file.size)}</td>
                                            <td className="px-6 py-4 text-white">{file.downloads}</td>
                                            <td className="px-6 py-4 text-white">{file.author}</td>
                                            <td className="px-6 py-4 text-white">{file.uploadDate}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors">
                                                        <Eye size={16} />
                                                    </button>
                                                    <button className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors">
                                                        <Download size={16} />
                                                    </button>
                                                    <button className="p-2 bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/30 transition-colors">
                                                        <Edit size={16} />
                                                    </button>
                                                    <button className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

// Add missing icons
const Grid = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
    </svg>
);

const List = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <line x1="8" y1="6" x2="21" y2="6" />
        <line x1="8" y1="12" x2="21" y2="12" />
        <line x1="8" y1="18" x2="21" y2="18" />
        <line x1="3" y1="6" x2="3.01" y2="6" />
        <line x1="3" y1="12" x2="3.01" y2="12" />
        <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
);
