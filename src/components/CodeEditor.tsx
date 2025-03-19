/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import LanguageSelector from "./LanguageSelector";
import { CODE_SNIPPETS, LANGUAGE_VERSIONS } from "./data";
import Output from "./Output";
import { useQuestions } from "@/context/QuestionsContext";

// Dynamically import MonacoEditor to avoid SSR issues
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

const CodeEditor = () => {
  const {
    editorContent: code,
    setEditorContent: setCode,
    editorLanguage: language,
    setEditorLanguage: setLanguage,
    currentQuestion
  } = useQuestions();

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    // Set default template code for the selected language
    const templateCode = CODE_SNIPPETS[value as keyof typeof CODE_SNIPPETS];
    if (templateCode) {
      setCode(templateCode);
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value);
    }
  };

  const executeCode = async () => {
    try {
      const response = await axios.post("https://emkc.org/api/v2/piston/execute", {
        language: language.toLowerCase(),
        version: LANGUAGE_VERSIONS[language as keyof typeof LANGUAGE_VERSIONS],
        files: [
          {
            content: code,
          },
        ],
      });
      // Handle response if needed
      console.log('Code execution response:', response.data);
    } catch (error) {
      console.error("Error executing code:", error);
    }
  };

  return (
    <div className="h-full">
      <div className="flex h-full flex-col">
        <div className="mb-2 flex justify-between">
          <LanguageSelector language={language} setLanguage={handleLanguageChange} />
          <div className="flex gap-2">
            <button
              onClick={executeCode}
              className="px-4 py-2 bg-blue-500 hover:bg-slate-600 text-white rounded-md"
            >
              Run Code
            </button>
          </div>
        </div>
        <div className="flex-1 border border-gray-700 rounded-md overflow-hidden">
          <MonacoEditor
            height="100%"
            language={language.toLowerCase()}
            theme="vs-dark"
            value={code}
            onChange={handleEditorChange}
            options={{
              minimap: { enabled: false },
              wordWrap: "on",
              scrollBeyondLastLine: false,
              automaticLayout: true,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
