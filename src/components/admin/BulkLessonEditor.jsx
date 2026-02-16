import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Upload, X, GripVertical, Save, FileText } from 'lucide-react';
import axios from 'axios';

const BulkLessonEditor = ({ unitId, onSave }) => {
    const [lessons, setLessons] = useState([]);
    const [isUploading, setIsUploading] = useState(false);

    // 1. معالجة الملفات المرفوعة دفعة واحدة
    const handleFileUpload = async (e) => {
        const files = Array.from(e.target.files);
        const newLessons = [];

        for (const file of files) {
            const text = await file.text();
            newLessons.push({
                id: `temp-${Date.now()}-${Math.random()}`, // ID مؤقت للترتيب
                title: file.name.replace('.md', ''),
                content: text,
                xp_reward: 100,
                video_url: '',
                unit_id: unitId
            });
        }

        setLessons((prev) => [...prev, ...newLessons]);
    };

    // 2. إعادة الترتيب بالسحب والإفلات
    const handleOnDragEnd = (result) => {
        if (!result.destination) return;
        const items = Array.from(lessons);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setLessons(items);
    };

    // 3. الحفظ النهائي للسيرفر
    const handleSaveAll = async () => {
        setIsUploading(true);
        try {
            // إرسال الدروس بالترتيب الجديد
            for (let i = 0; i < lessons.length; i++) {
                await axios.post('/api/lms/lessons', {
                    ...lessons[i],
                    sort_order: i // نحفظ الترتيب
                });
            }
            alert('✅ تم رفع جميع الدروس بنجاح!');
            setLessons([]);
            if (onSave) onSave();
        } catch (error) {
            alert('❌ حدث خطأ أثناء الحفظ: ' + error.message);
        } finally {
            setIsUploading(false);
        }
    };

    const removeLesson = (index) => {
        const newLessons = [...lessons];
        newLessons.splice(index, 1);
        setLessons(newLessons);
    };

    return (
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-700 mt-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl text-green-400 font-bold flex items-center gap-2">
                    <FileText /> رفع دروس متعددة (Bulk Upload)
                </h3>

                {/* زر رفع الملفات */}
                <label className="cursor-pointer bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all">
                    <Upload size={18} />
                    <span>اختر ملفات Markdown</span>
                    <input
                        type="file"
                        multiple
                        accept=".md"
                        className="hidden"
                        onChange={handleFileUpload}
                    />
                </label>
            </div>

            {/* منطقة السحب والإفلات */}
            <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId="lessons-list">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                            {lessons.map((lesson, index) => (
                                <Draggable key={lesson.id} draggableId={lesson.id} index={index}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            className="bg-gray-800 p-4 rounded-lg border border-gray-600 flex items-center gap-4 group hover:border-green-500 transition-colors"
                                        >
                                            <div {...provided.dragHandleProps} className="text-gray-500 cursor-grab hover:text-white">
                                                <GripVertical size={20} />
                                            </div>

                                            <div className="flex-1">
                                                <input
                                                    value={lesson.title}
                                                    onChange={(e) => {
                                                        const updated = [...lessons];
                                                        updated[index].title = e.target.value;
                                                        setLessons(updated);
                                                    }}
                                                    className="bg-transparent text-white font-bold w-full border-none focus:ring-0"
                                                />
                                                <p className="text-xs text-gray-400">
                                                    {lesson.content.substring(0, 50)}...
                                                </p>
                                            </div>

                                            <button onClick={() => removeLesson(index)} className="text-red-400 hover:text-red-300">
                                                <X size={20} />
                                            </button>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>

            {lessons.length > 0 && (
                <div className="mt-6 flex justify-end">
                    <button
                        onClick={handleSaveAll}
                        disabled={isUploading}
                        className="bg-green-600 hover:bg-green-500 text-black font-bold px-6 py-3 rounded-lg flex items-center gap-2 shadow-lg shadow-green-900/20"
                    >
                        {isUploading ? 'جاري الرفع...' : 'حفظ ونشر الكل'} <Save size={20} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default BulkLessonEditor;