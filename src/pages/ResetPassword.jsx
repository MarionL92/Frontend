import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Loader2, CheckCircle, AlertCircle, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}<>.]).{8,}$/;
const passwordRules = [
    { test: (p) => p.length >= 8,                   label: 'Au moins 8 caractères' },
    { test: (p) => /[a-z]/.test(p),                 label: 'Une lettre minuscule' },
    { test: (p) => /[A-Z]/.test(p),                 label: 'Une lettre majuscule' },
    { test: (p) => /\d/.test(p),                    label: 'Un chiffre' },
    { test: (p) => /[!@#$%^&*(),.?":{}<>]/.test(p), label: 'Un caractère spécial' },
];

const ResetPassword = () => {
    const navigate = useNavigate();

    const hashParams = useMemo(() => {
        const hash = window.location.hash.substring(1);
        return new URLSearchParams(hash);
    }, []);

    const accessToken  = hashParams.get('access_token');
    const refreshToken = hashParams.get('refresh_token');
    const hasTokens    = Boolean(accessToken && refreshToken);

    const [password, setPassword]               = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword]       = useState(false);
    const [showConfirm, setShowConfirm]         = useState(false);
    const [isSubmitting, setIsSubmitting]       = useState(false);
    const [error, setError]                     = useState('');
    const [success, setSuccess]                 = useState(false);

    const { resetPassword } = useAuth();
    const isPasswordValid = passwordRegex.test(password);
    const passwordsMatch  = password === confirmPassword && confirmPassword.length > 0;

    useEffect(() => {
        if (!hasTokens) setError('Lien de réinitialisation invalide ou expiré.');
    }, [hasTokens]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!isPasswordValid) { setError('Le mot de passe ne respecte pas les critères de sécurité.'); return; }
        if (!passwordsMatch)  { setError('Les mots de passe ne correspondent pas.'); return; }
        setIsSubmitting(true);
        const result = await resetPassword(accessToken, refreshToken, password);
        if (result.success) {
            setSuccess(true);
            setTimeout(() => navigate('/login'), 3000);
        } else {
            setError(result.error || 'Lien expiré ou invalide');
        }
        setIsSubmitting(false);
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center px-6">
                <div className="w-full max-w-md animate-fade-in">
                    <div className="glass-card text-center" style={{ padding: '2.5rem 2rem' }}>
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
                        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-3">Mot de passe modifié !</h2>
                        <p className="text-sm text-[var(--text-secondary)] mb-6 leading-relaxed">Votre mot de passe a été réinitialisé avec succès.</p>
                        <div className="w-full rounded-full overflow-hidden mb-2" style={{ height: '3px', background: 'var(--bg-surface)' }}>
                            <div className="h-full rounded-full" style={{ background: 'var(--gradient-primary)', animation: 'progress-fill 3s linear forwards', boxShadow: '0 0 8px rgba(57,255,20,0.4)' }} />
                        </div>
                        <p className="text-xs text-[var(--text-muted)]">Redirection vers la connexion…</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <AuthLayout
            badge="Sécurité du compte"
            title={<>Nouveau<br /><span className="gradient-text">mot de passe</span></>}
            description="Choisissez un mot de passe fort pour protéger votre compte et vos données."
            subtitle="Nouveau mot de passe"
        >
            <p className="text-sm text-[var(--text-secondary)] -mt-5 mb-7">
                Choisissez un nouveau mot de passe sécurisé
            </p>

            <div className="glass-card">
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    {error && (
                        <div className="alert alert-error animate-fade-in">
                            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="password" className="input-label">Nouveau mot de passe</label>
                        <div className="input-wrapper">
                            <Lock className="input-icon-left" />
                            <input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="input-field has-icon-left has-icon-right" required autoComplete="new-password" disabled={!hasTokens} />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="input-icon-right" tabIndex={-1} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        {password.length > 0 && (
                            <div className="mt-2 flex flex-col gap-1 animate-fade-in">
                                {passwordRules.map((rule, i) => {
                                    const ok = rule.test(password);
                                    return (
                                        <div key={i} className="flex items-center gap-2 text-xs" style={{ color: ok ? 'var(--success)' : 'var(--text-muted)' }}>
                                            {ok ? <CheckCircle className="w-3 h-3 flex-shrink-0" /> : <div className="w-3 h-3 rounded-full border border-current flex-shrink-0" />}
                                            <span>{rule.label}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword" className="input-label">Confirmer le mot de passe</label>
                        <div className="input-wrapper">
                            <Lock className="input-icon-left" />
                            <input
                                id="confirmPassword"
                                type={showConfirm ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                className={`input-field has-icon-left has-icon-right ${confirmPassword.length > 0 && !passwordsMatch ? 'border-[var(--error)]' : confirmPassword.length > 0 && passwordsMatch ? 'border-[var(--success)]' : ''}`}
                                style={confirmPassword.length > 0 && passwordsMatch ? { boxShadow: '0 0 8px rgba(57,255,20,0.2)' } : {}}
                                required autoComplete="new-password" disabled={!hasTokens}
                            />
                            <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="input-icon-right" tabIndex={-1} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        {confirmPassword.length > 0 && !passwordsMatch && <p className="error-text">Les mots de passe ne correspondent pas</p>}
                    </div>

                    <button type="submit" disabled={isSubmitting || !isPasswordValid || !passwordsMatch || !hasTokens} className="btn btn-primary w-full" style={{ marginTop: '0.25rem', fontSize: '0.9375rem' }}>
                        {isSubmitting ? (<><Loader2 className="w-4 h-4 animate-spin" /><span>Réinitialisation…</span></>) : (<span>Réinitialiser le mot de passe</span>)}
                    </button>
                </form>

                <div className="neon-divider" style={{ margin: '1.25rem 0' }} />

                <Link to="/login" className="flex items-center justify-center gap-1.5 text-sm font-medium transition-colors" style={{ color: 'var(--primary)' }}>
                    <ArrowLeft className="w-4 h-4" />
                    <span>Retour à la connexion</span>
                </Link>
            </div>
        </AuthLayout>
    );
};

export default ResetPassword;
