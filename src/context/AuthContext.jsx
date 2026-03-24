import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI, setAccessToken, clearTokens } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Check for existing session on mount
    useEffect(() => {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
            // Try to restore session
            restoreSession();
        } else {
            setIsLoading(false);
        }
    }, []);

    const restoreSession = async () => {
        try {
            const refreshToken = localStorage.getItem('refresh_token');
            if (!refreshToken) {
                setIsLoading(false);
                return;
            }

            // Attempt to refresh the token
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/refresh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refresh_token: refreshToken }),
            });

            if (response.ok) {
                const data = await response.json();
                setAccessToken(data.access_token);
                localStorage.setItem('refresh_token', data.refresh_token);
                setIsAuthenticated(true);
                setUser({ authenticated: true });
            } else {
                // Refresh failed, clear tokens
                clearTokens();
                setIsAuthenticated(false);
                setUser(null);
            }
        } catch (err) {
            console.error('Session restore failed:', err);
            clearTokens();
            setIsAuthenticated(false);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    const login = useCallback(async (email, password) => {
        setError(null);
        setIsLoading(true);

        try {
            const data = await authAPI.login(email, password);

            // Store tokens
            setAccessToken(data.access_token);
            localStorage.setItem('refresh_token', data.refresh_token);

            setIsAuthenticated(true);
            setUser({ email, authenticated: true });

            return { success: true };
        } catch (err) {
            const errorMessage = err.response?.data?.detail || 'Login failed';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setIsLoading(false);
        }
    }, []);

    const register = useCallback(async (email, password) => {
        setError(null);
        setIsLoading(true);

        try {
            const data = await authAPI.register(email, password);

            // Store tokens
            setAccessToken(data.access_token);
            localStorage.setItem('refresh_token', data.refresh_token);

            setIsAuthenticated(true);
            setUser({ email, authenticated: true, emailVerified: false });

            return { success: true, needsVerification: true };
        } catch (err) {
            const errorMessage = err.response?.data?.detail || 'Registration failed';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setIsLoading(false);
        }
    }, []);

    const logout = useCallback(() => {
        clearTokens();
        setIsAuthenticated(false);
        setUser(null);
        setError(null);
    }, []);

    const forgotPassword = useCallback(async (email) => {
        setError(null);

        try {
            await authAPI.forgotPassword(email);
            return { success: true };
        } catch (err) {
            // Always return success to prevent user enumeration
            return { success: true };
        }
    }, []);

    const resetPassword = useCallback(async (token, newPassword) => {
        setError(null);

        try {
            await authAPI.resetPassword(token, newPassword);
            return { success: true };
        } catch (err) {
            const errorMessage = err.response?.data?.detail || 'Password reset failed';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        }
    }, []);

    const verifyEmail = useCallback(async (token) => {
        setError(null);

        try {
            await authAPI.verifyEmail(token);
            if (user) {
                setUser({ ...user, emailVerified: true });
            }
            return { success: true };
        } catch (err) {
            const errorMessage = err.response?.data?.detail || 'Email verification failed';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        }
    }, [user]);

    const deleteAccount = useCallback(async () => {
        setError(null);

        try {
            await authAPI.deleteAccount();
            logout();
            return { success: true };
        } catch (err) {
            const errorMessage = err.response?.data?.detail || 'Account deletion failed';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        }
    }, [logout]);

    const value = {
        user,
        isAuthenticated,
        isLoading,
        error,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
        verifyEmail,
        deleteAccount,
        clearError: () => setError(null),
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
