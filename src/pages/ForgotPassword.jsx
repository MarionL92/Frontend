import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Leaf, Mail, Loader2, CheckCircle, ArrowLeft } from 'lucide-react';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const { forgotPassword } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        await forgotPassword(email);
        setSuccess(true);

        setIsSubmitting(false);
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] px-4">
                <div className="w-full max-w-md text-center">
                    <div className="glass-card p-8 animate-fade-in">
                        <div
                            className="w-16 h-16 rounded-full bg-[var(--success)]/20 flex items-center justify-center mx-auto mb-4"
                            style={{ boxShadow: '0 0 20px rgba(57, 255, 20, 0.3)' }}
                        >
                            <CheckCircle className="w-8 h-8" style={{ color: 'var(--success)', filter: 'drop-shadow(0 0 6px rgba(57, 255, 20, 0.5))' }} />
                        </div>
                        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">
                            Email envoyé !
                        </h2>
                        <p className="text-[var(--text-secondary)] mb-6">
                            Si un compte existe avec cette adresse, vous recevrez un lien pour réinitialiser votre mot de passe.
                        </p>
                        <Link to="/login" className="btn btn-secondary">
                            <ArrowLeft className="w-4 h-4" />
                            <span>Retour à la connexion</span>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] px-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div
                        className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] mb-4"
                        style={{ boxShadow: 'var(--neon-glow-lg)' }}
                    >
                        <Leaf className="w-8 h-8 text-[var(--bg-primary)]" />
                    </div>
                    <h1 className="text-2xl font-bold gradient-text">Mot de passe oublié</h1>
                    <p className="text-[var(--text-secondary)] mt-2">
                        Entrez votre email pour recevoir un lien de réinitialisation
                    </p>
                </div>

                {/* Form Card */}
                <div className="glass-card p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="input-label">
                                Email
                            </label>
                            <div className="relative">
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

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn btn-primary w-full"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Envoi...</span>
                                </>
                            ) : (
                                <span>Envoyer le lien</span>
                            )}
                        </button>
                    </form>

                    {/* Back Link */}
                    <div className="mt-6 text-center">
                        <Link
                            to="/login"
                            className="inline-flex items-center gap-1 text-sm text-[var(--text-secondary)] hover:text-[var(--primary)]"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Retour à la connexion</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
