import Link from "next/link";
import { appConfig } from "@/lib/config";

export function Sidebar () {
    return (
        <div className="bg-red flex flex-col gap-4 p-4">
            <Link href={`/${appConfig.projectEndpoint}`}>Проекты</Link>
        </div>
    )
}