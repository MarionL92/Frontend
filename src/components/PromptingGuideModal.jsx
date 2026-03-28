import { useEffect } from 'react';
import { X, Lightbulb, Zap, Shield, Leaf } from 'lucide-react';

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
            className="fixed inset-0 z-[100] flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)', padding: '1.5rem' }}
            onClick={onClose}
        >
            {/* Modal card — NO glass-card class to avoid overflow:hidden / position:relative conflicts */}
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: '42rem',
                    maxHeight: '85vh',
                    display: 'flex',
                    flexDirection: 'column',
                    background: 'var(--glass-bg)',
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: '0 8px 40px rgba(0,0,0,0.45)',
                }}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '1.25rem',
                        right: '1.25rem',
                        zIndex: 30,
                        padding: '0.5rem',
                        borderRadius: '9999px',
                        background: 'rgba(17,30,22,0.85)',
                        backdropFilter: 'blur(12px)',
                        border: '1px solid var(--glass-border)',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        transition: 'color 0.2s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Scrollable content area */}
                <div
                    style={{
                        overflowY: 'auto',
                        padding: '3rem',
                        scrollbarWidth: 'thin',
                        scrollbarColor: 'var(--primary) transparent',
                    }}
                >
                    {/* Header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '3rem' }}>
                        <div
                            style={{
                                width: '4rem',
                                height: '4rem',
                                borderRadius: '1rem',
                                background: 'var(--gradient-primary)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                                boxShadow: 'var(--neon-glow-lg)',
                            }}
                        >
                            <Lightbulb className="w-8 h-8" style={{ color: 'var(--bg-primary)' }} />
                        </div>
                        <div>
                            <h2
                                className="gradient-text"
                                style={{ fontSize: '1.75rem', fontWeight: 700, fontFamily: 'var(--font-display)', lineHeight: 1.2 }}
                            >
                                Guide des Bonnes Pratiques
                            </h2>
                            <p style={{ color: 'var(--text-secondary)', marginTop: '0.75rem', fontSize: '0.875rem' }}>
                                Maîtrisez l'art du prompt efficient et souverain.
                            </p>
                        </div>
                    </div>

                    {/* Sections */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>

                        {/* Section 1 */}
                        <SectionCard
                            imgSrc="/3.png"
                            imgAlt="Souveraineté"
                            icon={<Shield className="w-5 h-5" style={{ color: 'var(--accent)' }} />}
                            iconBg="rgba(0,255,135,0.1)"
                            iconBorder="rgba(0,255,135,0.2)"
                            hoverColor="var(--accent)"
                            title="1. Choisissez la Souveraineté"
                        >
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                                Privilégiez des modèles européens (ex: <strong style={{ color: 'var(--text-primary)' }}>Mistral</strong>) pour vos données sensibles. Ces modèles ne sont pas soumis aux lois extra-territoriales US (Cloud Act) et garantissent un respect strict du RGPD.
                            </p>
                        </SectionCard>

                        {/* Section 2 */}
                        <SectionCard
                            imgSrc="/1.png"
                            imgAlt="Impact Éco"
                            icon={<Leaf className="w-5 h-5" style={{ color: 'var(--eco-a)' }} />}
                            iconBg="rgba(57,255,20,0.1)"
                            iconBorder="rgba(57,255,20,0.2)"
                            hoverColor="var(--eco-a)"
                            title="2. Réduisez les &quot;Tokens&quot;"
                        >
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
                                Chaque token généré consomme de l'énergie et de l'eau. Soyez concis et évitez le remplissage inutile.
                            </p>
                            <ul style={{ listStyle: 'disc', paddingLeft: '1.25rem', fontSize: '0.875rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <li>Supprimez les formules de politesse superflues.</li>
                                <li>Utilisez des contraintes : <code style={{ background: 'rgba(0,0,0,0.2)', padding: '0.125rem 0.375rem', borderRadius: '4px' }}>"Réponds en 1 phrase"</code>.</li>
                            </ul>
                        </SectionCard>

                        {/* Section 3 */}
                        <SectionCard
                            imgSrc="/2.png"
                            imgAlt="Performance"
                            icon={<Zap className="w-5 h-5" style={{ color: 'var(--primary)' }} />}
                            iconBg="rgba(57,255,20,0.1)"
                            iconBorder="rgba(57,255,20,0.2)"
                            hoverColor="var(--primary)"
                            title="3. Structurez votre Contexte"
                        >
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                                Utilisez des délimiteurs (<code style={{ background: 'rgba(0,0,0,0.2)', padding: '0.125rem 0.25rem', borderRadius: '4px' }}>"""</code>, <code style={{ background: 'rgba(0,0,0,0.2)', padding: '0.125rem 0.25rem', borderRadius: '4px' }}>###</code>) pour isoler vos instructions. Une structure claire réduit les hallucinations et évite les regénérations coûteuses.
                            </p>
                        </SectionCard>

                        {/* Section 4 */}
                        <SectionCard
                            imgSrc="/4.png"
                            imgAlt="Précision"
                            icon={<Lightbulb className="w-5 h-5" style={{ color: 'var(--success, #4caf50)' }} />}
                            iconBg="rgba(76,175,80,0.1)"
                            iconBorder="rgba(76,175,80,0.2)"
                            hoverColor="var(--success, #4caf50)"
                            title="4. Soyez Précis et Direct"
                        >
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
                                Définissez clairement le <strong style={{ color: 'var(--text-primary)' }}>rôle</strong>, la <strong style={{ color: 'var(--text-primary)' }}>tâche</strong> et le <strong style={{ color: 'var(--text-primary)' }}>format</strong> de sortie attendu.
                            </p>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '0.75rem', border: '1px solid rgba(255,23,68,0.1)' }}>
                                    <span style={{ fontSize: '0.625rem', color: 'var(--error, #ff1744)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.375rem', opacity: 0.6 }}>À éviter</span>
                                    <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: 1.4, fontStyle: 'italic' }}>"Bonjour, est-ce que tu pourrais m'aider à..."</span>
                                </div>
                                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '0.75rem', border: '1px solid rgba(76,175,80,0.1)' }}>
                                    <span style={{ fontSize: '0.625rem', color: 'var(--success, #4caf50)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.375rem', opacity: 0.6 }}>Idéal</span>
                                    <span style={{ fontSize: '0.8125rem', color: 'var(--text-primary)', lineHeight: 1.4 }}>"Analyse ce rapport et extrais les 3 points clés en format liste."</span>
                                </div>
                            </div>
                        </SectionCard>
                    </div>

                    {/* Footer */}
                    <div style={{ marginTop: '2.5rem', textAlign: 'center', paddingTop: '2rem', borderTop: '1px solid var(--glass-border)' }}>
                        <button
                            onClick={onClose}
                            className="btn btn-primary"
                            style={{ padding: '0.875rem 2.5rem', fontSize: '0.9375rem', boxShadow: '0 4px 20px rgba(57,255,20,0.3)' }}
                        >
                            J'ai compris, retour à l'optimiseur
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

/* Reusable section card — all inline styles, no glass-card conflicts */
const SectionCard = ({ imgSrc, imgAlt, icon, iconBg, iconBorder, title, children }) => (
    <div
        style={{
            borderRadius: '1rem',
            background: 'var(--bg-primary)',
            border: '1px solid var(--glass-border)',
            overflow: 'hidden',
        }}
    >
        <div style={{ aspectRatio: '21/9', width: '100%', position: 'relative', overflow: 'hidden' }}>
            <img src={imgSrc} alt={imgAlt} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--bg-primary), transparent)' }} />
        </div>
        <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div
                    style={{
                        width: '2.5rem',
                        height: '2.5rem',
                        borderRadius: '0.75rem',
                        background: iconBg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: `1px solid ${iconBorder}`,
                    }}
                >
                    {icon}
                </div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>{title}</h3>
            </div>
            {children}
        </div>
    </div>
);

export default PromptingGuideModal;
