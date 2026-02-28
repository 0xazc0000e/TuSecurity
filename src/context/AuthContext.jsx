import { apiCall } from '../services/api';

// Create Auth Context
const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // User needs onboarding if authenticated but missing bio (profile not completed)
    const needsOnboarding = isAuthenticated && user && !user.bio;

    // Initialization effect
    useEffect(() => {
        const initAuth = async () => {
            try {
                setLoading(true);
                // 1. Try to restore from localStorage for immediate state (optional, but keep it for UI responsiveness)
                const savedUser = localStorage.getItem('user');
                const savedAuth = localStorage.getItem('isAuthenticated');
                const token = localStorage.getItem('token');

                if (token && savedUser && savedAuth === 'true') {
                    try {
                        const parsedUser = JSON.parse(savedUser);
                        setUser(parsedUser);
                        setIsAuthenticated(true);
                    } catch (e) {
                        console.warn('[AuthContext] Stale user data in localStorage');
                    }
                }

                // 2. Always validate with server if token exists
                if (token) {
                    await fetchProfile();
                } else {
                    // No token, definitely not authenticated
                    setIsAuthenticated(false);
                    setUser(null);
                    setLoading(false);
                }
            } catch (err) {
                console.error('[AuthContext] Initialization failed:', err);
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    // Fetch user profile from real API
    const fetchProfile = useCallback(async () => {
        try {
            console.log('[AuthContext] Fetching fresh profile...');
            const data = await apiCall('/auth/profile');

            if (!data || typeof data !== 'object') {
                throw new Error('Invalid profile data received');
            }

            const normalizedUser = {
                ...data,
                role: (data.role || 'STUDENT').toUpperCase(),
                email: data.email?.toLowerCase() || ''
            };

            console.log(`[AuthContext] Profile fetched. Role: ${normalizedUser.role}`);
            setUser(normalizedUser);
            setIsAuthenticated(true);

            // Sync to localStorage
            localStorage.setItem('user', JSON.stringify(normalizedUser));
            localStorage.setItem('isAuthenticated', 'true');
        } catch (error) {
            console.error('[AuthContext] Failed to fetch profile:', error);

            // Clear state ONLY on explicit 401/403 (unauthorized)
            const isAuthError = error.data?.status === 401 ||
                error.message?.includes('401') ||
                error.data?.status === 403;

            if (isAuthError) {
                console.warn('[AuthContext] Session invalid. Clearing state.');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                localStorage.removeItem('isAuthenticated');
                setUser(null);
                setIsAuthenticated(false);
            }
            // For network errors, we might keep the stale user from localStorage
        } finally {
            setLoading(false);
        }
    }, []);

    // Login function - POST to real backend
    const login = async (email, password) => {
        try {
            const data = await apiCall('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });

            const normalizedUser = {
                ...data.user,
                role: data.user.role?.toUpperCase() || 'STUDENT'
            };

            // Store token and user data immediately
            if (data.token) {
                localStorage.setItem('token', data.token);
            }
            localStorage.setItem('user', JSON.stringify(normalizedUser));
            localStorage.setItem('isAuthenticated', 'true');

            setUser(normalizedUser);
            setIsAuthenticated(true);
            return { success: true, user: normalizedUser };
        } catch (error) {
            // Check for connection error (Render cold start)
            const isConnectionError = error.message?.includes('الاتصال بالخادم') ||
                error.message?.includes('fetch') ||
                error.name === 'TypeError';

            if (isConnectionError) {
                return {
                    success: false,
                    isColdStart: true,
                    error: 'السيرفر قيد التشغيل حالياً (يستغرق هذا حوالي 50 ثانية في الخطة المجانية). يرجى الانتظار لحظة والمحاولة مرة أخرى.'
                };
            }

            // Check for verification requirement in error data
            if (error.data && error.data.requiresVerification) {
                return {
                    success: false,
                    requiresVerification: true,
                    userId: error.data.userId,
                    email: error.data.email,
                    error: error.data.message || 'يرجى تأكيد البريد الإلكتروني'
                };
            }
            return { success: false, error: error.message || 'فشل تسجيل الدخول' };
        }
    };

    // Register function - POST to real backend
    const register = async ({ username, email, password, universityId }) => {
        try {
            // Send username as fullName as well since the form is unified
            const data = await apiCall('/auth/register', {
                method: 'POST',
                body: JSON.stringify({
                    username,
                    fullName: username, // Map username to fullName
                    email,
                    password,
                    university_id: universityId,
                    role: 'student'
                })
            });

            // Registration usually returns 201 with requiresVerification = true
            // It DOES NOT return a token yet.
            if (data.requiresVerification) {
                return {
                    success: true,
                    requiresVerification: true,
                    userId: data.userId,
                    email: data.email,
                    message: data.message
                };
            }

            // Fallback for immediate login (if configured that way)
            if (data.token) {
                const normalizedUser = {
                    ...data.user,
                    role: data.user.role?.toUpperCase() || 'STUDENT'
                };
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(normalizedUser));
                localStorage.setItem('isAuthenticated', 'true');
                setUser(normalizedUser);
                setIsAuthenticated(true);
            }

            return { success: true, user: data.user };
        } catch (error) {
            return { success: false, error: error.message || 'فشل إنشاء الحساب' };
        }
    };

    // Logout function - call backend to clear cookie
    const logout = async () => {
        try {
            await apiCall('/auth/logout', { method: 'POST' });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('isAuthenticated');
            setUser(null);
            setIsAuthenticated(false);
        }
    };

    // Update profile - PUT to real backend
    const updateProfile = async (profileData) => {
        try {
            const isFormData = profileData instanceof FormData;
            const data = await apiCall('/auth/profile', {
                method: 'PUT',
                body: isFormData ? profileData : JSON.stringify(profileData)
            });
            // Use the returned user object directly if available
            if (data.user) {
                const normalizedUser = {
                    ...data.user,
                    role: data.user.role?.toUpperCase() || 'STUDENT'
                };
                setUser(normalizedUser);
                localStorage.setItem('user', JSON.stringify(normalizedUser));
            } else {
                await fetchProfile();
            }
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message || 'فشل تحديث الملف الشخصي' };
        }
    };

    const value = {
        user,
        isAuthenticated,
        loading,
        needsOnboarding,
        login,
        register,
        logout,
        updateProfile,
        fetchProfile,
        apiCall
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
