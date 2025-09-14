import type { Metadata } from "next";
import { metadataConfigs } from "@/lib/metadata";
import TasksPageClient from './TasksPageClient';

export const metadata: Metadata = metadataConfigs.tasks();

export default function TasksPage() {
  return <TasksPageClient />;
}