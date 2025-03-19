"use client";

import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useQuestions } from "@/context/QuestionsContext";
import { Textarea } from "@/components/ui/textarea";

interface Message {
  id: string;
  text: string;
  sender: "Candidate" | "Interviewer";
  timestamp?: string;
}

// Helper function to format time consistently
const formatTime = (date: Date) => {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

export function Chat() {
  const { questions, addAnswer, setCurrentQuestion } = useQuestions();
  const messageIdCounter = useRef(0);
  const generateUniqueId = () => {
    messageIdCounter.current += 1;
    return `msg-${Date.now()}-${messageIdCounter.current}`;
  };

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
    const questionMessages = questions.flatMap(q => {
      try {
        const questionData = JSON.parse(q.question);
        const messages = [];

        // Question text message
        messages.push({
          id: generateUniqueId(),
          text: questionData.questionText || q.question,
          sender: "Interviewer" as const,
          timestamp: formatTime(new Date()),
        });

        // Input Description
        if (questionData.inputDescription) {
          messages.push({
            id: generateUniqueId(),
            text: `Input Description:\n${questionData.inputDescription}`,
            sender: "Interviewer" as const,
            timestamp: formatTime(new Date()),
          });
        }

        // Output Description
        if (questionData.outputDescription) {
          messages.push({
            id: generateUniqueId(),
            text: `Output Description:\n${questionData.outputDescription}`,
            sender: "Interviewer" as const,
            timestamp: formatTime(new Date()),
          });
        }

        // Explanation
        if (questionData.explanation) {
          messages.push({
            id: generateUniqueId(),
            text: `Explanation:\n${questionData.explanation}`,
            sender: "Interviewer" as const,
            timestamp: formatTime(new Date()),
          });
        }

        // Constraints
        if (questionData.constraints) {
          messages.push({
            id: generateUniqueId(),
            text: `Constraints: \n${Array.isArray(questionData.constraints)
              ? questionData.constraints.join('\n')
              : questionData.constraints}`,
            sender: "Interviewer" as const,
            timestamp: formatTime(new Date()),
          });
        }

        // Sample Input
        if (questionData.sampleInput) {
          messages.push({
            id: generateUniqueId(),
            text: `Input:\n${questionData.sampleInput}`,
            sender: "Interviewer" as const,
            timestamp: formatTime(new Date()),
          });
        }

        // Sample Output
        if (questionData.sampleOutput) {
          messages.push({
            id: generateUniqueId(),
            text: `Output:\n${questionData.sampleOutput}`,
            sender: "Interviewer" as const,
            timestamp: formatTime(new Date()),
          });
        }


        return messages;
      } catch (error) {
        console.error('Error parsing question:', error);
        return [{
          id: generateUniqueId(),
          text: q.question,
          sender: "Interviewer" as const,
          timestamp: formatTime(new Date()),
        }];
      }
    });

    setMessages(prev => [...prev, ...questionMessages]);

    // Set the current question to the latest question
    if (questions.length > 0) {
      setCurrentQuestion(questions[questions.length - 1]);
    }
  }, [questions, setCurrentQuestion]);

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
    <div className="flex flex-col h-full bg-gray-900">
      <div className="p-3 md:p-4 border-b border-gray-800">
        <h2 className="text-lg font-semibold text-white">Interview Questions</h2>
      </div>

      {/* Main chat area */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex flex-col space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "Candidate" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`${message.sender === "Candidate"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800/50 text-gray-100"
                  } rounded-lg px-4 py-3 max-w-[80%] shadow-md`}
              >
                <p className="text-sm md:text-base break-words">
                  {message.text}
                </p>
                {message.timestamp && (
                  <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="p-3 md:p-4 border-t border-gray-800 bg-gray-900">
        <form onSubmit={handleSendMessage}>
          <div className="flex gap-2">
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
