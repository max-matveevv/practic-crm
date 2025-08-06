import Link from "next/link";

export function Header () {
    return (
        <div className="flex items-center justify-between gap-4 p-4">
            <Link href={'/'} className="font-bold text-xl">
                PracticCRM
            </Link>
        </div>
    )
}