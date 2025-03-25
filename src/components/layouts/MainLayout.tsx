'use client';

import React, { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { UploadOverlay } from "@/components/UploadOverlay";
import { Chat } from "@/components/chat/Chat";
import Editor from "@/components/Editor";

export function MainLayout() {
    const [isOverlayOpen, setIsOverlayOpen] = useState(true);

    return (
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
    );
} 