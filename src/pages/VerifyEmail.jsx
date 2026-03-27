import { Link } from 'react-router-dom';
import { Leaf, CheckCircle, Mail, ArrowRight, Zap, Shield } from 'lucide-react';

/* ── Left panel feature list (same as Login/Register) ── */
const features = [
    {
        icon: Zap,
        label: 'Optimisation IA',
        desc: 'Prompts plus précis, moins de tokens consommés',
    },
    {
        icon: Leaf,
        label: 'Mesure CO₂ en temps réel',
        desc: "Calculez l'empreinte carbone de chaque requête",
    },
    {
        icon: Shield,
        label: 'Souveraineté numérique',
        desc: 'Modèles européens & conformité RGPD garantie',
    },
];

const VerifyEmail = () => (
    <div className="min-h-screen flex">

        {/* ════════════════════════════════
            LEFT — Brand panel (desktop only)
            ════════════════════════════════ */}
        <div
            className="hidden lg:flex lg:w-[44%] xl:w-[42%] relative flex-col justify-between overflow-hidden"
            style={{ background: 'var(--bg-secondary)', padding: '3rem 3.5rem 3rem 5rem' }}
        >
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(57,255,20,0.08) 1px, transparent 0)',
                    backgroundSize: '28px 28px',
                }}
            />
            <div
                className="absolute -top-24 -right-24 pointer-events-none"
                style={{
                    width: '360px',
                    height: '360px',
                    background: 'radial-gradient(circle, rgba(57,255,20,0.06) 0%, transparent 70%)',
                }}
            />
            <div
                className="absolute top-0 right-0 h-full pointer-events-none"
                style={{
                    width: '1px',
                    background: 'linear-gradient(180deg, transparent, rgba(57,255,20,0.25) 40%, rgba(57,255,20,0.25) 60%, transparent)',
                }}
            />

            <div className="relative z-10">
                <div className="flex items-center gap-3">
                    <div
                        className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center"
                        style={{ boxShadow: 'var(--neon-glow-sm)' }}
                    >
                        <Leaf className="w-5 h-5 text-[var(--bg-primary)]" />
                    </div>
                    <span className="text-base font-bold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>
                        PromptOptim
                    </span>
                </div>
            </div>

            <div className="relative z-10 flex flex-col gap-10">
                <div>
                    <div className="neon-badge mb-5">Vérification de compte</div>
                    <h2
                        className="text-3xl xl:text-4xl font-bold text-[var(--text-primary)] leading-tight mb-4"
                        style={{ fontFamily: 'var(--font-display)' }}
                    >
                        Votre accès est<br />
                        <span className="gradient-text">confirmé !</span>
                    </h2>
                    <p className="text-[var(--text-secondary)] leading-relaxed max-w-xs text-sm">
                        Votre email a été vérifié. Vous faites maintenant partie de l'IA souveraine et durable.
                    </p>
                </div>

                <div className="flex flex-col gap-5">
                    {features.map(({ icon: Icon, label, desc }, i) => (
                        <div key={label} className="flex items-start gap-4 animate-fade-in-up" style={{ animationDelay: `${i * 80}ms` }}>
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(57,255,20,0.1)', border: '1px solid rgba(57,255,20,0.18)' }}>
                                <Icon className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-[var(--text-primary)] mb-0.5">{label}</p>
                                <p className="text-xs text-[var(--text-muted)] leading-relaxed">{desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <p className="relative z-10 text-xs text-[var(--text-faint)]">© 2025 PromptOptim — Green IT</p>
        </div>

        {/* ════════════════════════════════
            RIGHT — Confirmation panel
            ════════════════════════════════ */}
        <div className="flex-1 flex items-center justify-center px-6 py-12 lg:py-0">
            <div className="w-full max-w-md text-center animate-fade-in">

                {/* Mobile-only logo */}
                <div className="mb-8 lg:hidden">
                    <div
                        className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] mb-4"
                        style={{ boxShadow: 'var(--neon-glow-lg)' }}
                    >
                        <Leaf className="w-7 h-7 text-[var(--bg-primary)]" />
                    </div>
                </div>

                <div className="glass-card" style={{ padding: '2rem 1.75rem' }}>

                    {/* Success icon with pulse animation */}
                    <div className="relative flex items-center justify-center mx-auto mb-6" style={{ width: '6rem', height: '6rem' }}>
                        <div
                            className="absolute inset-0 rounded-full animate-pulse"
                            style={{ background: 'rgba(57,255,20,0.06)', border: '1px solid rgba(57,255,20,0.15)' }}
                        />
                        <div
                            className="absolute rounded-full"
                            style={{
                                inset: '0.5rem',
                                background: 'rgba(57,255,20,0.1)',
                                border: '1px solid rgba(57,255,20,0.2)',
                            }}
                        />
                        <div
                            className="relative flex items-center justify-center w-16 h-16 rounded-full"
                            style={{
                                background: 'linear-gradient(135deg, rgba(57,255,20,0.18), rgba(0,255,135,0.12))',
                                boxShadow: '0 0 24px rgba(57,255,20,0.3)',
                            }}
                        >
                            <CheckCircle
                                className="w-8 h-8"
                                style={{ color: 'var(--primary)', filter: 'drop-shadow(0 0 8px rgba(57,255,20,0.7))' }}
                            />
                        </div>
                    </div>

                    <div className="neon-badge mx-auto mb-4" style={{ display: 'inline-flex' }}>Vérification réussie</div>

                    <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-3">Email vérifié !</h2>

                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-8 max-w-xs mx-auto">
                        Votre adresse email a été confirmée avec succès. Vous pouvez maintenant vous connecter.
                    </p>

                    {/* Info box */}
                    <div
                        className="rounded-xl mb-6 text-left"
                        style={{
                            padding: '1rem 1.25rem',
                            background: 'rgba(57,255,20,0.04)',
                            border: '1px solid rgba(57,255,20,0.14)',
                        }}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(57,255,20,0.1)' }}>
                                <Mail className="w-4.5 h-4.5 text-[var(--primary)]" />
                            </div>
                            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                                Compte activé — prêt pour une consommation numérique responsable.
                            </p>
                        </div>
                    </div>

                    <Link
                        to="/login"
                        className="btn btn-primary w-full"
                    >
                        <span>Se connecter</span>
                        <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>

                </div>

                {/* Footer mobile */}
                <p className="text-center text-xs text-[var(--text-faint)] mt-6 lg:hidden">
                    <span style={{ color: 'var(--primary)' }}>Green IT</span> — Économisez des ressources à chaque prompt
                </p>
            </div>
        </div>
    </div>
);

export default VerifyEmail;

