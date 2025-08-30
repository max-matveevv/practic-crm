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
    const [isModalOpen, setIsModalOpen] = useState(false)

    useEffect(() => {
        fetchProjects()
            .then(setProjects)
            .catch((err) => {
                alert(err.message)
            })
    }, [])

    const handleAddProject = (newProject: Project) => {
        setProjects((prev) => [newProject, ...prev]);
        setIsModalOpen(false) // закрыть модалку после добавления
    }

    return (
        <div className="p-6">
            <div className="flex items-center justify-between gap-4 mb-4">
                <h1 className="text-2xl font-bold mb-4 text-blue-600">Проекты</h1>


                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-btn hover:bg-blue-600 text-white py-2 px-4 rounded-3xl cursor-pointer text-sm"
                >
                    + Добавить проект
                </button>
            </div>

            {/* Модалка */}
            {isModalOpen && (
                <div className="fixed inset-0 flex justify-center items-center z-50">
                    <div className="absolute bg-black/50 top-0 left-0 w-full h-full cursor-pointer" onClick={() => setIsModalOpen(false)}></div>
                    <div className="bg-bg-1 rounded-2xl p-6 w-full max-w-md relative">
                        <button
                            className="absolute top-5 right-5 text-white hover:text-blue-600 cursor-pointer text-3xl"
                            onClick={() => setIsModalOpen(false)}
                        >
                            &times;
                        </button>

                        <AddProjectForm onProjectAdded={handleAddProject} />
                    </div>
                </div>
            )}

            

            <div className="flex flex-col gap-4">
                <div className="flex items-center">
                    <div className="w-1/4 font-bold text-[12px] opacity-60 uppercase">Название</div>
                    <div className="w-1/4 font-bold text-[12px] opacity-60 uppercase">Логин</div>
                    <div className="w-1/4 font-bold text-[12px] opacity-60 uppercase">Пароль</div>
                    <div className="w-1/4 font-bold text-[12px] opacity-60 uppercase">URL</div>
                </div>
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
