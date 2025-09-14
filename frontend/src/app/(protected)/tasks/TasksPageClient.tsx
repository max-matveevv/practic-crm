'use client';

import React, { useState, useEffect } from 'react';
import { Task, Project } from '@/lib/types';
import { fetchTasks, addTask, updateTask, deleteTask } from '@/api/tasks';
import { fetchProjects } from '@/api/projects';
import { TaskCard } from '@/components/TaskCard/TaskCard';
import { AddTaskForm } from '@/components/TaskCard/AddTaskForm';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

export default function TasksPageClient() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [filterProject, setFilterProject] = useState<string>('');
    const [filterStatus, setFilterStatus] = useState<string>('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [tasksData, projectsData] = await Promise.all([
                fetchTasks(),
                fetchProjects()
            ]);
            setTasks(tasksData);
            setProjects(projectsData);
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddTask = async (taskData: {
        title: string;
        description: string;
        status: 'pending' | 'in_progress' | 'completed';
        project_id: number | undefined;
        priority: 1 | 2 | 3;
    }) => {
        try {
            const task = await addTask(taskData);
            setTasks([task, ...tasks]);
            setShowAddForm(false);
        } catch (error) {
            console.error('Ошибка добавления задачи:', error);
        }
    };

    const handleUpdateTask = async (taskId: number, updates: Partial<Task>) => {
        try {
            const updatedTask = await updateTask(taskId, updates);
            setTasks(tasks.map(task => 
                task.id === taskId ? updatedTask : task
            ));
        } catch (error) {
            console.error('Ошибка обновления задачи:', error);
        }
    };

    const handleDeleteTask = async (taskId: number) => {
        try {
            await deleteTask(taskId);
            setTasks(tasks.filter(task => task.id !== taskId));
        } catch (error) {
            console.error('Ошибка удаления задачи:', error);
        }
    };

    const filteredTasks = tasks.filter(task => {
        if (filterProject && task.project_id !== Number(filterProject)) return false;
        if (filterStatus && task.status !== filterStatus) return false;
        return true;
    }).sort((a, b) => {
        // Сначала по статусу (в работе -> ожидает -> завершена)
        const statusOrder = { 'in_progress': 0, 'pending': 1, 'completed': 2 };
        if (statusOrder[a.status] !== statusOrder[b.status]) {
            return statusOrder[a.status] - statusOrder[b.status];
        }
        
        // Затем по дате создания (новые сверху)
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    if (loading) {
        return <div className="p-6">Загрузка...</div>;
    }

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-white">Задачи</h1>
                <Button 
                    onClick={() => setShowAddForm(!showAddForm)}
                >
                    {showAddForm ? 'Отмена' : 'Добавить задачу'}
                </Button>
            </div>

            {/* Фильтры */}
            <div className="mb-6 flex gap-4">
                <div className="w-48">
                    <Select
                        value={filterProject}
                        onChange={(value) => setFilterProject(String(value))}
                        options={[
                            { value: '', label: 'Все проекты' },
                            ...projects.map(project => ({
                                value: project.id.toString(),
                                label: project.title
                            }))
                        ]}
                        placeholder="Фильтр по проекту"
                    />
                </div>

                <div className="w-48">
                    <Select
                        value={filterStatus}
                        onChange={(value) => setFilterStatus(String(value))}
                        options={[
                            { value: '', label: 'Все статусы' },
                            { value: 'pending', label: 'Ожидает' },
                            { value: 'in_progress', label: 'В работе' },
                            { value: 'completed', label: 'Завершена' }
                        ]}
                        placeholder="Фильтр по статусу"
                    />
                </div>
            </div>

            {/* Форма добавления */}
            {showAddForm && (
                <AddTaskForm
                    projects={projects}
                    onSubmit={handleAddTask}
                    onCancel={() => setShowAddForm(false)}
                />
            )}

            {/* Список задач */}
            <div className="space-y-4">
                {filteredTasks.map(task => (
                    <TaskCard
                        key={task.id}
                        task={task}
                        projects={projects}
                        onUpdateTask={handleUpdateTask}
                        onDeleteTask={handleDeleteTask}
                    />
                ))}
            </div>

            {filteredTasks.length === 0 && (
                <div className="text-center py-8 text-white/60">
                    {tasks.length === 0 
                        ? 'Задач пока нет. Создайте первую задачу!'
                        : 'Задачи не найдены по выбранным фильтрам.'
                    }
                </div>
            )}
        </div>
    );
}
