import { Project, Task } from "@/lib/types";
import { getAuthHeaders, API_BASE_URL } from './common'

// получить все проекты
export async function fetchProjects(): Promise<Project[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/projects`, {
            method: 'GET',
            headers: getAuthHeaders(),
        })

        if (!response.ok) {
            throw new Error('Failed to fetch projects')
        }

        return await response.json()
    } catch (error) {
        console.error('Error fetching projects:', error)
        throw new Error('Failed to fetch projects')
    }
}

// добавить проект в базу
export async function addProject(data: {
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
    ssh_port?: number;
    build_commands?: string;
    notes?: string;
}): Promise<Project> {
    try {
        const response = await fetch(`${API_BASE_URL}/projects`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        })

        if (!response.ok) {
            throw new Error('Failed to add project')
        }

        return await response.json()
    } catch (error) {
        console.error('Error adding project:', error)
        throw new Error('Failed to add project')
    }
}

// удалить проект из базы
export async function deleteProject(id: number): Promise<void> {
    try {
        const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        })

        if (!response.ok) {
            throw new Error('Failed to delete project')
        }
    } catch (error) {
        console.error('Error deleting project:', error)
        throw new Error('Failed to delete project')
    }
}

// получить один проект по ID
export async function getProject(id: string): Promise<Project | null> {
    try {
        const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
            method: 'GET',
            headers: getAuthHeaders(),
        })

        if (!response.ok) {
            if (response.status === 404) {
                return null
            }
            throw new Error('Failed to fetch project')
        }

        return await response.json()
    } catch (error) {
        console.error('Error fetching project:', error)
        return null
    }
}

// получить задачи проекта
export async function getProjectTasks(projectId: string): Promise<Task[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/tasks/projects/${projectId}`, {
            method: 'GET',
            headers: getAuthHeaders(),
        })

        if (!response.ok) {
            throw new Error('Failed to fetch project tasks')
        }

        return await response.json()
    } catch (error) {
        console.error('Error fetching project tasks:', error)
        throw new Error('Failed to fetch project tasks')
    }
}

// обновить проект
export async function updateProject(id: number, data: {
    title?: string;
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
    ssh_port?: number;
    build_commands?: string;
    notes?: string;
}): Promise<Project> {
    try {
        const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        })

        if (!response.ok) {
            throw new Error('Failed to update project')
        }

        return await response.json()
    } catch (error) {
        console.error('Error updating project:', error)
        throw new Error('Failed to update project')
    }
}