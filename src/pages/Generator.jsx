import { useState, useEffect, useCallback } from 'react';
import { promptAPI } from '../services/api';
import Layout from '../components/Layout';
import ModelSelector, { getModelInfo } from '../components/ModelSelector';
import EcoScoreBadge from '../components/EcoScoreBadge';
import SovereigntyGauge from '../components/SovereigntyGauge';
import { useToast } from '../context/ToastContext';
import {
    Zap, Copy, Check, Loader2, Smartphone, Car, Lightbulb,
    Info, AlertCircle, Sparkles, Leaf, Shield, X,
    ShieldCheck, ShieldAlert, MapPin, Building2, FileKey,
    Droplets, BatteryCharging, Command
} from 'lucide-react';
import Tooltip from '../components/Tooltip';


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

const MetricCell = ({ icon: Icon, iconColor, value, label }) => (
    <div className="text-center rounded-xl border border-[var(--glass-border)]" style={{ padding: '0.75rem 0.5rem', background: 'var(--bg-surface)' }}>
        <Icon className="w-4 h-4 mx-auto mb-1.5" style={{ color: iconColor, filter: `drop-shadow(0 0 3px ${iconColor}66)` }} />
        <p className="text-base font-bold leading-none mb-1" style={{ color: iconColor, fontFamily: 'var(--font-display)' }}>{value}</p>
        <p className="text-[10px] text-[var(--text-muted)] leading-tight">{label}</p>
    </div>
);


