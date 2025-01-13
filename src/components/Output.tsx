import React from 'react'

export default function Output({ output, loading }: { output: string, loading: boolean }) {
    return (
        <div>
            <div className="h-[70vh] bg-[#1e1e1e] border border-gray-700 rounded-md">
                <pre className="text-slate-300 p-4">
                    {output ? !loading && output : !loading && `Click "Run Code" to see the output here`}
                    {loading && "Compiling..."}
                </pre>
            </div>
        </div>
    )
}
