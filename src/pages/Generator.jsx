import { useState } from 'react';
import { promptAPI } from '../services/api';
import Layout from '../components/Layout';
import ModelSelector, { getModelInfo } from '../components/ModelSelector';
import EcoScoreBadge from '../components/EcoScoreBadge';
import SovereigntyGauge from '../components/SovereigntyGauge';
import {
    Zap,
    Copy,
    Check,
    Loader2,
    Smartphone,
    Car,
    Lightbulb,
    Info,
    AlertCircle,
    Sparkles,
    Leaf,
    Shield,
    X,
    ShieldCheck,
    ShieldAlert,
    MapPin,
    Building2,
    FileKey,
    Droplets,
    BatteryCharging
} from 'lucide-react';

// Smart number formatting - avoids showing "0.000" when value exists but is tiny
const formatSmallNumber = (num, decimals = 4) => {
    if (num === null || num === undefined) return '—';
    if (num === 0) return '0';
    if (Math.abs(num) < 0.0001) return '< 0.0001';
    if (Math.abs(num) < 0.001) return num.toExponential(1);
    return num.toFixed(decimals).replace(/\.?0+$/, '') || '0';
};

const formatEquivalence = (num) => {
    if (num === null || num === undefined) return '—';
    if (num === 0) return '0';
    if (num < 0.001) return '< 0.001';
    if (num < 1) return num.toFixed(3);
    return num.toFixed(2);
};

