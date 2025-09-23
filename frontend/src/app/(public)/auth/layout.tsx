import type { Metadata } from "next";
import { metadataConfigs } from "@/lib/metadata";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = metadataConfigs.auth();

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
