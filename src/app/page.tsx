'use client';

import { QuestionsProvider } from "@/context/QuestionsContext";
import { MainLayout } from "@/components/layouts/MainLayout";

export default function Page() {
  return (
    <QuestionsProvider>
      <MainLayout />
    </QuestionsProvider>
  );
}
