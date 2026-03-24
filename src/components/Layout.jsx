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
    User,
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
        <div className="bg-[var(--bg-primary)]">
            {/* Header */}
            <header className="fixed top-6 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-[95%] md:max-w-6xl z-50 glass-card border border-[var(--glass-border)] rounded-2xl animate-neon-border" style={{ padding: 0, borderBottomWidth: '2px', borderBottomColor: 'rgba(57, 255, 20, 0.35)' }}>
                <div className="container flex items-center justify-between h-16 px-6">
                    <div className="flex items-center gap-8 md:gap-[201px]">
                        {/* Logo */}
                        <Link to="/generator" className="flex items-center gap-2 group">
                            <div
                                className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center"
                                style={{ boxShadow: 'var(--neon-glow-md)' }}
                            >
                                <Leaf className="w-6 h-6 text-[var(--bg-primary)]" />
                            </div>
                            <span className="text-xl font-bold gradient-text hidden sm:block">
                                PromptOptim
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        {isAuthenticated && (
                            <nav className="hidden md:flex items-center gap-4">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`flex items-center gap-2.5 rounded-xl transition-all ${isActive(item.path)
                                            ? 'text-[var(--bg-primary)] font-bold'
                                            : 'text-[var(--text-secondary)] hover:text-[var(--primary)] hover:bg-[var(--bg-surface)]'
                                            }`}
                                        style={isActive(item.path) ? {
                                            background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                                            boxShadow: '0 0 12px rgba(57, 255, 20, 0.5), 0 0 24px rgba(57, 255, 20, 0.25)',
                                            padding: '0.6rem 1.5rem',
                                        } : {
                                            padding: '0.5rem 1.25rem',
                                        }}
                                    >
                                        <item.icon className={isActive(item.path) ? 'w-5 h-5' : 'w-4 h-4'} />
                                        <span className={isActive(item.path) ? 'text-base font-semibold' : 'text-sm font-medium'}>{item.label}</span>
                                    </Link>
                                ))}
                            </nav>
                        )}
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center gap-2 md:gap-4">
                        {isAuthenticated && (
                            <>
                                {/* Desktop Guide Button */}
                                <button
                                    onClick={() => setIsGuideOpen(true)}
                                    className="hidden md:flex items-center gap-2 px-4 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] rounded-xl transition-all"
                                >
                                    <Lightbulb className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--primary)]" />
                                    <span>Guide</span>
                                </button>

                                <button
                                    onClick={handleLogout}
                                    className="hidden md:flex items-center gap-2 px-4 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--error)] hover:bg-[var(--error)]/10 rounded-xl transition-all"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span>Déconnexion</span>
                                </button>

                                {/* Mobile Menu Toggle */}
                                <button
                                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                    className="md:hidden p-2 text-[var(--text-secondary)] hover:text-[var(--primary)]"
                                >
                                    {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isAuthenticated && mobileMenuOpen && (
                    <nav className="md:hidden border-t border-[var(--glass-border)] animate-fade-in" style={{ padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`flex items-center gap-3 rounded-xl transition-all ${isActive(item.path)
                                    ? 'text-[var(--bg-primary)] font-semibold'
                                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface)]'
                                    }`}
                                style={isActive(item.path) ? {
                                    background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                                    boxShadow: 'var(--neon-glow-sm)',
                                    padding: '0.875rem 1.25rem',
                                } : {
                                    padding: '0.875rem 1.25rem',
                                }}
                            >
                                <item.icon className="w-5 h-5" />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        ))}
                        <div style={{ height: '1px', background: 'var(--glass-border)', margin: '0.25rem 0' }} />
                        <button
                            onClick={() => { setIsGuideOpen(true); setMobileMenuOpen(false); }}
                            className="flex items-center gap-3 rounded-xl w-full text-left text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] transition-all"
                            style={{ padding: '0.875rem 1.25rem' }}
                        >
                            <Lightbulb className="w-5 h-5" />
                            <span className="font-medium">Guide & Astuces</span>
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 rounded-xl w-full text-left text-[var(--error)] hover:bg-[var(--bg-surface)] transition-all"
                            style={{ padding: '0.875rem 1.25rem' }}
                        >
                            <LogOut className="w-5 h-5" />
                            <span className="font-medium">Déconnexion</span>
                        </button>
                    </nav>
                )}
            </header>

            {/* Main Content */}
            <main style={{ paddingTop: '7rem', paddingBottom: '3rem' }}>
                {children}
            </main>

            {/* Modals placed here to be rendered globally inside the layout */}
            {isAuthenticated && (
                <>
                    <OnboardingModal />
                    <PromptingGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
                </>
            )}

            {/* Premium Neon Footer */}
            <footer className="relative mt-8 py-10 overflow-hidden backdrop-blur-xl border-t border-[var(--glass-border)] bg-[var(--bg-secondary)]/50">
                {/* Top glow line */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent opacity-50" style={{ boxShadow: '0 0 15px rgba(57,255,20,0.8)' }}></div>
                
                <div className="container relative z-10 flex flex-col items-center justify-center gap-3 text-center">
                    <div className="flex justify-center items-center gap-2 mb-1">
                        <Leaf className="w-5 h-5 text-[var(--primary)] animate-pulse" style={{ filter: 'drop-shadow(0 0 8px rgba(57, 255, 20, 0.6))' }} />
                        <span className="text-lg font-bold text-[var(--text-primary)] tracking-wide" style={{ textShadow: '0 0 10px rgba(57, 255, 20, 0.4)' }}>
                            PromptOptim
                        </span>
                    </div>
                    
                    <p className="text-sm text-[var(--text-secondary)] max-w-md mx-auto leading-relaxed">
                        L'intelligence artificielle au service de l'écologie. <br />
                        <span className="text-[var(--text-muted)] text-xs mt-2 block uppercase tracking-wider font-semibold">Green IT & Souveraineté des Données</span>
                    </p>
                    
                    {/* Subtle aesthetic links or copyright */}
                    <div className="mt-5 pt-5 border-t border-[var(--glass-border)] w-full max-w-sm flex flex-wrap justify-center gap-x-8 gap-y-3 text-xs text-[var(--text-muted)]">
                        <span className="hover:text-[var(--primary)] transition-colors cursor-pointer" style={{ textShadow: '0 0 0 rgba(57, 255, 20, 0)' }} onMouseOver={(e) => e.currentTarget.style.textShadow = '0 0 8px rgba(57, 255, 20, 0.5)'} onMouseOut={(e) => e.currentTarget.style.textShadow = '0 0 0 rgba(57, 255, 20, 0)'}>Mentions Légales</span>
                        <span className="hover:text-[var(--primary)] transition-colors cursor-pointer" style={{ textShadow: '0 0 0 rgba(57, 255, 20, 0)' }} onMouseOver={(e) => e.currentTarget.style.textShadow = '0 0 8px rgba(57, 255, 20, 0.5)'} onMouseOut={(e) => e.currentTarget.style.textShadow = '0 0 0 rgba(57, 255, 20, 0)'}>Confidentialité</span>
                        <span className="hover:text-[var(--primary)] transition-colors cursor-pointer" style={{ textShadow: '0 0 0 rgba(57, 255, 20, 0)' }} onMouseOver={(e) => e.currentTarget.style.textShadow = '0 0 8px rgba(57, 255, 20, 0.5)'} onMouseOut={(e) => e.currentTarget.style.textShadow = '0 0 0 rgba(57, 255, 20, 0)'}>Contact</span>
                    </div>
                </div>
                
                {/* Background glow flares */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-[400px] h-[150px] bg-[var(--primary)]/10 rounded-[100%] blur-[60px] pointer-events-none"></div>
            </footer>
        </div>
    );
};

export default Layout;
