'use client';

import React, { useState, useEffect } from 'react';
import { useQuestions, Question } from '@/context/QuestionsContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

interface JDData {
    jobTitle: string;
    id: string;
    json: JSON;
}

interface SelectionOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SelectionOverlay({ isOpen, onClose }: SelectionOverlayProps) {
    const { setQuestions, setCurrentJdId, setCurrentQuestion, setJsonContent, setCurrentQuestionIndex } = useQuestions();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [jds, setJds] = useState<JDData[]>([]);

    useEffect(() => {
        if (isOpen) {
            fetchJDs();
        }
    }, [isOpen]);

    const fetchJDs = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('http://localhost:8000/api/jds');
            if (!response.ok) throw new Error('Failed to fetch JDs');
            const data = await response.json();
            setJds(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load job descriptions');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectJD = async (jd: JDData) => {
        setIsLoading(true);
        setError(null);

        try {
            // Store the association between jd_id and jsonContent
            localStorage.setItem(`jd_content_${jd.id}`, JSON.stringify(jd.json));

            // Set JSON content in context
            setJsonContent(jd.json);

            // Set the current JD ID
            setCurrentJdId(jd.id);

            // Fetch questions for the selected JD
            const response = await fetch('http://localhost:8000/Codequestion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'accept': 'application/json'
                },
                body: JSON.stringify({
                    jd_data: jd.json,
                    jd_id: jd.id
                }),
            });

            if (!response.ok) {
                throw new Error(`Failed to generate questions: ${response.statusText}`);
            }

            const data = await response.json();

            // Create the first question
            const firstQuestion: Question = {
                id: 1,
                question: JSON.stringify(data.questions[0]),
                type: 'coding',
                jd_id: jd.id
            };

            // Set current question
            setCurrentQuestion(firstQuestion);

            // Set all questions in context
            const allQuestions = data.questions.map((q: any, index: number) => ({
                id: index + 1,
                question: JSON.stringify(q),
                type: 'coding',
                jd_id: jd.id
            }));

            setQuestions(allQuestions);
            setCurrentQuestionIndex(0);
            onClose();

        } catch (err) {
            console.error('Error processing selection:', err);
            setError(err instanceof Error ? err.message : 'An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl mx-4 p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>

                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                        Select Job Description
                    </h2>
                    {error && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto p-4">
                        {jds.map((jd) => (
                            <button
                                key={jd.id}
                                onClick={() => handleSelectJD(jd)}
                                className="p-4 border border-gray-700 rounded-lg hover:border-blue-500 transition-colors text-left bg-gray-850 hover:bg-gray-750"
                            >
                                <h3 className="font-semibold text-gray-100 mb-2">{jd.jobTitle}</h3>
                                <p className="text-sm text-gray-400">ID: {jd.id}</p>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
