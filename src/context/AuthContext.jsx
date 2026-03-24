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

            // V5: /auth/refresh
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/auth/refresh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refresh_token: refreshToken }),
            });

            if (response.ok) {
                const data = await response.json();
                setAccessToken(data.access_token);
                localStorage.setItem('refresh_token', data.refresh_token);
                setIsAuthenticated(true);

                // Fetch user info with the new token
                try {
                    const meResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/auth/me`, {
                        headers: { 'Authorization': `Bearer ${data.access_token}` },
                    });
                    if (meResponse.ok) {
                        const userData = await meResponse.json();
                        setUser({ email: userData.email, id: userData.id, authenticated: true });
                    } else {
                        setUser({ authenticated: true });
                    }
                } catch {
                    setUser({ authenticated: true });
                }
            } else {
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
            // V5: JSON login with email field, returns user object
            const data = await authAPI.login(email, password);

            // Store tokens
            setAccessToken(data.access_token);
            localStorage.setItem('refresh_token', data.refresh_token);

            setIsAuthenticated(true);
            setUser({
                email: data.user?.email || email,
                id: data.user?.id,
                authenticated: true,
            });

            return { success: true };
        } catch (err) {
            const status = err.response?.status;
            const errorMessage = err.response?.data?.detail || 'Login failed';

            // V5: 403 = email not verified
            if (status === 403) {
                setError('Veuillez vérifier votre email avant de vous connecter.');
                return { success: false, error: 'Email not verified', emailNotVerified: true };
            }

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
            // V5: register returns just a message, no tokens
            // User must verify email before logging in
            await authAPI.register(email, password);

            return { success: true, needsVerification: true };
        } catch (err) {
            const errorMessage = err.response?.data?.detail || 'Registration failed';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setIsLoading(false);
        }
    }, []);

    const logout = useCallback(async () => {
        // V5: call backend to invalidate session
        try {
            await authAPI.logout();
        } catch {
            // Logout even if backend call fails
        }
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
        } catch {
            // Always return success to prevent user enumeration
            return { success: true };
        }
    }, []);

    // V5: resetPassword now takes access_token + refresh_token from URL fragment
    const resetPassword = useCallback(async (accessTokenParam, refreshTokenParam, newPassword) => {
        setError(null);

        try {
            await authAPI.resetPassword(accessTokenParam, refreshTokenParam, newPassword);
            return { success: true };
        } catch (err) {
            const errorMessage = err.response?.data?.detail || 'Password reset failed';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        }
    }, []);

    const deleteAccount = useCallback(async () => {
        setError(null);

        try {
            await authAPI.deleteAccount();
            await logout();
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
