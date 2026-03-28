// User authentication service with role-based permissions
// Stores user data in localStorage for demo purposes

// User roles with permission levels
export type UserRole = 'superadmin' | 'admin' | 'user';

export interface User {
    id: string;
    email: string;
    name: string;
    password: string; // In production, this would be hashed
    createdAt: string;
    avatar?: string;
    role: UserRole;
}

export interface UserSession {
    userId: string;
    email: string;
    name: string;
    avatar?: string;
    role: UserRole;
    isAuthenticated: boolean;
    loginTime: number;
    expiresAt: number;
    rememberMe: boolean;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
}

export interface LoginData {
    email: string;
    password: string;
    rememberMe?: boolean;
}

export interface AuthResult {
    success: boolean;
    message: string;
    user?: Omit<User, 'password'>;
}

const USERS_STORAGE_KEY = 'phu-vinh-users';
const SESSION_STORAGE_KEY = 'phu-vinh-user-session';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours
const SESSION_DURATION_REMEMBER = 30 * 24 * 60 * 60 * 1000; // 30 days

// Pre-seeded Super Admin account
const SUPER_ADMIN: User = {
    id: 'superadmin_001',
    email: 'admin@phu-vinh.vn',
    name: 'Super Admin',
    password: 'admin123456', // In production, use proper hashing
    createdAt: '2026-01-01T00:00:00.000Z',
    role: 'superadmin',
    avatar: `data:image/svg+xml,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
            <defs>
                <linearGradient id="adminGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#f59e0b"/>
                    <stop offset="100%" style="stop-color:#ef4444"/>
                </linearGradient>
            </defs>
            <circle cx="20" cy="20" r="20" fill="url(#adminGrad)"/>
            <text x="20" y="26" text-anchor="middle" font-size="18" font-weight="bold" fill="white" font-family="system-ui">👑</text>
        </svg>
    `)}`,
};

// Generate unique ID
function generateId(): string {
    return 'user_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

// Generate avatar URL based on name and role
function generateAvatar(name: string, role: UserRole = 'user'): string {
    const initial = name.charAt(0).toUpperCase();
    const colors: Record<UserRole, string> = {
        superadmin: '#f59e0b',
        admin: '#8b5cf6',
        user: '#10b981',
    };
    const color = colors[role];
    return `data:image/svg+xml,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="20" fill="${color}"/>
            <text x="20" y="26" text-anchor="middle" font-size="18" font-weight="bold" fill="white" font-family="system-ui">${initial}</text>
        </svg>
    `)}`;
}

// Role permission helpers
export const rolePermissions = {
    canAccessAdmin: (role: UserRole): boolean => role === 'superadmin' || role === 'admin',
    canManageUsers: (role: UserRole): boolean => role === 'superadmin',
    canManageAdmins: (role: UserRole): boolean => role === 'superadmin',
    canDeleteContent: (role: UserRole): boolean => role === 'superadmin' || role === 'admin',
    canUploadContent: (role: UserRole): boolean => role === 'superadmin' || role === 'admin',
    canViewStats: (role: UserRole): boolean => role === 'superadmin' || role === 'admin',
};

export const roleLabels: Record<UserRole, { vi: string; en: string; color: string }> = {
    superadmin: { vi: 'Quản trị viên cao cấp', en: 'Super Admin', color: '#f59e0b' },
    admin: { vi: 'Quản trị viên', en: 'Admin', color: '#8b5cf6' },
    user: { vi: 'Người dùng', en: 'User', color: '#10b981' },
};

class UserAuthService {
    private users: User[] = [];
    private isLoaded = false;

    constructor() {
        if (typeof window !== 'undefined') {
            this.loadUsers();
        }
    }

    private loadUsers() {
        try {
            const stored = localStorage.getItem(USERS_STORAGE_KEY);
            if (stored) {
                this.users = JSON.parse(stored);
            }

            // Ensure super admin exists
            this.ensureSuperAdmin();

            this.isLoaded = true;
        } catch {
            this.users = [];
            this.ensureSuperAdmin();
            this.isLoaded = true;
        }
    }

