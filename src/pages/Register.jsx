import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Leaf, Mail, Lock, Loader2, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';

// Password validation regex
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}<>.]).{8,}$/;

const passwordRules = [
    { test: (p) => p.length >= 8, label: 'Au moins 8 caractères' },
    { test: (p) => /[a-z]/.test(p), label: 'Une lettre minuscule' },
    { test: (p) => /[A-Z]/.test(p), label: 'Une lettre majuscule' },
    { test: (p) => /\d/.test(p), label: 'Un chiffre' },
    { test: (p) => /[!@#$%^&*(),.?":{}<>]/.test(p), label: 'Un caractère spécial' },
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

        // Client-side validation
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
            // V5: user must verify email before login, redirect after 5s
            setTimeout(() => {
                navigate('/login');
            }, 5000);
        } else {
            setError(result.error || 'Une erreur est survenue');
        }

        setIsSubmitting(false);
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] px-6">
                <div className="w-full max-w-md text-center">
                    <div className="glass-card animate-fade-in" style={{ padding: '2.5rem 2rem' }}>
                        {/* Animated Success Icon */}
                        <div
                            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto"
                            style={{
                                marginBottom: '1.5rem',
                                background: 'linear-gradient(135deg, rgba(57, 255, 20, 0.15), rgba(0, 255, 135, 0.1))',
                                boxShadow: '0 0 30px rgba(57, 255, 20, 0.25), 0 0 60px rgba(57, 255, 20, 0.1)',
                                animation: 'pulse-glow 2s ease-in-out infinite',
                            }}
                        >
                            <CheckCircle className="w-10 h-10" style={{ color: 'var(--success)', filter: 'drop-shadow(0 0 8px rgba(57, 255, 20, 0.6))' }} />
                        </div>

                        {/* Title */}
                        <h2 className="text-2xl font-bold gradient-text" style={{ marginBottom: '1.5rem' }}>
                            Compte créé avec succès !
                        </h2>

                        {/* Email verification info */}
                        <div
                            className="rounded-xl border border-[var(--glass-border)]"
                            style={{ padding: '1.25rem', marginBottom: '1.5rem', background: 'rgba(57, 255, 20, 0.03)' }}
                        >
                            <div className="flex items-center justify-center gap-3" style={{ marginBottom: '0.75rem' }}>
                                <div
                                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                                    style={{ background: 'rgba(57, 255, 20, 0.1)' }}
                                >
                                    <Mail className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                                </div>
                                <span className="text-sm font-semibold text-[var(--text-primary)]">Vérifiez votre email</span>
                            </div>
                            <p className="text-sm text-[var(--text-secondary)]" style={{ marginBottom: '0.5rem', lineHeight: 1.6 }}>
                                Un email de vérification a été envoyé à
                            </p>
                            <p className="text-sm font-semibold" style={{ color: 'var(--primary)', wordBreak: 'break-all' }}>
                                {email}
                            </p>
                        </div>

                        <p className="text-sm text-[var(--text-secondary)]" style={{ marginBottom: '1.5rem', lineHeight: 1.6 }}>
                            Cliquez sur le lien dans l'email pour activer votre compte et commencer à optimiser vos prompts.
                        </p>

                        {/* Countdown progress bar */}
                        <div style={{ marginBottom: '0.75rem' }}>
                            <div
                                className="w-full rounded-full overflow-hidden"
                                style={{ height: '4px', background: 'var(--bg-surface)' }}
                            >
                                <div
                                    className="h-full rounded-full"
                                    style={{
                                        background: 'linear-gradient(90deg, var(--primary), var(--accent))',
                                        animation: 'progress-fill 5s linear forwards',
                                        boxShadow: '0 0 8px rgba(57, 255, 20, 0.4)',
                                    }}
                                />
                            </div>
                        </div>

                        <p className="text-xs text-[var(--text-muted)]">
                            Redirection vers la connexion...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] px-4 py-8">
            <div className="w-full max-w-lg mb-[20px]">
                {/* Logo */}
                <div className="text-center" style={{ marginBottom: '48px' }}>
                    <div
                        className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] mb-4"
                        style={{ boxShadow: 'var(--neon-glow-lg)' }}
                    >
                        <Leaf className="w-8 h-8 text-[var(--bg-primary)]" />
                    </div>
                    <h1 className="text-2xl font-bold gradient-text">Créer un compte</h1>
                    <p className="text-[var(--text-secondary)]" style={{ marginTop: '24px' }}>
                        Rejoignez la communauté <span style={{ color: 'var(--primary)', textShadow: '0 0 6px rgba(57, 255, 20, 0.3)' }}>Green IT</span>
                    </p>
                </div>

                {/* Form Card */}
                <div className="glass-card" style={{ padding: '20px' }}>
                    <form onSubmit={handleSubmit} style={{ marginTop: '0px' }}>
                        {/* Error Message */}
                        {error && (
                            <div className="flex items-center gap-2 p-3 rounded-lg bg-[var(--error)]/10 border border-[var(--error)]/30 text-[var(--error)] text-sm animate-fade-in">
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="input-label">
                                Email
                            </label>
                            <div className="relative mt-1">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
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
                        <div style={{ marginTop: '30px' }}>
                            <label htmlFor="password" className="input-label">
                                Mot de passe
                            </label>
                            <div className="relative mt-1">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
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
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>

                            {/* Password Rules */}
                            {password.length > 0 && (
                                <div className="mt-3 space-y-1 animate-fade-in">
                                    {passwordRules.map((rule, i) => (
                                        <div
                                            key={i}
                                            className={`flex items-center gap-2 text-xs ${rule.test(password) ? 'text-[var(--success)]' : 'text-[var(--text-muted)]'
                                                }`}
                                            style={rule.test(password) ? { textShadow: '0 0 6px rgba(57, 255, 20, 0.3)' } : {}}
                                        >
                                            {rule.test(password) ? (
                                                <CheckCircle className="w-3 h-3" />
                                            ) : (
                                                <div className="w-3 h-3 rounded-full border border-current" />
                                            )}
                                            <span>{rule.label}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div style={{ marginTop: '30px' }}>
                            <label htmlFor="confirmPassword" className="input-label">
                                Confirmer le mot de passe
                            </label>
                            <div className="relative mt-1">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                                <input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className={`input-field has-icon-left has-icon-right ${confirmPassword.length > 0 && !passwordsMatch
                                        ? 'border-[var(--error)]'
                                        : confirmPassword.length > 0 && passwordsMatch
                                            ? 'border-[var(--success)]'
                                            : ''
                                        }`}
                                    style={confirmPassword.length > 0 && passwordsMatch ? { boxShadow: '0 0 8px rgba(57, 255, 20, 0.2)' } : {}}
                                    required
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                                    tabIndex={-1}
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {confirmPassword.length > 0 && !passwordsMatch && (
                                <p className="error-text">Les mots de passe ne correspondent pas</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div style={{ marginTop: '10px' }}>
                            <button
                                type="submit"
                                disabled={isSubmitting || !isPasswordValid || !passwordsMatch}
                                className="btn btn-primary w-full py-3"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Création...</span>
                                    </>
                                ) : (
                                    <span>Créer mon compte</span>
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Login Link */}
                    <div className="text-center text-sm text-[var(--text-secondary)]" style={{ marginTop: '10px' }}>
                        Déjà un compte ?{' '}
                        <Link
                            to="/login"
                            className="hover:underline font-medium"
                            style={{ color: 'var(--primary)', textShadow: '0 0 6px rgba(57, 255, 20, 0.3)' }}
                        >
                            Se connecter
                        </Link>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-[var(--text-muted)]" style={{ marginTop: '40px' }}>
                    En créant un compte, vous contribuez à un <span style={{ color: 'var(--primary)', textShadow: '0 0 5px rgba(57, 255, 20, 0.3)' }}>web plus responsable</span>
                </p>
            </div>
        </div>
    );
};

export default Register;
