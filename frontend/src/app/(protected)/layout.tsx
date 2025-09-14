import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { Header } from "@/components/elements/Header";
import { Sidebar } from "@/components/elements/Sidebar";
import { Footer } from "@/components/elements/Footer";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "PracticCRM - Управление проектами",
	description: "Система управления проектами и задачами",
};

export default function ProtectedLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ru">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen`}
			>
				<AuthProvider>
					<AuthGuard>
						<div className="container h-full">
							<Header />

							<div className="flex h-[calc(100%-100px)]">
								
								<Sidebar />

								<div className="w-[calc(100%-250px-1rem)] bg-bg-2 rounded-r-xl">
									{children}
								</div>
							</div>

							<Footer />
						</div>
					</AuthGuard>
				</AuthProvider>
			</body>
		</html>
	);
}
