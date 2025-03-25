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
  const {
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

        // Set the programming language if it exists
        if (questionData.programmingLang) {
          setEditorLanguage(questionData.programmingLang.toLowerCase());
        }

        if (questionData.templateCode) {
          setEditorContent(questionData.templateCode);
        } else {
          // Fallback to default template if no template code is provided
          const defaultTemplate = CODE_SNIPPETS[editorLanguage as keyof typeof CODE_SNIPPETS];
          if (defaultTemplate) {
            setEditorContent(defaultTemplate);
          }
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

      // Combine user code with testing code if available
      let fullCode = editorContent;
      if (currentQuestion?.question) {
        try {
          console.log('Current question data:', currentQuestion.question);
          const questionData = JSON.parse(currentQuestion.question);
          if (questionData) {
            fullCode = editorContent + "\n\n" + questionData.evaluationFunction + "\n\n" + "evaluate(solution)";
            console.log('Full code to execute:', fullCode);
          }
        } catch (error) {
          console.error('Error parsing question data:', error);
        }
      }

      console.log('Sending code to API:', {
        language: editorLanguage.toLowerCase(),
        version: LANGUAGE_VERSIONS[editorLanguage as keyof typeof LANGUAGE_VERSIONS],
        code: fullCode
      });

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

      console.log('API Response:', response.data);

      if (response.data.run) {
        const { stdout, stderr } = response.data.run;
        if (stdout) {
          setOutput(stdout);
          setIsError(false);
        } else if (stderr) {
          setOutput(stderr);
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
      setOutput(error.response?.data?.message || error.message || 'Error executing code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitCode = async () => {
    try {
      setIsSubmitting(true);
      setIsError(false);

      if (!editorContent) {
        throw new Error('No code to submit');
      }

      if (!currentJdId) {
        throw new Error('Please upload a job description first to get started.');
      }

      if (!currentQuestion) {
        throw new Error('No question is currently selected');
      }

      // Ensure currentQuestion.id is a valid number
      const questionId = Number(currentQuestion.id);
      if (isNaN(questionId)) {
        console.error('Invalid question ID:', currentQuestion.id);
        throw new Error('Invalid question data. Please try refreshing the page.');
      }

      console.log('Submitting code with:', {
        jd_id: currentJdId,
        questionId: questionId,
        language: editorLanguage.toLowerCase(),
        currentQuestion: currentQuestion,
        jsonContent: jsonContent
      });

      const response = await axios.post("http://localhost:8000/evaluateCode", {
        code: editorContent,
        output: output,
        language: editorLanguage.toLowerCase(),
        questionId: questionId,
        jd_id: currentJdId
      });

      console.log('Submission response:', response.data);

      // Add submission confirmation to chat UI
      addAnswer(questionId, `✅ Question ${questionId} submitted successfully`);

      // Fetch next question immediately after successful submission
      try {
        let contentToUse = jsonContent;
        if (!contentToUse && currentJdId) {
          // Try to retrieve jsonContent from localStorage
          const storedContent = localStorage.getItem(`jd_content_${currentJdId}`);
          if (storedContent) {
            const parsedContent = JSON.parse(storedContent);
            setJsonContent(parsedContent);
            contentToUse = parsedContent;
          } else {
            throw new Error('Job description data is missing. Please upload the job description again.');
          }
        } else if (!contentToUse) {
          throw new Error('Job description data is missing. Please upload the job description again.');
        }

        const nextQuestionResponse = await axios.post('http://localhost:8000/Codequestion', {
          jd_data: contentToUse,
          jd_id: currentJdId
        });

        console.log('Next question response:', nextQuestionResponse.data);

        if (nextQuestionResponse.data) {
          const newQuestion: Question = {
            id: Date.now(),
            question: JSON.stringify(nextQuestionResponse.data),
            type: 'coding',
            jd_id: currentJdId
          };

          console.log('Setting next question:', newQuestion);

          // First update the questions array to trigger chat update
          setQuestions(prevQuestions => [...prevQuestions, newQuestion]);

          // Then set the current question
          setCurrentQuestion(newQuestion);

          // Update editor content with new question's template code
          try {
            const questionData = JSON.parse(newQuestion.question);
            if (questionData.programmingLang) {
              setEditorLanguage(questionData.programmingLang.toLowerCase());
            }
            if (questionData.templateCode) {
              setEditorContent(questionData.templateCode);
            } else {
              // Fallback to default template if no template code is provided
              const defaultTemplate = CODE_SNIPPETS[editorLanguage as keyof typeof CODE_SNIPPETS];
              if (defaultTemplate) {
                setEditorContent(defaultTemplate);
              } else {
                setEditorContent('');
              }
            }
          } catch (error) {
            console.error('Error parsing new question data:', error);
            setEditorContent('');
          }

          // No need to add answer here as the chat component will handle displaying the question
        }
      } catch (error) {
        console.error('Error fetching next question:', error);
        setIsError(true);
        setOutput('Failed to fetch next question');
      }

      setOutput('Code submitted successfully!');
      setIsError(false);
    } catch (error: any) {
      console.error('Submission error:', error);
      setIsError(true);
      setOutput(error.response?.data?.message || error.message || 'Error submitting code');
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
          {currentQuestion && (
            <div className="text-sm text-gray-400">
              Question ID: <span className="text-blue-400">{String(currentQuestion.id)}</span>
            </div>
          )}
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
