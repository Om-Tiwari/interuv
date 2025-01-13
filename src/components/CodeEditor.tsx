/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import LanguageSelector from "./LanguageSelector";
import { CODE_SNIPPETS } from "./data";

// Dynamically import MonacoEditor to avoid SSR issues
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

const ClientSideMonaco = () => {
  const [output, setOutput] = useState<string>("");
  const [language, setLanguage] = useState<string>("javascript"); // Default language
  const [code, setCode] = useState(CODE_SNIPPETS[language]);

  const handleLanguageChange = (value: string) => {
    setCode(CODE_SNIPPETS[value]);
    setLanguage(value);
  }


  const handleEditorChange = (value: string | undefined) => {
    setCode(value || "");

  };

  return (
    <div className="h-[80vh]">
      <div className="flex flex-col">
        <div className="mb-2 flex justify-between">
          <LanguageSelector language={language} setLanguage={handleLanguageChange} />
          <button
            // onClick={executeCode}
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Run Code
          </button>
        </div>
        <MonacoEditor
          height="70vh"
          language={language}
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
        {output && (
          <div className="mt-4 p-4 bg-gray-800 text-white rounded-md h-[20vh] overflow-auto">
            <h2 className="text-lg font-bold">Output</h2>
            <pre>{output}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientSideMonaco;
