import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Leaf,
    Zap,
    History,
    BarChart3,
    LogOut,
    Menu,
    X
} from 'lucide-react';
import { useState } from 'react';
import OnboardingModal from './OnboardingModal';

const Layout = ({ children }) => {
    const { logout, isAuthenticated } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
            <main style={{ paddingTop: '6.5rem', paddingBottom: '5rem', flex: 1 }}>
                {children}
            </main>

            {/* ── Modals ── */}
            {isAuthenticated && (
                <OnboardingModal />
            )}

            {/* ── Footer ── */}
            <footer style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--glass-border)', padding: '1.25rem 0', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '1px', background: 'linear-gradient(90deg, transparent 0%, rgba(57,255,20,0.5) 50%, transparent 100%)' }} />
                <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Leaf style={{ width: '0.875rem', height: '0.875rem', color: 'var(--primary)' }} />
                        <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', fontFamily: 'var(--font-display)' }}>PromptOptim</span>
                        <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>— Green IT & Souveraineté</span>
                    </div>
                    <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.75rem' }}>
                        {[
                            { label: 'Mentions Légales', path: '/mentions-legales' },
                            { label: 'Confidentialité', path: '/confidentialite' },
                            { label: 'Contact', path: '/contact' },
                        ].map(({ label, path }) => (
                            <Link key={path} to={path} className="hover:text-[var(--primary)] transition-colors" style={{ color: 'var(--text-muted)' }}>
                                {label}
                            </Link>
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
