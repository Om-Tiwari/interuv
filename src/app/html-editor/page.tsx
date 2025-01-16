"use client"
import React, { useState } from "react";
import MonacoEditor from "@monaco-editor/react";
import HtmlOutput from "@/components/HtmlOutput";

const Page = () => {
    const [html, setHtml] = useState("");
    const [css, setCss] = useState("");
    const [javascript, setJavascript] = useState("");
    const [activeTab, setActiveTab] = useState("html");
    const handleEditorChange = (value: any) => {
        if (activeTab === "html") setHtml(value);
        else if (activeTab === "css") setCss(value);
        else if (activeTab === "javascript") setJavascript(value);
    };

    return (
        <div className="flex flex-col h-screen bg-gray-900 text-white">
            {/* Tabs */}
            <div className="flex space-x-4 p-4 bg-gray-800">
                {["html", "css", "javascript"].map((tab) => (
                    <button
                        key={tab}
                        className={`px-4 py-2 rounded ${activeTab === tab
                            ? "bg-blue-600 text-white"
                            : "bg-gray-700 hover:bg-gray-600"
                            }`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab.toUpperCase()}
                    </button>
                ))}
            </div>

            {/* Editor Section */}
            <div className="flex-1 grid grid-cols-2 gap-4 p-4">
                {/* Monaco Editor */}
                <div className="bg-gray-800 rounded overflow-hidden">
                    <MonacoEditor
                        height="100%"
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
                <HtmlOutput html={html} css={css} javascript={javascript} />
            </div>
        </div>
    );
};

export default Page;
