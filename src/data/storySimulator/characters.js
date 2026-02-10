/**
 * SmartGrid Incident Simulator - Characters Data
 * الشخصيات الأساسية في المحاكي القصصي
 */

export const CHARACTERS = {
    layla: {
        id: 'layla',
        name: { ar: 'ليلى', en: 'Layla' },
        role: { ar: 'قائدة فريق الدفاع', en: 'SOC Lead' },
        signature: 'لا تتسرع… افهم أولاً.',
        appearsFor: 'defender',
        personality: 'strategic',
        avatar: {
            emoji: '👩‍💼',
            color: '#3B82F6', // Blue
            badge: 'SOC'
        },
        dialogues: {
            greeting: 'مرحباً. أنا ليلى، قائدة فريق الأمن السيبراني. مهمتنا هي حماية الشبكة دون إثارة الذعر.',
            thinking: 'دعني أفكر في هذا...',
            warning: 'انتبه! هذا القرار قد يكون له عواقب.',
            success: 'ممتاز! هذا بالضبط ما كنت سأفعله.',
            failure: 'لا بأس، الأخطاء فرص للتعلم. دعنا نحاول مجدداً.'
        }
    },

    salem: {
        id: 'salem',
        name: { ar: 'سالم', en: 'Salem' },
        role: { ar: 'محلل الشبكات', en: 'Network Analyst' },
        appearsFor: 'both',
        personality: 'analytical',
        avatar: {
            emoji: '👨‍💻',
            color: '#10B981', // Green
            badge: 'NET'
        },
        dialogues: {
            analyzing: 'أحلل البيانات الآن...',
            pattern: 'هذا النمط غير طبيعي. شاهد الرسم البياني.',
            caution: 'تذكر: الشبكات لا تكذب، لكنها قد تُضلل.',
            tip: 'نصيحة محترف: راقب التوقيت، وليس فقط الحجم.'
        }
    },

    rashed: {
        id: 'rashed',
        name: { ar: 'راشد', en: 'Rashed' },
        role: { ar: 'موظف - قسم المالية', en: 'Finance Department Employee' },
        device: 'EMP-17-LAPTOP',
        appearsFor: 'both',
        personality: 'nervous',
        avatar: {
            emoji: '👨‍💼',
            color: '#F59E0B', // Orange
            badge: 'EMP'
        },
        dialogues: {
            confused: 'أنا لا أفهم ماذا يحدث... لماذا جهازي بطيء جداً؟',
            worried: 'هل فعلت شيئاً خاطئاً؟',
            defensive: 'أنا فقط فتحت المرفق الذي أرسله لي المدير المالي!'
        }
    },

    shadow: {
        id: 'shadow',
        name: { ar: 'الظل', en: 'Shadow' },
        role: { ar: 'خصم افتراضي', en: 'Adversary' },
        signature: 'الأبواب ليست مغلقة كما تظن.',
        appearsFor: 'attacker',
        personality: 'mysterious',
        avatar: {
            emoji: '🎭',
            color: '#DC2626', // Red
            badge: '???'
        },
        dialogues: {
            hint: 'ابحث عن النافذة، وليس الباب.',
            challenge: 'الأنظمة تثق بالمستخدمين... هذا ضعفها.',
            cryptic: 'الوقت ليس عدوك، بل التسرع.'
        }
    },

    noura: {
        id: 'noura',
        name: { ar: 'نورة', en: 'Noura' },
        role: { ar: 'مدققة الأخلاقيات', en: 'Ethics Officer' },
        appearsFor: 'both',
        triggeredBy: 'critical_decisions',
        personality: 'ethical',
        avatar: {
            emoji: '⚖️',
            color: '#8B5CF6', // Purple
            badge: 'ETH'
        },
        dialogues: {
            reminder: 'تذكر: الهدف هو الحماية، وليس الانتقام.',
            boundary: 'هذا القرار يتجاوز الحدود الأخلاقية. فكّر مجدداً.',
            approval: 'هذا قرار مسؤول ومهني.',
            warning: 'كل إجراء له عواقب على أشخاص حقيقيين.'
        }
    }
};

/**
 * Helper function to get character dialogue
 */
export const getCharacterDialogue = (characterId, dialogueKey, customText) => {
    const character = CHARACTERS[characterId];
    if (!character) return null;

    return {
        character: character,
        text: customText || character.dialogues[dialogueKey] || '',
        timestamp: new Date().toISOString()
    };
};

/**
 * Helper to check if character should appear for given role
 */
export const shouldCharacterAppear = (characterId, playerRole) => {
    const character = CHARACTERS[characterId];
    if (!character) return false;

    return character.appearsFor === 'both' || character.appearsFor === playerRole;
};
