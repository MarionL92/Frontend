const SovereigntyGauge = ({ score = 0, size = 120 }) => {
    const radius = (size - 20) / 2;
    const circumference = 2 * Math.PI * radius;
    const progress = (score / 100) * circumference;
    const offset = circumference - progress;

    const getColor = (s) => {
        if (s >= 80) return 'var(--eco-a)';
        if (s >= 60) return 'var(--eco-b)';
        if (s >= 40) return 'var(--eco-c)';
        if (s >= 20) return 'var(--eco-d)';
        return 'var(--eco-e)';
    };

    const getLabel = (s) => {
        if (s >= 80) return 'Excellent';
        if (s >= 60) return 'Bon';
        if (s >= 40) return 'Moyen';
        if (s >= 20) return 'Faible';
        return 'Critique';
    };

    return (
        <div className="flex flex-col items-center">
            <div className="relative" style={{ width: size, height: size }}>
                <svg width={size} height={size} className="transform -rotate-90">
                    {/* Background circle */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke="var(--bg-surface)"
                        strokeWidth="10"
                    />
                    {/* Progress circle */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke={getColor(score)}
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        className="transition-all duration-700 ease-out"
                    />
                </svg>
                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-[var(--text-primary)]">{score}</span>
                    <span className="text-xs text-[var(--text-secondary)]">/100</span>
                </div>
            </div>
            <div className="mt-2 text-center">
                <p className="text-sm font-medium text-[var(--text-primary)]">Souveraineté</p>
                <p className="text-xs text-[var(--text-secondary)]">{getLabel(score)}</p>
            </div>
        </div>
    );
};

export default SovereigntyGauge;
