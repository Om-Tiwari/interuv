import { Message } from './types';

export const ChatMessage = ({ message }: { message: Message }) => (
    <div
        className={`mb-6 ${message.sender === "Interviewer"
            ? "bg-gray-800/30 border border-gray-700"
            : "bg-blue-900/20 border border-blue-800/30"
            } rounded-lg overflow-hidden`}
    >
        <div className="px-4 py-2 bg-black/20">
            <div className="text-sm text-gray-400">{message.timestamp}</div>
        </div>
        <div className="p-4">
            {message.isHtml ? (
                <div
                    className="message-content prose prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: message.text }}
                />
            ) : (
                <div className="whitespace-pre-wrap text-gray-300">{message.text}</div>
            )}
        </div>
    </div>
); 