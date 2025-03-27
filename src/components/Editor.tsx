'use client';

import React, { useState, useEffect } from "react";
import { useQuestions, Question } from "@/context/QuestionsContext";
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import dynamic from 'next/dynamic';
import axios from "axios";
import { CODE_SNIPPETS, LANGUAGE_VERSIONS } from './data';

const CodeMirror = dynamic(
  () => import('@uiw/react-codemirror'),
  { ssr: false }
);

const safeStringify = (value: any): string => {
  if (typeof value === 'string') return value;
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value, null, 2);
    } catch (e) {
      return String(value);
    }
  }
  return String(value);
};

interface OutputProps {
  output: string;
  loading: boolean;
  error: boolean;
}

function Output({ output, loading, error }: OutputProps) {
  const containerClasses = `h-[200px] bg-[#1e1e1e] border rounded-md ${error ? 'border-red-500' : 'border-gray-700'}`;
  const textClasses = `p-4 ${error ? 'text-red-500' : 'text-white'}`;
  const displayText = loading ? 'Running...' : safeStringify(output) || 'Click "Run Code" to see the output here';

  return (
    <div className={containerClasses}>
      <div className="h-full overflow-auto">
        <pre className={`${textClasses} whitespace-pre font-mono text-sm min-w-fit`}>{displayText}</pre>
      </div>
    </div>
  );
}

