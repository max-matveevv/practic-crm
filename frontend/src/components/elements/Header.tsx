import Link from "next/link";

export function Header () {
    return (
        <div className="flex items-center justify-between gap-4 p-4 bg-amber-950">
            <Link href={'/'}>
                Главная
            </Link>
        </div>
    )
}