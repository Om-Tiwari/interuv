'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Question {
    id: number;
    question: string;
    type: string;
    answer?: string;
    jd_id: string;  // UUID string type
}

interface QuestionsContextType {
    questions: Question[];
    setQuestions: (questions: Question[] | ((prev: Question[]) => Question[])) => void;
    addAnswer: (questionId: number, answer: string) => void;
    editorContent: string;
    setEditorContent: (content: string) => void;
    editorLanguage: string;
    setEditorLanguage: (lang: string) => void;
    currentQuestion: Question | null;
    setCurrentQuestion: (question: Question | null) => void;
    currentJdId: string | null;  // UUID string type
    setCurrentJdId: (id: string | null) => void;
    jsonContent: any;
    setJsonContent: (content: any) => void;
    currentQuestionIndex: number;
    setCurrentQuestionIndex: (index: number) => void;
}

const QuestionsContext = createContext<QuestionsContextType | undefined>(undefined);

export function QuestionsProvider({ children }: { children: ReactNode }) {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
    const [editorContent, setEditorContent] = useState("");
    const [editorLanguage, setEditorLanguage] = useState("java");
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
    const [currentJdId, setCurrentJdId] = useState<string | null>(null);
    const [jsonContent, setJsonContent] = useState<any>(null);

    const addAnswer = (questionId: number, answer: string) => {
        setQuestions(questions.map(q =>
            q.id === questionId ? { ...q, answer } : q
        ));
    };

    return (
        <QuestionsContext.Provider value={{
            questions,
            setQuestions,
            addAnswer,
            editorContent,
            setEditorContent,
            editorLanguage,
            setEditorLanguage,
            currentQuestion,
            setCurrentQuestion,
            currentJdId,
            setCurrentJdId,
            jsonContent,
            setJsonContent,
            currentQuestionIndex,
            setCurrentQuestionIndex
        }}>
            {children}
        </QuestionsContext.Provider>
    );
}

export function useQuestions() {
    const context = useContext(QuestionsContext);
    if (context === undefined) {
        throw new Error('useQuestions must be used within a QuestionsProvider');
    }
    return context;
} 