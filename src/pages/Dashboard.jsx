import { useState, useEffect } from 'react';
import { promptAPI } from '../services/api';
import Layout from '../components/Layout';
import {
    BarChart3,
    Loader2,
    AlertCircle,
    Zap,
    Leaf,
    TrendingUp,
    PieChart,
    Smartphone,
    Car,
    Lightbulb,
    Globe
} from 'lucide-react';
import {
    PieChart as RechartsPie,
    Pie,
    Cell,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid
} from 'recharts';

const StatCard = ({ icon: Icon, label, value, unit, color }) => (
    <div className="glass-card" style={{ padding: '0.5rem 1rem 1rem 1rem' }}>
        <div className="flex items-center gap-2" style={{ marginBottom: '0.75rem' }}>
            <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${color}20` }}
            >
                <Icon className="w-4 h-4" style={{ color, filter: `drop-shadow(0 0 4px ${color}80)` }} />
            </div>
            <span className="text-sm text-[var(--text-secondary)]">{label}</span>
        </div>
        <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold" style={{ color: color, textShadow: `0 0 10px ${color}40` }}>
                {value}
            </span>
            {unit && <span className="text-sm text-[var(--text-muted)]">{unit}</span>}
        </div>
    </div>
);

const MODEL_COLORS = {
    mistral_2: '#ff7e00',
    gpt_5: '#74aa9c',
    claude_opus: '#cc785c',
    gemini_3_pro: '#4285f4',
    midjourney_v6: '#9c5cd4',
};

const MODEL_NAMES = {
    mistral_2: 'Mistral',
    gpt_5: 'GPT-5',
    claude_opus: 'Claude',
    gemini_3_pro: 'Gemini',
    midjourney_v6: 'Midjourney',
};

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await promptAPI.getStats();
                setStats(data);
            } catch (err) {
                if (err.response?.status === 403) {
                    setError('Veuillez vérifier votre email pour accéder aux statistiques.');
                } else {
                    setError('Impossible de charger les statistiques.');
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, []);

    // Prepare chart data
    const prepareModelUsageData = () => {
        if (!stats?.model_usage) return [];
        return Object.entries(stats.model_usage).map(([model, count]) => ({
            name: MODEL_NAMES[model] || model,
            value: count,
            color: MODEL_COLORS[model] || '#666',
        }));
    };

    const modelUsageData = prepareModelUsageData();

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="glass-card px-3 py-2 text-sm" style={{ boxShadow: 'var(--neon-glow-sm)' }}>
                    <p className="text-[var(--text-primary)]">{payload[0].name}</p>
                    <p className="text-[var(--text-secondary)]">{payload[0].value} prompts</p>
                </div>
            );
        }
        return null;
    };

    return (
        <Layout>
            <div className="container">
                {/* Header */}
                <div className="flex items-center gap-4" style={{ marginBottom: '1.25rem' }}>
                    <div
                        className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center"
                        style={{ boxShadow: 'var(--neon-glow-md)' }}
                    >
                        <BarChart3 className="w-7 h-7 text-[var(--bg-primary)]" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1">Dashboard</h1>
                        <p className="text-[var(--text-secondary)]">Vue d'ensemble de votre impact</p>
                    </div>
                </div>

                {/* Content */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-16">
                        <Loader2 className="w-10 h-10 animate-spin mb-4" style={{ color: 'var(--primary)', filter: 'drop-shadow(0 0 8px rgba(57, 255, 20, 0.5))' }} />
                        <p className="text-[var(--text-secondary)]">Chargement des statistiques...</p>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-16 h-16 rounded-full bg-[var(--error)]/20 flex items-center justify-center mb-4">
                            <AlertCircle className="w-8 h-8 text-[var(--error)]" />
                        </div>
                        <p className="text-[var(--text-secondary)]">{error}</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }} className="animate-fade-in">
                        {/* Stats Grid */}
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3" style={{ gap: '2rem' }}>
                            <StatCard
                                icon={Zap}
                                label="Prompts générés"
                                value={stats.total_prompts || 0}
                                color="var(--primary)"
                            />
                            <StatCard
                                icon={TrendingUp}
                                label="Tokens économisés"
                                value={(stats.total_tokens_saved || 0).toLocaleString()}
                                color="var(--accent)"
                            />
                            <StatCard
                                icon={Leaf}
                                label="CO₂ économisé"
                                value={(stats.total_co2_saved || 0).toFixed(4)}
                                unit="g"
                                color="var(--eco-a)"
                            />
                        </div>

                        {/* Charts */}
                        <div className="grid lg:grid-cols-2" style={{ gap: '2.5rem', marginTop: '0.5rem' }}>
                            {/* Model Usage Pie Chart */}
                            <div className="glass-card p-4">
                                <div className="flex items-center gap-3 mb-4" style={{ marginTop: '0.5rem', marginLeft: '0.5rem' }}>
                                    <PieChart className="w-5 h-5" style={{ color: 'var(--primary)', filter: 'drop-shadow(0 0 4px rgba(57, 255, 20, 0.4))' }} />
                                    <h3 className="font-semibold text-[var(--text-primary)]">
                                        Répartition par modèle
                                    </h3>
                                </div>

                                {modelUsageData.length > 0 ? (
                                    <div className="h-64">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <RechartsPie>
                                                <Pie
                                                    data={modelUsageData}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={60}
                                                    outerRadius={80}
                                                    paddingAngle={5}
                                                    dataKey="value"
                                                >
                                                    {modelUsageData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <Tooltip content={<CustomTooltip />} />
                                            </RechartsPie>
                                        </ResponsiveContainer>

                                        {/* Legend */}
                                        <div className="flex flex-wrap justify-center gap-4 mt-4">
                                            {modelUsageData.map((item, index) => (
                                                <div key={index} className="flex items-center gap-2 text-sm">
                                                    <div
                                                        className="w-3 h-3 rounded-full"
                                                        style={{ backgroundColor: item.color, boxShadow: `0 0 6px ${item.color}60` }}
                                                    />
                                                    <span className="text-[var(--text-secondary)]">{item.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-64 flex items-center justify-center text-[var(--text-muted)]">
                                        Aucune donnée disponible
                                    </div>
                                )}
                            </div>

                            {/* Bar Chart */}
                            <div className="glass-card p-4">
                                <div className="flex items-center gap-3 mb-4" style={{ marginTop: '0.5rem', marginLeft: '0.5rem' }}>
                                    <BarChart3 className="w-5 h-5" style={{ color: 'var(--primary)', filter: 'drop-shadow(0 0 4px rgba(57, 255, 20, 0.4))' }} />
                                    <h3 className="font-semibold text-[var(--text-primary)]">
                                        Utilisation par modèle
                                    </h3>
                                </div>

                                {modelUsageData.length > 0 ? (
                                    <div className="h-64">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={modelUsageData} layout="vertical">
                                                <CartesianGrid
                                                    strokeDasharray="3 3"
                                                    stroke="var(--glass-border)"
                                                    horizontal={false}
                                                />
                                                <XAxis
                                                    type="number"
                                                    tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                                                />
                                                <YAxis
                                                    dataKey="name"
                                                    type="category"
                                                    width={80}
                                                    tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
                                                />
                                                <Tooltip content={<CustomTooltip />} />
                                                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                                    {modelUsageData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                ) : (
                                    <div className="h-64 flex items-center justify-center text-[var(--text-muted)]">
                                        Aucune donnée disponible
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Impact Summary */}
                        <div className="glass-card p-4">
                            <div className="flex items-center gap-2 mb-6" style={{ marginLeft: '0.5rem' }}>
                                <Globe className="w-5 h-5" style={{ color: 'var(--primary)', filter: 'drop-shadow(0 0 4px rgba(57, 255, 20, 0.4))' }} />
                                <h3 className="font-semibold text-[var(--text-primary)]">
                                    Votre Impact Environnemental
                                </h3>
                            </div>
                            <div className="grid sm:grid-cols-3 gap-6 text-center">
                                <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--glass-border)]">
                                    <Smartphone className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--primary)', filter: 'drop-shadow(0 0 6px rgba(57, 255, 20, 0.4))' }} />
                                    <p className="text-lg font-bold" style={{ color: 'var(--primary)', textShadow: '0 0 8px rgba(57, 255, 20, 0.3)' }}>
                                        {((stats.total_co2_saved || 0) / 8.3 * 1000).toFixed(2)}
                                    </p>
                                    <p className="text-xs text-[var(--text-muted)]">recharges smartphone équivalentes</p>
                                </div>
                                <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--glass-border)]">
                                    <Car className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--accent)', filter: 'drop-shadow(0 0 6px rgba(0, 255, 135, 0.4))' }} />
                                    <p className="text-lg font-bold" style={{ color: 'var(--accent)', textShadow: '0 0 8px rgba(0, 255, 135, 0.3)' }}>
                                        {((stats.total_co2_saved || 0) / 0.05).toFixed(2)}
                                    </p>
                                    <p className="text-xs text-[var(--text-muted)]">mètres en voiture électrique</p>
                                </div>
                                <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--glass-border)]">
                                    <Lightbulb className="w-8 h-8 mx-auto mb-2" style={{ color: '#ffdd00', filter: 'drop-shadow(0 0 6px rgba(255, 221, 0, 0.4))' }} />
                                    <p className="text-lg font-bold" style={{ color: '#ffdd00', textShadow: '0 0 8px rgba(255, 221, 0, 0.3)' }}>
                                        {((stats.total_co2_saved || 0) / 0.005).toFixed(2)}
                                    </p>
                                    <p className="text-xs text-[var(--text-muted)]">heures d'éclairage LED</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Dashboard;
