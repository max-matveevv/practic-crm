'use client';

import React, { useState } from 'react';
import { Project } from '@/lib/types';
import { addProject, updateProject } from '@/api/projects';

type ProjectFormData = {
    title: string;
    description?: string;
    login?: string;
    password?: string;
    url?: string;
    accesses?: string;
    accesses_login?: string;
    accesses_password?: string;
    admin_url?: string;
    admin_login?: string;
    admin_password?: string;
    admin_accesses?: string;
    ssh_host?: string;
    ssh_user?: string;
    ssh_password?: string;
    ssh_port?: string; // В форме всегда строка
    build_commands?: string;
    notes?: string;
};

type ProjectApiData = {
    title: string;
    description?: string;
    login?: string;
    password?: string;
    url?: string;
    accesses?: string;
    accesses_login?: string;
    accesses_password?: string;
    admin_url?: string;
    admin_login?: string;
    admin_password?: string;
    admin_accesses?: string;
    ssh_host?: string;
    ssh_user?: string;
    ssh_password?: string;
    ssh_port?: number; // В API всегда число
    build_commands?: string;
    notes?: string;
};

interface ProjectFormProps {
    project?: Project | null; // Если есть - редактирование, если нет - создание
    onProjectSaved: (project: Project) => void;
    onCancel: () => void;
}