    private ensureSuperAdmin() {
        const superAdminExists = this.users.some(
            u => u.email.toLowerCase() === SUPER_ADMIN.email.toLowerCase() && u.role === 'superadmin'
        );

        if (!superAdminExists) {
            // Remove any existing account with same email
            this.users = this.users.filter(u => u.email.toLowerCase() !== SUPER_ADMIN.email.toLowerCase());
            // Add super admin
            this.users.unshift(SUPER_ADMIN);
            this.saveUsers();
        }
    }

    private saveUsers() {
        if (typeof window === 'undefined') return;
        try {
            localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(this.users));
        } catch {
            console.error('Failed to save users');
        }
    }

    // Register new user (always as 'user' role)
    register(data: RegisterData): AuthResult {
        if (typeof window === 'undefined') {
            return { success: false, message: 'Không thể đăng ký trên server' };
        }

        if (!this.isLoaded) this.loadUsers();

        // Validation
        if (!data.name.trim()) {
            return { success: false, message: 'Vui lòng nhập họ tên' };
        }
        if (!data.email.trim()) {
            return { success: false, message: 'Vui lòng nhập email' };
        }
        if (!this.isValidEmail(data.email)) {
            return { success: false, message: 'Email không hợp lệ' };
        }
        if (data.password.length < 6) {
            return { success: false, message: 'Mật khẩu phải có ít nhất 6 ký tự' };
        }

        // Check if email exists
        if (this.users.some(u => u.email.toLowerCase() === data.email.toLowerCase())) {
            return { success: false, message: 'Email đã được sử dụng' };
        }

        // Create new user with 'user' role
        const newUser: User = {
            id: generateId(),
            email: data.email.toLowerCase().trim(),
            name: data.name.trim(),
            password: data.password,
            createdAt: new Date().toISOString(),
            avatar: generateAvatar(data.name, 'user'),
            role: 'user',
        };

        this.users.push(newUser);
        this.saveUsers();

        // Send email confirmation (demo mode - logs to console)
        this.sendEmailConfirmation(newUser.email, newUser.name);

        this.trackUserEvent('register', newUser.id);

        const { password: _, ...userWithoutPassword } = newUser;
        return {
            success: true,
            message: 'Đăng ký thành công! Email xác nhận đã được gửi.',
            user: userWithoutPassword,
        };
    }

    // Email confirmation stub (demo mode)
    private sendEmailConfirmation(email: string, name: string): void {
        console.log('📧 [EMAIL SERVICE - DEMO MODE]');
        console.log(`To: ${email}`);
        console.log(`Subject: Xác nhận tài khoản - Du lịch Phú Vinh AI`);
        console.log(`Content: Xin chào ${name}, cảm ơn bạn đã đăng ký tài khoản!`);
        console.log('---');
        // In production, integrate with actual email service (SendGrid, Mailgun, etc.)
    }

    // Login user
    login(data: LoginData): AuthResult {
        if (typeof window === 'undefined') {
            return { success: false, message: 'Không thể đăng nhập trên server' };
        }

        if (!this.isLoaded) this.loadUsers();

        const user = this.users.find(
            u => u.email.toLowerCase() === data.email.toLowerCase() && u.password === data.password
        );

        if (!user) {
            return { success: false, message: 'Email hoặc mật khẩu không đúng' };
        }

        // Create session with role
        const now = Date.now();
        const duration = data.rememberMe ? SESSION_DURATION_REMEMBER : SESSION_DURATION;
        const session: UserSession = {
            userId: user.id,
            email: user.email,
            name: user.name,
            avatar: user.avatar,
            role: user.role,
            isAuthenticated: true,
            loginTime: now,
            expiresAt: now + duration,
            rememberMe: data.rememberMe || false,
        };

        this.saveSession(session);
        this.trackUserEvent('login', user.id);

        const { password: _, ...userWithoutPassword } = user;
        return {
            success: true,
            message: 'Đăng nhập thành công!',
            user: userWithoutPassword,
        };
    }

    // Logout user
    logout(): void {
        if (typeof window === 'undefined') return;
        const session = this.getSession();
        if (session) {
            this.trackUserEvent('logout', session.userId);
        }
        localStorage.removeItem(SESSION_STORAGE_KEY);
    }

    // Get current session
    getSession(): UserSession | null {
        if (typeof window === 'undefined') return null;
        try {
            const stored = localStorage.getItem(SESSION_STORAGE_KEY);
            if (!stored) return null;

            const session: UserSession = JSON.parse(stored);

            // Check if session expired
            if (Date.now() > session.expiresAt) {
                this.logout();
                return null;
            }

            return session;
        } catch {
            return null;
        }
    }

    private saveSession(session: UserSession): void {
        if (typeof window === 'undefined') return;
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    }

    // Get current user
    getCurrentUser(): Omit<User, 'password'> | null {
        const session = this.getSession();
        if (!session) return null;

        if (!this.isLoaded) this.loadUsers();

        const user = this.users.find(u => u.id === session.userId);
        if (!user) return null;

        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    // Check if authenticated
    isAuthenticated(): boolean {
        return this.getSession() !== null;
    }

    // Get current user role
    getCurrentRole(): UserRole | null {
        const session = this.getSession();
        return session?.role || null;
    }

    // Check if current user can access admin
    canAccessAdmin(): boolean {
        const role = this.getCurrentRole();
        return role ? rolePermissions.canAccessAdmin(role) : false;
    }

    // Check if current user is super admin
    isSuperAdmin(): boolean {
        return this.getCurrentRole() === 'superadmin';
    }

    // Update user role (only super admin can do this)
    updateUserRole(targetUserId: string, newRole: UserRole): AuthResult {
        if (!this.isSuperAdmin()) {
            return { success: false, message: 'Chỉ Super Admin mới có quyền thay đổi vai trò' };
        }

        if (!this.isLoaded) this.loadUsers();

        const targetUser = this.users.find(u => u.id === targetUserId);
        if (!targetUser) {
            return { success: false, message: 'Không tìm thấy người dùng' };
        }

        // Cannot change super admin role
        if (targetUser.role === 'superadmin') {
            return { success: false, message: 'Không thể thay đổi vai trò của Super Admin' };
        }

        // Cannot promote to superadmin
        if (newRole === 'superadmin') {
            return { success: false, message: 'Không thể tạo thêm Super Admin' };
        }

        targetUser.role = newRole;
        targetUser.avatar = generateAvatar(targetUser.name, newRole);
        this.saveUsers();

        this.trackUserEvent(`role_change_${newRole}`, targetUserId);

        const { password: _, ...userWithoutPassword } = targetUser;
        return {
            success: true,
            message: `Đã cập nhật vai trò thành ${roleLabels[newRole].vi}`,
            user: userWithoutPassword,
        };
    }

    // Validate email format
    private isValidEmail(email: string): boolean {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Track user events for analytics
    private trackUserEvent(event: string, userId: string) {
        try {
            const key = 'phu-vinh-user-events';
            const stored = localStorage.getItem(key);
            const events = stored ? JSON.parse(stored) : [];
            events.push({
                event,
                userId,
                timestamp: new Date().toISOString(),
            });
            localStorage.setItem(key, JSON.stringify(events.slice(-1000)));
        } catch {
            // Ignore errors
        }
    }

    // Get user count for admin stats
    getUserCount(): number {
        if (!this.isLoaded) this.loadUsers();
        return this.users.length;
    }

    // Get users by role
    getUsersByRole(role: UserRole): Omit<User, 'password'>[] {
        if (!this.isLoaded) this.loadUsers();
        return this.users
            .filter(u => u.role === role)
            .map(({ password: _, ...user }) => user);
    }

    // Get all users for admin (without passwords)
    getAllUsers(): Omit<User, 'password'>[] {
        if (!this.isLoaded) this.loadUsers();
        return this.users.map(({ password: _, ...user }) => user);
    }

    // Get all users with role info for admin management
    getAllUsersWithRoles(): Array<Omit<User, 'password'> & { roleLabel: string; roleColor: string }> {
        if (!this.isLoaded) this.loadUsers();
        return this.users.map(({ password: _, ...user }) => ({
            ...user,
            roleLabel: roleLabels[user.role].vi,
            roleColor: roleLabels[user.role].color,
        }));
    }
}

// Singleton instance
export const userAuth = new UserAuthService();
