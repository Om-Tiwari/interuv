'use client';

import React, { useState, useEffect } from "react";
import { useQuestions } from "@/context/QuestionsContext";
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import dynamic from 'next/dynamic';
import axios from "axios";
import { CODE_SNIPPETS, LANGUAGE_VERSIONS } from './data';
import CodeEditor from "./CodeEditor";

const CodeMirror = dynamic(
  () => import('@uiw/react-codemirror'),
  { ssr: false }
);

interface OutputProps {
  output: string;
  loading: boolean;
  error: boolean;
}

function Output({ output, loading, error }: OutputProps) {
  const containerClasses = `h-[200px] bg-[#1e1e1e] border rounded-md ${error ? 'border-red-500' : 'border-gray-700'}`;
  const textClasses = `p-4 ${error ? 'text-red-500' : 'text-white'}`;
  const displayText = loading ? 'Running...' : output || 'Click "Run Code" to see the output here';

  return (
    <div className={containerClasses}>
      <div className="h-full overflow-auto">
        <pre className={`${textClasses} whitespace-pre font-mono text-sm min-w-fit`}>{displayText}</pre>
      </div>
    </div>
  );
}

export default function Editor() {
  const { questions, addAnswer } = useQuestions();
  const { editorContent, setEditorContent, editorLanguage, setEditorLanguage, currentQuestion } = useQuestions();
  const [output, setOutput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  const languages = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'csharp', label: 'C#' },
    { value: 'php', label: 'PHP' }
  ];

  useEffect(() => {
    try {
      if (currentQuestion?.question) {
        // Since question is stored as a JSON string, we need to parse it
        const questionData = JSON.parse(currentQuestion.question);

        // Check if programmingLang exists in the parsed data
        if (questionData.programmingLang) {
          setEditorLanguage(questionData.programmingLang.toLowerCase());
        }

        // Check if templateCode exists in the parsed data
        if (questionData.templateCode) {
          setEditorContent(questionData.templateCode);
        }
      }
    } catch (error) {
      console.error('Error parsing question data:', error);
    }
  }, [currentQuestion, setEditorLanguage, setEditorContent]);

  // Force update editor content when language changes
  useEffect(() => {
    if (editorContent === '') {
      // Get default template code for the current language
      const defaultTemplate = CODE_SNIPPETS[editorLanguage as keyof typeof CODE_SNIPPETS];
      if (defaultTemplate) {
        setEditorContent(defaultTemplate);
      }
    }
  }, [editorLanguage, editorContent, setEditorContent]);

  const getLanguageExtension = () => {
    switch (editorLanguage.toLowerCase()) {
      case 'javascript':
      case 'js':
        return javascript();
      case 'typescript':
      case 'ts':
        return javascript({ typescript: true });
      case 'python':
      case 'py':
        return python();
      default:
        return javascript();
    }
  };

  const executeCode = async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      const response = await axios.post("https://emkc.org/api/v2/piston/execute", {
        language: editorLanguage.toLowerCase(),
        version: LANGUAGE_VERSIONS[editorLanguage.toLowerCase() as keyof typeof LANGUAGE_VERSIONS],
        files: [
          {
            content: editorContent,
          },
        ],
      });
      setOutput(response.data.run.output);
      setIsError(response.data.run.stderr.length > 0);
    } catch (error: any) {
      setIsError(true);
      setOutput(error.response?.data?.message || error.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-full bg-gray-900 text-white p-4 rounded-md h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-400">Language:</div>
          <select
            value={editorLanguage}
            onChange={(e) => setEditorLanguage(e.target.value)}
            className="bg-gray-800 text-white border border-gray-700 rounded-md px-2 py-1 text-sm focus:outline-none focus:border-blue-500"
          >
            {languages.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={executeCode}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
          disabled={isLoading}
        >
          {isLoading ? 'Running...' : 'Run Code'}
        </button>
      </div>
      <div className="border border-gray-700 rounded-md flex-grow mb-4 overflow-hidden">
        <CodeMirror
          key={editorLanguage}
          value={editorContent}
          height="100%"
          width="100%"
          theme="dark"
          onChange={(value) => setEditorContent(value)}
          extensions={[getLanguageExtension()]}
          basicSetup={{
            lineNumbers: true,
            highlightActiveLineGutter: true,
            highlightActiveLine: true,
            foldGutter: true,
            dropCursor: true,
            allowMultipleSelections: true,
            indentOnInput: true,
            bracketMatching: true,
            closeBrackets: true,
            autocompletion: true,
            rectangularSelection: true,
            crosshairCursor: true,
            highlightSelectionMatches: true,
            scrollPastEnd: false,
          }}
          style={{ height: '100%', minHeight: '200px', overflow: 'auto' }}
        />
      </div>
      <Output output={output} loading={isLoading} error={isError} />
    </div>
  );
}