export function ProjectForm({ project, onProjectSaved, onCancel }: ProjectFormProps) {
    const isEditing = !!project;
    
    const [formData, setFormData] = useState<ProjectFormData>({
        title: project?.title || '',
        description: project?.description || '',
        login: project?.login || '',
        password: project?.password || '',
        url: project?.url || '',
        accesses: project?.accesses || '',
        accesses_login: project?.accesses_login || '',
        accesses_password: project?.accesses_password || '',
        admin_url: project?.admin_url || '',
        admin_login: project?.admin_login || '',
        admin_password: project?.admin_password || '',
        admin_accesses: project?.admin_accesses || '',
        ssh_host: project?.ssh_host || '',
        ssh_user: project?.ssh_user || '',
        ssh_password: project?.ssh_password || '',
        ssh_port: project?.ssh_port ? project.ssh_port.toString() : '',
        build_commands: project?.build_commands || '',
        notes: project?.notes || ''
    });

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Подготовка данных для отправки
            const submitData: ProjectApiData = {
                title: formData.title,
                description: formData.description || undefined,
                login: formData.login || undefined,
                password: formData.password || undefined,
                url: formData.url || undefined,
                accesses: formData.accesses || undefined,
                accesses_login: formData.accesses_login || undefined,
                accesses_password: formData.accesses_password || undefined,
                admin_url: formData.admin_url || undefined,
                admin_login: formData.admin_login || undefined,
                admin_password: formData.admin_password || undefined,
                admin_accesses: formData.admin_accesses || undefined,
                ssh_host: formData.ssh_host || undefined,
                ssh_user: formData.ssh_user || undefined,
                ssh_password: formData.ssh_password || undefined,
                ssh_port: formData.ssh_port ? parseInt(formData.ssh_port) : undefined,
                build_commands: formData.build_commands || undefined,
                notes: formData.notes || undefined,
            };

            let savedProject: Project;
            
            if (isEditing && project) {
                savedProject = await updateProject(project.id, submitData);
            } else {
                savedProject = await addProject(submitData);
            }
            
            onProjectSaved(savedProject);
        } catch (error) {
            console.error('Ошибка при сохранении проекта:', error);
            alert('Ошибка при сохранении проекта');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="fixed inset-0 flex justify-center items-center z-50">
            <div className="absolute bg-black/50 top-0 left-0 w-full h-full" onClick={onCancel}></div>
            <div className="bg-bg-1 rounded-2xl p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto relative">
                <button
                    className="absolute top-5 right-5 text-white hover:text-blue-600 cursor-pointer text-3xl"
                    onClick={onCancel}
                >
                    &times;
                </button>

                <h2 className="text-xl font-bold mb-4">
                    {isEditing ? 'Редактировать проект' : 'Добавить проект'}
                </h2>

                <form onSubmit={handleSubmit} className="mb-6 space-y-2">

                    {/* Основная информация */}
                    <div className='bg-bg-2 rounded-2xl p-4'>
                        <div className='relative'>
                            <label className='text-xs text-gray-500'>Название *</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                className="block w-full mb-2 pb-2 border-b border-border focus:border-white outline-0"
                            />
                        </div>

                        <div className='relative'>
                            <label className='text-xs text-gray-500'>URL</label>
                            <input
                                type="url"
                                name="url"
                                value={formData.url}
                                onChange={handleChange}
                                className="block w-full mb-2 pb-2 border-b border-border focus:border-white outline-0"
                            />
                        </div>

                        <div className='relative'>
                            <label className='text-xs text-gray-500'>Описание</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="block w-full mb-2 pb-2 border-b border-border focus:border-white outline-0"
                            />
                        </div>
                    </div>

                    {/* Основные доступы */}
                    <div className='grid grid-cols-2 gap-2'>
                        <div className='bg-bg-2 rounded-2xl p-4'>
                            {/* Разделитель */}
                            <div className="text-xs text-white mt-2 mb-4 font-bold uppercase">Серверные доступы</div>

                            <div className='relative'>
                                <label className='text-xs text-gray-500'>Логин</label>
                                <input
                                    type="text"
                                    name="login"
                                    value={formData.login}
                                    onChange={handleChange}
                                    className="block w-full mb-2 pb-2 border-b border-border focus:border-white outline-0"
                                />
                            </div>

                            <div className='relative'>
                                <label className='text-xs text-gray-500'>Пароль</label>
                                <input
                                    type="text"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="block w-full mb-2 pb-2 border-b border-border focus:border-white outline-0"
                                />
                            </div>

                            <div className='relative'>
                                <label className='text-xs text-gray-500'>Всплывашка логин</label>
                                <input
                                    type="text"
                                    name="accesses_login"
                                    value={formData.accesses_login}
                                    onChange={handleChange}
                                    className="block w-full mb-2 pb-2 border-b border-border focus:border-white outline-0"
                                />
                            </div>

                            <div className='relative'>
                                <label className='text-xs text-gray-500'>Всплывашка пароль</label>
                                <input
                                    type="text"
                                    name="accesses_password"
                                    value={formData.accesses_password}
                                    onChange={handleChange}
                                    className="block w-full mb-2 pb-2 border-b border-border focus:border-white outline-0"
                                />
                            </div>
                        </div>

                        <div className='bg-bg-2 rounded-2xl p-4'>
                            {/* Разделитель */}
                            <div className="text-xs text-white mt-2 mb-4 font-bold uppercase">АДМИН ДОСТУПЫ</div>

                            <div className='relative'>
                                <label className='text-xs text-gray-500'>Админ URL</label>
                                <input
                                    type="url"
                                    name="admin_url"
                                    value={formData.admin_url}
                                    onChange={handleChange}
                                    className="block w-full mb-2 pb-2 border-b border-border focus:border-white outline-0"
                                />
                            </div>

                            <div className='relative'>
                                <label className='text-xs text-gray-500'>Админ логин</label>
                                <input
                                    type="text"
                                    name="admin_login"
                                    value={formData.admin_login}
                                    onChange={handleChange}
                                    className="block w-full mb-2 pb-2 border-b border-border focus:border-white outline-0"
                                />
                            </div>

                            <div className='relative'>
                                <label className='text-xs text-gray-500'>Админ пароль</label>
                                <input
                                    type="text"
                                    name="admin_password"
                                    value={formData.admin_password}
                                    onChange={handleChange}
                                    className="block w-full mb-2 pb-2 border-b border-border focus:border-white outline-0"
                                />
                            </div>

                            <div className='relative'>
                                <label className='text-xs text-gray-500'>Всплывашка</label>
                                <input
                                    type="text"
                                    name="admin_accesses"
                                    value={formData.admin_accesses}
                                    onChange={handleChange}
                                    className="block w-full mb-2 pb-2 border-b border-border focus:border-white outline-0"
                                />
                            </div>
                        </div>
                    </div>

                    {/* SSH Доступы  */}
                    <div className='bg-bg-2 rounded-2xl p-4'>
                        <div className="text-xs text-white mt-2 mb-4 font-bold uppercase">SSH ДОСТУПЫ</div>

                        <div className='grid grid-cols-2 gap-x-4'>
                            <div className='relative'>
                                <label className='text-xs text-gray-500'>SSH Host</label>
                                <input
                                    type="text"
                                    name="ssh_host"
                                    value={formData.ssh_host}
                                    onChange={handleChange}
                                    className="block w-full mb-2 pb-2 border-b border-border focus:border-white outline-0"
                                />
                            </div>

                            <div className='relative'>
                                <label className='text-xs text-gray-500'>SSH Port</label>
                                <input
                                    type="number"
                                    name="ssh_port"
                                    value={formData.ssh_port}
                                    onChange={handleChange}
                                    className="block w-full mb-2 pb-2 border-b border-border focus:border-white outline-0"
                                />
                            </div>

                            <div className='relative'>
                                <label className='text-xs text-gray-500'>SSH User</label>
                                <input
                                    type="text"
                                    name="ssh_user"
                                    value={formData.ssh_user}
                                    onChange={handleChange}
                                    className="block w-full mb-2 pb-2 border-b border-border focus:border-white outline-0"
                                />
                            </div>

                            <div className='relative'>
                                <label className='text-xs text-gray-500'>SSH Password</label>
                                <input
                                    type="text"
                                    name="ssh_password"
                                    value={formData.ssh_password}
                                    onChange={handleChange}
                                    className="block w-full mb-2 pb-2 border-b border-border focus:border-white outline-0"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Команды и заметки */}
                    <div className='bg-bg-2 rounded-2xl p-4'>
                        {/* Разделитель */}
                        <div className="text-xs text-white mt-2 mb-4 font-bold uppercase">КОМАНДЫ И ЗАМЕТКИ</div>

                        <div className='relative'>
                            <label className='text-xs text-gray-500'>Команды сборки</label>
                            <textarea
                                name="build_commands"
                                value={formData.build_commands}
                                onChange={handleChange}
                                placeholder="npm install&#10;npm run build&#10;npm run deploy"
                                className="block w-full mb-2 pb-2 border-b border-border focus:border-white outline-0 font-mono"
                            />
                        </div>

                        <div className='relative'>
                            <label className='text-xs text-gray-500'>Заметки</label>
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                className="block w-full mb-2 pb-2 border-b border-border focus:border-white outline-0"
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading} 
                        className="bg-btn hover:bg-blue-600 text-white py-2 px-4 rounded-3xl cursor-pointer text-sm mt-4"
                    >
                        {loading ? (isEditing ? 'Сохранение...' : 'Создание...') : (isEditing ? 'Сохранить изменения' : 'Добавить проект')}
                    </button>
                </form>
            </div>
        </div>
    );
}
