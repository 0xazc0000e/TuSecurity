import React, { createContext, useContext, useReducer, useEffect, useMemo } from 'react';

// === CONSTANTS & CONFIGURATION ===
const EVENTS = {
    BASH_COMMAND_EXECUTED: 'BASH_COMMAND_EXECUTED',
    TASK_COMPLETED: 'TASK_COMPLETED',
    TASK_FAILED: 'TASK_FAILED',
    HINT_USED: 'HINT_USED',
    GUI_ACTION_CLICKED: 'GUI_ACTION_CLICKED',
    PATH_ERROR: 'PATH_ERROR',
    SYNTAX_ERROR: 'SYNTAX_ERROR',
    CONCEPT_CONFUSION: 'CONCEPT_CONFUSION_DETECTED',
    ARTICLE_OPENED: 'ARTICLE_OPENED',
    ARTICLE_COMPLETED: 'ARTICLE_COMPLETED',
    VIDEO_WATCHED: 'VIDEO_WATCHED',
    QUIZ_ATTEMPTED: 'QUIZ_ATTEMPTED',
    REFLECTION_ANSWERED: 'REFLECTION_ANSWERED',
    NEWS_READ: 'NEWS_READ',
    THREAT_VIEWED: 'THREAT_VIEWED'
};

const INITIAL_STATE = {
    // 1. Cognitive Map (The 3-Layer Onion)
    // Structure: { [domain]: { conceptual: 0-100, operational: 0-100, visual: 0-100 } }
    cognitiveLayers: {
        os: { conceptual: 10, operational: 0, visual: 0 },
        network: { conceptual: 0, operational: 0, visual: 0 },
        crypto: { conceptual: 0, operational: 0, visual: 0 },
        web: { conceptual: 0, operational: 0, visual: 0 }
    },

    // 2. Skill Graph Status
    // Tracks specific unlockable nodes based on rules
    skillGraph: {
        // Node Status: 'locked' | 'unlocked' | 'in-progress' | 'mastered'
        bash_basics: 'in-progress',
        network_basics: 'locked',
        packet_analysis: 'locked', // Requires Bash >= L2 && Network >= L2
        crypto_basics: 'locked',
        system_hardening: 'locked'
    },

    // 3. Ethical Compass
    // Decays weekly. Scope: -100 (Black Hat) to +100 (White Hat)
    ethicalTendency: {
        score: 0,
        lastDecay: new Date().toISOString(), // For weekly decay logic
        tendencyLabel: 'Neutral' // 'Defensive' | 'Offensive' | 'Neutral'
    },

    // 4. Learning Journey (The Feed)
    // List of rich event objects
    journey: [],

    // 5. Recommendations
    // Derived from weaknesses
    recommendations: [],

    // 6. User Preferences & Meta
    userMeta: {
        focusArea: 'defense', // 'defense' | 'offense' | 'forensics'
        learningStyle: 'balanced' // 'visual' | 'kinesthetic' | 'reading'
    }
};

const AnalyticsContext = createContext();

export const useAnalytics = () => {
    const context = useContext(AnalyticsContext);
    if (!context) throw new Error('useAnalytics must be used within AnalyticsProvider');
    return context;
};

// === RULES ENGINE ===
// Centralized logic for unlocking skills and generating insights
const runRulesEngine = (state) => {
    const newState = { ...state };
    const { cognitiveLayers } = state;

    // RULE 1: Network Basics unlock
    if (cognitiveLayers.os.operational >= 20) {
        if (newState.skillGraph.network_basics === 'locked') {
            newState.skillGraph.network_basics = 'unlocked';
            addJourneyCard(newState, 'milestone', 'مسار جديد متاح', 'فتح مسار أساسيات الشبكات بعد إثبات مهاراتك في النظام.');
        }
    }

    // RULE 2: Packet Analysis (The Complex One)
    // Bash L2 (~40 operational) && Network L2 (~40 conceptual)
    if (cognitiveLayers.os.operational >= 40 && cognitiveLayers.network.conceptual >= 40) {
        if (newState.skillGraph.packet_analysis === 'locked') {
            newState.skillGraph.packet_analysis = 'unlocked';
            addJourneyCard(newState, 'milestone', 'مسار متقدم متاح', 'تحليل الحزم متاح الآن لأنك تملك الأساس الشبكي والقدرة على التحكم بالنظام.');
        }
    }

    return newState;
};

