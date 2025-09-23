'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Project, Task } from '@/lib/types';
import { getProject, getProjectTasks } from '@/api/projects';
import { TaskCard } from '@/components/TaskCard/TaskCard';
import { ProjectForm } from '@/components/ProjectCard/ProjectForm';

interface ProjectPageClientProps {
    projectId: string;
}

export default function ProjectPageClient({ projectId }: ProjectPageClientProps) {
    const [project, setProject] = useState<Project | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [copiedField, setCopiedField] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    const loadProjectData = useCallback(async () => {
        try {
            setLoading(true);
            const [projectData, tasksData] = await Promise.all([
                getProject(projectId),
                getProjectTasks(projectId)
            ]);
            
            setProject(projectData);
            setTasks(tasksData);
        } catch (error) {
            console.error('Ошибка загрузки данных проекта:', error);
            setError('Ошибка загрузки данных проекта');
        } finally {
            setLoading(false);
        }
    }, [projectId]);

    useEffect(() => {
        loadProjectData();
    }, [loadProjectData]);

    const copyToClipboard = async (text: string, fieldName: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedField(fieldName);
            setTimeout(() => setCopiedField(null), 2000);
        } catch (error) {
            console.error('Ошибка копирования:', error);
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleProjectSaved = (updatedProject: Project) => {
        setProject(updatedProject);
        setIsEditing(false);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-white">Загрузка...</div>
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-red-500">Ошибка: {error || 'Проект не найден'}</div>
            </div>
        );
    }

    return (
        <>
            {isEditing && project && (
                <ProjectForm
                    project={project}
                    onProjectSaved={handleProjectSaved}
                    onCancel={handleCancelEdit}
                />
            )}
            <div className="p-6 h-full overflow-y-auto">
                {/* Заголовок проекта */}
                <div className="mb-6">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-white mb-2">{project.title}</h1>
                            <p className="text-sm text-gray-400">
                                Создан: {new Date(project.created_at).toLocaleDateString('ru-RU')}
                            </p>
                            {project.description && (
                                <p className="text-white/80 mt-2">{project.description}</p>
                            )}
                        </div>
                        <button
                            onClick={handleEdit}
                            className="text-white hover:text-blue-400 cursor-pointer p-2 ml-4"
                            title="Редактировать проект"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                    {/* Левая колонка - Задачи проекта */}
                    <div className="lg:col-span-2 mb-6">
                        <div className="bg-bg-1 rounded-xl p-6 h-full">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold text-white">
                                    Задачи проекта ({tasks.length})
                                </h2>
                            </div>

                            <div className="space-y-4 overflow-y-auto">
                                {tasks.length > 0 ? (
                                    tasks.map(task => (
                                        <TaskCard
                                            key={task.id}
                                            task={task}
                                            projects={[project]}
                                            onUpdateTask={async () => {}} // TODO: Implement update
                                            onDeleteTask={async () => {}} // TODO: Implement delete
                                        />
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-white/60">
                                        <p>Задач пока нет</p>
                                        <p className="text-sm mt-2">Создайте первую задачу для этого проекта</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Правая колонка - Доступы и информация */}
                    <div className="space-y-6">
                        {/* Основная информация */}
                        <div className="bg-bg-1 rounded-xl p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Информация о проекте</h3>
                            
                            <div className="space-y-4">
                                {project.url && (
                                    <div>
                                        <label className="text-sm text-gray-400">URL:</label>
                                        <div className="text-white break-all flex items-center gap-2">
                                            <a 
                                                href={project.url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-blue-400 hover:text-blue-300 underline flex-1"
                                            >
                                                {project.url}
                                            </a>
                                            <button
                                                onClick={() => copyToClipboard(project.url!, 'url')}
                                                className="text-gray-400 hover:text-white transition-colors p-1"
                                                title="Копировать URL"
                                            >
                                                {copiedField === 'url' ? (
                                                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                ) : (
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {project.login && (
                                    <div>
                                        <label className="text-sm text-gray-400">Логин:</label>
                                        <div className="text-white font-mono flex items-center gap-2">
                                            <span className="flex-1">{project.login}</span>
                                            <button
                                                onClick={() => copyToClipboard(project.login!, 'login')}
                                                className="text-gray-400 hover:text-white transition-colors p-1"
                                                title="Копировать логин"
                                            >
                                                {copiedField === 'login' ? (
                                                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                ) : (
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {project.password && (
                                    <div>
                                        <label className="text-sm text-gray-400">Пароль:</label>
                                        <div className="text-white font-mono flex items-center gap-2">
                                            <span className="flex-1">{project.password}</span>
                                            <button
                                                onClick={() => copyToClipboard(project.password!, 'password')}
                                                className="text-gray-400 hover:text-white transition-colors p-1"
                                                title="Копировать пароль"
                                            >
                                                {copiedField === 'password' ? (
                                                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                ) : (
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {project.accesses_login && (
                                    <div>
                                        <label className="text-sm text-gray-400">Всплывашка логин:</label>
                                        <div className="text-white font-mono flex items-center gap-2">
                                            <span className="flex-1">{project.accesses_login}</span>
                                            <button
                                                onClick={() => copyToClipboard(project.accesses_login!, 'accesses_login')}
                                                className="text-gray-400 hover:text-white transition-colors p-1"
                                                title="Копировать всплывашка логин"
                                            >
                                                {copiedField === 'accesses_login' ? (
                                                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                ) : (
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {project.accesses_password && (
                                    <div>
                                        <label className="text-sm text-gray-400">Всплывашка пароль:</label>
                                        <div className="text-white font-mono flex items-center gap-2">
                                            <span className="flex-1">{project.accesses_password}</span>
                                            <button
                                                onClick={() => copyToClipboard(project.accesses_password!, 'accesses_password')}
                                                className="text-gray-400 hover:text-white transition-colors p-1"
                                                title="Копировать всплывашка пароль"
                                            >
                                                {copiedField === 'accesses_password' ? (
                                                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                ) : (
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Админ доступы */}
                        {(project.admin_url || project.admin_login || project.admin_password || project.admin_accesses) && (
                            <div className="bg-bg-1 rounded-xl p-6">
                                <h3 className="text-lg font-semibold text-white mb-4">Админ доступы</h3>
                                
                                <div className="space-y-4">
                                    {project.admin_url && (
                                        <div>
                                            <label className="text-sm text-gray-400">Админ URL:</label>
                                            <div className="text-white break-all flex items-center gap-2">
                                                <a 
                                                    href={project.admin_url} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="text-blue-400 hover:text-blue-300 underline flex-1"
                                                >
                                                    {project.admin_url}
                                                </a>
                                                <button
                                                    onClick={() => copyToClipboard(project.admin_url!, 'admin_url')}
                                                    className="text-gray-400 hover:text-white transition-colors p-1"
                                                    title="Копировать админ URL"
                                                >
                                                    {copiedField === 'admin_url' ? (
                                                        <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    ) : (
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                        </svg>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {project.admin_login && (
                                        <div>
                                            <label className="text-sm text-gray-400">Админ логин:</label>
                                            <div className="text-white font-mono flex items-center gap-2">
                                                <span className="flex-1">{project.admin_login}</span>
                                                <button
                                                    onClick={() => copyToClipboard(project.admin_login!, 'admin_login')}
                                                    className="text-gray-400 hover:text-white transition-colors p-1"
                                                    title="Копировать админ логин"
                                                >
                                                    {copiedField === 'admin_login' ? (
                                                        <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    ) : (
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                        </svg>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {project.admin_password && (
                                        <div>
                                            <label className="text-sm text-gray-400">Админ пароль:</label>
                                            <div className="text-white font-mono flex items-center gap-2">
                                                <span className="flex-1">{project.admin_password}</span>
                                                <button
                                                    onClick={() => copyToClipboard(project.admin_password!, 'admin_password')}
                                                    className="text-gray-400 hover:text-white transition-colors p-1"
                                                    title="Копировать админ пароль"
                                                >
                                                    {copiedField === 'admin_password' ? (
                                                        <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    ) : (
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                        </svg>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {project.admin_accesses && (
                                        <div>
                                            <label className="text-sm text-gray-400">Всплывашка:</label>
                                            <div className="text-white font-mono flex items-center gap-2">
                                                <span className="flex-1">{project.admin_accesses}</span>
                                                <button
                                                    onClick={() => copyToClipboard(project.admin_accesses!, 'admin_accesses')}
                                                    className="text-gray-400 hover:text-white transition-colors p-1"
                                                    title="Копировать всплывашку"
                                                >
                                                    {copiedField === 'admin_accesses' ? (
                                                        <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    ) : (
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                        </svg>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* SSH доступы */}
                        {(project.ssh_host || project.ssh_user || project.ssh_password || project.ssh_port) && (
                            <div className="bg-bg-1 rounded-xl p-6">
                                <h3 className="text-lg font-semibold text-white mb-4">SSH доступы</h3>
                                
                                <div className="space-y-4">
                                    {project.ssh_host && (
                                        <div>
                                            <label className="text-sm text-gray-400">SSH Host:</label>
                                            <div className="text-white font-mono flex items-center gap-2">
                                                <span className="flex-1">{project.ssh_host}</span>
                                                <button
                                                    onClick={() => copyToClipboard(project.ssh_host!, 'ssh_host')}
                                                    className="text-gray-400 hover:text-white transition-colors p-1"
                                                    title="Копировать SSH Host"
                                                >
                                                    {copiedField === 'ssh_host' ? (
                                                        <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    ) : (
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                        </svg>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {project.ssh_port && (
                                        <div>
                                            <label className="text-sm text-gray-400">SSH Port:</label>
                                            <div className="text-white font-mono flex items-center gap-2">
                                                <span className="flex-1">{project.ssh_port}</span>
                                                <button
                                                    onClick={() => copyToClipboard(project.ssh_port!.toString(), 'ssh_port')}
                                                    className="text-gray-400 hover:text-white transition-colors p-1"
                                                    title="Копировать SSH Port"
                                                >
                                                    {copiedField === 'ssh_port' ? (
                                                        <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    ) : (
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                        </svg>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {project.ssh_user && (
                                        <div>
                                            <label className="text-sm text-gray-400">SSH User:</label>
                                            <div className="text-white font-mono flex items-center gap-2">
                                                <span className="flex-1">{project.ssh_user}</span>
                                                <button
                                                    onClick={() => copyToClipboard(project.ssh_user!, 'ssh_user')}
                                                    className="text-gray-400 hover:text-white transition-colors p-1"
                                                    title="Копировать SSH User"
                                                >
                                                    {copiedField === 'ssh_user' ? (
                                                        <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    ) : (
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                        </svg>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {project.ssh_password && (
                                        <div>
                                            <label className="text-sm text-gray-400">SSH Password:</label>
                                            <div className="text-white font-mono flex items-center gap-2">
                                                <span className="flex-1">{project.ssh_password}</span>
                                                <button
                                                    onClick={() => copyToClipboard(project.ssh_password!, 'ssh_password')}
                                                    className="text-gray-400 hover:text-white transition-colors p-1"
                                                    title="Копировать SSH Password"
                                                >
                                                    {copiedField === 'ssh_password' ? (
                                                        <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    ) : (
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                        </svg>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Команды сборки */}
                        {project.build_commands && (
                            <div className="bg-bg-1 rounded-xl p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-white">Команды сборки</h3>
                                    <button
                                        onClick={() => copyToClipboard(project.build_commands!, 'build_commands')}
                                        className="text-gray-400 hover:text-white transition-colors p-1"
                                        title="Копировать команды сборки"
                                    >
                                        {copiedField === 'build_commands' ? (
                                            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                <div className="bg-gray-900 rounded-lg p-4">
                                    <pre className="text-green-400 text-sm whitespace-pre-wrap font-mono">
                                        {project.build_commands}
                                    </pre>
                                </div>
                            </div>
                        )}

                        {/* Заметки */}
                        {project.notes && (
                            <div className="bg-bg-1 rounded-xl p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-white">Заметки</h3>
                                    <button
                                        onClick={() => copyToClipboard(project.notes!, 'notes')}
                                        className="text-gray-400 hover:text-white transition-colors p-1"
                                        title="Копировать заметки"
                                    >
                                        {copiedField === 'notes' ? (
                                            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                <div className="text-white/80 whitespace-pre-wrap">
                                    {project.notes}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
