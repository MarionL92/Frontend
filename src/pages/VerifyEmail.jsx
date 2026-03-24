import { Link } from 'react-router-dom';
import { Leaf, CheckCircle } from 'lucide-react';

// V5: Supabase handles email verification automatically via its own link.
// When the user lands on this page, their email has already been verified by Supabase.
// This page just confirms the success and directs them to login.

const VerifyEmail = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] px-4">
            <div className="w-full max-w-md text-center">
                {/* Logo */}
                <div
                    className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] mb-6"
                    style={{ boxShadow: 'var(--neon-glow-lg)' }}
                >
                    <Leaf className="w-8 h-8 text-[var(--bg-primary)]" />
                </div>

                <div className="glass-card p-8">
                    <div className="animate-fade-in">
                        <div
                            className="w-16 h-16 rounded-full bg-[var(--success)]/20 flex items-center justify-center mx-auto mb-4"
                            style={{ boxShadow: '0 0 20px rgba(57, 255, 20, 0.3)' }}
                        >
                            <CheckCircle className="w-8 h-8" style={{ color: 'var(--success)', filter: 'drop-shadow(0 0 6px rgba(57, 255, 20, 0.5))' }} />
                        </div>
                        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">
                            Email vérifié !
                        </h2>
                        <p className="text-[var(--text-secondary)] mb-6">
                            Votre adresse email a été confirmée avec succès.
                            Vous pouvez maintenant vous connecter.
                        </p>
                        <Link to="/login" className="btn btn-primary">
                            Se connecter
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;
