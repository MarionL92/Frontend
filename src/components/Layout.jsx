import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Leaf,
    Zap,
    History,
    BarChart3,
    LogOut,
    Menu,
    X,
    Lightbulb
} from 'lucide-react';
import { useState } from 'react';
import OnboardingModal from './OnboardingModal';
import PromptingGuideModal from './PromptingGuideModal';

const Layout = ({ children }) => {
    const { logout, isAuthenticated } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isGuideOpen, setIsGuideOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { path: '/generator', label: 'Générateur', icon: Zap },
        { path: '/history', label: 'Historique', icon: History },
        { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <div className="min-h-screen flex flex-col">
            {/* ── Floating Header ── */}
            <header
                className="fixed top-5 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-[94%] md:max-w-5xl z-50 animate-neon-border"
                style={{
                    background: 'rgba(11, 24, 16, 0.85)',
                    backdropFilter: 'blur(28px)',
                    WebkitBackdropFilter: 'blur(28px)',
                    border: '1px solid rgba(57, 255, 20, 0.18)',
                    borderRadius: '18px',
                    boxShadow: '0 8px 40px rgba(0,0,0,0.45), 0 0 0 1px rgba(57,255,20,0.06) inset',
                }}
            >
                <div className="flex items-center justify-between h-[60px]" style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}>

                    {/* Logo */}
                    <Link to="/generator" className="flex items-center gap-2.5 group flex-shrink-0">
                        <div
                            className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center transition-transform group-hover:scale-105"
                            style={{ boxShadow: 'var(--neon-glow-sm)' }}
                        >
                            <Leaf className="w-5 h-5 text-[var(--bg-primary)]" />
                        </div>
                        <span
                            className="text-base font-bold text-white tracking-wide"
                            style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.02em' }}
                        >
                            PromptOptim
                        </span>
                    </Link>

                    {/* Desktop Nav — truly centered */}
                    {isAuthenticated && (
                        <nav className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
                            {navItems.map((item) => {
                                const active = isActive(item.path);
                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className="flex items-center gap-2 rounded-xl transition-all text-sm font-medium"
                                        style={active ? {
                                            background: 'var(--gradient-primary)',
                                            color: 'var(--bg-primary)',
                                            fontWeight: 700,
                                            padding: '0.45rem 1.1rem',
                                            boxShadow: '0 0 14px rgba(57, 255, 20, 0.45)',
                                        } : {
                                            color: 'var(--text-secondary)',
                                            padding: '0.45rem 1rem',
                                        }}
                                    >
                                        <item.icon className="w-4 h-4" />
                                        <span>{item.label}</span>
                                    </Link>
                                );
                            })}
                        </nav>
                    )}

                    {/* Right actions */}
                    <div className="flex items-center gap-1.5">
                        {isAuthenticated && (
                            <>
                                <button
                                    onClick={() => setIsGuideOpen(true)}
                                    className="hidden md:flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] rounded-xl transition-all"
                                >
                                    <Lightbulb className="w-3.5 h-3.5" />
                                    <span>Guide</span>
                                </button>

                                <button
                                    onClick={handleLogout}
                                    className="hidden md:flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--error)] hover:bg-[rgba(255,23,68,0.08)] rounded-xl transition-all"
                                >
                                    <LogOut className="w-3.5 h-3.5" />
                                    <span>Déconnexion</span>
                                </button>

                                {/* Mobile toggle */}
                                <button
                                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                    className="md:hidden p-2 text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors rounded-lg hover:bg-[var(--bg-surface)]"
                                >
                                    {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Mobile Menu */}
                {isAuthenticated && mobileMenuOpen && (
                    <nav
                        className="md:hidden animate-fade-in"
                        style={{
                            borderTop: '1px solid var(--glass-border)',
                            padding: '0.875rem 1rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.375rem',
                        }}
                    >
                        {navItems.map((item) => {
                            const active = isActive(item.path);
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center gap-3 rounded-xl transition-all"
                                    style={active ? {
                                        background: 'var(--gradient-primary)',
                                        color: 'var(--bg-primary)',
                                        fontWeight: 700,
                                        padding: '0.8rem 1rem',
                                        boxShadow: 'var(--neon-glow-sm)',
                                    } : {
                                        color: 'var(--text-secondary)',
                                        padding: '0.8rem 1rem',
                                    }}
                                >
                                    <item.icon className="w-4.5 h-4.5" style={{ width: '1.125rem', height: '1.125rem' }} />
                                    <span className="text-sm font-medium">{item.label}</span>
                                </Link>
                            );
                        })}

                        <div className="neon-divider my-1" />

                        <button
                            onClick={() => { setIsGuideOpen(true); setMobileMenuOpen(false); }}
                            className="flex items-center gap-3 rounded-xl w-full text-left transition-all"
                            style={{ color: 'var(--text-secondary)', padding: '0.8rem 1rem' }}
                        >
                            <Lightbulb style={{ width: '1.125rem', height: '1.125rem' }} />
                            <span className="text-sm font-medium">Guide & Astuces</span>
                        </button>

                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 rounded-xl w-full text-left transition-all"
                            style={{ color: 'var(--error)', padding: '0.8rem 1rem' }}
                        >
                            <LogOut style={{ width: '1.125rem', height: '1.125rem' }} />
                            <span className="text-sm font-medium">Déconnexion</span>
                        </button>
                    </nav>
                )}
            </header>

            {/* ── Main Content ── */}
            <main style={{ paddingTop: '6.5rem', paddingBottom: '3rem', flex: 1 }}>
                {children}
            </main>

            {/* ── Modals ── */}
            {isAuthenticated && (
                <>
                    <OnboardingModal />
                    <PromptingGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
                </>
            )}

            {/* ── Footer ── */}
            <footer className="relative py-10 overflow-hidden" style={{
                background: 'var(--bg-secondary)',
                borderTop: '1px solid var(--glass-border)',
            }}>
                {/* Top glow line */}
                <div
                    className="absolute top-0 left-0 w-full"
                    style={{
                        height: '1px',
                        background: 'linear-gradient(90deg, transparent 0%, rgba(57,255,20,0.5) 50%, transparent 100%)',
                        boxShadow: '0 0 12px rgba(57,255,20,0.6)',
                    }}
                />

                {/* Bottom ambient glow */}
                <div
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 pointer-events-none"
                    style={{
                        width: '360px',
                        height: '120px',
                        background: 'rgba(57,255,20,0.07)',
                        borderRadius: '50%',
                        filter: 'blur(56px)',
                    }}
                />

                <div className="container relative z-10 flex flex-col items-center gap-4 text-center">
                    {/* Brand */}
                    <div className="flex items-center gap-2">
                        <Leaf
                            className="w-4 h-4 animate-pulse"
                            style={{ color: 'var(--primary)', filter: 'drop-shadow(0 0 6px rgba(57,255,20,0.7))' }}
                        />
                        <span
                            className="text-base font-bold text-[var(--text-primary)] tracking-wide"
                            style={{ fontFamily: 'var(--font-display)', textShadow: '0 0 10px rgba(57,255,20,0.3)' }}
                        >
                            PromptOptim
                        </span>
                    </div>

                    <p className="text-sm text-[var(--text-secondary)] max-w-xs leading-relaxed">
                        L'intelligence artificielle au service de l'écologie.
                        <span className="block mt-1 section-label">Green IT & Souveraineté des données</span>
                    </p>

                    {/* Links */}
                    <div className="neon-divider w-full max-w-xs" style={{ margin: '0.25rem 0' }} />
                    <div className="flex flex-wrap justify-center gap-6 text-xs text-[var(--text-muted)]">
                        {['Mentions Légales', 'Confidentialité', 'Contact'].map((label) => (
                            <span
                                key={label}
                                className="cursor-pointer hover:text-[var(--primary)] transition-colors"
                            >
                                {label}
                            </span>
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
