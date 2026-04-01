import { Link } from 'react-router-dom';
import { CheckCircle, Mail, ArrowRight } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';

const VerifyEmail = () => (
    <AuthLayout
        badge="Vérification de compte"
        title={<>Votre accès est<br /><span className="gradient-text">confirmé !</span></>}
        description="Votre email a été vérifié. Vous faites maintenant partie de l'IA souveraine et durable."
    >
        <div className="glass-card text-center" style={{ padding: '2rem 1.75rem' }}>
            {/* Success icon */}
            <div className="relative flex items-center justify-center mx-auto mb-6" style={{ width: '6rem', height: '6rem' }}>
                <div className="absolute inset-0 rounded-full animate-pulse" style={{ background: 'rgba(57,255,20,0.06)', border: '1px solid rgba(57,255,20,0.15)' }} />
                <div className="absolute rounded-full" style={{ inset: '0.5rem', background: 'rgba(57,255,20,0.1)', border: '1px solid rgba(57,255,20,0.2)' }} />
                <div className="relative flex items-center justify-center w-16 h-16 rounded-full" style={{ background: 'linear-gradient(135deg, rgba(57,255,20,0.18), rgba(0,255,135,0.12))', boxShadow: '0 0 24px rgba(57,255,20,0.3)' }}>
                    <CheckCircle className="w-8 h-8" style={{ color: 'var(--primary)', filter: 'drop-shadow(0 0 8px rgba(57,255,20,0.7))' }} />
                </div>
            </div>

            <div className="neon-badge mx-auto mb-4" style={{ display: 'inline-flex' }}>Vérification réussie</div>
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-3">Email vérifié !</h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-8 max-w-xs mx-auto">
                Votre adresse email a été confirmée avec succès. Vous pouvez maintenant vous connecter.
            </p>

            <div className="rounded-xl mb-6 text-left" style={{ padding: '1rem 1.25rem', background: 'rgba(57,255,20,0.04)', border: '1px solid rgba(57,255,20,0.14)' }}>
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(57,255,20,0.1)' }}>
                        <Mail className="w-4 h-4 text-[var(--primary)]" />
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                        Compte activé — prêt pour une consommation numérique responsable.
                    </p>
                </div>
            </div>

            <Link to="/login" className="btn btn-primary w-full">
                <span>Se connecter</span>
                <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
        </div>
    </AuthLayout>
);

export default VerifyEmail;
