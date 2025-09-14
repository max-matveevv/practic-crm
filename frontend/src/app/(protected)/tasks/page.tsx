'use client';

import React, { useState, useEffect } from 'react';
import { Task, Project } from '@/lib/types';
import { fetchTasks, addTask, updateTask, deleteTask } from '@/api/tasks';
import { fetchProjects } from '@/api/projects';

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [filterProject, setFilterProject] = useState<string>('');
    const [filterStatus, setFilterStatus] = useState<string>('');

    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        status: 'pending' as 'pending' | 'in_progress' | 'completed',
        project_id: undefined as number | undefined,
        priority: 1 as 1 | 2 | 3
    });

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
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddTask = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const task = await addTask(newTask);
            setTasks([task, ...tasks]);
            setNewTask({
                title: '',
                description: '',
                status: 'pending',
                project_id: undefined,
                priority: 1
            });
            setShowAddForm(false);
        } catch (error) {
            console.error('Error adding task:', error);
        }
    };

    const handleUpdateTask = async (taskId: number, updates: Partial<Task>) => {
        try {
            const updatedTask = await updateTask(taskId, updates);
            setTasks(tasks.map(task => task.id === taskId ? updatedTask : task));
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const handleDeleteTask = async (taskId: number) => {
        if (!confirm('Удалить задачу?')) return;
        try {
            await deleteTask(taskId);
            setTasks(tasks.filter(task => task.id !== taskId));
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const filteredTasks = tasks.filter(task => {
        if (filterProject && task.project_id?.toString() !== filterProject) return false;
        if (filterStatus && task.status !== filterStatus) return false;
        return true;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'in_progress': return 'bg-blue-100 text-blue-800';
            case 'completed': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getPriorityColor = (priority: number) => {
        switch (priority) {
            case 1: return 'bg-gray-100 text-gray-800';
            case 2: return 'bg-yellow-100 text-yellow-800';
            case 3: return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return <div className="p-6">Загрузка...</div>;
    }

    return (
        <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Задачи</h1>
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        {showAddForm ? 'Отмена' : 'Добавить задачу'}
                    </button>
                </div>

            {/* Фильтры */}
            <div className="mb-6 flex gap-4">
                <select
                    value={filterProject}
                    onChange={(e) => setFilterProject(e.target.value)}
                    className="border rounded px-3 py-2"
                >
                    <option value="">Все проекты</option>
                    {projects.map(project => (
                        <option key={project.id} value={project.id}>
                            {project.title}
                        </option>
                    ))}
                </select>

                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="border rounded px-3 py-2"
                >
                    <option value="">Все статусы</option>
                    <option value="pending">Ожидает</option>
                    <option value="in_progress">В работе</option>
                    <option value="completed">Завершена</option>
                </select>
            </div>

            {/* Форма добавления */}
            {showAddForm && (
                <form onSubmit={handleAddTask} className="mb-6 p-4 border rounded">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Название задачи"
                            value={newTask.title}
                            onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                            className="border rounded px-3 py-2"
                            required
                        />
                        <select
                            value={newTask.project_id || ''}
                            onChange={(e) => setNewTask({...newTask, project_id: e.target.value ? Number(e.target.value) : undefined})}
                            className="border rounded px-3 py-2"
                        >
                            <option value="">Без проекта</option>
                            {projects.map(project => (
                                <option key={project.id} value={project.id}>
                                    {project.title}
                                </option>
                            ))}
                        </select>
                        <select
                            value={newTask.status}
                            onChange={(e) => setNewTask({...newTask, status: e.target.value as 'pending' | 'in_progress' | 'completed'})}
                            className="border rounded px-3 py-2"
                        >
                            <option value="pending">Ожидает</option>
                            <option value="in_progress">В работе</option>
                            <option value="completed">Завершена</option>
                        </select>
                        <select
                            value={newTask.priority}
                            onChange={(e) => setNewTask({...newTask, priority: Number(e.target.value) as 1 | 2 | 3})}
                            className="border rounded px-3 py-2"
                        >
                            <option value={1}>Низкий приоритет</option>
                            <option value={2}>Средний приоритет</option>
                            <option value={3}>Высокий приоритет</option>
                        </select>
                    </div>
                    <textarea
                        placeholder="Описание задачи"
                        value={newTask.description}
                        onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                        className="border rounded px-3 py-2 w-full mt-4"
                        rows={3}
                    />
                    <div className="mt-4">
                        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                            Добавить задачу
                        </button>
                    </div>
                </form>
            )}

            {/* Список задач */}
            <div className="space-y-4">
                {filteredTasks.map(task => (
                    <div key={task.id} className="border rounded p-4">
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <h3 className="font-semibold">{task.title}</h3>
                                    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(task.status)}`}>
                                        {task.status === 'pending' ? 'Ожидает' : 
                                         task.status === 'in_progress' ? 'В работе' : 'Завершена'}
                                    </span>
                                    <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(task.priority)}`}>
                                        Приоритет: {task.priority === 1 ? 'Низкий' : 
                                                   task.priority === 2 ? 'Средний' : 'Высокий'}
                                    </span>
                                </div>
                                {task.description && (
                                    <p className="text-gray-600 mb-2">{task.description}</p>
                                )}
                                {task.project && (
                                    <p className="text-sm text-gray-500">
                                        Проект: {task.project.title}
                                    </p>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <select
                                    value={task.status}
                                    onChange={(e) => handleUpdateTask(task.id, { status: e.target.value as 'pending' | 'in_progress' | 'completed' })}
                                    className="border rounded px-2 py-1 text-sm"
                                >
                                    <option value="pending">Ожидает</option>
                                    <option value="in_progress">В работе</option>
                                    <option value="completed">Завершена</option>
                                </select>
                                <button
                                    onClick={() => handleDeleteTask(task.id)}
                                    className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                                >
                                    Удалить
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

                {filteredTasks.length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                        Задачи не найдены
                    </div>
                )}
            </div>
    );
}
