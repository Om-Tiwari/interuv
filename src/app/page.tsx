'use client';

import { Sidebar } from "@/components/Sidebar";
import { QuestionsProvider } from "@/context/QuestionsContext";
import { UploadOverlay } from "@/components/UploadOverlay";
import React, { useState } from "react";
import { Chat } from "@/components/chatComponent";
import Editor from "@/components/Editor";

export default function Page() {
  const [isOverlayOpen, setIsOverlayOpen] = useState(true);

  return (
    <QuestionsProvider>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
        <Sidebar onUploadClick={() => setIsOverlayOpen(true)} />
        <div className="flex-1 overflow-hidden">
          <div className="grid grid-cols-2 gap-4 h-full p-4">
            <div className="h-full overflow-auto">
              <Chat />
            </div>
            <div className="h-full overflow-auto">
              <Editor />
            </div>
          </div>
        </div>
        <UploadOverlay
          isOpen={isOverlayOpen}
          onClose={() => setIsOverlayOpen(false)}
        />
      </div>
    </QuestionsProvider>
  );
}