const Generator = () => {
    const [inputText, setInputText] = useState('');
    const [targetModel, setTargetModel] = useState('mistral_2');
    const [isGenerating, setIsGenerating] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);
    const [showReasoning, setShowReasoning] = useState(false);

    const handleGenerate = async () => {
        if (!inputText.trim()) return;

        setError('');
        setIsGenerating(true);
        setResult(null);

        try {
            const data = await promptAPI.generate(inputText, targetModel);
            setResult(data);
        } catch (err) {
            if (err.response?.status === 403) {
                setError('Veuillez vérifier votre email pour utiliser cette fonctionnalité.');
            } else {
                setError(err.response?.data?.detail || 'Une erreur est survenue lors de la génération.');
            }
        } finally {
            setIsGenerating(false);
        }
    };

    const handleCopy = async () => {
        if (result?.optimized_prompt) {
            await navigator.clipboard.writeText(result.optimized_prompt);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const modelInfo = getModelInfo(targetModel);

    return (
        <Layout>
            <div className="container">
                {/* Header */}
                <div className="text-center" style={{ marginBottom: '2rem' }}>
                    <h1 className="text-3xl md:text-4xl font-bold" style={{ marginBottom: '1rem' }}>
                        <span className="gradient-text">Générateur de Prompts</span>
                    </h1>
                    <p style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }} className="text-[var(--text-secondary)]">
                        Transformez votre intention en prompt optimisé et mesurez votre impact environnemental.
                    </p>
                </div>

                {/* Main Grid - Split Screen */}
                <div className="grid lg:grid-cols-2" style={{ gap: '2.5rem' }}>
                    {/* LEFT: Input Section */}
                    <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/20 flex items-center justify-center">
                                <Zap className="w-5 h-5" style={{ color: 'var(--primary)', filter: 'drop-shadow(0 0 4px rgba(57, 255, 20, 0.5))' }} />
                            </div>
                            <div>
                                <h2 className="font-semibold text-[var(--text-primary)]">Votre Intention</h2>
                                <p className="text-sm text-[var(--text-secondary)]">Décrivez ce que vous voulez accomplir</p>
                            </div>
                        </div>

                        {/* Text Input */}
                        <div>
                            <textarea
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder="Ex: Je veux créer une image d'un coucher de soleil sur Mars avec des teintes orangées..."
                                className="input-field min-h-[200px] resize-none"
                                disabled={isGenerating}
                            />
                            <div className="flex justify-between mt-4 text-xs text-[var(--text-muted)]">
                                <span>{inputText.length} caractères</span>
                                <span>Soyez précis pour de meilleurs résultats</span>
                            </div>
                        </div>

                        {/* Model Selector */}
                        <ModelSelector
                            value={targetModel}
                            onChange={setTargetModel}
                            disabled={isGenerating}
                        />

                        {/* Generate Button */}
                        <button
                            onClick={handleGenerate}
                            disabled={!inputText.trim() || isGenerating}
                            className="btn btn-primary w-full text-lg py-4"
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Optimisation en cours...</span>
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-5 h-5" />
                                    <span>Optimiser mon prompt</span>
                                </>
                            )}
                        </button>

                        {/* Error */}
                        {error && (
                            <div className="flex items-center gap-2 p-3 rounded-lg bg-[var(--error)]/10 border border-[var(--error)]/30 text-[var(--error)] text-sm animate-fade-in">
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}
                    </div>

                    {/* RIGHT: Output Section */}
                    <div className="glass-card space-y-5" style={{ padding: '1.5rem' }}>
                        <div className="flex items-center gap-3 mb-4" style={{ marginTop: '0.5rem' }}>
                            <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center"
                                style={{ backgroundColor: `${modelInfo.color}20` }}
                            >
                                <Check className="w-5 h-5" style={{ color: modelInfo.color, filter: `drop-shadow(0 0 4px ${modelInfo.color}80)` }} />
                            </div>
                            <div>
                                <h2 className="font-semibold text-[var(--text-primary)]">Prompt Optimisé</h2>
                                <p className="text-sm text-[var(--text-secondary)]">Prêt à copier-coller</p>
                            </div>
                        </div>

                        {/* Output Display */}
                        {result ? (
                            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                {/* Optimized Prompt */}
                                <div
                                    className="relative rounded-xl bg-[var(--bg-secondary)] border-2 transition-all"
                                    style={{ borderColor: modelInfo.color, boxShadow: `0 0 15px ${modelInfo.color}20`, padding: '1.25rem' }}
                                >
                                    <pre className="whitespace-pre-wrap text-sm text-[var(--text-primary)] font-mono leading-relaxed" style={{ paddingRight: '2.5rem', wordBreak: 'break-word', overflowWrap: 'break-word', maxHeight: '400px', overflowY: 'auto', margin: 0 }}>{result.optimized_prompt}</pre>
                                    <button
                                        onClick={handleCopy}
                                        className="absolute top-3 right-3 p-2 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] transition-colors"
                                        title="Copier"
                                    >
                                        {copied ? (
                                            <Check className="w-4 h-4" style={{ color: 'var(--success)', filter: 'drop-shadow(0 0 4px rgba(57, 255, 20, 0.5))' }} />
                                        ) : (
                                            <Copy className="w-4 h-4 text-[var(--text-secondary)]" />
                                        )}
                                    </button>
                                </div>

                                {/* AI Reasoning Button */}
                                {result.ai_reasoning && (
                                    <button
                                        onClick={() => setShowReasoning(!showReasoning)}
                                        className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors"
                                    >
                                        <Info className="w-4 h-4" />
                                        <span>Pourquoi ce résultat ?</span>
                                    </button>
                                )}

                                {/* AI Reasoning Panel */}
                                {showReasoning && result.ai_reasoning && (
                                    <div className="p-4 rounded-xl bg-[var(--info)]/10 border border-[var(--info)]/30 animate-fade-in">
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <h4 className="font-medium text-[var(--info)]">Explication de l'IA</h4>
                                            <button onClick={() => setShowReasoning(false)}>
                                                <X className="w-4 h-4 text-[var(--text-muted)]" />
                                            </button>
                                        </div>
                                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{result.ai_reasoning}</p>
                                    </div>
                                )}

                                {/* Scores Section - Full Width Cards */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                                    {/* ===== GREEN / ECO CARD ===== */}
                                    {result.green_data && (
                                        <div className="rounded-xl bg-[var(--bg-secondary)] border border-[var(--glass-border)]" style={{ padding: '1.5rem' }}>
                                            <div className="flex items-center justify-between mb-5">
                                                <div className="flex items-center gap-2">
                                                    <Leaf className="w-5 h-5" style={{ color: 'var(--primary)', filter: 'drop-shadow(0 0 4px rgba(57, 255, 20, 0.5))' }} />
                                                    <span className="font-semibold text-[var(--text-primary)]">Impact Écologique</span>
                                                </div>
                                                <EcoScoreBadge score={result.green_data.eco_score} size="md" />
                                            </div>

                                            {/* Key Metrics Row */}
                                            <div className="grid grid-cols-3" style={{ gap: '0.75rem', marginBottom: '1.25rem' }}>
                                                <div className="text-center rounded-lg bg-[var(--bg-surface)] border border-[var(--glass-border)]" style={{ padding: '1rem 0.75rem' }}>
                                                    <BatteryCharging className="w-5 h-5 mx-auto" style={{ color: 'var(--primary)', filter: 'drop-shadow(0 0 3px rgba(57, 255, 20, 0.4))', marginBottom: '0.5rem' }} />
                                                    <p className="text-xl font-bold" style={{ color: 'var(--primary)', textShadow: '0 0 8px rgba(57, 255, 20, 0.3)', lineHeight: 1.2 }}>
                                                        {result.green_data.tokens_saved || 0}
                                                    </p>
                                                    <p className="text-xs text-[var(--text-muted)]" style={{ marginTop: '0.35rem' }}>tokens économisés</p>
                                                </div>
                                                <div className="text-center rounded-lg bg-[var(--bg-surface)] border border-[var(--glass-border)]" style={{ padding: '1rem 0.75rem' }}>
                                                    <Leaf className="w-5 h-5 mx-auto" style={{ color: 'var(--eco-b)', filter: 'drop-shadow(0 0 3px rgba(160, 255, 0, 0.4))', marginBottom: '0.5rem' }} />
                                                    <p className="text-xl font-bold" style={{ color: 'var(--eco-b)', textShadow: '0 0 8px rgba(160, 255, 0, 0.3)', lineHeight: 1.2 }}>
                                                        {formatSmallNumber(result.green_data.co2_saved_g)}
                                                    </p>
                                                    <p className="text-xs text-[var(--text-muted)]" style={{ marginTop: '0.35rem' }}>g CO₂ évités</p>
                                                </div>
                                                <div className="text-center rounded-lg bg-[var(--bg-surface)] border border-[var(--glass-border)]" style={{ padding: '1rem 0.75rem' }}>
                                                    <Droplets className="w-5 h-5 mx-auto" style={{ color: '#60a5fa', filter: 'drop-shadow(0 0 3px rgba(96, 165, 250, 0.4))', marginBottom: '0.5rem' }} />
                                                    <p className="text-xl font-bold" style={{ color: '#60a5fa', textShadow: '0 0 8px rgba(96, 165, 250, 0.3)', lineHeight: 1.2 }}>
                                                        {formatSmallNumber(result.green_data.water_saved_ml)}
                                                    </p>
                                                    <p className="text-xs text-[var(--text-muted)]" style={{ marginTop: '0.35rem' }}>mL eau épargnés</p>
                                                </div>
                                            </div>

                                            {/* Equivalences Row */}
                                            {result.green_data.equivalences && (
                                                <div className="grid grid-cols-3" style={{ gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)' }}>
                                                    <div className="flex flex-col items-center text-center" style={{ gap: '0.35rem' }}>
                                                        <Smartphone className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
                                                        <span className="text-base font-semibold text-[var(--text-primary)]">
                                                            {formatEquivalence(result.green_data.equivalences.smartphone_charges)}
                                                        </span>
                                                        <span className="text-xs text-[var(--text-muted)]">recharges</span>
                                                    </div>
                                                    <div className="flex flex-col items-center text-center" style={{ gap: '0.35rem' }}>
                                                        <Car className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
                                                        <span className="text-base font-semibold text-[var(--text-primary)]">
                                                            {formatEquivalence(result.green_data.equivalences.km_electric_car)}
                                                        </span>
                                                        <span className="text-xs text-[var(--text-muted)]">km en VE</span>
                                                    </div>
                                                    <div className="flex flex-col items-center text-center" style={{ gap: '0.35rem' }}>
                                                        <Lightbulb className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
                                                        <span className="text-base font-semibold text-[var(--text-primary)]">
                                                            {formatEquivalence(result.green_data.equivalences.hours_led_bulb)}
                                                        </span>
                                                        <span className="text-xs text-[var(--text-muted)]">h LED</span>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Source */}
                                            {result.green_data.methodology_source && (
                                                <p className="text-[10px] text-[var(--text-muted)] mt-3 italic">
                                                    {result.green_data.methodology_source}
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {/* ===== SOVEREIGNTY CARD ===== */}
                                    {result.sovereignty_data && (
                                        <div className="rounded-xl bg-[var(--bg-secondary)] border border-[var(--glass-border)]" style={{ padding: '1.5rem' }}>
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-2">
                                                    <Shield className="w-5 h-5" style={{ color: 'var(--accent)', filter: 'drop-shadow(0 0 4px rgba(0, 255, 135, 0.4))' }} />
                                                    <span className="font-semibold text-[var(--text-primary)]">Souveraineté Numérique</span>
                                                </div>
                                                <SovereigntyGauge score={result.sovereignty_data.score} size={64} />
                                            </div>

                                            {/* Details Grid */}
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                                <div className="flex items-center gap-3 p-2.5 rounded-lg bg-[var(--bg-surface)]">
                                                    <MapPin className="w-4 h-4 flex-shrink-0 text-[var(--text-muted)]" />
                                                    <div className="flex justify-between flex-1 min-w-0">
                                                        <span className="text-xs text-[var(--text-muted)]">Localisation</span>
                                                        <span className="text-xs font-medium text-[var(--text-primary)] truncate ml-2">{result.sovereignty_data.location}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 p-2.5 rounded-lg bg-[var(--bg-surface)]">
                                                    <Building2 className="w-4 h-4 flex-shrink-0 text-[var(--text-muted)]" />
                                                    <div className="flex justify-between flex-1 min-w-0">
                                                        <span className="text-xs text-[var(--text-muted)]">Entreprise</span>
                                                        <span className="text-xs font-medium text-[var(--text-primary)] truncate ml-2">{result.sovereignty_data.company}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 p-2.5 rounded-lg bg-[var(--bg-surface)]">
                                                    <FileKey className="w-4 h-4 flex-shrink-0 text-[var(--text-muted)]" />
                                                    <div className="flex justify-between flex-1 min-w-0">
                                                        <span className="text-xs text-[var(--text-muted)]">Licence</span>
                                                        <span className="text-xs font-medium text-[var(--text-primary)] truncate ml-2">{result.sovereignty_data.license}</span>
                                                    </div>
                                                </div>

                                                {/* Cloud Act Risk / RGPD badges */}
                                                <div className="flex flex-wrap gap-2" style={{ marginTop: '0.5rem' }}>
                                                    {result.sovereignty_data.cloud_act_risk ? (
                                                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--error)]/10 border border-[var(--error)]/30">
                                                            <ShieldAlert className="w-3.5 h-3.5 text-[var(--error)]" />
                                                            <span className="text-xs font-medium text-[var(--error)]">Cloud Act</span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--primary)]/10 border border-[var(--primary)]/30">
                                                            <ShieldCheck className="w-3.5 h-3.5 text-[var(--primary)]" />
                                                            <span className="text-xs font-medium text-[var(--primary)]">Hors Cloud Act</span>
                                                        </div>
                                                    )}
                                                    {result.sovereignty_data.rgpd_compliant !== undefined && (
                                                        result.sovereignty_data.rgpd_compliant ? (
                                                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--primary)]/10 border border-[var(--primary)]/30">
                                                                <ShieldCheck className="w-3.5 h-3.5 text-[var(--primary)]" />
                                                                <span className="text-xs font-medium text-[var(--primary)]">RGPD</span>
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--warning)]/10 border border-[var(--warning)]/30">
                                                                <ShieldAlert className="w-3.5 h-3.5 text-[var(--warning)]" />
                                                                <span className="text-xs font-medium text-[var(--warning)]">Non RGPD</span>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <div
                                    className="w-20 h-20 rounded-full bg-[var(--bg-surface)] flex items-center justify-center mb-4"
                                    style={{ boxShadow: '0 0 30px rgba(57, 255, 20, 0.05)' }}
                                >
                                    <Sparkles className="w-10 h-10 text-[var(--text-muted)]" />
                                </div>
                                <h3 className="text-lg font-medium text-[var(--text-secondary)] mb-2">
                                    En attente de votre intention
                                </h3>
                                <p className="text-sm text-[var(--text-muted)] max-w-xs">
                                    Décrivez ce que vous voulez accomplir et laissez l'IA optimiser votre prompt
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Generator;
