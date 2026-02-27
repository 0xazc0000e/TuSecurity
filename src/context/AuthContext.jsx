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
            // 1. Try to restore from localStorage for immediate (though potentially stale) UI
            try {
                const savedUser = localStorage.getItem('user');
                const savedAuth = localStorage.getItem('isAuthenticated');
                if (savedUser && savedAuth === 'true') {
                    const parsedUser = JSON.parse(savedUser);
                    setUser(parsedUser);
                    setIsAuthenticated(true);
                }
            } catch (err) {
                console.warn('Failed to parse saved user:', err);
            }

            // 2. Refresh from server for absolute truth
            await fetchProfile();
        };

        initAuth();
    }, []);

    // Fetch user profile from real API
    const fetchProfile = useCallback(async () => {
        try {
            const data = await apiCall('/auth/profile');
            const normalizedUser = {
                ...data,
                role: data.role?.toUpperCase() || 'STUDENT'
            };
            setUser(normalizedUser);
            setIsAuthenticated(true);

            // Sync to localStorage
            localStorage.setItem('user', JSON.stringify(normalizedUser));
            localStorage.setItem('isAuthenticated', 'true');
        } catch (error) {
            console.error('Failed to fetch profile:', error);
            // ONLY logout if it's an auth error, not a network error
            if (error.data?.status === 401 || error.message.includes('401')) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                localStorage.removeItem('isAuthenticated');
                setUser(null);
                setIsAuthenticated(false);
            }
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
