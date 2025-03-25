import { QuestionData } from './types';
import { DifficultyBadge } from './badges/DifficultyBadge';
import { LanguageBadge } from './badges/LanguageBadge';
import { MessageSection } from './MessageSection';
import { CodeBlock } from './CodeBlock';

interface QuestionMessageProps {
    questionData: QuestionData;
    questionId: string;
}

export const QuestionMessage = ({ questionData, questionId }: QuestionMessageProps) => {
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
                                    <li key={`constraint-${index}`}>{constraint}</li>
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