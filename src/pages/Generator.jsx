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
    X
} from 'lucide-react';

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
                                <Zap className="w-5 h-5 text-[var(--primary)]" />
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
                    <div className="glass-card p-4 space-y-5">
                        <div className="flex items-center gap-3 mb-4" style={{ marginTop: '0.5rem' }}>
                            <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center"
                                style={{ backgroundColor: `${modelInfo.color}20` }}
                            >
                                <Check className="w-5 h-5" style={{ color: modelInfo.color }} />
                            </div>
                            <div>
                                <h2 className="font-semibold text-[var(--text-primary)]">Prompt Optimisé</h2>
                                <p className="text-sm text-[var(--text-secondary)]">Prêt à copier-coller</p>
                            </div>
                        </div>

                        {/* Output Display */}
                        {result ? (
                            <div className="animate-fade-in space-y-6">
                                {/* Optimized Prompt */}
                                <div
                                    className="relative p-4 rounded-xl bg-[var(--bg-secondary)] border-2 transition-all"
                                    style={{ borderColor: modelInfo.color }}
                                >
                                    <pre className="whitespace-pre-wrap text-sm text-[var(--text-primary)] font-mono leading-relaxed">
                                        {result.optimized_prompt}
                                    </pre>
                                    <button
                                        onClick={handleCopy}
                                        className="absolute top-3 right-3 p-2 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] transition-colors"
                                        title="Copier"
                                    >
                                        {copied ? (
                                            <Check className="w-4 h-4 text-[var(--success)]" />
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
                                        <p className="text-sm text-[var(--text-secondary)]">{result.ai_reasoning}</p>
                                    </div>
                                )}

                                {/* Scores Section */}
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {/* Green Score */}
                                    {result.green_data && (
                                        <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--glass-border)]">
                                            <div className="flex items-center gap-2 mb-4">
                                                <Leaf className="w-5 h-5 text-[var(--primary)]" />
                                                <span className="font-medium text-[var(--text-primary)]">Impact Écologique</span>
                                            </div>

                                            <EcoScoreBadge score={result.green_data.eco_score} size="lg" />

                                            {/* Equivalences */}
                                            {result.green_data.equivalences && (
                                                <div className="mt-4 space-y-2">
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <Smartphone className="w-4 h-4 text-[var(--primary)]" />
                                                        <span className="text-[var(--text-secondary)]">
                                                            {result.green_data.equivalences.smartphone_charges.toFixed(3)} recharges 📱
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <Car className="w-4 h-4 text-[var(--primary)]" />
                                                        <span className="text-[var(--text-secondary)]">
                                                            {result.green_data.equivalences.km_electric_car.toFixed(3)} m parcourus 🚗
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <Lightbulb className="w-4 h-4 text-[var(--primary)]" />
                                                        <span className="text-[var(--text-secondary)]">
                                                            {result.green_data.equivalences.hours_led_bulb.toFixed(3)} h LED 💡
                                                        </span>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="mt-3 pt-3 border-t border-[var(--glass-border)]">
                                                <p className="text-xs text-[var(--text-muted)]">
                                                    {result.green_data.tokens_saved} tokens économisés
                                                </p>
                                                <p className="text-xs text-[var(--text-muted)]">
                                                    {result.green_data.co2_saved_g.toFixed(4)} g CO₂ évités
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Sovereignty Score */}
                                    {result.sovereignty_data && (
                                        <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--glass-border)]">
                                            <div className="flex items-center gap-2 mb-4">
                                                <Shield className="w-5 h-5 text-[var(--accent)]" />
                                                <span className="font-medium text-[var(--text-primary)]">Souveraineté</span>
                                            </div>

                                            <div className="flex justify-center">
                                                <SovereigntyGauge score={result.sovereignty_data.score} size={100} />
                                            </div>

                                            <div className="mt-4 space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-[var(--text-muted)]">Localisation</span>
                                                    <span className="text-[var(--text-secondary)]">{result.sovereignty_data.location}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-[var(--text-muted)]">Entreprise</span>
                                                    <span className="text-[var(--text-secondary)]">{result.sovereignty_data.company}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-[var(--text-muted)]">Licence</span>
                                                    <span className="text-[var(--text-secondary)]">{result.sovereignty_data.license}</span>
                                                </div>
                                                {result.sovereignty_data.cloud_act_risk && (
                                                    <div className="p-2 rounded-lg bg-[var(--warning)]/10 text-[var(--warning)] text-xs">
                                                        ⚠️ Risque Cloud Act (juridiction USA)
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <div className="w-20 h-20 rounded-full bg-[var(--bg-surface)] flex items-center justify-center mb-4">
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
