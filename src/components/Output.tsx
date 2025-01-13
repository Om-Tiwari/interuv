import React from 'react';

type OutputProps = {
    output: string;
    loading: boolean;
    error: boolean;
};

export default function Output({ output, loading, error }: OutputProps) {
    const containerClasses = `h-[70vh] bg-[#1e1e1e] border rounded-md ${error ? 'border-red-500' : 'border-gray-700'
        }`;

    const textClasses = `p-4 ${error ? 'text-red-500' : 'text-white'}`;

    const displayText = loading
        ? 'Compiling...'
        : output || 'Click "Run Code" to see the output here';

    return (
        <div>
            <div className={containerClasses}>
                <pre className={textClasses}>{displayText}</pre>
            </div>
        </div>
    );
}
