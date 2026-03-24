import axios from 'axios';

// API Base URL from environment
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Create Axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Token management (in-memory for access token)
let accessToken = null;

export const setAccessToken = (token) => {
    accessToken = token;
};

export const getAccessToken = () => accessToken;

export const clearTokens = () => {
    accessToken = null;
    localStorage.removeItem('refresh_token');
};

// Request Interceptor: Attach Access Token
api.interceptors.request.use(
    (config) => {
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 and refresh token
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If 401 and not already retrying
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refresh_token');

                if (!refreshToken) {
                    // No refresh token, force logout
                    clearTokens();
                    window.location.href = '/login';
                    return Promise.reject(error);
                }

                // Call refresh endpoint
                const response = await axios.post(`${API_BASE_URL}/refresh`, {
                    refresh_token: refreshToken,
                });

                // Save new tokens
                const { access_token, refresh_token } = response.data;
                setAccessToken(access_token);
                localStorage.setItem('refresh_token', refresh_token);

                // Retry original request with new token
                originalRequest.headers.Authorization = `Bearer ${access_token}`;
                return api(originalRequest);
            } catch (refreshError) {
                // Refresh failed, force logout
                clearTokens();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

// ================================
// AUTH ENDPOINTS
// ================================

export const authAPI = {
    // Register new user
    register: async (email, password) => {
        const response = await api.post('/register', { email, password });
        return response.data;
    },

    // Login (OAuth2 requires form-urlencoded)
    login: async (email, password) => {
        const formData = new URLSearchParams();
        formData.append('username', email);
        formData.append('password', password);

        const response = await axios.post(`${API_BASE_URL}/token`, formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        return response.data;
    },

    // Verify email
    verifyEmail: async (token) => {
        const response = await api.post('/verify-email', { token });
        return response.data;
    },

    // Forgot password
    forgotPassword: async (email) => {
        const response = await api.post('/forgot-password', { email });
        return response.data;
    },

    // Reset password
    resetPassword: async (token, newPassword) => {
        const response = await api.post('/reset-password', {
            token,
            new_password: newPassword,
        });
        return response.data;
    },

    // Delete account
    deleteAccount: async () => {
        const response = await api.delete('/users/me');
        return response.data;
    },
};

// ================================
// PROMPT ENDPOINTS
// ================================

export const promptAPI = {
    // Generate optimized prompt
    generate: async (inputText, targetModel = 'mistral_2') => {
        const response = await api.post('/api/generate', {
            input_text: inputText,
            target_model: targetModel,
        });
        return response.data;
    },

    // Get history
    getHistory: async (skip = 0, limit = 100) => {
        const response = await api.get('/api/history', {
            params: { skip, limit },
        });
        return response.data;
    },

    // Get stats
    getStats: async () => {
        const response = await api.get('/api/stats');
        return response.data;
    },
};

// ================================
// HEALTH CHECK
// ================================

export const healthAPI = {
    check: async () => {
        const response = await api.get('/health');
        return response.data;
    },
};

export default api;
