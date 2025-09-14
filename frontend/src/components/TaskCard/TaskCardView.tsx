'use client';

import React from 'react';
import { Task } from '@/lib/types';
import { Select } from '@/components/ui/Select';
import { Lightbox } from '@/components/ui/Lightbox';

interface TaskCardViewProps {
    task: Task;
    projects: Array<{ id: number; title: string }>;
    onUpdateTask: (taskId: number, updates: Partial<Task>) => Promise<void>;
    onDeleteTask: (taskId: number) => Promise<void>;
    onEdit: () => void;
    onDelete: () => void;
    // Lightbox props
    lightboxOpen: boolean;
    currentImageIndex: number;
    onOpenLightbox: (index: number) => void;
    onCloseLightbox: () => void;
    onNextImage: () => void;
    onPrevImage: () => void;
}

export function TaskCardView({
    task,
    onUpdateTask,
    onEdit,
    onDelete,
    lightboxOpen,
    currentImageIndex,
    onOpenLightbox,
    onCloseLightbox,
    onNextImage,
    onPrevImage
}: TaskCardViewProps) {

    const getPriorityColor = (priority: number) => {
        switch (priority) {
            case 1: return 'text-white';
            case 2: return 'text-yellow-500';
            case 3: return 'text-red';
            default: return 'text-gray-800';
        }
    };


    const getPriorityText = (priority: number) => {
        switch (priority) {
            case 1: return 'Низкий';
            case 2: return 'Средний';
            case 3: return 'Высокий';
            default: return priority.toString();
        }
    };

    return (
        <>
            <div 
                className={`border border-white/10 rounded p-4 ${task.status === 'completed' ? 'opacity-20' : ''}`}
            >
                <div className="flex justify-between items-start">
                    <div className="flex-1">
                        <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex flex-col gap-2">
                                <h3 className="font-semibold text-white">{task.title}</h3>
                            </div>
                            
                            <div className="flex gap-2">
                                <span className={`px-2 py-1 rounded text-xs flex items-center justify-center border border-white/10 ${getPriorityColor(task.priority)}`}>
                                    Приоритет: {getPriorityText(task.priority)}
                                </span>

                                <Select
                                    value={task.status}
                                    onChange={(value) => onUpdateTask(task.id, { status: value as 'pending' | 'in_progress' | 'completed' })}
                                    options={[
                                        { value: 'pending', label: 'Ожидает' },
                                        { value: 'in_progress', label: 'В работе' },
                                        { value: 'completed', label: 'Завершена' }
                                    ]}
                                    className="w-32"
                                />

                                <button
                                    onClick={onEdit}
                                    className="px-2 py-1 rounded text-sm transition-colors border border-white/10 text-white hover:text-blue-500 cursor-pointer"
                                    title="Редактировать задачу"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </button>

                                <button
                                    onClick={onDelete}
                                    className="px-2 py-1 rounded text-sm transition-colors border border-white/10 text-white hover:text-red-500 cursor-pointer"
                                    title="Удалить задачу"
                                >
                                    <svg className="w-4 h-4" width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M11 8V15M7 8V15M3 4V15.8C3 16.9201 3 17.4798 3.21799 17.9076C3.40973 18.2839 3.71547 18.5905 4.0918 18.7822C4.5192 19 5.07899 19 6.19691 19H11.8031C12.921 19 13.48 19 13.9074 18.7822C14.2837 18.5905 14.5905 18.2839 14.7822 17.9076C15 17.4802 15 16.921 15 15.8031V4M3 4H5M3 4H1M5 4H13M5 4C5 3.06812 5 2.60241 5.15224 2.23486C5.35523 1.74481 5.74432 1.35523 6.23438 1.15224C6.60192 1 7.06812 1 8 1H10C10.9319 1 11.3978 1 11.7654 1.15224C12.2554 1.35523 12.6447 1.74481 12.8477 2.23486C12.9999 2.6024 13 3.06812 13 4M13 4H15M15 4H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        
                        {task.description && (
                            <p className="text-white/70 text-sm my-4">{task.description}</p>
                        )}

                        {task.images && task.images.length > 0 && (
                            <div className="my-4">
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                    {task.images.map((image, index) => (
                                        <div key={index} className="relative group">
                                            <img
                                                src={image.url}
                                                alt={image.original_name}
                                                className="w-full h-24 object-cover rounded-lg border border-white/10 cursor-pointer hover:opacity-80 transition-opacity"
                                                onClick={() => onOpenLightbox(index)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        <div className="flex items-center justify-between">
                            {task.project && (
                                <p className='text-xs text-white/50'>Проект: <span className='text-blue-400'>{task.project.title}</span></p>
                            )}

                            <div className="text-xs text-white/50 space-y-1 flex items-center gap-2 justify-end">
                                <p className='mb-0'>Создано: {new Date(task.created_at).toLocaleString('ru-RU')}</p>
                                {task.updated_at !== task.created_at && (
                                    <p className='mb-0'>Обновлено: {new Date(task.updated_at).toLocaleString('ru-RU')}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lightbox */}
            <Lightbox
                isOpen={lightboxOpen}
                onClose={onCloseLightbox}
                images={task.images || []}
                currentIndex={currentImageIndex}
                onNext={onNextImage}
                onPrev={onPrevImage}
            />
        </>
    );
}
