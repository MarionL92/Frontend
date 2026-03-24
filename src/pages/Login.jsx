import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Leaf, Mail, Lock, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';

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
            if (result.error?.includes('403') || result.error?.includes('verify')) {
                setError('Veuillez vérifier votre email avant de vous connecter.');
            } else {
                setError(result.error || 'Email ou mot de passe incorrect');
            }
        }

        setIsSubmitting(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] px-4">
            <div className="w-full max-w-lg mb-[20px]">
                {/* Logo */}
                <div className="text-center" style={{ marginBottom: '48px' }}>
                    <div
                        className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] mb-4"
                        style={{ boxShadow: 'var(--neon-glow-lg)' }}
                    >
                        <Leaf className="w-8 h-8 text-[var(--bg-primary)]" />
                    </div>
                    <h1 className="text-2xl font-bold gradient-text">PromptOptim</h1>
                    <p className="text-[var(--text-secondary)]" style={{ marginTop: '24px' }}>
                        Connectez-vous pour optimiser vos prompts
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
                                    type={showPassword ? "text" : "password"}
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
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
                                    tabIndex={-1}
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Forgot Password Link */}
                        <div className="text-right" style={{ marginTop: '20px' }}>
                            <Link
                                to="/forgot-password"
                                className="text-sm hover:underline"
                                style={{ color: 'var(--primary)', textShadow: '0 0 6px rgba(57, 255, 20, 0.3)' }}
                            >
                                Mot de passe oublié ?
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <div style={{ marginTop: '10px' }}>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="btn btn-primary w-full py-3"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Connexion...</span>
                                    </>
                                ) : (
                                    <span>Se connecter</span>
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Register Link */}
                    <div className="text-center text-sm text-[var(--text-secondary)]" style={{ marginTop: '10px' }}>
                        Pas encore de compte ?{' '}
                        <Link
                            to="/register"
                            className="hover:underline font-medium"
                            style={{ color: 'var(--primary)', textShadow: '0 0 6px rgba(57, 255, 20, 0.3)' }}
                        >
                            Créer un compte
                        </Link>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-[var(--text-muted)]" style={{ marginTop: '40px' }}>
                    <span style={{ color: 'var(--primary)', textShadow: '0 0 5px rgba(57, 255, 20, 0.3)' }}>Green IT</span> — Économisez des ressources à chaque prompt
                </p>
            </div>
        </div>
    );
};

export default Login;