const Generator = () => {
    const [inputText, setInputText]     = useState('');
    const [targetModel, setTargetModel] = useState(() => localStorage.getItem('preferred_model') || 'mistral_2');
    const [isGenerating, setIsGenerating] = useState(false);
    const [result, setResult]           = useState(null);
    const [error, setError]             = useState('');
    const [showReasoning, setShowReasoning] = useState(false);
    const [showEcoInfo, setShowEcoInfo]   = useState(false);
    const [showSovInfo, setShowSovInfo]   = useState(false);

    const toast = useToast();

    /* Persist model preference */
    const handleModelChange = (model) => {
        setTargetModel(model);
        localStorage.setItem('preferred_model', model);
    };

    const handleGenerate = useCallback(async () => {
        if (!inputText.trim() || isGenerating) return;
        setError('');
        setIsGenerating(true);
        setResult(null);
        setShowReasoning(false);
        try {
            const data = await promptAPI.generate(inputText, targetModel);
            setResult(data);
            toast.success('Prompt optimisé avec succès !');
        } catch (err) {
            if (err.response?.status === 403) {
                setError('Veuillez vérifier votre email pour utiliser cette fonctionnalité.');
            } else {
                setError(err.response?.data?.detail || 'Une erreur est survenue lors de la génération.');
            }
        } finally {
            setIsGenerating(false);
        }
    }, [inputText, targetModel, isGenerating, toast]);

    /* Ctrl/Cmd + Enter shortcut */
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                handleGenerate();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleGenerate]);

    const handleCopy = async () => {
        if (result?.optimized_prompt) {
            await navigator.clipboard.writeText(result.optimized_prompt);
            toast.success('Prompt copié dans le presse-papier !');
        }
    };

    const modelInfo = getModelInfo(targetModel);

    return (
        <Layout>
            <div className="container">

                {/* ── Page Header ── */}
                <div className="text-center mb-8">
                    <div className="neon-badge mx-auto mb-4">Optimisation de prompt</div>
                    <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-3" style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.01em' }}>
                        Générateur de Prompts
                    </h1>
                    <p className="text-[var(--text-secondary)] max-w-xl mx-auto leading-relaxed text-sm">
                        Transformez votre intention en prompt optimisé et mesurez votre impact environnemental en temps réel.
                    </p>
                </div>

                {/* ── Main Grid ── */}
                <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">

                    {/* ══ LEFT: Input ══ */}
                    <div className="glass-card flex flex-col gap-5">
                        <div className="flex items-center gap-3">
                            <div className="square-icon bg-[var(--primary)]/10 border border-[var(--primary)]/15">
                                <Zap className="w-5 h-5" style={{ color: 'var(--primary)', filter: 'drop-shadow(0 0 4px rgba(57,255,20,0.5))' }} />
                            </div>
                            <div>
                                <h2 className="font-semibold text-[var(--text-primary)] text-base">Votre Intention</h2>
                                <p className="text-xs text-[var(--text-muted)]">Décrivez ce que vous voulez accomplir</p>
                            </div>
                        </div>

                        <div className="form-group">
                            <textarea
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder="Ex : Je veux créer une image d'un coucher de soleil sur Mars avec des teintes orangées…"
                                className="input-field resize-none"
                                style={{ minHeight: '140px', lineHeight: 1.6 }}
                                disabled={isGenerating}
                            />
                            <div className="flex justify-between text-[10px] text-[var(--text-muted)] opacity-80">
                                <span>{inputText.length} caractères</span>
                                {/* Keyboard hint */}
                                <span className="flex items-center gap-1">
                                    <kbd style={{

                                        padding: '0.1rem 0.35rem',
                                        borderRadius: '4px',
                                        background: 'var(--bg-surface)',
                                        border: '1px solid var(--glass-border)',
                                        fontSize: '0.65rem',
                                        fontFamily: 'monospace',
                                    }}>Ctrl</kbd>
                                    <span>+</span>
                                    <kbd style={{
                                        padding: '0.1rem 0.35rem',
                                        borderRadius: '4px',
                                        background: 'var(--bg-surface)',
                                        border: '1px solid var(--glass-border)',
                                        fontSize: '0.65rem',
                                        fontFamily: 'monospace',
                                    }}>↵</kbd>
                                    <span>pour lancer</span>
                                </span>
                            </div>
                        </div>

                        <ModelSelector value={targetModel} onChange={handleModelChange} disabled={isGenerating} />

                        <button
                            onClick={handleGenerate}
                            disabled={!inputText.trim() || isGenerating}
                            className="btn btn-primary w-full"
                            style={{ paddingTop: '0.625rem', paddingBottom: '0.625rem', fontSize: '0.9375rem' }}
                        >
                            {isGenerating ? (
                                <><Loader2 className="w-4 h-4 animate-spin" /><span>Optimisation...</span></>
                            ) : (
                                <><Sparkles className="w-4 h-4" /><span>Optimiser mon prompt</span></>
                            )}
                        </button>


                        {error && (
                            <div className="alert alert-error animate-fade-in">
                                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                <span>{error}</span>
                            </div>
                        )}
                    </div>

                    {/* ══ RIGHT: Output ══ */}
                    <div className="glass-card flex flex-col gap-5">
                        <div className="flex items-center gap-3">
                            <div className="square-icon" style={{ backgroundColor: `${modelInfo.color}18`, border: `1px solid ${modelInfo.color}25` }}>
                                <Sparkles className="w-5 h-5" style={{ color: modelInfo.color, filter: `drop-shadow(0 0 4px ${modelInfo.color}80)` }} />
                            </div>
                            <div>
                                <h2 className="font-semibold text-[var(--text-primary)] text-base">Prompt Optimisé</h2>
                                <p className="text-xs text-[var(--text-muted)]">Prêt à copier-coller</p>
                            </div>
                        </div>

                        {result ? (
                            <div className="animate-fade-in flex flex-col gap-5">
                                {/* Output box */}
                                <div
                                    className="relative rounded-xl border-2 transition-all"
                                    style={{ borderColor: modelInfo.color, background: 'var(--bg-secondary)', boxShadow: `0 0 18px ${modelInfo.color}18` }}
                                >
                                    <pre
                                        className="text-sm text-[var(--text-primary)] font-mono leading-relaxed whitespace-pre-wrap"
                                        style={{ padding: '1rem 2.5rem 1rem 1rem', wordBreak: 'break-word', overflowWrap: 'break-word', maxHeight: '320px', overflowY: 'auto', margin: 0 }}
                                    >
                                        {result.optimized_prompt}
                                    </pre>

                                    <button
                                        onClick={handleCopy}
                                        className="absolute top-3 right-3 p-1.5 rounded-lg transition-colors"
                                        style={{ background: 'var(--bg-surface)' }}
                                        title="Copier (toast de confirmation)"
                                    >
                                        <Copy className="w-4 h-4 text-[var(--text-secondary)]" />
                                    </button>
                                </div>

                                {/* Reasoning toggle */}
                                {result.ai_reasoning && (
                                    <button onClick={() => setShowReasoning(!showReasoning)} className="flex items-center gap-2 text-xs text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors self-start">
                                        <Info className="w-3.5 h-3.5" />
                                        <span>Pourquoi ce résultat ?</span>
                                    </button>
                                )}
                                {showReasoning && result.ai_reasoning && (
                                    <div className="alert alert-info animate-fade-in relative">
                                        <button onClick={() => setShowReasoning(false)} style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                        <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="font-semibold text-xs mb-1">Explication de l'IA</p>
                                            <p className="text-xs leading-relaxed opacity-90">{result.ai_reasoning}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Eco + Sovereignty */}
                                <div className="flex flex-col gap-4">
                                    {result.green_data && (
                                        <div className="rounded-xl border border-[var(--glass-border)]" style={{ background: 'var(--bg-secondary)', padding: '1.25rem' }}>
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-2">
                                                    <Leaf className="w-4 h-4" style={{ color: 'var(--primary)', filter: 'drop-shadow(0 0 4px rgba(57,255,20,0.5))' }} />
                                                    <span className="font-semibold text-sm text-[var(--text-primary)]">Impact Écologique</span>
                                                    <button onClick={() => setShowEcoInfo(!showEcoInfo)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'var(--text-muted)' }}>
                                                        <Info className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                                <EcoScoreBadge score={result.green_data.eco_score} size="md" />
                                            </div>
                                            {showEcoInfo && (
                                                <div className="mb-4 p-3.5 rounded-xl border border-[var(--glass-border)] animate-fade-in text-xs text-[var(--text-secondary)] leading-relaxed relative" style={{ background: 'var(--bg-surface)' }}>
                                                    <button onClick={() => setShowEcoInfo(false)} style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X className="w-3 h-3" /></button>
                                                    <strong className="text-[var(--text-primary)] block mb-1">Pourquoi ce score ?</strong>
                                                    Impact calculé en comparant coût énergétique de l'intention vs prompt optimisé, pondéré par l'efficience du modèle.<br /><br />
                                                    <strong className="text-[var(--text-primary)] block mb-1">Comment l'améliorer ?</strong>
                                                    Modèles légers pour tâches simples, restez concis.
                                                </div>
                                            )}
                                            <div className="grid grid-cols-3 gap-2.5 mb-4">
                                                <MetricCell icon={BatteryCharging} iconColor="var(--primary)"  value={result.green_data.tokens_saved || 0}                       label="tokens économisés" />
                                                <MetricCell icon={Leaf}            iconColor="var(--eco-b)"     value={formatSmallNumber(result.green_data.co2_saved_g)}          label="g CO₂ évités" />
                                                <MetricCell icon={Droplets}        iconColor="#60a5fa"           value={formatSmallNumber(result.green_data.water_saved_ml)}       label="mL eau épargnés" />
                                            </div>
                                            {result.green_data.equivalences && (
                                                <div className="grid grid-cols-3 gap-2.5 pt-4" style={{ borderTop: '1px solid var(--glass-border)' }}>
                                                    {[
                                                        { icon: Smartphone, val: formatEquivalence(result.green_data.equivalences.smartphone_charges), label: 'recharges' },
                                                        { icon: Car,        val: formatEquivalence(result.green_data.equivalences.km_electric_car),      label: 'km en VE' },
                                                        { icon: Lightbulb,  val: formatEquivalence(result.green_data.equivalences.hours_led_bulb),        label: 'h LED' },
                                                    ].map(({ icon: Icon, val, label }) => (
                                                        <div key={label} className="flex flex-col items-center text-center gap-1">
                                                            <Icon className="w-4 h-4 text-[var(--text-muted)]" />
                                                            <span className="text-sm font-semibold text-[var(--text-primary)]">{val}</span>
                                                            <span className="text-xs text-[var(--text-muted)]">{label}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            {result.green_data.methodology_source && (
                                                <p className="text-[10px] text-[var(--text-faint)] mt-3 italic">{result.green_data.methodology_source}</p>
                                            )}
                                        </div>
                                    )}

                                    {result.sovereignty_data && (
                                        <div className="rounded-xl border border-[var(--glass-border)]" style={{ background: 'var(--bg-secondary)', padding: '1.25rem' }}>
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-2">
                                                    <Shield className="w-4 h-4" style={{ color: 'var(--accent)', filter: 'drop-shadow(0 0 4px rgba(0,255,135,0.4))' }} />
                                                    <span className="font-semibold text-sm text-[var(--text-primary)]">Souveraineté Numérique</span>
                                                    <button onClick={() => setShowSovInfo(!showSovInfo)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'var(--text-muted)' }}>
                                                        <Info className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                                <SovereigntyGauge score={result.sovereignty_data.score} size={60} />
                                            </div>
                                            {showSovInfo && (
                                                <div className="mb-4 p-3.5 rounded-xl border border-[var(--glass-border)] animate-fade-in text-xs text-[var(--text-secondary)] leading-relaxed relative" style={{ background: 'var(--bg-surface)' }}>
                                                    <button onClick={() => setShowSovInfo(false)} style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X className="w-3 h-3" /></button>
                                                    <strong className="text-[var(--text-primary)] block mb-1">Comment est-ce calculé ?</strong>
                                                    Localisation API (Europe vs US), licence (Libre vs Propriétaire), soumission aux lois extra-territoriales (Cloud Act US).<br /><br />
                                                    <strong className="text-[var(--text-primary)] block mb-1">Bonne pratique :</strong>
                                                    Pour données personnelles (RGPD), choisissez un modèle européen (ex : Mistral).
                                                </div>
                                            )}
                                            <div className="flex flex-col gap-2 mb-3">
                                                {[
                                                    { icon: MapPin,    key: 'location', label: 'Localisation' },
                                                    { icon: Building2, key: 'company',  label: 'Entreprise' },
                                                    { icon: FileKey,   key: 'license',  label: 'Licence' },
                                                ].map(({ icon: Icon, key, label }) => (
                                                    <div key={key} className="flex items-center gap-2.5 px-3 py-2 rounded-lg" style={{ background: 'var(--bg-surface)' }}>
                                                        <Icon className="w-3.5 h-3.5 flex-shrink-0 text-[var(--text-muted)]" />
                                                        <div className="flex justify-between flex-1 min-w-0">
                                                            <span className="text-xs text-[var(--text-muted)]">{label}</span>
                                                            <span className="text-xs font-medium text-[var(--text-primary)] truncate ml-2">{result.sovereignty_data[key]}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {result.sovereignty_data.cloud_act_risk ? (
                                                    <Tooltip content="Risque juridique lié à l'accès potentiel des autorités US aux données via le Cloud Act.">
                                                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--error)]/10 border border-[var(--error)]/25">
                                                            <ShieldAlert className="w-3.5 h-3.5 text-[var(--error)]" />
                                                            <span className="text-xs font-medium text-[var(--error)]">Cloud Act</span>
                                                        </div>
                                                    </Tooltip>
                                                ) : (
                                                    <Tooltip content="Modèle opéré par une entité non-soumise aux lois extra-territoriales US.">
                                                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--primary)]/10 border border-[var(--primary)]/20">
                                                            <ShieldCheck className="w-3.5 h-3.5 text-[var(--primary)]" />
                                                            <span className="text-xs font-medium text-[var(--primary)]">Hors Cloud Act</span>
                                                        </div>
                                                    </Tooltip>
                                                )}
                                                {result.sovereignty_data.rgpd_compliant !== undefined && (
                                                    result.sovereignty_data.rgpd_compliant ? (
                                                        <Tooltip content="Le fournisseur garantit la conformité avec le Règlement Général sur la Protection des Données.">
                                                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--primary)]/10 border border-[var(--primary)]/20">
                                                                <ShieldCheck className="w-3.5 h-3.5 text-[var(--primary)]" /><span className="text-xs font-medium text-[var(--primary)]">RGPD</span>
                                                            </div>
                                                        </Tooltip>
                                                    ) : (
                                                        <Tooltip content="Données potentiellement traitées hors zone UE sans garanties RGPD strictes.">
                                                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--warning)]/10 border border-[var(--warning)]/25">
                                                                <ShieldAlert className="w-3.5 h-3.5 text-[var(--warning)]" /><span className="text-xs font-medium text-[var(--warning)]">Non RGPD</span>
                                                            </div>
                                                        </Tooltip>
                                                    )
                                                )}
                                            </div>

                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-16 text-center flex-1">
                                <div
                                    className="w-20 h-20 rounded-full flex items-center justify-center mb-5 animate-pulse-glow"
                                    style={{ background: 'var(--bg-surface)', border: '1px solid var(--glass-border)' }}
                                >
                                    <Sparkles className="w-9 h-9 text-[var(--text-muted)]" />
                                </div>
                                <h3 className="text-base font-semibold text-[var(--text-secondary)] mb-2">En attente de votre intention</h3>
                                <p className="text-sm text-[var(--text-muted)] max-w-[220px] leading-relaxed mb-4">
                                    Décrivez votre besoin à gauche et laissez l'IA optimiser
                                </p>
                                <div className="flex items-center gap-1.5 text-xs text-[var(--text-faint)]">
                                    <kbd style={{ padding: '0.15rem 0.4rem', borderRadius: '4px', background: 'var(--bg-surface)', border: '1px solid var(--glass-border)', fontSize: '0.65rem', fontFamily: 'monospace' }}>Ctrl</kbd>
                                    <span>+</span>
                                    <kbd style={{ padding: '0.15rem 0.4rem', borderRadius: '4px', background: 'var(--bg-surface)', border: '1px solid var(--glass-border)', fontSize: '0.65rem', fontFamily: 'monospace' }}>↵</kbd>
                                    <span>pour lancer rapidement</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Generator;
