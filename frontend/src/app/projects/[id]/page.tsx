import { notFound } from 'next/navigation';
import { getProject } from '@/api/projects';

export default async function ProjectPage({ params }: { params: { id: string } }) {
    const project = await getProject(params.id);

    if (!project) {
        notFound();
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-2">{project.title}</h1>
            <p className="text-sm text-gray-600 mb-4">Создан: {new Date(project.created_at).toLocaleDateString()}</p>

            {project.description && <p className="mb-4">{project.description}</p>}

            {project.accesses && (
                <div className="p-4 bg-gray-100 rounded text-sm font-mono whitespace-pre-wrap">
                    {project.accesses}
                </div>
            )}
        </div>
    );
}
