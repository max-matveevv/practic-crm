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
    const [accesses, setAccesses] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const newProject = await addProject({ title, description, accesses })
            onProjectAdded(newProject)
            setTitle('')
            setDescription('')
            setAccesses('')
        } catch (error) {
            alert('Ошибка при добавлении проекта')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Add new project</h2>

            <input
                type="text"
                placeholder="Title"
                className="block w-full mb-2 p-2 border rounded"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
            />
            <textarea
                placeholder="Description"
                className="block w-full mb-2 p-2 border rounded"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <textarea
                placeholder="Accesses"
                className="block w-full mb-2 p-2 border rounded font-mono"
                value={accesses}
                onChange={(e) => setAccesses(e.target.value)}
            />

            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">
                {loading ? 'Creating...' : 'Create Project'}
            </button>
        </form>
    )
}
