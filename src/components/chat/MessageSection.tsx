interface MessageSectionProps {
    title: string;
    children: React.ReactNode;
    className?: string;
}

export const MessageSection = ({ title, children, className = '' }: MessageSectionProps) => (
    <div className={`bg-gray-800/50 rounded-lg p-4 ${className}`}>
        <div className="text-blue-400 font-medium mb-2">{title}</div>
        {children}
    </div>
); 