interface CodeBlockProps {
    code: string;
}

export const CodeBlock = ({ code }: CodeBlockProps) => (
    <div className="font-mono bg-black/30 p-3 rounded text-sm text-gray-300 whitespace-pre overflow-x-auto">
        {code}
    </div>
); 