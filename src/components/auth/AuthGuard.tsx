'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2, ShieldAlert } from 'lucide-react';
import { useAuth } from '@/components/providers/auth-provider';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface AuthGuardProps {
    children: React.ReactNode;
}

// Pages that don't require authentication
const publicPaths = ['/login', '/signup'];

// Admin-only paths
const adminPaths = ['/admin'];

export function AuthGuard({ children }: AuthGuardProps) {
    // Auth checking disabled - all pages accessible without login
    // To re-enable authentication, uncomment the original code below
    return <>{children}</>;

    /*
    // --- Original auth checking code (commented out) ---
    const { isAuthenticated, isLoading, canAccessAdmin } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [isChecking, setIsChecking] = useState(true);
    const [accessDenied, setAccessDenied] = useState(false);

    useEffect(() => {
        if (isLoading) return;
        const isPublicPath = publicPaths.some(path => pathname.startsWith(path));
        const isAdminPath = adminPaths.some(path => pathname.startsWith(path));
        if (isAdminPath) {
            if (!isAuthenticated) {
                if (typeof window !== 'undefined') {
                    sessionStorage.setItem('auth-redirect', pathname);
                }
                router.push('/login');
            } else if (!canAccessAdmin) {
                setAccessDenied(true);
                setIsChecking(false);
            } else {
                setIsChecking(false);
            }
        } else if (!isAuthenticated && !isPublicPath) {
            if (typeof window !== 'undefined') {
                sessionStorage.setItem('auth-redirect', pathname);
            }
            router.push('/login');
        } else {
            setIsChecking(false);
        }
    }, [isAuthenticated, isLoading, canAccessAdmin, pathname, router]);

    if (accessDenied) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="fixed inset-0 flex items-center justify-center bg-background z-50 p-4"
            >
                <div className="text-center max-w-md">
                    <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
                        <ShieldAlert className="w-10 h-10 text-red-400" />
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Không có quyền truy cập</h1>
                    <p className="text-muted-foreground mb-6">
                        Bạn cần có quyền Admin để truy cập trang này.
                    </p>
                    <div className="flex gap-3 justify-center">
                        <Link href="/"><Button>Về trang chủ</Button></Link>
                    </div>
                </div>
            </motion.div>
        );
    }

    if (isLoading || isChecking) {
        const isPublicPath = publicPaths.some(path => pathname.startsWith(path));
        if (isPublicPath) return <>{children}</>;
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="fixed inset-0 flex items-center justify-center bg-background z-50"
            >
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">Đang kiểm tra đăng nhập...</p>
                </div>
            </motion.div>
        );
    }

    return <>{children}</>;
    */
}

// Hook to get redirect path after login
export function useAuthRedirect() {
    const getRedirectPath = (): string => {
        if (typeof window === 'undefined') return '/';
        const saved = sessionStorage.getItem('auth-redirect');
        if (saved) {
            sessionStorage.removeItem('auth-redirect');
            return saved;
        }
        return '/';
    };

    return { getRedirectPath };
}
