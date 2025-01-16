"use client";
import React, { useState } from "react";
import MonacoEditor from "@monaco-editor/react";
import HtmlOutput from "@/components/HtmlOutput";
import FigmaEmbedSection from "@/components/FigmaEmbedSection";
import { Button } from "@/components/ui/button";

const Page = () => {
    const [html, setHtml] = useState("<div>test</div>");
    const [css, setCss] = useState("body { color: white; }");
    const [javascript, setJavascript] = useState("document.body.style.backgroundColor = 'black';");
    const [activeTab, setActiveTab] = useState("html");
    const handleEditorChange = (value: any) => {
        if (activeTab === "html") setHtml(value);
        else if (activeTab === "css") setCss(value);
        else if (activeTab === "javascript") setJavascript(value);
    };

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-black">
            {/* Tabs */}

            <div className="flex-1 grid grid-cols-[30%_30%_39%] gap-2 p-4 overflow-auto">
                {/* Figma Section */}
                <div className="overflow-auto border border-gray-800 rounded p-2">
                    <FigmaEmbedSection />
                </div>

                {/* Monaco Editor */}
                <div className="rounded overflow-hidden  border border-gray-800 w-full">
                    <div className="flex space-x-4 p-4 ">
                        {["html", "css", "javascript"].map((tab) => (
                            <Button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`${activeTab === tab
                                    ? "bg-gray-700 text-white"
                                    : "text-gray-400"
                                    }`}
                            >
                                {tab.toUpperCase()}
                            </Button>
                        ))}
                    </div>
                    <MonacoEditor
                        height={"calc(100vh - 100px)"}
                        language={activeTab}
                        theme="vs-dark"
                        value={
                            activeTab === "html"
                                ? html
                                : activeTab === "css"
                                    ? css
                                    : javascript
                        }
                        onChange={handleEditorChange}
                        options={{
                            minimap: { enabled: false },
                            wordWrap: "on",
                            scrollBeyondLastLine: false,
                            automaticLayout: true,
                        }}
                    />
                </div>

                {/* Output Display */}
                <div className="overflow-auto rounded p-2 border border-gray-800">
                    <HtmlOutput html={html} css={css} javascript={javascript} />
                </div>
            </div>

        </div>
    );
};

export default Page;
