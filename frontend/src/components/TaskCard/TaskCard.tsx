'use client';

import React, { useState } from 'react';
import { Task, TaskImage } from '@/lib/types';
import { TaskCardView } from './TaskCardView';
import { TaskCardEdit } from './TaskCardEdit';

interface TaskCardProps {
    task: Task;
    projects: Array<{ id: number; title: string }>;
    onUpdateTask: (taskId: number, updates: Partial<Task>) => Promise<void>;
    onDeleteTask: (taskId: number) => Promise<void>;
}

export function TaskCard({ task, projects, onUpdateTask, onDeleteTask }: TaskCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        title: task.title,
        description: task.description || '',
        priority: task.priority,
        project_id: task.project_id || undefined,
        images: task.images || []
    });
    
    // Lightbox state
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const handleSave = async () => {
        try {
            await onUpdateTask(task.id, editData);
            setIsEditing(false);
        } catch (error) {
            console.error('Ошибка при сохранении задачи:', error);
        }
    };

    const handleCancel = () => {
        setEditData({
            title: task.title,
            description: task.description || '',
            priority: task.priority,
            project_id: task.project_id || undefined,
            images: task.images || []
        });
        setIsEditing(false);
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleDelete = () => {
        onDeleteTask(task.id);
    };

    // Lightbox functions
    const openLightbox = (index: number) => {
        setCurrentImageIndex(index);
        setLightboxOpen(true);
    };

    const closeLightbox = () => {
        setLightboxOpen(false);
    };

    const nextImage = () => {
        const currentImages = isEditing ? editData.images : task.images;
        if (currentImages && currentImageIndex < currentImages.length - 1) {
            setCurrentImageIndex(currentImageIndex + 1);
        }
    };

    const prevImage = () => {
        if (currentImageIndex > 0) {
            setCurrentImageIndex(currentImageIndex - 1);
        }
    };

    const handleDataChange = (data: {
        title?: string;
        description?: string;
        priority?: 1 | 2 | 3;
        project_id?: number;
        images?: TaskImage[];
    }) => {
        setEditData(prev => ({ ...prev, ...data }));
    };

    if (isEditing) {
        return (
            <TaskCardEdit
                editData={editData}
                projects={projects}
                onSave={handleSave}
                onCancel={handleCancel}
                onDataChange={handleDataChange}
            />
        );
    }

    return (
        <TaskCardView
            task={task}
            projects={projects}
            onUpdateTask={onUpdateTask}
            onDeleteTask={onDeleteTask}
            onEdit={handleEdit}
            onDelete={handleDelete}
            lightboxOpen={lightboxOpen}
            currentImageIndex={currentImageIndex}
            onOpenLightbox={openLightbox}
            onCloseLightbox={closeLightbox}
            onNextImage={nextImage}
            onPrevImage={prevImage}
        />
    );
}
