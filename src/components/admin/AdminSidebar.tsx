'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    LayoutDashboard, BarChart3, TrendingUp, FileQuestion,
    ImageIcon, Users, ArrowLeft, Crown, FileText, Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/providers/auth-provider';
import { cn } from '@/lib/utils';

const adminTabs = [
    { id: 'overview', href: '/admin/dashboard?tab=overview', icon: LayoutDashboard, label: 'Tổng quan' },
    { id: 'analytics', href: '/admin/dashboard?tab=analytics', icon: TrendingUp, label: 'Thống kê' },
    { id: 'content', href: '/admin/dashboard?tab=content', icon: FileText, label: 'Nội dung' },
    { id: 'questions', href: '/admin/dashboard?tab=questions', icon: FileQuestion, label: 'Câu hỏi' },
    { id: 'media', href: '/admin/dashboard?tab=media', icon: ImageIcon, label: 'Media' },
    { id: 'users', href: '/admin/dashboard?tab=users', icon: Users, label: 'Người dùng', superAdminOnly: true },
    { id: 'settings', href: '/admin/dashboard?tab=settings', icon: Settings, label: 'Cài đặt' },
];

interface AdminSidebarProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

export function AdminSidebar({ activeTab, onTabChange }: AdminSidebarProps) {
    const { isSuperAdmin, user } = useAuth();
    const pathname = usePathname();

    const filteredTabs = adminTabs.filter(tab =>
        !tab.superAdminOnly || isSuperAdmin
    );

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-card/80 backdrop-blur-xl border-r border-border/50 z-40 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-border/50">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
                        <LayoutDashboard className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="font-bold text-sm">Admin Panel</h1>
                        <p className="text-xs text-muted-foreground">Quản trị hệ thống</p>
                    </div>
                </div>

                {/* User info */}
                {user && (
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                        {user.avatar ? (
                            <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                <Crown className="w-4 h-4 text-amber-400" />
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{user.name}</p>
                            <p className="text-xs text-muted-foreground">
                                {isSuperAdmin ? 'Super Admin' : 'Admin'}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
                {filteredTabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;

                    return (
                        <motion.button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            whileHover={{ x: 4 }}
                            whileTap={{ scale: 0.98 }}
                            className={cn(
                                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors",
                                "hover:bg-primary/10",
                                isActive
                                    ? "bg-primary/15 text-primary font-medium"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <Icon className={cn("w-5 h-5", isActive && "text-primary")} />
                            <span className="text-sm">{tab.label}</span>
                            {tab.superAdminOnly && (
                                <Crown className="w-3 h-3 text-amber-400 ml-auto" />
                            )}
                        </motion.button>
                    );
                })}
            </nav>

            {/* Back to site */}
            <div className="p-4 border-t border-border/50">
                <Link href="/">
                    <Button variant="outline" className="w-full gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Về trang chủ
                    </Button>
                </Link>
            </div>
        </aside>
    );
}
