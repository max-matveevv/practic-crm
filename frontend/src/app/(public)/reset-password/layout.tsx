import type { Metadata } from "next";
import { metadataConfigs } from "@/lib/metadata";

export const metadata: Metadata = metadataConfigs.resetPassword();

export default function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
