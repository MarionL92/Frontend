import { useState, useEffect } from 'react';
import { promptAPI } from '../services/api';
import Layout from '../components/Layout';
import EcoScoreBadge from '../components/EcoScoreBadge';
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
    Globe,
    Lightbulb
} from 'lucide-react';

const HistoryItem = ({ item }) => {
    const [expanded, setExpanded] = useState(false);
    const [copied, setCopied] = useState(false);
    const modelInfo = getModelInfo(item.target_model);

    const handleCopy = async () => {
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

    const getEcoGlow = (score) => {
        switch (score?.toUpperCase()) {
            case 'A': return '0 0 8px rgba(57, 255, 20, 0.4)';
            case 'B': return '0 0 8px rgba(160, 255, 0, 0.3)';
            case 'C': return '0 0 8px rgba(255, 221, 0, 0.3)';
            case 'D': return '0 0 8px rgba(255, 126, 0, 0.3)';
            case 'E': return '0 0 8px rgba(255, 23, 68, 0.3)';
            default: return 'none';
        }
    };

    return (
        <div className="glass-card p-4 animate-fade-in">
            <div
                className="flex items-start justify-between gap-4 cursor-pointer"
                onClick={() => setExpanded(!expanded)}
            >
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                        <span
                            className="px-2 py-0.5 rounded text-xs font-medium"
                            style={{
                                backgroundColor: `${modelInfo.color}20`,
                                color: modelInfo.color
                            }}
                        >
                            {modelInfo.name}
                        </span>
                        {item.green_data && (
                            <div
                                className={`w-6 h-6 rounded text-xs font-bold flex items-center justify-center text-[var(--bg-primary)] ${item.green_data.eco_score === 'A' ? 'bg-[var(--eco-a)]' :
                                    item.green_data.eco_score === 'B' ? 'bg-[var(--eco-b)]' :
                                        item.green_data.eco_score === 'C' ? 'bg-[var(--eco-c)]' :
                                            item.green_data.eco_score === 'D' ? 'bg-[var(--eco-d)]' :
                                                'bg-[var(--eco-e)]'
                                    }`}
                                style={{ boxShadow: getEcoGlow(item.green_data.eco_score) }}
                            >
                                {item.green_data.eco_score}
                            </div>
                        )}
                    </div>
                    <p className="text-sm text-[var(--text-primary)] line-clamp-2">
                        {item.original_intent}
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-[var(--text-muted)]">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(item.created_at)}</span>
                    </div>
                </div>
                <button className="p-2 rounded-lg hover:bg-[var(--bg-surface)] transition-colors">
                    {expanded ? (
                        <ChevronUp className="w-5 h-5 text-[var(--text-muted)]" />
                    ) : (
                        <ChevronDown className="w-5 h-5 text-[var(--text-muted)]" />
                    )}
                </button>
            </div>

            {expanded && (
                <div className="mt-4 pt-4 border-t border-[var(--glass-border)] space-y-4 animate-fade-in">
                    {/* Original Intent */}
                    <div>
                        <h4 className="text-xs font-medium text-[var(--text-muted)] mb-2">Intention originale</h4>
                        <p className="text-sm text-[var(--text-secondary)] bg-[var(--bg-secondary)] p-3 rounded-lg">
                            {item.original_intent}
                        </p>
                    </div>

                    {/* Optimized Prompt */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="text-xs font-medium text-[var(--text-muted)]">Prompt optimisé</h4>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleCopy();
                                }}
                                className="flex items-center gap-1 text-xs hover:underline"
                                style={{ color: 'var(--primary)', textShadow: '0 0 5px rgba(57, 255, 20, 0.3)' }}
                            >
                                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                {copied ? 'Copié !' : 'Copier'}
                            </button>
                        </div>
                        <pre
                            className="text-sm text-[var(--text-primary)] bg-[var(--bg-secondary)] p-3 rounded-lg whitespace-pre-wrap font-mono border-l-4"
                            style={{ borderColor: modelInfo.color, boxShadow: `inset 4px 0 10px -4px ${modelInfo.color}30` }}
                        >
                            {item.optimized_prompt}
                        </pre>
                    </div>

                    {/* Green Data */}
                    {item.green_data && (
                        <div className="flex flex-wrap gap-4 text-xs">
                            <div className="flex items-center gap-1 text-[var(--text-muted)]">
                                <Leaf className="w-3 h-3" style={{ color: 'var(--primary)', filter: 'drop-shadow(0 0 3px rgba(57, 255, 20, 0.4))' }} />
                                <span>{item.green_data.tokens_saved} tokens économisés</span>
                            </div>
                            <div className="flex items-center gap-1 text-[var(--text-muted)]">
                                <Globe className="w-3 h-3" style={{ color: 'var(--accent)', filter: 'drop-shadow(0 0 3px rgba(0, 255, 135, 0.4))' }} />
                                <span>{item.green_data.co2_saved_g.toFixed(4)} g CO₂</span>
                            </div>
                        </div>
                    )}

                    {/* AI Reasoning */}
                    {item.ai_reasoning && (
                        <div className="p-3 rounded-lg bg-[var(--info)]/10 border border-[var(--info)]/30">
                            <div className="flex items-center gap-1 mb-1">
                                <Lightbulb className="w-3 h-3 text-[var(--info)]" />
                                <h4 className="text-xs font-medium text-[var(--info)]">Explication de l'IA</h4>
                            </div>
                            <p className="text-xs text-[var(--text-secondary)]">{item.ai_reasoning}</p>
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
            <div className="container max-w-3xl">
                {/* Header */}
                <div className="flex items-center gap-4" style={{ marginBottom: '1rem' }}>
                    <div
                        className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center"
                        style={{ boxShadow: 'var(--neon-glow-md)' }}
                    >
                        <HistoryIcon className="w-7 h-7 text-[var(--bg-primary)]" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1">Historique</h1>
                        <p className="text-[var(--text-secondary)]">Vos prompts optimisés précédents</p>
                    </div>
                </div>

                {/* Content */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-16">
                        <Loader2 className="w-10 h-10 animate-spin mb-4" style={{ color: 'var(--primary)', filter: 'drop-shadow(0 0 8px rgba(57, 255, 20, 0.5))' }} />
                        <p className="text-[var(--text-secondary)]">Chargement de l'historique...</p>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-16 h-16 rounded-full bg-[var(--error)]/20 flex items-center justify-center mb-4">
                            <AlertCircle className="w-8 h-8 text-[var(--error)]" />
                        </div>
                        <p className="text-[var(--text-secondary)]">{error}</p>
                    </div>
                ) : history.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center" style={{ paddingTop: '0.5rem', paddingBottom: '0.5rem' }}>
                        <div className="w-12 h-12 rounded-full bg-[var(--bg-surface)] flex items-center justify-center mb-2">
                            <HistoryIcon className="w-6 h-6 text-[var(--text-muted)]" />
                        </div>
                        <h3 className="text-lg font-medium text-[var(--text-secondary)] mb-2">
                            Aucun historique
                        </h3>
                        <p className="text-sm text-[var(--text-muted)]">
                            Commencez à générer des prompts pour voir votre historique ici
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <p className="text-sm text-[var(--text-muted)]">
                            {history.length} prompt{history.length > 1 ? 's' : ''} généré{history.length > 1 ? 's' : ''}
                        </p>
                        {history.map((item) => (
                            <HistoryItem key={item.id} item={item} />
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default History;
