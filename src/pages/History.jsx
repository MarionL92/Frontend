import { useState, useEffect } from 'react';
import { promptAPI } from '../services/api';
import Layout from '../components/Layout';
import { getModelInfo } from '../components/ModelSelector';
import {
    History as HistoryIcon,
    Loader2,
    AlertCircle,
    Calendar,
    ChevronDown,
    ChevronUp,
    Copy,
    Check,
    Leaf,
    Lightbulb,
    Shield,
    BatteryCharging,
    Sparkles
} from 'lucide-react';

// Eco score color helper
const getEcoColor = (score) => {
    switch (score?.toUpperCase()) {
        case 'A': return 'var(--eco-a)';
        case 'B': return 'var(--eco-b)';
        case 'C': return 'var(--eco-c)';
        case 'D': return 'var(--eco-d)';
        case 'E': return 'var(--eco-e)';
        default: return 'var(--text-muted)';
    }
};

const formatSmallNumber = (num) => {
    if (num === null || num === undefined) return '—';
    if (num === 0) return '0';
    if (Math.abs(num) < 0.0001) return '< 0.0001';
    return num.toFixed(4).replace(/\.?0+$/, '') || '0';
};

const HistoryItem = ({ item, index }) => {
    const [expanded, setExpanded] = useState(false);
    const [copied, setCopied] = useState(false);
    const modelInfo = getModelInfo(item.target_model);

    const handleCopy = async (e) => {
        e.stopPropagation();
        await navigator.clipboard.writeText(item.optimized_prompt);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const ecoScore = item.green_data?.eco_score;
    const sovereigntyScore = item.sovereignty_data?.score;

    return (
        <div
            className={`animate-fade-in rounded-2xl border border-[var(--glass-border)] bg-[var(--bg-surface)] overflow-hidden neon-hover ${expanded ? 'ring-1 ring-[var(--primary)]/30' : ''}`}
            style={{
                animationDelay: `${index * 50}ms`
            }}
        >
            {/* Header Row — always visible */}
            <div
                className="flex items-center gap-4 p-5 sm:p-6 cursor-pointer select-none"
                onClick={() => setExpanded(!expanded)}
            >
                {/* Left: Model color bar + eco badge */}
                <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                    {ecoScore && (
                        <div
                            className="w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center text-[var(--bg-primary)]"
                            style={{
                                backgroundColor: getEcoColor(ecoScore),
                                boxShadow: `0 0 8px ${getEcoColor(ecoScore)}50`
                            }}
                        >
                            {ecoScore}
                        </div>
                    )}
                    {sovereigntyScore !== undefined && (
                        <span className="text-[10px] font-medium" style={{ color: sovereigntyScore >= 60 ? 'var(--eco-a)' : sovereigntyScore >= 30 ? 'var(--eco-c)' : 'var(--eco-e)' }}>
                            {sovereigntyScore}%
                        </span>
                    )}
                </div>

                {/* Center: Text content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span
                            className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold tracking-wide uppercase flex-shrink-0"
                            style={{
                                backgroundColor: `${modelInfo.color}15`,
                                color: modelInfo.color,
                                border: `1px solid ${modelInfo.color}30`
                            }}
                        >
                            {modelInfo.name}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs font-medium text-[var(--text-muted)] flex-shrink-0">
                            <Calendar className="w-3.5 h-3.5" />
                            {formatDate(item.created_at)}
                        </span>
                    </div>
                    <p className="text-base text-[var(--text-primary)] leading-relaxed" style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        wordBreak: 'break-word'
                    }}>
                        {item.original_intent}
                    </p>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                        onClick={handleCopy}
                        className="p-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors"
                        title="Copier le prompt optimisé"
                    >
                        {copied ? (
                            <Check className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                        ) : (
                            <Copy className="w-4 h-4 text-[var(--text-muted)]" />
                        )}
                    </button>
                    <div className="p-2 rounded-lg">
                        {expanded ? (
                            <ChevronUp className="w-4 h-4 text-[var(--text-muted)]" />
                        ) : (
                            <ChevronDown className="w-4 h-4 text-[var(--text-muted)]" />
                        )}
                    </div>
                </div>
            </div>

            {/* Expanded Content */}
            {expanded && (
                <div className="px-5 sm:px-6 pb-6 animate-fade-in" style={{ borderTop: '1px solid var(--glass-border)' }}>

                    {/* Optimized Prompt */}
                    <div style={{ marginTop: '1rem' }}>
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                                Prompt optimisé
                            </h4>
                            <button
                                onClick={handleCopy}
                                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors hover:bg-[var(--primary)]/10"
                                style={{ color: 'var(--primary)' }}
                            >
                                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                {copied ? 'Copié !' : 'Copier'}
                            </button>
                        </div>
                        <div
                            className="rounded-xl bg-[var(--bg-secondary)] border-l-4 overflow-hidden"
                            style={{ borderLeft: `4px solid ${modelInfo.color}` }}
                        >
                            <pre
                                className="text-base text-[var(--text-primary)] p-5 font-mono leading-relaxed"
                                style={{
                                    whiteSpace: 'pre-wrap',
                                    wordBreak: 'break-word',
                                    overflowWrap: 'break-word',
                                    maxHeight: '400px',
                                    overflowY: 'auto',
                                }}
                            >
                                {item.optimized_prompt}
                            </pre>
                        </div>
                    </div>

                    {/* Metrics Row */}
                    {(item.green_data || item.sovereignty_data) && (
                        <div className="flex flex-wrap gap-2 mt-3">
                            {item.green_data?.tokens_saved !== undefined && (
                                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[var(--bg-secondary)] text-xs">
                                    <BatteryCharging className="w-3 h-3" style={{ color: 'var(--primary)' }} />
                                    <span className="text-[var(--text-secondary)]">
                                        <strong className="text-[var(--text-primary)]">{item.green_data.tokens_saved}</strong> tokens
                                    </span>
                                </div>
                            )}
                            {item.green_data?.co2_saved_g !== undefined && (
                                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[var(--bg-secondary)] text-xs">
                                    <Leaf className="w-3 h-3" style={{ color: 'var(--eco-b)' }} />
                                    <span className="text-[var(--text-secondary)]">
                                        <strong className="text-[var(--text-primary)]">{formatSmallNumber(item.green_data.co2_saved_g)}</strong> g CO₂
                                    </span>
                                </div>
                            )}
                            {item.sovereignty_data && (
                                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[var(--bg-secondary)] text-xs">
                                    <Shield className="w-3 h-3" style={{ color: sovereigntyScore >= 60 ? 'var(--eco-a)' : sovereigntyScore >= 30 ? 'var(--eco-c)' : 'var(--eco-e)' }} />
                                    <span className="text-[var(--text-secondary)]">
                                        <strong className="text-[var(--text-primary)]">{sovereigntyScore}/100</strong> souveraineté
                                    </span>
                                </div>
                            )}
                            {item.sovereignty_data?.location && (
                                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[var(--bg-secondary)] text-xs">
                                    <span className="text-[var(--text-secondary)]">📍 {item.sovereignty_data.location}</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* AI Reasoning */}
                    {item.ai_reasoning && (
                        <div className="mt-4 p-4 rounded-xl bg-[var(--info)]/10 border border-[var(--info)]/20">
                            <div className="flex items-center gap-2 mb-2">
                                <Lightbulb className="w-4 h-4 text-[var(--info)]" />
                                <h4 className="text-sm font-semibold text-[var(--info)]">Explication de l'IA</h4>
                            </div>
                            <p className="text-sm text-[var(--text-secondary)] leading-relaxed" style={{
                                wordBreak: 'break-word',
                                overflowWrap: 'break-word'
                            }}>
                                {item.ai_reasoning}
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const History = () => {
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const data = await promptAPI.getHistory();
                setHistory(data);
            } catch (err) {
                if (err.response?.status === 403) {
                    setError('Veuillez vérifier votre email pour accéder à l\'historique.');
                } else {
                    setError('Impossible de charger l\'historique.');
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchHistory();
    }, []);

    return (
        <Layout>
            <div className="container" style={{ maxWidth: '800px' }}>
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4" style={{ marginBottom: '1.5rem' }}>
                    <div className="flex items-center gap-4">
                        <div
                            className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center flex-shrink-0"
                            style={{ boxShadow: 'var(--neon-glow-md)' }}
                        >
                            <HistoryIcon className="w-7 h-7 text-[var(--bg-primary)]" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1">Historique</h1>
                            <p className="text-[var(--text-secondary)]">Vos prompts optimisés précédents</p>
                        </div>
                    </div>
                    {history.length > 0 && (
                        <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--bg-surface)] border border-[var(--glass-border)] self-start sm:self-auto flex-shrink-0 shadow-sm">
                            <Sparkles className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                            <span className="text-base font-semibold text-[var(--text-primary)] whitespace-nowrap">
                                {history.length} prompt{history.length > 1 ? 's' : ''}
                            </span>
                        </div>
                    )}
                </div>

                {/* Content */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center min-h-[60vh] py-16">
                        <Loader2 className="w-10 h-10 animate-spin mb-4" style={{ color: 'var(--primary)', filter: 'drop-shadow(0 0 8px rgba(57, 255, 20, 0.5))' }} />
                        <p className="text-[var(--text-secondary)]">Chargement de l'historique...</p>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center min-h-[60vh] py-16 text-center">
                        <div className="w-16 h-16 rounded-full bg-[var(--error)]/20 flex items-center justify-center mb-4">
                            <AlertCircle className="w-8 h-8 text-[var(--error)]" />
                        </div>
                        <p className="text-[var(--text-secondary)]">{error}</p>
                    </div>
                ) : history.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center py-16">
                        <div
                            className="w-20 h-20 rounded-full bg-[var(--bg-surface)] flex items-center justify-center mb-4"
                            style={{ boxShadow: '0 0 30px rgba(57, 255, 20, 0.05)' }}
                        >
                            <HistoryIcon className="w-10 h-10 text-[var(--text-muted)]" />
                        </div>
                        <h3 className="text-lg font-medium text-[var(--text-secondary)] mb-2">
                            Aucun historique
                        </h3>
                        <p className="text-sm text-[var(--text-muted)] max-w-xs">
                            Commencez à générer des prompts pour voir votre historique ici
                        </p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {history.map((item, index) => (
                            <HistoryItem key={item.id} item={item} index={index} />
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default History;
