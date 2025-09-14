import Link from "next/link";
import { appConfig } from "@/lib/config";

export function Sidebar () {
    return (
        <div className="w-[250px] bg-bg-1 rounded-l-xl flex flex-col gap-4 py-6 px-6">
            <Link href={`/dashboard`} className="text-sm">Дашборд</Link>
            <Link href={`/${appConfig.projectEndpoint}`} className="text-sm">Проекты</Link>
            <Link href={'/tasks'} className="text-sm">
                Задачи
            </Link>
        </div>
    )
}