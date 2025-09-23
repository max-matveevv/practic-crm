'use client';

import React, { useState } from 'react';
import { Project } from '@/lib/types';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { ImageUpload } from '@/components/ui/ImageUpload';

interface NewTask {
    title: string;
    description: string;
    status: 'pending' | 'in_progress' | 'completed';
    project_id: number | undefined;
    priority: 1 | 2 | 3;
    images?: Array<{ filename: string; path: string; url: string; original_name: string; size: number }>;
}

interface AddTaskFormProps {
    projects: Project[];
    onSubmit: (task: NewTask) => Promise<void>;
    onCancel: () => void;
}

export function AddTaskForm({ projects, onSubmit, onCancel }: AddTaskFormProps) {
    const [newTask, setNewTask] = useState<NewTask>({
        title: '',
        description: '',
        status: 'pending',
        project_id: undefined,
        priority: 1,
        images: []
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(newTask);
        // Сброс формы после успешного добавления
        setNewTask({
            title: '',
            description: '',
            status: 'pending',
            project_id: undefined,
            priority: 1,
            images: []
        });
    };

    return (
        <form onSubmit={handleSubmit} className="mb-6 p-4 border border-white/10 rounded bg-bg-1">
            <h3 className="text-lg font-semibold mb-4">Добавить новую задачу</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Input
                        label="Название задачи"
                        type="text"
                        placeholder="Введите название задачи"
                        value={newTask.title}
                        onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-white mb-1">
                        Проект
                    </label>
                    <Select
                        value={newTask.project_id || ''}
                        onChange={(value) => setNewTask({...newTask, project_id: value ? Number(value) : undefined})}
                        options={[
                            { value: '', label: 'Без проекта' },
                            ...projects.map(project => ({
                                value: project.id,
                                label: project.title
                            }))
                        ]}
                        placeholder="Выберите проект"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-white mb-1">
                        Статус
                    </label>
                    <Select
                        value={newTask.status}
                        onChange={(value) => setNewTask({...newTask, status: value as 'pending' | 'in_progress' | 'completed'})}
                        options={[
                            { value: 'pending', label: 'Ожидает' },
                            { value: 'in_progress', label: 'В работе' },
                            { value: 'completed', label: 'Завершена' }
                        ]}
                        placeholder="Выберите статус"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-white mb-1">
                        Приоритет
                    </label>
                    <Select
                        value={newTask.priority}
                        onChange={(value) => setNewTask({...newTask, priority: Number(value) as 1 | 2 | 3})}
                        options={[
                            { value: 1, label: 'Низкий приоритет' },
                            { value: 2, label: 'Средний приоритет' },
                            { value: 3, label: 'Высокий приоритет' }
                        ]}
                        placeholder="Выберите приоритет"
                    />
                </div>
            </div>

            <div className="mt-4">
                <Textarea
                    label="Описание"
                    placeholder="Введите описание задачи"
                    value={newTask.description}
                    onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                    rows={3}
                />
            </div>

            <div className="mt-4">
                <ImageUpload
                    images={newTask.images || []}
                    onImagesChange={(images) => setNewTask({...newTask, images})}
                    maxImages={5}
                    maxSize={5}
                />
            </div>

            <div className="mt-4 flex gap-2">
                <Button type="submit">
                    Добавить задачу
                </Button>
                <Button type="button" variant="secondary" onClick={onCancel}>
                    Отмена
                </Button>
            </div>
        </form>
    );
}
