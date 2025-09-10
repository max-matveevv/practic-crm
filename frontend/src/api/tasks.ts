import { Task } from "@/lib/types";
import { appConfig } from "@/lib/config";
import axios from "axios";

const API_BASE = appConfig.apiBaseUrl;

// получить все задачи
export async function fetchTasks(params?: {
    project_id?: number;
    status?: string;
}): Promise<Task[]> {
    try {
        const queryParams = new URLSearchParams();
        if (params?.project_id) queryParams.append('project_id', params.project_id.toString());
        if (params?.status) queryParams.append('status', params.status);
        
        const url = `${API_BASE}/tasks${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
        const res = await axios.get(url);
        return res.data;
        } catch {
        throw new Error('Failed to fetch tasks');
    }
}

// добавить задачу
export async function addTask(data: {
    title: string;
    description?: string;
    status?: 'pending' | 'in_progress' | 'completed';
    project_id?: number;
    priority?: 1 | 2 | 3;
}): Promise<Task> {
    try {
        const res = await axios.post(`${API_BASE}/tasks`, data);
        return res.data;
        } catch {
        throw new Error('Failed to add task');
    }
}

// обновить задачу
export async function updateTask(id: number, data: Partial<Task>): Promise<Task> {
    try {
        const res = await axios.put(`${API_BASE}/tasks/${id}`, data);
        return res.data;
        } catch {
        throw new Error('Failed to update task');
    }
}

// удалить задачу
export async function deleteTask(id: number): Promise<void> {
    try {
        await axios.delete(`${API_BASE}/tasks/${id}`);
        } catch {
        throw new Error('Failed to delete task');
    }
}

// получить задачу по ID
export async function getTask(id: string): Promise<Task | null> {
    try {
        const res = await axios.get(`${API_BASE}/tasks/${id}`);
        return res.data;
        } catch (error) {
        console.error('Error fetching task:', error);
        return null;
    }
}

// получить задачи проекта
export async function getProjectTasks(projectId: number): Promise<Task[]> {
    try {
        const res = await axios.get(`${API_BASE}/tasks/projects/${projectId}`);
        return res.data;
        } catch {
        throw new Error('Failed to fetch project tasks');
    }
}
