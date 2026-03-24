import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Leaf, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const [status, setStatus] = useState('loading'); // loading, success, error
    const [error, setError] = useState('');

    const { verifyEmail } = useAuth();

    useEffect(() => {
        const verify = async () => {
            if (!token) {
                setStatus('error');
                setError('Token de vérification manquant.');
                return;
            }

            const result = await verifyEmail(token);

            if (result.success) {
                setStatus('success');
            } else {
                setStatus('error');
                setError(result.error || 'Token invalide ou expiré.');
            }
        };

        verify();
    }, [token, verifyEmail]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] px-4">
            <div className="w-full max-w-md text-center">
                {/* Logo */}
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] mb-6">
                    <Leaf className="w-8 h-8 text-[var(--bg-primary)]" />
                </div>

                <div className="glass-card p-8">
                    {status === 'loading' && (
                        <div className="animate-fade-in">
                            <Loader2 className="w-12 h-12 text-[var(--primary)] animate-spin mx-auto mb-4" />
                            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">
                                Vérification en cours...
                            </h2>
                            <p className="text-[var(--text-secondary)]">
                                Validation de votre adresse email
                            </p>
                        </div>
                    )}

                    {status === 'success' && (
                        <div className="animate-fade-in">
                            <div className="w-16 h-16 rounded-full bg-[var(--success)]/20 flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-8 h-8 text-[var(--success)]" />
                            </div>
                            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">
                                Email vérifié !
                            </h2>
                            <p className="text-[var(--text-secondary)] mb-6">
                                Votre adresse email a été confirmée avec succès.
                                Vous pouvez maintenant utiliser toutes les fonctionnalités.
                            </p>
                            <Link to="/generator" className="btn btn-primary">
                                Accéder au Générateur
                            </Link>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="animate-fade-in">
                            <div className="w-16 h-16 rounded-full bg-[var(--error)]/20 flex items-center justify-center mx-auto mb-4">
                                <AlertCircle className="w-8 h-8 text-[var(--error)]" />
                            </div>
                            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">
                                Échec de la vérification
                            </h2>
                            <p className="text-[var(--text-secondary)] mb-6">
                                {error}
                            </p>
                            <Link to="/login" className="btn btn-secondary">
                                Retour à la connexion
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;
