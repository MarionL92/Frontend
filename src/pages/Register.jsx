import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Leaf, Mail, Lock, Loader2, AlertCircle, CheckCircle, Eye, EyeOff, Zap, Shield } from 'lucide-react';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}<>.]).{8,}$/;

const passwordRules = [
    { test: (p) => p.length >= 8,                          label: 'Au moins 8 caractères' },
    { test: (p) => /[a-z]/.test(p),                        label: 'Une lettre minuscule' },
    { test: (p) => /[A-Z]/.test(p),                        label: 'Une lettre majuscule' },
    { test: (p) => /\d/.test(p),                           label: 'Un chiffre' },
    { test: (p) => /[!@#$%^&*(),.?":{}<>]/.test(p),        label: 'Un caractère spécial' },
];

/* ── Left panel feature list (same as Login) ── */
const features = [
    { icon: Zap,    label: 'Optimisation IA',          desc: 'Prompts plus précis, moins de tokens consommés' },
    { icon: Leaf,   label: 'Mesure CO₂ en temps réel', desc: "Calculez l'empreinte carbone de chaque requête" },
    { icon: Shield, label: 'Souveraineté numérique',   desc: 'Modèles européens & conformité RGPD garantie' },
];

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const isPasswordValid = passwordRegex.test(password);
    const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!isPasswordValid) {
            setError('Le mot de passe ne respecte pas les critères de sécurité.');
            return;
        }
        if (!passwordsMatch) {
            setError('Les mots de passe ne correspondent pas.');
            return;
        }
        setIsSubmitting(true);
        const result = await register(email, password);
        if (result.success) {
            setSuccess(true);
            setTimeout(() => navigate('/login'), 5000);
        } else {
            setError(result.error || 'Une erreur est survenue');
        }
        setIsSubmitting(false);
    };

    /* ── Success screen ── */
    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center px-6">
                <div className="w-full max-w-md text-center">
                    <div className="glass-card animate-fade-in" style={{ padding: '2.5rem 2rem' }}>
                        <div
                            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                            style={{
                                background: 'linear-gradient(135deg, rgba(57,255,20,0.15), rgba(0,255,135,0.1))',
                                boxShadow: '0 0 32px rgba(57,255,20,0.25), 0 0 64px rgba(57,255,20,0.1)',
                                animation: 'pulse-glow 2s ease-in-out infinite',
                            }}
                        >
                            <CheckCircle className="w-10 h-10" style={{ color: 'var(--success)', filter: 'drop-shadow(0 0 8px rgba(57,255,20,0.6))' }} />
                        </div>

                        <h2 className="text-2xl font-bold gradient-text mb-5">Compte créé avec succès !</h2>

                        <div
                            className="rounded-xl border border-[var(--glass-border)] mb-5"
                            style={{ padding: '1.25rem', background: 'rgba(57,255,20,0.03)' }}
                        >
                            <div className="flex items-center justify-center gap-3 mb-3">
                                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'rgba(57,255,20,0.1)' }}>
                                    <Mail className="w-4.5 h-4.5" style={{ color: 'var(--primary)', width: '1.125rem', height: '1.125rem' }} />
                                </div>
                                <span className="text-sm font-semibold text-[var(--text-primary)]">Vérifiez votre email</span>
                            </div>
                            <p className="text-sm text-[var(--text-secondary)] mb-2 leading-relaxed">
                                Un email de vérification a été envoyé à
                            </p>
                            <p className="text-sm font-semibold" style={{ color: 'var(--primary)', wordBreak: 'break-all' }}>
                                {email}
                            </p>
                        </div>

                        <p className="text-sm text-[var(--text-secondary)] mb-5 leading-relaxed">
                            Cliquez sur le lien dans l'email pour activer votre compte et commencer à optimiser vos prompts.
                        </p>

                        <div className="w-full rounded-full overflow-hidden mb-2" style={{ height: '3px', background: 'var(--bg-surface)' }}>
                            <div
                                className="h-full rounded-full"
                                style={{
                                    background: 'var(--gradient-primary)',
                                    animation: 'progress-fill 5s linear forwards',
                                    boxShadow: '0 0 8px rgba(57,255,20,0.4)',
                                }}
                            />
                        </div>
                        <p className="text-xs text-[var(--text-muted)]">Redirection vers la connexion…</p>
                    </div>
                </div>
            </div>
        );
    }

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
                <div
                    className="absolute -top-24 -right-24 pointer-events-none"
                    style={{ width: '360px', height: '360px', background: 'radial-gradient(circle, rgba(57,255,20,0.06) 0%, transparent 70%)' }}
                />
                <div
                    className="absolute top-0 right-0 h-full pointer-events-none"
                    style={{ width: '1px', background: 'linear-gradient(180deg, transparent, rgba(57,255,20,0.25) 40%, rgba(57,255,20,0.25) 60%, transparent)' }}
                />

                <div className="relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center" style={{ boxShadow: 'var(--neon-glow-sm)' }}>
                            <Leaf className="w-5 h-5 text-[var(--bg-primary)]" />
                        </div>
                        <span className="text-base font-bold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>PromptOptim</span>
                    </div>
                </div>

                <div className="relative z-10 flex flex-col gap-10">
                    <div>
                        <div className="neon-badge mb-5">Rejoignez la communauté</div>
                        <h2 className="text-3xl xl:text-4xl font-bold text-[var(--text-primary)] leading-tight mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                            Un web plus<br />
                            <span className="gradient-text">responsable</span>
                        </h2>
                        <p className="text-[var(--text-secondary)] leading-relaxed max-w-xs text-sm">
                            Chaque compte créé, c'est un utilisateur de plus qui choisit de mesurer et réduire son impact numérique.
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
                RIGHT — Form panel
                ════════════════════════════════ */}
            <div className="flex-1 flex items-center justify-center px-6 py-12 lg:py-0">
                <div className="w-full max-w-md animate-fade-in">

                    {/* Mobile-only logo */}
                    <div className="text-center mb-8 lg:hidden">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] mb-4" style={{ boxShadow: 'var(--neon-glow-lg)' }}>
                            <Leaf className="w-7 h-7 text-[var(--bg-primary)]" />
                        </div>
                        <h1 className="text-2xl font-bold gradient-text">PromptOptim</h1>
                    </div>

                    {/* Heading */}
                    <div className="mb-7">
                        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1.5">Créer un compte</h1>
                        <p className="text-sm text-[var(--text-secondary)]">
                            Rejoignez la communauté <span style={{ color: 'var(--primary)' }}>Green IT</span>
                        </p>
                    </div>

                    {/* Card */}
                    <div className="glass-card">
                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
                                <label htmlFor="password" className="input-label">Mot de passe</label>
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
                                        autoComplete="new-password"
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="input-icon-right" tabIndex={-1} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>

                                {/* Password rules */}
                                {password.length > 0 && (
                                    <div className="mt-2 flex flex-col gap-1 animate-fade-in">
                                        {passwordRules.map((rule, i) => {
                                            const ok = rule.test(password);
                                            return (
                                                <div key={i} className="flex items-center gap-2 text-xs" style={{ color: ok ? 'var(--success)' : 'var(--text-muted)' }}>
                                                    {ok
                                                        ? <CheckCircle className="w-3 h-3 flex-shrink-0" />
                                                        : <div className="w-3 h-3 rounded-full border border-current flex-shrink-0" />}
                                                    <span>{rule.label}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div className="form-group">
                                <label htmlFor="confirmPassword" className="input-label">Confirmer le mot de passe</label>
                                <div className="input-wrapper">
                                    <Lock className="input-icon-left" />
                                    <input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className={`input-field has-icon-left has-icon-right ${
                                            confirmPassword.length > 0 && !passwordsMatch ? 'border-[var(--error)]'
                                            : confirmPassword.length > 0 && passwordsMatch ? 'border-[var(--success)]' : ''
                                        }`}
                                        style={confirmPassword.length > 0 && passwordsMatch ? { boxShadow: '0 0 8px rgba(57,255,20,0.2)' } : {}}
                                        required
                                        autoComplete="new-password"
                                    />
                                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="input-icon-right" tabIndex={-1} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {confirmPassword.length > 0 && !passwordsMatch && (
                                    <p className="error-text">Les mots de passe ne correspondent pas</p>
                                )}
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={isSubmitting || !isPasswordValid || !passwordsMatch}
                                className="btn btn-primary w-full"
                                style={{ paddingTop: '0.9rem', paddingBottom: '0.9rem', marginTop: '0.25rem', fontSize: '0.9375rem' }}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Création du compte…</span>
                                    </>
                                ) : (
                                    <span>Créer mon compte</span>
                                )}
                            </button>
                        </form>

                        <div className="neon-divider" style={{ margin: '1.25rem 0' }} />

                        <p className="text-center text-sm text-[var(--text-secondary)]">
                            Déjà un compte ?{' '}
                            <Link to="/login" className="font-semibold transition-colors" style={{ color: 'var(--primary)' }}>
                                Se connecter
                            </Link>
                        </p>
                    </div>

                    <p className="text-center text-xs text-[var(--text-faint)] mt-6 lg:hidden">
                        En créant un compte, vous contribuez à un{' '}
                        <span style={{ color: 'var(--primary)' }}>web plus responsable</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
