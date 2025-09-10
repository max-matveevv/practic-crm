import { Project } from "@/lib/types";
import { appConfig } from "@/lib/config";
import axios from "axios";

const API_BASE = appConfig.apiBaseUrl;

// получить все проекты
export async function fetchProjects(): Promise<Project[]> {
    try {
        const res = await axios.get(`${API_BASE}/${appConfig.projectEndpoint}`);
        return res.data;
        } catch {
        throw new Error('Failed to fetch projects');
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
}): Promise<Project> {
    try {
        const res = await axios.post(`${API_BASE}/${appConfig.projectEndpoint}`, data);
        return res.data;
        } catch {
        throw new Error('Failed to add project');
    }
}

// удалить проект из базы
export async function deleteProject(id: number): Promise<void> {
    try {
        await axios.delete(`${API_BASE}/${appConfig.projectEndpoint}/${id}`);
        } catch {
        throw new Error('Failed to delete project');
    }
}

// получить один проект по ID
export async function getProject(id: string): Promise<Project | null> {
    try {
        const res = await axios.get(`${API_BASE}/${appConfig.projectEndpoint}/${id}`);
        return res.data;
        } catch (error) {
        console.error('Error fetching project:', error);
        return null;
    }
}