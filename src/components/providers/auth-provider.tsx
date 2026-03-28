'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { userAuth, User, UserRole, RegisterData, LoginData, AuthResult, rolePermissions } from '@/lib/user-auth';

interface AuthContextType {
    user: Omit<User, 'password'> | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    role: UserRole | null;
    isSuperAdmin: boolean;
    canAccessAdmin: boolean;
    login: (data: LoginData) => AuthResult;
    register: (data: RegisterData) => AuthResult;
    logout: () => void;
    refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<Omit<User, 'password'> | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load user on mount
    useEffect(() => {
        const currentUser = userAuth.getCurrentUser();
        setUser(currentUser);
        setIsLoading(false);
    }, []);

    const login = useCallback((data: LoginData): AuthResult => {
        const result = userAuth.login(data);
        if (result.success && result.user) {
            setUser(result.user);
        }
        return result;
    }, []);

    const register = useCallback((data: RegisterData): AuthResult => {
        const result = userAuth.register(data);
        if (result.success && result.user) {
            // Auto-login after registration
            userAuth.login({ email: data.email, password: data.password });
            setUser(result.user);
        }
        return result;
    }, []);

    const logout = useCallback(() => {
        userAuth.logout();
        setUser(null);
    }, []);

    const refreshUser = useCallback(() => {
        const currentUser = userAuth.getCurrentUser();
        setUser(currentUser);
    }, []);

    const role = user?.role || null;
    const isSuperAdmin = role === 'superadmin';
    const canAccessAdmin = role ? rolePermissions.canAccessAdmin(role) : false;

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isLoading,
                role,
                isSuperAdmin,
                canAccessAdmin,
                login,
                register,
                logout,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
