import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useQuestions } from "@/context/QuestionsContext";
import { Textarea } from "@/components/ui/textarea";
import ReactDOMServer from "react-dom/server";
import { Message, QuestionData } from "./types";
import { ChatMessage } from "./ChatMessage";
import { QuestionMessage } from "./QuestionMessage";

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