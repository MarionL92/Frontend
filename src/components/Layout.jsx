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
    User
} from 'lucide-react';
import { useState } from 'react';

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
        <div className="bg-[var(--bg-primary)]">
            {/* Header */}
            <header className="fixed top-6 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-[95%] md:max-w-6xl z-50 glass-card border border-[var(--glass-border)] rounded-2xl animate-neon-border">
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
                            <nav className="hidden md:flex items-center gap-6">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${isActive(item.path)
                                            ? 'text-[var(--bg-primary)] font-semibold'
                                            : 'text-[var(--text-secondary)] hover:text-[var(--primary)] hover:bg-[var(--bg-surface)]'
                                            }`}
                                        style={isActive(item.path) ? {
                                            background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                                            boxShadow: 'var(--neon-glow-sm)'
                                        } : {}}
                                    >
                                        <item.icon className="w-4 h-4" />
                                        <span className="text-sm font-medium">{item.label}</span>
                                    </Link>
                                ))}
                            </nav>
                        )}
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center gap-2">
                        {isAuthenticated && (
                            <>
                                <button
                                    onClick={handleLogout}
                                    className="hidden md:flex items-center gap-2 px-4 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--error)] transition-colors"
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
                    <nav className="md:hidden border-t border-[var(--glass-border)] p-4 space-y-2 animate-fade-in">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive(item.path)
                                    ? 'text-[var(--bg-primary)] font-semibold'
                                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface)]'
                                    }`}
                                style={isActive(item.path) ? {
                                    background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                                    boxShadow: 'var(--neon-glow-sm)'
                                } : {}}
                            >
                                <item.icon className="w-5 h-5" />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        ))}
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-left text-[var(--error)] hover:bg-[var(--bg-surface)] transition-all"
                        >
                            <LogOut className="w-5 h-5" />
                            <span className="font-medium">Déconnexion</span>
                        </button>
                    </nav>
                )}
            </header>

            {/* Main Content */}
            <main style={{ paddingTop: '8rem', marginBottom: '2rem' }}>
                {children}
            </main>

            {/* Footer */}
            <footer className="border-t border-[var(--glass-border)] py-3">
                <div className="container text-center">
                    <p className="text-sm text-[var(--text-muted)]">
                        <span style={{ color: 'var(--primary)', textShadow: '0 0 8px rgba(57, 255, 20, 0.3)' }}>PromptOptim</span> — Green IT & Souveraineté des Données
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
