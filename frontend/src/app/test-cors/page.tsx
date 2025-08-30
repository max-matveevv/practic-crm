'use client';

import { useState } from 'react';
import { AddProjectForm } from '@/components/AddProjectForm';

export default function TestCors() {
    const [message, setMessage] = useState('');

    async function testApi() {
        try {
            const res = await fetch('http://localhost:8000/api/test');
            if (!res.ok) throw new Error('Ошибка сети ' + res.status);
            const data = await res.json();
            setMessage('Ответ API: ' + JSON.stringify(data));
        } catch (e) {
            setMessage('Ошибка: ' + (e instanceof Error ? e.message : String(e)));
        }
    }

    return (
        <main style={{ padding: 20 }}>
            <h1>Тест CORS</h1>
            <button onClick={testApi} style={{ marginBottom: 20 }}>
                Запрос к API Laravel
            </button>
            <pre>{message}</pre>


            <AddProjectForm onProjectAdded={(project) => console.log('Project added:', project)} />
        </main>
    );
}
