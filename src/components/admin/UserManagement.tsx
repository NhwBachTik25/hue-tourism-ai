'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Users, Crown, Shield, User, Search,
    ChevronUp, ChevronDown, AlertCircle, CheckCircle2
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { userAuth, UserRole, roleLabels, rolePermissions } from '@/lib/user-auth';
import { useAuth } from '@/components/providers/auth-provider';

interface UserWithRole {
    id: string;
    email: string;
    name: string;
    createdAt: string;
    avatar?: string;
    role: UserRole;
    roleLabel: string;
    roleColor: string;
}

export function UserManagement() {
    const { isSuperAdmin, refreshUser } = useAuth();
    const [users, setUsers] = useState<UserWithRole[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        loadUsers();
    }, []);

    const loadUsers = () => {
        const allUsers = userAuth.getAllUsersWithRoles();
        setUsers(allUsers);
    };

    const handleRoleChange = (userId: string, newRole: UserRole) => {
        const result = userAuth.updateUserRole(userId, newRole);
        if (result.success) {
            setMessage({ type: 'success', text: result.message });
            loadUsers();
            refreshUser();
        } else {
            setMessage({ type: 'error', text: result.message });
        }
        setTimeout(() => setMessage(null), 3000);
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getRoleIcon = (role: UserRole) => {
        switch (role) {
            case 'superadmin': return <Crown className="w-4 h-4" />;
            case 'admin': return <Shield className="w-4 h-4" />;
            default: return <User className="w-4 h-4" />;
        }
    };

    const stats = {
        total: users.length,
        superadmins: users.filter(u => u.role === 'superadmin').length,
        admins: users.filter(u => u.role === 'admin').length,
        users: users.filter(u => u.role === 'user').length,
    };

    if (!mounted) return null;

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
                    <CardContent className="pt-4 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                <Users className="w-5 h-5 text-blue-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{stats.total}</p>
                                <p className="text-xs text-muted-foreground">Tổng người dùng</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-500/20">
                    <CardContent className="pt-4 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                                <Crown className="w-5 h-5 text-amber-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{stats.superadmins}</p>
                                <p className="text-xs text-muted-foreground">Super Admin</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
                    <CardContent className="pt-4 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                                <Shield className="w-5 h-5 text-purple-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{stats.admins}</p>
                                <p className="text-xs text-muted-foreground">Admin</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
                    <CardContent className="pt-4 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                                <User className="w-5 h-5 text-green-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{stats.users}</p>
                                <p className="text-xs text-muted-foreground">Người dùng</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Message */}
            <AnimatePresence>
                {message && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`flex items-center gap-2 p-3 rounded-lg ${message.type === 'success'
                                ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                                : 'bg-red-500/10 border border-red-500/20 text-red-400'
                            }`}
                    >
                        {message.type === 'success'
                            ? <CheckCircle2 className="w-4 h-4" />
                            : <AlertCircle className="w-4 h-4" />
                        }
                        {message.text}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                    placeholder="Tìm kiếm theo tên hoặc email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                />
            </div>

            {/* User List */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        Danh sách người dùng
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {filteredUsers.map((user, index) => (
                            <motion.div
                                key={user.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    {user.avatar ? (
                                        <img
                                            src={user.avatar}
                                            alt={user.name}
                                            className="w-10 h-10 rounded-full"
                                        />
                                    ) : (
                                        <div
                                            className="w-10 h-10 rounded-full flex items-center justify-center"
                                            style={{ backgroundColor: user.roleColor + '20' }}
                                        >
                                            {getRoleIcon(user.role)}
                                        </div>
                                    )}
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="font-medium">{user.name}</p>
                                            <Badge
                                                variant="outline"
                                                style={{
                                                    borderColor: user.roleColor,
                                                    color: user.roleColor,
                                                }}
                                            >
                                                {getRoleIcon(user.role)}
                                                <span className="ml-1">{user.roleLabel}</span>
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground">{user.email}</p>
                                    </div>
                                </div>

                                {/* Role Controls - Only visible to Super Admin */}
                                {isSuperAdmin && user.role !== 'superadmin' && (
                                    <div className="flex items-center gap-2">
                                        {user.role === 'user' ? (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="gap-1 border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
                                                onClick={() => handleRoleChange(user.id, 'admin')}
                                            >
                                                <ChevronUp className="w-4 h-4" />
                                                Thăng Admin
                                            </Button>
                                        ) : (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="gap-1 border-red-500/30 text-red-400 hover:bg-red-500/10"
                                                onClick={() => handleRoleChange(user.id, 'user')}
                                            >
                                                <ChevronDown className="w-4 h-4" />
                                                Hạ xuống User
                                            </Button>
                                        )}
                                    </div>
                                )}

                                {/* Super Admin badge - cannot be changed */}
                                {user.role === 'superadmin' && (
                                    <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                                        <Crown className="w-3 h-3 mr-1" />
                                        Toàn quyền
                                    </Badge>
                                )}
                            </motion.div>
                        ))}

                        {filteredUsers.length === 0 && (
                            <p className="text-center text-muted-foreground py-8">
                                Không tìm thấy người dùng nào
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Permission Info */}
            {!isSuperAdmin && (
                <Card className="border-amber-500/20 bg-amber-500/5">
                    <CardContent className="pt-4 pb-4">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                            <div>
                                <p className="font-medium text-amber-400">Chỉ xem</p>
                                <p className="text-sm text-muted-foreground">
                                    Chỉ Super Admin mới có thể thay đổi vai trò người dùng.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
