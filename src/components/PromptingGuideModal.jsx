import { X, Lightbulb, Zap, Shield, Leaf, FileText } from 'lucide-react';

const PromptingGuideModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in" onClick={onClose}>
            <div 
                className="glass-card max-w-2xl w-full max-h-[90vh] overflow-y-auto relative animate-scale-up" 
                onClick={(e) => e.stopPropagation()}
                style={{ scrollbarWidth: 'thin', scrollbarColor: 'var(--primary) transparent' }}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors z-10 bg-[var(--bg-surface)] rounded-full"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <div
                        className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center flex-shrink-0"
                        style={{ boxShadow: 'var(--neon-glow-md)' }}
                    >
                        <Lightbulb className="w-7 h-7 text-[var(--bg-primary)]" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold gradient-text">Guide des Bonnes Pratiques</h2>
                        <p className="text-[var(--text-secondary)] mt-1">Comment formuler des prompts efficients et responsables.</p>
                    </div>
                </div>

                {/* Content Sections */}
                <div className="space-y-6">
                    {/* Section 1: Precision */}
                    <div className="p-5 rounded-xl bg-[var(--bg-surface)] border border-[var(--glass-border)]">
                        <div className="flex items-center gap-2 mb-3">
                            <Zap className="w-5 h-5 text-[var(--accent)]" />
                            <h3 className="text-lg font-semibold text-[var(--text-primary)]">1. Soyez Précis et Direct</h3>
                        </div>
                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-3">
                            L'IA n'a pas besoin de politesse excessive ("S'il te plaît", "Pourrais-tu"). Allez droit au but : définissez le <strong>rôle</strong>, la <strong>tâche</strong> et le <strong>format de sortie</strong> attendu.
                        </p>
                        <div className="bg-[var(--bg-primary)] p-3 rounded-lg border border-[var(--error)]/30 mb-2">
                            <span className="text-xs text-[var(--error)] font-bold uppercase tracking-wider block mb-1">À éviter</span>
                            <span className="text-sm text-[var(--text-muted)] italic">"Bonjour, pourrais-tu s'il te plaît m'écrire un petit texte pour dire que..."</span>
                        </div>
                        <div className="bg-[var(--bg-primary)] p-3 rounded-lg border border-[var(--success)]/30">
                            <span className="text-xs text-[var(--success)] font-bold uppercase tracking-wider block mb-1">Idéal</span>
                            <span className="text-sm text-[var(--text-muted)]">"Rédige un email de 3 paragraphes pour annoncer le lancement du produit X."</span>
                        </div>
                    </div>

                    {/* Section 2: Eco Impact */}
                    <div className="p-5 rounded-xl bg-[var(--bg-surface)] border border-[var(--glass-border)]">
                        <div className="flex items-center gap-2 mb-3">
                            <Leaf className="w-5 h-5 text-[#60a5fa]" />
                            <h3 className="text-lg font-semibold text-[var(--text-primary)]">2. Réduisez les "Tokens"</h3>
                        </div>
                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-3">
                            Les LLM découpent votre texte en "tokens" (mots ou syllabes). Plus votre prompt est long, plus le serveur consomme d'électricité et d'eau pour le traiter. 
                        </p>
                        <ul className="list-disc pl-5 text-sm text-[var(--text-secondary)] space-y-1">
                            <li>Supprimez les mots de remplissage.</li>
                            <li>Demandez explicitement des réponses courtes si vous n'avez pas besoin de détails (`"Réponds en 1 phrase"`).</li>
                        </ul>
                    </div>

                    {/* Section 3: Sovereignty */}
                    <div className="p-5 rounded-xl bg-[var(--bg-surface)] border border-[var(--glass-border)]">
                        <div className="flex items-center gap-2 mb-3">
                            <Shield className="w-5 h-5 text-[#ffdd00]" />
                            <h3 className="text-lg font-semibold text-[var(--text-primary)]">3. Choisissez le bon Modèle</h3>
                        </div>
                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                            Tous les modèles ne se valent pas en matière de confidentialité. Si vous traitez des données sensibles, privilégiez des modèles open-weights européens (ex: <strong>Mistral</strong>) qui ne sont pas soumis au Cloud Act américain et respectent le RGPD. Utilisez les gros modèles (GPT-5, Opus) uniquement pour des tâches complexes nécessitant un fort niveau de raisonnement.
                        </p>
                    </div>

                    {/* Section 4: Context */}
                    <div className="p-5 rounded-xl bg-[var(--bg-surface)] border border-[var(--glass-border)]">
                        <div className="flex items-center gap-2 mb-3">
                            <FileText className="w-5 h-5 text-[var(--primary)]" />
                            <h3 className="text-lg font-semibold text-[var(--text-primary)]">4. Fournissez du Contexte Structuré</h3>
                        </div>
                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                            Utilisez des délimiteurs comme `"""` ou `###` pour séparer vos instructions de vos données. L'IA comprendra mieux la structure de votre demande, réduisant ainsi le risque d'hallucinations et la nécessité de regénérer la réponse.
                        </p>
                    </div>
                </div>

                {/* Footer Action */}
                <div className="mt-8 text-center pt-6 border-t border-[var(--glass-border)]">
                    <button onClick={onClose} className="btn btn-primary px-8 py-3">
                        J'ai compris, retour à l'optimiseur
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PromptingGuideModal;
