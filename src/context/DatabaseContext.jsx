import React, { createContext, useContext, useReducer, useEffect } from 'react';

// === INITIAL SEED DATA (Production Ready) ===
const SEED_DATA = {
    users: [
        { id: 'u1', name: 'أحمد محمد', email: 'ahmed@tu.edu.sa', role: 'student', status: 'active', progress: 65, joinedAt: '2025-12-01', skills: { linux: 45, network: 30 } },
        { id: 'u2', name: 'سارة العتيبي', email: 'sara@tu.edu.sa', role: 'admin', status: 'active', progress: 92, joinedAt: '2025-11-15', skills: { linux: 90, network: 85 } },
        { id: 'u3', name: 'خaled Omar', email: 'khaled@tu.edu.sa', role: 'student', status: 'suspended', progress: 12, joinedAt: '2026-01-10', skills: { linux: 10, network: 5 } },
    ],
    news: [
        { id: 'n1', title: 'اكتشاف ثغرة Zero-Day في أنظمة Linux', category: 'threats', date: '2026-01-30', views: 1240, urgent: true },
        { id: 'n2', title: 'تحديث جديد لأداة Wireshark يدعم بروتوكولات IoT', category: 'tools', date: '2026-01-29', views: 850, urgent: false },
        { id: 'n3', title: 'نادي الأمن السيبراني يطلق معسكر "الاختراق الأخلاقي"', category: 'events', date: '2026-01-28', views: 2100, urgent: false },
    ],
    articles: [
        { id: 'a1', title: 'مقدمة في الهندسة الاجتماعية', author: 'د. فهد', category: 'psychology', readTime: '5 min', views: 540, status: 'published' },
        { id: 'a2', title: 'شرح أوامر Bash الأساسية', author: 'أ. نورة', category: 'linux', readTime: '10 min', views: 1200, status: 'published' },
    ],
    threats: [
        { id: 't1', name: 'WannaCry Ransomware', type: 'Ransomware', risk: 'High', discovered: '2017', desc: 'فيروس فدية استهدف أنظمة ويندوز...' },
        { id: 't2', name: 'Log4Shell', type: 'RCE', risk: 'Critical', discovered: '2021', desc: 'ثغرة في مكتبة Log4j تسمح بتنفيذ الأكواد...' },
    ],
    simulators: [
        { id: 'bash', name: 'Bash Terminal', type: 'terminal', status: 'active', difficulty: 'Beginner', successRate: 85, tasks: [] },
        { id: 'network', name: 'Network Scanner', type: 'gui', status: 'active', difficulty: 'Intermediate', successRate: 70, tasks: [] },
        { id: 'crypto', name: 'Crypto Lab', type: 'tool', status: 'active', difficulty: 'Advanced', successRate: 60, tasks: [] },
    ]
};

const DatabaseContext = createContext();

export const useDatabase = () => {
    const context = useContext(DatabaseContext);
    if (!context) throw new Error('useDatabase must be used within DatabaseProvider');
    return context;
};

// === ACTIONS ===
const ACTIONS = {
    ADD_USER: 'ADD_USER',
    UPDATE_USER: 'UPDATE_USER',
    DELETE_USER: 'DELETE_USER',
    ADD_CONTENT: 'ADD_CONTENT',
    DELETE_CONTENT: 'DELETE_CONTENT',
    UPDATE_SIMULATOR: 'UPDATE_SIMULATOR',
    ADD_SIMULATOR: 'ADD_SIMULATOR'
};

const dbReducer = (state, action) => {
    switch (action.type) {
        // --- PROPER CRUD OPERATIONS ---
        case ACTIONS.ADD_USER:
            return { ...state, users: [...state.users, { ...action.payload, id: Date.now().toString() }] };

        case ACTIONS.UPDATE_USER:
            return { ...state, users: state.users.map(u => u.id === action.payload.id ? { ...u, ...action.payload } : u) };

        case ACTIONS.DELETE_USER:
            return { ...state, users: state.users.filter(u => u.id !== action.payload) };

        case ACTIONS.ADD_CONTENT:
            const { type, item } = action.payload; // type: 'news' | 'articles' | 'threats'
            return { ...state, [type]: [...state[type], { ...item, id: Date.now().toString() }] };

        case ACTIONS.DELETE_CONTENT:
            const { contentType, itemId } = action.payload;
            return { ...state, [contentType]: state[contentType].filter(i => i.id !== itemId) };

        case ACTIONS.UPDATE_SIMULATOR:
            return { ...state, simulators: state.simulators.map(s => s.id === action.payload.id ? { ...s, ...action.payload } : s) };

        case ACTIONS.ADD_SIMULATOR:
            return { ...state, simulators: [...state.simulators, { ...action.payload, id: action.payload.name.toLowerCase().replace(/\s/g, '_'), status: 'active' }] };

        default:
            return state;
    }
};

export const DatabaseProvider = ({ children }) => {
    // Persist to LocalStorage to simulate Real DB
    const [state, dispatch] = useReducer(dbReducer, SEED_DATA, (initial) => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('tucc_db_v1');
            return saved ? JSON.parse(saved) : initial;
        }
        return initial;
    });

    useEffect(() => {
        localStorage.setItem('tucc_db_v1', JSON.stringify(state));
    }, [state]);

    // Convenience Wrappers for Admin Actions
    const adminActions = {
        addUser: (user) => dispatch({ type: ACTIONS.ADD_USER, payload: user }),
        updateUser: (id, data) => dispatch({ type: ACTIONS.UPDATE_USER, payload: { id, ...data } }),
        deleteUser: (id) => dispatch({ type: ACTIONS.DELETE_USER, payload: id }),

        addContent: (type, item) => dispatch({ type: ACTIONS.ADD_CONTENT, payload: { type, item } }),
        deleteContent: (type, id) => dispatch({ type: ACTIONS.DELETE_CONTENT, payload: { contentType: type, itemId: id } }),

        toggleSimulator: (id) => {
            const sim = state.simulators.find(s => s.id === id);
            if (sim) dispatch({ type: ACTIONS.UPDATE_SIMULATOR, payload: { ...sim, status: sim.status === 'active' ? 'maintenance' : 'active' } });
        },
        registerSimulator: (config) => dispatch({ type: ACTIONS.ADD_SIMULATOR, payload: config })
    };

    return (
        <DatabaseContext.Provider value={{ ...state, ...adminActions }}>
            {children}
        </DatabaseContext.Provider>
    );
};
