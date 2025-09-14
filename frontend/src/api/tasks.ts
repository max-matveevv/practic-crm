import { Task } from "@/lib/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

// Получить токен из localStorage
const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token')
  }
  return null
}

// Получить CSRF токен из cookies
const getCsrfToken = (): string | null => {
  if (typeof window !== 'undefined') {
    const cookies = document.cookie.split(';')
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split('=')
      if (name === 'XSRF-TOKEN') {
        return decodeURIComponent(value)
      }
    }
  }
  return null
}

// Получить заголовки с авторизацией
const getAuthHeaders = (): HeadersInit => {
  const token = getToken()
  const csrfToken = getCsrfToken()
  
  if (!token) {
    throw new Error('Токен авторизации не найден')
  }
  
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'Authorization': `Bearer ${token}`,
    ...(csrfToken && { 'X-XSRF-TOKEN': csrfToken })
  }
}

// получить все задачи
export async function fetchTasks(params?: {
    project_id?: number;
    status?: string;
}): Promise<Task[]> {
    try {
        const queryParams = new URLSearchParams();
        if (params?.project_id) queryParams.append('project_id', params.project_id.toString());
        if (params?.status) queryParams.append('status', params.status);
        
        const url = `${API_BASE_URL}/tasks${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: getAuthHeaders(),
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Failed to fetch tasks');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching tasks:', error);
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
        const response = await fetch(`${API_BASE_URL}/tasks`, {
            method: 'POST',
            headers: getAuthHeaders(),
            credentials: 'include',
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Failed to add task');
        }

        return await response.json();
    } catch (error) {
        console.error('Error adding task:', error);
        throw new Error('Failed to add task');
    }
}

// обновить задачу
export async function updateTask(id: number, data: Partial<Task>): Promise<Task> {
    try {
        const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            credentials: 'include',
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Failed to update task');
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating task:', error);
        throw new Error('Failed to update task');
    }
}

// удалить задачу
export async function deleteTask(id: number): Promise<void> {
    try {
        const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Failed to delete task');
        }
    } catch (error) {
        console.error('Error deleting task:', error);
        throw new Error('Failed to delete task');
    }
}

// получить задачу по ID
export async function getTask(id: string): Promise<Task | null> {
    try {
        const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            if (response.status === 404) {
                return null;
            }
            throw new Error('Failed to fetch task');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching task:', error);
        return null;
    }
}

// получить задачи проекта
export async function getProjectTasks(projectId: number): Promise<Task[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/tasks/projects/${projectId}`, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error('Failed to fetch project tasks');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching project tasks:', error);
        throw new Error('Failed to fetch project tasks');
    }
}
