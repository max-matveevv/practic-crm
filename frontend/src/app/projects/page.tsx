'use client'

import { useEffect, useState } from 'react';
import { AddProjectForm } from '@/components/AddProjectForm';
import { ProjectCard } from '@/components/ProjectCard';
import { Project } from '@/lib/types';
import { appConfig } from '@/lib/config';
import { fetchProjects } from '@/api/projects';


const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const projectEndpoint = appConfig.projectEndpoint;

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([])

    useEffect(() => {
        fetchProjects()
            .then(setProjects)
            .catch((err) => {
                alert(err.message)
            })
    }, [])

    const handleAddProject = (newProject: Project) => {
        setProjects((prev) => [newProject, ...prev])
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Projects</h1>

            <AddProjectForm onProjectAdded={handleAddProject} />

            <div className="grid grid-cols-3 gap-4">
                {projects.map((project) => (
                    <ProjectCard
                        key={project.id}
                        project={project}
                        onDelete={(id) => setProjects((prev) => prev.filter((p) => p.id !== id))}
                        />

                ))}
            </div>
        </div>
    )
}