// Helper to add journey cards safely
const addJourneyCard = (state, type, title, insight, metadata = {}) => {
    const card = {
        id: Date.now() + Math.random(),
        timestamp: new Date().toISOString(),
        type, // 'achievement' | 'struggle' | 'reflection' | 'milestone' | 'info'
        title,
        insight,
        ...metadata
    };
    state.journey = [card, ...state.journey].slice(0, 100); // Keep last 100
};

// === REDUCER ===
const analyticsReducer = (state, action) => {
    const { type, payload } = action;
    let newState = { ...state };

    switch (type) {
        // --- SIMULATOR EVENTS ---
        case EVENTS.BASH_COMMAND_EXECUTED: {
            const { domain = 'os', command, success } = payload;

            // Operational Layer Boost
            if (success) {
                const currentOp = newState.cognitiveLayers[domain].operational;
                const boost = command === 'cd' || command === 'ls' ? 0.5 : 2; // Harder commands give more

                newState.cognitiveLayers = {
                    ...newState.cognitiveLayers,
                    [domain]: {
                        ...newState.cognitiveLayers[domain],
                        operational: Math.min(100, currentOp + boost)
                    }
                };
            }

            // Ethical Shift (Micro-transactions)
            // e.g., 'rm -rf' -> Aggressive, 'chmod +x' -> risky but neutral, 'nmap' -> Offensive
            let ethicalShift = 0;
            if (['nmap', 'hydra', 'sqlmap'].includes(command)) ethicalShift = -1;
            if (['ufw', 'iptables', 'chown'].includes(command)) ethicalShift = 1;

            if (ethicalShift !== 0) {
                const currentScore = newState.ethicalTendency.score;
                newState.ethicalTendency = {
                    ...newState.ethicalTendency,
                    score: Math.max(-100, Math.min(100, currentScore + ethicalShift))
                };
            }
            break;
        }

        case EVENTS.GUI_ACTION_CLICKED: {
            const { domain = 'os' } = payload;
            // Visual Layer Boost
            const currentVis = newState.cognitiveLayers[domain].visual;
            newState.cognitiveLayers = {
                ...newState.cognitiveLayers,
                [domain]: {
                    ...newState.cognitiveLayers[domain],
                    visual: Math.min(100, currentVis + 1.5)
                }
            };
            break;
        }

        case EVENTS.TASK_COMPLETED: {
            const { domain = 'os', taskTitle, level } = payload;

            // Major Boosts
            const layer = newState.cognitiveLayers[domain];
            newState.cognitiveLayers = {
                ...newState.cognitiveLayers,
                [domain]: {
                    ...layer,
                    conceptual: Math.min(100, layer.conceptual + 5),
                    operational: Math.min(100, layer.operational + 5)
                }
            };

            addJourneyCard(newState, 'achievement', `إنجاز: ${taskTitle}`, 'خطوة ممتازة لتعزيز الفهم العملي.');
            break;
        }

        case EVENTS.ERROR_DETECTED: {
            const { errorType, command, context } = payload;
            let title = 'تعثر بسيط';
            let insight = 'حاول التركيز أكثر.';

            if (errorType === 'syntax') {
                title = 'خطأ لغوي/تركيبي';
                insight = `الكمبيوتر دقيق جداً. تأكد من تهجئة ${command} والمسافات.`;
            } else if (errorType === 'path') {
                title = 'خطأ في المسار';
                insight = 'أنت تحاول الوصول لمكان غير موجود. استخدم ls و pwd لتتأكد من موقعك.';
            } else if (errorType === 'conceptual') {
                title = 'خطأ مفاهيمي';
                insight = 'الأداة صحيحة لكن الاستخدام في غير محله. راجع الهدف من الأمر.';
            }

            addJourneyCard(newState, 'struggle', title, insight, { errorType, command });
            break;
        }

        case EVENTS.CONCEPT_CONFUSION: {
            addJourneyCard(newState, 'struggle', 'ارتباك مفاهيمي', payload.message || 'يبدو أنك تخلط بين مفهومين. راجع النظرية.');
            break;
        }

        // --- CONTENT EVENTS ---
        case EVENTS.ARTICLE_COMPLETED: {
            const { domain, title } = payload;
            const layer = newState.cognitiveLayers[domain] || newState.cognitiveLayers.os;
            newState.cognitiveLayers = {
                ...newState.cognitiveLayers,
                [domain || 'os']: {
                    ...layer,
                    conceptual: Math.min(100, layer.conceptual + 8) // Reading boosts conceptual mostly
                }
            };
            addJourneyCard(newState, 'learning', `قراءة: ${title}`, 'القراءة تعمق الفهم النظري وتسهل التطبيق.', { type: 'article' });
            break;
        }

        case EVENTS.HINT_USED: {
            // Maybe deduct potential score or just log it
            // For now, we just log it as a neutral event or minor struggle
            break;
        }

        case EVENTS.REFLECTION_ANSWERED: {
            const { question, answer } = payload;
            addJourneyCard(newState, 'reflection', 'تأمل سيبراني', `S: ${question}\nA: ${answer}`);
            // Reflection boosts ethical score towards center (Balancing)
            const currentEthical = newState.ethicalTendency.score;
            const distToZero = 0 - currentEthical;
            const adjustment = distToZero * 0.1; // Move 10% closer to 0 (Neutral/Objective)
            newState.ethicalTendency = {
                ...newState.ethicalTendency,
                score: currentEthical + adjustment
            };
            break;
        }

        case EVENTS.NEWS_READ: {
            const { domain = 'os', title } = payload;
            const layer = newState.cognitiveLayers[domain] || newState.cognitiveLayers.os;

            // News boosts awareness (Conceptual)
            newState.cognitiveLayers = {
                ...newState.cognitiveLayers,
                [domain]: {
                    ...layer,
                    conceptual: Math.min(100, layer.conceptual + 3)
                }
            };
            addJourneyCard(newState, 'learning', `وعي: ${title}`, 'متابعة الأخبار تزيد من وعيك بالتهديدات الحالية.', { type: 'news' });
            break;
        }

        case EVENTS.THREAT_VIEWED: {
            const { domain = 'network', threatTitle } = payload;
            const layer = newState.cognitiveLayers[domain] || newState.cognitiveLayers.network;

            // Threat analysis boosts Visual & Conceptual
            newState.cognitiveLayers = {
                ...newState.cognitiveLayers,
                [domain]: {
                    ...layer,
                    conceptual: Math.min(100, layer.conceptual + 4),
                    visual: Math.min(100, layer.visual + 2)
                }
            };
            addJourneyCard(newState, 'learning', `تحليل تهديد: ${threatTitle}`, 'فهم آلية الهجوم هو الخطوة الأولى للحماية منه.', { type: 'threat' });
            break;
        }

        default: break;
    }

    // Always run rules engine after updates
    return runRulesEngine(newState);
};

