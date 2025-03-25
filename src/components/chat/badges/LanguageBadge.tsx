interface LanguageBadgeProps {
    language: string;
}

export const LanguageBadge = ({ language }: LanguageBadgeProps) => (
    <div className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/50 text-sm font-medium">
        {language}
    </div>
); 