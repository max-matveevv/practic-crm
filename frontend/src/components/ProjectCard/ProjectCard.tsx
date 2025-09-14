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
        <div className="relative flex items-center" onClick={() => router.push(`/projects/${project.id}`)}>
            <button
                onClick={handleDelete}
                className="absolute leading-[24px] top-0 right-3 text-white hover:text-blue-600 cursor-pointer text-3xl"
                title="Удалить проект"
            >
                ×
            </button>

            <div className="w-1/4">
                <h2 className="font-semibold pr-6">{project.title}</h2>
            </div>
            <div className="w-1/4">
                {project.login}
            </div>
            <div className="w-1/4">
                {project.password}
            </div>
            <div className="w-1/4">
                {project.url}
            </div>

            
            {/* <p className="text-sm text-gray-400">
                Создан: {new Date(project.created_at).toLocaleDateString()}
            </p> */}
            {/* {project.description && <p className="mt-2">{project.description}</p>}
            {project.accesses && (
                <div className="mt-2 p-2 bg-gray-100 rounded text-sm font-mono whitespace-pre-wrap">
                    {project.accesses}
                </div>
            )} */}
        </div>
    )
}
