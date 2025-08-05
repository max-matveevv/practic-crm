import { Project } from "@/lib/types";
import { useRouter } from 'next/navigation';
import { deleteProject } from '@/api/projects';

type Props = {
    project: Project
    onDelete: (id: number) => void
}

export function ProjectCard({ project, onDelete }: Props) {
    const router = useRouter();
    
    const handleDelete = async () => {
        if (!confirm(`Удалить проект "${project.title}"?`)) return
        try {
            await deleteProject(project.id)
            onDelete(project.id)
        } catch {
            alert('Ошибка при удалении проекта')
        }
    }

    return (
        <div className="mb-6 border p-4 rounded relative" onClick={() => router.push(`/projects/${project.id}`)}>
            <button
                onClick={handleDelete}
                className="absolute top-2 right-2 text-red-600 hover:text-red-800 font-bold"
                title="Удалить проект"
            >
                ×
            </button>

            <h2 className="text-xl font-semibold">{project.title}</h2>
            <p className="text-sm text-gray-600">
                Created at: {new Date(project.created_at).toLocaleDateString()}
            </p>
            {project.description && <p className="mt-2">{project.description}</p>}
            {project.accesses && (
                <div className="mt-2 p-2 bg-gray-100 rounded text-sm font-mono whitespace-pre-wrap">
                    {project.accesses}
                </div>
            )}
        </div>
    )
}
