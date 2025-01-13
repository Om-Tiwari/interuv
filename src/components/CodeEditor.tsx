/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import LanguageSelector from "./LanguageSelector";
import { CODE_SNIPPETS, LANGUAGE_VERSIONS } from "./data";
import { version } from "os";
import Output from "./Output";

// Dynamically import MonacoEditor to avoid SSR issues
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

const CodeEditor = () => {
  const [output, setOutput] = useState<string>("");
  const [language, setLanguage] = useState<string>("javascript"); // Default language
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [code, setCode] = useState<any>(CODE_SNIPPETS[language]);

  const handleLanguageChange = (value: string) => {
    setCode(CODE_SNIPPETS[value]);
    setLanguage(value);
  }


  const handleEditorChange = (value: string | undefined) => {
    setCode(value);

  };

  const executeCode = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post("https://emkc.org/api/v2/piston/execute", {
        "language": language,
        "version": LANGUAGE_VERSIONS[language],
        "files": [
          {
            content: code
          }]
      });
      setOutput(response.data.run.output);
      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
      setOutput(error.response.data.error || error.message || "An error occurred");
    }
  };

  return (
    <div className="h-[80vh]">
      <div className="flex flex-col">
        <div className="mb-2 flex justify-between ">
          <LanguageSelector language={language} setLanguage={handleLanguageChange} />
          <button
            onClick={executeCode}
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Run Code
          </button>
        </div>
        <div className="lg:flex gap-5">
          <div className="lg:w-1/2 border border-gray-700 rounded-md">
            <MonacoEditor
              height={"70vh"}
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
          </div>
          <div className="lg:w-1/2">
            <Output output={output} loading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
