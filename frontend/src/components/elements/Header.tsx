'use client'

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AuthModal } from "@/components/auth/AuthModal";
import { usePathname } from "next/navigation";

export function Header() {
    const { user, logout, isAuthenticated } = useAuth();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
    const pathname = usePathname();

    const handleLogin = () => {
        setAuthMode('login');
        setIsAuthModalOpen(true);
    };

    const handleRegister = () => {
        setAuthMode('register');
        setIsAuthModalOpen(true);
    };

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <>
            <div className="flex items-center justify-between gap-4 p-4">
                <Link href={'/'} className="font-bold text-xl text-green-600 hover:text-green-800 transition-colors">
                    PracticCRM
                </Link>
                
                <nav className="flex items-center gap-4">
                    {isAuthenticated ? (
                        <>
                            <Link href={'/projects'} className="text-gray-600 hover:text-gray-900">
                                Проекты
                            </Link>
                            <Link href={'/tasks'} className="text-gray-600 hover:text-gray-900">
                                Задачи
                            </Link>
                            
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-gray-600">
                                    Привет, {user?.name}!
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                                >
                                    Выйти
                                </button>
                            </div>
                        </>
                    ) : (
                        // Показываем кнопки входа только на главной странице
                        pathname === '/' && (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleLogin}
                                    className="text-gray-600 hover:text-gray-900 px-3 py-1 rounded border border-gray-300 hover:border-gray-400 transition-colors"
                                >
                                    Войти
                                </button>
                                <button
                                    onClick={handleRegister}
                                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition-colors"
                                >
                                    Регистрация
                                </button>
                            </div>
                        )
                    )}
                </nav>
            </div>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                defaultMode={authMode}
            />
        </>
    );
}