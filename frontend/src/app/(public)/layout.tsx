import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Header } from "@/components/elements/Header";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "PracticCRM - Система управления проектами",
	description: "Эффективное управление проектами и задачами",
};

export default function PublicLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ru">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gray-50`}
			>
				<AuthProvider>
					<Header />
					<main className="min-h-screen">
						{children}
					</main>
				</AuthProvider>
			</body>
		</html>
	);
}
