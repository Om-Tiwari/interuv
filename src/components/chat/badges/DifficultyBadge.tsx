interface DifficultyBadgeProps {
    difficulty: string;
}

export const DifficultyBadge = ({ difficulty }: DifficultyBadgeProps) => {
    const difficultyColors = {
        'Easy': 'bg-green-500/20 text-green-400 border-green-500/50',
        'Medium': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
        'Hard': 'bg-red-500/20 text-red-400 border-red-500/50'
    } as const;

    const colorClasses = difficultyColors[difficulty as keyof typeof difficultyColors] || 'bg-blue-500/20 text-blue-400 border-blue-500/50';

    return (
        <div className={`px-3 py-1 rounded-full border ${colorClasses} text-sm font-medium`}>
            {difficulty}
        </div>
    );
}; 