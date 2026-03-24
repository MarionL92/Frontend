import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Leaf, Lock, Loader2, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';

// Password validation regex
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}<>.]).{8,}$/;

const passwordRules = [
    { test: (p) => p.length >= 8, label: 'Au moins 8 caractères' },
    { test: (p) => /[a-z]/.test(p), label: 'Une lettre minuscule' },
    { test: (p) => /[A-Z]/.test(p), label: 'Une lettre majuscule' },
    { test: (p) => /\d/.test(p), label: 'Un chiffre' },
    { test: (p) => /[!@#$%^&*(),.?":{}<>]/.test(p), label: 'Un caractère spécial' },
];

const ResetPassword = () => {
    const navigate = useNavigate();

    // V5: Supabase redirects with tokens in the URL hash fragment
    // e.g. /reset-password#access_token=...&refresh_token=...
    const hashParams = useMemo(() => {
        const hash = window.location.hash.substring(1); // remove the #
        return new URLSearchParams(hash);
    }, []);

    const accessToken = hashParams.get('access_token');
    const refreshToken = hashParams.get('refresh_token');
    const hasTokens = Boolean(accessToken && refreshToken);

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const { resetPassword } = useAuth();

    const isPasswordValid = passwordRegex.test(password);
    const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;

    useEffect(() => {
        if (!hasTokens) {
            setError('Lien de réinitialisation invalide ou expiré.');
        }
    }, [hasTokens]);

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

        // V5: send access_token + refresh_token + new_password
        const result = await resetPassword(accessToken, refreshToken, password);

        if (result.success) {
            setSuccess(true);
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } else {
            setError(result.error || 'Lien expiré ou invalide');
        }

        setIsSubmitting(false);
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="w-full max-w-md text-center">
                    <div className="glass-card p-8 animate-fade-in">
                        <div
                            className="w-16 h-16 rounded-full bg-[var(--success)]/20 flex items-center justify-center mx-auto mb-4"
                            style={{ boxShadow: '0 0 20px rgba(57, 255, 20, 0.3)' }}
                        >
                            <CheckCircle className="w-8 h-8" style={{ color: 'var(--success)', filter: 'drop-shadow(0 0 6px rgba(57, 255, 20, 0.5))' }} />
                        </div>
                        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">
                            Mot de passe modifié !
                        </h2>
                        <p className="text-[var(--text-secondary)] mb-4">
                            Votre mot de passe a été réinitialisé avec succès.
                        </p>
                        <p className="text-sm text-[var(--text-muted)]">
                            Redirection vers la connexion...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div
                        className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] mb-4"
                        style={{ boxShadow: 'var(--neon-glow-lg)' }}
                    >
                        <Leaf className="w-8 h-8 text-[var(--bg-primary)]" />
                    </div>
                    <h1 className="text-2xl font-bold gradient-text">Nouveau mot de passe</h1>
                    <p className="text-[var(--text-secondary)] mt-2">
                        Choisissez un nouveau mot de passe sécurisé
                    </p>
                </div>

                {/* Form Card */}
                <div className="glass-card p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Error Message */}
                        {error && (
                            <div className="flex items-center gap-2 p-3 rounded-lg bg-[var(--error)]/10 border border-[var(--error)]/30 text-[var(--error)] text-sm animate-fade-in">
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="input-label">
                                Nouveau mot de passe
                            </label>
                            <div className="relative">
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
                                    disabled={!hasTokens}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
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
                        <div>
                            <label htmlFor="confirmPassword" className="input-label">
                                Confirmer le mot de passe
                            </label>
                            <div className="relative">
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
                                    disabled={!hasTokens}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {confirmPassword.length > 0 && !passwordsMatch && (
                                <p className="error-text">Les mots de passe ne correspondent pas</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting || !isPasswordValid || !passwordsMatch || !hasTokens}
                            className="btn btn-primary w-full"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Réinitialisation...</span>
                                </>
                            ) : (
                                <span>Réinitialiser le mot de passe</span>
                            )}
                        </button>
                    </form>

                    {/* Login Link */}
                    <div className="mt-6 text-center text-sm text-[var(--text-secondary)]">
                        <Link
                            to="/login"
                            className="hover:underline font-medium"
                            style={{ color: 'var(--primary)', textShadow: '0 0 6px rgba(57, 255, 20, 0.3)' }}
                        >
                            Retour à la connexion
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
