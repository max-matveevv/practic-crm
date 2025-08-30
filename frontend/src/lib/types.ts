export type Project = {
    id: number
    title: string
    description?: string
    login?: string
    password?: string
    url?: string
    accesses?: string
    // Новые поля
    admin_url?: string
    admin_login?: string
    admin_password?: string
    ssh_host?: string
    ssh_user?: string
    ssh_password?: string
    ssh_port?: number
    build_commands?: string
    notes?: string
    created_at: string
    updated_at: string
    tasks_count?: {
        total: number
        pending: number
        in_progress: number
        completed: number
    }
}

export type Task = {
    id: number
    title: string
    description?: string
    status: 'pending' | 'in_progress' | 'completed'
    project_id?: number
    priority: 1 | 2 | 3
    created_at: string
    updated_at: string
    project?: Project
}