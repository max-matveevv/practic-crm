'use client'

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";

export function Header() {
    const { user, logout, isAuthenticated } = useAuth();
    const pathname = usePathname();

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
                <Link href={'/'} className="font-bold text-xl text-white hover:text-white/80 transition-colors">
                    PracticCRM
                </Link>
                
                <nav className="flex items-center gap-4">
                    {isAuthenticated ? (
                        <>
                            <Link href={'/dashboard'} className="text-white/70 hover:text-white text-sm transition-colors">
                                Дашборд
                            </Link>
                            <Link href={'/projects'} className="text-white/70 hover:text-white text-sm transition-colors">
                                Проекты
                            </Link>
                            <Link href={'/tasks'} className="text-white/70 hover:text-white text-sm transition-colors">
                                Задачи
                            </Link>
                            
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-white/70">
                                    Привет, {user?.name}!
                                </span>
                                <Button
                                    onClick={handleLogout}
                                    variant="danger"
                                    size="sm"
                                >
                                    Выйти
                                </Button>
                            </div>
                        </>
                    ) : (
                        // Показываем кнопки входа только на главной странице
                        pathname === '/' && (
                            <div className="flex items-center gap-2">
                                <Link href="/auth">
                                    <Button variant="secondary" size="sm">
                                        Войти
                                    </Button>
                                </Link>
                                <Link href="/auth">
                                    <Button size="sm">
                                        Регистрация
                                    </Button>
                                </Link>
                            </div>
                        )
                    )}
                </nav>
            </div>

        </>
    );
}