import { Project } from "@/lib/types";
import { useRouter } from 'next/navigation';
import { deleteProject } from '@/api/projects';
import { useState } from 'react';
import { ProjectForm } from './ProjectForm';

type Props = {
    project: Project
    onDelete: (id: number) => void
    onUpdate: (updatedProject: Project) => void
}

export function ProjectCard({ project, onDelete, onUpdate }: Props) {
    const router = useRouter();
    const [copiedField, setCopiedField] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    
    const handleDelete = async () => {
        if (!confirm(`Удалить проект "${project.title}"?`)) return
        try {
            await deleteProject(project.id)
            onDelete(project.id)
        } catch {
            alert('Ошибка при удалении проекта')
        }
    }

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
        onUpdate(updatedProject);
        setIsEditing(false);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
    };

    return (
        <>
            {isEditing && (
                <ProjectForm
                    project={project}
                    onProjectSaved={handleProjectSaved}
                    onCancel={handleCancelEdit}
                />
            )}
            <div className="relative flex items-center hover:bg-white/5 rounded-lg p-2 transition-colors">
                <div className="absolute top-2 right-3 flex gap-2 z-10">
                    <button
                        onClick={handleEdit}
                        className="text-white hover:text-blue-400 cursor-pointer p-1"
                        title="Редактировать проект"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </button>
                    <button
                        onClick={handleDelete}
                        className="text-white hover:text-red-500 cursor-pointer p-1"
                        title="Удалить проект"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>

            <div className="w-1/4">
                <h2 
                    className="font-semibold pr-6 cursor-pointer hover:text-blue-400 transition-colors"
                    onClick={() => router.push(`/projects/${project.id}`)}
                >
                    {project.title}
                </h2>
            </div>
            <div className="w-1/4">
                {project.login && (
                    <div className="flex items-center gap-2">
                        <span className="text-white">{project.login}</span>
                        <button
                            onClick={() => copyToClipboard(project.login!, `login_${project.id}`)}
                            className="text-gray-400 hover:text-white transition-colors p-1"
                            title="Копировать логин"
                        >
                            {copiedField === `login_${project.id}` ? (
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
                )}
            </div>
            <div className="w-1/4">
                {project.password && (
                    <div className="flex items-center gap-2">
                        <span className="text-white">{project.password}</span>
                        <button
                            onClick={() => copyToClipboard(project.password!, `password_${project.id}`)}
                            className="text-gray-400 hover:text-white transition-colors p-1"
                            title="Копировать пароль"
                        >
                            {copiedField === `password_${project.id}` ? (
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
                )}
            </div>
            <div className="w-1/4">
                {project.url && (
                    <div className="flex items-center gap-2">
                        <a 
                            href={project.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 underline flex-1 break-all"
                        >
                            {project.url}
                        </a>
                    </div>
                )}
            </div>
        </div>
        </>
    )
}
