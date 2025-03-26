"use client";

import * as React from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import Editor from "./Editor";
import { Chat } from "./chat/Chat";

interface SidebarProps {
  onUploadClick: () => void;
}

export function Sidebar({ onUploadClick }: SidebarProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Tabs defaultValue="react-editor" className="flex w-full h-full" orientation="vertical">
        <div
          className={cn(
            "flex flex-col h-full bg-white/10 backdrop-blur-md border-r border-gray-200 dark:border-gray-700 transition-all duration-300 min-w-[300px]",
            sidebarOpen ? "w-1/3" : "w-0"
          )}
        >
          <Chat />
        </div>
        <div className="flex-1 flex flex-col h-full min-w-0">
          <div className="flex-1 overflow-hidden">
            <TabsContent value="react-editor" className="h-full">
              <Editor />
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  );
}