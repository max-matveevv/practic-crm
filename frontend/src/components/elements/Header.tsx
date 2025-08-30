import Link from "next/link";

export function Header () {
    return (
        <div className="flex items-center justify-between gap-4 p-4">
            <Link href={'/'} className="font-bold text-xl text-red-600 hover:text-green-800 transition-colors">
                PracticCRM
            </Link>
            <nav className="flex gap-4">
                <Link href={'/projects'} className="text-gray-600 hover:text-gray-900">
                    Проекты
                </Link>
                <Link href={'/tasks'} className="text-gray-600 hover:text-gray-900">
                    Задачи
                </Link>
            </nav>
        </div>
    )
}