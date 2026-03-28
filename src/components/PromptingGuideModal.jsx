import { useEffect } from 'react';
import { X, Lightbulb, Zap, Shield, Leaf, FileText } from 'lucide-react';

const PromptingGuideModal = ({ isOpen, onClose }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in"
            onClick={onClose}
        >
            <div
                className="glass-card max-w-2xl w-full relative"
                onClick={(e) => e.stopPropagation()}
                style={{ maxHeight: '85vh', padding: 0 }}
            >
                {/* Close Button — fixed inside the card, above the scroll area */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors z-20 bg-[var(--bg-surface)]/80 backdrop-blur-md rounded-full border border-[var(--glass-border)]"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Inner scroll container */}
                <div style={{ overflowY: 'auto', maxHeight: '85vh', padding: '3rem 3rem', scrollbarWidth: 'thin', scrollbarColor: 'var(--primary) transparent' }}>


                {/* Header */}
                <div className="flex items-center gap-5 mb-12">
                    <div
                        className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center flex-shrink-0"
                        style={{ boxShadow: 'var(--neon-glow-lg)' }}
                    >
                        <Lightbulb className="w-8 h-8 text-[var(--bg-primary)]" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold gradient-text" style={{ fontFamily: 'var(--font-display)' }}>Guide des Bonnes Pratiques</h2>
                        <p className="text-[var(--text-secondary)] mt-3 text-sm">Maîtrisez l'art du prompt efficient et souverain.</p>
                    </div>
                </div>

                {/* Content Sections */}
                <div className="grid grid-cols-1 gap-12">
                    {/* Section 1: Sovereignty (3.png) */}
                    <div className="rounded-2xl bg-[var(--bg-primary)] border border-[var(--glass-border)] overflow-hidden group hover:border-[var(--accent)]/30 transition-colors">
                        <div className="aspect-[21/9] w-full relative overflow-hidden">
                            <img src="/3.png" alt="Souveraineté" className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] to-transparent" />
                        </div>
                        <div className="p-8">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center border border-[var(--accent)]/20">
                                    <Shield className="w-5 h-5 text-[var(--accent)]" />
                                </div>
                                <h3 className="text-xl font-bold text-[var(--text-primary)]">1. Choisissez la Souveraineté</h3>
                            </div>
                            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                                Privilégiez des modèles européens (ex: <strong>Mistral</strong>) pour vos données sensibles. Ces modèles ne sont pas soumis aux lois extra-territoriales US (Cloud Act) et garantissent un respect strict du RGPD.
                            </p>
                        </div>
                    </div>

                    {/* Section 2: Eco Impact (1.png) */}
                    <div className="rounded-2xl bg-[var(--bg-primary)] border border-[var(--glass-border)] overflow-hidden group hover:border-[var(--eco-a)]/30 transition-colors">
                        <div className="aspect-[21/9] w-full relative overflow-hidden">
                            <img src="/1.png" alt="Impact Éco" className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] to-transparent" />
                        </div>
                        <div className="p-8">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-10 h-10 rounded-xl bg-[var(--eco-a)]/10 flex items-center justify-center border border-[var(--eco-a)]/20">
                                    <Leaf className="w-5 h-5 text-[var(--eco-a)]" />
                                </div>
                                <h3 className="text-xl font-bold text-[var(--text-primary)]">2. Réduisez les "Tokens"</h3>
                            </div>
                            <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-5">
                                Chaque token généré consomme de l'énergie et de l'eau. Soyez concis et évitez le remplissage inutile.
                            </p>
                            <ul className="list-disc pl-5 text-sm text-[var(--text-muted)] space-y-3">
                                <li>Supprimez les formules de politesse superflues.</li>
                                <li>Utilisez des contraintes : <code className="bg-black/20 px-1.5 py-0.5 rounded">"Réponds en 1 phrase"</code>.</li>
                            </ul>
                        </div>
                    </div>

                    {/* Section 3: Performance/Context (2.png) */}
                    <div className="rounded-2xl bg-[var(--bg-primary)] border border-[var(--glass-border)] overflow-hidden group hover:border-[var(--primary)]/30 transition-colors">
                        <div className="aspect-[21/9] w-full relative overflow-hidden">
                            <img src="/2.png" alt="Performance" className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] to-transparent" />
                        </div>
                        <div className="p-8">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center border border-[var(--primary)]/20">
                                    <Zap className="w-5 h-5 text-[var(--primary)]" />
                                </div>
                                <h3 className="text-xl font-bold text-[var(--text-primary)]">3. Structurez votre Contexte</h3>
                            </div>
                            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                                Utilisez des délimiteurs (<code className="bg-black/20 px-1 py-0.5 rounded">"""</code>, <code className="bg-black/20 px-1 py-0.5 rounded">###</code>) pour isoler vos instructions. Une structure claire réduit les hallucinations et évite les regénérations coûteuses.
                            </p>
                        </div>
                    </div>

                    {/* Section 4: Precision (4.png) */}
                    <div className="rounded-2xl bg-[var(--bg-primary)] border border-[var(--glass-border)] overflow-hidden group hover:border-[var(--success)]/30 transition-colors">
                        <div className="aspect-[21/9] w-full relative overflow-hidden">
                            <img src="/4.png" alt="Précision" className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] to-transparent" />
                        </div>
                        <div className="p-8">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-10 h-10 rounded-xl bg-[var(--success)]/10 flex items-center justify-center border border-[var(--success)]/20">
                                    <Lightbulb className="w-5 h-5 text-[var(--success)]" />
                                </div>
                                <h3 className="text-xl font-bold text-[var(--text-primary)]">4. Soyez Précis et Direct</h3>
                            </div>
                            <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6">
                                Définissez clairement le <strong>rôle</strong>, la <strong>tâche</strong> et le <strong>format</strong> de sortie attendu.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-black/20 p-4 rounded-xl border border-[var(--error)]/10">
                                    <span className="text-[10px] text-[var(--error)] font-bold uppercase tracking-widest block mb-1.5 opacity-60">À éviter</span>
                                    <span className="text-[13px] text-[var(--text-muted)] leading-tight italic">"Bonjour, est-ce que tu pourrais m'aider à..."</span>
                                </div>
                                <div className="bg-black/20 p-4 rounded-xl border border-[var(--success)]/10">
                                    <span className="text-[10px] text-[var(--success)] font-bold uppercase tracking-widest block mb-1.5 opacity-60">Idéal</span>
                                    <span className="text-[13px] text-[var(--text-primary)] leading-tight">"Analyse ce rapport et extrais les 3 points clés en format liste."</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                {/* Footer Action */}
                <div className="mt-10 text-center pt-8 border-t border-[var(--glass-border)]">
                    <button onClick={onClose} className="btn btn-primary px-10 py-3.5 shadow-xl hover:scale-[1.02] active:scale-[0.98]">
                        J'ai compris, retour à l'optimiseur
                    </button>
                </div>

                </div>{/* end inner scroll container */}
            </div>
        </div>
    );
};

export default PromptingGuideModal;
