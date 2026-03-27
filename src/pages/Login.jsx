import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Leaf, Mail, Lock, Loader2, AlertCircle, Eye, EyeOff, Zap, Shield, Check } from 'lucide-react';

/* ── Left panel feature list ── */
const features = [
    {
        icon: Zap,
        label: 'Optimisation IA',
        desc: 'Prompts plus précis, moins de tokens consommés',
    },
    {
        icon: Leaf,
        label: 'Mesure CO₂ en temps réel',
        desc: 'Calculez l\'empreinte carbone de chaque requête',
    },
    {
        icon: Shield,
        label: 'Souveraineté numérique',
        desc: 'Modèles européens & conformité RGPD garantie',
    },
];

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/generator';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        const result = await login(email, password);
        if (result.success) {
            navigate(from, { replace: true });
        } else {
            setError(
                result.emailNotVerified
                    ? 'Veuillez vérifier votre email avant de vous connecter.'
                    : result.error || 'Email ou mot de passe incorrect'
            );
        }
        setIsSubmitting(false);
    };

    return (
        <div className="min-h-screen flex">

            {/* ════════════════════════════════
                LEFT — Brand panel (desktop only)
                ════════════════════════════════ */}
            <div
                className="hidden lg:flex lg:w-[44%] xl:w-[42%] relative flex-col justify-between overflow-hidden"
                style={{ background: 'var(--bg-secondary)', padding: '3rem 3.5rem 3rem 5rem' }}
            >
                {/* Dot-grid texture */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(57,255,20,0.08) 1px, transparent 0)',
                        backgroundSize: '28px 28px',
                    }}
                />
                {/* Ambient top-right glow */}
                <div
                    className="absolute -top-24 -right-24 pointer-events-none"
                    style={{
                        width: '360px',
                        height: '360px',
                        background: 'radial-gradient(circle, rgba(57,255,20,0.06) 0%, transparent 70%)',
                    }}
                />
                {/* Right border glow line */}
                <div
                    className="absolute top-0 right-0 h-full pointer-events-none"
                    style={{
                        width: '1px',
                        background: 'linear-gradient(180deg, transparent, rgba(57,255,20,0.25) 40%, rgba(57,255,20,0.25) 60%, transparent)',
                    }}
                />

                {/* Top — Logo */}
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

                {/* Middle — Copy + Features */}
                <div className="relative z-10 flex flex-col gap-10">
                    <div>
                        <div className="neon-badge mb-5">Green IT & Souveraineté</div>
                        <h2
                            className="text-3xl xl:text-4xl font-bold text-[var(--text-primary)] leading-tight mb-4"
                            style={{ fontFamily: 'var(--font-display)' }}
                        >
                            L'IA au service de<br />
                            <span className="gradient-text">l'écologie numérique</span>
                        </h2>
                        <p className="text-[var(--text-secondary)] leading-relaxed max-w-xs text-sm">
                            Optimisez vos prompts pour réduire votre empreinte carbone tout en gagnant en précision et en souveraineté.
                        </p>
                    </div>

                    <div className="flex flex-col gap-5">
                        {features.map(({ icon: Icon, label, desc }, i) => (
                            <div key={label} className="flex items-start gap-4 animate-fade-in-up" style={{ animationDelay: `${i * 80}ms` }}>
                                <div
                                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                                    style={{
                                        background: 'rgba(57,255,20,0.1)',
                                        border: '1px solid rgba(57,255,20,0.18)',
                                    }}
                                >
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

                {/* Bottom — Copyright */}
                <p className="relative z-10 text-xs text-[var(--text-faint)]">
                    © 2025 PromptOptim — Green IT
                </p>
            </div>

            {/* ════════════════════════════════
                RIGHT — Form panel
                ════════════════════════════════ */}
            <div className="flex-1 flex items-center justify-center px-6 py-12 lg:py-0">
                <div className="w-full max-w-md animate-fade-in">

                    {/* Mobile-only logo */}
                    <div className="text-center mb-8 lg:hidden">
                        <div
                            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] mb-4"
                            style={{ boxShadow: 'var(--neon-glow-lg)' }}
                        >
                            <Leaf className="w-7 h-7 text-[var(--bg-primary)]" />
                        </div>
                        <h1 className="text-2xl font-bold gradient-text">PromptOptim</h1>
                    </div>

                    {/* Heading */}
                    <div className="mb-7">
                        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1.5">
                            Connexion
                        </h1>
                        <p className="text-sm text-[var(--text-secondary)]">
                            Connectez-vous pour optimiser vos prompts
                        </p>
                    </div>

                    {/* Card */}
                    <div className="glass-card">
                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                            {/* Error */}
                            {error && (
                                <div className="alert alert-error animate-fade-in">
                                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                    <span>{error}</span>
                                </div>
                            )}

                            {/* Email */}
                            <div className="form-group">
                                <label htmlFor="email" className="input-label">Email</label>
                                <div className="input-wrapper">
                                    <Mail className="input-icon-left" />
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="votre@email.com"
                                        className="input-field has-icon-left"
                                        required
                                        autoComplete="email"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="form-group">
                                <div className="flex items-center justify-between">
                                    <label htmlFor="password" className="input-label">Mot de passe</label>
                                    <Link
                                        to="/forgot-password"
                                        className="text-xs font-medium transition-colors"
                                        style={{ color: 'var(--primary)' }}
                                    >
                                        Mot de passe oublié ?
                                    </Link>
                                </div>
                                <div className="input-wrapper">
                                    <Lock className="input-icon-left" />
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="input-field has-icon-left has-icon-right"
                                        required
                                        autoComplete="current-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="input-icon-right"
                                        tabIndex={-1}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                                    >
                                        {showPassword
                                            ? <EyeOff className="w-4 h-4" />
                                            : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="btn btn-primary w-full"
                                style={{ paddingTop: '0.9rem', paddingBottom: '0.9rem', marginTop: '0.25rem', fontSize: '0.9375rem' }}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Connexion en cours…</span>
                                    </>
                                ) : (
                                    <span>Se connecter</span>
                                )}
                            </button>
                        </form>

                        <div className="neon-divider" style={{ margin: '1.25rem 0' }} />

                        <p className="text-center text-sm text-[var(--text-secondary)]">
                            Pas encore de compte ?{' '}
                            <Link
                                to="/register"
                                className="font-semibold transition-colors"
                                style={{ color: 'var(--primary)' }}
                            >
                                Créer un compte
                            </Link>
                        </p>
                    </div>

                    {/* Footer mobile */}
                    <p className="text-center text-xs text-[var(--text-faint)] mt-6 lg:hidden">
                        <span style={{ color: 'var(--primary)' }}>Green IT</span> — Économisez des ressources à chaque prompt
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
