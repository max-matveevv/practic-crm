import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Header } from "@/components/elements/Header";
import { Sidebar } from "@/components/elements/Sidebar";
import { Footer } from "@/components/elements/Footer";
import { metadataConfigs } from "@/lib/metadata";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = metadataConfigs.protected();

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
					<div className="container h-full">
						<Header />

						<div className="flex h-[calc(100%-100px)] mb-6">
							
							<Sidebar />

							<div className="w-[calc(100%-250px-1rem)] bg-bg-2 rounded-r-xl">
								{children}
							</div>
						</div>

						<Footer />
					</div>
				</AuthProvider>
			</body>
		</html>
	);
}
