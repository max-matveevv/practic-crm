'use client';

import React from 'react';
import { TaskImage } from '@/lib/types';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { ImageUpload } from '@/components/ui/ImageUpload';

interface TaskCardEditProps {
    editData: {
        title: string;
        description: string;
        priority: 1 | 2 | 3;
        project_id?: number;
        images: TaskImage[];
    };
    projects: Array<{ id: number; title: string }>;
    onSave: () => void;
    onCancel: () => void;
    onDataChange: (data: {
        title?: string;
        description?: string;
        priority?: 1 | 2 | 3;
        project_id?: number;
        images?: TaskImage[];
    }) => void;
}

export function TaskCardEdit({
    editData,
    projects,
    onSave,
    onCancel,
    onDataChange
}: TaskCardEditProps) {
    return (
        <>
            <div className="border border-white/10 rounded p-4 bg-bg-1">
                <div className="space-y-4">
                    <div>
                        <Input
                            label="Название задачи"
                            type="text"
                            value={editData.title}
                            onChange={(e) => onDataChange({...editData, title: e.target.value})}
                            placeholder="Введите название задачи"
                            required
                        />
                    </div>
                    
                    <div>
                        <Textarea
                            label="Описание"
                            value={editData.description}
                            onChange={(e) => onDataChange({...editData, description: e.target.value})}
                            placeholder="Введите описание задачи"
                            rows={3}
                        />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-white mb-1">
                                Приоритет
                            </label>
                            <Select
                                value={editData.priority}
                                onChange={(value) => onDataChange({...editData, priority: Number(value) as 1 | 2 | 3})}
                                options={[
                                    { value: 1, label: 'Низкий приоритет' },
                                    { value: 2, label: 'Средний приоритет' },
                                    { value: 3, label: 'Высокий приоритет' }
                                ]}
                                placeholder="Выберите приоритет"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-white mb-1">
                                Проект
                            </label>
                            <Select
                                value={editData.project_id || ''}
                                onChange={(value) => onDataChange({...editData, project_id: value ? Number(value) : undefined})}
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
                    </div>
                    
                    <div className="mt-4">
                        <ImageUpload
                            images={editData.images || []}
                            onImagesChange={(images) => onDataChange({...editData, images})}
                            maxImages={5}
                            maxSize={5}
                        />
                    </div>
                    
                    <div className="flex gap-2">
                        <Button onClick={onSave}>
                            Сохранить
                        </Button>
                        <Button variant="secondary" onClick={onCancel}>
                            Отмена
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}
