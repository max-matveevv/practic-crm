'use client'

import { useState } from 'react';
import { appConfig } from '@/lib/config';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const projectEndpoint = appConfig.projectEndpoint;
import { addProject } from '@/api/projects'


type Props = {
    onProjectAdded: (project: any) => void
}

export function AddProjectForm({ onProjectAdded }: Props) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')
    const [url, setUrl] = useState('')
    const [accesses, setAccesses] = useState('')
    const [loading, setLoading] = useState(false)

    const [copiedField, setCopiedField] = useState<string | null>(null);

    const handleCopy = async (field: string, value: string) => {
        try {
            await navigator.clipboard.writeText(value);
            setCopiedField(field);
            setTimeout(() => setCopiedField(null), 2000);
        } catch (err) {
            console.error('Ошибка при копировании', err);
        }
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const newProject = await addProject({ title, description, login, password, url, accesses })
            onProjectAdded(newProject)
            setTitle('')
            setDescription('')
            setLogin('')
            setPassword('')
            setUrl('')
            setAccesses('')
        } catch (error) {
            alert('Ошибка при добавлении проекта')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="mb-6">
            <h2 className="text-xl font-bold mb-4">Добавить проект</h2>

            <div className='relative'>
                <label htmlFor="" className='text-xs text-gray-500'>Название</label>
                <input
                    type="text"
                    className="block w-full mb-2 pb-2 border-b border-border focus:border-white outline-0"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            </div>

            <div className='relative'>
                {copiedField === 'login' && (
                    <div className="absolute bottom-1 right-7 text-green-500 text-sm bg-bg-1">
                        Скопировано
                    </div>
                )}
                <label htmlFor="" className='text-xs text-gray-500'>Логин</label>
                <input
                    type="text"
                    className="block w-full mb-2 pb-2 border-b border-border focus:border-white outline-0"
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                    required
                />
                <button 
                    type="button"
                    className="copy w-5 h-5 cursor-pointer absolute right-0 bottom-1"
                    onClick={() => handleCopy('login', login)}
                    aria-label="Скопировать"></button>
            </div>

            <div className='relative'>
                {copiedField === 'password' && (
                    <div className="absolute bottom-1 right-7 text-green-500 text-sm bg-bg-1">
                        Скопировано
                    </div>
                )}
                <label htmlFor="" className='text-xs text-gray-500'>Пароль</label>
                <input
                    type="password"
                    className="block w-full mb-2 pb-2 border-b border-border focus:border-white outline-0"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button
                    type="button"
                    className="copy w-5 h-5 cursor-pointer absolute right-0 bottom-1"
                    onClick={() => handleCopy('password', password)}
                    aria-label="Скопировать"></button>
            </div>

            <div className='relative'>
                {copiedField === 'url' && (
                    <div className="absolute bottom-1 right-7 text-green-500 text-sm bg-bg-1">
                        Скопировано
                    </div>
                )}
                <label htmlFor="" className='text-xs text-gray-500'>URL</label>
                <input
                    type="url"
                    className="block w-full mb-2 pb-2 border-b border-border focus:border-white outline-0"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                />
                <button
                    type="button"
                    className="copy w-5 h-5 cursor-pointer absolute right-0 bottom-1"
                    onClick={() => handleCopy('url', url)}
                    aria-label="Скопировать"></button>
            </div>

            <div className='relative'>
                <label htmlFor="" className='text-xs text-gray-500'>Описание</label>
                <textarea
                    className="block w-full mb-2 pb-2 border-b border-border focus:border-white outline-0"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>

            <div className='relative'>
                <label htmlFor="" className='text-xs text-gray-500'>Доступы, команды</label>
                <textarea
                    className="block w-full mb-2 pb-2 border-b border-border focus:border-white outline-0 font-mono"
                    value={accesses}
                    onChange={(e) => setAccesses(e.target.value)}
                />
            </div>

            <button type="submit" disabled={loading} className="bg-btn hover:bg-blue-600 text-white py-2 px-4 rounded-3xl cursor-pointer text-sm mt-4">
                {loading ? 'Создание...' : 'Добавить проект'}
            </button>
        </form>
    )
}