export default function Editor() {
  const {
    questions,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    currentQuestion,
    setCurrentQuestion,
    currentJdId,
    editorContent,
    setEditorContent,
    editorLanguage,
    setEditorLanguage,
    addAnswer,
    setQuestions,
    jsonContent,
    setJsonContent
  } = useQuestions();

  const [output, setOutput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

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
        // Parse the question data
        const questionData = JSON.parse(currentQuestion.question);
        if (questionData.programmingLang) {
          setEditorLanguage(questionData.programmingLang.toLowerCase());
        }

        if (questionData.templateCode) {
          setEditorContent(questionData.templateCode);
        }
      }
    } catch (error) {
      console.error('Error parsing question data:', error);
      // Set default template code if parsing fails
      const defaultTemplate = CODE_SNIPPETS[editorLanguage as keyof typeof CODE_SNIPPETS];
      if (defaultTemplate) {
        setEditorContent(defaultTemplate);
      }
    }
  }, [currentQuestion, setEditorLanguage, setEditorContent, editorLanguage]);

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

      if (!editorContent) {
        throw new Error('No code to execute');
      }

      // Combine user code with testing code 
      let fullCode = editorContent;
      if (currentQuestion?.question) {
        try {
          const questionData = JSON.parse(currentQuestion.question);
          if (questionData) {
            fullCode = editorContent + "\n" + questionData.testCases + "\n" + questionData.evaluationFunction;
            console.log('Full code to execute:', fullCode);
          }
        } catch (error) {
          console.error('Error parsing question data:', error);
        }
      }

      const response = await axios.post("https://emkc.org/api/v2/piston/execute", {
        language: editorLanguage.toLowerCase(),
        version: LANGUAGE_VERSIONS[editorLanguage as keyof typeof LANGUAGE_VERSIONS],
        files: [
          {
            name: "main",
            content: fullCode
          }
        ],
        stdin: ""
      });

      if (response.data.run) {
        const { stdout, stderr } = response.data.run;
        if (stdout) {
          setOutput(safeStringify(stdout));
          setIsError(false);
        } else if (stderr) {
          setOutput(safeStringify(stderr));
          setIsError(true);
        } else {
          setOutput('No output from execution');
          setIsError(true);
        }
      } else {
        setOutput('Invalid response from execution server');
        setIsError(true);
      }
    } catch (error: any) {
      console.error('Execution error:', error);
      setIsError(true);
      setOutput(safeStringify(error.response?.data || error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitCode = async () => {
    try {
      setIsSubmitting(true);
      setIsError(false);
      setOutput('Submitting code...');

      if (!editorContent || !currentJdId || !currentQuestion) {
        throw new Error('Missing required data for submission');
      }

      // First, execute the code to get the evaluation
      let evaluationResult = '';
      try {
        // Combine user code with test cases
        const questionData = JSON.parse(currentQuestion.question);
        const fullCode = editorContent + "\n" + questionData.testCases + "\n" + questionData.evaluationFunction;

        const execResponse = await axios.post("https://emkc.org/api/v2/piston/execute", {
          language: editorLanguage.toLowerCase(),
          version: LANGUAGE_VERSIONS[editorLanguage as keyof typeof LANGUAGE_VERSIONS],
          files: [{ name: "main", content: fullCode }],
          stdin: ""
        });

        if (execResponse.data.run?.stdout) {
          evaluationResult = safeStringify(execResponse.data.run.stdout);
        }
      } catch (execError: any) {
        console.error('Code execution error:', execError);
        evaluationResult = 'Error executing code: ' + (execError.message || 'Unknown error');
      }

      // Prepare the payload for saving
      const payload = {
        jd_id: currentJdId,
        response: {
          question_id: currentQuestion.id,
          code: editorContent,
          language: editorLanguage.toLowerCase(),
          result: evaluationResult,
          timestamp: new Date().toISOString()
        }
      };

      console.log('Submitting payload:', payload);

      const response = await axios.post("http://localhost:8000/saveCode", payload, {
        headers: { 'Content-Type': 'application/json' }
      });

      console.log('Server response:', response.data);

      if (response.status === 200) {
        if (currentQuestionIndex < questions.length - 1) {
          // Move to next question
          const nextIndex = currentQuestionIndex + 1;
          setCurrentQuestionIndex(nextIndex);
          const nextQuestion = questions[nextIndex];
          setCurrentQuestion(nextQuestion);

          try {
            const nextQuestionData = JSON.parse(nextQuestion.question);
            setEditorContent(nextQuestionData.templateCode || '');
            setEditorLanguage(nextQuestionData.programmingLang?.toLowerCase() || 'javascript');
            setOutput('Successfully submitted! Moving to next question...');
          } catch (parseError) {
            console.error('Error parsing next question:', parseError);
            setOutput('Submitted successfully, but error loading next question.');
          }
        } else {
          // All questions completed
          setOutput('All questions completed! Generating final evaluation...');
          try {
            const evaluationEndpoint = `http://localhost:8000/evaluateCode?jd_id=${currentJdId}`;
            console.log('Calling evaluation endpoint:', evaluationEndpoint);

            const evaluationResponse = await axios.get(
              evaluationEndpoint,
              {
                headers: {
                  'Accept': 'application/json'
                }
              }
            );

            console.log('Evaluation response:', evaluationResponse.data);

            if (evaluationResponse.data?.error) {
              throw new Error(evaluationResponse.data.error);
            }

            setOutput(`Assessment completed!\n${safeStringify(evaluationResponse.data)}`);
            setIsError(false);
          } catch (evalError: any) {
            console.error('Evaluation error:', evalError);
            const errorDetail =
              evalError.response?.data?.error ||
              evalError.message ||
              'Failed to evaluate code';
            setOutput(`Evaluation failed: ${errorDetail}`);
            setIsError(true);
          }
        }
      }
    } catch (error: any) {
      console.error('Submission error:', error);
      setIsError(true);
      setOutput(safeStringify(error.response?.data || error));
    } finally {
      setIsSubmitting(false);
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
          {currentJdId && (
            <div className="text-sm text-gray-400">
              JD ID: <span className="text-blue-400">{currentJdId}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-400">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
          <div className="flex gap-2">
            <button
              onClick={executeCode}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
              disabled={isLoading || isSubmitting || !currentQuestion}
            >
              {isLoading ? 'Running...' : 'Run Code'}
            </button>
            <button
              onClick={handleSubmitCode}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors"
              disabled={isLoading || isSubmitting || !currentQuestion}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Code'}
            </button>
          </div>
        </div>
      </div>
      {!currentQuestion && (
        <div className="text-center text-gray-400 py-4">
          Please wait for a question to be loaded...
        </div>
      )}
      {currentQuestion && (
        <>
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
              }}
              style={{ height: '100%', minHeight: '200px', overflow: 'auto' }}
            />
          </div>
          <Output output={output} loading={isLoading} error={isError} />
        </>
      )}
    </div>
  );
}
