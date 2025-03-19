'use client';

import React, { useState } from 'react';
import { useQuestions, Question } from '@/context/QuestionsContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

interface UploadOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

export function UploadOverlay({ isOpen, onClose }: UploadOverlayProps) {
    const { setQuestions } = useQuestions();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const processFile = async (file: File) => {
        setIsLoading(true);
        setError(null);

        try {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const fileContent = e.target?.result as string;
                    const jsonContent = JSON.parse(fileContent);

                    // Format the request body according to the API's expected structure
                    const requestBody = {
                        title: jsonContent.parsedJDData?.jobTitle || "Software Engineer",
                        company: jsonContent.parsedJDData?.aboutCompany?.companyName || "Company",
                        description: jsonContent.parsedJDData?.aboutCompany?.overview || "",
                        responsibilities: jsonContent.parsedJDData?.workDetails?.duties || [],
                        requirements: [
                            ...(jsonContent.parsedJDData?.desiredSkills?.technicalSkills?.mustHave || []),
                            ...(jsonContent.parsedJDData?.desiredSkills?.technicalSkills?.experience || []),
                            ...(jsonContent.parsedJDData?.desiredSkills?.technicalSkills?.knowledge || [])
                        ],
                        skills: {
                            required: jsonContent.parsedJDData?.desiredSkills?.techStack || [],
                            preferred: []
                        }
                    };

                    const response = await fetch('/api/generate_question', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'accept': 'application/json'
                        },
                        body: JSON.stringify(requestBody),
                    });

                    if (!response.ok) {
                        const errorText = await response.text();
                        throw new Error(`Failed to generate question: ${errorText}`);
                    }

                    const data = await response.json();
                    if (!data.questionText) {
                        throw new Error('Invalid response format from server');
                    }

                    // Add the question to the context
                    const newQuestion: Question = {
                        id: parseInt(data.id),
                        question: JSON.stringify(data),
                        type: data.type
                    };
                    setQuestions(prevQuestions => [...prevQuestions, newQuestion]);
                    onClose();
                } catch (err) {
                    setError(err instanceof Error ? err.message : 'An unexpected error occurred');
                }
            };

            reader.onerror = () => {
                setError('Error reading file');
            };

            reader.readAsText(file);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (file.type !== 'application/json') {
            setError('Please upload a JSON file');
            return;
        }

        await processFile(file);
    };

    if (!isOpen) return null;

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];

        if (file && file.type === 'application/json') {
            processFile(file);
        } else {
            setError('Please upload a JSON file');
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl mx-4 p-6 relative">
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
                        Upload Job Description
                    </h2>
                    {error && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    <p className="text-gray-600 dark:text-gray-400">
                        Drop your JSON file containing the job description to generate interview questions
                    </p>
                </div>

                <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
                >
                    <div className="mb-4">
                        <label
                            htmlFor="file-upload"
                            className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center">
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Processing...
                                </span>
                            ) : (
                                'Choose File'
                            )}
                        </label>
                        <input
                            id="file-upload"
                            type="file"
                            accept="application/json"
                            onChange={handleFileUpload}
                            className="hidden"
                            disabled={isLoading}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
} 