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
    Globe,
    Droplets,
    Activity
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

// Smart number formatting
const formatValue = (num, decimals = 4) => {
    if (num === null || num === undefined) return '0';
    if (num === 0) return '0';
    if (Math.abs(num) >= 1) return num.toLocaleString('fr-FR', { maximumFractionDigits: 2 });
    if (Math.abs(num) < 0.0001) return '< 0.0001';
    return num.toFixed(decimals).replace(/\.?0+$/, '') || '0';
};

const StatCard = ({ icon: Icon, label, value, unit, color, subtitle }) => (
    <div className="glass-card">
        <div className="flex items-center gap-2 mb-3">
            <div
                className="square-icon"
                style={{ backgroundColor: `${color}15` }}
            >
                <Icon className="w-5 h-5" style={{ color, filter: `drop-shadow(0 0 4px ${color}80)` }} />
            </div>
            <span className="text-sm text-[var(--text-secondary)]">{label}</span>
        </div>
        <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold" style={{ color, textShadow: `0 0 10px ${color}40` }}>
                {value}
            </span>
            {unit && <span className="text-sm text-[var(--text-muted)]">{unit}</span>}
        </div>
        {subtitle && (
            <p className="text-xs text-[var(--text-muted)] mt-1">{subtitle}</p>
        )}
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
        return Object.entries(stats.model_usage)
            .filter(([, count]) => count > 0)
            .map(([model, count]) => ({
                name: MODEL_NAMES[model] || model,
                value: count,
                color: MODEL_COLORS[model] || '#666',
            }));
    };

    const modelUsageData = prepareModelUsageData();
    const totalPrompts = stats?.total_prompts || 0;

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const percentage = totalPrompts > 0 ? ((payload[0].value / totalPrompts) * 100).toFixed(0) : 0;
            return (
                <div className="glass-card px-3 py-2 text-sm" style={{ boxShadow: 'var(--neon-glow-sm)' }}>
                    <p className="text-[var(--text-primary)] font-medium">{payload[0].name}</p>
                    <p className="text-[var(--text-secondary)]">{payload[0].value} prompts ({percentage}%)</p>
                </div>
            );
        }
        return null;
    };

    // Calculate equivalences from total CO2
    const co2 = stats?.total_co2_saved || 0;
    const equivalences = {
        smartphone: co2 > 0 ? (co2 / 8.3 * 1000) : 0,
        car: co2 > 0 ? (co2 / 0.05) : 0,
        led: co2 > 0 ? (co2 / 0.005) : 0,
    };

    return (
        <Layout>
            <div className="container">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <div
                        className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center flex-shrink-0"
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
                    <div className="flex flex-col gap-8 animate-fade-in">
                        {/* Stats Grid */}
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            <StatCard
                                icon={Zap}
                                label="Prompts générés"
                                value={totalPrompts.toLocaleString()}
                                color="var(--primary)"
                            />
                            <StatCard
                                icon={TrendingUp}
                                label="Tokens économisés"
                                value={(stats?.total_tokens_saved || 0).toLocaleString()}
                                color="var(--accent)"
                            />
                            <StatCard
                                icon={Leaf}
                                label="CO₂ économisé"
                                value={formatValue(co2)}
                                unit="g"
                                color="var(--eco-a)"
                                subtitle={co2 > 0 ? `≈ ${(co2 / 1000).toFixed(6)} kg` : null}
                            />
                            <StatCard
                                icon={Activity}
                                label="Modèles utilisés"
                                value={modelUsageData.length}
                                unit={`/ ${Object.keys(MODEL_NAMES).length}`}
                                color="#60a5fa"
                            />
                        </div>

                        {/* Charts Row */}
                        <div className="grid lg:grid-cols-2 gap-6">
                            {/* Model Usage Pie Chart */}
                            <div className="glass-card">
                                <div className="flex items-center gap-3 mb-4">
                                    <PieChart className="w-5 h-5" style={{ color: 'var(--primary)', filter: 'drop-shadow(0 0 4px rgba(57, 255, 20, 0.4))' }} />
                                    <h3 className="font-semibold text-[var(--text-primary)]">
                                        Répartition par modèle
                                    </h3>
                                </div>

                                {modelUsageData.length > 0 ? (
                                    <div>
                                        <div className="h-56">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <RechartsPie>
                                                    <Pie
                                                        data={modelUsageData}
                                                        cx="50%"
                                                        cy="50%"
                                                        innerRadius={55}
                                                        outerRadius={80}
                                                        paddingAngle={4}
                                                        dataKey="value"
                                                        strokeWidth={0}
                                                    >
                                                        {modelUsageData.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip content={<CustomTooltip />} />
                                                </RechartsPie>
                                            </ResponsiveContainer>
                                        </div>

                                        {/* Legend with percentages */}
                                        <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 mt-3">
                                            {modelUsageData.map((item, index) => (
                                                <div key={index} className="flex items-center gap-2 text-sm">
                                                    <div
                                                        className="w-3 h-3 rounded-full flex-shrink-0"
                                                        style={{ backgroundColor: item.color, boxShadow: `0 0 6px ${item.color}60` }}
                                                    />
                                                    <span className="text-[var(--text-secondary)]">{item.name}</span>
                                                    <span className="text-[var(--text-muted)] text-xs">
                                                        ({totalPrompts > 0 ? ((item.value / totalPrompts) * 100).toFixed(0) : 0}%)
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-56 flex flex-col items-center justify-center text-[var(--text-muted)]">
                                        <PieChart className="w-10 h-10 mb-2 opacity-20" />
                                        <p className="text-sm">Aucune donnée disponible</p>
                                        <p className="text-xs mt-1">Générez votre premier prompt !</p>
                                    </div>
                                )}
                            </div>

                            {/* Bar Chart */}
                            <div className="glass-card">
                                <div className="flex items-center gap-3 mb-4">
                                    <BarChart3 className="w-5 h-5" style={{ color: 'var(--primary)', filter: 'drop-shadow(0 0 4px rgba(57, 255, 20, 0.4))' }} />
                                    <h3 className="font-semibold text-[var(--text-primary)]">
                                        Utilisation par modèle
                                    </h3>
                                </div>

                                {modelUsageData.length > 0 ? (
                                    <div className="h-56">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={modelUsageData} layout="vertical" margin={{ left: 10 }}>
                                                <CartesianGrid
                                                    strokeDasharray="3 3"
                                                    stroke="var(--glass-border)"
                                                    horizontal={false}
                                                />
                                                <XAxis
                                                    type="number"
                                                    tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                                                    allowDecimals={false}
                                                />
                                                <YAxis
                                                    dataKey="name"
                                                    type="category"
                                                    width={80}
                                                    tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
                                                />
                                                <Tooltip content={<CustomTooltip />} />
                                                <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={28}>
                                                    {modelUsageData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                ) : (
                                    <div className="h-56 flex flex-col items-center justify-center text-[var(--text-muted)]">
                                        <BarChart3 className="w-10 h-10 mb-2 opacity-20" />
                                        <p className="text-sm">Aucune donnée disponible</p>
                                        <p className="text-xs mt-1">Générez votre premier prompt !</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Impact Summary */}
                        <div className="glass-card">
                            <div className="flex items-center gap-2 mb-5">
                                <Globe className="w-5 h-5" style={{ color: 'var(--primary)', filter: 'drop-shadow(0 0 4px rgba(57, 255, 20, 0.4))' }} />
                                <h3 className="font-semibold text-[var(--text-primary)]">
                                    Votre Impact Environnemental
                                </h3>
                            </div>

                            {totalPrompts > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="p-5 lg:p-6 rounded-xl bg-[var(--bg-secondary)] border border-[var(--glass-border)] text-center">
                                        <Smartphone className="w-8 h-8 mx-auto mb-3" style={{ color: 'var(--primary)', filter: 'drop-shadow(0 0 6px rgba(57, 255, 20, 0.4))' }} />
                                        <p className="text-2xl font-bold" style={{ color: 'var(--primary)', textShadow: '0 0 8px rgba(57, 255, 20, 0.3)' }}>
                                            {formatValue(equivalences.smartphone, 2)}
                                        </p>
                                        <p className="text-xs text-[var(--text-muted)] mt-1">recharges smartphone</p>
                                    </div>
                                    <div className="p-5 lg:p-6 rounded-xl bg-[var(--bg-secondary)] border border-[var(--glass-border)] text-center">
                                        <Car className="w-8 h-8 mx-auto mb-3" style={{ color: 'var(--accent)', filter: 'drop-shadow(0 0 6px rgba(0, 255, 135, 0.4))' }} />
                                        <p className="text-2xl font-bold" style={{ color: 'var(--accent)', textShadow: '0 0 8px rgba(0, 255, 135, 0.3)' }}>
                                            {formatValue(equivalences.car, 2)}
                                        </p>
                                        <p className="text-xs text-[var(--text-muted)] mt-1">mètres en voiture électrique</p>
                                    </div>
                                    <div className="p-5 lg:p-6 rounded-xl bg-[var(--bg-secondary)] border border-[var(--glass-border)] text-center">
                                        <Lightbulb className="w-8 h-8 mx-auto mb-3" style={{ color: '#ffdd00', filter: 'drop-shadow(0 0 6px rgba(255, 221, 0, 0.4))' }} />
                                        <p className="text-2xl font-bold" style={{ color: '#ffdd00', textShadow: '0 0 8px rgba(255, 221, 0, 0.3)' }}>
                                            {formatValue(equivalences.led, 2)}
                                        </p>
                                        <p className="text-xs text-[var(--text-muted)] mt-1">heures d'éclairage LED</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <Globe className="w-12 h-12 mx-auto mb-3 opacity-20 text-[var(--text-muted)]" />
                                    <p className="text-sm text-[var(--text-muted)]">
                                        Vos équivalences environnementales apparaîtront ici
                                    </p>
                                    <p className="text-xs text-[var(--text-muted)] mt-1">
                                        Chaque prompt optimisé contribue à réduire votre empreinte carbone
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Dashboard;
