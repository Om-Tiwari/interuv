"use client";

import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Editor from "./Editor";
import FigmaEditor from "./FigmaEditor";
import ReactEditor from "./ReactEditor";
import Image from "next/image";

export function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  return (
    <div className="flex h-screen">
      <Tabs
        defaultValue="editor"
        className="flex w-full bg-"
        orientation="vertical"
      >
        <div
          className={cn(
            "flex flex-col h-full bg-white/10 backdrop-blur-md border-r border-gray-200 dark:border-gray-700 transition-all duration-300",
            sidebarOpen ? "w-64" : "w-0"
          )}
        >
          <TabsList
            className={cn(
              "flex flex-col items-start justify-start h-full space-y-2 p-4",
              sidebarOpen ? "opacity-100" : "opacity-0"
            )}
          >
            <div className="flex items-center justify-between w-full mb-8">
              <h1 className="text-3xl mt-3 font-bold text-gray-800 dark:text-white flex flex-row gap-2">
                <Image
                  src="/icon.png"
                  width={40}
                  height={50}
                  alt="logo"
                  className="rounded-lg"
                />
                PixelMatch
              </h1>
            </div>
            <TabsTrigger
              value="editor"
              className="w-full justify-start py-3 px-4 text-left hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              Figma Editor
            </TabsTrigger>
            <TabsTrigger
              value="full-editor"
              className="w-full justify-start py-3 px-4 text-left hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              React Editor
            </TabsTrigger>
            <TabsTrigger
              value="react-editor"
              className="w-full justify-start py-3 px-4 text-left hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              Common Editor
            </TabsTrigger>
          </TabsList>
        </div>
        <div className="flex-1 flex flex-col">
          {/* <div className="p-4 flex justify-between items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              {sidebarOpen ? (
                <PanelLeftClose className="h-5 w-5" />
              ) : (
                <PanelLeftOpen className="h-5 w-5" />
              )}
              <span className="sr-only">
                {sidebarOpen ? "Close sidebar" : "Open sidebar"}
              </span>
            </Button>
          </div> */}
          <div className="flex-1 overflow-auto">
            <TabsContent value="editor" className="h-full">
              <FigmaEditor />
            </TabsContent>
            <TabsContent value="full-editor" className="h-full">
              <ReactEditor />
            </TabsContent>
            <TabsContent value="react-editor" className="h-full">
              <Editor />
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  );
}
