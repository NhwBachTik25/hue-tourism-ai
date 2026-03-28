// Admin authentication configuration
// Default credentials stored here - CHANGE IN PRODUCTION

export const ADMIN_CREDENTIALS = {
    username: 'admin_phu_vinh',
    password: 'PhuVinh@KHKT2025',
};

export const AUTH_CONFIG = {
    sessionKey: 'phu-vinh-admin-session',
    sessionDuration: 24 * 60 * 60 * 1000, // 24 hours
};

export interface AdminSession {
    isAuthenticated: boolean;
    loginTime: number;
    expiresAt: number;
}

export function createSession(): AdminSession {
    const now = Date.now();
    return {
        isAuthenticated: true,
        loginTime: now,
        expiresAt: now + AUTH_CONFIG.sessionDuration,
    };
}

export function validateSession(session: AdminSession | null): boolean {
    if (!session) return false;
    if (!session.isAuthenticated) return false;
    if (Date.now() > session.expiresAt) return false;
    return true;
}

export function getStoredSession(): AdminSession | null {
    if (typeof window === 'undefined') return null;
    try {
        const stored = localStorage.getItem(AUTH_CONFIG.sessionKey);
        if (!stored) return null;
        return JSON.parse(stored);
    } catch {
        return null;
    }
}

export function saveSession(session: AdminSession): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(AUTH_CONFIG.sessionKey, JSON.stringify(session));
}

export function clearSession(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(AUTH_CONFIG.sessionKey);
}

export function verifyCredentials(username: string, password: string): boolean {
    return username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password;
}