export const AnalyticsProvider = ({ children }) => {
    // Persist to LocalStorage
    const [state, dispatch] = useReducer(analyticsReducer, INITIAL_STATE, (initial) => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('tucc_analytics_v3');
            return saved ? JSON.parse(saved) : initial;
        }
        return initial;
    });

    useEffect(() => {
        localStorage.setItem('tucc_analytics_v3', JSON.stringify(state));
    }, [state]);

    // Weekly Decay Logic (On Mount)
    useEffect(() => {
        const lastDecay = new Date(state.ethicalTendency.lastDecay);
        const now = new Date();
        const diffDays = (now - lastDecay) / (1000 * 60 * 60 * 24);

        if (diffDays >= 7) {
            // Apply Decay towards 0
            const currentScore = state.ethicalTendency.score;
            const newScore = currentScore * 0.8; // Decay 20%
            dispatch({
                type: 'DECAY_ETHICS',
                payload: { score: newScore, date: now.toISOString() }
            });
        }
    }, []);

    const logEvent = (type, payload) => {
        // Console log for debugging
        console.log(`[Analytics] ${type}`, payload);
        dispatch({ type, payload });
    };

    // Export cleaner API
    const value = useMemo(() => ({
        ...state,
        logEvent,
        events: EVENTS
    }), [state]);

    return (
        <AnalyticsContext.Provider value={value}>
            {children}
        </AnalyticsContext.Provider>
    );
};
