import { useState, useEffect } from 'react';
import { X, Sparkles, Leaf, Shield, ChevronRight, ChevronLeft, Check } from 'lucide-react';

const steps = [
    {
        icon: Sparkles,
        color: 'var(--primary)',
        title: 'Bienvenue sur PromptOptim',
        description: 'L\'outil qui transforme vos intentions brutes en prompts parfaits. Découvrez comment optimiser vos requêtes IA tout en mesurant votre impact.'
    },
    {
        icon: Leaf,
        color: 'var(--eco-b)',
        title: 'Réduisez votre empreinte carbone',
        description: 'Chaque mot compte. En optimisant la longueur et la structure de vos requêtes, vous économisez des tokens, et donc de l\'énergie et de l\'eau. Suivez votre Eco-Score !'
    },
    {
        icon: Shield,
        color: 'var(--accent)',
        title: 'Privilégiez la Souveraineté',
        description: 'Protégez vos données. Nous évaluons chaque modèle IA (Mistral, GPT, etc.) sur sa localisation, sa conformité RGPD et sa licence open-source.'
    },
    {
        icon: Check,
        color: 'var(--success)',
        title: 'Comment ça marche ?',
        description: '1. Saisissez ce que vous voulez faire.\n2. Choisissez le modèle cible.\n3. Obtenez un prompt précis, concis et prêt à l\'emploi !'
    }
];

const OnboardingModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        const hasSeen = localStorage.getItem('promptoptim_has_seen_tutorial');
        if (!hasSeen) {
            // Slight delay so the user sees the dashboard load first
            const timer = setTimeout(() => setIsOpen(true), 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleClose = () => {
        setIsOpen(false);
        localStorage.setItem('promptoptim_has_seen_tutorial', 'true');
    };

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            handleClose();
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    if (!isOpen) return null;

    const Step = steps[currentStep];
    const Icon = Step.icon;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
            <div className="glass-card max-w-lg w-full p-0 overflow-hidden relative" style={{ padding: 0 }}>
                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors z-10"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Header Decoration */}
                <div
                    className="h-32 w-full flex items-center justify-center relative overflow-hidden"
                    style={{ background: `linear-gradient(135deg, ${Step.color}20, transparent)` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--bg-primary)] opacity-80" />
                    <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center relative z-10"
                        style={{
                            background: `linear-gradient(135deg, ${Step.color}, ${Step.color}80)`,
                            boxShadow: `0 0 20px ${Step.color}60`
                        }}
                    >
                        <Icon className="w-8 h-8 text-[var(--bg-primary)]" />
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 pt-4 text-center">
                    <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-3">
                        {Step.title}
                    </h2>
                    <p className="text-[var(--text-secondary)] leading-relaxed whitespace-pre-line min-h-[80px]">
                        {Step.description}
                    </p>

                    {/* Navigation */}
                    <div className="mt-8 flex items-center justify-between">
                        <button
                            onClick={handlePrev}
                            disabled={currentStep === 0}
                            className={`p-2 flex items-center gap-1 text-sm font-medium transition-colors ${currentStep === 0 ? 'opacity-0 cursor-default' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Précédent
                        </button>

                        {/* Progress Dots */}
                        <div className="flex items-center gap-2">
                            {steps.map((_, index) => (
                                <div
                                    key={index}
                                    className={`h-2 rounded-full transition-all duration-300 ${index === currentStep ? 'w-6 bg-[var(--primary)]' : 'w-2 bg-[var(--glass-border)]'}`}
                                    style={index === currentStep ? { boxShadow: '0 0 8px var(--primary)' } : {}}
                                />
                            ))}
                        </div>

                        <button
                            onClick={handleNext}
                            className="btn btn-primary py-2 px-4 flex items-center gap-1 text-sm"
                            style={currentStep === steps.length - 1 ? { background: 'var(--success)' } : {}}
                        >
                            <span>{currentStep === steps.length - 1 ? 'Commencer' : 'Suivant'}</span>
                            {currentStep < steps.length - 1 && <ChevronRight className="w-4 h-4" />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OnboardingModal;
