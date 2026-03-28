import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Đăng nhập | Du lịch Phú Vinh AI',
    description: 'Đăng nhập để trải nghiệm đầy đủ tính năng du lịch Phú Vinh AI',
};

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-900/90 via-slate-900 to-emerald-900/80" />

            {/* Animated Background Pattern */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute top-0 -left-4 w-72 h-72 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" />
                <div className="absolute top-0 -right-4 w-72 h-72 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-2000" />
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-4000" />
            </div>

            {/* Floating decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {Array.from({ length: 20 }).map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-green-400/30 rounded-full animate-float"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${3 + Math.random() * 4}s`,
                        }}
                    />
                ))}
            </div>

            {/* Content */}
            <div className="relative z-10 w-full max-w-md px-4">
                {children}
            </div>

            {/* Bottom branding */}
            <div className="absolute bottom-4 left-0 right-0 text-center text-sm text-white/40">
                © 2026 Du lịch Phú Vinh AI
            </div>
        </div>
    );
}
