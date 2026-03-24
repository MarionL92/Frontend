import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DarkVeil from './components/DarkVeil';
import { Loader2 } from 'lucide-react';

// Lazy-loaded Pages (code splitting for smaller initial bundle)
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const VerifyEmail = lazy(() => import('./pages/VerifyEmail'));
const Generator = lazy(() => import('./pages/Generator'));
const History = lazy(() => import('./pages/History'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

// Neon loading spinner fallback
const PageLoader = () => (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
        {/* Decorative background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[var(--primary)]/10 rounded-full blur-[80px]" />
        
        <div className="glass-card flex flex-col items-center justify-center relative z-10 animate-pulse-glow" style={{ padding: '2.5rem 3rem' }}>
            <div className="relative flex items-center justify-center mb-5 w-16 h-16">
                <div className="absolute inset-0 rounded-full border-t-2 border-[var(--primary)] animate-spin" style={{ filter: 'drop-shadow(0 0 8px rgba(57, 255, 20, 0.5))' }}></div>
                <div className="absolute inset-1.5 rounded-full border-r-2 border-[var(--accent)] animate-spin" style={{ animationDirection: 'reverse', filter: 'drop-shadow(0 0 8px rgba(0, 255, 135, 0.4))', animationDuration: '1.5s' }}></div>
                <Loader2 className="w-8 h-8 text-[var(--primary)] animate-pulse" />
            </div>
            <h3 className="text-lg font-bold gradient-text mb-1 tracking-wide">PromptOptim</h3>
            <p className="text-xs text-[var(--text-secondary)] font-medium uppercase tracking-widest mt-1">Chargement...</p>
        </div>
    </div>
);

function App() {
  return (
    <div className="relative min-h-screen z-0">
      <div className="fixed inset-0 z-[-1] pointer-events-none">
          <DarkVeil hueShift={120} noiseIntensity={0.03} scanlineIntensity={0.2} speed={0.2} warpAmount={0.04} />
      </div>
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verify-email" element={<VerifyEmail />} />

            {/* Protected Routes */}
            <Route
              path="/generator"
              element={
                <ProtectedRoute>
                  <Generator />
                </ProtectedRoute>
              }
            />
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <History />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Default Redirect */}
            <Route path="/" element={<Navigate to="/generator" replace />} />
            <Route path="*" element={<Navigate to="/generator" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
    </div>
  );
}

export default App;

