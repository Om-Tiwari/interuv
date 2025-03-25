"use client";

import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useQuestions } from "@/context/QuestionsContext";
import { Textarea } from "@/components/ui/textarea";
import ReactDOMServer from "react-dom/server";

interface Message {
  id: string;
  text: string;
  sender: "Candidate" | "Interviewer";
  timestamp?: string;
  isHtml?: boolean;
}

interface QuestionData {
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  questionText?: string;
  inputDescription?: string;
  outputDescription?: string;
  constraints?: string[];
  sampleInputOutput?: string[] | string;
  explanation?: string;
  programmingLang?: string;
  templateCode?: string;
  testCases?: string;
  evaluationFunction?: string;
}

// Helper function to format time consistently
const formatTime = (date: Date) => {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

// Message Components
const DifficultyBadge = ({ difficulty }: { difficulty: string }) => {
  const difficultyColors = {
    'Easy': 'bg-green-500/20 text-green-400 border-green-500/50',
    'Medium': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
    'Hard': 'bg-red-500/20 text-red-400 border-red-500/50'
  } as const;
  const colorClasses = difficultyColors[difficulty as keyof typeof difficultyColors] || 'bg-blue-500/20 text-blue-400 border-blue-500/50';
  return (
    <div className={`px-3 py-1 rounded-full border ${colorClasses} text-sm font-medium`}>
      {difficulty}
    </div>
  );
};

const LanguageBadge = ({ language }: { language: string }) => (
  <div className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/50 text-sm font-medium">
    {language}
  </div>
);

const MessageSection = ({ title, children, className = '' }: { title: string; children: React.ReactNode; className?: string }) => (
  <div className={`bg-gray-800/50 rounded-lg p-4 ${className}`}>
    <div className="text-blue-400 font-medium mb-2">{title}</div>
    {children}
  </div>
);

const CodeBlock = ({ code }: { code: string }) => (
  <div className="font-mono bg-black/30 p-3 rounded text-sm text-gray-300 whitespace-pre overflow-x-auto">
    {code}
  </div>
);

const QuestionMessage = ({ questionData, questionId }: { questionData: QuestionData; questionId: string }) => {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-700 pb-2">
        <div className="flex items-center gap-3">
          {questionData.difficulty && <DifficultyBadge difficulty={questionData.difficulty} />}
          {questionData.programmingLang && <LanguageBadge language={questionData.programmingLang} />}
        </div>
        <div className="text-sm text-gray-400">Question ID: {questionId}</div>
      </div>

      {/* Question Content */}
      <div className="space-y-4">
        <div className="text-lg font-semibold text-white">{questionData.questionText}</div>

        {/* Input/Output Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {questionData.inputDescription && (
            <MessageSection title="Input Description">
              <div className="text-gray-300">{questionData.inputDescription}</div>
            </MessageSection>
          )}
          {questionData.outputDescription && (
            <MessageSection title="Output Description">
              <div className="text-gray-300">{questionData.outputDescription}</div>
            </MessageSection>
          )}
        </div>

        {/* Constraints */}
        {questionData.constraints && (
          <MessageSection title="Constraints">
            <ul className="list-disc list-inside space-y-1 text-gray-300">
              {Array.isArray(questionData.constraints)
                ? questionData.constraints.map((constraint: string, index: number) => (
                  <li key={`constraint-${index.toString()}`}>{constraint}</li>
                ))
                : <li>{questionData.constraints}</li>
              }
            </ul>
          </MessageSection>
        )}

        {/* Sample Input/Output */}
        {questionData.sampleInputOutput && (
          <MessageSection title="Sample Input/Output">
            <CodeBlock code={Array.isArray(questionData.sampleInputOutput)
              ? questionData.sampleInputOutput.join('\n')
              : questionData.sampleInputOutput
            } />
          </MessageSection>
        )}

        {/* Explanation */}
        {questionData.explanation && (
          <MessageSection title="Explanation">
            <div className="text-gray-300">{questionData.explanation}</div>
          </MessageSection>
        )}

        {/* Template Code */}
        {questionData.templateCode && (
          <MessageSection title="Template Code">
            <CodeBlock code={questionData.templateCode} />
          </MessageSection>
        )}
      </div>
    </div>
  );
};

const ChatMessage = ({ message }: { message: Message }) => (
  <div
    className={`mb-6 ${message.sender === "Interviewer"
      ? "bg-gray-800/30 border border-gray-700"
      : "bg-blue-900/20 border border-blue-800/30"
      } rounded-lg overflow-hidden`}
  >
    <div className="px-4 py-2 bg-black/20">
      <div className="text-sm text-gray-400">{message.timestamp}</div>
    </div>
    <div className="p-4">
      {message.isHtml ? (
        <div
          className="message-content prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: message.text }}
        />
      ) : (
        <div className="whitespace-pre-wrap text-gray-300">{message.text}</div>
      )}
    </div>
  </div>
);

export function Chat() {
  const { questions, addAnswer, setCurrentQuestion } = useQuestions();
  const messageIdCounter = useRef(0);
  const generateUniqueId = () => `msg-${Date.now()}-${++messageIdCounter.current}`;

  const [messages, setMessages] = useState<Message[]>([
    {
      id: generateUniqueId(),
      text: "Welcome to the coding round!",
      sender: "Interviewer",
      timestamp: formatTime(new Date()),
    },
  ]);

  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Update messages when questions change
  useEffect(() => {
    const updateMessages = () => {
      if (!questions || questions.length === 0) return;

      try {
        const currentQuestion = questions[questions.length - 1];
        const parsedQuestion = JSON.parse(currentQuestion.question);
        const questionsArray = parsedQuestion.questions || [parsedQuestion];

        const questionMessages = questionsArray.map((questionData: QuestionData) => ({
          id: generateUniqueId(),
          text: ReactDOMServer.renderToString(
            <QuestionMessage
              questionData={questionData}
              questionId={currentQuestion.id.toString()}
            />
          ),
          sender: "Interviewer" as const,
          timestamp: formatTime(new Date()),
          isHtml: true
        }));

        setMessages(prev => {
          const welcomeMessage = prev.find(m => m.text === "Welcome to the coding round!");
          return [...(welcomeMessage ? [welcomeMessage] : []), ...questionMessages];
        });
      } catch (error) {
        setMessages(prev => {
          const welcomeMessage = prev.find(m => m.text === "Welcome to the coding round!");
          return [...(welcomeMessage ? [welcomeMessage] : []), {
            id: generateUniqueId(),
            text: "Error: Could not parse question data. Please try again.",
            sender: "Interviewer" as const,
            timestamp: formatTime(new Date()),
            isHtml: false
          }];
        });
      }
    };

    updateMessages();
  }, [questions]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    const userMessage: Message = {
      id: generateUniqueId(),
      text: newMessage,
      sender: "Candidate",
      timestamp: formatTime(new Date()),
    };

    setMessages((prev) => [...prev, userMessage]);
    setNewMessage("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white rounded-md overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="p-4 border-t border-gray-800 bg-gray-900/80 backdrop-blur">
        <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto">
          <div className="flex gap-3">
            <Textarea
              value={newMessage}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 min-h-[80px] max-h-[200px] bg-gray-800 border-gray-700 text-white resize-y rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Button
              type="submit"
              className="self-end px-6 h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              Send
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
