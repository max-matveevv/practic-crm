import type { Metadata } from "next";
import { metadataConfigs } from "@/lib/metadata";

export const metadata: Metadata = metadataConfigs.auth();

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
